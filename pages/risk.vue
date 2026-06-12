<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-[#e6edf3]">⚡ 风险评估</h1>
      <n-button type="primary" :loading="analysis.loading.value" :disabled="wishStore.wishes.value.length === 0" @click="runAnalysis">
        开始评估
      </n-button>
    </div>

    <div v-if="!analysis.report.value && !analysis.loading.value" class="text-center py-20 text-[#8b949e]">
      <div class="text-4xl mb-4">📊</div>
      <div>请先在模拟填报中添加志愿</div>
      <n-button class="mt-4" @click="navigateTo('/simulator')">前往模拟填报</n-button>
    </div>

    <div v-if="analysis.loading.value" class="flex justify-center py-20">
      <n-spin size="large" description="正在分析风险..." />
    </div>

    <template v-if="analysis.report.value">
      <RiskDashboard :report="analysis.report.value" />
      <SuggestionPanel :report="analysis.report.value" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const wishStore = useWishStore()
const analysis = useRiskAnalysis()

const runAnalysis = async () => {
  if (!wishStore.score.value || !wishStore.rank.value) return
  await analysis.analyze(wishStore.wishes.value, wishStore.score.value, wishStore.rank.value)
}

onMounted(() => {
  wishStore.load()
  if (wishStore.wishes.value.length > 0 && wishStore.score.value) {
    runAnalysis()
  }
})
</script>
