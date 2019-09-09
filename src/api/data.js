import axios from '@/libs/api.request'

export const getTableData = (params) => {
    return axios.request({
        url: 'get_table_data',
        data: params,
        method: 'post'
    })
}

export const getRestartTableData = (params) => {
    return axios.request({
        url: 'get_restart_table_data',
        data: params,
        method: 'get'
    })
}

export const titleApi = (params) => {
    return axios.request({
        url: 'title_api',
        params: params,
        method: 'get'
    })
}

export const getDragList = () => {
    return axios.request({
        url: 'get_drag_list',
        method: 'get'
    })
}

export const errorReq = () => {
    return axios.request({
        url: 'error_url',
        method: 'post'
    })
}

export const saveErrorLogger = info => {
    return axios.request({
        url: 'save_error_logger',
        data: info,
        method: 'post'
    })
}

export const getTaskeData = (params) => {
        return axios.request({
            url: 'get_task_data',
            data: params,
            method: 'post'
        })
    }
    // 这是为了测试proxy写的一个大数据的接口
export const goodscontractList = (params) => {
    return axios.request({
        url: '/bigdata/ironman/api/v5/contracts/goods/contracts',
        params: params,
        method: 'get'
    })
}