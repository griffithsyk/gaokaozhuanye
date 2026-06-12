// server/api/universities/[code].get.ts
import { defineEventHandler, getRouterParam } from 'h3'
import type { ApiResponse, University, MajorGroup, AdmissionRecord } from '~/types'

interface UniversityDetail extends University {
  groups: Array<{
    group: MajorGroup
    admissions: AdmissionRecord[]
    majorNames: string[]
  }>
}

export default defineEventHandler(async (event): Promise<ApiResponse<UniversityDetail | null>> => {
  try {
    const code = getRouterParam(event, 'code')
    if (!code) {
      return { success: false, error: 'University code is required' }
    }

    const university = getUniversityByCode(code)
    if (!university) {
      return { success: false, error: 'University not found' }
    }

    const groups = getMajorGroupsByUniversity(code)

    const groupsWithDetails = groups.map(group => {
      const admissions = getAdmissionsByGroup(code, group.groupCode)
      const majorNames = group.majors.map(mCode => {
        const major = getMajorByCode(mCode)
        return major ? major.name : mCode
      })

      return { group, admissions, majorNames }
    })

    const detail: UniversityDetail = {
      ...university,
      groups: groupsWithDetails,
    }

    return { success: true, data: detail }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
})
