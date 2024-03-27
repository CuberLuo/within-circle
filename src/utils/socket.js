import io from 'socket.io-client'
import { useUserInfoStore } from '@/stores/userInfo.js'
export default {
  install: (app, { connection, options }) => {
    const socket = io(connection, options)
    app.provide('socket', socket)
    socket.on('connect', () => {
      console.log(`socket.id: ${socket.id}`)
    })
    socket.io.on('reconnect', () => {
      const user_info = useUserInfoStore().user_info
      socket.emit('login', user_info)
      console.log('socket 重连', user_info)
    })
  }
}
