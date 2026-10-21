<script setup lang="ts">
/** The element whose text the reader is going through; the bar is full when its end reaches the bottom of the screen. */
const { contentSelector } = defineProps<{ contentSelector: string }>()

const progress = ref(0)
let pendingFrame = 0

/** Converts the content's position into a 0–1 share of what has been read. */
function measureProgress() {
  pendingFrame = 0
  const content = document.querySelector(contentSelector)
  if (!content) return

  const box = content.getBoundingClientRect()
  const scrollableDistance = box.height - innerHeight
  progress.value = scrollableDistance <= 0 ? 1 : Math.min(Math.max(-box.top / scrollableDistance, 0), 1)
}

/** Scroll fires faster than the screen repaints; one measurement per frame is enough. */
function scheduleMeasurement() {
  if (!pendingFrame) pendingFrame = requestAnimationFrame(measureProgress)
}

onMounted(() => {
  measureProgress()
  addEventListener('scroll', scheduleMeasurement, { passive: true })
  addEventListener('resize', scheduleMeasurement, { passive: true })
})

onBeforeUnmount(() => {
  removeEventListener('scroll', scheduleMeasurement)
  removeEventListener('resize', scheduleMeasurement)
  cancelAnimationFrame(pendingFrame)
})
</script>

<template>
  <!-- A visual cue only: screen readers already announce position within the page. -->
  <div class="reading-progress" aria-hidden="true">
    <span :style="{ transform: `scaleX(${progress})` }" />
  </div>
</template>
