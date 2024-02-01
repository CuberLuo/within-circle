import request from '@/utils/request'

export const sendSmsCode = (params) => {
  return request({
    url: '/sms',
    method: 'GET',
    params
  })
}

export const smsCheck = (params) => {
  return request({
    url: '/sms-check',
    method: 'GET',
    params
  })
}

export const pwdLogin = (data) => {
  return request({
    url: '/login',
    method: 'POST',
    data
  })
}

export const pwdRegister = (data) => {
  return request({
    url: '/register',
    method: 'POST',
    data
  })
}

export const pwdChange = (data) => {
  return request({
    url: '/pwd',
    method: 'PUT',
    data
  })
}

export const followUser = (data) => {
  return request({
    url: '/follow-user',
    method: 'POST',
    data
  })
}

export const getMyFollows = () => {
  return request({
    url: '/my-follows',
    method: 'GET'
  })
}

export const getMyFans = () => {
  return request({
    url: '/my-fans',
    method: 'GET'
  })
}
