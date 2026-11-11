---
title: Invisible captcha for store forms, with a choice between Google reCAPTCHA and Yandex SmartCaptcha
description: The Google reCAPTCHA script loaded 3–10 times on inSales store pages, buyers had to click "I’m not a robot", and from July 2025 the captcha became a legal risk in Russia. I made it load lazily, moved the forms to its invisible version and added Yandex SmartCaptcha as an option.
locale: en
slug: form-protection
published: true
cover: /images/work/form-protection/invisible-captcha-submit-flow.svg
coverAlt: "Diagram: the buyer clicks Send, the form checks its fields, the invisible captcha determines whether this is a human or a bot, only this form is sent, and the server checks the token"
category: Storefront platform
year: Aug 2022 – Jul 2026
context: inSales
role: "Owned everything except the server-side token check"
stack: [JavaScript, Vue, Slim, Liquid, Google reCAPTCHA, Yandex SmartCaptcha]
featured: false
order: 11
results:
  - value: "3%"
    label: "conversion growth in store forms after switching to the invisible Google reCAPTCHA"
  - value: "2"
    label: "captcha providers to choose from: Google reCAPTCHA and Yandex SmartCaptcha"
  - value: "3"
    label: "versions of the checkout page"
  - value: "4"
    label: "kinds of template forms: contact, reviews, comments and one-click orders"
---

## The problem

inSales is a platform where 60,000+ businesses run their online stores. In every store, buyers order products, sign in to their account, and leave reviews and requests, all through forms. Bots can use the same forms too, and during an attack they create hundreds of orders per second. Stores also got a lot of spam through contact forms, so the captcha was made mandatory there. That’s why the forms were already protected by Google reCAPTCHA.

That captcha had three problems, and solving them was my job:

1. The captcha script loaded 3–10 times on every store page, so pages loaded more slowly.
2. Before sending any form, the buyer had to click an extra checkbox: "I’m not a robot".
3. From July 2025, keeping Google reCAPTCHA on a Russian online store became risky because of a new personal data law.

## My role

I owned the whole project except the server-side token check, which a backend developer built. I agreed with that developer on what each form sends. My part covered the store and platform forms, the setting for choosing the captcha, the [storefront JavaScript library](/work/commonjs-storefront-library/), the widgets, the documentation for store developers, testing with QA and the release. In 2022 I made the captcha load lazily, in 2023 I rolled out the invisible Google reCAPTCHA, in August 2025 I added the choice between Google reCAPTCHA and Yandex SmartCaptcha, and I maintained the feature until July 2026.

I was responsible for the captcha across the whole project, so colleagues often came to me with questions. A QA engineer used my explanations to write tests for the updated captcha. When sign-in moved to another team, I still handled the captcha in those forms. In June 2026, a developer from the department that builds paid custom features for store owners needed to add Yandex SmartCaptcha to older templates. The team lead brought this to me with the words "Who else could do it?"

## What I built

### Lazy loading for the captcha

In August 2022 I found that the Google reCAPTCHA script loaded several times on every store page, even on pages with no forms. A page without forms loaded it 3 times, a page with a contact form and a one-click order form 8 times, and a page with two form widgets 10 times. The script weighs about 150–200 KB, so every page could download 600 KB or more of extra scripts, which made the stores slower.

There were two causes. About half of the extra loads came from Google reCAPTCHA itself: it runs in several frames, and Google’s bug tracker has had open issues about this since 2019. We caused the other half: the captcha was added both by the server-side page templates and by the storefront JavaScript library, inSales’s shared library with ready-made form components.

I removed the extra loads that we caused. Before adding the script, the library now checks whether it’s already on the page, and if it is, doesn’t load it again.

In the latest-generation templates, only the library loads the script, and only when the form appears on screen. For this I used the Intersection Observer API: it reports when the form enters the visible part of the page.

For store owners this meant faster pages, because the heavy captcha scripts load only after the form appears on screen, and it also improved their stores’ Google PageSpeed scores.

### An invisible captcha instead of the checkbox

Every extra click lowers form conversion, and it hurts most on checkout. So we decided to remove the "I’m not a robot" checkbox.

