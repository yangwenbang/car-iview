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

//删除分类
export const deleteCategory = (params) => {
    return axios.request({
        url: '/car/category/deleteCategory',
        params: params,
        method: 'delete'
    })
}

// 保存分类
export const saveCategory = (params) => {
    return axios.request({
        url: '/car/category/saveCategory',
        data: params,
        method: 'post'
    })
}

// 修改分类
export const updateCategory = (params) => {
    return axios.request({
        url: '/car/category/updateCategory',
        data: params,
        method: 'post'
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

// 审核商品订单
export const auditCommodity = (params) => {
    return axios.request({
        url: '/car/commodity/auditCommodity',
        data: params,
        method: 'post'
    })
}

export const queryCommodityOrder = (params) => {
    return axios.request({
        url: '/car/commodity/queryCommodityOrder',
        params: params,
        method: 'get'
    })
}

//删除分类属性
export const deleteCategoryAttribute = (params) => {
  return axios.request({
      url: '/car/category/deleteCategoryAttribute',
      params: params,
      method: 'delete'
  })
}

//查询分类
export const queryCategoryAttributeList = (params) => {
  return axios.request({
      url: '/car/category/queryCategoryAttributeList',
      params: params,
      method: 'get'
  })
}


// 修改分类
export const saveCategoryAttribute = (params) => {
  return axios.request({
      url: '/car/category/saveCategoryAttribute',
      data: params,
      method: 'post'
  })
}

export const queryTreeOfCategoryAttribute = (params) => {
  return axios.request({
    url: '/car/category/queryTreeOfCategoryAttribute',
    params: params,
    method: 'get'
  })
}

export const updateCategoryAttribute = (params) => {
  return axios.request({
    url: '/car/category/updateCategoryAttribute',
    data: params,
    method: 'post'
  })
}

export const queryFactoryBrand = (params) => {
  return axios.request({
    url: '/car/category/queryFactoryCategoryAttribute',
    params: params,
    method: 'get'
  })
}
