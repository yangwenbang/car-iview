import axios from '@/libs/api.request'

export const logout = (token) => {
    return axios.request({
        url: 'logout',
        method: 'post'
    })
}

// 查询质检商家账号列表
export const queryAccountList = (params) => {
    return axios.request({
        url: '/car/accountmanage/queryAccountList',
        params: params,
        method: 'get'
    })
}

// 质检商家账号重置密码
export const resetPassword = (params) => {
    return axios.request({
        url: '/car/accountmanage/resetPassword',
        params: params,
        method: 'get'
    })
}