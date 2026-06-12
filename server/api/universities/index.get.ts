// server/api/universities/index.get.ts
import { defineEventHandler, getQuery } from 'h3'
import type { University, ApiResponse } from '~/types'

export default defineEventHandler(async (event): Promise<ApiResponse<University[]>> => {
  try {
    const query = getQuery(event)
    const search = (query.search as string || '').trim().toLowerCase()
    const level = query.level as string | undefined
    const city = query.city as string | undefined
    const type = query.type as string | undefined

    let results = getUniversities()

    if (search) {
      results = results.filter(u =>
        u.name.toLowerCase().includes(search) ||
        u.code.includes(search)
      )
    }

    if (level) {
      results = results.filter(u => u.level.includes(level as any))
    }

    if (city) {
      results = results.filter(u => u.city === city || u.province === city)
    }

    if (type) {
      results = results.filter(u => u.type === type)
    }

    return { success: true, data: results }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
})
