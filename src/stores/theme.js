import { defineStore } from 'pinia'
import { getItem, setItem } from '@/utils/storage'
const defaultBrowserTheme = window.matchMedia('(prefers-color-scheme: light)').matches
  ? 'light'
  : 'dark'
export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: getItem('theme') || defaultBrowserTheme
  }),
  actions: {
    setTheme(theme) {
      setItem('theme', theme)
      this.theme = theme
    }
  }
})
