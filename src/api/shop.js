import axios from '@/libs/api.request'

//发送短信
export const sendSms = (params) => {
  return axios.request({
      url: '/car/qualityshop/sendSms',
      params: params,
      method: 'get'
  })
}
