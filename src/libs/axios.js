import axios from 'axios'
import router from '@/router'
import { setToken } from '@/libs/util'
axios.defaults.withCredentials = true;
class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      timeout: 15000, // 请求超时时间
      headers: {
        //
      }
    }
    return config
  }
  interceptors (instance, url) {
    instance.interceptors.response.use(res => {
      if(res.data.code == "600"){
        setToken("");
        alert("登录过期！");
        setTimeout(() => {
          router.replace({
            name: 'login'
          })
        }, 1000);
      }else if(res.data.code == "401"){
        router.replace({
          path: '/error_401',
          query: {
            status: 401
          }
        })
      }else{
        const { data, status } = res
        return { data, status }
      }

    }, error => {
      if (error.response) {
        switch (error.response.status) {
          case 500:
            router.replace({
              path: '/error_500',
              query: {
                status: 500
              }
            })
            break
          case 502:
            router.replace({
              path: '/error_500',
              query: {
                status: 502
              }
            })
            break
          case 504:
            router.replace({
              path: '/error_500',
              query: {
                status: 504
              }
            })
            break
          case 404:
            router.replace({
              path: '/error_404',
              query: {
                status: 404
              }
            })
            break
          case 401:
            router.replace({
              path: '/error_401',
              query: {
                status: 401
              }
            })
            //window.location = 'http://bone.banksteel.com/bone/login/toLogin'
            break
        }
      }
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
