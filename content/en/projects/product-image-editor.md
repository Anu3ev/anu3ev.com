---
title: A Vue infographic editor for product photos in the inSales admin panel
description: "An inSales merchant’s product photos are shown both on their website and on marketplaces, and each marketplace has its own photo requirements. inSales had no tool for editing images to meet these requirements, so merchants ordered images from designers or used paid third-party services. I built an editor where a merchant can prepare the images themselves, right on the product page."
locale: en
slug: product-image-editor
published: true
cover: /images/work/product-image-editor/user-template-created.webp
coverAlt: The inSales image editor with the My templates tab open in the Templates panel, a sneaker infographic in the working area and a Template created message
category: Browser editors
year: Mar 2025 – Sep 2026
context: inSales
role: "Owned the editor as a product, from the first prototype to the rollout to all stores"
stack: [Vue 3, TypeScript, FabricJS, Composition API, SCSS, Mixpanel]
featured: true
order: 1
results:
  - value: "3,000+"
    label: active inSales clients use the editor, according to product analytics
  - value: "800+"
    label: AI operations a day since the rollout to all stores
  - value: "2–3 min"
    label: "for a bulk transfer of changes to 10 product photos, instead of about 60 minutes of editing by hand"
---

## The problem

On the inSales platform, a merchant can run their own online store and export products to marketplaces such as Ozon, Wildberries and Yandex Market, the largest online marketplaces in Russia. The merchant has one product page for all sales channels, so the same product photos are shown on the website and on every marketplace.

But each marketplace has its own requirements for product photos, and it rejects a photo that doesn’t meet them. A typical case looked like this: a merchant imported products from Wildberries into inSales, exported them to another marketplace and got the error "Incorrect product photo size". In 2025 the requirements were also changing: the large marketplaces were moving to tall photos with a 3:4 ratio. Ozon recommends 900×1200 for product photos, and since 30 May 2025 Yandex Market itself adds white borders to photos with any other ratio.

Size wasn’t the only problem. To sell more, merchants add infographics to their photos: text and shapes with information about the product. Ozon later confirmed the demand for infographics too: in December 2025 it launched its own infographics builder.

inSales had no real tool for preparing such images. The product page only had a simple CropperJS cropping tool, which I had also built earlier. It could crop a photo to the right ratio, but it couldn’t add text or a shape. So merchants prepared marketplace images on their own. In January 2025 our designer found out how they did it: some had a separate employee for this, others ordered images from freelancers, and still others paid for services like MPCard, up to about $110 a month.

On 14 January 2025 the inSales team that works on marketplaces sent us a task: merchants need an editor right on the product page. In it, a merchant should be able to choose the image size for a marketplace, remove the background, add text and shapes from ready-made templates, and save the result.

## My role

At inSales I owned the editor as a product, from the first prototype to the rollout to all stores. I wrote from scratch the [open-source library in TypeScript and FabricJS](/work/image-editor/) that the editor runs on, and I built the Vue app itself: its architecture, the interface from the designer’s mockups, saving images, the AI features, templates, bulk transfer of changes and usage analytics. A backend developer wrote the server side, and we agreed on the API together. The team also included my manager, a product manager, a designer and a QA engineer. I wrote the test cases for the QA engineer.

Every week I ran a meeting about the editor: I invited the participants, and after the call I wrote up the decisions and dates and created tasks for the backend developer.

Many of the editor’s use cases weren’t described in the task, so I designed their logic myself: keyboard shortcuts, selecting objects with Ctrl held down and other things people are used to in editors like Canva.

The editor has two parts. I moved everything that happens on the canvas (objects, the change history, basic editing operations) into the library: inside one Vue component this logic is hard to test and can’t be reused. I started writing the library in March 2025 specifically for this editor. This case study is about the second part, the Vue app on top of the library: the interface, saving, the AI features and everything that happens between clicking the edit button and a saved product page.

## What I built

### The editor opens from the product page

I showed the first prototype of the editor to the company’s management on 27 March 2025. On 30 May the first version went to production behind a feature flag: only the stores that had agreed to take part in testing could see the editor.

When a merchant clicks the edit button on a photo on the product page, the editor opens full screen. I implemented its interface from the designer’s mockups. In the editor, a merchant can set the image size themselves or choose one of the presets for marketplaces, apply a template, remove the background, and add text, shapes and photos from the Unsplash photo library.

![The inSales image editor: a sneaker photo is selected in the working area, the Return, Download and Save buttons are at the top, a toolbar with the Stretch and Fit into area buttons is above the photo, and the tools panel is on the left](/images/work/product-image-editor/editor-photo-selected.webp)

If a product has several photos, the merchant can switch to another photo from the bottom panel, without closing the editor. Before it switches, the editor checks whether there are unsaved changes, and if there are, it offers to save them.

![The All images bottom panel of the editor with four product photos: the second photo is open in the working area and marked with a frame in the panel](/images/work/product-image-editor/product-photos-bottom-panel.webp)

