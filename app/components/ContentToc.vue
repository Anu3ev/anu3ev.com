<script setup lang="ts">
defineProps<{ links?: { id: string, text: string }[], title: string }>()

/** Matches the mobile layout breakpoint in main.css; only there the outline collapses into one row. */
const COMPACT_QUERY = '(max-width: 760px)'

/** The prerendered outline is open, so desktop and no-JavaScript readers always see every section. */
const isOpen = ref(true)
const isCompact = ref(false)
const isHydrated = ref(false)
let compactMedia: MediaQueryList | undefined

/** Collapses the outline when the layout becomes compact and reopens it for the desktop column. */
function syncWithLayout() {
  isCompact.value = compactMedia?.matches ?? false
  isOpen.value = !isCompact.value
}

onMounted(() => {
  compactMedia = matchMedia(COMPACT_QUERY)
  syncWithLayout()
  compactMedia.addEventListener('change', syncWithLayout)
  isHydrated.value = true
})

onBeforeUnmount(() => compactMedia?.removeEventListener('change', syncWithLayout))

/** Keeps the bound state in step with the reader's own taps on the summary. */
function rememberToggle(event: Event) {
  isOpen.value = (event.target as HTMLDetailsElement).open
}

/** On desktop the outline is a fixed block; its heading must not hide the list. */
function keepDesktopOpen(event: MouseEvent) {
  if (!isCompact.value) event.preventDefault()
}
</script>

<template>
  <details
    v-if="links?.length"
    class="table-of-contents"
    :open="isOpen"
    :data-hydrated="isHydrated || undefined"
    @toggle="rememberToggle"
  >
    <summary class="eyebrow" :title="title" @click="keepDesktopOpen">
      {{ title }}<span class="toc-count" aria-hidden="true">{{ links.length }}</span>
    </summary>
    <nav :aria-label="title">
      <ol>
        <li v-for="heading in links" :key="heading.id">
          <a :href="`#${heading.id}`" :title="heading.text">{{ heading.text }}</a>
        </li>
      </ol>
    </nav>
  </details>
</template>
