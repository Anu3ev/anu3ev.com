<script setup lang="ts">
import profile from '~~/content/settings/profile.json'

const route = useRoute()
const { locale, copy, localePath } = useLocale()
const siteUrl = useSiteOrigin()
const { data: recommendation } = await useAsyncData(
  () => `recommendation-${route.params.slug}`,
  () =>
    queryCollection('recommendations')
      .where('stem', '=', `recommendations/${String(route.params.slug)}`)
      .where('published', '=', true)
      .first()
)

if (!recommendation.value) throw createError({ statusCode: 404, statusMessage: 'Recommendation not found' })

/** Titles of the cases the text mentions, in the order the recommender wrote about them. */
const { data: mentionedCases } = await useAsyncData(
  () => `recommendation-cases-${locale.value}-${route.params.slug}`,
  async () => {
    const slugs = recommendation.value?.mentions.map(mention => mention.project) ?? []
    if (!slugs.length) return []

    const projects = await queryCollection('projects').where('locale', '=', locale.value).where('slug', 'IN', slugs).where('published', '=', true).all()
    return slugs.flatMap(slug => projects.filter(project => project.slug === slug).map(project => ({ slug, title: project.title })))
  }
)

const relationshipLabels = computed(() => ({
  'managed-directly': copy.value.relationshipManagedDirectly,
  'senior': copy.value.relationshipSenior,
  'same-team': copy.value.relationshipSameTeam,
  'teacher': copy.value.relationshipTeacher
}))

/** Up to two letters from the name as written, so Cyrillic names keep their own initials. */
const initials = computed(() => (recommendation.value?.name ?? '').split(/\s+/).slice(0, 2).map(part => part.charAt(0)).join('').toUpperCase())

const writtenLabel = computed(() => {
  if (!recommendation.value) return ''
  return new Intl.DateTimeFormat(locale.value, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(recommendation.value.date))
})

const headline = computed(() => recommendation.value?.[`headline_${locale.value}`] ?? '')
const pageTitle = computed(() => `${copy.value.recommendationFrom} ${recommendation.value?.name ?? ''}`)

/** LinkedIn has no link to a single recommendation; its list on the owner's profile is the closest public source. */
const sourceUrl = `${profile.linkedin}details/recommendations/`

usePageSeo({
  title: () => pageTitle.value,
  description: () => recommendation.value?.excerpt ?? copy.value.recommendations,
  parent: () => ({ name: copy.value.about, url: `${siteUrl}${localePath('/about')}` }),
  markdownCopy: () => Boolean(recommendation.value),
  schema: () => {
    const current = recommendation.value
    if (!current) return []

    // Plain page data: Google ignores Review markup a person publishes about themselves.
    return [{
      '@context': 'https://schema.org', '@type': 'WebPage',
      'name': pageTitle.value, 'description': current.excerpt, 'inLanguage': 'en', 'datePublished': current.date,
      'url': `${siteUrl}${localePath(`/recommendations/${String(route.params.slug)}`)}`,
      'about': { '@type': 'Person', '@id': `${siteUrl}/#person`, 'name': profile.name },
      'author': { '@type': 'Person', 'name': current.name, 'jobTitle': current.headline_en, 'sameAs': [current.profile] },
      'isBasedOn': sourceUrl
    }]
  }
})
</script>

<template>
  <div class="page-shell">
    <div v-if="recommendation" class="container page-content">
      <NuxtLink
        :to="localePath('/about')"
        class="text-link back-link"
        :title="copy.backToAbout"
      ><AppIcon name="left" /> {{ copy.backToAbout }}</NuxtLink>

      <header class="page-heading recommendation-heading">
        <p class="eyebrow">
          {{ copy.recommendations }}
        </p>
        <div class="recommendation-person">
          <span class="person-initials" aria-hidden="true">{{ initials }}</span>
          <div>
            <h1>{{ recommendation.name }}</h1>
            <p>{{ headline }}</p>
          </div>
        </div>
      </header>

      <dl class="case-facts case-facts-pair">
        <div>
          <dt>{{ copy.recommendationRelationship }}</dt>
          <dd>{{ relationshipLabels[recommendation.relationship] }}</dd>
        </div>
        <div>
          <dt>{{ copy.recommendationWritten }}</dt>
          <dd>
            <time :datetime="recommendation.date">{{ writtenLabel }}</time>
          </dd>
        </div>
      </dl>

      <p v-if="copy.originalLanguageNote" class="recommendation-note">
        {{ copy.originalLanguageNote }}
      </p>

      <ContentRenderer :value="recommendation" class="prose recommendation-text" lang="en" />

      <div class="actions">
        <a
          :href="sourceUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="button button-secondary"
          :title="`${copy.readOnLinkedIn}, ${copy.opensInNewTab}`"
        >{{ copy.readOnLinkedIn }} <AppIcon name="arrow" /></a>
      </div>

      <section v-if="mentionedCases?.length" class="recommendation-cases" aria-labelledby="mentioned-work-title">
        <h2 id="mentioned-work-title" class="eyebrow">
          {{ copy.mentionedWork }}
        </h2>
        <ul>
          <li v-for="mentionedCase in mentionedCases" :key="mentionedCase.slug">
            <NuxtLink
              :to="localePath(`/work/${mentionedCase.slug}`)"
              class="text-link"
              :title="mentionedCase.title"
            >{{ mentionedCase.title }} <AppIcon name="right" /></NuxtLink>
          </li>
        </ul>
      </section>
    </div>

    <ContactCallout />
  </div>
</template>