The editor has two kinds of templates. System templates were built right in the editor from the designer’s mockups. When a merchant applies one, the product photo goes into the place reserved for it, and the text and shapes keep their styles and positions. User templates are created by merchants themselves from a design they made in the editor, and are used to design other photos. User templates became available to all stores on 11 June 2026.

![The Templates panel with system templates: a template with the Leather sneakers heading and two shapes with text is applied to a sneaker photo](/images/work/product-image-editor/system-template-applied.webp)

### Ready-made backgrounds were added to background removal

The editor has four AI features: quick background removal, precise background removal, photo quality improvement and text generation for infographics. The merchant selects an object and starts the feature they need. The processing runs on the server and takes time, so until it ends the editor blocks editing and shows the progress right on the photo. The result takes the place of the old object, with the same size and in the same place.

![The editor during AI background removal: a processing overlay on the photo, an Image processing message at the bottom, and the panels and buttons disabled](/images/work/product-image-editor/ai-processing-locked-editor.webp)

I finished connecting the AI processing at the end of August 2025, and on 1 September my manager asked what I thought of the AI features in the editor. I answered that quality improvement tended to blur the image, and that only background removal worked really well.

We agreed that a cut-out product needs ready-made backgrounds: they give background removal a clear use. The merchant removes the background from the product image and then chooses a new one from the available options: a color, a gradient or a preloaded photo. I created the task for backgrounds the same day, and on 20 September the Background panel went to production.

![The Background panel in the editor: a Clear background button and ready-made backgrounds in the Color, Gradient, Space and Texture sections](/images/work/product-image-editor/background-panel.webp)

### AI requests have a daily limit

A separate AI service handles the requests from the AI features, and its capacity is limited. So that there is enough capacity for all stores, at a meeting on 16 December 2025 we agreed on a limit: 50 requests a day per store account. Text generation and photo processing share this limit.

After each operation the editor updates the number of requests left. The limit isn’t wasted: if a merchant starts background removal for a photo whose background is already removed, no request is used.

To let us see how merchants use the AI features and at which step problems appear, I added event tracking that sends events to Mixpanel, a product analytics service. For each operation it records the type, the result, the duration and what is left of the daily limit.

### We hid only the AI features in Safari

In December 2025, authentication with the AI service broke in the Safari browser, so the AI features stopped working there. It couldn’t be fixed quickly, because the developer responsible for it was on vacation, so we discussed turning off the whole editor in Safari. However, all the other features worked in Safari, so I suggested hiding only the AI features there and letting Safari users keep editing images. That’s what we did. Later, when the authentication was fixed, I brought the AI features back.

### I fixed a bug in undo and redo the day before the rollout

On 25 December 2025 the editor was to be rolled out to all new stores. Stores that were already on inSales got it later. It was the last day before the New Year code freeze, after which nothing goes to production, and a presentation of the editor inside the company was planned for the same day.

The day before, I was fixing a difficult bug in the undo/redo logic. Technical events, such as resizing the browser window, were recorded in the change history, and because of this undo and redo worked incorrectly. I fixed the history recording so that such events are no longer recorded. We managed to release the fix on 25 December, before the code freeze. New stores got the editor with working undo and redo, and that same day we presented it to our colleagues.

### The image is saved together with its project

The final image is flat: the text and other objects in it are already merged with the photo and can’t be changed. So, besides the image itself, the editor saves its project: images, text, object positions and styles. When the merchant opens the image in the editor again, they continue working with the project and can, for example, change the text instead of making the image again. Wildberries also has its own editor, but changes there can’t be undone after saving.

The difficulty was that saving has two steps. First the merchant saves the image in the editor.

![The editor with the Background panel open and the Save image? dialog: The image contains unsaved changes. Save before leaving? with Do not save and Save buttons](/images/work/product-image-editor/editor-save-image-dialog.webp)

Then they save the product page itself. In inSales an image is part of the product data, like the description or the price, and any change to a product is confirmed with the product page’s single Save button. The image can’t be saved to the product page automatically: otherwise an unfinished image could appear on the website.

![An inSales product page with four sneaker photos in the Media block, the first one designed in the editor, and the product page’s Unsaved changes bar with Cancel and Save buttons at the top](/images/work/product-image-editor/product-page-unsaved-changes.webp)

The two saving steps created many cases to handle. For example, a merchant saved an image in the editor and then closed or reloaded the product page without saving it. In this case the product page must keep the previous image. And if the previous image had itself been edited and saved before, its previous project must stay with it.

At first we discussed a simple option: after saving in the editor, unlink the project from the old image. On 30 January 2026 I went through this option step by step and showed a case where the project was lost forever. In this case, the merchant saves an image in the editor and closes the product page without saving it. The product page keeps the old image, but the old image no longer has its project.

Instead, I suggested storing the project in two states: confirmed (origin) and draft. The confirmed state matches the image that the merchant saved together with the product page. The draft state appears when they save a new image in the editor. When the merchant saves the product page, the draft state becomes the confirmed one. If they close or reload the product page without saving, the product page keeps the previous image, and the editor opens the previous project for it, in its confirmed state. This way the image on the website and its project always match, like a PSD file and the JPG exported from it.

