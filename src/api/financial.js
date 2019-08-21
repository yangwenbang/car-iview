import axios from '@/libs/api.request'
import qs from 'qs'

//费用单列表
export const queryChargeList = (params) => {
    return axios.request({
        url: '/pwms/inventory/charge/queryChargeList',
        data: params,
        method: 'post'
    })
}
//费用单进入付款
export const chargePayment = (params) => {
    return axios.request({
        url: '/pwms/inventory/charge/chargePayment',
        params: params,
        method: 'put'
    })
}
//费用单执行付款
export const invokeChargePayment = (params) => {
    return axios.request({
        url: '/pwms/inventory/charge/invokeChargePayment',
        data: params,
        method: 'post'
    })
}
//导出费用单Excel
export const chargeExportExcel = (params) => {
    return axios.request({
        url: '/pwms/inventory/charge/chargeExportExcel',
        params: params,
        method: 'get'
    })
}