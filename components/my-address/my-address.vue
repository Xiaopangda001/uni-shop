<template>
  <view>
    <!-- 选择收货地址的盒子 -->
    <view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
      <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
    </view>
    <!-- 渲染收货信息的盒子 chooseAddress 重新选择收货地址-->
    <view class="address-info-box" v-else @click="chooseAddress">
      <view class="row1">
        <view class="row1-left">
          <view class="username">收货人：<text>{{address.userName}}</text></view>
        </view>
        <view class="row1-right">
          <view class="phone">电话：<text>{{address.telNumber}}</text></view>
          <uni-icons type="arrowright" size="16"></uni-icons>
        </view>
      </view>
      <view class="row2">
        <view class="row2-left">收货地址：</view>
        <view class="row2-right">{{addstr}}</view>
      </view>
    </view>
    <!-- 底部的边框线 -->
    <image src="/static/cart_border@2x.png" class="address-border"></image>
  </view>
</template>

<script>
  import { mapMutations, mapState, mapGetters } from 'vuex'
  export default {
    name: "my-address",
    data() {
      return {
        // address: {}
      };
    },
    computed: {
      ...mapState('myuser',['address']),
      // 收货详细地址的计算属性
      ...mapGetters('myuser',['addstr'])
    },
    methods: {
      ...mapMutations('myuser',['updateAddress']),
      // 选择收货地址的事件
      async chooseAddress(){
        // wx.chooseAddress(Object object) 方法获取用户的地址信息
        // 返回值是一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
        const [err, succ] = await uni.chooseAddress()
        // console.log(result)
        console.log(succ)
        // 用户成功的选择了收货地址
        if(err===null && succ.errMsg==='chooseAddress:ok'){
          // this.address = succ
          // 把地址保存到 vuex
          this.updateAddress(succ)
        }
      }
    }
  }
</script>

<style lang="scss">
  .address-choose-box {
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .address-info-box {
    font-size: 12px;
    height: 90px;
    padding: 0 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .row1 {
      display: flex;
      justify-content: space-between;

      .row1-right {
        display: flex;
        justify-content: space-between;
        .phone {
          margin-right: 5px;
        }
      }
    }

    .row2 {
      display: flex;
      align-items: center;
      margin-top: 10px;
      .row2-left {
        white-space: nowrap;
      }
    }
  }

  .address-border {
    display: block;
    height: 5px;
    width: 100%;
  }
</style>
