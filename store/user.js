export default {
  namespaced: true,
  state: {
    address: JSON.parse(uni.getStorageSync('address') || '{}')
  },
  mutations: {
    updateAddress(state, address){
      state.address = address
      // 更新到本地存储
      this.commit('myuser/saveAddressToStorage')
    },
    // 本地存储地址信息
    saveAddressToStorage(state){
      uni.setStorageSync('address',JSON.stringify(state.address))
    }
  },
  getters: {
    addstr(state){
      if (!state.address.provinceName) return ''
      // 拼接 省，市，区，详细地址 的字符串并返回给用户
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  }
}