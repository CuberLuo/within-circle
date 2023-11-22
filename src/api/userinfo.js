import request from '@/utils/request'

export const getUserInfo = () => {
  return request({
    url: '/getUserInfo',
    method: 'GET'
  })
}
