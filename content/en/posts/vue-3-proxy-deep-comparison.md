---
title: Why a drawer took 4 seconds to open instead of 1 after the move to Vue 3
description: "After the inSales admin panel moved to Vue 3, the domain picker drawer took about 4 seconds to open instead of 1. The delay came from a shared autocomplete: it looped over and compared 700 top-level domains (TLDs), and every property read now went through a Proxy."
locale: en
slug: vue-3-proxy-deep-comparison
published: true
date: '2026-10-21'
cover: /images/blog/vue-3-proxy-deep-comparison.svg
coverAlt: 'Diagram: the domain picker drawer opened in about 1 second on Vue 2 and about 4 seconds on Vue 3 because 700 top-level domains (TLDs) were read through Proxies, and two ways to take the Proxy out: toRaw and markRaw'
category: Performance
readingMinutes: 5
tags: [Vue 3, Performance, Reactivity, Migration]
---

In the inSales admin panel, merchants manage their products, orders, domains and analytics, and the platform has more than 60,000 online stores. In the summer of 2026 the admin panel was moved from Vue 2 to Vue 3, and after the move parts of the interface became much slower. The domain picker drawer, a side panel in the Domains section, took about 4 seconds to open. In production on Vue 2 it took about 1 second.

Another team ran the migration. I had run into Vue 3 Proxies before: when I moved my infographic editor (text, badges and icons over product photos) to Vue 3, they broke part of its interface. I had finished my own tasks by then, so on 7 August 2026 I offered the team my help and took the tasks for the Domains page.

Vue 3 itself didn’t add slow code to the drawer: this code ran on Vue 2 as well, but after the move every data read in it became more expensive.

## The delay came from a shared autocomplete

The drawer contains `ui-autocomplete2`, an input with suggestions from the UI kit, the inSales library of interface components. On every render, about 700 top-level domains (TLDs) such as .ru or .com were passed into it. The component looped over them twice, compared them and cached them.

On Vue 2 this render was slow too and took about a second, so the problem was less visible. On Vue 3 the same work took about 4 seconds.

## Vue 3 reads properties through a Proxy

In Vue 2, reactivity was added to the original object itself: Vue put getters and setters on its properties. The reactive object and the original were the same object:

```js
const zone = { value: 'ru', text: '.ru' }

Vue.observable(zone) === zone // true
```

Vue 3 leaves the original object unchanged and creates a Proxy for it, a wrapper object that intercepts every property access:

```js
import { reactive, toRaw } from 'vue'

const zone = { value: 'ru', text: '.ru' }
const reactiveZone = reactive(zone)

reactiveZone === zone        // false
toRaw(reactiveZone) === zone // true
```

Every property read on a Proxy goes through a Vue handler. If the read happens during a render, Vue also records the property as a dependency of the component. One such read costs almost nothing. But when filling the cache, the autocomplete removed duplicates with `uniqWith` and `isEqual`, comparing each TLD with every TLD before it. For 700 TLDs that is 700 × 699 / 2, about 245,000 deep comparisons. Each of them reads several properties, so millions of reads go through the Proxy, and each read now costs more.

## The fix belonged in the UI kit, not on the Domains page

The slow code was inside `ui-autocomplete2`, so a fix on the Domains page would have made one drawer faster and left every other autocomplete slow. I fixed the component itself instead, in the UI kit’s Vue 3 branch, on the same day I took the task.

In the domain picker drawer, the autocomplete works in local mode: the whole list of TLDs is already passed to it in `items`, and there is nothing to search on the server. But on initialization the component still copied this list into its cache, which meant looping over and comparing 700 TLDs through Proxies. The cache is needed only for search through server requests, so I turned off filling it in local mode:

```js
initCachedItems() {
  // In local mode the cache isn't needed:
  // it is needed only for server search.
  if (!this.externalSearchEnable) return

  this.setCachedItems(this.getInitialCachedItems())
}
```

