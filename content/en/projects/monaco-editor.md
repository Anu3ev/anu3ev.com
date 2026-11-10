---
title: Custom Monaco code editor for Liquid templates
description: "Partners and support staff at inSales edit template code in the admin. The old editor highlighted mixed HTML and Liquid poorly and gave no suggestions. I made a Monaco build for five interfaces. The share of typical edits finished in the browser rose from 64% to 82%."
locale: en
slug: monaco-editor
published: true
cover: /images/work/monaco-editor/widget-code-liquid-autocomplete.webp
coverAlt: Widget code editor with six file tabs showing a Liquid "for" tag suggestion inside HTML markup
category: Browser editors
year: Jun 2022 – Oct 2025
context: inSales
role: "Built the editor, then developed and maintained it for over three years: language support, package, API, integrations"
stack: [Monaco Editor, TypeScript, JavaScript, Liquid, Vue.js, Webpack, GitLab CI, Ruby on Rails]
featured: false
order: 8
results:
  - value: "64% → 82%"
    label: "share of typical edits users finished on their own in the browser, before (CodeMirror) and after (Monaco)"
  - value: "5"
    label: "inSales product interfaces run on one editor build"
  - value: "3 days"
    label: "to connect the ready-made build to Abandoned Carts"
---

## The problem

In the inSales admin, partner developers, support specialists and technically skilled merchants edit template and widget code right in the browser, without downloading the template. The platform has more than 60,000 clients, so there are many such users. One template file mixes HTML, the Liquid template language, CSS and JavaScript, and settings and translations are stored in JSON.

The old CodeMirror-based editor highlighted this code poorly and had no context-aware suggestions and no Emmet, which expands short abbreviations into full markup, and errors appeared when users switched tabs or searched. CodeMirror itself can be extended, but the CodeMirror integration at inSales couldn’t be extended with platform features, and working in it was far less comfortable than in VS Code. The language configuration and suggestions would have had to be designed from scratch anyway, so the team decided to move to Monaco Editor, the engine VS Code is built on. I was asked to make the custom Monaco build and roll it out.

## My role

From June 2022 to October 2025, I developed and maintained this editor: I built its base, moved the build into a shared package, connected it to new interfaces, extended the language support and fixed bugs after rollouts. Monaco provided the editing engine; my work was the product build on top of it. Colleagues helped with some parts: loading Monaco’s background workers in Rails, updating the theme and formatting Liquid code.

## What I built

### The first version worked in the widget code window

The first place for the editor was the widget code window in the visual site editor. To make Monaco work inside a Vue component, you need an adapter. We decided not to add the ready-made `vue-monaco` and `@guolao/vue-monaco-editor` wrappers as dependencies: they contain little code, are rarely updated, and `vue-monaco` used an old Monaco version. So I moved the adapter code into the project, where the team could change it, and connected the latest Monaco version.

On top of the adapter, I built a Vue component for a widget with six files in tabs: HTML and Liquid markup, SCSS, JavaScript, translations, the settings form schema and default values. The last three files belong to different parts of the widget but share one format, JSON, so the component picks the language by file format, not by tab.

![Widget code editor with six file tabs showing a Liquid "for" tag suggestion inside HTML markup](/images/work/monaco-editor/widget-code-liquid-autocomplete.webp)

First, on 25–26 July 2022, the editor was rolled out only to inSales staff, so we could test it ourselves while clients still had CodeMirror. On 18–19 August it was rolled out to everyone. By then the support team was already working in the new editor and liked it, so the release didn’t need a separate testing task. In the same release I added saving with Ctrl+S: while saving, the editor is locked, so text typed after pressing Ctrl+S isn’t lost.

### The tokenizer tells HTML and Liquid apart in one file

After the first release, I built the main language part: a mixed HTML and Liquid language. Liquid code sits right in the markup: output tags, control tags, comments, `raw` blocks and inSales filters. It can also sit inside an HTML attribute value, on its own or mixed with plain text. In Monaco, highlighting comes from a tokenizer: it splits the text into pieces, and each piece gets the color of its type. A regular VS Code extension can’t be added to the browser version of Monaco, so I registered my own HTML + Liquid language with a tokenizer written in Monarch, Monaco’s built-in way to describe languages.

The hardest part was Liquid inside attributes: after the closing `}}` or `%}`, the tokenizer must go back to reading the attribute value instead of highlighting the rest of the line as Liquid.

