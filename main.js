// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import {
  $http
} from '@escook/request-miniprogram'
import store from '@/store/store.js'

// 把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http
// 配置请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'
// 设置请求拦截器
$http.beforeRequest = function(options) {
  // 开启loading效果
  uni.showLoading({
    title: '数据加载中...',
  })
  // 判断请求的是否为有权限的 API 接口
  if (options.url.indexOf('/my/') !== -1) {
    // 需要权限
    // 为请求头添加身份认证字段
    options.header = {
      // 字段的值可以直接从 vuex 中进行获取
      Authorization: store.state.myuser.token,
    }
  }
}
// 设置响应拦截器
$http.afterRequest = function(options) {
  // 关闭lodaing效果
  uni.hideLoading()
}
// 封装一个请求失败的提示消息的方法
uni.$showMsg = function(title = '数据加载失败！') {
  uni.showToast({
    title,
    duration: 1500,
    icon: 'none'
  })
}
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
  // 将 store 挂载到 Vue 实例上
  store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
