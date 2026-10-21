---
title: Custom Monaco code editor for Liquid templates
description: A shared Monaco-based editor for mixed HTML, Liquid, CSS and JavaScript, used in five inSales product interfaces. I built the first integration and maintained it for more than three years.
locale: en
slug: monaco-editor
published: true
cover: /images/work/monaco-editor/widget-code-liquid-autocomplete.webp
coverAlt: Widget code editor with six file tabs showing a Liquid "for" tag suggestion inside HTML markup
category: Browser editors
year: Jul 2022 – Nov 2025
context: inSales
role: "Led development: language tooling, browser API, packaging, integrations"
stack: [Monaco Editor, JavaScript, Vue, Webpack, Web Workers, Rails Engine, GitLab CI]
featured: false
order: 7
results:
  - value: "5"
    label: "inSales product interfaces run on the same editor build"
  - value: "3+ years"
    label: "as primary maintainer, from July 2022 to October 2025"
---

## The problem

inSales storefront templates mix HTML, Liquid, JavaScript and CSS in one file, with JSON for settings and translations. Partner developers, support engineers and technical merchants edit this code in the browser, inside the admin, without downloading the template to an IDE.

The existing CodeMirror integration could open and save code, but it had no mixed-language highlighting, no suggestions that depended on where the cursor was, no Emmet and no inSales snippets. Turning it into a proper workspace would have meant redesigning the language setup anyway, so the team chose Monaco, the engine behind VS Code, and gave me the custom build and its rollout.

## My role

I led the development from July 2022 to October 2025. I built the first integration for widget code, then moved it into a shared package and remained its primary maintainer as it spread to other screens. I owned the language tooling, the browser API, packaging, the release setup and the major integrations. Monaco itself supplied the editing engine. Other engineers contributed worker routing, theme updates and code formatting for supported languages.

## What I built

### A tokenizer for templates that mix HTML and Liquid

Liquid lives directly in the markup: output tags, control tags, comments, `raw` blocks and inSales filters. It can also sit inside an HTML attribute value, alone or mixed with plain text. I registered a custom HTML + Liquid language with a Monarch tokenizer and language configuration. After a closing delimiter inside an attribute, the tokenizer has to return to the attribute state instead of colouring the rest of the line as Liquid. It switches to JavaScript or JSON inside `script`, to CSS inside `style`, and back to HTML after the closing tag. Bracket pairs, auto-closing and indentation rules make the file behave as one language. Some edge cases only show up in a real product: one regular expression variant broke the editor entirely in Safari, so the tokenizer avoids it.

### Suggestions follow the language under the cursor

Inside `script` the user needs JavaScript, not HTML attributes or Liquid snippets; inside `style`, CSS. The first version guessed the context from the nearest opening and closing tags before the cursor. In 2024 I replaced that check with Monaco's own `getLanguageIdAtPosition`, because the model already knows which embedded language is at that position. I also normalised `script type` values such as `application/json` and `application/ld+json`, so unusual types no longer tried to load a language service that does not exist.

![Full template editor with a file tree and a querySelector suggestion inside a script block in layouts.layout.liquid](/images/work/monaco-editor/template-editor-script-completion.webp)

*JavaScript suggestions inside a `script` block of a Liquid layout file.*

### A three-function browser API

To keep the editor from belonging to one modal, I exposed three functions: one returns the loaded Monaco instance, one creates an editor in a given element with shared defaults, and one registers the Liquid, JavaScript and SCSS configurations for screens that create their own models. Registration checks whether a language already exists, so a page with several entry points does not get duplicate providers. Each product screen still owns its data, saving and preview. On top of it I built the Vue component for the widget workspace with six files: markup, SCSS, JavaScript, translations, settings schema and default values.

### Workers and packaging are part of the contract

Monaco runs language analysis in Web Workers, so a working editor needs more than its main bundle. I set up Webpack to produce the bundle plus five language workers, then packaged them as a Rails Engine and internal gem. GitLab CI builds the bundle, builds the gem and publishes a version to the internal package registry. The main app pins a version, and a fix to the tokenizer or a new command ships to every screen from one place.

### One build for templates and customer messages

After widget code, the same build went into the full template editor with its file tree, then into order emails, abandoned-cart reminders and order-status notifications in inSales Dialogues. In those communication screens the merchant edits HTML/Liquid or text with Liquid variables and previews the result on a real order or cart.

![Client letter template editor with the subject, HTML and Liquid source, and a preview by order number](/images/work/monaco-editor/order-email-template.webp)

## Results

- One editor build runs in 5 inSales product interfaces: widget code, full storefront templates, order emails, abandoned-cart messages and Dialogues notifications.
- I was the primary maintainer for more than 3 years, from July 2022 to October 2025.
- Shared improvements land once and reach every interface: colleagues added Liquid formatting and theme updates in the package without reworking each screen.
- Merchants and partners get VS Code-like editing in the admin: cursor-aware completion, Emmet, inSales snippets and a Liquid comment shortcut (Ctrl+Shift+/) that works with undo and redo.
