<script setup lang="ts">
defineProps<{ href?: string, title?: string, target?: string }>()
</script>

<template>
  <a
    :href="href"
    :title="title || href"
    :target="target"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
  ><slot /></a>
</template>
