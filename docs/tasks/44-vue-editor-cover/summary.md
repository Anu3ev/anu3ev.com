# 44 — Vue editor and statement on the home cover

The owner found the cover from task 41 ugly: a beige live-demo crop floating on a flat band, which was less cohesive than the old striped cover. He asked for the Vue editor preview from his LinkedIn cover and a statement that "speaks for me", and called the "Browser editors" label meaningless.

**Image.** The window in the LinkedIn cover traces back, through its generation prompt, to a real inSales screenshot. The original, with the Background panel and swatches and the tan shoe on blue with selection handles, was found among the media embedded in the owner's Vue Product Image Editor deck (`image2.png`, 1919 × 895). The cover uses a straight crop of its left part: toolbar, panel and canvas. The UI was not composited or edited. The file is `public/images/editor-cover.webp`, 960 × 521, 27 KB. Its white and blue suit the site's palette, unlike the beige demo.

**Layout.** The owner compared two versions on a page and chose B:
- The original stripes return behind the editor window, which links to the product image editor case study (same tab).
- On the left is the LinkedIn statement: "I build complex / web applications." with "Browser editors. E-commerce tools. / AI integrations.", and in Russian «Делаю сложные / веб-приложения.» with «Браузерные редакторы, e-commerce, / AI-интеграции.». The line breaks come from the copy, so the block hugs its text. It is a paragraph, not a heading, because the name stays the page's H1.
- The "Browser editors" label is removed.
- The cover is 228 px tall on desktop. On phones it is 268 px, with the statement on top and the window below it on the right.

**Tests.** The cover test checks every frame in both languages: the statement doesn't touch the rotated stripes (hit-tested) or the window, the window stays inside the cover above the button row, and the button still shares the avatar's line. Two new tests check that the window links to the case study in each language, in the same tab, with a loaded image.

Screenshots were checked at 1440 px (EN dark, RU light) and at 402, 360 and 320 px. The first tries overlapped the stripes and broke the English headline after "web"; the test caught both.
