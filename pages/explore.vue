<template>
  <div class="p-6 space-y-4">
    <FilterPanel
      :search="filters.search"
      :level="filters.level"
      :city="filters.city"
      :type="filters.type"
      @update:search="filters.search = $event"
      @update:level="filters.level = $event"
      @update:city="filters.city = $event"
      @update:type="filters.type = $event"
    />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2">
        <div v-if="loadingUnis" class="flex justify-center py-12">
          <n-spin />
        </div>
        <UniversityList v-else :universities="universities" @select="openDetail" />
      </div>
      <div>
        <div v-if="loadingMajors" class="flex justify-center py-12">
          <n-spin />
        </div>
        <MajorList v-else :majors="majors" />
      </div>
    </div>

    <UniversityDetail :show="showDetail" :detail="selectedDetail" @close="showDetail = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import type { University, Major } from '~/types'

const filters = reactive({
  search: '',
  level: null as string | null,
  city: null as string | null,
  type: null as string | null,
})

const universities = ref<University[]>([])
const majors = ref<Major[]>([])
const loadingUnis = ref(false)
const loadingMajors = ref(false)
const showDetail = ref(false)
const selectedDetail = ref<any>(null)

const fetchUniversities = async () => {
  loadingUnis.value = true
  try {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.level) params.set('level', filters.level)
    if (filters.city) params.set('city', filters.city)
    if (filters.type) params.set('type', filters.type)

    const res = await $fetch<{ success: boolean; data?: University[] }>(`/api/universities?${params}`)
    if (res.success && res.data) universities.value = res.data
  } finally {
    loadingUnis.value = false
  }
}

const fetchMajors = async () => {
  loadingMajors.value = true
  try {
    const res = await $fetch<{ success: boolean; data?: Major[] }>('/api/majors')
    if (res.success && res.data) majors.value = res.data
  } finally {
    loadingMajors.value = false
  }
}

const openDetail = async (code: string) => {
  try {
    const res = await $fetch<{ success: boolean; data?: any }>(`/api/universities/${code}`)
    if (res.success && res.data) {
      selectedDetail.value = res.data
      showDetail.value = true
    }
  } catch {}
}

watch(filters, fetchUniversities, { deep: true })

onMounted(() => {
  fetchUniversities()
  fetchMajors()
})
</script>
