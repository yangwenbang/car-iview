import axios from '@/libs/api.request'

//商品管理
export const uploadImg = (params) => {
  return axios.request({
    url: '/car/qualityshop/uploadPicture',
    data: params,
    method: 'POST'
  })
}
