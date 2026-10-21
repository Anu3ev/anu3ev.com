<script setup lang="ts">
const { copy } = useLocale()
/** The prepainted browser theme is only known after mount; the toggle waits for that state. */
const isLight = ref<boolean | null>(null)

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
  <!-- Both states stay visible; the filled half marks the current theme. -->
  <button
    type="button"
    role="switch"
    class="theme-switch"
    :title="copy.darkTheme"
    :aria-label="copy.darkTheme"
    :aria-checked="isLight === null ? undefined : !isLight"
    :disabled="isLight === null"
    @click="toggleTheme"
  >
    <AppIcon name="sun" />
    <AppIcon name="moon" />
  </button>
</template>
