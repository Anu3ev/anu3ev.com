---
title: Custom Monaco code editor for Liquid templates
description: "inSales partners and support staff edit template code in the admin panel. The old editor highlighted mixed HTML and Liquid poorly and gave no suggestions. I implemented a custom Monaco package for the widget code window. Later it was connected to four more interfaces."
locale: en
slug: monaco-editor
published: true
cover: /images/work/monaco-editor/widget-code-liquid-autocomplete.webp
coverAlt: Widget code editor with six file tabs showing a Liquid "for" tag suggestion inside HTML markup
category: Browser editors
year: Jun 2022 – Oct 2025
context: inSales
role: "Implemented the custom Monaco package, then developed and maintained it for over three years"
stack: [Monaco Editor, TypeScript, JavaScript, Liquid, Vue.js, Webpack, GitLab CI, Ruby on Rails]
featured: false
order: 8
results:
  - value: "64% → 82%"
    label: "typical edits finished without help in a product manager’s comparison test of CodeMirror and Monaco"
  - value: "5"
    label: "inSales product interfaces run on one editor package"
  - value: "3 days"
    label: "to connect the ready editor package to Abandoned Carts"
---

## The problem

In the inSales admin panel, partner developers, support specialists and technically skilled store owners edit template and widget code right in the browser. This way they change the design and behavior of a storefront without downloading the template or opening a separate IDE. The platform has more than 60,000 clients, so there are many such users.

One template or widget file can mix HTML, the Liquid template language, CSS and JavaScript, while settings and translations are stored in JSON. Liquid tags and variables insert store data into the markup. So the editor has to know which language is used where.

Before that, code in the admin panel was edited in a CodeMirror-based editor. It didn’t highlight mixed syntax and had no context-aware suggestions and no Emmet, and errors appeared when users switched tabs or searched. The limit was the integration built at inSales, not CodeMirror itself, which can be extended as a library. But to support mixed HTML and Liquid code, we would have had to design the language configuration and suggestions from scratch.

So we decided to move to Monaco Editor, the engine VS Code is built on. Monaco already includes VS Code’s language services for HTML, CSS, JavaScript and JSON. What remained was Liquid and the parts that exist only in inSales: variables, Liquid tags, filters and snippets. I was asked to implement a custom Monaco package and roll it out.

## My role

From June 2022 to October 2025, I developed and maintained this editor. I implemented the editor package, moved it into a separate repository and a gem, connected it to new interfaces, extended the language support and fixed bugs after rollouts. Monaco provided the editing engine. My work was the package on top of it: the inSales language model, context-aware suggestions, commands, the API and the integration with platform interfaces. Colleagues helped with some parts: worker paths in Rails, theme updates and Liquid code formatting.

## What I built

### The editor first appeared in the widget code window

I started on 31 May 2022 with the widget code window in the visual site editor. Monaco is written in plain JavaScript, so it needs an adapter to work inside a Vue component. We decided not to add the ready-made `vue-monaco` and `@guolao/vue-monaco-editor` wrappers as dependencies: they contain little code and are rarely updated. Also, `vue-monaco` used an old Monaco version, which meant the editor’s webpack plugin had to be installed separately. So I moved the adapter code into the project, where the team could change it when needed, and connected the latest Monaco version.

For the window, I implemented a Vue component. It creates the editor in a container, passes it the content and language of the current file, and switches between the widget’s files. There are six of them, each in its own tab: HTML markup with Liquid, SCSS styles, JavaScript, a JSON translations file, a JSON schema of the settings form and a JSON file with default settings. The last three belong to different parts of the widget but share one format, JSON. So the component picks the language by file format, not by tab. Loading and saving stayed with the parent interface and the server API.

![Widget code window: six file tabs and a Liquid "for" tag suggestion inside HTML markup](/images/work/monaco-editor/widget-code-liquid-autocomplete.webp)

The editor couldn’t be rolled out right away: the assets of the main application failed to build because of an old Webpack version. After I installed the latest versions of Monaco and its webpack plugin, the assets built. On 25–26 July 2022 the editor went to production, but only for inSales staff, so we could test it ourselves first. Clients still had CodeMirror until 18–19 August, when the editor was rolled out to all users.

Emmet for HTML and CSS already worked in this first version. I added it on 6 June 2022, so users could write HTML and CSS quickly right inside a Liquid template. Liquid snippets weren’t there yet. They needed a custom Liquid language, but when it was enabled, regular HTML highlighting and suggestions stopped working. So I finished the mixed HTML and Liquid language after the first release.

### The tokenizer tells HTML and Liquid apart in one file

