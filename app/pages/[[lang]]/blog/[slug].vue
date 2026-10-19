<script setup lang="ts">
import { getPublicationDate } from '~~/shared/publication'
import { socialImagePath } from '~~/shared/seo'
import profile from '~~/content/settings/profile.json'

const route = useRoute()
const { locale, copy, localePath } = useLocale()
const { siteUrl } = useRuntimeConfig().public
const { data: post } = await useAsyncData(
  () => `post-${locale.value}-${route.params.slug}`,
  () =>
    queryCollection('posts')
      .where('locale', '=', locale.value)
      .where('slug', '=', String(route.params.slug))
      .where('published', '=', true)
      .where('date', '<=', getPublicationDate())
      .first()
)

if (!post.value) throw createError({ statusCode: 404, statusMessage: 'Article not found' })

const dateLabel = computed(() =>
  new Intl.DateTimeFormat(locale.value, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(post.value?.date || '2026-10-20'))
)

usePageSeo({
  title: () => post.value?.title || copy.value.blog,
  description: () => post.value?.description || copy.value.blogIntro,
  type: 'article',
  image: () =>
    post.value
      ? socialImagePath({ locale: locale.value, slug: post.value.slug })
      : '/images/og-default.png',
  parent: () => ({ name: copy.value.blog, url: `${siteUrl}${localePath('/blog')}` }),
  publishedTime: () => post.value?.date,
  schema: () => {
    const article = post.value
    if (!article) return []

    return [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': article.title,
        'description': article.description,
        'datePublished': article.date,
        'image': `${siteUrl}${socialImagePath({ locale: locale.value, slug: article.slug })}`,
        'mainEntityOfPage': `${siteUrl}${localePath(`/blog/${article.slug}`)}`,
        'inLanguage': locale.value,
        'author': { '@type': 'Person', 'name': profile.name, 'url': `${siteUrl}${localePath('/about')}` },
        'publisher': { '@type': 'Person', 'name': profile.name, 'url': siteUrl }
      }
    ]
  }
})
</script>

<template>
  <div class="page-shell">
    <article v-if="post" class="container page-content">
      <NuxtLink
        :to="localePath('/blog')"
        class="text-link back-link"
        :title="copy.backToBlog"
      ><AppIcon name="left" /> {{ copy.backToBlog }}</NuxtLink>

      <header class="article-header">
        <p class="eyebrow">
          {{ post.category }}
        </p>
        <h1>{{ post.title }}</h1>
        <p class="article-description">
          {{ post.description }}
        </p>
        <div class="article-meta">
          <span>{{ profile.name }}</span><time :datetime="post.date">{{ dateLabel }}</time><span>{{ post.readingMinutes }} {{ copy.minuteRead }}</span>
        </div>
      </header>

      <img
        class="article-cover"
        :src="post.cover"
        :alt="post.coverAlt"
        width="1200"
        height="630"
        fetchpriority="high"
      >

      <div class="article-body">
        <ContentRenderer :value="post" class="prose" />
        <ul class="tags" :aria-label="copy.filters">
          <li v-for="tag in post.tags" :key="tag">
            {{ tag }}
          </li>
        </ul>
        <div class="author-line">
          <img
            src="/images/alexander.webp"
            :alt="copy.portraitAlt"
            width="48"
            height="48"
            loading="lazy"
          >
          <div>
            <NuxtLink :to="localePath('/about')" :title="copy.about">{{ profile.name }}</NuxtLink>
            <p class="text-muted">
              {{ copy.role }} · Vue & TypeScript
            </p>
          </div>
        </div>
      </div>
    </article>

    <ContactCallout />
  </div>
</template>
