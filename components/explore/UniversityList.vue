<template>
  <div>
    <div v-if="universities.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <div
        v-for="uni in universities"
        :key="uni.code"
        class="p-4 rounded-lg border border-[#30363d] bg-[#161b22] hover:border-[#58a6ff]/50 transition-colors cursor-pointer"
        @click="$emit('select', uni.code)"
      >
        <div class="flex items-start justify-between mb-2">
          <div class="font-bold text-[#e6edf3]">{{ uni.name }}</div>
          <div class="flex gap-1">
            <TagBadge v-for="level in uni.level" :key="level" :level="level" />
          </div>
        </div>
        <div class="text-sm text-[#8b949e]">
          {{ uni.city }} · {{ uni.type }}
        </div>
      </div>
    </div>
    <div v-else class="text-center py-12 text-[#8b949e]">
      <div class="text-3xl mb-2">🔍</div>
      没有找到匹配的院校
    </div>
  </div>
</template>

<script setup lang="ts">
import type { University } from '~/types'

defineProps<{
  universities: University[]
}>()

defineEmits<{
  select: [code: string]
}>()
</script>
