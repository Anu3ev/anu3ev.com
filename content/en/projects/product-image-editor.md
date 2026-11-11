---
title: A product image editor inside the inSales admin, built in Vue
description: "Marketplaces rejected product photos, and merchants paid designers or services for images. I built a Vue infographics editor into the inSales product page: templates, AI background removal, saved projects and one design applied to up to 10 photos. Used by 3,000+ active clients."
locale: en
slug: product-image-editor
published: true
cover: /images/work/product-image-editor/user-template-created.webp
coverAlt: The inSales image editor with the My templates panel open and a sneaker infographic on the canvas after a user template was created
category: Browser editors
year: Mar 2025 – Sep 2026
context: inSales
role: "Owned the product frontend; a backend developer built the server side"
stack: [Vue 3, TypeScript, FabricJS, Composition API, SCSS, Mixpanel]
featured: true
order: 1
results:
  - value: "3,000+"
    label: active inSales clients use the editor, according to product analytics
  - value: "800+"
    label: "AI operations a day in the editor: background removal, quality improvement and text generation"
  - value: "2–3 min"
    label: "to apply one set of edits to 10 product photos with bulk transfer, instead of 5–10 min by hand"
---

## The problem

Marketplaces like Ozon, Wildberries and Yandex Market reject product photos that don’t meet their rules, and in 2025 the large marketplaces were moving to tall photos with a 3:4 ratio. On inSales, a merchant has one product page for the website and every marketplace, so the same photos go everywhere. So merchants got "Incorrect product photo size" errors and paid a designer, a freelancer or a service like MPCard (up to about $110 a month) to make the images.

The product page only had a simple CropperJS editor, which I had also built: it could crop a photo to the right ratio, but not make an infographic. Merchants needed an editor right in the product page where they choose a marketplace format, remove the background, add text and badges from ready-made templates, and save the project, so they can change the text later instead of making the image again.

## My role

I owned the product frontend: the Vue app architecture, the interface from the designer’s mockups, saving projects, the AI features, templates, bulk transfer (applying one photo’s design to other photos), Mixpanel analytics, specs and test cases for QA. A backend developer built the server side, and I agreed on the API contracts with him. The team also had my manager, the manager responsible for the editor, a designer and a QA engineer. I ran the weekly editor meeting: I brought people together, wrote up the decisions and dates after each call, and created tasks for the backend developer.

Much of the editor’s behavior was my own idea rather than something in a task: keyboard shortcuts, Ctrl-click selection and other familiar habits from tools like Canva. When a decision was unclear, I checked competitors. For example, we had to decide what happens to an image’s rotation angle when it is stretched to fill the output area. I looked at mpcard.ai, supa.ru and canva.com: all of them reset the angle, so we did the same.

I moved the canvas work into a [separate open-source library in TypeScript and FabricJS](/work/image-editor/), which I started for this editor. This case is about the product built on top of it: the interface, saving, the AI features and everything between clicking the edit button and a saved product page.

## What I built

### The editor opens from the product page

A merchant clicks the edit button on a product photo, and the editor opens full screen. There they can pick a ready-made marketplace size, apply a template, remove the background, and add text, shapes and photos from the Unsplash photo library. Another photo of the same product opens from the bottom panel without closing the editor.

![The inSales image editor with the My templates panel open and a sneaker infographic on the canvas after a user template was created](/images/work/product-image-editor/user-template-created.webp)

The product team prepares system templates: when a merchant applies one, the product photo goes into the place reserved for it, and the text and badges keep their styles and positions. A merchant can also save their own design as a template and apply it to other products.

The editor was rolled out in stages: to new stores on 25 December 2025 and to all stores on 13 May 2026. According to product analytics, more than 3,000 active inSales clients use it.

### The project isn’t lost if the merchant doesn’t save the product page

Besides the final image, the editor saves the image’s project: images, text, object positions and styles. The difficulty was that saving has two steps. First the merchant clicks Save in the editor, then they save the product page itself. An image is product data, like the description or the price, so its changes are confirmed with the main Save button of the product page. Otherwise unfinished images could end up on the website.

So a merchant can save an image in the editor and then close the product page without confirming the changes. In that case, the draft project must not replace the project of the published image. The first idea was simple: after saving in the editor, unlink the project from the old image. I described, step by step, a case in which this approach lost the project forever, and suggested keeping two versions of the project for each image, a confirmed one and a draft, so that an image and its project always match, like a PSD file and the JPG exported from it. My manager and the backend developer agreed.

Now saving in the editor creates a new version of the image with a draft project, and only saving the product page makes the draft the confirmed one. The editor always opens the confirmed version, so if the merchant closes the product page without confirming, the previous image and its project stay as they were. Saving projects went to production on 2 March 2026.

### I fixed a bug in the undo history the night before the rollout

The rollout to new stores fell right before the New Year code freeze, when nothing new goes to production, and an editor demo was planned for 25 December 2025. On 24 December I was fixing a bug in the undo history: it counted technical events, like resizing the browser window, as changes, so undo and redo worked incorrectly. I made the editor drop such events before they reached the history. The deployment kept failing that evening, and the fix went out only on 25 December, and the editor was shown at the demo that day.

