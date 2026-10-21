<script setup lang="ts">
/** A card names the leading skills, like LinkedIn; the remaining count is text, not another skill chip. */
const { skills, limit = 3 } = defineProps<{ skills: readonly string[], label: string, limit?: number }>()
const { copy } = useLocale()

const visibleSkills = computed(() => skills.slice(0, limit))
const hiddenSkillCount = computed(() => skills.length - visibleSkills.value.length)
</script>

<template>
  <ul class="tags" :aria-label="label">
    <li v-for="skill in visibleSkills" :key="skill">
      {{ skill }}
    </li>
    <li v-if="hiddenSkillCount" class="tags-more">
      {{ copy.moreSkills.replace('{count}', String(hiddenSkillCount)) }}
    </li>
  </ul>
</template>
