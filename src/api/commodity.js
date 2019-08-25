import axios from '@/libs/api.request'

//商品管理
export const uploadImg = (params) => {
    return axios.request({
        url: '/car/qualityshop/uploadPicture',
        data: params,
        method: 'post'
    })
}

//查询分类
export const queryCategory = (params) => {
    return axios.request({
        url: '/car/category/queryCategory',
        params: params,
        method: 'get'
    })
}

//查询分类属性
export const queryCategoryAttribute = (params) => {
    return axios.request({
        url: '/car/category/queryCategoryAttribute',
        params: params,
        method: 'get'
    })
}