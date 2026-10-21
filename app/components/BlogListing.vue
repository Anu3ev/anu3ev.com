<script setup lang="ts">
import { getPostSummaries } from '~/queries/posts'
import { paginate } from '~/utils/pagination'
import { BLOG_PAGE_SIZE } from '~~/shared/blog'

const props = defineProps<{ page: number }>()
const route = useRoute()
const router = useRouter()
const { locale, copy, localePath } = useLocale()
const siteContent = useSiteContent()
const siteUrl = useSiteOrigin()
// Static HTML is unfiltered. Restore the direct URL's query after hydration.
const filtersReady = ref(false)
onMounted(() => {
  filtersReady.value = true
})
const search = computed<string>({
  get: () => filtersReady.value && typeof route.query.q === 'string' ? route.query.q.slice(0, 200) : '',
  set: value => updateFilters({ search: value.slice(0, 200), category: category.value })
})
const category = computed<string>({
  get: () => filtersReady.value && typeof route.query.topic === 'string' ? route.query.topic : '',
  set: value => updateFilters({ search: search.value, category: value })
})
const { data: posts } = await useAsyncData(
  () => `blog-${locale.value}`,
  () => getPostSummaries({ locale: locale.value })
)
const categories = computed(() => [...new Set(posts.value?.map(post => post.category))])
const filteredPosts = computed(() =>
  (posts.value || []).filter((post) => {
    const matchesCategory = !category.value || post.category === category.value
    // The placeholder promises "title or topic", so the category label is searchable too.
    const searchableText = [post.title, post.description, post.category, ...post.tags]
      .join(' ')
      .toLocaleLowerCase(locale.value)
    return (
      matchesCategory
      && searchableText.includes(search.value.trim().toLocaleLowerCase(locale.value))
    )
  })
)

if (props.page > Math.max(1, Math.ceil(filteredPosts.value.length / BLOG_PAGE_SIZE))) {
  throw createError({ statusCode: 404, statusMessage: 'Blog page not found' })
}

// While an interactive filter navigates back to page one, keep rendering a valid slice.
const pagination = computed(() =>
  paginate({
    items: filteredPosts.value,
    page: Math.min(props.page, Math.max(1, Math.ceil(filteredPosts.value.length / BLOG_PAGE_SIZE)))
  })
)

/** Direct client replacement avoids navigateTo treating overlapping edits as middleware redirects. */
function updateFilters(nextFilters: { search: string, category: string }) {
  return router.replace({
    path: props.page === 1 ? route.path : localePath('/blog'),
    query: { q: nextFilters.search || undefined, topic: nextFilters.category || undefined }
  })
}

usePageSeo({
  title: () =>
    props.page > 1 ? `${copy.value.blog} · ${copy.value.page} ${props.page}` : copy.value.blog,
  description: () => siteContent.value.blog.intro,
  parent: () =>
    props.page > 1 ? { name: copy.value.blog, url: `${siteUrl}${localePath('/blog')}` } : undefined,
  noindex: () => Boolean(search.value || category.value)
})
</script>

<template>
  <div>
    <header class="page-heading">
      <span class="eyebrow">{{ copy.recentWriting }}</span>
      <h1>
        {{ siteContent.blog.title.replace(/\.$/, '') }}<span v-if="siteContent.blog.title.endsWith('.')" class="accent-period">.</span>
      </h1>
      <p>{{ siteContent.blog.intro }}</p>
    </header>

    <div class="blog-toolbar" :aria-busy="!filtersReady">
      <div class="topic-filters" role="group" :aria-label="copy.filters">
        <button
          type="button"
          class="topic-filter"
          :title="copy.allTopics"
          :aria-pressed="category === ''"
          :disabled="!filtersReady"
          @click="category = ''"
        >
          {{ copy.allTopics }}
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

      <label class="blog-search">
        <span class="sr-only">{{ copy.search }}</span>
        <AppIcon name="search" />
        <input
          v-model="search"
          type="search"
          name="q"
          :title="copy.search"
          :placeholder="copy.searchPlaceholder"
          autocomplete="off"
          maxlength="200"
          :disabled="!filtersReady"
        >
      </label>
    </div>

    <div class="feed-heading blog-results-heading">
      <h2>{{ copy.workbench }}</h2>
      <p class="blog-results-count" role="status">
        {{ copy.articlesCount }}: {{ pagination.total }}
      </p>
    </div>

    <div class="post-grid blog-grid">
      <PostCard
        v-for="(post, index) in pagination.items"
        :key="post.slug"
        :post="post"
        :position="(pagination.page - 1) * 10 + index + 1"
      />
      <div v-if="pagination.total === 0" class="empty-state">
        <h2>{{ copy.noArticles }}</h2>
        <p>{{ copy.noArticlesHint }}</p>
      </div>
    </div>

    <BlogPagination :page="pagination.page" :page-count="pagination.pageCount" />
  </div>

  <ContactCallout />
</template>
