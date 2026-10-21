# 31 — About in the main navigation

The owner asked how to reach the About page on a phone. There was no way: the main navigation had Home, Blog, Portfolio and Contacts. About was linked only from the profile column, which shows only on wide desktop screens, and from article author cards.

**Decision.** About is the second navigation item, after Home, in the desktop sidebar and in the mobile bottom panel. Five is the usual maximum for a bottom tab bar. In Russian at 320 px the longest label, «Портфолио», still fits its column. The icon is a person outline.

**Topbar.** About gets its own title, "Experience and approach" / «Опыт и подход к работе». Before, it fell back to the home title, "A little about me". The counter now runs 01–05: Home, About, Blog, Portfolio, Contacts.

**Tests.** The layout test covers `/about/` in all three frames and expects five navigation links. The touch-navigation test also taps About.
