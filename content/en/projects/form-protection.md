---
title: Invisible captcha for store forms, with a choice of Google or Yandex
description: Buyers on inSales stores had to click "I’m not a robot" before sending any form. I replaced it with an invisible check, and later let store owners switch from Google to Yandex with one setting.
locale: en
slug: form-protection
published: true
cover: /images/work/form-protection/invisible-captcha-submit-flow.svg
coverAlt: "Diagram: the buyer clicks Send, the form checks its fields, Google or Yandex decides whether this is a person, only this form is sent, and the server checks the token"
category: Storefront platform
year: Oct 2023 – Jul 2026
context: inSales
role: "Owned everything except the server-side token check"
stack: [JavaScript, Vue, Slim, Liquid, Google reCAPTCHA, Yandex SmartCaptcha]
featured: false
order: 11
results:
  - value: "2"
    label: "bot checks a store owner can choose from: Google reCAPTCHA and Yandex SmartCaptcha"
  - value: "3"
    label: "versions of checkout protected"
  - value: "4"
    label: "kinds of template forms protected: contact, reviews, comments and one-click orders"
---

## The problem

inSales is a platform where 60,000+ businesses run their online stores. On every store, buyers place orders, sign in, register, leave reviews and write to the store through forms. Bots fill in those forms too, and a bot attack can create hundreds of orders per second. That’s why the forms already had a bot check, a captcha from Google called reCAPTCHA. It came with two problems, and solving them was my job.

The first problem was an extra click. Remember the "I’m not a robot" checkbox you have to click before sending a form? Stores on inSales had it on their forms, so every buyer who filled in a form had to make one more click. Every extra click lowers form conversion, and it hurts most on checkout.

The second problem came from Russia’s personal data law. Since July 2025, a website in Russia may not collect personal data of people in Russia using databases abroad, and fines for this can reach millions of rubles. Google reCAPTCHA sends data about every visitor to Google’s servers abroad, so for a Russian online store keeping it became a legal risk. Yandex has a similar service, Yandex SmartCaptcha, that keeps the data in Russia. The idea was to let a store owner switch to Yandex with one setting, without rebuilding the system forms.

## My role

I owned the whole project except the server-side token check, which backend developers built. I agreed with them what each form sends. My part covered the store and platform forms, the setting for choosing the captcha, the storefront JavaScript library, the widgets, the instructions for store developers, testing with QA and the release. I shipped the invisible Google check in 2023 and the choice between Google and Yandex in August 2025, and kept fixing issues until July 2026.

## What I built

### An invisible check instead of the checkbox

Google also offers an invisible version of the same check: it runs when you click Send and decides whether you are a person without asking for an extra click. I switched the forms on stores to that version, so a buyer fills in the form, clicks Send, and the order goes through.

![The same contact form before, with the "I’m not a robot" checkbox and a Send button, and after, with only the Send button](/images/work/form-protection/form-checkbox-before-after.svg)

The browser alone is not trusted. When the check passes, Google gives the form a token, a string that proves the check was passed, and the form sends it to the server together with the order. The server checks the token with Google and accepts the order only if it is real. A bot that skips the page and sends an order straight to the server has no real token, so the order doesn’t go through. And when Google is unsure, the buyer still gets the famous test: find all the fire hydrants.

![A buyer clicks Send, gets a token from Google or Yandex, the form sends the data and the token, the server checks the token and accepts the request. A bot skips the page, sends a request without a token, and the server rejects it](/images/work/form-protection/server-check.svg)

### One setting for the store owner

I suggested a setting in the store settings where the owner picks Google or Yandex. Getting it to every form was the hard part, because a store has two kinds of forms and each needed its own work.

System forms are part of the platform itself: sign-in to the customer account, registration and checkout. Their code lives in inSales, not in the store’s template code, which the owner can edit. So they are the same on every store, whatever its design. The customer account has two versions and checkout has three. Both customer account versions and the first two checkout versions are server-side Slim templates, and the newest checkout is written in Vue. I added Yandex as an option to both the Slim templates and the Vue checkout, so these forms got the choice on every store at once.

Template forms are the contact, review, comment and one-click order forms inside the store’s template. Here everything depended on the generation of the store’s template, and inSales has had four:

