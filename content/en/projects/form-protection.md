---
title: Invisible captcha for store forms, with a choice between Google and Yandex
description: Buyers on inSales stores had to click "I’m not a robot" before sending any form. I replaced it with an invisible check, and later added a setting where the store owner can choose between the Google and Yandex captchas.
locale: en
slug: form-protection
published: true
cover: /images/work/form-protection/invisible-captcha-submit-flow.svg
coverAlt: "Diagram: the buyer clicks Send, the form checks its fields, Google or Yandex decides whether this is a human, only this form is sent, and the server checks the token"
category: Storefront platform
year: Aug 2022 – Jul 2026
context: inSales
role: "Owned everything except the server-side token check"
stack: [JavaScript, Vue, Slim, Liquid, Google reCAPTCHA, Yandex SmartCaptcha]
featured: false
order: 11
results:
  - value: "2"
    label: "captcha providers to choose from: Google reCAPTCHA and Yandex SmartCaptcha"
  - value: "3"
    label: "versions of the checkout page"
  - value: "4"
    label: "kinds of template forms: contact, reviews, comments and one-click orders"
---

## The problem

inSales is a platform where 60,000+ businesses run their online stores. On every store, buyers place orders, sign in, register, and leave reviews and requests through forms. Bots can use the same forms too, and during an attack they create hundreds of orders per second. Stores got a lot of spam through contact forms, so the captcha was made mandatory there, because what buyers send through those forms goes straight to the store’s email. That’s why Google reCAPTCHA bot protection was already enabled for the forms. It came with two problems, and solving them was my job.

The first problem was an extra click. Remember the "I’m not a robot" checkbox you have to click before sending a form? Stores on inSales had it on their forms, so every buyer who filled in a form had to make one more click. Every extra click lowers form conversion, and it hurts most on checkout.

The second problem came from Russia’s personal data law. Since July 2025, a website in Russia may not collect personal data of people in Russia using databases abroad, and fines for this can reach millions of rubles. Google reCAPTCHA sends data about every visitor to Google’s servers abroad, so for a Russian online store keeping it became a legal risk. Yandex has a similar service, Yandex SmartCaptcha, that keeps the data in Russia. The idea was to let a store owner switch between the two providers with one setting.

But my work on the captcha started earlier, in 2022, with a performance problem.

## My role

I owned the whole project except the server-side token check, which a backend developer built. I agreed with that developer on what each form sends. My part covered the store and platform forms, the setting for choosing the captcha, the storefront JavaScript library, the widgets, the documentation for store developers, testing with QA and the release. In 2022 I made the captcha load lazily, in 2023 I rolled out the invisible Google captcha, and the choice between Google and Yandex in August 2025, and maintained the feature until July 2026.

I was responsible for the captcha across the whole project, so colleagues often came to me with questions. When sign-in moved to another team, I still handled the captcha in those forms.

## What I built

### Lazy loading for the captcha

In 2022 I found that the Google reCAPTCHA script loaded several times on every store page, even on pages with no forms: from 3 to 10 times. The script weighs about 150–200 KB, so every page load could pull in an extra 600 KB or more of scripts, which slowed down clients’ store pages. reCAPTCHA itself caused half of the extra loads, and we caused the other half: both the server-side templates and the storefront JavaScript library added the captcha. I made the captcha load lazily: the script loads once, and in latest-generation templates only when the form appears on screen. For clients this meant faster store pages, which also improved their Google PageSpeed scores.

### An invisible captcha instead of the checkbox

Google also offers an invisible version of the same captcha: it runs when you click Send and determines whether you’re human without asking for an extra click. I switched the forms on stores to that version, so a buyer fills in the form, clicks Send, and the check happens automatically.

![The same contact form before, with the "I’m not a robot" checkbox and a Send button, and after, with only the Send button](/images/work/form-protection/form-checkbox-before-after.svg)

