import axios from '@/libs/api.request'

// 库存明细单列表
export const StorageDetail = (params) => {
    return axios.request({
      url: '/pwms/inventory/queryVInventoryItem',
      params: params,
      method: 'get'
    })
  }

// 库存明细单列表
export const StorageSummary = (params) => {
    return axios.request({
      url: '/pwms/inventory/queryInventorySummary',
      params: params,
      method: 'get'
    })
  }
  //物资详情，货物轨迹
  export const getStorageTrack = (data) => {
    return axios.request({
      url: '/pwms/inventory/queryInventoryTracingByItemId',
      method: 'get',
      params:data
    })
  }
  //母卷信息
  export const getParentInventory = (data) => {
    return axios.request({
      url: '/pwms/inventory/getParentInventoryItemDetail',
      method: 'get',
      params:data
    })
  }
  export const adjustInventory=(data)=>{
    return axios.request({
      url: '/pwms/inventory/adjustInventory',
      method: 'put',
      data:data
    })
  }
  