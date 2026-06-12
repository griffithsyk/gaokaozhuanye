<template>
  <div class="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
    <n-input v-model:value="searchText" placeholder="搜索专业名称..." clearable size="small" class="mb-3" />
    <div class="space-y-3 max-h-[600px] overflow-y-auto">
      <div v-for="discipline in filteredDisciplines" :key="discipline.name">
        <div class="text-sm font-bold text-[#58a6ff] mb-1">{{ discipline.name }}</div>
        <div v-for="category in discipline.categories" :key="category.name" class="ml-3 mb-2">
          <div class="text-xs text-[#8b949e] mb-1">{{ category.name }}</div>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="major in category.majors"
              :key="major.code"
              class="text-xs px-2 py-0.5 rounded"
              :class="major.isNew ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-[#21262d] text-[#8b949e]'"
            >
              {{ major.name }}
              <span v-if="major.isNew" class="text-[10px]">NEW</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Major } from '~/types'

const props = defineProps<{
  majors: Major[]
}>()

const searchText = ref('')

const filteredDisciplines = computed(() => {
  let filtered = props.majors
  if (searchText.value) {
    const q = searchText.value.toLowerCase()
    filtered = filtered.filter(m => m.name.toLowerCase().includes(q))
  }

  const map = new Map<string, Map<string, Major[]>>()
  for (const major of filtered) {
    if (!map.has(major.discipline)) map.set(major.discipline, new Map())
    const cats = map.get(major.discipline)!
    if (!cats.has(major.category)) cats.set(major.category, [])
    cats.get(major.category)!.push(major)
  }

  return Array.from(map.entries()).map(([name, cats]) => ({
    name,
    categories: Array.from(cats.entries()).map(([catName, majors]) => ({
      name: catName,
      majors,
    })),
  }))
})
</script>
