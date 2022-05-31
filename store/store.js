// 1. 导入 vue, vuex
import Vue from 'vue'
import Vuex from 'vuex'
//  导入购物车的 vuex 模块
import cart from './cart.js'
import user from './user.js'
// 2. 将 Vuex 安装为 Vue 的插件
Vue.use(Vuex)
// 3. 创建 store 实例
const store = new Vuex.Store({
  modules: { 
    mycart: cart,
    myuser: user
  }
})
// 4. 对外暴露 store 实例
export default store