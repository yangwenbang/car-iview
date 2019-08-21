import axios from '@/libs/api.request'

//首页汇总接口
export const queryIndexCount = (params) => {
  return axios.request({
    url: '/pwms/inventory/index',
    params: params,
    method: 'get'
  })
}

//货主
export const commonQueryOwners = (params) => {
  return axios.request({
    url: '/pwms/inventory/in/queryOwners',
    params: params,
    method: 'get'
  })
}

//产地
export const commonBrandInfos = (params) => {
  return axios.request({
    url: '/pwms/inventory/in/queryBrandInfos',
    params: params,
    method: 'get'
  })
}

//品名
export const commonBreedInfos = (params) => {
  return axios.request({
    url: '/pwms/inventory/in/queryBreedInfos',
    params: params,
    method: 'get'
  })
}

//材质
export const commonMaterialInfos = (params) => {
  return axios.request({
    url: '/pwms/inventory/in/queryMaterialInfos',
    params: params,
    method: 'get'
  })
}

//规格
export const commonSpecInfos = (params) => {
  return axios.request({
    url: '/pwms/inventory/in/querySpecInfos',
    params: params,
    method: 'get'
  })
}

//员工（装卸工、收货人等）
export const commonEmployees = (params) => {
  return axios.request({
    url: '/pwms/inventory/in/queryEmployees',
    params: params,
    method: 'get'
  })
}

//库区列表
export const commonAreasByWarehouseId = (params) => {
  return axios.request({
    url: '/pwms/inventory/in/getAreasByWarehouseId',
    params: params,
    method: 'get'
  })
}

//库位列表
export const commonLocationByWarehouseId = (params) => {
  return axios.request({
    url: '/pwms/inventory/in/getLocationByWarehouseId',
    params: params,
    method: 'get'
  })
}

//修改仓库默认配置
export const saveWarehouseDefaultConfig = (params) => {
  return axios.request({
    url: '/pwms/data/saveWarehouseDefaultConfig',
    data: params,
    method: 'post'
  })
}













