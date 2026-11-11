---
title: Teaching Monaco to read Liquid templates and find the language under the cursor
description: A custom Monarch tokenizer for HTML with Liquid and embedded JavaScript, CSS and JSON, and completion that asks the Monaco model which language is at the cursor instead of guessing from the text.
locale: en
slug: monaco-liquid-tokenizer
published: true
date: '2026-10-21'
cover: /images/blog/monaco-liquid-tokenizer.svg
coverAlt: Diagram of one storefront template split into HTML, Liquid, JSON and CSS regions, with the editor asking the model which language is at the cursor
category: Browser editors
readingMinutes: 7
tags: [Monaco, Liquid, Tokenizer, Autocomplete]
---

Here is an ordinary piece of a storefront template:

```liquid
<a class="product-card {% if product.available %}is-available{% endif %}"
   href="{{ product.url }}">{{ product.title | escape }}</a>

<script type="application/ld+json">
  { "name": {{ product.title | json }} }
</script>
```

It has HTML, Liquid in the markup, Liquid inside an attribute value, and a `script` block that holds JSON, not JavaScript. In Monaco’s standard HTML mode, the Liquid in the markup is plain text, and the Liquid inside the attribute is colored as an ordinary string. To highlight a file like this and give suggestions in it, the editor has to know which language is in each place.

inSales is an e-commerce platform with more than 60,000 stores. Partner developers, support specialists and technically experienced store owners edit template and widget code right in the admin panel. The old CodeMirror integration didn’t highlight mixed syntax and had no context-aware suggestions and no Emmet, which expands short abbreviations into ready-made markup or CSS. So we decided to move to Monaco Editor, the engine VS Code is built on. I implemented a custom Monaco package for inSales and developed and maintained it from June 2022 to October 2025.

Monaco provides the editor itself, document models (open files together with their language) and language provider APIs, through which you add highlighting and suggestions. But Monaco knows nothing about the inSales domain, and VS Code extensions don’t work in the browser version of Monaco. So the mixed language had to be described with Monaco’s own tools.

## After Liquid, the tokenizer goes back to where it came from

In Monaco, highlighting comes from a tokenizer: it splits the text into tokens, and each piece of code gets the color of its token type. Tokenizers are written in Monarch, Monaco’s built-in declarative format. A Monarch tokenizer is a set of states. In each state, rules match a piece of text, give it a token type and can move the tokenizer to another state.

I registered a custom mixed language for HTML and Liquid and wrote its tokenizer. It tells apart HTML tags and attributes, Liquid output in `{{ … }}`, Liquid tags in `{% … %}`, Liquid comments and `raw` blocks, variables, operators, built-in filters and inSales-specific tags.

The hardest part was Liquid inside an attribute value. A value can be one Liquid expression, or plain text mixed with several Liquid pieces. After the closing `}}` or `%}`, the tokenizer has to return to the attribute value state, not highlight the rest of the line as Liquid.

Monarch has a state stack for this. A rule with `next: '@liquidOutput'` pushes a new state onto the stack, and a rule with `next: '@pop'` removes it and returns the tokenizer to the previous state:

```ts
// Simplified: closing tags, whitespace and several states are omitted
monaco.languages.setMonarchTokensProvider('liquid', {
  tokenizer: {
    root: [
      [/\{\{/, { token: 'delimiter.liquid', next: '@liquidOutput' }],
      [/\{%/, { token: 'delimiter.liquid', next: '@liquidTag' }],
      [/<[\w-]+/, { token: 'tag', next: '@tag' }],
    ],
    tag: [
      [/[\w-]+/, 'attribute.name'],
      [/="/, { token: 'attribute.value', next: '@attributeValue' }],
      [/\/?>/, { token: 'tag', next: '@pop' }],
    ],
    attributeValue: [
      [/\{\{/, { token: 'delimiter.liquid', next: '@liquidOutput' }],
      [/\{%/, { token: 'delimiter.liquid', next: '@liquidTag' }],
      [/"/, { token: 'attribute.value', next: '@pop' }],
      [/[^"{]+|\{/, 'attribute.value'],
    ],
    liquidOutput: [
      [/\}\}/, { token: 'delimiter.liquid', next: '@pop' }],
      [/\|\s*[\w-]+/, 'predefined.liquid'],
      [/[\w.]+/, 'variable.liquid'],
    ],
    // liquidTag, comments and raw follow the same pattern
  },
})
```

The same `liquidOutput` state is used in the document body and in attribute values, and the stack decides where to go back after `}}`. In the language configuration, I also set bracket pairs, auto-closing and indentation after an opening HTML tag. So the mixed file behaves like one language, not like a set of colored pieces.

## Inside script and style, another language starts

In the first version, code inside `<script>` and `<style>` wasn’t highlighted at all. So I added embedded languages to the tokenizer: JavaScript or JSON inside `<script>`, CSS inside `<style>`, and back to HTML after the closing tag. In Monarch, this is the `nextEmbedded` property: after a rule with it, the tokenizer hands the text to the embedded language until it reaches a rule with `nextEmbedded: '@pop'`.

