<script setup lang="ts">
import profile from '~~/content/settings/profile.json'

const { copy, localePath, locale } = useLocale()
const siteContent = useSiteContent()
</script>

<template>
  <aside class="profile-sidebar" :aria-label="copy.about">
    <NuxtLink
      :to="localePath('/about')"
      class="profile-mini"
      :title="copy.about"
    ><span class="small-avatar" aria-hidden="true"><img
      :src="profile.avatar"
      alt=""
      width="44"
      height="44"
      loading="lazy"
      decoding="async"
    ></span><strong>{{ locale === 'ru' ? profile.name_ru : profile.name }}</strong><span>{{ profile[`headline_${locale}`] }}</span></NuxtLink>
    <p class="sidebar-bio">
      {{ siteContent.sidebar.bio }}
    </p>

    <section class="focus-card" aria-labelledby="focus-title">
      <span class="eyebrow">{{ copy.currentFocus }}</span>
      <h2 id="focus-title">
        {{ siteContent.sidebar.focusTitle }}
      </h2>
      <p>{{ siteContent.sidebar.focusDetails }}</p>
      <ul class="tags">
        <li v-for="tag in siteContent.sidebar.focusTags" :key="tag">
          {{ tag }}
        </li>
      </ul>
    </section>

    <p class="eyebrow social-heading">
      {{ copy.elsewhere }}
    </p>
    <nav class="profile-social" :aria-label="copy.elsewhere">
      <a :href="profile.github" title="GitHub" target="_blank" rel="noopener noreferrer">GitHub <AppIcon name="arrow" /></a>
      <a :href="profile.linkedin" title="LinkedIn" target="_blank" rel="noopener noreferrer">LinkedIn <AppIcon name="arrow" /></a>
      <a :href="profile.telegram" title="Telegram" target="_blank" rel="noopener noreferrer">Telegram <AppIcon name="arrow" /></a>
    </nav>
    <div class="sidebar-connect">
      <p v-if="profile.available">
        <span class="status-dot" /> {{ copy.available }}
      </p>
      <NuxtLink :to="localePath('/contact')" :title="copy.letsTalk">{{ copy.letsTalk }} →</NuxtLink>
    </div>
  </aside>
</template>