The captcha in the browser isn’t enough. When the check passes, Google returns a token, which is sent to the server together with the form and confirms that the check was passed. The server verifies the token by sending a request to Google and accepts the data only if the token is valid. A bot that skips the page and sends an order straight to the server has no valid token, so the server returns an error. And if the buyer’s actions look suspicious, they get the famous fire hydrant challenge.

![A buyer clicks Send, Google or Yandex returns a token, the form sends the data and the token, the server verifies the token and accepts the request. A bot skips the page, sends a request without a valid token, and the server returns an error](/images/work/form-protection/server-check.svg)

### The Google badge in the corner of the screen

The invisible captcha has no checkbox, but Google shows a small badge. The manager responsible for the project wanted to remove it. It turned out you couldn’t just hide the badge: with `display: none` the captcha stops working, and other ways of hiding it break Google’s terms. Google allows hiding the badge only if the page has text saying it’s protected by reCAPTCHA, with links to Google’s policies, so the idea came up to add that text to the footers of clients’ sites. I was against it: the footer is part of the client’s site design, and the added text could spoil it or break the layout. A badge in the corner of the screen doesn’t touch the design, so I suggested keeping it. We fixed it in the bottom-left corner, because stores usually have chat and "Back to top" buttons on the right. A page has one badge, however many forms it has.

### One setting for the store owner

I suggested a setting in the store settings where the owner picks Google or Yandex. Making that setting work in every form was the hard part, because a store has two kinds of forms and each needed its own work.

System forms are part of the platform: sign-in to the customer account, registration and checkout. Their code lives in inSales, not in the store’s template code, which the owner can edit. So they are the same on every store, whatever its design. The customer account and checkout each have three versions. The first two are server-side Slim templates, and the third, newest one is written in Vue. I added Yandex SmartCaptcha to both the Slim templates and the Vue versions, so these forms got the choice on every store at once.

Template forms are the contact, review, comment and one-click order forms inside the store’s template. Here everything depended on the generation of the store’s template, and inSales has had four:

- In the first generation, forms like contact and reviews were built directly into the template code, so store owners had to update them with their own developers or with help from our support engineers.
- In the second generation, the forms were also built into the template code, so the owner needed to update them too. But these templates included inSales’s shared storefront JavaScript library by default, which made the update easier: replace the form with a ready-made form component from the library, or add the captcha to their own form through the library’s API. Both the components and the API work with Google and with Yandex.
- The third generation was built in Vue. It isn’t available to store owners.
- The fourth generation is built from widgets. A store owner adds, say, a contact form widget. System widgets updated automatically, and custom widgets needed to be updated manually by the owner.

So I added Yandex SmartCaptcha to the form components of the storefront JavaScript library and to the fourth-generation system widgets. For custom forms, I added captcha APIs for Google and Yandex to that library and wrote documentation, so store developers could add either captcha themselves (more on that below). As a result, the owner picks the captcha in one setting, and the choice works at once in the system forms, the library’s form components and the system widgets.

![System forms got the choice automatically on every store. In first- and second-generation templates, the owner updates the forms in the template code manually; in the second generation it’s easier with the ready-made components or captcha API of the storefront JavaScript library. The third generation is not available to store owners. In the fourth generation, system widgets update automatically, while custom widgets have no captcha at all after switching to Yandex until the owner updates their code. Store developers update custom forms using our documentation](/images/work/form-protection/forms-by-template-generation.svg)

### The platform’s own forms

The law applied not only to the stores but to the inSales platform itself, so Yandex SmartCaptcha had to be added to the platform’s own forms too. Store owners sign in to inSales and recover their access through those forms, and they used Google reCAPTCHA as well. But the law only covers users in Russia: in the Russian version of the platform I replaced Google reCAPTCHA with Yandex SmartCaptcha, while the versions for Ukraine and Kazakhstan kept Google reCAPTCHA on sign-in. So the platform’s forms had to support both captchas and show the right one for the account’s country.

### Bugs buyers ran into

