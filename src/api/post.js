import request from '@/utils/request'

export const uploadPost = (data) => {
  return request({
    url: '/post',
    method: 'POST',
    data
  })
}

export const getAllPostsLocation = () => {
  return request({
    url: '/posts-location',
    method: 'GET'
  })
}

export const getPostById = (param) => {
  return request({
    url: '/post',
    method: 'GET',
    params: param
  })
}

export const getPageSizePosts = (param) => {
  return request({
    url: '/page-size-posts',
    method: 'GET',
    params: param
  })
}

export const getTopKRecommendPosts = (param) => {
  return request({
    url: '/topk-recommend-posts',
    method: 'GET',
    params: param
  })
}

export const likePost = (data) => {
  return request({
    url: '/like-post',
    method: 'PATCH',
    data
  })
}

export const getMyPosts = () => {
  return request({
    url: '/my-posts',
    method: 'GET'
  })
}

export const deletePost = (data) => {
  return request({
    url: '/post',
    method: 'DELETE',
    data
  })
}

export const getMyLikePosts = () => {
  return request({
    url: '/my-like-posts',
    method: 'GET'
  })
}

export const uploadFile = (data) => {
  return request({
    url: '/file-upload',
    method: 'POST',
    data
  })
}
