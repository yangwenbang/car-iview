import axios from '@/libs/api.request'
import qs from 'qs'

export const queryDeviceList = (params) => {
    return axios.request({
      url: '/pwms/data/device/queryDeviceList',
      params: params,
      method: 'get'
    })
  }

export const addDevice = (params) => {
    return axios.request({
        url: '/pwms/data/device/add',
        data: qs.stringify(params),
        method: 'post'
    })
}
export const updateDevice = (params) => {
    return axios.request({
        url: '/pwms/data/device/update',
        data: qs.stringify(params),
        method: 'post'
    })
}
export const updateStatus = (params) => {
    return axios.request({
        url: '/pwms/data/device/updateStatus',
        data: qs.stringify(params),
        method: 'post'
    })
}
export const deleteDevice= (params)=>{
    return axios.request({
        url: '/pwms/data/device/deleteDevice',
        params: params,
        method: 'delete'
    })
}