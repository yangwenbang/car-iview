import axios from '@/libs/api.request'
import qs from 'qs'

//库区管理列表页
export const storeAreaList = (params) => {
  return axios.request({
    url: '/pwms/data/queryDataList',
    params: params,
    method: 'get'
  })
}

//新增库区
export const storeAreaAdd = (params) => {
  return axios.request({
    url: '/pwms/data/insertDataList',
    data: params,
    method: 'POST'
  })
}

//修改库区
export const storeAreaEdit = (params) => {
  return axios.request({
    url: '/pwms/data/updateDataList',
    data: params,
    method: 'POST'
  })
}

//修改库区状态
export const storeUpdateStatus = (params) => {
  return axios.request({
    url: '/pwms/data/updateStatus',
    data: qs.stringify(params),
    method: 'POST'
  })
}

//库位管理列表页
export const storeHouseList = (params) => {
  return axios.request({
    url: '/pwms/data/queryWareHouse',
    params: params,
    method: 'get'
  })
}

//新增库位
export const storeHouseAdd = (params) => {
  return axios.request({
    url: '/pwms/data/insertDataHouse',
    data: params,
    method: 'POST'
  })
}

//修改库位
export const storeHouseEdit = (params) => {
  return axios.request({
    url: '/pwms/data/updateDataHouse',
    data: params,
    method: 'POST'
  })
}
