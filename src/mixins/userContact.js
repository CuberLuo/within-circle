import { useContactListStore } from '@/stores/contactList'

export const useAddUserContact = (avatar, userId, username, detail = '[图片]') => {
  const contactItem = {
    avatar_src: avatar,
    title: username,
    userId,
    detail
  }
  let existContactItem = false
  const contactList = useContactListStore().contactList
  contactList.forEach((item, index) => {
    // 联系人在列表中已存在
    if (item.userId == userId) {
      let unreadNum = 0
      if ('msg_num' in contactList[index]) unreadNum = contactList[index].msg_num
      contactList.splice(index, 1)
      contactList.unshift({
        ...contactItem,
        msg_num: unreadNum
      })
      existContactItem = true
    }
  })
  // 联系人在列表中不存在
  if (!existContactItem) {
    contactList.unshift({
      ...contactItem,
      msg_num: 0
    })
  }
  useContactListStore().setContactList(contactList)
}

export const useUpdateUserContact = (avatar, userId, username, detail = '[图片]') => {
  const contactItem = {
    avatar_src: avatar,
    title: username,
    userId,
    detail
  }
  const contactList = useContactListStore().contactList
  contactList.forEach((item, index) => {
    // 在列表中找到需要更新的联系人
    if (item.userId == userId) {
      contactList[index] = {
        ...contactItem,
        msg_num: 0
      }
    }
  })
  useContactListStore().setContactList(contactList)
}

export const useUpdateUnReadNum = (userId) => {
  let totalUnreadNum = 0
  const contactList = useContactListStore().contactList
  contactList.forEach((item, index) => {
    // 在列表中找到需要更新的联系人
    if (item.userId == userId) {
      contactList[index].msg_num += 1
    }
    totalUnreadNum += contactList[index].msg_num
  })
  useContactListStore().setContactList(contactList)
  useContactListStore().setUnreadNum(totalUnreadNum)
}

export const useClearUnReadNum = (userId) => {
  let totalUnreadNum = 0
  const contactList = useContactListStore().contactList
  contactList.forEach((item, index) => {
    // 在列表中找到需要更新的联系人
    if (item.userId == userId) {
      contactList[index].msg_num = 0
    }
    totalUnreadNum += contactList[index].msg_num
  })
  useContactListStore().setContactList(contactList)
  useContactListStore().setUnreadNum(totalUnreadNum)
}

export const useUpdateLocalChatHistory = (chatUserId, chatObj) => {
  // 更新本地聊天记录
  let chatHistory = getItem('chatHistoty')
  const chatUserHistoryList = chatHistory[chatUserId]
  if (!chatUserHistoryList) {
    chatHistory[chatUserId] = []
  }

  chatHistory[chatUserId].push(chatObj)
  setItem('chatHistoty', chatHistory)
}
