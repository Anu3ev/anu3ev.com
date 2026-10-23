<script setup lang="ts">
import profile from '~~/content/settings/profile.json'

const { copy, locale } = useLocale()
const siteContent = useSiteContent()
const telegramHandle = new URL(profile.telegram).pathname.replace(/^\/+/, '@')
usePageSeo({ title: () => copy.value.contact, description: () => siteContent.value.contact.intro })
</script>

<template>
  <div>
    <header class="page-heading contact-page-heading">
      <span class="eyebrow">{{ copy.contact }}</span>
      <p v-if="profile.available" class="availability">
        <span class="status-dot" />{{ copy.available }}
      </p>
      <h1>
        {{ siteContent.contact.title.replace(/\.$/, '') }}<span v-if="siteContent.contact.title.endsWith('.')" class="accent-period">.</span>
      </h1>
      <p>{{ siteContent.contact.intro }}</p>
      <div class="actions">
        <a :href="`mailto:${profile.email}`" class="button button-primary" :title="copy.emailMe">
          {{ copy.emailMe }} <AppIcon name="arrow" />
        </a>
        <a
          :href="profile[`cv_${locale}`]"
          class="button button-secondary"
          :title="copy.downloadCv"
          type="application/pdf"
          download
        >{{ copy.downloadCv }} <AppIcon name="download" /></a>
      </div>
    </header>

    <section class="contact-email-section" :aria-label="copy.emailMe">
      <a
        :href="`mailto:${profile.email}`"
        class="email-card"
        :title="copy.emailMe"
      >
        <span class="email-icon"><AppIcon name="mail" /></span>
        <span class="email-copy">
          <span class="eyebrow">Email</span>
          <strong>{{ profile.email }} <AppIcon name="arrow" /></strong>
          <span class="email-note">{{ siteContent.contact.note }}</span>
        </span>
      </a>
    </section>

    <div class="feed-heading">
      <h2>{{ copy.elsewhere }}</h2>
      <span>{{ copy.directLinks }}</span>
    </div>
    <nav class="contact-options" :aria-label="copy.elsewhere">
      <a
        :href="profile.calendly"
        :title="copy.bookCall"
        target="_blank"
        rel="noopener noreferrer"
      ><span><strong>{{ copy.bookCall }}</strong><small>{{ copy.bookCallNote }}</small></span><AppIcon name="arrow" /></a>
      <a
        :href="profile.telegram"
        title="Telegram"
        target="_blank"
        rel="noopener noreferrer"
      ><span><strong>Telegram</strong><small>{{ telegramHandle }}</small></span><AppIcon name="arrow" /></a>
      <a
        :href="profile.linkedin"
        title="LinkedIn"
        target="_blank"
        rel="noopener noreferrer"
      ><span><strong>LinkedIn</strong><small>{{ copy.experience }}</small></span><AppIcon name="arrow" /></a>
      <a
        :href="profile.github"
        title="GitHub"
        target="_blank"
        rel="noopener noreferrer"
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
