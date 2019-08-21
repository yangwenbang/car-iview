import axios from '@/libs/api.request'

//账号管理列表页
export const accountList = (params) => {
  return axios.request({
    url: '/pwms/user/queryUserList',
    params: params,
    method: 'get'
  })
}
// 删除账户
export const deleteAccount = (params) => {
  return axios.request({
    url: '/pwms/user/enableOrDisabledUser',
    params: params,
    method: 'DELETE'
  })
}
//查看账户
export const showAccount = (params) => {
  return axios.request({
    url: '/pwms/user/queryUser',
    params: params,
    method: 'PUT'
  })
}
//停用或者启用账户
export const banAccount = (params) => {
  return axios.request({
    url: '/pwms/user/enableOrDisabledUser',
    params: params,
    method: 'get'
  })
}

//修改账户
export const updateUser = (params) => {
  return axios.request({
    url: 'pwms/user/updateUser',
    data: params,
    method: 'POST'
  })
}
//新增账户
export const saveAccount = (params) => {
  return axios.request({
    url: '/pwms/user/saveUser',
    data: params,
    method: 'POST'
  })
}
//修改密码
export const updatePassword = (params) => {
  return axios.request({
    url: '/pwms/user/updatePassword',
    data: params,
    method: 'PUT'
  })
}
//重置密码
export const resetPassword = (params) => {
  return axios.request({
    url: '/pwms/user/resetUserPassword',
    params: params,
    method: 'PUT'
  })
}
//获取仓库
export const getWarehouse = (params) => {
  return axios.request({
    url: '/pwms/data/warehouse/getWarehouseForUser',
    params: params,
    method: 'get'
  })
}
//获取角色
export const queryRoleList = (params) => {
  return axios.request({
    url: '/pwms/user/role/queryRoleList',
    params: params,
    method: 'get'
  })
}
//获取权限列表
export const queryRightList = (params) => {
  return axios.request({
    url: '/pwms/user/right/queryRightList',
    params: params,
    method: 'get'
  })
}
//权限设置
export const setUserRightManagement = (params) => {
  return axios.request({
    url: '/pwms/user/setUserRightManagement',
    data: params,
    method: 'POST'
  })
}













