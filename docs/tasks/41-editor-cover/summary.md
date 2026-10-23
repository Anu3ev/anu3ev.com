# 41 — The editor on the home cover

From the external portfolio review: the cover showed abstract stripes, while the owner builds visual editors. "The site should look like the work of someone who builds editors." The owner pointed to his LinkedIn covers, which pair a headline with an editor window, and asked not to do anything he wouldn't.

**Image.** The LinkedIn cover's editor window was AI-generated (its prompt is in the covers folder), so it is a recreation, not the real product. The site uses a real image instead: a 2× screenshot of the **public live demo** of the open-source engine, taken on 2026-10-23 right after "Load sample composition". It shows the selected headline with its handles, the rotate control and the floating toolbar. The product editor's own screenshot was not used, because it is already the featured case card just below. The file is `public/images/editor-cover.webp`, 800 × 429, 10 KB.

**Layout.**
- The cover keeps its colour band and label ("Browser editors"). The stripes are replaced by a framed window on the right showing the screenshot.
- The window ends 32 px above the cover's bottom, so the avatar and "Let's talk" keep their shared line and never sit on the image.
- The cover is 196 px tall on desktop (was 164) and 184 px on phones (was 142). On phones the window starts below the label row, because the Russian label is long.
- The window links to the live demo, in a new tab, named "Open the live demo of my image editor". This gives the review's "demo in the hero" without embedding a heavy, desktop-first app. The URL comes from the open-source case's `demo` field.

**Tests.**
- The cover test now checks, in both languages and three frames, that the label and the window never overlap, that the window ends above the button, and that the button still shares the avatar's line.
- A new test checks the demo link's name, URL, new tab and loaded image.
- The spacing test's geometry exception for the old stripes was removed.

The first version of the phone layout let the Russian label run under the window; extending the test to both languages caught it.
