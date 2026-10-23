<script setup lang="ts">
/** Small inline SVG icons keep navigation independent of an icon font or network request. */
const paths = {
  person: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21a8 8 0 0 1 16 0',
  home: 'M3 10l9-7 9 7v10H3zM9 20v-7h6v7',
  briefcase: 'M3 7h18v14H3zM8 7V3h8v4M3 12h18',
  download: 'M12 4v11m-5-5 5 5 5-5M5 20h14',
  arrow: 'M7 17 17 7M7 7h10v10',
  right: 'M4 12h16m-6-6 6 6-6 6',
  left: 'M20 12H4m6-6-6 6 6 6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'm6 6 12 12M6 18 18 6',
  mail: 'M3 6h18v12H3zm0 0 9 7 9-7',
  search: 'm16 16 5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  code: 'm8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M3 12h18M12 3c2.4 2.6 3.6 5.6 3.6 9s-1.2 6.4-3.6 9c-2.4-2.6-3.6-5.6-3.6-9S9.6 5.6 12 3',
  location: 'M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13zm3-13a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  sun: 'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5',
  check: 'm5 12 4 4L19 6',
  book: 'M5 3h14v18H5zM8 7h8M8 11h8M8 15h5'
}

defineProps<{ name: keyof typeof paths }>()
</script>

<template>
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    :data-icon="name"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="paths[name]" />
  </svg>
</template>