**Each captcha belongs to one form.** One page can have several forms. Say a buyer sends the contact form, gets a challenge and closes it. Then they write a review and pass the captcha there. In the old code both forms waited for the same answer from the captcha, so the captcha passed in the review could send the contact form instead. I tied every captcha to the form that asked for it.

![Before: a buyer closed the challenge in the contact form and passed the captcha in the review form, and the contact form was sent. After: the review is sent, because each captcha is tied to the form that asked for it](/images/work/form-protection/two-forms-one-page.svg)

**The Send button that did nothing.** Sometimes a page loaded the Yandex script twice: once for a system form and once for a store widget. The second copy of the script didn’t know about the captchas the first one had already created, and the buyer got a Send button that did nothing. It happened only when the parts of the page loaded in a certain order, so the bug sometimes appeared and sometimes didn’t. I made every part of the page reuse the script that was already there.

**A closed challenge no longer blocks the form.** If a buyer closed the Yandex SmartCaptcha challenge, the form stayed stuck in "sending" forever. Now they can just try again, and a form that waited too long gets a fresh captcha.

**Bugs in Yandex SmartCaptcha itself.** Both bugs were in Yandex SmartCaptcha. In Safari, after the captcha was passed, the next click anywhere on the page made it jump to the top. On some Android phones the keyboard covered the field inside the challenge, and this couldn’t be fixed on our side. I reported both bugs to Yandex with a test page and a video, but neither has been fixed.

**The Safari workaround that broke the checkbox.** I worked around the Safari jump on our side: after a successful pass, the captcha was removed and drawn again. That worked for the invisible captcha, because nobody sees it redraw. But the captcha component I built lets any developer make the captcha visible, with the "I’m not a robot" checkbox. Only a few stores did that, and that’s how we found the problem: the buyer ticked the box, the captcha redrew right away, and the tick disappeared together with the pass. So I kept the redraw only for the invisible captcha. The checkbox captcha now only removes focus from itself, and the tick stays.

### Testing

Because we tested in different browsers, QA ended up with 76 tests, each with a 14-item checklist: customer accounts, three versions of checkout, widgets, Windows, macOS, mobile devices and accounts outside Russia. Two testers ran every form. The testing was worth it: we found and fixed many bugs in forms that at first seemed to work correctly.

### Documentation for store developers

Many stores have forms written by their own developers. For them I published documentation with examples for adding either captcha through the API of the storefront JavaScript library: [Google reCAPTCHA](https://docs.liquidhub.ru/%D0%9F%D1%80%D0%B8%D0%BC%D0%B5%D1%80%D1%8B%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B%20%D1%81%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D0%BC%D0%B8%20%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D0%B0/Captcha/Google%20reCAPTCHA/recaptcha-common/) and [Yandex SmartCaptcha](https://docs.liquidhub.ru/%D0%9F%D1%80%D0%B8%D0%BC%D0%B5%D1%80%D1%8B%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B%20%D1%81%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D0%BC%D0%B8%20%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D0%B0/Captcha/yandex_captcha/#_2).

## Results

- Store pages load faster: the captcha script loads once, and only when the form appears on screen.
- Buyers send forms without the extra "I’m not a robot" click.
- Store owners choose between Google and Yandex with one setting, and the choice works at once in the system forms, the library’s form components and the system widgets.
- In the Russian version of the platform, store owners sign in to inSales and recover their access through forms protected by Yandex SmartCaptcha; the versions for Ukraine and Kazakhstan kept Google reCAPTCHA.
- The captcha works in 3 versions of checkout, 3 versions of the customer account, and the contact, review, comment and one-click order forms.
- Store developers can add either captcha to their own forms using the published documentation.

## Limits

The choice didn’t start working on its own in forms built into first- and second-generation template code, in custom forms or in custom widgets. Custom widgets were the worst case: after switching to Yandex, such a form showed no captcha at all, because its code lacked the condition that picks which captcha to show. In September 2025 inSales warned its clients about this in an announcement that listed which forms would update automatically and which the store owner had to update, using the documentation above.
