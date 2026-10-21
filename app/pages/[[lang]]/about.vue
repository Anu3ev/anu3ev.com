<script setup lang="ts">
import profile from '~~/content/settings/profile.json'
import { formatExperiencePeriod } from '~~/shared/page-content'
import { createCredentialSchemas } from '~~/shared/seo'

const { copy, locale } = useLocale()
const siteContent = useSiteContent()
const experience = computed(() => siteContent.value.about.experience.map(job => ({
  ...job,
  period: formatExperiencePeriod({ start: job.start, end: job.end, presentLabel: copy.value.present })
})))

const siteUrl = useSiteOrigin()
const { certificates } = useCertificates()

usePageSeo({
  title: () => copy.value.about,
  description: () => siteContent.value.about.body,
  schema: [{
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    'name': profile.name,
    'url': siteUrl,
    'hasCredential': createCredentialSchemas({ certificates, origin: siteUrl })
  }]
})
</script>

<template>
  <div class="page-shell">
    <div class="container">
      <header class="page-heading">
        <p class="eyebrow">
          {{ copy.about }}
        </p>
        <h1>{{ siteContent.about.title }}</h1>
        <p>{{ siteContent.about.intro }}</p>
      </header>

      <div class="about-grid">
        <figure>
          <img
            class="about-photo"
            :src="profile.photo"
            :alt="locale === 'ru' ? profile.name_ru : profile.name"
            width="600"
            height="600"
            fetchpriority="high"
          >
        </figure>
        <div>
          <p class="large-copy">
            {{ siteContent.about.body }}
          </p>
          <p class="text-muted">
            {{ siteContent.about.story }}
          </p>
          <h2 class="about-toolkit-title">
            {{ copy.toolkit }}
          </h2>
          <ul class="tags">
            <li v-for="technology in siteContent.about.technologies" :key="technology">
              {{ technology }}
            </li>
          </ul>
        </div>
      </div>

      <section class="page-content" aria-labelledby="experience-title">
        <p class="eyebrow">
          {{ copy.experience }}
        </p>
        <h2 id="experience-title">
          {{ siteContent.about.experienceTitle }}
        </h2>
        <div class="timeline">
          <article v-for="job in experience" :key="`${job.company}:${job.start}:${job.role}`" class="timeline-item">
            <time :datetime="job.start">{{ job.period }}</time>
            <div>
              <h3>{{ job.role }} · {{ job.company }}</h3>
              <p>{{ job.description }}</p>
            </div>
          </article>
        </div>
      </section>

      <CertificatesSection />

      <section class="page-content" aria-labelledby="approach-title">
        <p class="eyebrow">
          {{ copy.approach }}
        </p>
        <h2 id="approach-title">
          {{ copy.services }}
        </h2>
        <div class="approach-grid">
          <article
            v-for="(principle, index) in siteContent.about.principles"
            :key="principle.title"
            class="approach-card"
          >
            <span class="approach-number">0{{ index + 1 }}</span>
            <h3>{{ principle.title }}</h3>
            <p>{{ principle.description }}</p>
          </article>
        </div>
      </section>
    </div>

    <ContactCallout />
  </div>
</template>
