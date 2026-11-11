---
title: A product image editor inside the inSales admin, built in Vue
description: "Marketplaces rejected photos of the wrong size, and merchants paid designers or services for images. I built a Vue infographic editor into the inSales product page: templates, AI background removal, saved projects and one design applied to 10 photos. 3,000+ active clients use it."
locale: en
slug: product-image-editor
published: true
cover: /images/work/product-image-editor/user-template-created.webp
coverAlt: The inSales image editor with the My templates tab open in the Templates panel, a sneaker infographic in the working area and a Template created message
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
    label: AI operations a day since the rollout to all stores
  - value: "2–3 min"
    label: "to apply the same edits to 10 product photos with bulk transfer, instead of 5–10 min by hand"
---

## The problem

Marketplaces like Ozon, Wildberries and Yandex Market reject product photos that don’t meet their rules, and each marketplace has its own size requirements. In 2025 the large marketplaces were moving to tall photos with a 3:4 ratio. Ozon recommends 900×1200 for product photos, and since 30 May 2025 Yandex Market adds white borders to photos with any other ratio.

On inSales, a merchant has one product page for the website and every marketplace, so the same photos go to the website and to each marketplace. As a result, merchants got "Incorrect product photo size" errors when they exported products to marketplaces. To make a photo look as intended on a marketplace, they had to prepare images for each marketplace separately.

Merchants also wanted to add infographics to their photos to sell more. Later Ozon saw this too: in December 2025 it launched its own infographics builder.

The inSales product page only had a simple CropperJS cropping tool, which I had also built. It could crop a photo to the right ratio, but it couldn’t make an infographic. So merchants made their images outside inSales. A designer’s research in January 2025 showed how: they kept a separate employee for it, ordered images from freelancers or paid services like MPCard, up to about $110 a month.

The task came from the inSales marketplace team on 14 January 2025. Merchants needed an editor right on the product page. There they would choose a marketplace format, remove the background, add text and badges from ready-made templates, and save the project. Later they could change the text instead of making the image again. The Wildberries editor can’t do this: once an image is saved there, its changes are final.

## My role

I owned the product frontend: the Vue app architecture, the interface from the designer’s mockups, saving projects, the AI features, templates, bulk transfer of a design to other photos, Mixpanel analytics, specs and test cases for QA. A backend developer built the server side, and I agreed on the API contracts with him. The team also had my manager, the product manager, a designer and a QA engineer. I ran the weekly editor meeting: I invited the participants, wrote up the decisions and dates after each call, and created tasks for the backend developer.

Much of the editor’s behavior was my own idea rather than something in a task: keyboard shortcuts, Ctrl-click selection and other familiar conventions from tools like Canva. When a decision was unclear, I checked how competitors handled it. For example, we had to decide what happens to the rotation angle when a merchant stretches a rotated photo to fill the whole working area. I checked mpcard.ai, supa.ru, canva.com and the services on the designer’s list. All of them reset the angle, so we did the same.

The canvas logic, with its objects and undo history, is hard to test inside one component and can’t be reused. For this reason, in March 2025 I started a [separate open-source library in TypeScript and FabricJS](/work/image-editor/) for this editor and moved that logic into it. This case is about the product built on top of the library: the interface, saving, the AI features and everything between clicking the edit button and a saved product page.

## What I built

### The editor opens from the product page

I implemented the editor from the designer’s mockups. It opens full screen when a merchant clicks the edit button on a photo on the product page. There they can pick a ready-made marketplace size, apply a template, remove the background, and add text, shapes and photos from the Unsplash photo library. Another photo of the same product opens from the bottom panel without closing the editor. If the current photo has unsaved changes, the editor first offers to save them.

![An inSales product page with four sneaker photos in the Media block, the first one designed in the editor, and the Unsaved changes bar with Cancel and Save buttons at the top](/images/work/product-image-editor/product-page-unsaved-changes.webp)

The product team prepares system templates. When a merchant applies one, the product photo goes into the place reserved for it, and the text and badges keep their styles and positions. A merchant can also save their own project as a user template and apply it again. All stores could create user templates from 11 June 2026.

