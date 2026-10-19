<script setup lang="ts">
import type { PostSummary } from '~/types/content'

const { post } = defineProps<{ post: PostSummary, illustrated?: boolean, position?: number }>()
const { copy, locale, localePath } = useLocale()
const dateLabel = computed(() => new Intl.DateTimeFormat(locale.value, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(post.date)))
</script>

<template>
  <article class="post-card">
    <div class="post-card-top">
      <span class="eyebrow">{{ String(position || 1).padStart(2, '0') }} / {{ post.category }}</span><time :datetime="post.date">{{ dateLabel }}</time>
    </div>
    <NuxtLink
      v-if="illustrated"
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
    <h2><NuxtLink :to="localePath(`/blog/${post.slug}`)" :title="`${copy.readArticle}: ${post.title}`">{{ post.title }}</NuxtLink></h2>
    <p>{{ post.description }}</p>
    <div class="post-card-bottom">
      <span>{{ post.readingMinutes }} {{ copy.minuteRead }}</span><NuxtLink :to="localePath(`/blog/${post.slug}`)" class="text-link" :title="`${copy.readArticle}: ${post.title}`">{{ copy.readArticle }} <AppIcon name="arrow" /></NuxtLink>
    </div>
  </article>
</template>
