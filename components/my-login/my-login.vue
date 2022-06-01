<template>
  <view class="login-container">
    <!-- 提示登录的图标 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- 登录按钮 -->
    <button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
    <!-- 登录提示 -->
    <view class="tips-text">登录后尽享更多权益</view>
  </view>
</template>

<script>
  import {
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    name: "my-login",
    data() {
      return {

      };
    },
    computed: {
      ...mapState('myuser',['redirectInfo'])
    },
    methods: {
      ...mapMutations('myuser', ['updateUserInfo','updateRedirectInfo']),
      // 获取用户信息的回调
      async getUserProfile() {
        const [err, succ] = await uni.getUserProfile({
          desc: '登录', // 必须要有该字段，声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        }).catch(err => err)
        // console.log(err,succ)  null , succ
        // 取消授权
        if (err && err.errMsg === 'getUserProfile:fail auth deny') return uni.$showMsg('您取消了授权！')
        // 授权成功
        // 储存用户的基本信息
        this.updateUserInfo(succ.userInfo)
        // 获取的token的方法
        this.getToken(succ)
      },
      // 获取token
      async getToken(info) {
        // console.log(info)
        //  调用微信登录接口
        //const res = await uni.login()  // res 是一个数组，[null, {返回的数据}]
        const [err, succ] = await uni.login().catch(err => err)
        // console.log(err,succ)
        // 判断是否 uni.login() 调用失败
        if (err || succ.errMsg !== 'login:ok') return uni.$showMsg('登陆失败！')
        // 调用成功 返回有code,整理参数，发送请求获取 token

        // 准备参数对象
        const query = {
          code: succ.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
        // 换取 token
        const {
          data: loginResult
        } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        // console.log(loginResult)
        if (loginResult.meta.status !== 200) return uni.$showMsg('登陆失败！')
        uni.$showMsg('登录成功！')
        // 跳转回之前的页面
        this.navigateBack()
      },
      // 跳转回之前页面的方法
      navigateBack(){
        // 先判断重定向的数据 redirectInfo 是否为空，为空就不需要跳转
        if(this.redirectInfo && this.redirectInfo.openType === 'switchTab'){
          // 调用小程序提供的 uni.switchTab() API 进行页面的导航
          uni.switchTab({
            url: this.redirectInfo.from,
            // 跳转成功后重置 redirectInfo 为空
            complete: () => {
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .login-container {
    // 登录盒子的样式
    height: 750rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f8f8f8;
    position: relative;
    overflow: hidden;

    // 绘制登录盒子底部的半椭圆造型
    &::after {
      content: ' ';
      display: block;
      height: 40px;
      width: 100%;
      background-color: white;
      position: absolute;
      bottom: 0;
      left: 0;
      transform: translateY(50%);
      border-radius: 100%;
    }

    // 登录按钮的样式
    .btn-login {
      width: 80%;
      background-color: #11acff;
      border-radius: 100px;
      margin: 15px 0;
    }

    // 按钮下方提示消息的样式
    .tips-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>
