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
