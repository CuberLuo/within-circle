import { getUserInfo } from '@/api/userinfo'
import { useUserInfoStore } from '@/stores/userInfo.js'
import { useContactListStore } from '@/stores/contactList'
import { useUserTokenStore } from '@/stores/userToken.js'

export const useUserInfo = async () => {
  try {
    const res = await getUserInfo()
    const { data } = res
    useUserInfoStore().setUserInfo({
      userId: data.user_id,
      username: data.username,
      userAvatarUrl: data.avatar_url
    })
  } catch (error) {
    console.log(error)
  }
}

export const useLogout = () => {
  useUserTokenStore().removeToken() //清除Pinia和localStorage中无效的token
  useUserInfoStore().removeUserInfo()
  removeItem('chatHistoty')
  useContactListStore().removeContactList()
  useContactListStore().removeUnreadNum()
}
