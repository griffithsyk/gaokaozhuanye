// types/index.ts

/** 选科科目 */
export type Subject = '物理' | '化学' | '生物' | '政治' | '历史' | '地理'

/** 院校层次 */
export type UniversityLevel = '985' | '211' | '双一流' | '省重点' | '普通'

/** 院校类型 */
export type UniversityType = '综合' | '理工' | '师范' | '医药' | '财经' | '农林' | '政法' | '艺术' | '体育' | '军事' | '民族'

/** 院校 */
export interface University {
  code: string
  name: string
  province: string
  city: string
  level: UniversityLevel[]
  type: UniversityType
  logo?: string
  website?: string
  description?: string
}

/** 专业（教育部目录） */
export interface Major {
  code: string
  name: string
  category: string
  discipline: string
  degree: string
  duration: 4 | 5
  isNew?: boolean
}

/** 选科要求 */
export interface SubjectRequirement {
  required: Subject[]
  elective?: number
}

/** 院校专业组 */
export interface MajorGroup {
  universityCode: string
  groupCode: string
  groupName: string
  subjectRequirement: SubjectRequirement
  majors: string[]
}

/** 录取批次 */
export type AdmissionBatch = '本科' | '提前批' | '专项'

/** 录取数据 */
export interface AdmissionRecord {
  universityCode: string
  groupCode: string
  year: number
  batch: AdmissionBatch
  scoreMin: number
  scoreAvg: number
  rankMin: number
  rankAvg: number
  planCount: number
  actualCount: number
}

/** 用户偏好 */
export interface Preferences {
  cities?: string[]
  levels?: UniversityLevel[]
  types?: UniversityType[]
}

/** 用户输入 */
export interface StudentProfile {
  score: number
  rank: number
  subjects: Subject[]
  preferences?: Preferences
}

/** 志愿类别 */
export type WishCategory = '冲' | '稳' | '保'

/** 志愿条目 */
export interface WishItem {
  id: string
  universityCode: string
  groupCode: string
  selectedMajors: string[]
  category: WishCategory
}

/** 专业组匹配结果 */
export interface MajorGroupMatch {
  group: MajorGroup
  university: University
  matchScore: number
  estimatedRank: number
  historicalData: AdmissionRecord[]
}

/** 推荐结果 */
export interface RecommendationResult {
  rush: MajorGroupMatch[]
  stable: MajorGroupMatch[]
  safe: MajorGroupMatch[]
}

/** 风险等级 */
export type RiskLevel = '低' | '中' | '高' | '极高'

/** 风险因素 */
export interface RiskFactor {
  type: 'volatility' | 'bigSmallYear' | 'planChange' | 'gradient' | 'ratio'
  severity: RiskLevel
  message: string
}

/** 志愿风险项 */
export interface WishRisk {
  index: number
  wish: WishItem
  riskLevel: RiskLevel
  factors: RiskFactor[]
}

/** 风险报告 */
export interface RiskReport {
  overallScore: number
  wishRisks: WishRisk[]
  suggestions: string[]
}

/** API 响应信封 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
