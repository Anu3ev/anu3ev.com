---
title: Vue 3 didn't make our autocomplete slow. 244,650 comparisons did
description: After a Vue 3 migration, an autocomplete with 700 domain zones took about 12 seconds to open. The cause was an old quadratic deduplication that became expensive once it read every object through a reactive Proxy.
locale: en
slug: vue-3-proxy-deep-comparison
published: true
date: '2026-10-21'
cover: /images/blog/vue-3-proxy-deep-comparison.svg
coverAlt: Diagram of 700 items producing 244,650 deep comparisons through Vue Proxies, and the two fixes that removed the delay
category: Performance
readingMinutes: 7
tags: [Vue 3, Performance, Reactivity, Migration]
---

After we migrated one of the components in the inSales back office to Vue 3, opening an autocomplete with 700 domain zones started taking about 12 seconds. (inSales is an e-commerce platform with more than 60,000 merchants, and the back office is where they run their stores.) You click the field, you wait, you wait some more, and only then the list appears.

At first this looked like a Vue 3 performance problem. It wasn't. Vue 3 didn't add a single comparison to that component. It made comparisons that had been there for years more expensive, and there were a lot of them.

The 12 seconds is what I observed while reproducing the bug, not a benchmark. But nobody needs a benchmark to notice a field that freezes for 12 seconds.

## Where the time went

The component had two problems, and they only became visible together.

First, on initialization it copied the local list of items into a separate cache. That cache exists for external search, where results arrive from the server in portions and have to be merged. In local mode the full list is already passed in, so the copy wasn't needed at all.

Second, while filling the cache it removed duplicates like this:

```js
const uniqueItems = uniqWith(items, isEqual)
```

`uniqWith` keeps a result array and compares every new element with everything already in it. For 700 distinct items that's:

```text
item 1:       0 comparisons
item 2:       1 comparison
item 3:       2 comparisons
...
item 700:   699 comparisons

700 × 699 / 2 = 244,650 deep comparisons
```

Merging an existing cache with a new batch makes it worse: comparing 700 new items with 700 cached ones is up to 700 × 700 = 490,000 comparisons. And `isEqual` is a deep comparison. It walks every key and every nested object, so hundreds of thousands of calls turn into millions of property reads.

This algorithm was quadratic in Vue 2 as well. It was just cheap enough that nobody noticed.

## What changed in Vue 3

In Vue 2, reactivity was added to the original object itself, with getters and setters. The reactive object and your object were the same thing:

```js
const zone = { value: 'info', text: '.info' }

Vue.observable(zone) === zone // true
```

Vue 3 leaves the original object alone and puts a Proxy in front of it:

```js
import { reactive, toRaw } from 'vue'

const zone = { value: 'info', text: '.info' }
const reactiveZone = reactive(zone)

reactiveZone === zone        // false
toRaw(reactiveZone) === zone // true
```

The data is the same, but these are two different objects. A Proxy doesn't carry extra fields for `isEqual` to compare, and `isEqual(zone, reactiveZone)` correctly returns `true`. The problem is how it gets there. Every `proxy.value`, `Object.keys(proxy)` and `'value' in proxy` goes through Vue's handlers, which record what the code depends on. One call costs almost nothing. Millions of them inside a quadratic loop cost seconds.

So the honest description is this: Vue 3 didn't create the 244,650 comparisons. It raised the price of each one, and an old algorithm finally became visible to users. Proxy-based reactivity is a good trade for normal UI work. A deep walk over hundreds of objects inside nested loops is not normal UI work.

I also checked whether Vue has its own deep equality that unwraps Proxies. Publicly, it doesn't. Internal helpers like `looseEqual` walk properties too, so they go through the Proxy just the same.

## Fix 1: delete the work

The first question wasn't how to make deduplication faster. It was why local mode deduplicated anything at all.

```js
initCachedItems() {
  if (!this.isExternalSearch) return

  this.setCachedItems(this.getInitialCachedItems())
}
```

