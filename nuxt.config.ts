// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: '高考志愿填报模拟系统 - 上海考生',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '面向上海考生的高考模拟志愿填报系统，支持分数匹配、选科筛选、专业风险评估' }
      ]
    }
  },
  vite: {
    server: {
      port: 3000
    }
  }
})
