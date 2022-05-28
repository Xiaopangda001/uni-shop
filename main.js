
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import { $http } from '@escook/request-miniprogram' 

// 把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http
// 配置请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'
// 设置请求拦截器
$http.beforeRequest = function(options){
  // 开启loading效果
  uni.showLoading({
      title: '数据加载中...',
    })
}
// 设置响应拦截器
$http.afterRequest = function(options){
  // 关闭lodaing效果
  uni.hideLoading()
}
// 封装一个请求失败的提示消息的方法
uni.$showMsg = function(){
  uni.showToast({
    title: '数据加载失败！',
    duration: 1500,
    icon: 'none'
  })
}
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif