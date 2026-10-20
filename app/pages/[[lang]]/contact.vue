<script setup lang="ts">
import profile from '~~/content/settings/profile.json'

const { copy } = useLocale()
const siteContent = useSiteContent()
const telegramHandle = new URL(profile.telegram).pathname.replace(/^\/+/, '@')
usePageSeo({ title: () => copy.value.contact, description: () => siteContent.value.contact.intro })
</script>

<template>
  <div>
    <header class="page-heading">
      <p class="eyebrow">
        {{ copy.contact }}
      </p>
      <p v-if="profile.available" class="availability">
        <span class="status-dot" />{{ copy.available }}
      </p>
      <h1>{{ siteContent.contact.title }}</h1>
      <p>{{ siteContent.contact.intro }}</p>
    </header>

    <section class="contact-email-section" aria-labelledby="email-title">
      <p id="email-title" class="eyebrow">
        {{ copy.emailMe }}
      </p>
      <a
        :href="`mailto:${profile.email}`"
        class="email-card"
        :title="copy.emailMe"
      ><span class="eyebrow">Email</span><strong>{{ profile.email }} <AppIcon name="arrow" /></strong><span>{{ siteContent.contact.note }}</span></a>
    </section>

    <div class="feed-heading">
      <h2>{{ copy.elsewhere }}</h2>
      <span>{{ copy.contact }}</span>
    </div>
    <nav class="contact-options" :aria-label="copy.elsewhere">
      <a
        :href="profile.telegram"
        title="Telegram"
      ><span><strong>Telegram</strong><small>{{ telegramHandle }}</small></span><AppIcon name="arrow" /></a><a
        :href="profile.linkedin"
        title="LinkedIn"
      ><span><strong>LinkedIn</strong><small>{{ copy.experience }}</small></span><AppIcon name="arrow" /></a><a
        :href="profile.github"
        title="GitHub"
      ><span><strong>GitHub</strong><small>{{ copy.openSource }}</small></span><AppIcon name="arrow" /></a>
    </nav>

    <section class="distributed-section" aria-labelledby="distributed-title">
      <p class="eyebrow">
        {{ copy.collaboration }}
      </p>
      <h2 id="distributed-title">
        {{ siteContent.collaboration.title }}
      </h2>
      <p>{{ siteContent.collaboration.body }}</p>
      <ul class="tags">
        <li v-for="arrangement in siteContent.contact.arrangements" :key="arrangement">
          {{ arrangement }}
        </li>
      </ul>
    </section>
  </div>
</template>
