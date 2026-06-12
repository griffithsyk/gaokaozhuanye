<template>
  <n-modal :show="show" preset="card" title="选择专业" class="max-w-lg" :mask-closable="true" @update:show="$emit('close')">
    <div class="mb-3 text-sm text-[#8b949e]">
      请从 <span class="text-[#e6edf3]">{{ groupName }}</span> 中选择最多 6 个专业（已选 {{ selected.length }}/6）
    </div>
    <n-checkbox-group :value="selected" @update:value="handleUpdate">
      <n-space vertical>
        <n-checkbox
          v-for="major in majors"
          :key="major.code"
          :value="major.code"
          :label="major.name"
          :disabled="selected.length >= 6 && !selected.includes(major.code)"
        />
      </n-space>
    </n-checkbox-group>
    <template #footer>
      <div class="flex justify-end gap-2">
        <n-button @click="$emit('close')">取消</n-button>
        <n-button type="primary" @click="$emit('confirm', selected)">确认</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  show: boolean
  groupName: string
  majors: Array<{ code: string; name: string }>
  initialSelected: string[]
}>()

const emit = defineEmits<{
  close: []
  confirm: [majors: string[]]
}>()

const selected = ref<string[]>([...props.initialSelected])

watch(() => props.initialSelected, (val) => {
  selected.value = [...val]
})

const handleUpdate = (val: string[] | null) => {
  if (val && val.length <= 6) {
    selected.value = val
  }
}
</script>
