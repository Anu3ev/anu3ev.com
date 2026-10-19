<script setup lang="ts">
const { locale, copy } = useLocale()
const category = ref('')
const { data: projects } = await useAsyncData(() => `work-${locale.value}`, () => queryCollection('projects')
  .where('locale', '=', locale.value).where('published', '=', true).order('order', 'ASC')
  .select('slug', 'title', 'description', 'category', 'year', 'cover', 'coverAlt', 'stack').all())
const categories = computed(() => [...new Set(projects.value?.map(project => project.category))])
const visibleProjects = computed(() => projects.value?.filter(project => !category.value || project.category === category.value))

usePageSeo({ title: () => copy.value.work, description: () => copy.value.workIntro })
</script>

<template>
  <div class="page-shell">
    <div>
      <header class="page-heading">
        <p class="eyebrow">
          {{ copy.selectedWork }}
        </p><h1>{{ copy.workHeading }}</h1><p>{{ copy.workIntro }}</p>
      </header>
      <div class="blog-toolbar" role="group" :aria-label="copy.projectStack">
        <button
          type="button"
          class="topic-filter"
          :title="copy.allWork"
          :aria-pressed="category === ''"
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
