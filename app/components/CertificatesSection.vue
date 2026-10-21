<script setup lang="ts">
import { formatMonth } from '~~/shared/page-content'

const { copy, locale } = useLocale()
const { featuredCertificates, otherCertificates } = useCertificates()
const categoryLabels = computed(() => ({
  course: copy.value.certificateCourse,
  test: copy.value.certificateTest,
  lessons: copy.value.certificateLessons
}))

/**
 * Issuer pages open in a new tab like every external link on the site; a copy hosted here keeps the tab.
 * The new-tab note is spoken only when a new tab really opens.
 */
function describeLink(url: string) {
  const opensNewTab = url.startsWith('https://')
  return {
    attributes: opensNewTab ? { href: url, target: '_blank', rel: 'noopener noreferrer' } : { href: url },
    newTabNote: opensNewTab ? `, ${copy.value.opensInNewTab}` : ''
  }
}
</script>

<template>
  <section class="page-content" aria-labelledby="certificates-title">
    <p class="eyebrow">
      {{ copy.certificates }}
    </p>
    <h2 id="certificates-title">
      {{ copy.certificatesTitle }}
    </h2>

    <ul class="certificate-grid">
      <li v-for="certificate in featuredCertificates" :key="certificate.name">
        <article class="certificate-card">
          <img
            class="certificate-preview"
            :src="certificate.image"
            :alt="certificate[`imageAlt_${locale}`]"
            width="800"
            height="600"
            loading="lazy"
            decoding="async"
          >
          <div class="certificate-body">
            <p class="certificate-meta">
              {{ categoryLabels[certificate.category] }} · <time :datetime="certificate.issued">{{ formatMonth(certificate.issued) }}</time>
            </p>
            <h3>{{ certificate.name }}</h3>
            <p class="certificate-issuer">
              {{ certificate.issuer }}
            </p>
            <p class="certificate-summary">
              {{ certificate[`summary_${locale}`] }}
            </p>
            <SkillTags :skills="certificate.skills" :label="copy.projectStack" />
            <a
              v-if="certificate.url"
              v-bind="describeLink(certificate.url).attributes"
              class="text-link certificate-link"
              :title="`${copy.viewCertificate}: ${certificate.name}`"
            >{{ copy.viewCertificate }}<span class="sr-only">{{ certificate.name }}{{ describeLink(certificate.url).newTabNote }}</span> <AppIcon name="arrow" /></a>
          </div>
        </article>
      </li>
    </ul>

    <h3 class="certificates-subtitle">
      {{ copy.otherCertificates }}
    </h3>
    <ul class="certificate-list">
      <!-- A whole row is the link, like the contact rows; a certificate without a public page stays plain text. -->
      <li v-for="certificate in otherCertificates" :key="certificate.name">
        <a
          v-if="certificate.url"
          v-bind="describeLink(certificate.url).attributes"
          class="certificate-row"
          :title="`${copy.viewCertificate}: ${certificate.name}`"
        >
          <span class="certificate-list-text">
            <strong>{{ certificate.name }}</strong>
            <span>{{ certificate.issuer }} · {{ categoryLabels[certificate.category] }} · <time :datetime="certificate.issued">{{ formatMonth(certificate.issued) }}</time></span>
          </span>
          <span class="sr-only">{{ copy.viewCertificate }}{{ describeLink(certificate.url).newTabNote }}</span>
          <AppIcon name="arrow" />
        </a>
        <div v-else class="certificate-row">
          <span class="certificate-list-text">
            <strong>{{ certificate.name }}</strong>
            <span>{{ certificate.issuer }} · {{ categoryLabels[certificate.category] }} · <time :datetime="certificate.issued">{{ formatMonth(certificate.issued) }}</time></span>
          </span>
        </div>
      </li>
    </ul>
  </section>
</template>
