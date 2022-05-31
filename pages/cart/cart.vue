<template>
  <view class="cart-container" v-if="cart.length !== 0">
    <!-- 收货地址组件 -->
    <my-address></my-address>
    <!-- 标题区域 -->
    <view class="cart-title">
      <!-- 图标 -->
      <uni-icons type="shop-filled" size="18"></uni-icons>
      <!-- 描述文本 -->
      <view class="cart-title-text">购物车</view>
    </view>
    <!-- 商品列表区域 -->
    <!-- uni-swipe-action 是最外层包裹性质的容器 -->
    <uni-swipe-action>
      <!-- 商品信息区域 使用block标签，不会实际渲染该标签，与template作用相似-->
      <block v-for="(goods, i) in cart" :key="i">
        <!-- 滑动删除组件 -->
        <!-- uni-swipe-action-item 可以为其子节点提供滑动操作的效果。需要通过 options 属性来指定操作按钮的配置信息 -->
        <uni-swipe-action-item :right-options="options" @click="onClick(goods)">
          <!-- 在 radioChangeHandler 事件处理函数中，通过事件对象 e，得到商品的 goods_id 和 goods_state -->
          <my-goods :showRadio="true" :showNum="true" :goods="goods" @radio-change="radioChangeHandler"
            @num-change="numberChangeHandler"></my-goods>
        </uni-swipe-action-item>
      </block>
    </uni-swipe-action>
    <!-- 结算组件 -->
    <my-settle></my-settle>
  </view>

  <!-- 空白购物车区域 -->
  <view class="empty-cart" v-else>
    <image src="/static/cart_empty@2x.png" class="empty-img"></image>
    <text class="tip-text">空空如也~</text>
  </view>
</template>

<script>
  // 导入自己封装的 mixin 模块
  import badgeMix from '@/mixins/tabbar-badge.js'
  // 从 vuex 中导入数据
  import {
    mapState,
    mapMutations
  } from 'vuex'
  export default {
    // 将 badgeMix 混入到当前的页面中进行使用
    mixins: [badgeMix],
    computed: {
      ...mapState('mycart', ['cart'])
    },
    data() {
      return {
        options: [{
          text: '删除',
          style: {
            backgroundColor: '#c00000'
          }
        }]
      };
    },
    methods: {
      ...mapMutations('mycart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
      // 点击勾选的自定义事件处理
      radioChangeHandler(e) {
        // 得到当前 goods 的 id, state 
        // console.log(e)
        // 根据 id 在 vuex 中找到对应的商品，修改 state
        // 调用 mycart 的方法
        this.updateGoodsState(e)
      },
      // 改变数量的自定义事件
      numberChangeHandler(e) {
        // console.log(e) e 是最新的数量值 count 和 id ，修改 vuex 的数据
        this.updateGoodsCount(e)
      },
      // 滑动删除的事件
      onClick(goods) {
        // console.log(goods)
        this.removeGoodsById(goods.goods_id)
      }
    }
  }
</script>

<style lang="scss">
  .cart-title {
    display: flex;
    padding: 10px;
    font-size: 14px;
    border-bottom: 1px solid #efefef;

    .cart-title-text {
      margin-left: 10px;
    }
  }

  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;

    .empty-img {
      width: 90px;
      height: 90px;
    }

    .tip-text{
      font-size: 12px;
      color: gray;
      margin-top: 15px;
    }
  }
</style>
