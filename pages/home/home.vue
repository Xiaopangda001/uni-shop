<template>
  <view>
    <!-- search 组件区域 -->
    <view class="search-box">
    <my-search @click="gotoSearch"></my-search>
    </view>
    <!-- 轮播图的区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,index) in swiperList" :key="index">
        <!-- 给导航组件动态添加跳转路径携带参数 -->
        <navigator :url="'/subpkg/goods_detail/goods_detail?good_id='+item.goods_id" class="swiper-item">
          <!-- 动态绑定图片的 src 属性 -->
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 分类导航的区域 -->
    <view class="nav-list">
      <!-- 点击导航分类要进行 tabbar 的分类跳转 使用小程序的 switchTab 方法-->
      <view class="nav-item" v-for="(item,index) in navList" :key="index" @click="navClickHandler(item)">
        <image :src="item.image_src" class="nav-img"></image>
      </view>
    </view>
    <!-- 楼层的区域 -->
    <view class="floor-list">
      <!-- 楼层的 item 项-->
      <view class="floor-item" v-for="(item,index) in floorList" :key="index">
        <!-- 标题 -->
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <!-- 图片展示区域 -->
        <view class="floor-img-box">
          <!-- 左侧区域 -->
          <navigator :url="item.product_list[0].url" class="left-img-box">
            <image :src="item.product_list[0].image_src" :style="{ width: item.product_list[0].image_width + 'rpx' }"
              mode="widthFix"></image>
          </navigator>
          <!-- 右侧区域 -->
          <view class="right-img-box">
            <!-- item 项  第一项不需要-->
            <navigator :url="product.url" class="right-img-item" v-for="(product,index) in item.product_list"
              :key="index" v-if="index!==0">
              <image :src="product.image_src" :style="{ width: product.image_width + 'rpx' }" mode="widthFix"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 1.1 轮播图的数据列表
        swiperList: [],
        // 2.1 分类导航的数据列表
        navList: [],
        // 3.1 楼层的数据列表
        floorList: []
      };
    },
    // 页面的生命周期
    onLoad() {
      // 1.3 发起请求，获取轮播图的数据
      this.getSwiperList()
      // 2.3 发起请求，获取分类导航的数据
      this.getNavList()
      // 3.3 发起请求，获取楼层的数据
      this.getFloorList()
    },
    methods: {
      // 1.2 获取轮播的方法
      async getSwiperList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/swiperdata')
        // 请求失败
        if (res.meta.status !== 200) return uni.$showMsg()
        // 请求成功
        this.swiperList = res.message
      },
      // 2.2 获取分类导航的方法
      async getNavList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/catitems')
        // 请求失败
        if (res.meta.status !== 200) return uni.$showMsg()
        // 请求成功
        this.navList = res.message
      },
      // nav-item 项被点击时候的事件处理函数
      navClickHandler(item) {
        // 判断点击的是哪个 nav
        if (item.name === '分类') {
          uni.switchTab({
            url: '/pages/cate/cate'
          })
        }
      },
      // 3.2 获取楼层数据的方法
      async getFloorList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/floordata')
        // 请求失败
        if (res.meta.status !== 200) return uni.$showMsg()
        // 请求成功
        // 处理图片跳转的地址
        res.message.forEach(item => {
          item.product_list.forEach(product => {
            product.url = '/subpkg/goods_list/goods_list?' + product.navigator_url.split('?')[1]
          })
        })
        this.floorList = res.message
      },
      gotoSearch(){
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      }
    }
  }
</script>

<style lang="scss">
  .search-box{
    // 设置吸顶的效果
    position: sticky;
    top: 0;
    // 不设置轮播图就会覆盖组件的显示
    z-index: 999;
  }
  swiper {
    height: 330rpx;
  }

  .swiper-item,
  image {
    width: 100%;
    height: 100%;
  }

  .nav-list {
    display: flex;
    justify-content: space-around;
    margin: 15px 0;

    .nav-img {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor-title {
    width: 100%;
    height: 60rpx;
  }

  .floor-img-box {
    display: flex;
    padding-left: 10rpx;

    .right-img-box {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
    }
  }
</style>
