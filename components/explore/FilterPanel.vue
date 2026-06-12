<template>
  <div class="bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-4">
    <n-input
      :value="search"
      placeholder="搜索院校名称或代码..."
      clearable
      @update:value="$emit('update:search', $event)"
    />
    <div class="grid grid-cols-3 gap-3">
      <n-select
        :value="level"
        placeholder="院校层次"
        clearable
        :options="levelOptions"
        @update:value="$emit('update:level', $event)"
      />
      <n-select
        :value="city"
        placeholder="城市"
        clearable
        :options="cityOptions"
        @update:value="$emit('update:city', $event)"
      />
      <n-select
        :value="type"
        placeholder="院校类型"
        clearable
        :options="typeOptions"
        @update:value="$emit('update:type', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  search: string
  level: string | null
  city: string | null
  type: string | null
}>()

defineEmits<{
  'update:search': [value: string]
  'update:level': [value: string | null]
  'update:city': [value: string | null]
  'update:type': [value: string | null]
}>()

const levelOptions = [
  { label: '985', value: '985' },
  { label: '211', value: '211' },
  { label: '双一流', value: '双一流' },
  { label: '省重点', value: '省重点' },
  { label: '普通', value: '普通' },
]

const cityOptions = [
  { label: '上海', value: '上海' },
  { label: '北京', value: '北京' },
  { label: '南京', value: '南京' },
  { label: '杭州', value: '杭州' },
  { label: '武汉', value: '武汉' },
  { label: '广州', value: '广州' },
  { label: '成都', value: '成都' },
  { label: '西安', value: '西安' },
]

const typeOptions = [
  { label: '综合', value: '综合' },
  { label: '理工', value: '理工' },
  { label: '师范', value: '师范' },
  { label: '医药', value: '医药' },
  { label: '财经', value: '财经' },
  { label: '政法', value: '政法' },
  { label: '农林', value: '农林' },
  { label: '艺术', value: '艺术' },
]
</script>
