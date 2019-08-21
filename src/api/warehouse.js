import axios from '@/libs/api.request'

//入库登记页
export const InventoryInQueryEnterList = (params) => {
  return axios.request({
    url: '/pwms/inventory/in/queryEnterList',
    params: params,
    method: 'get'
  })
}
export const InventoryInDeleteInEnter = (params) => {
  return axios.request({
    url: '/pwms/inventory/in/deleteInEnter',
    params: params,
    method: 'delete'
  })
}

//入库明细列表
export const InventoryInQueryEnterItem = (params) => {
  return axios.request({
    url: '/pwms/inventory/in/queryInEnterItem',
    params: params,
    method: 'get'
  })
}

//新增入库
export const InventoryInSaveInEnterList = (params) => {//新增入库保存
  return axios.request({
    url: '/pwms/inventory/in/saveInEnterList',
    data: params,
    method: 'post'
  })
}

//下载模板
export const downInEnterTemplates = (params) => {//入库单详情
  return axios.request({
    url: '/pwms/inventory/in/downInEnterTemplates',
    params: params,
    method: 'get'
  })
}

//编辑入库
export const InventoryInUpdateInEnterList = (params) => {//新增入库保存
  return axios.request({
    url: '/pwms/inventory/in/updateInEnterList',
    data: params,
    method: 'put'
  })
}

//入库详情与审核
export const InventoryInEnterInfo = (params) => {//入库单详情
  return axios.request({
    url: '/pwms/inventory/in/getInEnterInfo',
    params: params,
    method: 'get'
  })
}
export const InventoryInAuditInEnter = (params) => {//入库审核
  return axios.request({
    url: '/pwms/inventory/in/auditInEnter',
    params: params,
    method: 'put'
  })
}











