<script setup lang="ts">
import type { ProjectSummary } from '~/types/content'
import { PROJECT_IMAGE_WIDTHS, projectImagePath } from '~~/shared/images'
import { typeset } from '~~/shared/typography'

const { project } = defineProps<{ project: ProjectSummary, featured?: boolean }>()
const { copy, localePath, locale } = useLocale()
const responsiveSources = computed(() => PROJECT_IMAGE_WIDTHS.map(width => `${projectImagePath({ locale: project.locale, slug: project.slug, width })} ${width}w`).join(', '))
</script>

<template>
  <article class="project-card" :class="{ 'project-card-featured': featured }">
    <div class="card-meta">
      <span>{{ project.context }} · {{ project.year }}</span>
      <span class="mini-tag">{{ project.category }}</span>
    </div>

    <NuxtLink
      :to="localePath(`/work/${project.slug}`)"
      class="project-image-link"
      :title="`${copy.viewCase}: ${project.title}`"
      tabindex="-1"
      aria-hidden="true"
    ><img
      :src="projectImagePath({ locale: project.locale, slug: project.slug, width: 1200 })"
      :srcset="responsiveSources"
      sizes="(max-width: 760px) calc(100vw - 70px), (max-width: 1072px) calc(100vw - 366px), 608px"
      alt=""
      width="1200"
      height="675"
      loading="lazy"
      decoding="async"
    ></NuxtLink>

    <div class="project-card-body">
      <h2>
        <NuxtLink
          :to="localePath(`/work/${project.slug}`)"
          :title="`${copy.viewCase}: ${project.title}`"
        >{{ project.title }}</NuxtLink>
      </h2>
      <p>{{ typeset({ text: project.description, locale }) }}</p>
      <ul v-if="project.results.length" class="card-results">
        <li v-for="result in project.results.slice(0, 2)" :key="result.value">
          <strong>{{ result.value }}</strong> {{ typeset({ text: result.label, locale }) }}
        </li>
      </ul>
      <div class="project-card-bottom">
        <NuxtLink
          :to="localePath(`/work/${project.slug}`)"
          class="text-link"
          :title="`${copy.viewCase}: ${project.title}`"
        >{{ copy.viewCase }} <AppIcon name="arrow" /></NuxtLink>
      </div>
    </div>
  </article>
</template>
