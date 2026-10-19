<script setup lang="ts">
import profile from '~~/content/settings/profile.json'

const { copy, localePath } = useLocale()
</script>

<template>
  <aside class="profile-sidebar" :aria-label="copy.about">
    <NuxtLink :to="localePath('/about')" class="profile-mini" :title="copy.about"><span class="small-avatar" aria-hidden="true">aa</span><strong>{{ profile.name }}</strong><span>{{ copy.role }}</span></NuxtLink>
    <p class="sidebar-bio">
      {{ copy.sidebarBio }}
    </p>

    <section class="focus-card" aria-labelledby="focus-title">
      <p class="eyebrow">
        {{ copy.currentFocus }}
      </p><h2 id="focus-title">
        {{ copy.focusTitle }}
      </h2><p>{{ copy.focusDetails }}</p>
      <ul class="tags">
        <li>Vue.js</li><li>TypeScript</li><li>Fabric.js</li>
      </ul>
    </section>

    <p class="eyebrow social-heading">
      {{ copy.elsewhere }}
    </p>
    <nav class="profile-social" :aria-label="copy.elsewhere">
      <a :href="profile.github" title="GitHub">GitHub <AppIcon name="arrow" /></a><a :href="profile.linkedin" title="LinkedIn">LinkedIn <AppIcon name="arrow" /></a><a :href="profile.telegram" title="Telegram">Telegram <AppIcon name="arrow" /></a>
    </nav>
    <div class="sidebar-connect">
      <p v-if="profile.available">
        <span class="status-dot" /> {{ copy.available }}
      </p><NuxtLink :to="localePath('/contact')" :title="copy.letsTalk">{{ copy.letsTalk }} →</NuxtLink>
    </div>
  </aside>
</template>
