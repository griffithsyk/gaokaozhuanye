import { defineNuxtPlugin } from '#app'
import naive from 'naive-ui'

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    nuxtApp.vueApp.use(naive)
  }
})
