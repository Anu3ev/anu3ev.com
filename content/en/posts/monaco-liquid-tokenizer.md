---
title: 'Teaching Monaco to read Liquid templates: the hard part is knowing the language under the cursor'
description: How a custom tokenizer for HTML with Liquid, JavaScript and CSS islands made suggestions follow the cursor, and why the editor shipped as a versioned package with a three-function browser API.
locale: en
slug: monaco-liquid-tokenizer
published: true
date: '2026-10-21'
cover: /images/blog/monaco-liquid-tokenizer.svg
coverAlt: Diagram of one storefront template split into HTML, Liquid, JSON and CSS regions, with the editor asking the model which language is at the cursor
category: Browser editors
readingMinutes: 7
tags: [Monaco, Liquid, Tokenizer, Web workers, Packaging]
---

Here is a normal piece of a storefront template:

```liquid
<a class="product-card {% if product.available %}is-available{% endif %}"
   href="{{ product.url }}">{{ product.title | escape }}</a>

<script type="application/ld+json">
  { "name": {{ product.title | json }} }
</script>
```

HTML, Liquid inside the markup, Liquid inside an attribute value, and a script block that contains JSON rather than JavaScript. Open it in Monaco's stock HTML mode and the Liquid is just text, the colors inside the attribute drift, and nothing knows that the script block holds JSON.

Mounting Monaco is the easy part. It's the editor engine behind VS Code, and it gives you models, commands and language provider APIs. What it doesn't give you is any idea that a storefront template is several languages at once. VS Code extensions don't plug into browser Monaco by themselves either. Everything had to be described with Monaco's own APIs.

At inSales, an e-commerce platform with 60,000+ merchants, partners, support engineers and technically experienced merchants edit templates right in the admin panel. The existing CodeMirror integration gave them a basic field without mixed-language highlighting, context-aware suggestions or Emmet. I built the custom Monaco build that replaced it and stayed its primary maintainer from July 2022 to October 2025.

## A tokenizer is a state machine with a memory

Monaco highlights code with Monarch, a declarative tokenizer: a set of states, each with rules that match text and can move to another state. I registered a custom language for HTML with Liquid and wrote its Monarch tokenizer. It tells apart HTML tags and attributes, Liquid output `{{ … }}`, Liquid tags `{% … %}`, comments and `raw` blocks, variables, operators, filters and inSales-specific tags.

The tricky case was Liquid inside an attribute value. A value can be one Liquid expression or plain text with several Liquid pieces in it. After the closing `}}` the editor has to return to exactly the state it came from: inside a double-quoted attribute value, not "somewhere in HTML", and not still in Liquid until the end of the line.

Monarch's state stack does this if you let it. Entering Liquid pushes a state, leaving it pops back to whoever pushed it:

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
    // liquidTag, comments, raw, script and style follow the same pattern
  },
})
```

The same `@liquidOutput` state serves the document body and attribute values, and `@pop` decides where to go back. The language configuration around it adds bracket pairs, auto-closing and indentation after an opening tag, so the mixed file behaves like one language instead of a set of colored fragments.

Real products also find things a demo page never does. One version of a regular expression in the tokenizer broke the editor completely in Safari, and the code still carries a note about why it was replaced.

## Script and style are other languages

Inside `<script>` the user needs JavaScript suggestions, not HTML attributes or Liquid snippets. Inside `<style>` they need CSS and Emmet. The tokenizer switches to an embedded language when it enters these tags and returns to HTML after the closing tag.

For scripts, the `type` attribute matters. Regular JavaScript, `application/json` and `application/ld+json` need different modes, and an unexpected value must not make Monaco try to load a language service that doesn't exist. Before I handled this, such blocks produced a stream of errors. The fix was an explicit normalization with a safe default:

```ts
const scriptLanguageByType: Record<string, string> = {
  '': 'javascript',
  'text/javascript': 'javascript',
  'application/json': 'json',
  'application/ld+json': 'json',
}

