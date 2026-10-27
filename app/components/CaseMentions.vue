<script setup lang="ts">
import { findCaseMentions } from '~~/shared/recommendations'

/** The case whose mentions to show; nothing renders when no published recommendation names it. */
const { project } = defineProps<{ project: string }>()
const { copy, localePath } = useLocale()

const { data: recommendations } = await useAsyncData(
  'recommendation-mention-sources',
  () =>
    queryCollection('recommendations')
      .where('published', '=', true)
      .select('stem', 'name', 'date', 'featured', 'published', 'mentions')
      .all()
)

const mentions = computed(() => findCaseMentions({
  project,
  recommendations: (recommendations.value ?? []).map(recommendation => ({ ...recommendation, slug: recommendation.stem.replace(/^recommendations\//, '') }))
}))

/** A single person is named in full; several are listed by first name after the count. */
const people = computed(() => mentions.value.map(mention => ({
  ...mention,
  initials: mention.name.split(/\s+/).slice(0, 2).map(part => part.charAt(0)).join('').toUpperCase(),
  label: mentions.value.length === 1 ? mention.name : mention.name.split(/\s+/)[0]
})))
const intro = computed(() => mentions.value.length === 1
  ? copy.value.fromRecommendation
  : copy.value.mentionedInRecommendations.replace('{count}', String(mentions.value.length)))
</script>

<template>
  <section v-if="people.length" class="case-mentions" :aria-label="copy.recommendations">
    <blockquote lang="en">
      <p>{{ people[0]?.quote }}</p>
    </blockquote>
    <p class="case-mentions-by">
      <span class="case-mentions-faces" aria-hidden="true">
        <span v-for="person in people" :key="person.slug" class="person-initials">{{ person.initials }}</span>
      </span>
      <span>
        {{ intro }}
        <template v-for="(person, index) in people" :key="person.slug">
          <NuxtLink
            :to="localePath(`/recommendations/${person.slug}`)"
            :title="`${copy.recommendationFrom} ${person.name}`"
          >{{ person.label }}</NuxtLink><template v-if="index < people.length - 1">, </template>
        </template>
      </span>
    </p>
  </section>
</template>
