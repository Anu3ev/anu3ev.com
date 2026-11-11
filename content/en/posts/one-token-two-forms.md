---
title: 'Two forms waiting for one captcha: invisible captcha bugs at inSales'
description: One store page can have several forms with an invisible captcha. If they all wait for a shared answer, a captcha passed in the review form can send the contact form. A captcha answer has to go to the form that asked for it, and waiting for a token is a separate state.
locale: en
slug: one-token-two-forms
published: true
date: '2026-10-21'
cover: /images/blog/one-token-two-forms.svg
coverAlt: Diagram comparing a shared captcha answer event that sends the wrong form with a callback bound to the form that started the captcha
category: Architecture
readingMinutes: 5
tags: [CAPTCHA, Async state, Forms]
---

A buyer opens the contact form in an online store, types a question and clicks the Send button. The captcha rates the buyer’s actions as suspicious and shows a challenge. The buyer closes it, then writes a product review and passes the captcha there. In the old inSales code, the contact form could be sent at that moment, because both forms waited for the same answer from the captcha.

On inSales, more than 60,000 companies run their online stores, and in every store buyers send messages, reviews and comments through forms. I was responsible for protecting these forms from bots, except for the token check on the server. In 2023 I moved store forms to the invisible Google reCAPTCHA, and in 2025, because of the Russian personal data law, I added Yandex SmartCaptcha and a setting where the store owner chooses the captcha.

## An invisible captcha can still show a challenge

In invisible mode, the buyer doesn’t have to click the "I’m not a robot" checkbox. They fill in the fields and click the Send button. The form first validates the fields, then gets a captcha token and only then sends the data. The token confirms that the captcha was passed: the server checks it by sending a request to Google or Yandex and accepts the data only if the token is valid.

But if the buyer’s actions look suspicious, the captcha still shows a challenge, and the buyer can close it. So a form with an invisible captcha has a state that an ordinary form doesn’t have: it waits for the captcha’s answer. The bugs described below happened in this state.

## Only the form that asked gets the captcha answer

Storefront forms run on CommonJS, the inSales shared JavaScript library for storefronts. Its components send messages to each other through the `EventBus` event bus. In the early implementation, a form started the captcha and waited for its answer through a shared event on this bus:

```js
// Before (simplified): a form waits for any captcha answer on the page
function waitForCaptchaToken(widgetId) {
  return new Promise(resolve => {
    EventBus.subscribe('recaptcha:response', resolve)
    window.grecaptcha.execute(widgetId)
  })
}
```

The subscription has no link to the widget that `execute` was called for: the bus doesn’t know which form the buyer is sending and just passes on the captcha answer. The answer went to the form that had started waiting first. So the captcha passed in the review form continued sending the contact form, and the review itself wasn’t sent. Also, the bus could pass the previous captcha answer to a new subscriber. Then, after the captcha was reset, the form got the old answer and wasn’t sent.

When I moved the forms to the invisible captcha, I linked each form to its own captcha instance, token and submit handler. A form continues sending only after its own captcha answers, including on retries.

The public `reCaptchaCommon API` for custom forms written by store developers works the same way. The `executeInvisible` method takes the form itself and the function to call after the captcha answers:

```js
function sendFeedbackForm(form, token) {
  // Without a token, executeInvisible starts this form's captcha and returns null.
  // When the captcha answers, the library calls sendFeedbackForm again with this form and its token.
  token ??= reCaptchaCommon.executeInvisible(form, sendFeedbackForm, 'feedback')
  if (!token) return

  sendForm(form, token)
}
```

The third argument is the form type, and the `sendForm` function sends the form data together with the token. The form goes into `executeInvisible` and comes back to the handler with its own token, so a captcha answer can’t continue sending another form. The same rule mattered again when I added Yandex SmartCaptcha in 2025: the state of one form must not control another.

## Waiting for the captcha is not the same as sending

While a request is running, the form blocks a second submission, so the buyer doesn’t click the button twice by accident. But waiting for the captcha answer isn’t the same as a form that has already been sent. If a buyer closed the Yandex SmartCaptcha challenge, the form stayed in the "sending" state, and it couldn’t be sent again.

I fixed this in July 2025: after the challenge is closed, the form stops waiting, and the buyer can send it again. In August I also changed how Google reCAPTCHA and Yandex SmartCaptcha reset before a new submission, because a token expired if the buyer took a long time to send the form. Now, if the form waits too long, the captcha runs again and the form gets a fresh token.

I tested this with field validation errors, a reopened modal window and a repeated one-click order: in all these cases the form is sent again. For Yandex SmartCaptcha, I turned on a test mode with a mandatory challenge. That way we could test not only getting the token without the buyer noticing, but also opening, closing and passing the challenge.

## What I’d check in any form with an invisible captcha

- The captcha answer is bound to the form that started the captcha. A shared "captcha passed" event works while there is one form on the page, but a page can have several forms.
- Waiting for the captcha answer is a separate form state: a closed challenge ends the waiting, and a new submission gets a new token.
- Tests run in a mode with a mandatory challenge, so you can check opening, closing and passing it, not only getting the token without the buyer noticing.

The whole project is described in [the form protection case](/work/form-protection/).
