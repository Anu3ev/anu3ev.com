<script setup lang="ts">
import { getPostSummaries } from '~/queries/posts'
import profile from '~~/content/settings/profile.json'
import { typeset } from '~~/shared/typography'

const { locale, copy, localePath } = useLocale()
const siteContent = useSiteContent()
const siteUrl = useSiteOrigin()
/** The bio keeps its paragraphs apart with a line break in the source. */
const bioParagraphs = computed(() => typeset({ text: profile[`bio_${locale.value}`], locale: locale.value }).split('\n'))
const { data: projects } = await useAsyncData(
  () => `home-projects-${locale.value}`,
  () =>
    queryCollection('projects')
      .where('locale', '=', locale.value)
      .where('published', '=', true)
      .where('featured', '=', true)
      .order('order', 'ASC')
      .select('locale', 'slug', 'title', 'description', 'category', 'year', 'context', 'stack', 'results')
      .limit(1)
      .all()
)
const { data: posts } = await useAsyncData(
  () => `home-posts-${locale.value}`,
  () => getPostSummaries({ locale: locale.value, limit: 1 })
)

usePageSeo({
  title: () => siteContent.value.home.seoTitle,
  description: () => `${profile[`headline_${locale.value}`]}. ${profile[`bio_${locale.value}`]}`,
  schema: [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      'name': profile.name,
      'alternateName': profile.name_ru,
      'url': siteUrl,
      'jobTitle': profile.headline_en,
      'description': profile.bio_en.replace(/\s*\n\s*/g, ' '),
      'image': `${siteUrl}${profile.photo}`,
      'knowsAbout': siteContent.value.about.technologies,
      'knowsLanguage': ['English', 'Russian'],
      'sameAs': [profile.github, profile.linkedin, profile.telegram]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': profile.name,
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
        <p class="cover-statement">
          <strong>{{ copy.coverTitle }}</strong>
          <span>{{ copy.coverText }}</span>
        </p>
        <div class="cover-shapes" aria-hidden="true">
          <i /><i /><i />
        </div>
        <NuxtLink
          class="cover-editor"
          :to="localePath('/work/product-image-editor')"
          :title="copy.openEditorCase"
          :aria-label="copy.openEditorCase"
        ><img
          src="/images/editor-cover.webp"
          alt=""
          width="960"
          height="521"
          fetchpriority="high"
        ></NuxtLink>
      </div>

      <div class="profile-body">
        <div class="profile-actions">
          <span class="profile-avatar" aria-hidden="true"><img
            :src="profile.avatar"
            alt=""
            width="86"
            height="86"
            loading="eager"
            decoding="async"
          ><i /></span><NuxtLink
            :to="localePath('/contact')"
            class="button button-secondary"
            :title="copy.letsTalk"
          >{{ copy.letsTalk }} <AppIcon name="arrow" /></NuxtLink>
        </div>
        <h1 id="home-title">
          {{ locale === 'en' ? profile.name : profile.name_ru
          }}<span class="accent-period">.</span>
        </h1>
        <p class="profile-role">
          {{ profile[`headline_${locale}`] }}
        </p>
        <p v-for="paragraph in bioParagraphs" :key="paragraph" class="profile-description">
          {{ paragraph }}
        </p>
        <p class="profile-location">
          <span><AppIcon name="location" />{{ locale === 'ru' ? profile.location_ru : profile.location }}</span><span><AppIcon name="globe" />{{ copy.remote }}</span>
        </p>
        <div class="actions profile-cta">
          <a
            :href="profile[`cv_${locale}`]"
            class="button button-primary"
            :title="copy.downloadCv"
            type="application/pdf"
            download
          >{{ copy.downloadCv }} <AppIcon name="download" /></a>
          <a
            :href="profile.calendly"
            class="button button-secondary"
            :title="copy.bookCall"
            target="_blank"
            rel="noopener noreferrer"
          >{{ copy.bookCall }} <AppIcon name="calendar" /></a>
        </div>
        <ul class="fact-list profile-highlights">
          <li v-for="highlight in siteContent.home.highlights" :key="highlight.value">
            <strong>{{ highlight.value }}</strong> <span>{{ highlight.label }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section class="pinned-note" aria-labelledby="pinned-note-title">
      <h2 id="pinned-note-title">
        {{ siteContent.home.pinnedTitle }}
      </h2>
      <p>{{ siteContent.home.pinnedBody }}</p>
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
