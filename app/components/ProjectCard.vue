<script setup lang="ts">
import type { ProjectSummary } from '~/types/content'
import { PROJECT_IMAGE_WIDTHS, projectImagePath } from '~~/shared/images'

const { project } = defineProps<{ project: ProjectSummary, featured?: boolean }>()
const { copy, localePath } = useLocale()
const responsiveSources = computed(() => PROJECT_IMAGE_WIDTHS.map(width => `${projectImagePath({ locale: project.locale, slug: project.slug, width })} ${width}w`).join(', '))
</script>

<template>
  <article class="project-card" :class="{ 'project-card-featured': featured }">
    <div class="card-author">
      <span class="tiny-avatar" aria-hidden="true">aa</span>
      <div>
        <strong>{{ project.category }}</strong><span>{{ project.stack[0] }} · {{ project.year }}</span>
      </div>
      <span class="mini-tag">{{ project.stack[0] }}</span>
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
      sizes="(max-width: 760px) calc(100vw - 62px), (max-width: 944px) calc(100vw - 320px), 624px"
      alt=""
      width="1200"
      height="675"
      loading="lazy"
      decoding="async"
    ></NuxtLink>

    <div class="project-card-body">
      <h3>
        <NuxtLink
          :to="localePath(`/work/${project.slug}`)"
          :title="`${copy.viewCase}: ${project.title}`"
        >{{ project.title }}</NuxtLink>
      </h3>
      <p>{{ project.description }}</p>
      <div class="project-card-bottom">
        <ul class="tags" :aria-label="copy.projectStack">
          <li v-for="technology in project.stack" :key="technology">
            {{ technology }}
          </li>
        </ul>
        <NuxtLink
          :to="localePath(`/work/${project.slug}`)"
          class="text-link"
          :title="`${copy.viewCase}: ${project.title}`"
        >{{ copy.viewCase }} <AppIcon name="arrow" /></NuxtLink>
      </div>
    </div>
  </article>
</template>
