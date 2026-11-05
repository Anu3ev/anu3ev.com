<script setup lang="ts">
import type { PostSummary } from '~/types/content'
import { formatDay } from '~~/shared/page-content'
import { typeset } from '~~/shared/typography'

const { post } = defineProps<{ post: PostSummary }>()
const { copy, locale, localePath } = useLocale()
const dateLabel = computed(() => formatDay({ value: post.date, locale: locale.value }))
</script>

<template>
  <article class="post-card">
    <div class="post-card-top">
      <span class="eyebrow">{{ post.category }}</span><time :datetime="post.date">{{ dateLabel }}</time>
    </div>
    <NuxtLink
      :to="localePath(`/blog/${post.slug}`)"
      class="post-image-link"
      :title="`${copy.readArticle}: ${post.title}`"
      tabindex="-1"
      aria-hidden="true"
    ><img
      :src="post.cover"
      alt=""
      width="1200"
      height="630"
      loading="lazy"
      decoding="async"
    ></NuxtLink>
    <h2>
      <NuxtLink
        :to="localePath(`/blog/${post.slug}`)"
        :title="`${copy.readArticle}: ${post.title}`"
      >{{ post.title }}</NuxtLink>
    </h2>
    <p>{{ typeset({ text: post.description, locale }) }}</p>
    <div class="post-card-bottom">
      <span>{{ post.readingMinutes }} {{ copy.minuteRead }}</span><NuxtLink
        :to="localePath(`/blog/${post.slug}`)"
        class="text-link"
        :title="`${copy.readArticle}: ${post.title}`"
      >{{ copy.readArticle }} <AppIcon name="arrow" /></NuxtLink>
    </div>
  </article>
</template>
