import { defineStore } from 'pinia'

export const useContactListStore = defineStore('contactList', {
  state: () => ({
    contactList: getItem('contactList') || [],
    unreadNum: getItem('unreadNum') || 0
  }),
  actions: {
    setContactList(list) {
      setItem('contactList', list)
      this.contactList = list
    },
    removeContactList() {
      removeItem('contactList')
      this.contactList = []
    },
    setUnreadNum(num) {
      setItem('unreadNum', num)
      this.unreadNum = num
    },
    removeUnreadNum() {
      removeItem('unreadNum')
      this.unreadNum = 0
    }
  }
})
