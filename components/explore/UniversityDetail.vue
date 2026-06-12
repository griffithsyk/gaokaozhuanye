<template>
  <n-drawer :show="show" :width="500" placement="right" @update:show="$emit('close')">
    <n-drawer-content v-if="detail" :title="detail.name" class="bg-[#0d1117]">
      <n-space vertical :size="16">
        <div class="flex gap-2">
          <TagBadge v-for="level in detail.level" :key="level" :level="level" />
        </div>
        <div class="text-sm text-[#8b949e]">
          {{ detail.city }} · {{ detail.province }} · {{ detail.type }}
        </div>

        <n-divider class="!border-[#30363d]" />

        <div class="font-bold text-[#e6edf3]">招生专业组</div>
        <div v-for="g in detail.groups" :key="g.group.groupCode" class="border border-[#30363d] rounded-lg p-3 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-sm font-bold text-[#e6edf3]">{{ g.group.groupName }}</span>
            <SubjectTags :selected="g.group.subjectRequirement.required" />
          </div>
          <div class="flex flex-wrap gap-1">
            <span v-for="name in g.majorNames" :key="name" class="text-xs bg-[#21262d] text-[#8b949e] px-2 py-0.5 rounded">
              {{ name }}
            </span>
          </div>
          <div v-if="g.admissions.length > 0" class="text-xs text-[#8b949e]">
            最近录取：{{ g.admissions[0].scoreMin }}分 / 位次{{ g.admissions[0].rankMin }}
          </div>
        </div>
      </n-space>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import type { University, AdmissionRecord } from '~/types'

interface GroupDetail {
  group: {
    groupCode: string
    groupName: string
    subjectRequirement: {
      required: string[]
      elective?: number
    }
    majors: string[]
  }
  admissions: AdmissionRecord[]
  majorNames: string[]
}

interface UniversityDetailData extends University {
  groups: GroupDetail[]
}

defineProps<{
  show: boolean
  detail: UniversityDetailData | null
}>()

defineEmits<{
  close: []
}>()
</script>
