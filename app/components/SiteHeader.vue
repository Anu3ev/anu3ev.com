<script setup lang="ts">
import profile from '~~/content/settings/profile.json'

const { copy, localePath, locale } = useLocale()
const route = useRoute()
const mobileMenu = useTemplateRef<HTMLDetailsElement>('mobile-menu')
const links = computed(() => [
  { path: '/', label: copy.value.home, icon: 'home' },
  { path: '/blog', label: copy.value.blog, icon: 'book' },
  { path: '/work', label: copy.value.work, icon: 'briefcase' },
  { path: '/contact', label: copy.value.contact, icon: 'mail' }
] as const)

watch(() => route.fullPath, () => {
  mobileMenu.value?.removeAttribute('open')
})

/** Returns focus to the native disclosure trigger when a keyboard user dismisses the menu. */
function closeMenu() {
  mobileMenu.value?.removeAttribute('open')
  mobileMenu.value?.querySelector('summary')?.focus()
}
</script>

<template>
  <a class="skip-link" href="#main">{{ copy.skip }}</a>

  <aside class="site-sidebar">
    <div class="sidebar-top">
      <NuxtLink :to="localePath('/')" class="wordmark" :title="copy.home" :aria-label="`Alexander Anufriev · ${copy.home}`">a<span>.</span></NuxtLink>

      <details ref="mobile-menu" class="mobile-menu" @keydown.esc.prevent="closeMenu">
        <summary :title="copy.menu" :aria-label="copy.menu">
          <AppIcon name="menu" />
        </summary>
        <nav class="mobile-menu-panel" :aria-label="copy.navigation">
          <NuxtLink v-for="link in links" :key="link.path" :to="localePath(link.path)" :title="link.label"><AppIcon :name="link.icon" /> {{ link.label }}</NuxtLink>
        </nav>
      </details>
    </div>

    <p class="nav-caption">
      {{ copy.personalSpace }}
    </p>
    <nav class="desktop-nav" :aria-label="copy.navigation">
      <NuxtLink
        v-for="link in links"
        :key="link.path"
        :to="localePath(link.path)"
        :title="link.label"
        active-class="nav-active"
        exact-active-class="nav-exact"
      ><AppIcon :name="link.icon" /><span>{{ link.label }}</span><i aria-hidden="true" /></NuxtLink>
    </nav>

    <div class="sidebar-bottom">
      <p v-if="profile.available" class="availability">
        <span class="status-dot" />{{ copy.available }}
      </p>
      <p class="sidebar-role">
        {{ profile[`headline_${locale}`] }}<br>{{ profile.location }}
      </p>
      <div class="sidebar-social">
        <a :href="profile.github" title="GitHub">GitHub ↗</a><a :href="profile.linkedin" title="LinkedIn">LinkedIn ↗</a>
      </div>
      <p class="sidebar-sign">
        {{ copy.builtWithCare }}<br>Alexander Anufriev
      </p>
    </div>
  </aside>
</template>
