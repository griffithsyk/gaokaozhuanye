<template>
  <div class="min-h-screen bg-[#0d1117]">
    <!-- 步骤指示器 -->
    <div class="border-b border-[#30363d] bg-[#161b22] px-6 py-4">
      <n-steps :current="currentStep" :status="stepStatus" size="small">
        <n-step title="输入信息" />
        <n-step title="选择专业组" />
        <n-step title="编辑志愿表" />
      </n-steps>
    </div>

    <!-- Step 1: 输入信息 -->
    <div v-if="currentStep === 1">
      <ScoreInput @submit="handleScoreSubmit" />
    </div>

    <!-- Step 2: 推荐结果 -->
    <div v-if="currentStep === 2">
      <div class="flex items-center gap-3 p-4 border-b border-[#30363d]">
        <n-button quaternary size="small" @click="currentStep = 1">
          ← 返回修改
        </n-button>
        <n-button
          type="primary"
          size="small"
          :disabled="wishStore.wishes.value.length === 0"
          @click="currentStep = 3"
        >
          查看志愿表 ({{ wishStore.wishes.value.length }})
        </n-button>
      </div>
      <div v-if="loading" class="flex justify-center py-20">
        <n-spin size="large" description="正在为您匹配专业组..." />
      </div>
      <GroupRecommendation
        v-else
        :recommendations="recommendations"
        @add-wish="handleAddWish"
      />
    </div>

    <!-- Step 3: 志愿表 -->
    <div v-if="currentStep === 3">
      <div class="flex items-center gap-3 p-4 border-b border-[#30363d]">
        <n-button quaternary size="small" @click="currentStep = 2">
          ← 继续添加
        </n-button>
        <n-button quaternary size="small" type="error" @click="handleClear">
          清空方案
        </n-button>
      </div>
      <WishTable
        :wishes="wishStore.wishes.value"
        @remove="wishStore.removeWish"
        @move-up="(i) => i > 0 && wishStore.reorderWishes(i, i - 1)"
        @move-down="(i) => wishStore.reorderWishes(i, i + 1)"
        @update-majors="wishStore.updateGroupMajors"
        @analyze-risk="navigateTo('/risk')"
        @export="navigateTo('/report')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Subject, UniversityLevel, RecommendationResult } from '~/types'

const wishStore = useWishStore()
const currentStep = ref(1)
const loading = ref(false)
const recommendations = ref<RecommendationResult>({
  rush: [],
  stable: [],
  safe: [],
})

const stepStatus = computed(() => {
  if (currentStep.value === 3 && wishStore.wishes.value.length > 0) return 'finish'
  return 'process'
})

onMounted(() => {
  wishStore.load()
  // 如果已有数据，直接跳到 step 3
  if (wishStore.wishes.value.length > 0 && wishStore.score.value) {
    currentStep.value = 3
  }
})

const handleScoreSubmit = async (profile: {
  score: number
  rank: number
  subjects: Subject[]
  cities: string[]
  levels: UniversityLevel[]
}) => {
  wishStore.setScoreInfo(profile.score, profile.rank, profile.subjects)

  loading.value = true
  currentStep.value = 2

  try {
    const response = await $fetch<{ success: boolean; data?: RecommendationResult; error?: string }>(
      '/api/recommendations',
      {
        method: 'POST',
        body: {
          score: profile.score,
          rank: profile.rank,
          subjects: profile.subjects,
          preferences: {
            cities: profile.cities.length > 0 ? profile.cities : undefined,
            levels: profile.levels.length > 0 ? profile.levels : undefined,
          },
        },
      }
    )

    if (response.success && response.data) {
      recommendations.value = response.data
    }
  } catch (error) {
    console.error('Failed to get recommendations:', error)
  } finally {
    loading.value = false
  }
}

const handleAddWish = (match: any) => {
  if (wishStore.wishes.value.length >= 24) {
    window.alert('志愿表已满（最多 24 个）')
    return
  }

  wishStore.addWish({
    universityCode: match.group.universityCode,
    groupCode: match.group.groupCode,
    selectedMajors: match.group.majors.slice(0, 6),
    category: match.category || '稳',
  })
}

const handleClear = () => {
  if (window.confirm('确定清空志愿方案？')) {
    wishStore.clear()
    currentStep.value = 1
  }
}
</script>
