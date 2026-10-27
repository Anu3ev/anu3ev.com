<script setup lang="ts">
import { getLinkNavigation } from '~/utils/links'
import profile from '~~/content/settings/profile.json'

const route = useRoute()
const { locale, copy, localePath } = useLocale()
const siteContent = useSiteContent()
const siteUrl = useSiteOrigin()
const { data: project } = await useAsyncData(
  () => `project-${locale.value}-${route.params.slug}`,
  () =>
    queryCollection('projects')
      .where('locale', '=', locale.value)
      .where('slug', '=', String(route.params.slug))
      .where('published', '=', true)
      .first()
)

if (!project.value) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

/** Future same-site playgrounds keep their context; third-party actions receive the complete safe attribute pair. */
const demoNavigation = computed(() => getLinkNavigation({ href: project.value?.demo, siteUrl }))
const sourceNavigation = computed(() => getLinkNavigation({ href: project.value?.repository, siteUrl }))

usePageSeo({
  title: () => project.value?.title || copy.value.work,
  description: () => project.value?.description || siteContent.value.portfolio.intro,
  parent: () => ({ name: copy.value.work, url: `${siteUrl}${localePath('/work')}` }),
  markdownCopy: () => Boolean(project.value),
  schema: () => {
    const currentProject = project.value
    if (!currentProject) return []

    return [{
      '@context': 'https://schema.org', '@type': 'CreativeWork',
      'name': currentProject.title, 'description': currentProject.description,
      'url': `${siteUrl}${localePath(`/work/${currentProject.slug}`)}`,
      'author': { '@type': 'Person', '@id': `${siteUrl}/#person`, 'name': profile.name, 'url': siteUrl }
    }]
  }
})
</script>

<template>
  <div class="page-shell">
    <ReadingProgress v-if="project" content-selector=".reading-layout" />
    <div v-if="project" class="container page-content">
      <NuxtLink
        :to="localePath('/work')"
        class="text-link back-link"
        :title="copy.backToWork"
      ><AppIcon name="left" /> {{ copy.backToWork }}</NuxtLink>

      <header class="page-heading case-heading">
        <p class="eyebrow">
          {{ project.category }}
        </p>
        <h1>{{ project.title }}</h1>
        <p>{{ project.description }}</p>
      </header>

      <ul v-if="project.results.length" class="fact-list fact-list-wide case-results">
        <li v-for="result in project.results" :key="result.value">
          <strong>{{ result.value }}</strong> <span>{{ result.label }}</span>
        </li>
      </ul>

      <CaseMentions :project="project.slug" />

      <dl class="case-facts">
        <div>
          <dt>{{ copy.projectRole }}</dt>
          <dd>{{ project.role }}</dd>
        </div>
        <div>
          <dt>{{ copy.projectYear }}</dt>
          <dd>{{ project.year }}</dd>
        </div>
        <div>
          <dt>{{ copy.projectStack }}</dt>
          <dd>
            <ul class="tags">
              <li v-for="technology in project.stack" :key="technology">
                {{ technology }}
              </li>
            </ul>
          </dd>
        </div>
      </dl>

      <div v-if="project.repository || project.demo" class="actions">
        <a
          v-if="project.demo"
          :href="project.demo"
          v-bind="demoNavigation"
          class="button button-primary"
          :title="copy.liveDemo"
        >{{ copy.liveDemo }} <AppIcon name="arrow" /></a>
        <a
          v-if="project.repository"
          :href="project.repository"
          v-bind="sourceNavigation"
          class="button button-secondary"
          :title="copy.sourceCode"
        >{{ copy.sourceCode }} <AppIcon name="code" /></a>
      </div>

      <img
        :src="project.cover"
        :alt="project.coverAlt"
        class="case-cover"
        width="1200"
        height="675"
        fetchpriority="high"
      >

      <div class="reading-layout">
        <ContentToc :links="project.body.toc?.links" :title="copy.onThisPage" />

        <ContentRenderer :value="project" class="prose" />
      </div>
    </div>

    <ContactCallout />
  </div>
</template>
