import axios from '@/libs/api.request'

// 出库结算单列表
export const OutSettleQueryList = (params) => {
  return axios.request({
    url: '/pwms/inventory/outSettle/querySettleList',
    params: params,
    method: 'get'
  })
}
// 出库结算单审核
export const OutSettleAuditOrder = (params) => {
  return axios.request({
    url: '/pwms/inventory/outSettle/auditOutSettle',
    params: params,
    method: 'put'
  })
}
// 出库结算单删除
export const OutSettleDeleteOrder = (params) => {
  return axios.request({
    url: '/pwms/inventory/outSettle/deleteOutSettle',
    params: params,
    method: 'delete'
  })
}

// 出库结算单详情
export const OutSettleDetail = (params) => {
  return axios.request({
    url: '/pwms/inventory/outSettle/querySettleItem',
    params: params,
    method: 'get'
  })
}

// 库存明细列表
export const inventoryItemQueryList = (params) => {
  return axios.request({
    url: '/pwms/inventory/queryVInventoryItem',
    params: params,
    method: 'get'
  })
}
// 保存出库结算单
export const OutSettleSave = (params) => {
  return axios.request({
    url: '/pwms/inventory/outSettle/createSettleList',
    data: params,
    method: 'post'
  })
}
// 编辑出库结算单
export const OutSettleEdit = (params) => {
  return axios.request({
    url: '/pwms/inventory/outSettle/editOutSettle',
    data: params,
    method: 'post'
  })
}
// 出库结算单收款
export const OutSettleCollect = (params) => {
  return axios.request({
    url: '/pwms/inventory/outSettle/collectOutSettle',
    params: params,
    method: 'put'
  })
}

// 提货单列表
export const deliveryList = (params) => {
  return axios.request({
    url: '/pwms/inventory/delivery/queryDeliveryList',
    params: params,
    method: 'get'
  })
}
//保存提货信息
export const saveDelivery = (params) => {
  return axios.request({
    url: '/pwms/inventory/delivery/saveDelivery',
    data: params,
    method: 'post'
  })
}
//删除提货信息
export const deleteDelivery = (params) => {
  return axios.request({
    url: '/pwms/inventory/delivery/deleteDelivery',
    params: params,
    method: 'DELETE'
  })
}
//查看提货单
export const queryDeliveryDetail = (params) => {
  return axios.request({
    url: '/pwms/inventory/delivery/queryDelivery',
    params: params,
    method: 'get'
  })
}
//审核提货单
export const queryDeliveryAudit = (params) => {
  return axios.request({
    url: '/pwms/inventory/delivery/auditDelivery',
    params: params,
    method: 'get'
  })
}
//编辑提货单保存
export const updateDelivery = (params) => {
  return axios.request({
    url: '/pwms/inventory/delivery/updateDelivery',
    data: params,
    method: 'post'
  })
}

//录入磅重
export const updateDeliveryItemWeighed = (params) => {
  return axios.request({
    url: '/pwms/inventory/delivery/updateDeliveryItemWeighed',
    data: params,
    method: 'post'
  })
}
//过户单列表
export const transferQueryTransferList = (params) => {
  return axios.request({
    url: '/pwms/inventory/transfer/queryTransferList',
    params: params,
    method: 'get'
  })
}
//过户单删除
export const transferDeleteTransfer = (params) => {
  return axios.request({
    url: '/pwms/inventory/transfer/deleteTransfer',
    data: params,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    }
  })
}
//过户单查看
export const transferQueryTransfer = (params) => {
  return axios.request({
    url: '/pwms/inventory/transfer/queryTransfer',
    params: params,
    method: 'get'
  })
}
//过户单进入付款
export const transferTransferPayment = (params) => {
  return axios.request({
    url: '/pwms/inventory/transfer/transferPayment',
    params: params,
    method: 'get'
  })
}
//过户单执行付款
export const transferInvokeTransferPayment = (params) => {
  return axios.request({
    url: '/pwms/inventory/transfer/invokeTransferPayment',
    params: params,
    method: 'get'
  })
}
//过户单审核
export const transferAuditTransfer = (params) => {
  return axios.request({
    url: '/pwms/inventory/transfer/auditTransfer',
    params: params,
    method: 'post'
  })
}
//新增过户单保存
export const addTransferSave = (params) => {
  return axios.request({
    url: '/pwms/inventory/transfer/saveTransfer',
    data: params,
    method: 'post'
  })
}

//编辑过户单保存
export const editTransferSave = (params) => {
  return axios.request({
    url: '/pwms/inventory/transfer/editTransfer',
    data: params,
    method: 'post'
  })
}

//修改出库结算单价格
export const updateOutSettlePrice = (params) => {
  return axios.request({
    url: '/pwms/inventory/outSettle/updateOutSettlePrice',
    data: params,
    method: 'post'
  })
}

//查看母卷信息
export const getParentInventoryItemDetail = (params) => {
  return axios.request({
    url: '/pwms/inventory/getParentInventoryItemDetail',
    params: params,
    method: 'get'
  })
}

//根据打包ID查询物资信息
export const queryInventoryItemsByPackId = (params) => {
  return axios.request({
    url: '/pwms/inventory/queryInventoryItemsByPackId',
    params: params,
    method: 'get'
  })
}