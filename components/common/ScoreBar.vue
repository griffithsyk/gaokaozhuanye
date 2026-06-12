<template>
  <div class="flex items-center gap-3 text-sm">
    <div class="relative w-full h-6 bg-[#21262d] rounded overflow-hidden">
      <div
        class="absolute top-0 h-full rounded transition-all"
        :class="barColor"
        :style="{ left: `${leftPercent}%`, width: `${widthPercent}%` }"
      />
      <div
        class="absolute top-0 h-full w-0.5 bg-white"
        :style="{ left: `${userScorePercent}%` }"
      />
    </div>
    <div class="flex-shrink-0 text-xs text-[#8b949e] whitespace-nowrap">
      <span class="text-[#e6edf3]">{{ scoreMin }}</span> ~ {{ scoreAvg }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  scoreMin: number
  scoreAvg: number
  userScore?: number
  maxScore?: number
  category?: '冲' | '稳' | '保'
}>()

const max = computed(() => props.maxScore || 660)

const leftPercent = computed(() => Math.max(0, ((props.scoreMin - 400) / (max.value - 400)) * 100))
const widthPercent = computed(() => Math.max(2, ((props.scoreAvg - props.scoreMin) / (max.value - 400)) * 100))
const userScorePercent = computed(() => {
  if (!props.userScore) return 0
  return Math.max(0, ((props.userScore - 400) / (max.value - 400)) * 100)
})

const barColor = computed(() => {
  switch (props.category) {
    case '冲': return 'bg-red-500/40'
    case '稳': return 'bg-yellow-500/40'
    case '保': return 'bg-green-500/40'
    default: return 'bg-blue-500/40'
  }
})
</script>
