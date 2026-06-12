<template>
  <div class="max-w-2xl mx-auto p-6">
    <n-card class="bg-[#161b22] border-[#30363d]" :bordered="true">
      <template #header>
        <div class="flex items-center gap-2">
          <span class="text-2xl">📝</span>
          <span class="text-lg font-bold text-[#e6edf3]">输入您的高考信息</span>
        </div>
      </template>

      <n-space vertical :size="24">
        <!-- 分数和位次 -->
        <div class="grid grid-cols-2 gap-4">
          <n-form-item label="高考总分（满分 660）">
            <n-input-number
              v-model:value="formScore"
              :min="0"
              :max="660"
              placeholder="请输入总分"
              clearable
              class="w-full"
            />
          </n-form-item>
          <n-form-item label="全市位次">
            <n-input-number
              v-model:value="formRank"
              :min="1"
              :max="55000"
              placeholder="请输入位次"
              clearable
              class="w-full"
            />
          </n-form-item>
        </div>

        <!-- 选科 -->
        <n-form-item label="选科（选择 3 门）">
          <n-checkbox-group v-model:value="formSubjects">
            <n-space>
              <n-checkbox
                v-for="subject in allSubjects"
                :key="subject"
                :value="subject"
                :label="subject"
                :disabled="formSubjects.length >= 3 && !formSubjects.includes(subject)"
              />
            </n-space>
          </n-checkbox-group>
        </n-form-item>

        <!-- 偏好过滤（可选） -->
        <n-divider class="!border-[#30363d]">偏好设置（可选）</n-divider>

        <n-form-item label="城市偏好">
          <n-select
            v-model:value="formCities"
            multiple
            :options="cityOptions"
            placeholder="不限"
            clearable
          />
        </n-form-item>

        <n-form-item label="院校层次">
          <n-select
            v-model:value="formLevels"
            multiple
            :options="levelOptions"
            placeholder="不限"
            clearable
          />
        </n-form-item>

        <!-- 提交 -->
        <n-button
          type="primary"
          size="large"
          block
          :disabled="!canSubmit"
          :loading="loading"
          @click="handleSubmit"
        >
          {{ canSubmit ? '开始智能推荐' : '请填写完整信息' }}
        </n-button>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Subject, UniversityLevel } from '~/types'

const emit = defineEmits<{
  submit: [profile: { score: number; rank: number; subjects: Subject[]; cities: string[]; levels: UniversityLevel[] }]
}>()

const loading = ref(false)
const formScore = ref<number | null>(null)
const formRank = ref<number | null>(null)
const formSubjects = ref<string[]>([])
const formCities = ref<string[]>([])
const formLevels = ref<string[]>([])

const allSubjects: Subject[] = ['物理', '化学', '生物', '政治', '历史', '地理']

const cityOptions = [
  { label: '上海', value: '上海' },
  { label: '北京', value: '北京' },
  { label: '南京', value: '南京' },
  { label: '杭州', value: '杭州' },
  { label: '苏州', value: '苏州' },
  { label: '武汉', value: '武汉' },
  { label: '广州', value: '广州' },
  { label: '深圳', value: '深圳' },
  { label: '成都', value: '成都' },
  { label: '西安', value: '西安' },
]

const levelOptions = [
  { label: '985', value: '985' },
  { label: '211', value: '211' },
  { label: '双一流', value: '双一流' },
  { label: '省重点', value: '省重点' },
  { label: '普通', value: '普通' },
]

const canSubmit = computed(() => {
  return (
    formScore.value !== null &&
    formScore.value > 0 &&
    formRank.value !== null &&
    formRank.value > 0 &&
    formSubjects.value.length === 3
  )
})

const handleSubmit = async () => {
  if (!canSubmit.value) return

  loading.value = true
  try {
    emit('submit', {
      score: formScore.value!,
      rank: formRank.value!,
      subjects: formSubjects.value as Subject[],
      cities: formCities.value,
      levels: formLevels.value as UniversityLevel[],
    })
  } finally {
    loading.value = false
  }
}
</script>
