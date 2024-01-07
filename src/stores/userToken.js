import { defineStore } from 'pinia'

export const useUserTokenStore = defineStore('userToken', {
  state: () => ({
    token: getItem('access_token') || '',
    refreshToken: getItem('refresh_token') || ''
  }),
  actions: {
    setToken(token, refreshToken) {
      //将token在localStorage和Pinia中各存一份
      setItem('access_token', token)
      setItem('refresh_token', refreshToken)
      this.token = token
      this.refreshToken = refreshToken
    },
    removeToken() {
      removeItem('access_token')
      removeItem('refresh_token')
      this.token = ''
      this.refreshToken = ''
    }
  }
})
