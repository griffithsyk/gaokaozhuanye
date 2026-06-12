// server/utils/risk-engine.ts
import type {
  WishItem, AdmissionRecord, RiskReport, WishRisk, RiskFactor, RiskLevel
} from '~/types'

/** 位次波动分析 */
function analyzeVolatility(records: AdmissionRecord[]): RiskFactor | null {
  if (records.length < 2) return null
  const ranks = records.map(r => r.rankAvg)
  const mean = ranks.reduce((a, b) => a + b, 0) / ranks.length
  const variance = ranks.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / ranks.length
  const stdDev = Math.sqrt(variance)
  const cv = stdDev / mean

  if (cv > 0.15) return { type: 'volatility', severity: '高', message: '录取位次波动较大，建议谨慎填报' }
  if (cv > 0.10) return { type: 'volatility', severity: '中', message: '录取位次有一定波动' }
  return { type: 'volatility', severity: '低', message: '录取位次相对稳定' }
}

/** 大小年检测 */
function detectBigSmallYear(records: AdmissionRecord[]): RiskFactor | null {
  const sorted = records.sort((a, b) => a.year - b.year)
  for (let i = 1; i < sorted.length; i++) {
    const diff = Math.abs(sorted[i].scoreMin - sorted[i - 1].scoreMin)
    if (diff > 15) {
      return {
        type: 'bigSmallYear',
        severity: '高',
        message: `${sorted[i - 1].year}-${sorted[i].year}年分数波动${diff}分，可能存在大小年`,
      }
    }
  }
  return null
}

/** 招生计划变化 */
function analyzePlanChange(records: AdmissionRecord[]): RiskFactor | null {
  if (records.length < 2) return null
  const sorted = records.sort((a, b) => b.year - a.year)
  const latest = sorted[0]
  const avgPlan = sorted.slice(1).reduce((sum, r) => sum + r.planCount, 0) / (sorted.length - 1)

  if (avgPlan === 0) return null
  const changeRate = (latest.planCount - avgPlan) / avgPlan

  if (changeRate < -0.2) return { type: 'planChange', severity: '中', message: `招生计划减少${Math.abs(changeRate * 100).toFixed(0)}%，竞争可能加剧` }
  if (changeRate > 0.2) return { type: 'planChange', severity: '低', message: `招生计划增加${(changeRate * 100).toFixed(0)}%，录取机会可能增大` }
  return null
}

/** 梯度检查 */
function analyzeGradient(wishes: WishRisk[]): RiskFactor[] {
  const factors: RiskFactor[] = []
  for (let i = 1; i < wishes.length; i++) {
    const prevData = wishes[i - 1].wish
    const currData = wishes[i].wish
    // 简化：用 wish 的 index 差作为梯度指标
    // 实际应该用预估位次比较
  }

  if (wishes.length >= 3) {
    const rushCount = wishes.filter(w => w.wish.category === '冲').length
    const safeCount = wishes.filter(w => w.wish.category === '保').length

    if (rushCount > wishes.length * 0.3) {
      factors.push({ type: 'ratio', severity: '中', message: '冲刺志愿占比过高，建议增加稳妥志愿' })
    }
    if (safeCount < wishes.length * 0.2 && wishes.length >= 10) {
      factors.push({ type: 'ratio', severity: '高', message: '保底志愿不足，存在滑档风险' })
    }
  }

  return factors
}

/** 计算单个志愿风险等级 */
function computeRiskLevel(factors: RiskFactor[]): RiskLevel {
  const severities = factors.map(f => f.severity)
  if (severities.includes('极高') || severities.filter(s => s === '高').length >= 2) return '极高'
  if (severities.includes('高')) return '高'
  if (severities.includes('中')) return '中'
  return '低'
}

/** 主分析函数 */
export function analyzeRisk(
  wishes: WishItem[],
  score: number,
  rank: number
): RiskReport {
  const admissionsMap = getAdmissionsMap()
  const wishRisks: WishRisk[] = wishes.map((wish, index) => {
    const key = `${wish.universityCode}-${wish.groupCode}`
    const records = admissionsMap.get(key) || []
    const factors: RiskFactor[] = []

    const volatility = analyzeVolatility(records)
    if (volatility) factors.push(volatility)

    const bigSmall = detectBigSmallYear([...records])
    if (bigSmall) factors.push(bigSmall)

    const planChange = analyzePlanChange([...records])
    if (planChange) factors.push(planChange)

    return {
      index,
      wish,
      riskLevel: computeRiskLevel(factors),
      factors,
    }
  })

  // 全局梯度检查
  const gradientFactors = analyzeGradient(wishRisks)
  if (gradientFactors.length > 0) {
    // 把全局因素附加到第一个志愿
    if (wishRisks.length > 0) {
      wishRisks[0].factors.push(...gradientFactors)
      wishRisks[0].riskLevel = computeRiskLevel(wishRisks[0].factors)
    }
  }

  // 整体评分
  const riskScores = { '低': 100, '中': 70, '高': 40, '极高': 10 }
  const avgScore = wishRisks.length > 0
    ? wishRisks.reduce((sum, wr) => sum + (riskScores[wr.riskLevel] || 50), 0) / wishRisks.length
    : 0

  // 生成建议
  const suggestions: string[] = []
  const rushCount = wishes.filter(w => w.category === '冲').length
  const stableCount = wishes.filter(w => w.category === '稳').length
  const safeCount = wishes.filter(w => w.category === '保').length

  if (wishes.length < 12) suggestions.push('建议填满至少 12 个志愿以降低滑档风险')
  if (rushCount > 6) suggestions.push('冲刺志愿过多（超过6个），建议调整为4个左右')
  if (safeCount < 2 && wishes.length >= 8) suggestions.push('保底志愿不足，建议至少保留2-3个保底')
  if (avgScore < 50) suggestions.push('整体风险偏高，建议增加稳妥和保底志愿')

  const highRiskWishes = wishRisks.filter(wr => wr.riskLevel === '高' || wr.riskLevel === '极高')
  if (highRiskWishes.length > 0) {
    suggestions.push(`第${highRiskWishes.map(w => w.index + 1).join('、')}号志愿风险较高，请仔细评估`)
  }

  return {
    overallScore: Math.round(avgScore),
    wishRisks,
    suggestions,
  }
}
