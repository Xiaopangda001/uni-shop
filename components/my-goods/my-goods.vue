<template>
  <view class="goods-item">
    <!-- 左侧图片区域 -->
    <view class="goods-item-left">
      <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
    </view>
    <!-- 右侧信息区域 -->
    <view class="goods-item-right">
      <!-- 标题 -->
      <view class="goods-name">{{goods.goods_name}}</view>
      <!-- 价格 -->
      <view class="goods-price">￥{{goods.goods_price | tofixed}}</view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "my-goods",
    props: {
      goods: {
        type: Object,
        default: {}
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
    }
  }
</script>

<style lang="scss">
  .goods-item {
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #8b8b8b;

    .goods-item-left {
      margin-right: 15px;

      .goods-pic {
        width: 100px;
        height: 100px;

      }
    }

    .goods-item-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
      }

      .goods-price {
        font-size: 16px;
        color: #c00000;
      }
    }
  }
</style>
