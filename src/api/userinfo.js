import request from '@/utils/request'

export const getUserInfo = () => {
  return request({
    url: '/getUserInfo',
    method: 'GET'
  })
}

export const uploadUserAvatar = (data) => {
  return request({
    url: '/uploadUserAvatar',
    method: 'POST',
    data
  })
}

export const getPosterUserInfo = (poster_id) => {
  return request({
    url: `/getPosterUserInfo/${poster_id}`,
    method: 'GET'
  })
}
