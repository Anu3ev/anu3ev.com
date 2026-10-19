<script setup lang="ts">
const route = useRoute()

definePageMeta({
  validate: (route) => {
    const page = Number(route.params.page)
    return Number.isSafeInteger(page) && page >= 2 && String(page) === route.params.page
  }
})
</script>

<template>
  <BlogListing :key="route.fullPath" :page="Number(route.params.page)" />
</template>
