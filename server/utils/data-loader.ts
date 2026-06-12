// server/utils/data-loader.ts
import type { University, Major, MajorGroup, AdmissionRecord } from '~/types'
import universitiesData from '../data/universities.json'
import majorsData from '../data/majors.json'
import majorGroupsData from '../data/major-groups.json'
import admissions2023 from '../data/admissions/2023.json'
import admissions2024 from '../data/admissions/2024.json'
import admissions2025 from '../data/admissions/2025.json'

const universities = universitiesData as University[]
const majors = majorsData as Major[]
const majorGroups = majorGroupsData as MajorGroup[]

const admissionsMap = new Map<string, AdmissionRecord[]>()
const allAdmissions: AdmissionRecord[] = [
  ...(admissions2023 as AdmissionRecord[]),
  ...(admissions2024 as AdmissionRecord[]),
  ...(admissions2025 as AdmissionRecord[]),
]

// 构建录取数据索引：key = `${universityCode}-${groupCode}`
for (const record of allAdmissions) {
  const key = `${record.universityCode}-${record.groupCode}`
  const existing = admissionsMap.get(key) || []
  existing.push(record)
  admissionsMap.set(key, existing)
}

// 按院校代码索引专业组
const groupsByUniversity = new Map<string, MajorGroup[]>()
for (const group of majorGroups) {
  const existing = groupsByUniversity.get(group.universityCode) || []
  existing.push(group)
  groupsByUniversity.set(group.universityCode, existing)
}

// 按专业代码索引
const majorsByCode = new Map<string, Major>()
for (const major of majors) {
  majorsByCode.set(major.code, major)
}

// 按院校代码索引
const universitiesByCode = new Map<string, University>()
for (const uni of universities) {
  universitiesByCode.set(uni.code, uni)
}

export function getUniversities(): University[] {
  return universities
}

export function getUniversityByCode(code: string): University | undefined {
  return universitiesByCode.get(code)
}

export function getMajors(): Major[] {
  return majors
}

export function getMajorByCode(code: string): Major | undefined {
  return majorsByCode.get(code)
}

export function getMajorGroups(): MajorGroup[] {
  return majorGroups
}

export function getMajorGroupsByUniversity(universityCode: string): MajorGroup[] {
  return groupsByUniversity.get(universityCode) || []
}

export function getAdmissionsByGroup(universityCode: string, groupCode: string): AdmissionRecord[] {
  return admissionsMap.get(`${universityCode}-${groupCode}`) || []
}

export function getAdmissionsByYear(year: number): AdmissionRecord[] {
  return allAdmissions.filter(r => r.year === year)
}

export function getAllAdmissions(): AdmissionRecord[] {
  return allAdmissions
}

export function getAdmissionsMap(): Map<string, AdmissionRecord[]> {
  return admissionsMap
}
