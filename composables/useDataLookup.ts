// composables/useDataLookup.ts
import { ref } from 'vue'
import type { University, Major, MajorGroup } from '~/types'

const universityMap = ref<Record<string, string>>({})
const majorMap = ref<Record<string, string>>({})
const groupMap = ref<Record<string, string>>({})
const loaded = ref(false)

async function ensureLoaded() {
  if (loaded.value) return
  loaded.value = true

  try {
    const [uniRes, majorRes] = await Promise.all([
      $fetch<{ success: boolean; data?: University[] }>('/api/universities'),
      $fetch<{ success: boolean; data?: Major[] }>('/api/majors'),
    ])

    if (uniRes.success && uniRes.data) {
      const map: Record<string, string> = {}
      uniRes.data.forEach(u => { map[u.code] = u.name })
      universityMap.value = map
    }

    if (majorRes.success && majorRes.data) {
      const map: Record<string, string> = {}
      majorRes.data.forEach(m => { map[m.code] = m.name })
      majorMap.value = map
    }

    // Load major groups for group name lookup
    const groupsRes = await $fetch<{ success: boolean; data?: any[] }>('/api/major-groups')
    if (groupsRes.success && groupsRes.data) {
      const map: Record<string, string> = {}
      groupsRes.data.forEach((g: any) => {
        map[`${g.universityCode}-${g.groupCode}`] = g.groupName
      })
      groupMap.value = map
    }
  } catch {
    // Silently fail — fallback returns raw codes
  }
}

export function useDataLookup() {
  // Kick off loading on first use
  if (import.meta.client) {
    ensureLoaded()
  }

  const getUniversityName = (code: string): string => {
    return universityMap.value[code] || code
  }

  const getMajorName = (code: string): string => {
    return majorMap.value[code] || code
  }

  const getGroupName = (uniCode: string, groupCode: string): string => {
    return groupMap.value[`${uniCode}-${groupCode}`] || groupCode
  }

  return {
    universityMap,
    majorMap,
    groupMap,
    loaded,
    getUniversityName,
    getMajorName,
    getGroupName,
    ensureLoaded,
  }
}
