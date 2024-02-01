import request from '@/utils/request'

export const getUserInfo = () => {
  return request({
    url: '/user-info',
    method: 'GET'
  })
}

export const uploadUserAvatar = (data) => {
  return request({
    url: '/avatar',
    method: 'PUT',
    data
  })
}

export const getPosterUserInfo = (poster_id) => {
  return request({
    url: `/poster_user_info/${poster_id}`,
    method: 'GET'
  })
}
