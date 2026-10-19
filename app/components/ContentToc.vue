<script setup lang="ts">
defineProps<{ links?: { id: string, text: string }[], title: string }>()
</script>

<template>
  <nav v-if="links?.length" class="table-of-contents" :aria-label="title">
    <p class="eyebrow">
      {{ title }}
    </p>
    <ol>
      <li v-for="heading in links" :key="heading.id">
        <a :href="`#${heading.id}`" :title="heading.text">{{ heading.text }}</a>
      </li>
    </ol>
  </nav>
</template>