This change is what removed the delay when the drawer opened: an operation you don’t need is easier to skip than to speed up. The drawer didn’t become faster than on Vue 2, but it got its old speed back.

## Comparing a Proxy with its original object reads every property

Search through server requests does need the cache, so the comparison stayed there. In `set-cached-items.js` the autocomplete caches the items it has found and compares them with Lodash’s `isEqual`. There, Proxy objects were compared with the original objects.

`isEqual` first checks whether both arguments are the same object, and if they are, it returns `true` at once. For this check a Proxy and its original are different objects, so `isEqual` compares them property by property. Their data is the same, so the comparison can’t stop early at a difference and reads every property, and each read on the Proxy goes through a Vue handler:

```js
import isEqual from 'lodash/isEqual'
import { reactive, toRaw } from 'vue'

const zone = { value: 'ru', text: '.ru' }
const reactiveZone = reactive(zone)

// true after comparing every property through the Proxy
isEqual(reactiveZone, zone)
// true at once: it is the same object
isEqual(toRaw(reactiveZone), zone)
```

This comparison most likely slowed down every autocomplete that searches through server requests. So I suggested turning Proxy objects into plain ones before the comparison:

```js
import isEqual from 'lodash/isEqual'
import { toRaw } from 'vue'

/**
 * Compares cached items by their data
 * without reading properties through a Proxy.
 */
function isSameItem(first, second) {
  return isEqual(toRaw(first), toRaw(second))
}
```

`toRaw` returns the original object for a Proxy and the object itself for a plain one, so a separate `isProxy` check isn’t needed. If both arguments lead to the same original object, `isEqual` returns `true` on its very first check.

## Proxies also slowed down checkboxes in the Vuetify fork

When I told the migration team about the autocomplete, they gave me another task with a similar problem. In the analytics section, checkboxes in the `ui-path-list` component reacted to a click after about 5 seconds. I found the cause in the Vuetify fork, the inSales copy of the Vuetify component library: Vue 3 created a Proxy for almost everything the fork’s components kept in `data`.

The fix was to wrap almost everything in `data` with `markRaw`. This function marks an object so that Vue never creates a Proxy for it. Watchers wrote new values into `data`, and these values had to be wrapped in `markRaw` too. Otherwise Vue would create a Proxy for every new value. In outline:

```js
import { markRaw } from 'vue'

export default {
  data() {
    return { nodes: markRaw([]) }
  },
  watch: {
    items(newItems) {
      this.nodes = markRaw(buildNodes(newItems))
    }
  }
}
```

`markRaw` has a cost: Vue doesn’t track changes inside a marked object. The interface updates when `nodes` gets a new array, but it doesn’t notice a change to one item inside it. So `markRaw` fits data that is replaced as a whole.

I described the fix in detail in the task on 10 August 2026, and the migration team added it to the fork the same evening.

## What to check after moving to Vue 3

Both delays, 4 and 5 seconds, came from shared components, not from single pages. A slow shared component slows down every page that uses it, so the fix belongs in the UI kit or the fork, not on each page separately.

After moving to Vue 3, it is worth checking places where:

- code loops over and compares large lists of reactive objects, for example with `isEqual`;
- a component keeps large structures in `data` that are replaced as a whole and don’t need tracking inside;
- an instance of a third-party library is kept in reactive state.

The last case causes bugs rather than delays. It happened in my infographic editor: the interface tracked properties of the editor instance. In Vue 2 this worked because the getters and setters were put on the instance itself. In Vue 3 the tracking stopped working: the editor’s own code changes the original instance, not the Proxy, so Vue never sees those changes. That is why I started keeping the instance without deep reactivity, and the interface now gets state changes from the editor’s events.

If the interface becomes slower after the move, compare its speed with production on Vue 2. If the screen was slow there too, look for the slow code in the component itself: the Proxy doesn’t create it but makes it more visible.
