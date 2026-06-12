// server/api/risk/analyze.post.ts
import { defineEventHandler, readBody } from 'h3'
import type { ApiResponse, WishItem, RiskReport } from '~/types'

export default defineEventHandler(async (event): Promise<ApiResponse<RiskReport>> => {
  try {
    const body = await readBody<{ wishes: WishItem[]; score: number; rank: number }>(event)

    if (!body.wishes || !Array.isArray(body.wishes) || body.wishes.length === 0) {
      return { success: false, error: '请先添加志愿' }
    }

    if (!body.score || !body.rank) {
      return { success: false, error: '缺少分数或位次信息' }
    }

    const report = analyzeRisk(body.wishes, body.score, body.rank)
    return { success: true, data: report }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
})
