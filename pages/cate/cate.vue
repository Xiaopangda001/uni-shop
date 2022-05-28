<template>
  <view class="scroll-view-container">
    <!-- 左侧一级分类区域 分别滚动必须添加 :style="{ height: wh + 'px'}" -->
    <scroll-view class="left-scroll-view" scroll-y :style="{ height: wh + 'px'}" :scroll-top="scrollTop">
      <!-- 根据索引动态添加激活的类名 -->
      <view :class="['left-scroll-view-item', active===i1?'active':'']" v-for="(item ,i1) in cateList" :key="i1"
        @click="activeChanged(i1)">{{item.cat_name}}</view>
    </scroll-view>
    <!-- 右侧二三级分类区域 -->
    <scroll-view class="right-scroll-view" scroll-y :style="{ height: wh + 'px'}" :scroll-top="scrollTop">
      <view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
        <!-- 二级分类的标题 -->
        <view class="cate-lv2-title">/{{item2.cat_name}}/</view>
        <!-- 三级分类展示 -->
        <view class="cate-lv3-list">
          <!-- 三级分类的 item 项 -->
          <view class="cate-lv3-item" v-for="(item3,i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
            <!-- 图片区域 -->
            <image :src="item3.cat_icon"></image>
            <!-- 文本区域 -->
            <text>{{item3.cat_name}}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
        wh: 0,
        // 激活的类名
        active: 0,
        // 分类数据列表
        cateList: [],
        // 二级分类列表
        cateLevel2: [],
        // 竖向滚动条位置.每次切换一级分类都要回到顶部
        scrollTop:0
      };
    },
    onLoad() {
      // 获取当前系统的信息
      const sysInfo = uni.getSystemInfoSync()
      // 为 wh 窗口可用高度动态赋值
      this.wh = sysInfo.windowHeight
      // 调用获取分类列表数据的方法
      this.getCateList()
    },
    methods: {
      // 获取分类数据的方法
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories')
        if (res.meta.status !== 200) return uni.$showMsg()
        this.cateList = res.message
        // 默认展示第一个分类的二级分类
        this.cateLevel2 = this.cateList[0].children
      },
      activeChanged(i1) {
        // 根据索引改变激活类名的值
        this.active = i1
        // 获取当前选择分类的二级分类
        this.cateLevel2 = this.cateList[i1].children
        // 滚动条的位是如果不变一直为 0 是不会回到顶部的
        // 使用 0 和 1 进行切换，用户是不会察觉到1px的区别的
        this.scrollTop = this.scrollTop ? 0 : 1
      },
      // 点击三级分类跳转商品列表的方法
      gotoGoodsList(item3){
        uni.navigateTo({url:'/subpkg/goods_list/goods_list?cid=' + item3.cat_id})
      }
    }
  }
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;

    .left-scroll-view {
      width: 200rpx;

      .left-scroll-view-item {
        line-height: 60px;
        background-color: #f7f7f7;
        text-align: center;
        font-size: 12px;

        // 激活的样式
        &.active {
          background-color: #ffffff;
          position: relative;

          // 渲染激活项左侧的红色指示边线
          &::before {
            content: '';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #bf0000;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
          }
        }
      }
    }
  }

  .cate-lv2-title {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }

  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;

    .cate-lv3-item {
      width: 33.33%;
      display: flex;
      margin-bottom: 10px;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      image {
        width: 60px;
        height: 60px;
      }

      text {
        font-size: 12px;
      }
    }
  }
</style>
