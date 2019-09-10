import axios from '@/libs/api.request'

//首页汇总接口
export const queryIndexCount = (params) => {
    return axios.request({
        url: '/',
        params: params,
        method: 'get'
    })
}