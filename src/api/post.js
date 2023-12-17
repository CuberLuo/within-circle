import request from '@/utils/request'

export const uploadPost = (data) => {
  return request({
    url: '/uploadPost',
    method: 'POST',
    data
  })
}

export const getAllPosts = () => {
  return request({
    url: '/getAllPosts',
    method: 'GET'
  })
}

export const getPageSizePosts = (param) => {
  return request({
    url: '/getPageSizePosts',
    method: 'GET',
    params: param
  })
}

export const likePost = (data) => {
  return request({
    url: '/likePost',
    method: 'POST',
    data
  })
}