Google also offers an invisible version of the same captcha: it runs when the buyer clicks Send and determines whether it’s a human or a bot. In October and November 2023 I moved the checkout, registration, sign-in, password recovery, contact, review, comment and one-click order forms to that version. Now a buyer fills in the form, clicks Send, and the check happens automatically.

![The same contact form before, with the "I’m not a robot" checkbox and a Send button, and after, with only the Send button](/images/work/form-protection/form-checkbox-before-after.svg)

The captcha in the browser isn’t enough. When the check passes, Google returns a token, which is sent to the server together with the form and confirms that the check was passed. The server verifies the token by sending a request to Google and accepts the data only if the token is valid. A bot that skips the page and sends an order straight to the server has no valid token, so the server returns an error. And if the buyer’s actions look suspicious, they get a challenge: the famous test where you select all the fire hydrants.

![A buyer clicks Send, the invisible Google or Yandex captcha returns a token, the form sends the data and the token, the server verifies the token with Google or Yandex and accepts the request. A bot skips the page, sends a request without a valid token, and the server returns an error](/images/work/form-protection/server-check.svg)

So even with the invisible captcha, a buyer may see a challenge, close it or get an error. That’s why the captcha had to work correctly in all these cases, not only when the token arrived right away.

I built the captcha into the existing form submission code: the form first checks its fields, then gets the token, and only then is sent. Without a token the form isn’t sent, and what the buyer typed isn’t lost if the token doesn’t arrive right away. AJAX forms send data without reloading the page. The usual handler would have sent them like a regular form and opened a new page, so I wrote a separate handler that sends them in the background once the token arrives.

Also, not every form turned on the captcha the same way. For example, password sign-in could require it only after several failed attempts. So moving to the invisible captcha wasn’t just replacing the "I’m not a robot" element: the conditions for showing the captcha had to stay, and after the check the form had to finish the action the buyer started, such as signing in or placing an order.

### The Google badge in the corner of the screen

The invisible Google reCAPTCHA has no "I’m not a robot" checkbox, but a small Google badge appears in the corner of the screen. The manager responsible for the project wanted to remove it completely, because, in his words, the captcha directly affects both conversion and how the site looks.