### Saving large images stopped failing with a 504 error

In March 2026, on a client’s store, saving large images hung for a long time and then failed with a 504 error: the server didn’t respond in time. The company had an infrastructure outage that day, but I reproduced the error locally, so the outage wasn’t the cause. The server couldn’t process a large file and pass it to storage within a single request. So the server started processing the file as a separate job after replying, and the editor asked the server every 1.5 seconds whether the file was ready. While saving runs, usually for 5–10 seconds, editing on the canvas is disabled, so the merchant can’t change a project the server is still processing.

Then a second problem appeared. In production, an 8–9 MB image processed by the AI feature that improves image quality never became ready: the editor checked its status 60 times, once every 1.5 seconds, and stopped after 90 seconds. Together with the backend developer, we found the cause: the server-side image optimizer took too long on large 4K PNG files. After the fix on 5 May 2026, even a 17 MB file uploaded right away.

The large-file bugs also delayed the rollout. When my manager suggested rolling the editor out to all stores in March, I asked to wait, because the editor would fail on large images. It was rolled out on 13 May, after the upload fix.

### Background removal needed ready-made backgrounds

The editor has four AI features: quick and more precise background removal, quality improvement, and text generation. While a feature runs, editing on the canvas is disabled and progress is shown on the image itself. The result replaces the old object and keeps its size and position.

![The editor during AI background removal: the image shows a processing overlay and the toolbar is disabled](/images/work/product-image-editor/ai-processing-locked-editor.webp)

In September 2025 my manager asked what I thought of the AI features in the editor. I said that quality improvement tended to blur the image and that only background removal worked really well, and suggested keeping only that. We agreed that a product with its background removed needs ready-made backgrounds, which gives background removal a clear use. I created the task the same day, and the backgrounds panel went to production on 20 September.

The AI service has limited capacity: it handles about 30,000 images a day. We set a daily limit per account based on that number, about 10,000 new stores a month and an estimate that about 20% of them would use the AI features: 50 requests a day, shared between text generation and image processing.

In December 2025, sign-in to the AI service stopped working in Safari, and it couldn’t be fixed quickly. So the team considered turning off the whole editor in Safari for a while. Everything else in the editor worked in Safari, so I suggested hiding only the AI features there, and that’s what we did.

Since the rollout to all stores, the AI features in the editor run 800 or more times a day.

### One photo’s design applied to the product’s other photos

A product usually has several photos, and they all need the same design. The merchant designs one photo, selects up to 10 others in the bottom panel and starts the transfer, with background removal if they want it. The editor applies the design to each photo in turn and saves both the image and its project. By hand, the same edits for 10 photos took 5–10 minutes; with bulk transfer they take 2–3.

![Bulk transfer mode: three target product photos selected under the source composition, with the Cut out the background toggle on](/images/work/product-image-editor/bulk-transfer-select-targets.webp)

Each new feature added a large flow to the editor’s root component: AI processing, templates, cropping, saving, transfer. The component grew to about 3,500 lines, so I split its logic by feature into 22 composables, which are functions of the Vue Composition API. The transfer itself made the split harder: it runs a hidden editor that processes the other photos while the merchant sees only the visible one, and their state must not mix, so each composable works with one specific editor instance.

The transfer can be canceled at any time. If a photo is already being processed, the queue stops after it, and the photos not yet processed leave the queue right away. If the merchant changes the source design while choosing photos, the transfer mode closes, so an outdated version is never applied.

### One editor in the product page and in the visual site editor

At first the image editor was tied to product photos. So that merchants could also edit website images with it in the [visual site editor](/work/visual-storefront/), where the store’s design is set up, I moved the product logic out of the shared component. Now the part of the admin that opens the image editor passes it the image, the list of available images, the function that saves the result and the recommended crop ratios.

![The same editor opened from the visual site editor, cropping a banner image to a recommended ratio](/images/work/product-image-editor/site-editor-banner-crop.webp)

Which features are available depends on where the editor is opened: text generation from product data exists only in the product page, and saving a website image creates a new file, leaving the original unchanged. The visual site editor runs one image editor instance per page, so it doesn’t create several heavy instances, one for each image field. This went to production on 31 August 2026.

## Results

- Merchants make marketplace images right in the product page and can come back to the project to change the text instead of making the image again.
- The editor has been available to all stores since 13 May 2026. According to product analytics, more than 3,000 active inSales clients use it.
- The AI features in the editor run 800 or more times a day.
- The same edits for 10 photos take 2–3 minutes instead of 5–10.
- Since 31 August 2026, merchants also edit website images in the visual site editor with the same editor.

## Where to try it

The editor is desktop-only: it was tested with test cases I wrote in Chrome, Firefox and Safari on Windows and macOS, and the button that opens it is hidden on phones. Anyone can try it: create a store on inSales, add a product, upload a photo and open the editor from the product page in a desktop browser. Without signing up, you can try the [open-source library](/work/image-editor/) it runs on: open the [live demo](https://anu3ev.github.io/image-editor/) or read the [source code on GitHub](https://github.com/Anu3ev/image-editor).
