<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between print:hidden">
      <h1 class="text-xl font-bold text-[#e6edf3]">📄 导出志愿方案</h1>
    </div>

    <!-- 方案预览 -->
    <div v-if="wishStore.wishes.value.length > 0" class="space-y-4">
      <!-- 可打印区域 -->
      <div id="print-area" class="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-[#e6edf3] mb-2">高考志愿填报方案</h2>
          <div class="text-sm text-[#8b949e]">
            总分 <span class="text-[#e6edf3] font-bold">{{ wishStore.score.value }}</span> 分 ·
            位次 <span class="text-[#e6edf3] font-bold">{{ wishStore.rank.value }}</span> ·
            选科 <span class="text-[#e6edf3]">{{ wishStore.subjects.value.join('、') }}</span>
          </div>
        </div>

        <div class="space-y-2">
          <div
            v-for="(wish, i) in wishStore.wishes.value"
            :key="wish.id"
            class="flex items-center gap-3 p-3 rounded bg-[#0d1117] border border-[#30363d] text-sm"
          >
            <span class="w-8 text-center text-[#8b949e] font-bold">{{ i + 1 }}</span>
            <div class="flex-1">
              <div class="text-[#e6edf3]">{{ getUniversityName(wish.universityCode) }} · {{ getGroupName(wish.universityCode, wish.groupCode) }}</div>
              <div v-if="wish.selectedMajors.length > 0" class="text-xs text-[#8b949e] mt-1">
                {{ wish.selectedMajors.map(getMajorName).join('、') }}
              </div>
            </div>
            <span :class="categoryClass(wish.category)" class="px-2 py-0.5 rounded text-xs font-bold">
              {{ wish.category }}
            </span>
          </div>
        </div>

        <div class="text-center text-xs text-[#8b949e] mt-6">
          上海高考模拟志愿填报系统 · {{ new Date().getFullYear() }}年
        </div>
      </div>

      <div class="flex gap-3 print:hidden">
        <n-button
          type="primary"
          size="large"
          class="flex-1"
          @click="handlePrint"
        >
          📥 导出 PDF / 打印
        </n-button>
        <n-button
          size="large"
          @click="copyToClipboard"
        >
          📋 复制文本
        </n-button>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-20 text-[#8b949e]">
      <div class="text-4xl mb-4">📋</div>
      <div>还没有填报方案</div>
      <n-button class="mt-4" @click="navigateTo('/simulator')">前往模拟填报</n-button>
    </div>

    <!-- 复制成功提示 -->
    <n-toast-provider>
      <n-message-provider />
    </n-toast-provider>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const wishStore = useWishStore()
const { getUniversityName, getGroupName, getMajorName } = useDataLookup()

onMounted(() => {
  wishStore.load()
})

const handlePrint = () => {
  window.print()
}

const copyToClipboard = async () => {
  const lines = [
    `高考志愿填报方案`,
    `总分：${wishStore.score.value}分 | 位次：${wishStore.rank.value} | 选科：${wishStore.subjects.value.join('、')}`,
    '',
    ...wishStore.wishes.value.map((w, i) =>
      `${i + 1}. ${getUniversityName(w.universityCode)} · ${getGroupName(w.universityCode, w.groupCode)} [${w.category}] ${w.selectedMajors.length > 0 ? '- ' + w.selectedMajors.map(getMajorName).join('、') : ''}`
    ),
  ]

  try {
    await navigator.clipboard.writeText(lines.join('\n'))
    window.alert('已复制到剪贴板！')
  } catch {
    window.alert('复制失败，请手动复制')
  }
}

const categoryClass = (category: string) => {
  switch (category) {
    case '冲': return 'bg-red-500/20 text-red-400'
    case '稳': return 'bg-yellow-500/20 text-yellow-400'
    case '保': return 'bg-green-500/20 text-green-400'
    default: return 'bg-[#21262d] text-[#8b949e]'
  }
}
</script>

<style>
@media print {
  body { background: #fff !important; color: #000 !important; }
  .print\:hidden { display: none !important; }
  #print-area {
    background: #fff !important;
    border: none !important;
    color: #000 !important;
  }
  #print-area * { color: #000 !important; }
  #print-area .bg-\[\#0d1117\] { background: #f5f5f5 !important; border-color: #ddd !important; }
  .bg-red-500\/20 { background: #fee !important; color: #c00 !important; }
  .bg-yellow-500\/20 { background: #ffc !important; color: #960 !important; }
  .bg-green-500\/20 { background: #efe !important; color: #060 !important; }
}
</style>
