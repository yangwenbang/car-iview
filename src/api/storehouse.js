import axios from '@/libs/api.request'

//库区列表
export const getAreasByWarehouseId = (params) => {
    return axios.request({
        url: 'pwms/data/warehouse/getAreasByWarehouseId',
        params: params,
        method: 'get'
    })
}

//库位列表
export const getLocationByWarehouseId = (params) => {
    return axios.request({
        url: 'pwms/data/warehouse/getLocationByWarehouseId',
        params: params,
        method: 'get'
    })
}

//根据仓库名称搜索仓库列表

export const queryListByName = (params) => {
    return axios.request({
        url: 'pwms/data/warehouse/queryListByName',
        params: params,
        method: 'get'
    })
}

//获取仓库列表
export const queryList = (params) => {
    return axios.request({
        url: 'pwms/data/warehouse/queryList',
        params: params,
        method: 'get'
    })
}

//查看仓库
export const getOne = (params) => {
    return axios.request({
        url: 'pwms/data/warehouse/getOne',
        params: params,
        method: 'get'
    })
}


//新增 保存仓库
export const save = (params) => {
    return axios.request({
        url: 'pwms/data/warehouse/save',
        data: params,
        method: 'post'
    })
}

//编辑仓库
export const  update = (params) => {
    return axios.request({
        url: 'pwms/data/warehouse/update',
        data: params,
        method: 'post'
    })
}


//停用/启用 仓库状态
export const  updateStatus = (params) => {
    return axios.request({
        url: 'pwms/data/warehouse/updateStatus',
        data: params,
        method: 'post'
    })
}

//入库明细导入
export const  importInEnterItem = (params) => {
    return axios.request({
        url: 'pwms/inventory/admin/in/importInEnterItem',
        data: params,
        method: 'post'
    })
}
//保存入库登记信息
export const  saveInEnterList = (params) => {
    return axios.request({
        url: 'pwms/inventory/admin/in/saveInEnterList',
        data: params,
        method: 'post'
    })
}
