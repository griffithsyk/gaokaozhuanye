<template>
  <div class="flex h-screen">
    <!-- Desktop Sidebar -->
    <aside class="hidden md:flex w-56 bg-[#161b22] border-r border-[#30363d] flex-col">
      <div class="p-4 border-b border-[#30363d]">
        <h1 class="text-lg font-bold bg-gradient-to-r from-[#58a6ff] to-[#3fb950] bg-clip-text text-transparent">
          📊 志愿填报
        </h1>
        <p class="text-xs text-[#8b949e] mt-1">上海考生模拟系统</p>
      </div>
      <nav class="flex-1 p-3 space-y-1">
        <NuxtLink to="/" class="nav-item" active-class="nav-active">
          <span>🏠</span> 首页
        </NuxtLink>
        <NuxtLink to="/simulator" class="nav-item" active-class="nav-active">
          <span>📝</span> 模拟填报
        </NuxtLink>
        <NuxtLink to="/explore" class="nav-item" active-class="nav-active">
          <span>🔍</span> 院校探索
        </NuxtLink>
        <NuxtLink to="/risk" class="nav-item" active-class="nav-active">
          <span>⚡</span> 风险评估
        </NuxtLink>
        <NuxtLink to="/report" class="nav-item" active-class="nav-active">
          <span>📄</span> 导出报告
        </NuxtLink>
      </nav>
      <div class="p-3 border-t border-[#30363d] text-xs text-[#8b949e]">
        数据更新：2026年6月<br>教育部最新目录
      </div>
    </aside>

    <!-- Mobile Header -->
    <div class="flex flex-col flex-1 md:hidden">
      <header class="flex items-center justify-between p-3 bg-[#161b22] border-b border-[#30363d]">
        <h1 class="text-base font-bold bg-gradient-to-r from-[#58a6ff] to-[#3fb950] bg-clip-text text-transparent">
          📊 志愿填报
        </h1>
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-[#e6edf3] text-xl p-1">
          {{ mobileMenuOpen ? '✕' : '☰' }}
        </button>
      </header>
      <nav v-if="mobileMenuOpen" class="bg-[#161b22] border-b border-[#30363d] p-2 space-y-1">
        <NuxtLink to="/" class="nav-item" @click="mobileMenuOpen = false">
          <span>🏠</span> 首页
        </NuxtLink>
        <NuxtLink to="/simulator" class="nav-item" @click="mobileMenuOpen = false">
          <span>📝</span> 模拟填报
        </NuxtLink>
        <NuxtLink to="/explore" class="nav-item" @click="mobileMenuOpen = false">
          <span>🔍</span> 院校探索
        </NuxtLink>
        <NuxtLink to="/risk" class="nav-item" @click="mobileMenuOpen = false">
          <span>⚡</span> 风险评估
        </NuxtLink>
        <NuxtLink to="/report" class="nav-item" @click="mobileMenuOpen = false">
          <span>📄</span> 导出报告
        </NuxtLink>
      </nav>
      <main class="flex-1 overflow-auto">
        <slot />
      </main>
    </div>

    <!-- Desktop Main -->
    <main class="hidden md:block flex-1 overflow-auto">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const mobileMenuOpen = ref(false)
</script>

<style scoped>
.nav-item {
  @apply flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#8b949e] hover:bg-[#1c2333] hover:text-[#e6edf3] transition-colors;
}
.nav-active {
  @apply bg-[#1c2333] text-[#58a6ff];
}
</style>
