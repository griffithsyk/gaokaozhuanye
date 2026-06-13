// server/api/major-groups/index.get.ts
import { defineEventHandler } from 'h3'
import type { MajorGroup, ApiResponse } from '~/types'

export default defineEventHandler(async (): Promise<ApiResponse<MajorGroup[]>> => {
  try {
    const groups = getMajorGroups()
    return { success: true, data: groups }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
})
