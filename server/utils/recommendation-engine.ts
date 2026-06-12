// server/utils/recommendation-engine.ts
import type {
  Subject, SubjectRequirement, StudentProfile, WishCategory,
  University, MajorGroup, AdmissionRecord, MajorGroupMatch,
  RecommendationResult
} from '~/types'

const YEAR_WEIGHTS: Record<number, number> = {
  2025: 0.5,
  2024: 0.3,
  2023: 0.2,
}

/** 检查用户选科是否满足专业组要求 */
export function matchesSubjects(
  requirement: SubjectRequirement,
  userSubjects: Subject[]
): boolean {
  if (!requirement.required || requirement.required.length === 0) return true
  return requirement.required.every(s => userSubjects.includes(s))
}

/** 计算加权预测位次 */
export function calculateEstimatedRank(records: AdmissionRecord[]): number {
  const weighted = records
    .filter(r => YEAR_WEIGHTS[r.year] !== undefined)
    .map(r => ({ weight: YEAR_WEIGHTS[r.year], rankAvg: r.rankAvg }))

  if (weighted.length === 0) return 0

  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0)
  if (totalWeight === 0) return 0

  return Math.round(
    weighted.reduce((sum, w) => sum + w.rankAvg * w.weight, 0) / totalWeight
  )
}

/** 按位次分冲/稳/保 */
export function categorizeByRank(userRank: number, estimatedRank: number): WishCategory {
  if (estimatedRank === 0) return '稳'
  const ratio = userRank / estimatedRank
  if (ratio < 0.85) return '冲'
  if (ratio <= 1.15) return '稳'
  return '保'
}

/** 计算匹配度分数 (0-100) */
export function calculateMatchScore(userRank: number, estimatedRank: number): number {
  if (estimatedRank === 0) return 50
  const diff = Math.abs(userRank - estimatedRank)
  const maxDiff = estimatedRank * 0.5
  return Math.max(0, Math.round(100 - (diff / maxDiff) * 100))
}

/** 主推荐函数 */
export function generateRecommendations(profile: StudentProfile): RecommendationResult {
  const universities = getUniversities()
  const majorGroups = getMajorGroups()
  const admissionsMap = getAdmissionsMap()

  // 1. 选科过滤
  let matchedGroups = majorGroups.filter(g =>
    matchesSubjects(g.subjectRequirement, profile.subjects)
  )

  // 2. 偏好过滤
  if (profile.preferences) {
    const prefs = profile.preferences

    if (prefs.levels && prefs.levels.length > 0) {
      const filteredUniCodes = new Set(
        universities
          .filter(u => u.level.some(l => prefs.levels!.includes(l)))
          .map(u => u.code)
      )
      matchedGroups = matchedGroups.filter(g => filteredUniCodes.has(g.universityCode))
    }

    if (prefs.cities && prefs.cities.length > 0) {
      const filteredUniCodes = new Set(
        universities
          .filter(u => prefs.cities!.includes(u.city) || prefs.cities!.includes(u.province))
          .map(u => u.code)
      )
      matchedGroups = matchedGroups.filter(g => filteredUniCodes.has(g.universityCode))
    }

    if (prefs.types && prefs.types.length > 0) {
      const filteredUniCodes = new Set(
        universities
          .filter(u => prefs.types!.includes(u.type))
          .map(u => u.code)
      )
      matchedGroups = matchedGroups.filter(g => filteredUniCodes.has(g.universityCode))
    }
  }

  // 3. 为每个专业组计算匹配信息
  const matches: MajorGroupMatch[] = matchedGroups
    .map(group => {
      const university = universities.find(u => u.code === group.universityCode)
      if (!university) return null

      const key = `${group.universityCode}-${group.groupCode}`
      const historicalData = admissionsMap.get(key) || []
      const estimatedRank = calculateEstimatedRank(historicalData)

      if (estimatedRank === 0) return null

      const matchScore = calculateMatchScore(profile.rank, estimatedRank)

      return {
        group,
        university,
        matchScore,
        estimatedRank,
        historicalData: historicalData.sort((a, b) => b.year - a.year),
      } satisfies MajorGroupMatch
    })
    .filter((m): m is MajorGroupMatch => m !== null)

  // 4. 分组
  const rush: MajorGroupMatch[] = []
  const stable: MajorGroupMatch[] = []
  const safe: MajorGroupMatch[] = []

  for (const match of matches) {
    const category = categorizeByRank(profile.rank, match.estimatedRank)
    switch (category) {
      case '冲': rush.push({ ...match, group: { ...match.group } }); break
      case '稳': stable.push({ ...match, group: { ...match.group } }); break
      case '保': safe.push({ ...match, group: { ...match.group } }); break
    }
  }

  // 5. 每组内按匹配度降序排序
  const sortByScore = (a: MajorGroupMatch, b: MajorGroupMatch) => b.matchScore - a.matchScore
  rush.sort(sortByScore)
  stable.sort(sortByScore)
  safe.sort(sortByScore)

  // 6. 截断
  return {
    rush: rush.slice(0, 4),
    stable: stable.slice(0, 12),
    safe: safe.slice(0, 8),
  }
}
