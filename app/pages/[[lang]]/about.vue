<script setup lang="ts">
const { copy } = useLocale()
/** Verified tools from the project notes, kept as a compact supporting list. */
const technologies = ['Vue 3', 'Nuxt', 'TypeScript', 'JavaScript', 'Pinia', 'FabricJS', 'Monaco', 'TinyMCE', 'Tailwind CSS', 'Vuetify', 'Vite', 'Playwright', 'Jest', 'REST API']
const principles = computed(() => [
  { title: copy.value.approachOne, description: copy.value.approachOneBody },
  { title: copy.value.approachTwo, description: copy.value.approachTwoBody },
  { title: copy.value.approachThree, description: copy.value.approachThreeBody }
])

usePageSeo({ title: () => copy.value.about, description: () => copy.value.aboutBody })
</script>

<template>
  <div class="page-shell">
    <div class="container">
      <header class="page-heading">
        <p class="eyebrow">
          {{ copy.about }}
        </p><h1>{{ copy.aboutTitle }}</h1><p>{{ copy.aboutIntro }}</p>
      </header>

      <div class="about-grid">
        <figure>
          <img
            class="about-photo"
            src="/images/alexander.webp"
            :alt="copy.portraitAlt"
            width="600"
            height="600"
            fetchpriority="high"
          >
        </figure>
        <div>
          <p class="large-copy">
            {{ copy.aboutBody }}
          </p><p class="text-muted">
            {{ copy.aboutStory }}
          </p><h2 class="mt-8 text-2xl">
            {{ copy.toolkit }}
          </h2><ul class="tags">
            <li v-for="technology in technologies" :key="technology">
              {{ technology }}
            </li>
          </ul>
        </div>
      </div>

      <section class="page-content" aria-labelledby="experience-title">
        <p class="eyebrow">
          {{ copy.experience }}
        </p><h2 id="experience-title">
          inSales
        </h2>
        <div class="timeline">
          <article class="timeline-item">
            <time datetime="2021-10">10.2021 — 08.2026</time><div><h3>{{ copy.frontendJob }}</h3><p>{{ copy.frontendDescription }}</p></div>
          </article>
          <article class="timeline-item">
            <time datetime="2019-10">10.2019 — 10.2021</time><div><h3>{{ copy.supportJob }}</h3><p>{{ copy.supportDescription }}</p></div>
          </article>
        </div>
      </section>

      <section class="page-content" aria-labelledby="approach-title">
        <p class="eyebrow">
          {{ copy.approach }}
        </p><h2 id="approach-title">
          {{ copy.services }}
        </h2>
        <div class="approach-grid">
          <article v-for="(principle, index) in principles" :key="principle.title" class="approach-card">
            <span class="approach-number">0{{ index + 1 }}</span><h3>{{ principle.title }}</h3><p>{{ principle.description }}</p>
          </article>
        </div>
      </section>
    </div>

    <ContactCallout />
  </div>
</template>