The editor was rolled out in stages: to new stores on 25 December 2025 and to all stores on 13 May 2026. According to product analytics, more than 3,000 active inSales clients use it.

### Merchants run AI features without leaving the editor

The editor has four AI features: quick background removal, more precise background removal, quality improvement and text generation. The merchant selects an object and starts a feature. While it runs, the editor blocks editing and shows progress on the image itself. The result replaces the old object and keeps its size and position.

![The editor during AI background removal: a processing overlay on the photo, an Image processing message at the bottom, and the panels and buttons disabled](/images/work/product-image-editor/ai-processing-locked-editor.webp)

Since the rollout to all stores, merchants run the AI features 800 or more times a day.

### Background removal needed ready-made backgrounds

In September 2025 my manager asked what I thought of the AI features in the editor. By then I had shipped fixes for more than 20 bugs, and the editor was ready to show, so I could judge the AI features in practice. I said that quality improvement tended to blur the image, and that background outpainting didn’t work because our models couldn’t do it. Only background removal worked really well, and I suggested focusing on it.

We agreed that a cut-out product needs ready-made backgrounds, because they give background removal a clear use. I created the task the same day, and the Background panel went to production on 20 September.

![The Background panel in the editor: a Clear background button and ready-made backgrounds in the Color, Gradient, Space and Texture sections](/images/work/product-image-editor/background-panel.webp)

### We set the AI request limit based on the service’s capacity

A separate AI service handles the AI features’ requests, and its capacity is limited. That’s why at a meeting on 16 December 2025 we agreed on a limit of 50 requests a day per account. Text generation and image processing share this limit. After each operation the editor updates the number of requests left. Running background removal again on a photo that has already been processed doesn’t use the limit.

### We hid only the AI features in Safari

In December 2025, authentication with the AI service stopped working in Safari. It couldn’t be fixed quickly, and there was a suggestion to turn off the whole editor in Safari for a while. But everything else in the editor worked in Safari, so I suggested hiding only the AI features there. That’s what we did.

### I fixed a bug in the undo history the night before the rollout

The rollout to new stores fell on 25 December 2025, the eve of the New Year code freeze, when nothing new goes to production. An editor demo was planned for the same day. The day before the rollout, I was fixing a bug in the undo history. Undo and redo worked incorrectly, because the history counted technical events, like resizing the browser window, as changes. I changed the history so that it drops such events. The fix went out on 25 December, before the code freeze, so new stores got the editor with working undo and redo.

### The project isn’t lost if the merchant doesn’t save the product page

Besides the final image, the editor saves the image’s project: images, text, object positions and styles. Saving has two steps. First the merchant saves the image in the editor. If they close the editor with unsaved changes, a dialog asks whether to save the image. Then the merchant saves the product page itself. An image is product data, like the description or the price, so its changes are confirmed with the main Save button of the product page. If the editor saved the image to the product page right away, unfinished images could end up on the website.

![The editor with the Background panel open and the Save image? dialog: The image contains unsaved changes. Save before leaving? with Do not save and Save buttons](/images/work/product-image-editor/editor-save-image-dialog.webp)

This means a merchant can save an image in the editor and then close the product page without confirming the changes. In that case, the draft project must not replace the project of the published image. The first idea was simple: after saving in the editor, unlink the project from the old image. On 30 January 2026 I went through this approach step by step and showed that it could lose the project forever. Instead, I suggested keeping two projects for each image, a confirmed one and a draft. This way an image and its project always match, like a PSD file and the JPG exported from it. My manager and the backend developer agreed.

Now saving in the editor creates a new version of the image with a draft project. Only saving the product page turns the draft project into the confirmed one. The editor always opens the confirmed project. If the merchant closes the product page without confirming, the previous image and its confirmed project stay as they were. Saving projects went to production on 2 March 2026.

### Saving large images stopped failing with a 504 error