Inside `script`, the tokenizer switches to JavaScript or JSON, inside `style` to CSS, and after the closing tag it goes back to HTML. I also set up bracket pairs, auto-closing of brackets and tags, and indentation rules, so a mixed file behaves like one language.

Some problems only show up in the real product: one version of a regular expression completely broke the editor in Safari, so the tokenizer no longer uses it.

### Suggestions depend on the language under the cursor

Inside `script`, users need JavaScript suggestions, not HTML attribute or Liquid suggestions, and inside `style` they need CSS. The first version checked the nearest tags before the cursor with regular expressions and often got the language wrong, especially for `script` with a non-standard `type`. In 2024 I replaced that with Monaco’s own `getLanguageIdAtPosition` method: the document model, an open file together with its language, already knows which nested language is at that position. At the same time, I mapped common `type` values like `application/json` and `application/ld+json` to languages the editor supports, so the editor no longer tries to load a language service that doesn’t exist.

Besides suggestions, the build has three sets of snippets, ready-made pieces of code inserted by a short keyword: 122 for Liquid, 152 for JavaScript and 166 for CSS. I connected Emmet separately for HTML and SCSS, so that Emmet and Liquid suggestions don’t conflict.

![Full template editor with a file tree and a querySelector suggestion inside a script block in layouts.layout.liquid](/images/work/monaco-editor/template-editor-script-completion.webp)

### The build moved into a separate package

While the editor worked only in the widget code window, its code was part of the main inSales application, which is written in Ruby on Rails. Monaco was heavy and put a lot of load on the company’s servers, so in December 2022 the infrastructure team suggested moving it to a separate repository and connecting it to the application as a ready-made library. I did this work.

Monaco runs its language analysis in Web Workers, separate background threads in the browser, so one main bundle isn’t enough for a working editor. I set up Webpack to build the bundle and the language workers and packaged them into a Rails Engine and an internal gem, a Ruby package. GitLab CI runs three jobs: build the Webpack bundle, build the gem, publish it to the internal registry. The main application pins a specific package version, and a tokenizer fix or a new snippet reaches the editor with the next package version.

To let any interface add the editor, I gave the build a three-function API: the first returns the loaded Monaco, the second creates an editor in a given element with shared settings, and the third registers the language configurations for interfaces that create document models themselves. Before registering a language, the build checks whether it’s already registered, so a page with several editors doesn’t get duplicate suggestions. Each interface loads, saves and previews its own content. While I was doing this, my team lead asked me to write down what I learned about Webpack and building in GitLab CI, so it could become training material for all developers.

### One build works in templates and in messages to buyers

After the move to a package, in March 2023, the build was connected to the full template editor with a file tree and tabs. In 2025 it was also added to the interfaces a store uses to talk to buyers: order emails, [Abandoned Carts](/work/abandoned-carts/) reminder emails, and Dialogues, a paid feature for order notifications in messengers, SMS and email. In these interfaces, the user edits HTML and Liquid, or text with Liquid variables, and checks the result in a preview with a real order or cart.

In Abandoned Carts, the email template used to be edited in a WYSIWYG email editor that rewrote HTML tags and could break the Liquid logic. So in February 2025 we decided to replace it with Monaco and a preview. I didn’t have to set up Monaco again, describe Liquid again or configure workers: I connected the ready-made build in three working days, and the interface code only handled the message data and the preview.

![Order email template editor with the subject, HTML and Liquid source, and a preview for a chosen order](/images/work/monaco-editor/order-email-template.webp)

Other developers also improved the shared package: in 2023 colleagues updated the theme and added HTML and Liquid formatting with Prettier. Both changes were made once in the package and appeared in every interface that uses it.

To measure the new editor, our product manager compared the same typical edits in CodeMirror and in Monaco. Each participant got a file with mixed HTML and Liquid, and an edit counted as successful if, without help from anyone, extra documentation or an external IDE, they found the right place, saved the code and saw the expected result in the preview.

## Results

- The share of typical edits that users finished on their own in the browser grew from 64% to 82%.
- The Monaco build replaced three different code fields: the CodeMirror integration, the WYSIWYG email editor and a plain text field. It runs in 5 inSales product interfaces: widget code, the full template editor, order emails, Abandoned Carts and Dialogues.
- Connecting the ready-made build to Abandoned Carts took three working days, because the language support and workers didn’t have to be built again.
- Shared improvements are made once and reach every interface, for example, the formatting and the theme that colleagues added.
