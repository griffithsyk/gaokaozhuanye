// composables/useWishStore.ts
import { ref } from 'vue'
import type { WishItem, Subject } from '~/types'

const STORAGE_KEY = 'gaokao-wish-store'

const score = ref<number | null>(null)
const rank = ref<number | null>(null)
const subjects = ref<Subject[]>([])
const wishes = ref<WishItem[]>([])

export function useWishStore() {
  const setScoreInfo = (s: number, r: number, subs: Subject[]) => {
    score.value = s
    rank.value = r
    subjects.value = [...subs]
    save()
  }

  const addWish = (item: Omit<WishItem, 'id'>) => {
    if (wishes.value.length >= 24) return
    wishes.value = [...wishes.value, { ...item, id: crypto.randomUUID() }]
    save()
  }

  const removeWish = (index: number) => {
    wishes.value = wishes.value.filter((_, i) => i !== index)
    save()
  }

  const reorderWishes = (fromIndex: number, toIndex: number) => {
    const updated = [...wishes.value]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    wishes.value = updated
    save()
  }

  const updateGroupMajors = (index: number, majors: string[]) => {
    wishes.value = wishes.value.map((w, i) =>
      i === index ? { ...w, selectedMajors: majors.slice(0, 6) } : w
    )
    save()
  }

  const updateWishCategory = (index: number, category: WishItem['category']) => {
    wishes.value = wishes.value.map((w, i) =>
      i === index ? { ...w, category } : w
    )
    save()
  }

  const save = () => {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        score: score.value,
        rank: rank.value,
        subjects: subjects.value,
        wishes: wishes.value,
      }))
    }
  }

  const load = () => {
    if (import.meta.client) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const data = JSON.parse(raw)
          score.value = data.score ?? null
          rank.value = data.rank ?? null
          subjects.value = data.subjects || []
          wishes.value = data.wishes || []
        }
      } catch {
        // 数据损坏则清空
        clear()
      }
    }
  }

  const clear = () => {
    score.value = null
    rank.value = null
    subjects.value = []
    wishes.value = []
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  return {
    score,
    rank,
    subjects,
    wishes,
    setScoreInfo,
    addWish,
    removeWish,
    reorderWishes,
    updateGroupMajors,
    updateWishCategory,
    save,
    load,
    clear,
  }
}
