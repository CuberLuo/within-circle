import { defineStore } from 'pinia'

export const useUserInfoStore = defineStore('userInfo', {
  state: () => ({
    user_info: getItem('user_info') || {}
  }),
  actions: {
    setUserInfo(info) {
      setItem('user_info', info)
      this.user_info = info
    },
    removeUserInfo() {
      removeItem('user_info')
      this.user_info = {}
    }
  }
})
