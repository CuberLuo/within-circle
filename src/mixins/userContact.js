export const useAddUserContact = (avatar, userId, username, detail = '[图片]') => {
  const contactItem = {
    avatar_src: avatar,
    title: username,
    userId,
    detail
  }
  let existContactItem = false
  const contactList = getItem('contactList')
  contactList.forEach((item, index) => {
    // 联系人在列表中已存在
    if (item.userId == userId) {
      contactList.splice(index, 1)
      contactList.unshift(contactItem)
      existContactItem = true
    }
  })
  // 联系人在列表中不存在
  if (!existContactItem) {
    contactList.unshift(contactItem)
  }
  setItem('contactList', contactList)
}

export const useUpdateUserContact = (avatar, userId, username, detail = '[图片]') => {
  const contactItem = {
    avatar_src: avatar,
    title: username,
    userId,
    detail
  }
  const contactList = getItem('contactList')
  contactList.forEach((item, index) => {
    // 在列表中找到需要更新的联系人
    if (item.userId == userId) {
      contactList[index] = contactItem
    }
  })
  setItem('contactList', contactList)
}
