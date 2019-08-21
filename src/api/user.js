import axios from '@/libs/api.request'

export const pwmsLogin = ({ userName, password }) => {
  const data = {
    userName,
    password
  }
  return axios.request({
    url: '/pwms/user/login',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: '/pwms/user/WarehouseChoose',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}
