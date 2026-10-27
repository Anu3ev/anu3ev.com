<script setup lang="ts">
const { locale, copy, localePath } = useLocale()
const siteUrl = useSiteOrigin()
const { data: recommendations } = await useAsyncData(
  'recommendations',
  () =>
    queryCollection('recommendations')
      .where('published', '=', true)
      .order('date', 'DESC')
      .select('stem', 'name', 'headline_en', 'headline_ru', 'date', 'highlight', 'mentions')
      .all()
)

/** Cards link by slug; the collection stores files as `recommendations/<slug>`. */
const cards = computed(() => (recommendations.value ?? []).map(recommendation => ({
  ...recommendation,
  slug: recommendation.stem.replace(/^recommendations\//, ''),
  initials: recommendation.name.split(/\s+/).slice(0, 2).map(part => part.charAt(0)).join('').toUpperCase(),
  headline: recommendation[`headline_${locale.value}`],
  month: new Intl.DateTimeFormat(locale.value, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(recommendation.date))
})))

/** "Mentions 2 cases" / «Упоминает 2 кейса»: Russian needs its own plural forms. */
function mentionsLabel(count: number) {
  const forms: Record<string, string> = copy.value.mentionsCases
  const form = new Intl.PluralRules(locale.value).select(count)
  return (forms[form] ?? forms.other ?? '').replace('{count}', String(count))
}

usePageSeo({
  title: () => copy.value.recommendations,
  description: () => copy.value.recommendationsIntro,
  schema: () => [{
    '@context': 'https://schema.org', '@type': 'CollectionPage',
    'name': copy.value.recommendations, 'description': copy.value.recommendationsIntro,
    'about': { '@type': 'Person', '@id': `${siteUrl}/#person` },
    'mainEntity': {
      '@type': 'ItemList',
      'itemListElement': cards.value.map((card, index) => ({ '@type': 'ListItem', 'position': index + 1, 'url': `${siteUrl}${localePath(`/recommendations/${card.slug}`)}`, 'name': `${copy.value.recommendationFrom} ${card.name}` }))
    }
  }]
})
</script>

<template>
  <div class="page-shell">
    <header class="page-heading">
      <span class="eyebrow">{{ copy.recommendations }}</span>
      <h1>{{ copy.recommendationsTitle }}</h1>
      <p>{{ copy.recommendationsIntro }}</p>
    </header>

    <article v-for="card in cards" :key="card.slug" class="recommendation-card">
      <div class="recommendation-card-author">
        <span class="person-initials" aria-hidden="true">{{ card.initials }}</span>
        <div>
          <h2>
            <NuxtLink
              :to="localePath(`/recommendations/${card.slug}`)"
              :title="`${copy.recommendationFrom} ${card.name}`"
            >{{ card.name }}</NuxtLink>
          </h2>
          <span>{{ card.headline }}</span>
        </div>
        <time :datetime="card.date">{{ card.month }}</time>
      </div>
      <p lang="en">
        {{ card.highlight }}
      </p>
      <div class="recommendation-card-bottom">
        <span v-if="card.mentions.length">{{ mentionsLabel(card.mentions.length) }}</span>
        <NuxtLink
          :to="localePath(`/recommendations/${card.slug}`)"
          class="text-link"
          :title="`${copy.recommendationFrom} ${card.name}`"
        >{{ copy.readRecommendation }} <AppIcon name="arrow" /></NuxtLink>
      </div>
    </article>

    <ContactCallout />
  </div>
</template>
