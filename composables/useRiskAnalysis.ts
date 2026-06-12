// composables/useRiskAnalysis.ts
import { ref } from 'vue'
import type { RiskReport } from '~/types'

export function useRiskAnalysis() {
  const report = ref<RiskReport | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const analyze = async (wishes: any[], score: number, rank: number) => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch<{ success: boolean; data?: RiskReport; error?: string }>(
        '/api/risk/analyze',
        {
          method: 'POST',
          body: { wishes, score, rank },
        }
      )
      if (res.success && res.data) {
        report.value = res.data
      } else {
        error.value = res.error || '分析失败'
      }
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '请求失败'
    } finally {
      loading.value = false
    }
  }

  return { report, loading, error, analyze }
}
