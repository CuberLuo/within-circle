import request from '@/utils/request'

export const uploadPost = (data) => {
  return request({
    url: '/uploadPost',
    method: 'POST',
    data
  })
}