That one early return is what removed the delay. The local list was already in the component, and copying it into a cache just to clean it of duplicates again was pure overhead. After this change the autocomplete with 700 zones opened without the wait.

If a heavy operation isn't needed, removing it beats optimizing it. It's also the easiest fix to review: there's no new algorithm to trust.

## Fix 2: make the remaining comparisons cheap

External search still needs the cache, so deep comparison stayed there. I only took the Proxy out of the comparison:

```js
import isEqual from 'lodash/isEqual'
import uniqWith from 'lodash/uniqWith'
import { toRaw } from 'vue'

this.cachedItems = uniqWith(
  this.cachedItems.concat(newItems),
  (first, second) => isEqual(toRaw(first), toRaw(second))
)
```

A few details matter here.

There's no `isProxy` check before `toRaw`. `toRaw` returns a plain object unchanged, so the check would only add a branch to the hot loop.

The cache still stores the original items. `toRaw` is used only for the duration of one comparison, and the raw reference is dropped right after. Keeping raw references as separate state is a different story: writes through them bypass reactivity, and you end up with two references to the same data that behave differently.

`toRaw` also doesn't unwrap everything recursively. If someone manually put a Proxy inside a plain object, it stays there. Our items didn't have that, but it's worth knowing before copying the trick somewhere else.

## Why I didn't switch to comparing by id

The textbook fix for quadratic deduplication is a key:

```js
const itemsById = new Map(items.map(item => [item.id, item]))
const uniqueItems = [...itemsById.values()]
```

That's O(n) instead of O(n²), and I'd pick it for new code. Here it would have changed the contract. Right now two objects are duplicates only if all their fields match. With an id-based key, two objects with the same id and different fields would silently merge into one. I didn't know every caller well enough to promise that this never matters, and a performance fix is a bad place to change what "duplicate" means.

So I kept the old semantics and removed only the Proxy cost. It's a less impressive diff and a safer one.

## Testing the contract instead of the clock

The tempting test is "opening the list must take less than 1.5 seconds". It depends on the machine, CPU load and whatever else runs in parallel, so it ends up either flaky or so generous it proves nothing.

What I actually wanted to verify is that the comparison doesn't read reactive properties. Vue can tell you that directly with `effect` and `onTrack`:

```js
import { effect, reactive, stop, toRaw } from 'vue'
import isEqual from 'lodash/isEqual'

const sourceZone = { value: 'info', details: { available: true } }
const reactiveZone = reactive(sourceZone)
const trackedKeys = []

const runner = effect(
  () => isEqual(toRaw(sourceZone), toRaw(reactiveZone)),
  { onTrack: ({ key }) => trackedKeys.push(key) }
)
stop(runner)

// Without toRaw, Vue tracks 'value', 'details', 'available' and so on
expect(trackedKeys).toEqual([])
```

`onTrack` only fires in development builds, which is where tests usually run anyway. The test fails for the right reason: someone put a Proxy back into the hot path. It doesn't care how fast the CI runner is today.

## What I check after a Vue 3 migration now

This bug changed what I look for when reviewing migrated code. The places worth a second look:

- objects compared with `===`, used as keys in `Map` or `Set`, or searched with `indexOf`;
- `isEqual`, `uniqWith`, `differenceWith` and similar helpers running over large reactive arrays;
- reactive objects passed into third-party libraries, especially ones that remember objects by reference;
- instances of editors, maps, charts or other complex classes wrapped in `ref()` or `reactive()`.

For a quick diagnosis, three values usually tell the whole story:

```js
import { isProxy, toRaw } from 'vue'

console.log({
  isProxy: isProxy(item),
  sameReference: item === originalItem,
  sameRawReference: toRaw(item) === originalItem
})
```

The broader point is about upgrades in general. When something gets slower after one, the upgrade is rarely the whole cause. It changes the cost of operations your code was already doing, and the first thing to find is the old code that was quietly doing too many of them. Our order was: check whether the work is needed at all, keep the contract, and only then remove the extra cost from what remains.