For `script`, the `type` attribute matters: templates use regular JavaScript, `application/json`, `application/ld+json` and other values. If the `type` value is passed to the embedded language as it is, the way Monaco’s standard HTML mode does it, `application/ld+json` points to a language the package doesn’t have. The editor must not try to load a language service that doesn’t exist, so I mapped the common `type` values to supported languages explicitly and chose JavaScript for everything else:

```ts
// Simplified: only the rules for <script> are shown
tokenizer: {
  root: [
    // Until a type attribute is found, the content counts as JavaScript
    [/<script/, { token: 'tag', next: '@script.javascript' }],
    // other HTML and Liquid rules
  ],
  // The second part of the state name ($S2) holds the content language
  script: [
    [/type\s*=\s*"application\/(?:ld\+)?json"/, { token: 'attribute', switchTo: '@script.json' }],
    [/type\s*=\s*"[^"]*"/, { token: 'attribute', switchTo: '@script.javascript' }],
    [/[\w-]+(?:\s*=\s*"[^"]*")?|\s+/, 'attribute'],
    [/>/, { token: 'tag', next: '@scriptBody', nextEmbedded: '$S2' }],
    [/<\/script\s*>/, { token: 'tag', next: '@pop' }],
  ],
  scriptBody: [
    // The closing tag takes the tokenizer out of the embedded language, back to the script state
    [/<\/script\s*>/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }],
  ],
}
```

The `type` attribute comes before `>` in the opening tag, but the content language is needed exactly at `>`. So the language is kept in the second part of the state name. The rule for `type` switches `script.javascript` to `script.json`, and at `>` the value of `$S2` goes into `nextEmbedded`. Any other `type` value keeps JavaScript, so the editor never looks for a language service for an unknown type.

## Completion asks the model, not the text

Highlighting was only half of the job. When the cursor is inside `<script>`, the user needs JavaScript suggestions, not HTML tags, attributes or Liquid snippets. Inside `<style>`, CSS suggestions and Emmet should work.

For this, I registered a completion provider that returns different suggestion sets depending on the language at the cursor position. At first, the language was detected with regular expressions over the text before the cursor:

```ts
// Before (simplified): look for an unclosed <script> in the text before the cursor
const textBefore = model.getValueInRange(new monaco.Range(1, 1, position.lineNumber, position.column))
const isInsideScript = /<script\b[^>]*>(?:(?!<\/script>)[\s\S])*$/.test(textBefore)
```

This check was fragile, especially for `script` with a non-standard `type`. It sees only tags and doesn’t know that `type="application/ld+json"` means JSON. Every case the tokenizer already handled would need one more regular expression.

At the end of September 2024, I replaced it with the `model.getLanguageIdAtPosition` method. For each line, Monaco keeps the tokens and the language of each token, so it knows which embedded language is at a given position:

```ts
monaco.languages.registerCompletionItemProvider('liquid', {
  provideCompletionItems(model, position) {
    const word = model.getWordUntilPosition(position)
    const range = new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn)
    // For example, 'javascript' inside <script> and 'liquid' in regular markup
    const languageId = model.getLanguageIdAtPosition(position.lineNumber, position.column)

    return { suggestions: snippetsFor(languageId, range) }
  },
})
```

The `snippetsFor` function returns the snippets for that language. Snippets are ready-made pieces of code that are inserted by a short keyword. The package has three sets: 122 snippets for Liquid, 152 for JavaScript and 166 for CSS, 440 in total. HTML and Liquid are still one language, so the method separates the markup from embedded JavaScript and CSS, not HTML from Liquid.

Now only the tokenizer answers the question of which language is under the cursor. When a bug in an embedded language is fixed in the tokenizer, suggestions in that place become correct too.

## One package for five interfaces

At first, the editor worked only in the widget code window. The infrastructure team considered Monaco heavy and said it put a lot of load on the company’s servers, and in December 2022 they suggested moving it into a separate repository. I was asked to do it. In a new repository, I turned the package into an internal gem for the inSales Rails application and added a small API that both old admin pages and Vue interfaces use to connect the editor. By 2025, the same package was connected to five interfaces: the widget code window, the full template editor, order email templates, [Abandoned Carts](/work/abandoned-carts/) and Dialogues, where a store sets up order notifications for messengers, SMS and email. A tokenizer fix reaches all five with the next gem version. The package, workers and API are described in [the code editor case](/work/monaco-editor/).

## What I’d suggest when you add your own language to Monaco

- Keep the knowledge of which language is where in the tokenizer. A completion provider then only has to ask the model through `getLanguageIdAtPosition`, and you don’t need regular expressions over the text before the cursor.
- Plan how the tokenizer leaves nested constructs: after an embedded piece, it has to return to the state it entered from. In Monarch, the state stack does this.
- Map `type` values in embedded blocks to languages explicitly, and set a default language for everything else.
