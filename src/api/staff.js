import axios from '@/libs/api.request';

//删除员工
export const deleteEmployee = (params) => {
    return axios.request({
      url: '/pwms/user/employee/deleteEmployee',
      params: params,
      method: 'delete'
    })
}
//查询员工列表
export const queryEmployeeList = (params) => {
    return axios.request({
      url: '/pwms/user/employee/queryEmployeeList',
      params: params,
      method: 'get'
    })
}
//保存员工信息
export const saveEmployee = (params) => {
    return axios.request({
      url: '/pwms/user/employee/saveEmployee',
      data: params,
      method: 'post'
    })
}
//查看员工信息
export const showEmployee = (params) => {
    return axios.request({
      url: '/pwms/user/employee/showEmployee',
      params: params,
      method: 'get'
    })
}
//启用禁用员工
export const startOrBanEmployee = (params) => {
    return axios.request({
      url: '/pwms/user/employee/startOrBanEmployee',
      params: params,
      method: 'post'
    })
}
//修改员工信息
export const updateEmployee = (params) => {
    return axios.request({
      url: '/pwms/user/employee/updateEmployee',
      data: params,
      method: 'post'
    })
}
//工种下拉框
export const queryAllEmployeeKind = (params) => {
  return axios.request({
    url: '/pwms/user/employee/queryEmployeeKind',
    params: params,
    method: 'get'
  })
}
//新增工种
export const addEmployeeKind = (params) => {
  return axios.request({
    url: '/pwms/user/kind/addEmployeeKind',
    params: params,
    method: 'post'
  })
}
//点击编辑获取工种信息
export const editEmployeeKind = (params) => {
  return axios.request({
    url: '/pwms/user/kind/edit',
    params: params,
    method: 'post'
  })
}
//工种编辑保存
export const updateEmployeeKind = (params) => {
  return axios.request({
    url: '/pwms/user/kind/updateEmployeeKind',
    params: params,
    method: 'post'
  })
}
//工种列表
export const queryEmployeeKindList = (params) => {
  return axios.request({
    url: '/pwms/user/kind/queryEmployeeKindList',
    params: params,
    method: 'get'
  })
}
//更新工种状态
export const updateEmployeeKindStatus = (params) => {
  return axios.request({
    url: '/pwms/user/kind/updateEmployeeKindStatus',
    params: params,
    method: 'post'
  })
}
//删除工种
export const deleteEmployeeKind = (params) => {
  return axios.request({
    url: '/pwms/user/kind/deleteEmployeeKind',
    params: params,
    method: 'delete'
  })
}