<script setup lang="ts">
import profile from '~~/content/settings/profile.json'

const { copy, localePath, locale } = useLocale()
const route = useRoute()
const links = computed(
  () =>
    [
      { path: '/', label: copy.value.home, icon: 'home' },
      { path: '/about', label: copy.value.about, icon: 'person' },
      { path: '/blog', label: copy.value.blog, icon: 'book' },
      { path: '/work', label: copy.value.work, icon: 'briefcase' },
      { path: '/recommendations', label: copy.value.recommendations, icon: 'quote' },
      { path: '/contact', label: copy.value.contact, icon: 'mail' }
    ] as const
)

/** The phone tab strip; on wider screens it is the vertical sidebar list and never scrolls sideways. */
const tabStrip = useTemplateRef<HTMLElement>('tabStrip')
const tabsBefore = ref(false)
const tabsAfter = ref(false)
const slideLabel = computed(() => tabsAfter.value ? copy.value.moreSections : copy.value.firstSections)
let resizeObserver: ResizeObserver | undefined

/** Width of the faded strip edge (`--space-10` in main.css); a slide keeps it so a half-hidden tab ends up fully visible. */
const FADE_WIDTH = 40

/** Reads which sides of the strip hide tabs; 1px absorbs subpixel widths. */
function measureHiddenTabs() {
  const strip = tabStrip.value
  if (!strip) return

  const { scrollLeft, scrollWidth, clientWidth } = strip
  tabsBefore.value = scrollLeft > 1
  tabsAfter.value = scrollLeft + clientWidth < scrollWidth - 1
}

/** Moves one strip width forward, keeping the faded edge in view, or returns to the first tab at the end. */
function slideTabs() {
  const strip = tabStrip.value
  if (!strip) return

  if (tabsAfter.value) strip.scrollBy({ left: strip.clientWidth - FADE_WIDTH })
  else strip.scrollTo({ left: 0 })
}

/** Keeps the current section's tab inside the strip after loading, after every navigation and when the strip changes width. */
function revealActiveTab() {
  const strip = tabStrip.value
  const activeTab = strip?.querySelector('.nav-active, .nav-exact')
  if (!strip || !activeTab) return

  const stripBox = strip.getBoundingClientRect()
  const tabBox = activeTab.getBoundingClientRect()
  if (tabBox.left < stripBox.left) strip.scrollLeft -= stripBox.left - tabBox.left
  else if (tabBox.right > stripBox.right) strip.scrollLeft += tabBox.right - stripBox.right
}

onMounted(() => {
  const strip = tabStrip.value
  if (!strip) return

  // The observer also fires once per element right away, so it covers the first measurement.
  // Watching the tabs catches label widths from web fonts and the language switch; watching the strip catches
  // the arrow segment appearing and narrowing it, which can push the active tab out of view again.
  resizeObserver = new ResizeObserver(() => {
    revealActiveTab()
    measureHiddenTabs()
  })
  for (const element of [strip, ...strip.children]) resizeObserver.observe(element)
})

onBeforeUnmount(() => resizeObserver?.disconnect())

watch(() => route.path, () => nextTick(revealActiveTab))
</script>

<template>
  <a class="skip-link" href="#main" :title="copy.skip">{{ copy.skip }}</a>

  <aside class="site-sidebar">
    <div class="sidebar-top">
      <NuxtLink
        :to="localePath('/')"
        class="wordmark"
        :title="copy.home"
        :aria-label="`anu3ev.com · ${locale === 'ru' ? profile.name_ru : profile.name} · ${copy.home}`"
      ><BrandMark /><span class="wordmark-text">anu<span class="wordmark-accent">3</span>ev<span class="wordmark-domain">.com</span></span></NuxtLink>
    </div>

    <nav class="primary-nav" :aria-label="copy.navigation">
      <div
        ref="tabStrip"
        class="nav-tabs"
        :class="{ 'tabs-before': tabsBefore, 'tabs-after': tabsAfter }"
        @scroll.passive="measureHiddenTabs"
      >
        <NuxtLink
          v-for="link in links"
          :key="link.path"
          :to="localePath(link.path)"
          :title="link.label"
          :class="{ 'nav-active': link.path !== '/' && route.path.startsWith(localePath(link.path)) }"
          active-class="nav-active"
          exact-active-class="nav-exact"
        ><AppIcon :name="link.icon" /><span>{{ link.label }}</span><i aria-hidden="true" /></NuxtLink>
      </div>

      <button
        v-show="tabsBefore || tabsAfter"
        type="button"
        class="nav-slide"
        :aria-label="slideLabel"
        :title="slideLabel"
        @click="slideTabs"
      >
        <AppIcon :name="tabsAfter ? 'chevronRight' : 'chevronLeft'" />
      </button>
    </nav>

    <div class="sidebar-bottom">
      <p v-if="profile.available" class="availability">
        <span class="status-dot" />{{ copy.available }}
      </p>
      <p class="sidebar-role">
        {{ profile[`headline_${locale}`] }}<br>{{ locale === 'ru' ? profile.location_ru : profile.location }}
      </p>
      <div class="sidebar-social">
        <a :href="profile.github" title="GitHub" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        <a :href="profile.linkedin" title="LinkedIn" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
      </div>
      <p class="sidebar-sign">
        {{ copy.builtWithCare }}<br>{{ locale === 'ru' ? profile.name_ru : profile.name }}
      </p>
    </div>
  </aside>
</template>
