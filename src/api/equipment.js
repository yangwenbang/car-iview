import axios from '@/libs/api.request'

// 新增设备
export const saveEquipment = (params) => {
    return axios.request({
        url: '/car/equipmentmanager/insertEquipmentManager',
        data: params,
        method: 'post'
    })
}

// 修改设备
export const updateEquipment = (params) => {
    return axios.request({
        url: '/car/equipmentmanager/updateEquipmentManager',
        data: params,
        method: 'post'
    })
}

// 查询列表
export const queryEquipmentList = (params) => {
    return axios.request({
        url: '/car/equipmentmanager/queryEquipmentManagerList',
        params: params,
        method: 'get'
    })
}

// 查询详情
export const queryEquipmentInfo = (params) => {
    return axios.request({
        url: '/car/equipmentmanager/queryEquipmentManagerInfo',
        params: params,
        method: 'get'
    })
}