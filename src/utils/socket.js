import io from 'socket.io-client'
import { useUserInfoStore } from '@/stores/userInfo.js'
import {
  useAddUserContact,
  useUpdateUnReadNum,
  useUpdateLocalChatHistory
} from '@/mixins/userContact.js'
export default {
  install: (app, { connection, options }) => {
    const socket = io(connection, options)
    app.provide('socket', socket)
    socket.on('connect', () => {
      console.log(`socket.id: ${socket.id}`)
    })
    socket.io.on('reconnect', () => {
      const user_info = useUserInfoStore().user_info
      // 重连后已退出登录不需要执行login
      if (Object.keys(user_info).length === 0) return
      socket.emit('login', user_info, (res) => {
        console.log(res)
        // 获取云端暂存的消息记录更新至本地
        const cloudChatObj = res.data
        for (const key in cloudChatObj) {
          cloudChatObj[key].forEach((element) => {
            if (element.isImg)
              useAddUserContact(element.avatar, element.userId, element.username, element.chatDate)
            else
              useAddUserContact(
                element.avatar,
                element.userId,
                element.username,
                element.chatDate,
                element.text
              )
            useUpdateUnReadNum(key)
            useUpdateLocalChatHistory(key, element)
          })
        }
      })
      console.log('socket 重连', user_info)
    })
  }
}
