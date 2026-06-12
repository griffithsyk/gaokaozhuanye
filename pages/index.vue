<template>
  <div class="p-8 space-y-8">
    <!-- 顶部欢迎 -->
    <div class="text-center py-8">
      <h1 class="text-3xl font-bold bg-gradient-to-r from-[#58a6ff] to-[#3fb950] bg-clip-text text-transparent mb-3">
        上海高考模拟志愿填报
      </h1>
      <p class="text-[#8b949e]">智能推荐 · 风险评估 · 助你科学填报</p>
    </div>

    <!-- 快捷入口 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
      <div
        class="p-6 rounded-lg border border-[#30363d] bg-[#161b22] hover:border-[#58a6ff]/50 transition-all cursor-pointer group"
        @click="navigateTo('/simulator')"
      >
        <div class="text-3xl mb-3">📝</div>
        <div class="text-lg font-bold text-[#e6edf3] mb-1 group-hover:text-[#58a6ff]">模拟填报</div>
        <div class="text-sm text-[#8b949e]">输入分数和选科，获取智能推荐</div>
      </div>

      <div
        class="p-6 rounded-lg border border-[#30363d] bg-[#161b22] hover:border-[#3fb950]/50 transition-all cursor-pointer group"
        @click="navigateTo('/explore')"
      >
        <div class="text-3xl mb-3">🔍</div>
        <div class="text-lg font-bold text-[#e6edf3] mb-1 group-hover:text-[#3fb950]">院校探索</div>
        <div class="text-sm text-[#8b949e]">浏览和筛选院校与专业</div>
      </div>

      <div
        class="p-6 rounded-lg border border-[#30363d] bg-[#161b22] hover:border-[#d29922]/50 transition-all cursor-pointer group"
        @click="navigateTo('/risk')"
      >
        <div class="text-3xl mb-3">⚡</div>
        <div class="text-lg font-bold text-[#e6edf3] mb-1 group-hover:text-[#d29922]">风险评估</div>
        <div class="text-sm text-[#8b949e]">分析志愿方案的安全性</div>
      </div>
    </div>

    <!-- 使用指南 -->
    <div class="max-w-4xl mx-auto bg-[#161b22] border border-[#30363d] rounded-lg p-6">
      <h2 class="text-lg font-bold text-[#e6edf3] mb-4">📖 使用指南</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        <div class="text-center p-4">
          <div class="text-2xl mb-2">1️⃣</div>
          <div class="text-[#e6edf3] font-bold mb-1">输入信息</div>
          <div class="text-[#8b949e]">填写分数、位次和选科</div>
        </div>
        <div class="text-center p-4">
          <div class="text-2xl mb-2">2️⃣</div>
          <div class="text-[#e6edf3] font-bold mb-1">选择专业组</div>
          <div class="text-[#8b949e]">从推荐中添加到志愿表</div>
        </div>
        <div class="text-center p-4">
          <div class="text-2xl mb-2">3️⃣</div>
          <div class="text-[#e6edf3] font-bold mb-1">评估风险</div>
          <div class="text-[#8b949e]">查看录取概率和建议</div>
        </div>
        <div class="text-center p-4">
          <div class="text-2xl mb-2">4️⃣</div>
          <div class="text-[#e6edf3] font-bold mb-1">导出方案</div>
          <div class="text-[#8b949e]">生成 PDF 保存或打印</div>
        </div>
      </div>
    </div>
  </div>
</template>
