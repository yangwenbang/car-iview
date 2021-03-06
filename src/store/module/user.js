import { carLogin, loginOut } from '@/api/login'
import { setToken, getToken } from '@/libs/util'
import { encrypt, decrypt } from '@/libs/aes'

export default {
    state: {
        token: getToken(),
        access: '',
        hasGetInfo: false
    },
    mutations: {
        setToken(state, token) {
            state.token = token
            setToken(token)
        },
        setHasGetInfo(state, status) {
            state.hasGetInfo = status
        }
    },
    actions: {
        // 登录
        handleLogin({ commit }, { userName, password }) {
            userName = userName.trim();
            password = encrypt(password)
            return new Promise((resolve, reject) => {
                carLogin({
                    userName,
                    password
                }).then(res => {
                    if (res.data.code == "200") {
                        commit('setHasGetInfo', true)
                        resolve(res.data.data)
                    } else {
                        reject(res.data.msg)
                    }
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 退出登录
        handleLogOut({ state, commit }) {
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
        }
    }
}
