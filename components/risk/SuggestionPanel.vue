<template>
  <div v-if="report && report.suggestions.length > 0" class="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
    <h3 class="text-lg font-bold text-[#e6edf3] mb-4">优化建议</h3>
    <div class="space-y-3">
      <div
        v-for="(suggestion, i) in report.suggestions"
        :key="i"
        class="flex items-start gap-3 p-3 rounded bg-[#0d1117] border border-[#30363d]"
      >
        <span class="text-yellow-400 text-lg">💡</span>
        <span class="text-sm text-[#e6edf3]">{{ suggestion }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RiskReport } from '~/types'
defineProps<{ report: RiskReport }>()
</script>