- In the first generation, forms like contact and reviews were built directly into the template code, so store owners had to update them with their own developers or with help from our support engineers.
- In the second generation, the forms were also built into the template code, so the owner needed to update them too. But these templates included inSales’s shared storefront JavaScript library by default, which made the update easier: replace the form with a ready-made form component from the library, or add the check to their own form through the library’s captcha API. Both the components and the API work with Google and with Yandex.
- The third generation was built in Vue. It isn’t available to store owners.
- The fourth generation is built from widgets. A store owner adds, say, a contact form widget. System widgets updated automatically, and custom widgets needed to be updated manually by the owner.

So I added Yandex as an option to the form components of the storefront JavaScript library and to the fourth-generation system widgets. For custom forms, I added captcha APIs for Google and Yandex to that library and wrote instructions, so store developers could add either check themselves (more on that below). As a result, the owner picks the captcha in one setting, and the choice reaches the system forms, the library’s form components and the system widgets at once.

![System forms got the choice automatically on every store. In first- and second-generation templates, the owner updates the forms in the template code manually; in the second generation it’s easier with the ready-made components or captcha API of the storefront JavaScript library. The third generation is not available to store owners. In the fourth generation, system widgets update automatically, while custom widgets have no check at all after switching to Yandex until the owner updates their code. Store developers update custom forms using our instructions](/images/work/form-protection/forms-by-template-generation.svg)

### The platform’s own forms

The law applied to inSales itself, not only to the stores, so Yandex had to go into the platform’s own forms too. Store owners sign in to inSales and recover their access through those forms, and they used Google reCAPTCHA as well. There was nothing to choose here, because the platform itself has to follow the law, so in those forms I replaced Google reCAPTCHA with Yandex SmartCaptcha.

### Bugs buyers ran into

**Each check belongs to one form.** One page can have several forms. Say a buyer sends the contact form, gets a puzzle and closes it. Then they write a review and pass the check there. In the old code both forms waited for the same answer from the check, so the answer meant for the review could send the contact form instead. I tied every check to the form that asked for it.

![Before: a buyer closed the puzzle in the contact form and passed the check in the review form, and the contact form was sent. After: the review is sent, because each check is tied to the form that asked for it](/images/work/form-protection/two-forms-one-page.svg)

**The Send button that did nothing.** Sometimes a page loaded the Yandex script twice: once for a system form and once for a store widget. The second copy of the script didn’t know about the checks the first one had already created, and the buyer got a Send button that did nothing. It happened only when the parts of the page loaded in a certain order, so it came and went. I made every part of the page reuse the script that was already there.

**A closed puzzle no longer blocks the form.** If a buyer closed the Yandex SmartCaptcha puzzle, the form stayed stuck in "sending" forever. Now they can just try again, and a form that waited too long gets a fresh check.

**Bugs in Yandex SmartCaptcha itself.** Both bugs were in Yandex SmartCaptcha. In Safari the page jumped to the top after a form was sent. I worked around it on our side: after sending, the form creates the captcha again. On some Android phones the keyboard covered the field inside the puzzle, which we couldn’t fix from our side at all. I reported both bugs to Yandex with a test page and a video, but neither has been fixed.

### Instructions for store developers

Many stores have forms written by their own developers. For them I published instructions with examples for adding either check through the captcha API of the storefront JavaScript library: [Google reCAPTCHA](https://docs.liquidhub.ru/%D0%9F%D1%80%D0%B8%D0%BC%D0%B5%D1%80%D1%8B%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B%20%D1%81%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D0%BC%D0%B8%20%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D0%B0/Captcha/Google%20reCAPTCHA/recaptcha-common/) and [Yandex SmartCaptcha](https://docs.liquidhub.ru/%D0%9F%D1%80%D0%B8%D0%BC%D0%B5%D1%80%D1%8B%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B%20%D1%81%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D0%BC%D0%B8%20%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D0%B0/Captcha/yandex_captcha/#_2).

## Results

- Buyers send forms without the extra "I’m not a robot" click.
- Store owners choose between Google and Yandex with one setting, and the choice reaches the system forms, the library’s form components and the system widgets at once.
- Store owners sign in to inSales and recover their access through forms protected by Yandex SmartCaptcha.
- The check works in 3 versions of checkout, 2 versions of the customer account, and the contact, review, comment and one-click order forms.
- Store developers can add either check to their own forms using the published instructions.

## Limits

The choice didn’t reach forms built into first- and second-generation template code, custom forms or custom widgets on its own. Custom widgets were the worst case: after switching to Yandex, such a form showed no check at all, because its code lacked the condition that picks which captcha to show. In September 2025 inSales warned its clients about this in an announcement that listed which forms would update automatically and which the store owner had to update, using the instructions above.
