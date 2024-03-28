import { getUserInfo } from '@/api/userinfo'
import { useUserInfoStore } from '@/stores/userInfo.js'

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
