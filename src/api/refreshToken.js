import request from '@/utils/request'

export const tokenRefresh = () => {
  return request({
    url: '/token-refresh',
    method: 'GET',
    __isRefreshToken: true
  })
}

export const isRefreshRequest = (config) => {
  return !!config.__isRefreshToken //两个取反，变成boolean
}
