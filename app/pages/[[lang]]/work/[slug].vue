<script setup lang="ts">
const route = useRoute()
const { locale, copy, localePath } = useLocale()
const { siteUrl } = useRuntimeConfig().public
const { data: project } = await useAsyncData(() => `project-${locale.value}-${route.params.slug}`, () => queryCollection('projects')
  .where('locale', '=', locale.value).where('slug', '=', String(route.params.slug)).where('published', '=', true).first())

if (!project.value) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

usePageSeo({
  title: () => project.value?.title || copy.value.work,
  description: () => project.value?.description || copy.value.workIntro,
  schema: () => [{
    '@context': 'https://schema.org', '@type': 'CreativeWork',
    'name': project.value?.title, 'description': project.value?.description,
    'url': `${siteUrl}${route.path}`, 'author': { '@type': 'Person', 'name': 'Alexander Anufriev', 'url': siteUrl }
  }]
})
</script>

<template>
  <div class="page-shell">
    <div v-if="project" class="container page-content">
      <NuxtLink :to="localePath('/work')" class="text-link back-link" :title="copy.backToWork"><AppIcon name="left" /> {{ copy.backToWork }}</NuxtLink>

      <header class="page-heading case-heading">
        <p class="eyebrow">
          {{ project.category }}
        </p><h1>{{ project.title }}</h1><p>{{ project.description }}</p>
      </header>

      <dl class="case-facts">
        <div><dt>{{ copy.projectRole }}</dt><dd>{{ project.role }}</dd></div>
        <div><dt>{{ copy.projectYear }}</dt><dd>{{ project.year }}</dd></div>
        <div>
          <dt>{{ copy.projectStack }}</dt><dd>
            <ul class="tags">
              <li v-for="technology in project.stack" :key="technology">
                {{ technology }}
              </li>
            </ul>
          </dd>
        </div>
      </dl>

      <div v-if="project.repository || project.demo" class="actions">
        <a v-if="project.demo" :href="project.demo" class="button button-primary" :title="copy.liveDemo">{{ copy.liveDemo }} <AppIcon name="arrow" /></a>
        <a v-if="project.repository" :href="project.repository" class="button button-secondary" :title="copy.sourceCode">{{ copy.sourceCode }} <AppIcon name="code" /></a>
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
        <ContentRenderer :value="project" class="prose" />

        <ContentToc :links="project.body.toc?.links" :title="project.title" />
      </div>
    </div>

    <ContactCallout />
  </div>
</template>
