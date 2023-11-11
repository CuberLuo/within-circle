import { defineStore } from 'pinia'
import { getItem, setItem } from '@/utils/storage'

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
