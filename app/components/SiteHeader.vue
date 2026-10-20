<script setup lang="ts">
import profile from '~~/content/settings/profile.json'

const { copy, localePath, locale } = useLocale()
const route = useRoute()
const links = computed(
  () =>
    [
      { path: '/', label: copy.value.home, icon: 'home' },
      { path: '/blog', label: copy.value.blog, icon: 'book' },
      { path: '/work', label: copy.value.work, icon: 'briefcase' },
      { path: '/contact', label: copy.value.contact, icon: 'mail' }
    ] as const
)
</script>

<template>
  <a class="skip-link" href="#main" :title="copy.skip">{{ copy.skip }}</a>

  <aside class="site-sidebar">
    <div class="sidebar-top">
      <NuxtLink
        :to="localePath('/')"
        class="wordmark"
        :title="copy.home"
        :aria-label="`a. · ${locale === 'ru' ? profile.name_ru : profile.name} · ${copy.home}`"
      >a<span>.</span></NuxtLink>
    </div>

    <p class="nav-caption">
      {{ copy.personalSpace }}
    </p>
    <nav class="primary-nav" :aria-label="copy.navigation">
      <NuxtLink
        v-for="link in links"
        :key="link.path"
        :to="localePath(link.path)"
        :title="link.label"
        :class="{ 'nav-active': link.path !== '/' && route.path.startsWith(localePath(link.path)) }"
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
        {{ copy.builtWithCare }}<br>{{ locale === 'ru' ? profile.name_ru : profile.name }}
      </p>
    </div>
  </aside>
</template>
