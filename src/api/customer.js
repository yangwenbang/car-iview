import axios from '@/libs/api.request'

//客商管理列表页
export const customerList = (params) => {
  return axios.request({
    url: '/pwms/customer/queryCustomerList',
    params: params,
    method: 'get'
  })
}
//删除客户
export const deleteCustomer = (params) => {
  return axios.request({
    url: '/pwms/customer/deleteCustomer',
    params: params,
    method: 'DELETE'
  })
}
//查看详细
export const showCustomer = (params) => {
  return axios.request({
    url: '/pwms/customer/showCustomer',
    params: params,
    method: 'get'
  })
}
//审核客户
export const auditCustomer = (params) => {
  return axios.request({
    url: '/pwms/customer/auditCustomer',
    params: params,
    method: 'get'
  })
}
//停用或者启用客户
export const banCustomer = (params) => {
  return axios.request({
    url: '/pwms/customer/banCustomer',
    params: params,
    method: 'get'
  })
}

//开户银行
export const queryBankTitle = (params) => {
  return axios.request({
    url: '/pwms/customer/queryBankTitle',
    params: params,
    method: 'get'
  })
}

//新增企业客户
export const saveCustomer = (params) => {
  return axios.request({
    url: '/pwms/customer/saveCustomer',
    data: params,
    method: 'POST'
  })
}
//新增个人客户
export const savePersonal = (params) => {
  return axios.request({
    url: '/pwms/customer/savePersonal',
    data: params,
    method: 'POST'
  })
}

//修改企业客户信息
export const updateCustomer = (params) => {
  return axios.request({
    url: '/pwms/customer/updateCustomer',
    data: params,
    method: 'POST'
  })
}

//修改个人客户信息
export const updatePersonal = (params) => {
  return axios.request({
    url: '/pwms/customer/updatePersonal',
    data: params,
    method: 'POST'
  })
}

//获取供应商
export const getSupplier = (params) => {
  return axios.request({
    url: '/pwms/customer/getSupplier',
    params: params,
    method: 'get'
  })
}















