<template>
  <div class="flex flex-wrap gap-1.5">
    <span
      v-for="subject in allSubjects"
      :key="subject"
      :class="[
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium transition-colors',
        isSelected(subject)
          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          : 'bg-[#21262d] text-[#8b949e] border border-[#30363d]'
      ]"
    >
      {{ subject }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Subject } from '~/types'

const props = defineProps<{
  selected: Subject[]
  highlight?: Subject[]
}>()

const allSubjects: Subject[] = ['物理', '化学', '生物', '政治', '历史', '地理']

const isSelected = (subject: Subject): boolean => {
  return props.selected.includes(subject) || (props.highlight?.includes(subject) ?? false)
}
</script>
