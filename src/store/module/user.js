import { pwmsLogin, getWarehouse,getPlatform,loginOut } from '@/api/login'
import { setToken, getToken,setCookie,getCookie } from '@/libs/util'

export default {
  state: {
    userName: '',
    warehouse: {},
    token: getToken(),
    //token: '{"warehouse":{"warehouseId":1,"warehouseName":"上海城南库"}}',
    access: '',
    hasGetInfo: false,
    employeeId:getCookie("roleId")
  },
  mutations: {
    setWarehouse (state, warehouse) {
      state.warehouse = warehouse
    },
    setUserName (state, name) {
      state.userName = name
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setEmployeeId (state, id) {
      state.employeeId = id;
      setCookie("roleId",id)
    },
  },
  actions: {
    // 登录
    handleLogin ({ commit }, {userName, password,type}) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        pwmsLogin({
          userName,
          password,
          type
        }).then(res => {
          if(res.data.code == "200"){
            commit('setUserName', userName)
            commit('setHasGetInfo', true)
            resolve(res.data.data)
          }else{
            reject(res.data.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          loginOut().then(res => {
            commit('setToken', "")
            resolve()
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 获取用户仓库相关信息
    getWarehouse ({ commit },{userName, password}) {
      return new Promise((resolve, reject) => {
        try {
          getWarehouse({userName, password}).then(res => {
            const data = res.data
            commit('setUserName', userName)
            commit('setWarehouse', data)
            commit('setHasGetInfo', true)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 获取平台类型
    getPlatform ({ commit }) {
      return new Promise((resolve, reject) => {
        try {
          getPlatform().then(res => {
            const data = res.data&&res.data.data ? res.data.data : ""
            commit('setEmployeeId', data)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
