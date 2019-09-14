import axios from '@/libs/api.request'

//发送短信
export const sendSms = (params) => {
    return axios.request({
        url: '/car/qualityshop/sendSms',
        params: params,
        method: 'get'
    })
}

//新增质检商家
export const saveQualityShop = (params) => {
    return axios.request({
        url: '/car/qualityshop/saveQualityShop',
        data: params,
        method: 'post'
    })
}

//修改质检商家
export const updateQualityShop = (params) => {
    return axios.request({
        url: '/car/qualityshop/updateQualityShop',
        data: params,
        method: 'post'
    })
}

//查询质检商家
export const queryQualityShop = (params) => {
    return axios.request({
        url: '/car/qualityshop/queryQualityShop',
        params: params,
        method: 'get'
    })
}

// 查询质检商家列表
export const queryQualityShopList = (params) => {
    return axios.request({
        url: '/car/qualityshop/queryQualityShopList',
        params: params,
        method: 'get'
    })
}