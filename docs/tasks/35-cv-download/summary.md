# 35 — CV download

From the external portfolio review: the site had no CV anywhere, and a CV is the first thing a recruiter looks for.

**Phone number.** Both CVs listed the owner's phone. On 2026-10-23 he chose one CV version without a phone for every use, rather than separate public and private versions. Done outside the repo:
- The `tailor-alexander-resume` skill now requires a contact block without a phone: source in Obsidian, installed copy synced and validated.
- Its canonical CV, the English and Russian CV sources in «Поиск работы/Резюме» and the detailed resume (`alexander-human-resume`) no longer carry the phone. The Russian CV now has the site link instead, as the skill requires.
- All three PDFs were regenerated with the same headless Chrome and fonts: page counts unchanged, text extraction in order, no phone left.
- The phone remains only in the skill's candidate profile, for application forms that ask for it.

**Site.**
- `profile.json` has `cv_en` and `cv_ru`, which are CMS file fields. The build fails if a CV is not an existing PDF in `public/cv`.
- Home: a primary "Download CV" / «Скачать резюме» button under the location line. "Let's talk" stays on the cover line, because two wide buttons there would overflow a phone in Russian.
- Contacts: "Download CV" next to "Send me an email".
- Each language links its own CV. The link is a same-tab `download` with `type="application/pdf"`, following the site rule that only external links open new tabs.

**Tests.**
- Unit: a missing CV fails the content check.
- E2e `cv.spec.ts`:
  - the English home page and the Russian Contacts page link the right CV, with a download and no new tab;
  - both files are served as `application/pdf`;
  - neither file contains a `tel:` link.

Screenshots were checked at 402 px (EN/RU) and 1440 px.
