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

export const getMyPosts = () => {
  return request({
    url: '/getMyPosts',
    method: 'GET'
  })
}

export const deletePost = (data) => {
  return request({
    url: '/deletePost',
    method: 'POST',
    data
  })
}

export const getMyLikePosts = () => {
  return request({
    url: '/getMyLikePosts',
    method: 'GET'
  })
}
