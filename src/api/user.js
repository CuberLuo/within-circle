import request from '@/utils/request'

export const sendSmsCode = (phone) => {
  return request({
    url: `/sms/${phone}`,
    method: 'GET'
  })
}

export const checkSmsCode = (data) => {
  return request({
    url: '/checkSmsCode',
    method: 'POST',
    data
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
