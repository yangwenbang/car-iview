import axios from '@/libs/api.request';


export const queryRoleList = (params) => {
  return axios.request({
    url: '/pwms/user/role/queryRoleList',
    params: params,
    method: 'get'
  })
}
//修改用户角色信息
export const updateRole = (params) => {
    return axios.request({
      url: '/pwms/user/role/updateRole',
      data: params,
      method: 'put'
    })
}
//保存用户角色信息（新增角色）
export const saveRole = (params) => {
    return axios.request({
      url: '/pwms/user/role/saveRole',
      data: params,
      method: 'post'
    })
}
//查看用户角色信息
export const queryRole = (params) => {
    return axios.request({
      url: '/pwms/user/role/queryRole',
      params: params,
      method: 'get'
    })
}
//删除用户角色信息
export const deleteRole = (params) => {
    return axios.request({
      url: '/pwms/user/role/deleteRole',
      data: params,
      method: 'post'
    })
}
//启用禁用信息
export const enableOrDisabledUserRole = (params) => {
  return axios.request({
    url: '/pwms/user/role/enableOrDisabledUserRole',
    params: params,
    method: 'get'
  })
}


export const queryRightList=(params)=>{
  return axios.request({
    url:'pwms/user/right/queryRightList',
    parmas:params,
    method:'get'
  })
}

