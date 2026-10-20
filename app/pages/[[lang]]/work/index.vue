<script setup lang="ts">
const { locale, copy } = useLocale()
const route = useRoute()
const router = useRouter()
const siteContent = useSiteContent()
const filtersReady = ref(false)
onMounted(() => {
  filtersReady.value = true
})
const { data: projects } = await useAsyncData(
  () => `work-${locale.value}`,
  () =>
    queryCollection('projects')
      .where('locale', '=', locale.value)
      .where('published', '=', true)
      .order('order', 'ASC')
      .select('locale', 'slug', 'title', 'description', 'category', 'year', 'stack', 'results')
      .all()
)
const categories = computed(() => [...new Set(projects.value?.map(project => project.category))])
/** A shareable category restores browser history; unknown or pre-hydration values show all work. */
const category = computed<string>({
  get: () => {
    const topic = route.query.topic
    if (!filtersReady.value || typeof topic !== 'string' || !categories.value.includes(topic)) return ''

    return topic
  },
  set: value => router.replace({ path: route.path, query: { topic: value || undefined } })
})
const visibleProjects = computed(() =>
  projects.value?.filter(project => !category.value || project.category === category.value)
)

usePageSeo({
  title: () => copy.value.work,
  description: () => siteContent.value.portfolio.intro,
  noindex: () => Boolean(category.value)
})
</script>

<template>
  <div class="page-shell">
    <div>
      <header class="page-heading">
        <span class="eyebrow">{{ copy.selectedWork }}</span>
        <h1>
          {{ siteContent.portfolio.title.replace(/\.$/, '') }}<span v-if="siteContent.portfolio.title.endsWith('.')" class="accent-period">.</span>
        </h1>
        <p>{{ siteContent.portfolio.intro }}</p>
        <dl class="portfolio-summary">
          <div v-for="fact in siteContent.portfolio.summary" :key="fact.label">
            <dt>{{ fact.value }}</dt>
            <dd>{{ fact.label }}</dd>
          </div>
        </dl>
      </header>
      <div class="portfolio-toolbar" role="group" :aria-label="copy.projectStack" :aria-busy="!filtersReady">
        <button
          type="button"
          class="topic-filter"
          :title="copy.allWork"
          :aria-pressed="category === ''"
          :disabled="!filtersReady"
          @click="category = ''"
        >
          {{ copy.allWork }}
        </button>
        <button
          v-for="topic in categories"
          :key="topic"
          type="button"
          class="topic-filter"
          :title="topic"
          :aria-pressed="category === topic"
          :disabled="!filtersReady"
          @click="category = topic"
        >
          {{ topic }}
        </button>
      </div>

      <div class="project-grid work-grid">
        <ProjectCard v-for="project in visibleProjects" :key="project.slug" :project="project" />
      </div>
    </div>

    <ContactCallout />
  </div>
</template>