In March 2026, in a client’s store, the request that saved large images hung for a long time and then failed with a 504 Gateway Timeout error: the server didn’t respond in time. The company had an infrastructure outage that day, but I reproduced the error locally, where there was no outage. This showed that the outage wasn’t the cause. The server couldn’t process a large file and pass it to storage within a single request. Because of this, the processing moved to a background job on the server, and the editor started polling the server until the file was ready. Saving usually takes 5–10 seconds. During that time the editor blocks editing, so the merchant can’t change a project the server is still processing.

Then a second problem appeared. In production, an 8–9 MB image processed by the AI quality improvement feature stayed in processing until all 60 status checks ran out. The editor checked once every 1.5 seconds, which is 90 seconds in total. Together with the backend developer, I found the cause: the server-side image optimizer took too long on large 4K PNG files. After the fix on 5 May 2026, even a 17 MB file uploaded right away.

The large-file bugs also affected the rollout date. When my manager suggested rolling the editor out to all stores in March, I asked to wait: until large-file uploads were fixed on the server, the editor would fail on large images. The editor was rolled out to all stores on 13 May, after the upload fix.

### Merchants apply one photo’s design to up to 10 others

A product usually has several photos, and they all need the same design. The merchant designs one photo, selects up to 10 others in the bottom panel and starts the transfer, with background removal if they want it. By hand, the same edits for 10 photos took 5–10 minutes. With bulk transfer they take 2–3 minutes.

![Bulk transfer mode: the designed photo in the working area, three other product photos selected at the bottom, the hint Select the photos you want to apply changes to, and the Cut out the background toggle on](/images/work/product-image-editor/bulk-transfer-select-targets.webp)

A hidden instance of the editor does the transfer. It applies the design to each selected photo in turn and saves both the image and its project, while the merchant sees only the photo they designed. Each photo’s thumbnail shows whether it is still processing or done. Bulk transfer went to production in July 2026.

If the merchant cancels the transfer while a photo is being processed, the editor waits until that photo is done and then stops the queue. If processing hasn’t started yet, it stops right away. If the merchant changes the source design while choosing photos, the transfer mode closes, so an outdated design is never applied.

### The same editor works on the product page and in the visual site editor

Each new feature added a large flow to the editor’s root component: AI processing, templates, cropping, saving, bulk transfer and switching photos. The component grew to about 3,500 lines. To separate the connected processes and prepare the interface for several sections of the platform, I moved its logic into 22 composables, one per flow. Bulk transfer made this harder: a hidden editor works next to the visible one, and their state must not mix. So each composable works with one specific editor instance.

At first the image editor was tied to product photos. To let merchants also edit website images in the [visual site editor](/work/visual-storefront/), where they set up how their store looks, I moved the product logic out of the shared component. Now the section of the admin panel that opens the image editor passes it the image, the list of available images, the function that saves the result and the recommended crop ratios.

![The visual site editor with the Promo Slider (PS2-1) block selected and the slide panel on the right, with Link, Image and Description fields and the banner in the Image field](/images/work/product-image-editor/visual-site-editor-slide-panel.webp)

The available features depend on the section. Text generation from product data exists only on the product page. Saving a website image creates a new file and leaves the original unchanged. The visual site editor runs one image editor instance per page, and each image field passes it the selected image. This way the page doesn’t create several heavy editor instances. The image editor went live in the visual site editor on 31 August 2026.

## Results

- Merchants make marketplace images right on the product page and can come back to the project to change the text instead of making the image again.
- The editor has been available to all stores since 13 May 2026. According to product analytics, more than 3,000 active inSales clients use it.
- Since the rollout to all stores, merchants run the AI features 800 or more times a day.
- The same edits for 10 photos take 2–3 minutes instead of 5–10.
- Since 31 August 2026, merchants also use the same image editor for website images in the visual site editor.

## Where to try it

The editor is desktop-only: it was tested with my test cases in Chrome, Firefox and Safari on Windows and macOS, and the button that opens it is hidden on mobile devices. The editor itself works inside the inSales admin panel. You can try the [open-source library](/work/image-editor/) it runs on in the [live demo](https://anu3ev.github.io/image-editor/) or read its [source code on GitHub](https://github.com/Anu3ev/image-editor).
