<template>
  <span :class="['inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', colorClass]">
    {{ level }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UniversityLevel } from '~/types'

const props = defineProps<{
  level: UniversityLevel
}>()

const colorMap: Record<UniversityLevel, string> = {
  '985': 'bg-red-500/20 text-red-400 border border-red-500/30',
  '211': 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  '双一流': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  '省重点': 'bg-green-500/20 text-green-400 border border-green-500/30',
  '普通': 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
}

const colorClass = computed(() => colorMap[props.level] || colorMap['普通'])
</script>
