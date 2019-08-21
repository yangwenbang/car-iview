import axios from '@/libs/api.request'

//加工单管理-加工单审核
export const InventoryProcessAuditProcess = (params) => {
  return axios.request({
    url: '/pwms/inventory/process/auditProcess',
    params: params,
    method: 'put'
  })
}
//加工单管理-加工单删除
export const InventoryProcessDeleteProcess = (params) => {
  return axios.request({
    url: '/pwms/inventory/process/deleteProcess',
    params: params,
    method: 'delete'
  })
}
//加工单管理-加工机组列表
export const InventoryProcessDeviceList = (params) => {
  return axios.request({
    url: '/pwms/inventory/process/deviceList',
    params: params,
    method: 'get'
  })
}

//加工单管理-加工管理列表
export const InventoryProcessQueryProcessList = (params) => {
  return axios.request({
    url: '/pwms/inventory/process/queryProcessList',
    params: params,
    method: 'get'
  })
}

//加工单管理-保存加工单
export const InventoryProcessSaveProcess = (params) => {
  return axios.request({
    url: '/pwms/inventory/process/saveProcess',
    data: params,
    method: 'post'
  })
}
//加工单管理-修改加工单
export const InventoryProcessUpdateProcess = (params) => {
  return axios.request({
    url: '/pwms/inventory/process/updateProcess',
    data: params,
    method: 'post'
  })
}
//加工单管理-加工货主列表
export const InventoryProcessCustomerList = (params) => {
  return axios.request({
    url: '/pwms/inventory/process/customerList',
    params: params,
    method: 'get'
  })
}
//加工单管理-选择加工卷
export const InventoryQueryVInventoryItem = (params) => {
  return axios.request({
    url: '/pwms/inventory/queryVInventoryItem',
    params: params,
    method: 'get'
  })
}
//加工单管理-查看
export const InventoryProcessProcessInfo = (params) => {
  return axios.request({
    url: '/pwms/inventory/process/processInfo',
    params: params,
    method: 'get'
  })
}
//加工单管理-查看打包信息
export const InventoryProcessQueryPackageInfo = (params) => {
  return axios.request({
    url: '/pwms/inventory/process/queryPackageInfo',
    params: params,
    method: 'get'
  })
}
//加工单管理-保存打包
export const InventoryProcessSaveProcessPack = (params) => {
  return axios.request({
    url: '/pwms/inventory/process/saveProcessPack',
    data: params,
    method: 'post'
  })
}
//生产加工表-生产加工单列表
export const InventoryProcessQueryProduceProcessList = (params) => {
  return axios.request({
    url: '/pwms/inventory/process/queryProduceProcessList',
    params: params,
    method: 'get'
  })
}

//生产加工表-撤销加工
export const InventoryProcessRevokeProcess = (params) => {
  return axios.request({
    url: '/pwms/inventory/process/revokeProcess',
    params: params,
    method: 'put'
  })
}
//生产加工表-开始加工
export const InventoryProcessStartProcess = (params) => {
  return axios.request({
    url: '/pwms/inventory/process/startProcess',
    params: params,
    method: 'put'
  })
}
//生产加工表-录入加工成品数据
export const InventoryProcessInputProcessData = (params) => {
  return axios.request({
    url: '/pwms/inventory/process/inputProcessData',
    data: params,
    method: 'put'
  })
}
//生产加工表-加工完成
export const InventoryProcessProcessComplete = (params) => {
  return axios.request({
    url: '/pwms/inventory/process/processComplete',
    params: params,
    method: 'put'
  })
}
//生产加工表-查看
export const InventoryProcessProduceProcessInfo = (params) => {
  return axios.request({
    url: '/pwms/inventory/process/produceProcessInfo',
    params: params,
    method: 'get'
  })
}