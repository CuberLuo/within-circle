import { defineStore } from 'pinia'

export const useUserInfoStore = defineStore('userInfo', {
  state: () => ({
    user_info: getItem('user_info') || {
      userId: '',
      username: '',
      userAvatarUrl: ''
    }
  }),
  actions: {
    setUserInfo(info) {
      setItem('user_info', info)
      this.user_info = info
    }
  }
})
