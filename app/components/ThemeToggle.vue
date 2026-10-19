<script setup lang="ts">
const { copy } = useLocale()
const isLight = ref(false)

onMounted(() => {
  isLight.value = document.documentElement.dataset.theme === 'light'
})

/** Updates this browser's preference; a storage failure must not prevent the visible theme change. */
function toggleTheme() {
  isLight.value = !isLight.value
  const theme = isLight.value ? 'light' : 'dark'
  document.documentElement.dataset.theme = theme

  try {
    localStorage.setItem('anu3ev-theme', theme)
  }
  catch (error) {
    console.error('Could not save the colour preference', error)
  }
}
</script>

<template>
  <button
    type="button"
    class="icon-button"
    :title="copy.switchTheme"
    :aria-label="copy.switchTheme"
    :aria-pressed="isLight"
    @click="toggleTheme"
  >
    <AppIcon name="contrast" />
  </button>
</template>
