<script setup lang="ts">
const { copy, localePath } = useLocale()
</script>

<template>
  <footer class="site-footer">
    <span>© {{ new Date().getUTCFullYear() }} Alexander Anufriev</span><NuxtLink :to="localePath('/privacy')" :title="copy.privacy">{{ copy.privacy }}</NuxtLink><span>{{ copy.tagline }}</span>
  </footer>
</template>
