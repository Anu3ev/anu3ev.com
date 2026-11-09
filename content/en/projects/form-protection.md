---
title: Bot protection for online store forms
description: Buyers on inSales stores had to click "I’m not a robot" before sending any form. I replaced it with an invisible check, and later let store owners switch from Google to Yandex with one setting.
locale: en
slug: form-protection
published: true
cover: /images/work/form-protection/invisible-captcha-submit-flow.svg
coverAlt: "Diagram: the buyer clicks Send, the form checks its fields, Google or Yandex decides whether this is a person, only this form is sent, and the server checks that the result is real"
category: Storefront platform
year: Oct 2023 – Jul 2026
context: inSales
role: "Frontend owner: the check on store forms, the shared code and the release"
stack: [JavaScript, Vue, Slim, Liquid, Google reCAPTCHA, Yandex SmartCaptcha]
featured: false
order: 11
results:
  - value: "2"
    label: "bot checks a store owner can choose from: Google reCAPTCHA and Yandex SmartCaptcha"
  - value: "3"
    label: "versions of checkout protected"
  - value: "4"
    label: "kinds of store forms protected: contact, reviews, comments and one-click orders"
---

## The problem

inSales is a platform where 60,000+ businesses run their online stores. On every store, buyers place orders, sign in, register, leave reviews and write to the store through forms. Bots fill in those forms too, and a bot attack can create hundreds of orders per second. So the forms need a check that stops bots and lets real buyers through.

Remember the "I’m not a robot" checkbox you have to click before sending a form? Stores on inSales had it on their forms, so every buyer who filled in a form had to make one more click. Every extra click lowers the share of people who send the form, which matters most on the checkout page. Google also offers an invisible version of the same check: it runs when you click Send and decides whether you are a person without asking for an extra click. I switched the store forms to that version, so a buyer fills in the form, clicks Send, and the order goes through.

The browser alone is not trusted. A bot can skip the page and send an order straight to the server, so the server asks Google whether the check really passed before it accepts the order. And when Google is unsure, the buyer still gets the famous test: find all the fire hydrants.

In 2025 Russia tightened its personal data law. Since July 2025, a website may not collect personal data of people in Russia using databases abroad, and fines for this can reach millions of rubles. Google reCAPTCHA sends data about every visitor to Google’s servers abroad, so for a Russian online store keeping it became a legal risk. Yandex has a similar service, SmartCaptcha, that keeps the data in Russia. The idea was to offer an alternative that stores could easily switch to, without rebuilding all their forms.

## My role

I was responsible for the frontend: the code on store pages that shows the check and sends the form. Backend developers built the server side, and I agreed with them what each form sends. I shipped the invisible Google check in 2023 and the choice between Google and Yandex in August 2025, and kept fixing issues into 2026.

## What I built

### One setting for the store owner

I suggested a setting in the store settings where the owner picks Google or Yandex. Getting it to every form was the hard part, because a store has two kinds of forms and each needed its own work.

System forms are part of the platform itself: sign-in, registration and checkout. Their code lives in inSales, not in the store’s template, so they are the same on every store, whatever its design. The customer account and the first two versions of checkout are written as server-side Slim templates, and the newest checkout is written in Vue. I added Yandex as an option to both the Slim templates and the Vue checkout, so these forms got the choice on every store at once.

Store forms are the contact, review, comment and one-click order forms that sit inside the store’s design. Template developers build them from ready-made form components in inSales’s shared JavaScript library. Here everything depended on the generation of the store’s template, and inSales has had four:

- The first generation has only system forms.
- The second could use the library’s form components, but most of these templates were made before the components existed. Even where they were used, the form code had to be updated to read the setting.
- The third was built in Vue. It was removed from most stores and isn’t available to store owners.
- The fourth is built from widgets. A store owner adds, say, a contact form widget, and if they never edit its code, the form updates together with the setting.

So I added Yandex as an option to the library’s form components and to the fourth-generation widgets. For everything else, I added captcha functions to the library and wrote instructions, so store developers could add either check themselves (more on that below).

### The platform’s own forms

The law applied to inSales itself, not only to the stores, so Yandex had to go across the whole platform. Store owners sign in to inSales and recover their access through the platform’s own forms, and those forms used Google reCAPTCHA too. There was nothing to choose here, so in those forms I replaced Google reCAPTCHA with Yandex SmartCaptcha.

### Each check belongs to one form

One page can have several forms. Say a buyer sends the contact form, gets a puzzle and closes it. Then they write a review and pass the check there. In the old code both forms waited for the same answer, so the answer meant for the review could send the contact form instead. I tied every check to the form that asked for it.

### The Send button that did nothing

Sometimes a page loaded the Yandex script twice: once for a system form and once for a store widget. The second copy of the script didn’t know about the checks the first one had already created, and the buyer got a Send button that did nothing. It happened only when the parts of the page loaded in a certain order, so it came and went. I made every part of the page reuse the script that was already there.

### A closed puzzle no longer blocks the form

If a buyer closed the Yandex SmartCaptcha puzzle, the form stayed stuck in "sending" forever. Now they can just try again, and a form that waited too long gets a fresh check.

### Bugs in Yandex SmartCaptcha

Both bugs were in Yandex SmartCaptcha. In Safari the page jumped to the top after a form was sent, and I worked around it on our side. On some Android phones the keyboard covered the field inside the puzzle, which we couldn’t fix from our side at all. I reported both bugs to Yandex with a test page and a video, but neither has been fixed.

### Instructions for store developers

Many stores have forms written by their own developers. For them I published instructions with examples for adding either check through the library’s functions: [Google reCAPTCHA](https://docs.liquidhub.ru/%D0%9F%D1%80%D0%B8%D0%BC%D0%B5%D1%80%D1%8B%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B%20%D1%81%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D0%BC%D0%B8%20%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D0%B0/Captcha/Google%20reCAPTCHA/recaptcha-common/) and [Yandex SmartCaptcha](https://docs.liquidhub.ru/%D0%9F%D1%80%D0%B8%D0%BC%D0%B5%D1%80%D1%8B%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B%20%D1%81%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D0%BC%D0%B8%20%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D0%B0/Captcha/yandex_captcha/#_2).

## Results

- Buyers send forms without the extra "I’m not a robot" click.
- Store owners choose between Google and Yandex with one setting.
- Store owners sign in to inSales and recover their access through forms protected by Yandex SmartCaptcha.
- The check works in 3 versions of checkout, 2 versions of the customer account, and the contact, review, comment and one-click order forms.
- Store developers can add either check to their own forms using the published instructions.

## Limits

System forms got the choice automatically on every store, and so did fourth-generation widgets whose code the owner never changed. If an owner had edited a widget’s code, their copy didn’t update: after switching to Yandex, that form showed no check at all, because its code lacked the template condition that picks which check to show. Those widgets, forms in older templates and custom forms had to be updated by the store’s developers, using the instructions above. Some admin forms don’t have the check.
