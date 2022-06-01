<template>
  <view class="my-container">
    <!-- 登录组件 -->
    <my-login v-if="!token"></my-login>
    <!-- 用户信息组件 -->
    <my-userinfo v-else></my-userinfo>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  import { mapState } from 'vuex'
  export default {
    mixins: [ badgeMix ],
    data() {
      return {
        
      };
    },
    computed: {
      ...mapState('myuser',['token'])
    }
  }
</script>

<style lang="scss">
  // 把整个页面撑满
page,.my-container{
  height: 100%;
}
</style>
