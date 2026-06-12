<template>
  <div v-if="report" class="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-bold text-[#e6edf3]">整体风险评估</h3>
      <div class="flex items-center gap-3">
        <div class="text-4xl font-bold" :class="scoreColor">{{ report.overallScore }}</div>
        <div class="text-sm text-[#8b949e]">/ 100</div>
      </div>
    </div>

    <div class="space-y-2">
      <div
        v-for="wr in report.wishRisks"
        :key="wr.index"
        class="flex items-center justify-between p-3 rounded border border-[#30363d] bg-[#0d1117]"
      >
        <div class="flex items-center gap-3">
          <span class="w-6 h-6 rounded-full bg-[#21262d] flex items-center justify-center text-xs font-bold text-[#8b949e]">
            {{ wr.index + 1 }}
          </span>
          <span class="text-sm text-[#e6edf3]">{{ wr.wish.universityCode }} · {{ wr.wish.groupCode }}</span>
        </div>
        <span :class="riskTagClass(wr.riskLevel)" class="px-2 py-0.5 rounded text-xs font-bold">
          {{ wr.riskLevel }}风险
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RiskReport } from '~/types'

const props = defineProps<{ report: RiskReport }>()

const scoreColor = computed(() => {
  if (props.report.overallScore >= 80) return 'text-green-400'
  if (props.report.overallScore >= 60) return 'text-yellow-400'
  return 'text-red-400'
})

const riskTagClass = (level: string) => {
  switch (level) {
    case '低': return 'bg-green-500/20 text-green-400'
    case '中': return 'bg-yellow-500/20 text-yellow-400'
    case '高': return 'bg-orange-500/20 text-orange-400'
    case '极高': return 'bg-red-500/20 text-red-400'
    default: return 'bg-[#21262d] text-[#8b949e]'
  }
}
</script>