function scriptLanguage(type = '') {
  return scriptLanguageByType[type.trim().toLowerCase()] ?? 'javascript'
}
```

## Ask the model, not the text

Highlighting was half of the job. Completion had to follow the same boundaries: Liquid snippets shouldn't crowd out HTML suggestions, and HTML attributes shouldn't appear while someone is writing JavaScript.

My first version decided the context by looking backwards from the cursor for an opening and closing tag:

```ts
// Before: guess the context from the text behind the cursor
const textBefore = model.getValueInRange(new monaco.Range(1, 1, position.lineNumber, position.column))
const isInsideScript = textBefore.lastIndexOf('<script') > textBefore.lastIndexOf('</script')
```

It worked for the common case and was wrong in principle. It couldn't tell a JSON script from a JavaScript one, and every edge case the tokenizer already handled would have to be handled a second time with regular expressions. In September 2024 I replaced it with a question the model can answer, because the tokenizer has already done the work:

```ts
monaco.languages.registerCompletionItemProvider('liquid', {
  provideCompletionItems(model, position) {
    const word = model.getWordUntilPosition(position)
    const range = new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn)
    const languageId = model.getLanguageIdAtPosition(position.lineNumber, position.column)

    return { suggestions: snippetsFor(languageId, range) }
  },
})
```

Now there's one source of truth for "which language is this". If the tokenizer gets better, suggestions get better with it. The snippet sets behind `snippetsFor` cover Liquid, JavaScript and CSS (440 entries in total, partly collected from existing sets and adapted for the build), and Emmet is wired separately for HTML and SCSS so it doesn't fight the Liquid suggestions.

## Ship the editor, not a component

The editor started inside one Vue component: the widget code editor, where six files live in one workspace. Markup with Liquid, SCSS, JavaScript and three JSON files: translations, a settings schema and default values. The three JSON tabs share one language and mean completely different things, so the component chooses the language by file type, not by tab.

When the editor was needed in other screens, copying that component wasn't an option. I moved the build into its own repository. Webpack with `monaco-editor-webpack-plugin` builds one production bundle with seven Monaco language IDs and separate web worker files, inlines the fonts so asset paths can't lose them, and minifies with Terser. A Rails Engine and a Rake task deliver the bundle and workers to the asset pipeline as a versioned internal gem, and CI runs build, gem and publish to an internal registry.

Workers were the awkward part. Webpack knows the original file names, but the Rails asset pipeline publishes them under hashed URLs, so the editor could open while its language workers failed to start. A colleague wrote the worker routing that resolves the published paths and plugs them into Monaco's worker lookup.

The contract with the product is three functions on `window`:

```js
window.getMonacoInstance = () => monaco
window.monacoCreate = (container, { language, value }) =>
  monaco.editor.create(container, { ...sharedEditorOptions, language, value })
window.monacoLanguageRegisterApi = { registerLiquid, registerJavaScript, registerScss }

function registerLiquid() {
  const isRegistered = monaco.languages.getLanguages().some(({ id }) => id === 'liquid')
  if (isRegistered) return
  // register the language, configuration, tokenizer and providers once
}
```

A global API isn't what I'd pick for a modern isolated package. For an existing Rails app with an asset pipeline, it was the right contract: the build loads as an asset, and both old Rails pages and Vue screens can use it. The registration guard matters on pages where the editor is created more than once, otherwise each registration would add another copy of every provider and suggestion.

The boundary is the useful part. The package owns editing: languages, suggestions, Emmet, commands, the theme and the shared defaults (120-character wrap, automatic layout, folding, two-space indent). Each host screen owns its data, saving and preview.

## Five interfaces on one build

That boundary is why the same build ended up in five interfaces: widget code, the full storefront template editor, order email templates, cart-recovery messages and order-status notifications for email, SMS and messengers. For cart-recovery emails we replaced a WYSIWYG editor that re-encoded HTML tags and could damage the Liquid logic inside. In the communication screens, the editor sits next to a preview rendered with data from a real order or cart.

Other engineers improved the package in one place and every screen got the change: colleagues updated the theme colors and added Liquid formatting through Prettier. More details are in [the code editor case](/work/monaco-editor/).

## What I'd tell a team building a custom language in Monaco

- Put all context knowledge into the tokenizer, then ask the model. `getLanguageIdAtPosition` is cheaper to trust than any regular expression you'll write over raw text.
- Design the tokenizer around return states. Nested languages are easy to enter; most bugs are in going back to the right place.
- Map every embedded `type` value explicitly and give unknown values a safe default.
- Decide early what the package owns and what the host screen owns. That decision, not Monaco itself, is what made the editor reusable.
