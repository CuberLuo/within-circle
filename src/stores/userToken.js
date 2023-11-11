import { defineStore } from 'pinia'

export const useUserTokenStore = defineStore('userToken', {
  state: () => ({
    token: getItem('token') || ''
  }),
  actions: {
    setToken(token) {
      //将token在localStorage和Pinia中各存一份
      setItem('token', token)
      this.token = token
    }
  }
})
