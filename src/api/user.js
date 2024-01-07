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
    url: '/smsCheck',
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
    url: '/pwdChange',
    method: 'POST',
    data
  })
}

export const followUser = (data) => {
  return request({
    url: '/followUser',
    method: 'POST',
    data
  })
}

export const getMyFollows = () => {
  return request({
    url: '/getMyFollows',
    method: 'GET'
  })
}

export const getMyFans = () => {
  return request({
    url: '/getMyFans',
    method: 'GET'
  })
}
