<template>
  <view class="goods-item">
    <!-- 左侧图片区域 -->
    <view class="goods-item-left">
      <!-- 是否勾选 -->
      <!-- 使用 v-if 指令控制 radio 组件的显示与隐藏 -->
      <!-- 存储在购物车中的商品，包含 goods_state 属性，表示商品的勾选状态 -->
      <radio v-if="showRadio" :checked="goods.goods_state" color="#c00000" @click="radioClickHandler" />
      <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
    </view>
    <!-- 右侧信息区域 -->
    <view class="goods-item-right">
      <!-- 标题 -->
      <view class="goods-name">{{goods.goods_name}}</view>
      <view class="goods-info-box">
        <!-- 价格 -->
        <view class="goods-price">￥{{goods.goods_price | tofixed}}</view>
        <!-- 数量 -->
        <uni-number-box v-if="showNum" :min="1" :value="goods.goods_count" @change="numChangeHandler"></uni-number-box>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "my-goods",
    props: {
      // 商品的信息
      goods: {
        type: Object,
        default: {}
      },
      // 控制勾选项的显示隐藏
      showRadio: {
        type: Boolean,
        default: false
      },
      // 控制商品数量框的显示隐藏
      showNum: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // 没有图片的使用默认图片
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
      };
    },
    filters: {
      // 把数字处理为带两位小数点的数字
      tofixed(num) {
        return Number(num).toFixed(2)
      }
    },
    methods: {
      // 勾选框的点击事件
      radioClickHandler() {
        // 获取当前商品的 id 和 state ，传递给父组件
        this.$emit('radio-change', {
          goods_id: this.goods.goods_id,
          // 商品的状态是要取反的
          goods_state: !this.goods.goods_state
        })
      },
      // 数量框内容改变的事件
      numChangeHandler(value) {
        // 收集当前的数量框的内容 value，传递给父组件
        this.$emit('num-change', {
          goods_id: this.goods.goods_id,
          // value 转化为数字
          goods_count: +value
        })
      }
    }
  }
</script>

<style lang="scss">
  .goods-item {
    // 撑满整个屏幕
    width: 750rpx;
    // 设置盒模型为 border-box
    box-sizing: border-box;
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #efefef;

    .goods-item-left {
      display: flex;
      justify-content: sapce-between;
      align-items: center;
      margin-right: 15px;

      .goods-pic {
        width: 100px;
        height: 100px;

      }
    }

    .goods-item-right {
      display: flex;
      width: 100%;
      flex-direction: column;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
      }

      .goods-info-box {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .goods-price {
          font-size: 16px;
          color: #c00000;
        }
      }

    }
  }
</style>
