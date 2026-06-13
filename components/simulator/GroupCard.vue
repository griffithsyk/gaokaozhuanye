<template>
  <div
    class="group-card p-4 rounded-lg border transition-all hover:border-[#58a6ff]/50 cursor-pointer"
    :class="categoryBorder"
  >
    <div class="flex items-start justify-between mb-3">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="text-base font-bold text-[#e6edf3]">{{ match.university.name }}</span>
          <TagBadge v-for="level in match.university.level" :key="level" :level="level" />
        </div>
        <div class="text-sm text-[#8b949e]">
          {{ match.group.groupName }} · {{ match.university.city }}
        </div>
      </div>
      <span :class="categoryTag" class="px-2 py-0.5 rounded text-xs font-bold">
        {{ match.category === '冲' ? '⚡ 冲' : match.category === '稳' ? '✓ 稳' : '🛡 保' }}
      </span>
    </div>

    <!-- 录取数据 -->
    <div class="grid grid-cols-3 gap-3 mb-3 text-sm">
      <div class="bg-[#0d1117] rounded p-2 text-center">
        <div class="text-[#8b949e] text-xs">预测位次</div>
        <div class="text-[#e6edf3] font-bold">{{ match.estimatedRank.toLocaleString() }}</div>
      </div>
      <div class="bg-[#0d1117] rounded p-2 text-center">
        <div class="text-[#8b949e] text-xs">最低分</div>
        <div class="text-[#e6edf3] font-bold">{{ latestRecord?.scoreMin || '-' }}</div>
      </div>
      <div class="bg-[#0d1117] rounded p-2 text-center">
        <div class="text-[#8b949e] text-xs">匹配度</div>
        <div class="font-bold" :class="match.matchScore >= 70 ? 'text-green-400' : match.matchScore >= 40 ? 'text-yellow-400' : 'text-red-400'">
          {{ match.matchScore }}%
        </div>
      </div>
    </div>

    <!-- 选科要求 -->
    <div class="mb-3">
      <SubjectTags :selected="match.group.subjectRequirement.required" />
    </div>

    <!-- 专业列表 -->
    <div class="flex flex-wrap gap-1 mb-3">
      <span
        v-for="majorCode in match.group.majors.slice(0, 6)"
        :key="majorCode"
        class="text-xs bg-[#21262d] text-[#8b949e] px-2 py-0.5 rounded"
      >
        {{ getMajorName(majorCode) }}
      </span>
      <span v-if="match.group.majors.length > 6" class="text-xs text-[#8b949e]">
        +{{ match.group.majors.length - 6 }}个
      </span>
    </div>

    <!-- 操作 -->
    <div class="flex justify-end">
      <n-button size="small" type="primary" ghost @click.stop="$emit('add', match)">
        + 添加到志愿表
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MajorGroupMatch } from '~/types'

const props = defineProps<{
  match: MajorGroupMatch & { category: '冲' | '稳' | '保' }
}>()

defineEmits<{
  add: [match: typeof props.match]
}>()

const { getMajorName } = useDataLookup()

const latestRecord = computed(() => {
  return props.match.historicalData[0] || null
})

const categoryBorder = computed(() => {
  switch (props.match.category) {
    case '冲': return 'border-red-500/30 bg-[#161b22]'
    case '稳': return 'border-yellow-500/30 bg-[#161b22]'
    case '保': return 'border-green-500/30 bg-[#161b22]'
    default: return 'border-[#30363d] bg-[#161b22]'
  }
})

const categoryTag = computed(() => {
  switch (props.match.category) {
    case '冲': return 'bg-red-500/20 text-red-400'
    case '稳': return 'bg-yellow-500/20 text-yellow-400'
    case '保': return 'bg-green-500/20 text-green-400'
    default: return 'bg-[#21262d] text-[#8b949e]'
  }
})
</script>