Liquid expressions are written right in the markup, so Monaco’s standard HTML mode wasn’t enough. In Monaco, highlighting comes from a tokenizer: it splits the text into tokens, and each piece of code gets the color of its token type. VS Code extensions can’t be added to Monaco in the browser. So I registered a custom mixed HTML + Liquid language and wrote its tokenizer in Monarch, Monaco’s built-in way to describe languages.

The tokenizer recognizes HTML tags and attributes, Liquid output in `{{ ... }}`, control tags in `{% ... %}`, Liquid comments and `raw` blocks. It also marks variables, constants, operators, built-in filters and inSales tags.

The hardest part was Liquid inside HTML attributes. An attribute value can be a whole Liquid expression or plain text mixed with several Liquid inserts. After the closing `}}` or `%}`, the tokenizer must go back to the HTML attribute state instead of highlighting the rest of the line as Liquid.

The same file can also contain `<script>` and `<style>` blocks. In the first version, code inside them had no highlighting at all. So I added nested-language switching to the tokenizer: JavaScript or JSON inside `<script>`, CSS inside `<style>`, and back to HTML after the closing tag. For `script`, it also reads the `type` attribute: for plain JavaScript, `application/json`, `application/ld+json` and other values, the editor must not try to load a language service that doesn’t exist.

![Slide: a template with Liquid inside an HTML attribute and inside a script block, and the tokenizer states: HTML attribute, Liquid expression, back to HTML; script tag, JavaScript or JSON, back to HTML](/images/work/monaco-editor/mixed-language-tokenizer-slide-en.webp)

In the language configuration, I also set bracket and delimiter pairs, auto-closing and indentation rules after an opening HTML tag. So a mixed file behaves like one language, not like a set of randomly colored pieces.

### Suggestions depend on the language under the cursor

When the cursor is inside `<script>`, the user needs JavaScript suggestions, not HTML tags, attributes or Liquid snippets. Inside `<style>`, CSS suggestions and Emmet should work. In regular markup, Liquid snippets must not replace HTML suggestions, and HTML attributes must not appear where the user writes Liquid.

For this, I registered a completion provider that returns different suggestion sets depending on the language at the cursor position. At first, the language was detected with regular expressions, by the opening and closing tags before the cursor. This check was fragile, especially for `script` with a non-standard `type`. At the end of September 2024, I replaced it with the `model.getLanguageIdAtPosition` method. Monaco already knows which nested language is at a given position, so the provider picks JavaScript, CSS or Liquid snippets from the state of the model.

At the same time, I mapped common `type` values to supported languages and made JavaScript the safe default. After that, JSON, JavaScript and other `script` blocks stopped trying to load an unknown language.

![Slide: three screenshots of suggestions in one template: HTML and Liquid suggestions in the markup, JavaScript suggestions inside a script block and CSS suggestions inside a style block](/images/work/monaco-editor/context-aware-autocomplete-slide-en.webp)

The editor package has three sets of snippets: 122 for Liquid, 152 for JavaScript and 166 for CSS, 440 in total. Some of them were taken from existing sets and adapted for the package.

### The editor package moved into a separate repository and a gem

While the editor worked only in the widget code window, the package code was part of the main inSales application, which is built on Ruby on Rails. The infrastructure team considered Monaco heavy and said it put a lot of load on the company’s servers. In December 2022 they suggested moving it into a separate repository, building it there with Webpack and connecting it to the main application as a ready-made library. I was asked to do the move.

Monaco runs the heavy part of language analysis in Web Workers, so one main bundle isn’t enough for a working editor. The browser also needs separate worker files for the base editor, HTML, CSS and SCSS, JavaScript and TypeScript, and JSON. I set up Webpack and `monaco-editor-webpack-plugin` to produce the main bundle and the worker files.

Worker paths turned out to be a separate problem. The Rails asset pipeline adds a hash to file URLs, but Webpack knows only the original file names. Without the final paths, the editor opened, but some highlighting and suggestions couldn’t start their workers. So a colleague added an adapter: it got the final paths through `asset_path` and returned them from `MonacoEnvironment.getWorkerUrl` instead of the default ones.

The main application gets its frontend assets through the Rails asset pipeline, so the editor package had to ship as a gem. From 24 January to 7 February 2023, I moved the working package on Monaco 0.34.1 into the new `monaco-insales` repository and turned it into a gem. A Rails Engine registers the assets, and a Rake task checks that a production bundle exists and copies it with the workers into `vendor/assets`. GitLab CI runs three jobs in a row: the Webpack bundle, the gem, and publishing to the internal Nexus registry.

![Slide: the delivery pipeline from editor source to Webpack build, internal gem and product screens, with the language workers and the GitLab CI release steps](/images/work/monaco-editor/gem-delivery-pipeline-slide-en.webp)

The main application uses a specific gem version. Changes to languages, the theme or commands reach every interface with the next version, and nobody has to copy the language configuration into each interface.

