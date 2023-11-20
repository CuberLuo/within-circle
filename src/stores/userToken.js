import { defineStore } from 'pinia'

export const useUserTokenStore = defineStore('userToken', {
  state: () => ({
    token: getItem('access_token') || ''
  }),
  actions: {
    setToken(token) {
      //将token在localStorage和Pinia中各存一份
      setItem('access_token', token)
      this.token = token
    },
    removeToken() {
      removeItem('access_token')
      this.token = ''
    }
  }
})