My manager and the backend developer agreed, and I created the backend task. Saving projects went to production on 2 March 2026.

### Saving large images stopped failing

In March 2026, large images stopped saving in one client’s store: the request ran for a long time and ended with a 504 Gateway Timeout error. The company had an infrastructure outage that day, but I reproduced the error locally, where there was no outage, and it became clear that the outage wasn’t the cause.

The server couldn’t process a large file and pass it to storage within one request. So the file processing on the server was moved to a background job, and the editor started polling the server until the image was ready. Saving usually takes 5–10 seconds. During this time the editor blocks editing, so that the merchant can’t change a project the server is still processing.

After that a second problem appeared. In production, an 8–9 MB image stayed in processing after quality improvement until the editor used up all 60 status checks, one every 1.5 seconds. Together with the backend developer, we found the cause: the server-side image optimizer took too long to process large 4K PNG files. After the fix on 5 May 2026, even a 17 MB file uploaded right away.

These errors also delayed the rollout. In March my manager suggested rolling the editor out to all stores, but I asked to postpone it until saving large images was fixed. The editor was rolled out on 13 May 2026, after the fix.

### One photo’s design is transferred to 10 others

A product often has several photos, and they all need the same design. Repeating the same edits for each photo by hand takes a long time: 10 photos took about an hour on average. So I built bulk transfer of changes. The merchant designs one photo, selects up to 10 others in the bottom panel and starts the transfer. The editor applies the same design to each selected photo, and if the Cut out the background toggle is on, the editor also removes the background from that photo. With bulk transfer the same edits take 2–3 minutes.

![Bulk transfer mode: the designed photo in the working area, three other product photos selected at the bottom, the hint Select the photos you want to apply changes to, and the Cut out the background toggle on](/images/work/product-image-editor/bulk-transfer-select-targets.webp)

A second, hidden instance of the editor does the transfer. It applies the design to each selected photo in turn and saves the image together with its project. Meanwhile the merchant sees the photo they designed in the editor, and the thumbnails in the bottom panel show which photos are still being processed and which are done.

If the merchant cancels the transfer while a photo is already being processed, the editor waits for this processing to end and only then stops the queue. Photos that the queue hasn’t reached aren’t processed. There is one more case: the merchant is already selecting photos for the transfer, but goes back and changes the source design. Then the transfer mode closes, so that an outdated design isn’t applied to the other photos.

Bulk transfer of changes went to production in July 2026.

### One editor works on the product page and in the visual site editor

Products aren’t the only things with images. In the [visual site editor](/work/visual-storefront/), a store owner can upload images for banners and slides, so an image editor would be useful there too. But the editor was written for the product page and worked only with product photos. Connecting it to the visual site editor took two changes.

The first change: I rewrote the editor with the Composition API. The editor was originally written in Vue 2, and in Vue 2 our standard was the Options API. Each new feature added a large flow to the editor’s root component: AI processing, templates, cropping, saving, transfer of changes, switching photos. As a result, the root component grew to about 3,500 lines. While I was working on the editor, we decided to move the admin panel to Vue 3 and the Composition API. So I rewrote the editor and moved the root component’s logic into 22 composables, each responsible for one part of the interface. This separated the flows from each other and made it possible to use the editor in different sections of the platform. During a bulk transfer of changes two editor instances work at the same time, a visible one and a hidden one, and their state must not mix. So each composable works with one specific instance.

The second change: I removed the editor’s dependency on the product as an entity. Now the section that opens the editor passes it the image, the list of available images, the save handler and the recommended crop ratios.

![The visual site editor with the Promo Slider (PS2-1) block selected and the slide panel on the right, with Link, Image and Description fields and the banner in the Image field](/images/work/product-image-editor/visual-site-editor-slide-panel.webp)

The set of features also depends on the section: for example, text generation from product data exists only on the product page. When a merchant saves a website image, the editor creates a new file and doesn’t change the original. The visual site editor can have different widgets with different image fields, but there is only one image editor instance. The image selected in a widget’s field is passed to this instance. This way the page doesn’t create several editors, and we avoid performance problems.

I released the image editor in the visual site editor on 31 August 2026, my last working day at the company.

## Results

- Merchants prepare marketplace images themselves, right on the product page, and can come back to an image’s project to change the image instead of making it again.
- The editor was rolled out to all stores on 13 May 2026. According to product analytics, more than 3,000 active inSales clients use it.
- Since the rollout to all stores, the AI features in the editor have been used 800 or more times a day.
- The same edits for 10 product photos take 2–3 minutes instead of about 60.
- Since 31 August 2026, merchants have been able to edit not only product images but also other website images, such as banners.

## Where to try it

The editor works inside the [inSales](https://www.insales.ru/) admin panel. You can try the [open-source library](/work/image-editor/) it is built on in the [live demo](https://anu3ev.github.io/image-editor/) or read its [source code on GitHub](https://github.com/Anu3ev/image-editor). The editor is made for desktop: it was tested with my test cases in Chrome, Firefox and Safari on Windows and macOS. On mobile devices the edit button is hidden.
