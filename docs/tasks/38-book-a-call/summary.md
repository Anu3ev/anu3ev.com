# 38 — Book a call

From the external portfolio review: "Let's talk" led to a page with contacts, but there was no way to book time directly.

**Booking page.** The owner's Calendly page (`calendly.com/alexander-s-anufriev/new-meeting`) was checked in a browser on 2026-10-23: a working 30-minute video call with open slots. The event is still named "30min". Renaming it, for example to "Intro call", is a suggestion for the owner, since recruiters see that title.

**Site.**
- `profile.json` has `calendly`. The schema accepts only `https://calendly.com/…` links, and it is editable in the CMS.
- Home: "Book a call" / «Созвониться» as a secondary button next to "Download CV".
- Contacts: the first row of "Find me elsewhere": "Book a call — 30-minute video call".
- It is an external link: new tab, `rel="noopener noreferrer"`.

**Test.** `book-call.spec.ts`: on Home and Contacts in both languages, the link has its visible name, points to the Calendly URL from settings and opens in a new tab. The site-wide external-link test also covers it.
