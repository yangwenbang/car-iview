import axios from '@/libs/api.request'

// 新增、修改帖子
export const saveOrUpdatePost = (params) => {
  return axios.request({
      url: '/car/publishpost/insertOrUpdatePublishPost',
      data: params,
      method: 'post'
  })
}

// 查询帖子列表
export const queryPublishPostList = (params) => {
  return axios.request({
      url: '/car/publishpost/queryPublishPostList',
      params: params,
      method: 'get'
  })
}

// 查询帖子详情
export const queryPublishPostInfo = (params) => {
  return axios.request({
      url: '/car/publishpost/queryPublishPostInfo',
      params: params,
      method: 'get'
  })
}


// 删除帖子
export const deletePublishPost = (params) => {
  return axios.request({
      url: '/car/publishpost/deletePublishPost',
      params: params,
      method: 'delete'
  })
}
