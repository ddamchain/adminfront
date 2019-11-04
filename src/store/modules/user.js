import { login, logout, getInfo, updateAccessLog } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  id: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ID: (state, id) => {
    state.id = id
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ userName: username.trim(), password: password })
        .then(response => {
          const { data } = response
          console.log('login data:' + data)
          commit('SET_TOKEN', data)
          setToken(data)
          resolve()
        })
        .catch(error => {
          console.log('user error ' + error)
          reject(error)
        })
    })
  },

  // get user info'
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      console.log('info token' + state.token)
      getInfo({ token: state.token })
        .then(response => {
          const { data } = response

          if (!data) {
            reject('Verification failed, please Login again.')
          }
          console.log('info ret:' + data)
          const { name, userId } = data
          const avatar2 =
            'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar2)
          commit('SET_ID', userId)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  logs() {
    return new Promise((resolve, reject) => {
      updateAccessLog()
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout({ token: state.token })
        .then(() => {
          commit('SET_TOKEN', '')
          removeToken()
          resetRouter()
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
