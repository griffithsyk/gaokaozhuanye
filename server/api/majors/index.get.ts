// server/api/majors/index.get.ts
import { defineEventHandler, getQuery } from 'h3'
import type { Major, ApiResponse } from '~/types'

export default defineEventHandler(async (event): Promise<ApiResponse<Major[]>> => {
  try {
    const query = getQuery(event)
    const search = (query.search as string || '').trim().toLowerCase()
    const category = query.category as string | undefined
    const discipline = query.discipline as string | undefined

    let results = getMajors()

    if (search) {
      results = results.filter(m =>
        m.name.toLowerCase().includes(search) ||
        m.code.includes(search)
      )
    }

    if (category) {
      results = results.filter(m => m.category === category)
    }

    if (discipline) {
      results = results.filter(m => m.discipline === discipline)
    }

    return { success: true, data: results }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
})
