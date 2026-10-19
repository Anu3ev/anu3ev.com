---
title: One code editor, five product interfaces
description: A custom Monaco integration for mixed HTML and Liquid, contextual suggestions, snippets, Emmet, and reliable worker loading across an established commerce platform.
locale: en
slug: monaco-editor
published: true
cover: /images/monaco-editor.webp
coverAlt: Presentation showing HTML and Liquid, JavaScript, and CSS autocomplete in the customized Monaco editor
category: Product engineering
year: 2022–2025
role: Custom editor build and integration contract
stack: [Monaco Editor, JavaScript, Liquid, Webpack]
featured: false
order: 5
---

## A browser workspace for mixed languages

inSales templates combine HTML, Liquid, CSS, JavaScript, and JSON. Partners, support engineers, and technically experienced merchants edit them inside the platform. The existing CodeMirror integration offered a basic editing field; the product needed a more capable workspace with contextual help.

I developed the core custom Monaco build, its language configuration, snippets, theme, commands, and JavaScript API. I also prepared distribution through a Rails Engine and gem. Monaco supplies the editing engine: my contribution was the inSales language model and the product integration around it. Colleagues contributed, including the Rails worker-path adapter and Liquid formatting.

## Ask the editor which language is active

Liquid can appear inside HTML attributes and alongside nested script and style blocks. A regular-expression guess about the nearest opening tag is too fragile for contextual autocomplete.

I used Monaco’s language information at the cursor position to choose the appropriate JavaScript, CSS, or Liquid suggestions. A Monarch tokenizer and language configuration handle mixed HTML/Liquid behaviour, bracket pairs, and indentation.

## Workers are part of the deployment contract

Loading the main JavaScript bundle does not prove that Monaco is fully working. Language analysis also needs worker files for the editor and supported languages.

The build had to work with Rails asset fingerprinting. A colleague provided the adapter from final asset paths to Monaco’s worker URLs. Keeping that responsibility explicit prevented the misleading state where an editor opens but its language services fail.

## Reuse follows a stable boundary

The same build was integrated into widget code, full template code, standard order emails, abandoned-cart messages, and the Dialogs product. Each parent interface owns loading, saving, and previewing its content; the editor package owns editing and language behaviour.

This is a long-lived internal product, not a public open-source repository. The case shares the architecture and permitted presentation evidence, without publishing the employer’s source code.
