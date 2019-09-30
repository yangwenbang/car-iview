import axios from '@/libs/api.request'
import qs from 'qs'

// 查询打款列表
export const queryPaymentRecordList = (params) => {
  return axios.request({
      url: '/car/paymentrecord/queryPaymentRecordList',
      params: params,
      method: 'get'
  })
}

// 打款
export const paymentRecord = (params) => {
  return axios.request({
      url: '/car/paymentrecord/paymentRecord',
      data: qs.stringify(params),
      method: 'post',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
  })
}

// 查询交易订单列表
export const queryOrderList = (params) => {
  return axios.request({
      url: '/car/order/queryOrderList',
      params: params,
      method: 'get'
  })
}

// 查询交易订单详情
export const queryOrderInfo = (params) => {
  return axios.request({
      url: '/car/order/queryOrderInfo',
      params: params,
      method: 'get'
  })
}

// 订单发货
export const deliveryGoods = (params) => {
  return axios.request({
      url: '/car/order/deliveryGoods',
      data: params,
      method: 'post'
  })
}

// 查询退款交易订单信息
export const queryReFundOrderInfo = (params) => {
  return axios.request({
      url: '/car/order/queryReFundOrderInfo',
      params: params,
      method: 'get'
  })
}

// 退款审核
export const auditRefund = (params) => {
  return axios.request({
      url: '/car/order/deliveryGoods',
      data: params,
      method: 'post'
  })
}

// 确认退款
export const refund = (params) => {
  return axios.request({
      url: '/car/order/refund',
      params: params,
      method: 'get'
  })
}
