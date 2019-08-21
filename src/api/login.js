import axios from '@/libs/api.request'

export const pwmsLogin = ({ userName, password,type }) => {
  const data = {
    userName,
    password,
    type
  }
  return axios.request({
    url: '/sys/admin/login',
    data,
    method: 'post'
  })
}

export const getWarehouse = (params) => {
  return axios.request({
    url: '/pwms/user/getWarehouse',
    params: params,
    method: 'get'
  })
}

export const getPlatform = (params) => {
  return axios.request({
    url: '/pwms/user/getPlatform',
    params: params,
    method: 'get'
  })
}

export const getUserId = (params) => {
  return axios.request({
    url: '/pwms/user/getUserId',
    params: params,
    method: 'get'
  })
}

export const updatePassword = (params) => {
  return axios.request({
    url: '/pwms/user/updatePassword',
    data: params,
    method: 'put'
  })
}

export const loginOut = (params) => {
  return axios.request({
    url: '/pwms/user/loginOut',
    params: params,
    method: 'get'
  })
}

export const warehouseChoose = (params) => {
  return axios.request({
    url: '/pwms/user/WarehouseChoose',
    params: params,
    method: 'put',
    // transformRequest: [function (data) {
    //   console.log(data)
    //   let ret = ''
    //   for (let it in data) {
    //     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it])
    //   }
    //   return ret
    // }],
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    // }
  })
}

