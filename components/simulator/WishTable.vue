<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-[#e6edf3]">
        志愿表
        <span class="text-sm font-normal text-[#8b949e] ml-2">（已填 {{ wishes.length }}/24）</span>
      </h2>
      <n-space>
        <n-button type="warning" ghost size="small" :disabled="wishes.length === 0" @click="$emit('analyzeRisk')">
          ⚡ 风险评估
        </n-button>
        <n-button type="info" ghost size="small" :disabled="wishes.length === 0" @click="$emit('export')">
          📄 导出
        </n-button>
      </n-space>
    </div>

    <!-- 志愿列表 -->
    <div v-if="wishes.length > 0" class="space-y-2">
      <div
        v-for="(wish, index) in wishes"
        :key="wish.id"
        class="flex items-center gap-3 p-3 rounded-lg border bg-[#161b22] transition-colors"
        :class="categoryBorder(wish.category)"
      >
        <!-- 序号 -->
        <div class="w-8 h-8 rounded-full bg-[#0d1117] flex items-center justify-center text-sm font-bold text-[#8b949e] flex-shrink-0">
          {{ index + 1 }}
        </div>

        <!-- 信息 -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-[#e6edf3] truncate">
              {{ getUniversityName(wish.universityCode) }}
            </span>
            <span :class="categoryTag(wish.category)" class="px-1.5 py-0.5 rounded text-xs flex-shrink-0">
              {{ wish.category }}
            </span>
          </div>
          <div class="text-xs text-[#8b949e] truncate">
            {{ getGroupName(wish.universityCode, wish.groupCode) }}
            · 已选 {{ wish.selectedMajors.length }} 个专业
          </div>
        </div>

        <!-- 操作 -->
        <n-space size="small">
          <n-button text size="small" :disabled="index === 0" @click="$emit('moveUp', index)">
            ↑
          </n-button>
          <n-button text size="small" :disabled="index === wishes.length - 1" @click="$emit('moveDown', index)">
            ↓
          </n-button>
          <n-button text size="small" type="primary" @click="openMajorSelector(index)">
            编辑
          </n-button>
          <n-button text size="small" type="error" @click="$emit('remove', index)">
            ✕
          </n-button>
        </n-space>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-16 text-[#8b949e]">
      <div class="text-4xl mb-4">📋</div>
      <div>志愿表为空</div>
      <div class="text-sm mt-1">从推荐列表中添加专业组</div>
    </div>

    <!-- 专业选择弹窗 -->
    <MajorSelector
      :show="selectorShow"
      :group-name="selectorGroupName"
      :majors="selectorMajors"
      :initial-selected="selectorSelected"
      @close="selectorShow = false"
      @confirm="handleMajorConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { WishItem } from '~/types'
import MajorSelector from './MajorSelector.vue'

const props = defineProps<{
  wishes: WishItem[]
}>()

const emit = defineEmits<{
  remove: [index: number]
  moveUp: [index: number]
  moveDown: [index: number]
  updateMajors: [index: number, majors: string[]]
  analyzeRisk: []
  export: []
}>()

// 专业选择器状态
const selectorShow = ref(false)
const selectorIndex = ref(-1)
const selectorGroupName = ref('')
const selectorMajors = ref<Array<{ code: string; name: string }>>([])
const selectorSelected = ref<string[]>([])

const openMajorSelector = (index: number) => {
  selectorIndex.value = index
  // 这里需要根据 wish 查找专业组信息
  // 简化实现：从 wish 中提取信息
  const wish = props.wishes[index]
  selectorGroupName.value = wish.groupCode
  selectorSelected.value = [...wish.selectedMajors]
  selectorShow.value = true
}

const handleMajorConfirm = (majors: string[]) => {
  if (selectorIndex.value >= 0) {
    emit('updateMajors', selectorIndex.value, majors)
  }
  selectorShow.value = false
}

// 辅助函数（实际从数据中获取）
const getUniversityName = (code: string) => code
const getGroupName = (uniCode: string, groupCode: string) => groupCode

const categoryBorder = (category: string) => {
  switch (category) {
    case '冲': return 'border-red-500/20'
    case '稳': return 'border-yellow-500/20'
    case '保': return 'border-green-500/20'
    default: return 'border-[#30363d]'
  }
}

const categoryTag = (category: string) => {
  switch (category) {
    case '冲': return 'bg-red-500/20 text-red-400'
    case '稳': return 'bg-yellow-500/20 text-yellow-400'
    case '保': return 'bg-green-500/20 text-green-400'
    default: return 'bg-[#21262d] text-[#8b949e]'
  }
}
</script>
