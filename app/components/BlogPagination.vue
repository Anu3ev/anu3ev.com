<script setup lang="ts">
const props = defineProps<{ page: number, pageCount: number }>()
const route = useRoute()
const { copy, localePath } = useLocale()
const pages = computed(() => Array.from({ length: props.pageCount }, (_, index) => ({
  number: index + 1,
  path: localePath(index === 0 ? '/blog' : `/blog/page/${index + 1}`)
})))
const previousPath = computed(() => localePath(props.page === 2 ? '/blog' : `/blog/page/${props.page - 1}`))
const nextPath = computed(() => localePath(`/blog/page/${props.page + 1}`))
</script>

<template>
  <nav v-if="pageCount > 1" class="pagination" :aria-label="copy.pagination">
    <NuxtLink v-if="page > 1" :to="{ path: previousPath, query: route.query }" :title="copy.previous" rel="prev"><AppIcon name="left" /><span class="sr-only">{{ copy.previous }}</span></NuxtLink>

    <template v-for="item in pages" :key="item.number">
      <span v-if="item.number === page" aria-current="page"><span class="sr-only">{{ copy.page }} </span>{{ item.number }}</span>
      <NuxtLink v-else :to="{ path: item.path, query: route.query }" :title="`${copy.page} ${item.number}`">{{ item.number }}</NuxtLink>
    </template>

    <NuxtLink v-if="page < pageCount" :to="{ path: nextPath, query: route.query }" :title="copy.next" rel="next"><AppIcon name="right" /><span class="sr-only">{{ copy.next }}</span></NuxtLink>
  </nav>
</template>
