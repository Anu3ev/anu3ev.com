<script setup lang="ts">
import profile from '~~/content/settings/profile.json'

const { copy, locale } = useLocale()
usePageSeo({ title: () => copy.value.contact, description: () => copy.value.contactIntro })
</script>

<template>
  <div>
    <header class="page-heading">
      <p class="eyebrow">
        {{ copy.contact }}
      </p><p v-if="profile.available" class="availability">
        <span class="status-dot" />{{ copy.available }}
      </p><h1>{{ copy.contactTitle }}</h1><p>{{ copy.contactIntro }}</p>
    </header>

    <section class="contact-email-section" aria-labelledby="email-title">
      <p id="email-title" class="eyebrow">
        {{ copy.emailMe }}
      </p><a :href="`mailto:${profile.email}`" class="email-card" :title="copy.emailMe"><span class="eyebrow">Email</span><strong>{{ profile.email }} <AppIcon name="arrow" /></strong><span>{{ copy.contactNote }}</span></a>
    </section>

    <div class="feed-heading">
      <h2>{{ copy.elsewhere }}</h2><span>{{ copy.contact }}</span>
    </div>
    <nav class="contact-options" :aria-label="copy.elsewhere">
      <a :href="profile.telegram" title="Telegram"><span><strong>Telegram</strong><small>@anu3ev</small></span><AppIcon name="arrow" /></a><a :href="profile.linkedin" title="LinkedIn"><span><strong>LinkedIn</strong><small>{{ copy.experience }}</small></span><AppIcon name="arrow" /></a><a :href="profile.github" title="GitHub"><span><strong>GitHub</strong><small>{{ copy.openSource }}</small></span><AppIcon name="arrow" /></a>
    </nav>

    <section class="distributed-section" aria-labelledby="distributed-title">
      <p class="eyebrow">
        {{ copy.collaboration }}
      </p><h2 id="distributed-title">
        {{ copy.distributedTitle }}
      </h2><p>{{ copy.distributedBody }}</p><ul class="tags">
        <li>Remote</li><li>B2B / EOR</li><li>{{ locale === 'en' ? 'Relocation' : 'Релокация' }}</li>
      </ul>
    </section>
  </div>
</template>
