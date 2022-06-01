export default {
  namespaced: true,
  state: {
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
    // 登录成功之后的 token 字符串
    token: uni.getStorageSync('token') || '',
    // 用户信息
    userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
    // 在跳转登录之后在回到之前的页面，重定向的 object 对象 { openType, from }
    redirectInfo: null
  },
  mutations: {
    updateAddress(state, address) {
      state.address = address
      // 更新到本地存储
      this.commit('myuser/saveAddressToStorage')
    },
    // 本地持久化存储地址信息
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    },
    // 更新用户的信息
    updateUserInfo(state, userinfo) {
      state.userinfo = userinfo
      // 更新到本地存储
      this.commit('myuser/saveUserInfoToStorage')
    },
    // 本地持久化存储用户信息
    saveUserInfoToStorage(state) {
      uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
    },
    // 更新字符串 tokrn
    updateToken(state, token) {
      state.token = token
      // 更新到本地存储
      this.commit('myuser/saveTokenToStorage')
    },
    // 本地持久化存储token
    saveTokenToStorage(state) {
      uni.setStorageSync('token', state.token)
    },
    // 更新重定向页面的方法
    updateRedirectInfo(state,info){
      state.redirectInfo = info
    }
  },
  getters: {
    addstr(state) {
      if (!state.address.provinceName) return ''
      // 拼接 省，市，区，详细地址 的字符串并返回给用户
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  }
}
