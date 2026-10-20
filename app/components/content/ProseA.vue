<script setup lang="ts">
import { getLinkNavigation } from '~/utils/links'

const props = defineProps<{ href?: string, title?: string, target?: string, rel?: string }>()
const siteUrl = useSiteOrigin()

/** Keep target and relationship attributes under the same tested policy as project actions. */
const navigation = computed(() => getLinkNavigation({ href: props.href, siteUrl, target: props.target, rel: props.rel }))
</script>

<template>
  <a
    :href="href"
    :title="title || href"
    v-bind="navigation"
  ><slot /></a>
</template>
