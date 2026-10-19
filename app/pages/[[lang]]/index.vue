<script setup lang="ts">
import { getPostSummaries } from '~/queries/posts'
import profile from '~~/content/settings/profile.json'

const { locale, copy, localePath } = useLocale()
const { siteUrl } = useRuntimeConfig().public
const { data: projects } = await useAsyncData(
  () => `home-projects-${locale.value}`,
  () =>
    queryCollection('projects')
      .where('locale', '=', locale.value)
      .where('published', '=', true)
      .where('featured', '=', true)
      .order('order', 'ASC')
      .select('locale', 'slug', 'title', 'description', 'category', 'year', 'stack')
      .limit(1)
      .all()
)
const { data: posts } = await useAsyncData(
  () => `home-posts-${locale.value}`,
  () => getPostSummaries({ locale: locale.value, limit: 1 })
)

usePageSeo({
  title: () =>
    locale.value === 'en'
      ? 'Product Frontend Engineer · Vue & TypeScript'
      : 'Frontend-разработчик · Vue и TypeScript',
  description: () => profile[`bio_${locale.value}`],
  schema: [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': profile.name,
      'url': siteUrl,
      'jobTitle': 'Product Frontend Engineer',
      'sameAs': [profile.github, profile.linkedin, profile.telegram]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'Alexander Anufriev',
      'url': siteUrl,
      'inLanguage': ['en', 'ru']
    }
  ]
})
</script>

<template>
  <div>
    <section class="home-profile" aria-labelledby="home-title">
      <div class="profile-cover">
        <span>{{ copy.crafting }}</span>
        <div class="cover-shapes" aria-hidden="true">
          <i /><i /><i />
        </div>
        <code>&lt;ideas /&gt; → interfaces</code>
      </div>

      <div class="profile-body">
        <div class="profile-actions">
          <span class="profile-avatar" aria-hidden="true">aa<i /></span><NuxtLink
            :to="localePath('/contact')"
            class="button button-secondary"
            :title="copy.letsTalk"
          >{{ copy.letsTalk }} <AppIcon name="arrow" /></NuxtLink>
        </div>
        <h1 id="home-title">
          {{ locale === 'en' ? profile.name : copy.portraitAlt
          }}<span class="accent-period">.</span>
        </h1>
        <p class="profile-role">
          {{ profile[`headline_${locale}`] }}
        </p>
        <p class="profile-description">
          {{ profile[`bio_${locale}`] }}
        </p>
        <p class="profile-location">
          <span>◎ {{ profile.location }}</span><span>↗ {{ copy.remote }}</span>
        </p>
        <ul class="tags">
          <li>Vue.js</li>
          <li>TypeScript</li>
          <li>{{ copy.editors }}</li>
          <li>E-commerce SaaS</li>
        </ul>
      </div>
    </section>

    <div class="feed-heading">
      <h2>{{ copy.workbench }}</h2>
      <span>{{ copy.workAndNotes }}</span>
    </div>

    <section class="pinned-note" aria-labelledby="pinned-note-title">
      <p class="eyebrow">
        ↳ {{ copy.pinnedNote }}
      </p>
      <h2 id="pinned-note-title">
        {{ copy.pinnedTitle }}
      </h2>
      <p>{{ copy.pinnedBody }}</p>
    </section>

    <div class="project-grid">
      <ProjectCard v-for="project in projects" :key="project.slug" :project="project" featured />
    </div>
    <NuxtLink
      :to="localePath('/work')"
      class="feed-more"
      :title="copy.viewAllWork"
    >{{ copy.viewAllWork }} <AppIcon name="right" /></NuxtLink>

    <section v-if="posts?.length" class="home-notebook" aria-labelledby="notebook-title">
      <p class="eyebrow">
        {{ copy.recentWriting }}
      </p>
      <template v-for="post in posts" :key="post.slug">
        <h2 id="notebook-title">
          <NuxtLink :to="localePath(`/blog/${post.slug}`)" :title="post.title">{{
            post.title
          }}</NuxtLink>
        </h2>
        <NuxtLink
          :to="localePath(`/blog/${post.slug}`)"
          class="text-link"
          :title="copy.readArticle"
        >{{ copy.readArticle }} <AppIcon name="arrow" /></NuxtLink>
      </template>
    </section>
  </div>
</template>
