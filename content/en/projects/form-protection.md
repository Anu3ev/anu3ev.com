---
title: Bot protection for checkout and customer forms
description: Invisible CAPTCHA built into the submit flow of inSales checkout, customer accounts and store forms, followed by a choice between Google reCAPTCHA and Yandex SmartCaptcha through one store setting.
locale: en
slug: form-protection
published: true
cover: /images/work/form-protection/invisible-captcha-submit-flow.svg
coverAlt: Diagram of a form submit that validates fields, waits for a CAPTCHA token and resumes only the form that requested it
category: Storefront platform
year: Oct 2023 – Jul 2026
context: inSales
role: Frontend owner of the integration, shared CAPTCHA code and release
stack: [JavaScript, Vue, Slim, Liquid, Google reCAPTCHA, Yandex SmartCaptcha]
featured: false
order: 11
results:
  - value: "2"
    label: "CAPTCHA providers, Google and Yandex, available for supported store forms"
  - value: "3"
    label: "checkout generations integrated: 1.0, 2.0 and 3.0"
  - value: "4"
    label: "storefront form families in the shared JavaScript library"
---

## The problem

Customers on inSales stores use forms to place orders, sign in, register, recover access, leave reviews and contact the store. Merchants sign in to their own accounts. All of these are targets for bots: a bot attack could create hundreds of orders per second. The protection still has to let a real buyer press Send and get an order through.

The old flow asked people to tick "I'm not a robot" before sending. In 2025 a second problem came in through the product team: merchants were concerned about a foreign service processing personal data, and some of their customers could not reach Google. They needed an alternative, switched on with one setting instead of reworking every form. The hard part was the platform itself. Forms lived in two generations of customer accounts, three generations of checkout, server-rendered templates, Vue apps, standard store widgets and merchant-edited code, often several on one page.

## My role

I owned the frontend: integration points, shared code and components, test builds, QA support, release and maintenance. Backend developers implemented server-side token verification, and I agreed the request contracts with them. Outside the frontend I made one targeted Rails change. I delivered the Google stage in 2023, added provider choice in 2025 (main release on 26 August 2025) and continued maintenance into 2026.

## What I built

### The check became part of the submit flow

I moved Google reCAPTCHA Invisible into the existing submit flow. The form runs its usual field validation, waits for a CAPTCHA token, then continues, and the server verifies the token before accepting the request. The provider can still show a challenge when it needs one. AJAX forms got their own continuation, so they didn't turn into a page navigation. Existing rules stayed in place: password sign-in asks for a check only after failed attempts, and sign-in by one-time code has its own forms and handlers.

### Each verification result belongs to one form

A customer opens the contact form, starts a check and closes the challenge. Then they submit a review and pass the check there. If both handlers wait for one shared event, the review's token can submit the contact form instead. An early event bus made it worse by replaying earlier data to new subscribers. I bound each verification callback to the form being submitted, together with its CAPTCHA instance and token.

### One setting, three integration layers

I proposed a CAPTCHA type setting in the store's settings and rolled it out behind a feature flag. I agreed with the backend how to pass it into Liquid templates, so system forms, the library and theme widgets read the same value. The chosen provider applies after the page reloads; an open form never swaps providers in the middle of filling it in.

I implemented the provider in three places that match how the platform is built: a module in CommonJS, the shared storefront JavaScript library, for its 4 form families (contact, reviews, comments, one-click orders); reusable Slim templates for customer accounts and checkout 1.0 and 2.0; and a Vue component for checkout 3.0 and merchant sign-in. Rendering, getting a token and submitting stayed separate steps, so a form whose submit is driven by its own script could use render only.

### One script per page

A system form and a store widget could both load SmartCaptcha. The second load created a new `window.smartCaptcha` that knew nothing about instances rendered by the first. The customer saw a Send button that did nothing, depending on which part of the page loaded first. I changed the loaders in the templates and the library to reuse a script already on the page.

### Failure paths and old accounts

Closing a challenge used to leave the form stuck in a sending state. I reset that state so the customer can try again, and a retry or a long wait gets a fresh token. The first rollout of system forms in August 2025 had to be rolled back: on some existing stores no CAPTCHA appeared at all. Those accounts had no settings record, so a condition expecting "google" or "yandex" matched neither. I added a Google fallback for that case to the Rails account model. The fix shipped three days later.

I fixed a scroll jump in Safari after submission. On some Android devices the keyboard covered the field inside the provider's challenge, which we could not fully fix on our side, so I escalated it to Yandex Cloud with a test page and video.

## Results

- 2 providers, Google reCAPTCHA and Yandex SmartCaptcha, selected by 1 store setting for supported forms.
- Integrated into 3 checkout generations, 2 customer-account generations, 4 storefront form families and merchant sign-in.
- Supported forms submit with an invisible check instead of a mandatory checkbox.
- Store developers got documented APIs and examples for adding either provider to custom forms, published for [Google reCAPTCHA](https://docs.liquidhub.ru/Примеры%20работы%20с%20данными%20магазина/reCAPTCHA/recaptcha-common/) and [Yandex SmartCaptcha](https://www.insales.ru/collection/primery-raboty-s-dannymi-magazina/product/yandex-captcha).

## Constraints

Provider choice did not make the check mandatory everywhere: each form kept its own rules for when a check is required. Forms built into older themes and custom widgets with their own integration needed manual updates, and not every admin form is covered.