It turned out you couldn’t just hide the badge. With `display: none` the captcha stops working, and hiding it with `visibility: hidden` and zero height breaks Google’s terms: the badge must be visible to visitors. [Google allows hiding it](https://developers.google.com/recaptcha/docs/faq) only if the page has text saying the site is protected by Google reCAPTCHA, with links to Google’s privacy policy and terms of service. So someone suggested adding that text to the footers of store owners’ sites.

I was against it. The footer is part of the store’s design. Text added without the owner’s consent could spoil it or even break the layout. Besides, a store owner could delete the footer widget or edit its code and break Google’s terms again without knowing it. A badge shown on top of the page in the corner of the screen doesn’t affect the store’s design, so I suggested keeping it.

Then we had to choose a corner. Stores usually have chat and "Back to top" buttons in the bottom-right corner, and the left side rarely has them. After discussing it with the team lead and the manager, we put the badge in the bottom-left corner of the screen. A page has one badge, however many forms it has. I rolled out this change, and the designer said it looked much better.

### Yandex SmartCaptcha because of the personal data law

Since 1 July 2025, a website in Russia must not collect personal data of people in Russia using databases abroad (Article 18(5) of Federal Law 152-FZ), and fines for this can reach tens of thousands of dollars. Google reCAPTCHA sends data about every visitor to Google’s servers abroad, so keeping it on a Russian online store became risky. In June 2025 the product team reported that store owners were worried about a foreign service processing personal data.

Yandex has a similar service, Yandex SmartCaptcha, which keeps the data in Russia. It works the same way as Google reCAPTCHA: it checks the visitor and returns a token, which the site sends to the server together with the form data. The idea was to let a store owner switch between the two providers with one setting, without reworking every form themselves.

### One setting for the store owner

I suggested the captcha setting and built it under "Settings → Store profile". The chosen captcha takes effect on the next page load: a form that is already open doesn’t swap its captcha, so one service’s captcha never mixes with the other’s while the buyer fills in the form.

Making this setting work in every form was the hard part, because a store has two kinds of forms and each needed its own work.

System forms are part of the platform: sign-in to the customer account, registration and checkout. Their code lives in inSales, not in the store’s template code, which the owner can edit. So they are the same in every store, whatever its design. The customer account and checkout each have three versions. The first two are server-side Slim templates, and the third is written in Vue. I added Yandex SmartCaptcha to both the Slim templates and the Vue components, so in these forms the choice worked in every store right away.

Template forms are the contact, review, comment and one-click order forms inside the store’s template. If the store owner was happy with Google reCAPTCHA, nothing had to change in these forms. They only needed an update if the owner wanted Yandex SmartCaptcha to work in them. Here everything depended on the generation of the store’s template, and inSales has had four:

- In the first generation, the contact, review and other forms were built directly into the template code, so store owners had to update them with their own developers or with help from our support engineers.
- In the second generation, the forms were also built into the template code, so the owner needed to update them too. But these templates included inSales’s shared storefront JavaScript library by default, which made the update easier: the owner could replace the form with a ready-made form component from the library, or add the captcha to their own form through the library’s API. Both the components and the API work with Google reCAPTCHA and with Yandex SmartCaptcha.
- The third generation was built in Vue. It was later removed from the platform for every store.
- The fourth generation is built from widgets. A store owner adds, say, a contact form widget. System widgets come from inSales, and custom widgets are widgets whose code the store’s developers changed. System widgets updated automatically, and the owner has to update custom widgets.

So I added Yandex SmartCaptcha to the form components of the storefront JavaScript library and to the fourth-generation system widgets. For custom forms, the library already had its own API for adding Google reCAPTCHA, which I had built in 2023. I added the same kind of API for Yandex SmartCaptcha and wrote documentation, so store developers could add either captcha themselves (more on that below). As a result, the owner picks the captcha in one setting, and the choice works right away in the system forms, the library’s form components and the system widgets.

![System forms got the choice automatically in every store. To use Yandex SmartCaptcha in first- and second-generation templates, the owner updates the forms in the template code manually; in the second generation it’s easier with the ready-made components or captcha API of the storefront JavaScript library. The third generation was removed from the platform for every store. In the fourth generation, system widgets update automatically, while custom widgets have no captcha at all after switching to Yandex SmartCaptcha until the owner updates their code. Store developers update custom forms using our documentation](/images/work/form-protection/forms-by-template-generation.svg)

### Documentation for store developers

Many stores have forms written by their own developers. For them I published documentation with examples for adding either captcha through the API of the storefront JavaScript library: [Google reCAPTCHA](https://docs.liquidhub.ru/%D0%9F%D1%80%D0%B8%D0%BC%D0%B5%D1%80%D1%8B%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B%20%D1%81%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D0%BC%D0%B8%20%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D0%B0/Captcha/Google%20reCAPTCHA/recaptcha-common/) and [Yandex SmartCaptcha](https://docs.liquidhub.ru/%D0%9F%D1%80%D0%B8%D0%BC%D0%B5%D1%80%D1%8B%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B%20%D1%81%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D0%BC%D0%B8%20%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D0%B0/Captcha/yandex_captcha/#_2) (both in Russian).

### The platform’s own forms

The law applied not only to the stores but to the inSales platform itself, so Yandex SmartCaptcha had to be added to the platform’s own forms too. Store owners sign in to inSales and recover access to their accounts through those forms, and these forms also used Google reCAPTCHA. But the law only covers users in Russia: in the Russian version of the platform I replaced Google reCAPTCHA with Yandex SmartCaptcha, while the versions for Ukraine and Kazakhstan kept Google reCAPTCHA on sign-in. So the platform’s forms had to support both captchas and show the right one for the account’s country.

### Bugs buyers ran into

**Each captcha belongs to one form.** One page can have several forms. Say a buyer sends the contact form, gets a challenge and closes it. Then they write a review and pass the captcha there. In the old code both forms waited for the same answer from the captcha, so the captcha passed in the review could send the contact form instead. I tied every captcha to the form that asked for it.

![Before: a buyer closed the challenge in the contact form and passed the captcha in the review form, and the contact form was sent. After: the review is sent, because each captcha is tied to the form that asked for it](/images/work/form-protection/two-forms-one-page.svg)

**The Send button that did nothing.** Sometimes a page loaded the Yandex SmartCaptcha script twice: once for a system form and once for a store widget. The second copy of the script created a new `window.smartCaptcha` object, which didn’t know about the captchas the first copy had already rendered. The buyer got a Send button that did nothing. It happened only when the parts of the page loaded in a certain order, so the bug sometimes appeared and sometimes didn’t. Now the script loads once, and every part of the page uses it.

**A closed challenge no longer blocks the form.** While a request is running, the form blocks a second submission, so the buyer doesn’t click the button twice by accident. But waiting for the captcha isn’t the same as sending the order: if a buyer closed the Yandex SmartCaptcha challenge, the form stayed stuck in "sending". Now, after closing the challenge, the buyer can send the form again, and if the form waits too long, the captcha runs again.

**Bugs in Yandex SmartCaptcha itself.** Two bugs were in Yandex SmartCaptcha, not in our code. In Safari 18.4, after the captcha was passed, `document.activeElement` (the element that has focus) wasn’t reset, so the next click anywhere on the page scrolled it to the top. On some Android phones the keyboard covered the field inside the challenge, and this couldn’t be fixed on our side. I reported both bugs to Yandex Cloud support with a test page and a video, but neither has been fixed.

**The Safari workaround that broke the checkbox.** I worked around this Safari bug on our side: after the buyer passed the captcha, it was removed and redrawn. That worked for the invisible captcha, because nobody sees it redraw. But the captcha component I built lets any developer make the captcha visible, with the "I’m not a robot" checkbox. Only a few stores did that, and that’s how we found the problem: the buyer clicked the checkbox, the captcha redrew right away, and the checkmark disappeared together with the token. So I kept the redraw only for the invisible captcha. The checkbox captcha now only removes focus from the iframe it is rendered in, and the checkmark stays.

### Testing and release

For Yandex SmartCaptcha I turned on a test mode with a mandatory challenge. That way we could test not only the case where the buyer gets the token without noticing, but also opening, closing and passing the challenge.

Because we tested in different browsers, QA ended up with 76 tests, each with a 14-item checklist. The testing covered customer accounts, three versions of checkout, widgets, Windows, macOS, mobile devices and accounts outside Russia. Two testers checked every form. The testing was worth it: we found and fixed many bugs in forms that at first seemed to work correctly.

The changes were rolled out in stages, behind a feature flag: the captcha setting couldn’t be made available to all stores until the forms that depend on it were ready. On 26 August 2025 I shipped the main release, published the documentation and prepared an announcement for the support team.

## Results

- Store pages load faster: our code no longer adds the captcha script twice, and in the latest-generation templates the script loads only when the form appears on screen. This improved the stores’ Google PageSpeed scores.
- Buyers send forms without the extra "I’m not a robot" click. After the switch to the invisible Google reCAPTCHA, conversion in store forms grew by 3%.
- Store owners choose between Google reCAPTCHA and Yandex SmartCaptcha with one setting, and the choice works right away in the system forms, the library’s form components and the system widgets.
- In the Russian version of the platform, store owners sign in to inSales and recover access to their accounts through forms protected by Yandex SmartCaptcha; the versions for Ukraine and Kazakhstan kept Google reCAPTCHA.
- The captcha works in 3 versions of checkout, 3 versions of the customer account, and the contact, review, comment and one-click order forms.
- Store developers can add either captcha to their own forms using the published documentation.

## Limits

The choice didn’t work automatically in forms built into first- and second-generation template code, in custom forms or in custom widgets. Custom widgets were the worst case: after switching to Yandex SmartCaptcha, such a form showed no captcha at all, because its code lacked the condition that picks which captcha to show. In September 2025 inSales warned store owners about this in an announcement that listed which forms would update automatically and which ones the owner had to update using the documentation above.
