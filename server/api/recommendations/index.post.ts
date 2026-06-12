// server/api/recommendations/index.post.ts
import { defineEventHandler, readBody } from 'h3'
import type { ApiResponse, StudentProfile, RecommendationResult } from '~/types'

export default defineEventHandler(async (event): Promise<ApiResponse<RecommendationResult>> => {
  try {
    const body = await readBody<StudentProfile>(event)

    if (!body || !body.score || !body.rank || !body.subjects) {
      return { success: false, error: 'Missing required fields: score, rank, subjects' }
    }

    if (body.score < 0 || body.score > 660) {
      return { success: false, error: 'Score must be between 0 and 660' }
    }

    if (body.subjects.length !== 3) {
      return { success: false, error: 'Must select exactly 3 subjects' }
    }

    const result = generateRecommendations(body)

    return { success: true, data: result }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
})