### Three API functions connect the editor to any interface

To make the editor usable in different interfaces, I implemented a small API in the package with three functions:

- `getMonacoInstance` returns the API object of the loaded Monaco, so an interface can work with Monaco’s models, commands and types;
- `monacoCreate` creates an editor in a given HTML element with the required language and returns the editor instance;
- `monacoLanguageRegisterApi` registers the Liquid and HTML, JavaScript and SCSS configurations for interfaces that create Monaco models themselves.

The functions are exported to `window`. The package is connected to the Rails application as an asset through the asset pipeline, so a global API was the most practical contract: both old admin pages and Vue interfaces use it.

`monacoCreate` also sets the shared editor behavior: line wrapping at 120 characters, resizing with the container, code folding, two-space indentation and a custom light inSales theme. Before registering the custom language, the package checks whether it’s already registered. Otherwise, on pages where the editor is created again or that have several entry points, suggestions would appear twice. Each interface handles its own loading, saving and preview.

### The full template editor got the same features

After the move to a gem, in March 2023, the package was connected to the full template file editor in the Website → Design section. There, Monaco became the editing area inside a bigger interface with a file tree, search and several open tabs. Highlighting, suggestions, Emmet and keyboard shortcuts became the same whether the user changed one widget or worked on the whole template.

![Full template editor in Website → Design: a file tree, the open layouts.layout.liquid tab and a querySelector suggestion inside a script block](/images/work/monaco-editor/template-editor-script-completion.webp)

### Package improvements reach every interface

After the first release, several developers kept improving the package. In May 2023 a colleague updated the theme colors. In June he added formatting for a whole HTML/Liquid document or a selected fragment with Prettier and `@shopify/prettier-plugin-liquid`. He made both changes once in the package, and after a version update they appeared in every interface that uses it.

In autumn 2024 I added the `Ctrl + Shift + /` command, which comments out the selected fragment in Liquid syntax. The command changes the text through the editor instance API, so the changes go into Monaco’s edit history, and undo and redo work correctly.

### The editor replaced WYSIWYG in emails and messages to customers

In 2025 the package was also added to the interfaces a store uses to communicate with customers. There, the user edits HTML and Liquid, or text with Liquid variables, so one shared set of language features was more useful than several separate editors.

In the standard order email templates, the editor is used for a new-order notification to the store owner and an email to the customer after checkout. The user can change the subject and the HTML/Liquid code of the email, restore the original version and check the result on a specific order. The server takes the order number, puts real order data into the Liquid variables and shows the finished email.

![Customer email template: the subject, HTML and Liquid code in Monaco, the Restore the original template button and a preview by order number](/images/work/monaco-editor/order-email-template.webp)

In [Abandoned Carts](/work/abandoned-carts/), a store sets up automatic reminders to customers who didn’t place an order. The email template there was edited in a WYSIWYG editor. It changed HTML tags, and this could break the Liquid logic in the email. So on 28 February 2025 we decided to replace it with Monaco and a preview. I made the change on 5–6 March: the code editor took the place of the WYSIWYG editor and the plain text field for all sending channels.

Liquid and the workers didn’t have to be set up again. I connected the ready package in three working days, and the code of the section only handled loading, saving and previewing the message. As a result, the template can be edited as source code, restored to the default version and checked in a preview with data from a specific cart.

![Abandoned Cart Settings: an HTML and Liquid email template in Monaco, a cart ID field, and the Preview and Restore the original template buttons](/images/work/monaco-editor/abandoned-carts-email-template.webp)

In Dialogues, a paid feature, the editor is used for messages a store sends when an order is placed and when its status changes: in messengers, by SMS and by email. Email templates use mixed HTML and Liquid, while SMS and messenger templates are plain text with Liquid variables. One package supports both formats and switches the language features by template type.

![Dialogues: a notification template for the New status with tabs for messengers, SMS and email, text with Liquid variables and a preview by order number](/images/work/monaco-editor/dialogues-status-notification-template.webp)

## Results

To evaluate the new editor, a product manager ran a comparison test: participants made the same typical edits in CodeMirror and in Monaco. Each participant got a file with mixed HTML and Liquid. An edit counted as successful if the participant found the right place, saved the code and saw the expected result in the preview without help from anyone, extra documentation or an external IDE. The share of successful edits grew from 64% in CodeMirror to 82% in Monaco.

- One editor package replaced the CodeMirror integration, the WYSIWYG editor and the plain text field. It runs in five inSales interfaces: the widget code window, the full template editor, the standard order email templates, Abandoned Carts and Dialogues.
- Connecting the ready package to Abandoned Carts took three working days, because the language support and workers didn’t have to be built again.
- A tokenizer fix, a new snippet or a command is added to the package once and reaches all five interfaces with the next gem version.
