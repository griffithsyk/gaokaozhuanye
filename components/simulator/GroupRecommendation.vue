<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-[#e6edf3]">为您推荐</h2>
      <span class="text-sm text-[#8b949e]">
        共 {{ totalCount }} 个匹配专业组
      </span>
    </div>

    <n-tabs type="segment" animated>
      <n-tab-pane name="rush">
        <template #tab>
          <span class="flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-red-400" />
            冲一冲 ({{ recommendations.rush.length }})
          </span>
        </template>
        <div class="space-y-3 mt-4">
          <GroupCard
            v-for="match in recommendations.rush"
            :key="`${match.group.universityCode}-${match.group.groupCode}`"
            :match="{ ...match, category: '冲' }"
            @add="$emit('addWish', $event)"
          />
          <div v-if="recommendations.rush.length === 0" class="text-center text-[#8b949e] py-8">
            没有找到适合冲刺的专业组
          </div>
        </div>
      </n-tab-pane>

      <n-tab-pane name="stable">
        <template #tab>
          <span class="flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-yellow-400" />
            稳一稳 ({{ recommendations.stable.length }})
          </span>
        </template>
        <div class="space-y-3 mt-4">
          <GroupCard
            v-for="match in recommendations.stable"
            :key="`${match.group.universityCode}-${match.group.groupCode}`"
            :match="{ ...match, category: '稳' }"
            @add="$emit('addWish', $event)"
          />
          <div v-if="recommendations.stable.length === 0" class="text-center text-[#8b949e] py-8">
            没有找到稳妥的专业组
          </div>
        </div>
      </n-tab-pane>

      <n-tab-pane name="safe">
        <template #tab>
          <span class="flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-green-400" />
            保一保 ({{ recommendations.safe.length }})
          </span>
        </template>
        <div class="space-y-3 mt-4">
          <GroupCard
            v-for="match in recommendations.safe"
            :key="`${match.group.universityCode}-${match.group.groupCode}`"
            :match="{ ...match, category: '保' }"
            @add="$emit('addWish', $event)"
          />
          <div v-if="recommendations.safe.length === 0" class="text-center text-[#8b949e] py-8">
            没有找到保底的专业组
          </div>
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RecommendationResult } from '~/types'

const props = defineProps<{
  recommendations: RecommendationResult
}>()

defineEmits<{
  addWish: [match: any]
}>()

const totalCount = computed(() =>
  props.recommendations.rush.length +
  props.recommendations.stable.length +
  props.recommendations.safe.length
)
</script>
