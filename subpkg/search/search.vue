<template>
  <view>
    <view class="search-box">
      <!-- 使用uniapp提供的search组件 -->
      <uni-search-bar @confirm="search" @input="input" :radius="100" cancelButton="none" placeholder="请输入搜索内容">
      </uni-search-bar>
    </view>
    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="kw">
      <view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="forward" size="17"></uni-icons>
      </view>
    </view>
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
      </view>
      <!-- 历史标签区域 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item, i) in historyList" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>
</template>
<script>
  export default {
    data() {
      return {
        // 定时器
        timer: null,
        // 关键词
        kw: '',
        // 搜索结果列表
        searchResults: [],
        // 搜索关键词的历史记录
        historyList: []
      };
    },
    onLoad() {
      // 加载本地存储的历史记录
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    methods: {
      // uniSearchBar 的 value 改变时触发事件，返回参数为uniSearchBar的value
      input(value) {
        // console.log(value)
        // 输入框的防抖功能
        // 清除上一次的定时器
        clearTimeout(this.timer)
        // 在重新开启定时器
        this.timer = setTimeout(() => {
          this.kw = value
          // 发起请求
          this.getSearchList()
          // 关键词要添加到搜索历史中
          this.saveSearchHistory()
        }, 500)
      },
      // 存储关键词的方法
      saveSearchHistory() {
        // 先遍历删除以前相同的，在添加到第一个
        this.historyList = this.historyList.filter(item => item !== this.kw)
        this.historyList.unshift(this.kw)
        // 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
        uni.setStorageSync('kw', JSON.stringify(this.historyList))
      },
      // 根据关键词获取数据的方法
      async getSearchList() {
        // 判断有无关键词
        if (this.kw) {
          const {
            data: res
          } = await uni.$http.get('/api/public/v1/goods/qsearch', {
            query: this.kw
          })
          // console.log(res)
          if (res.meta.status !== 200) return uni.$showMsg()
          this.searchResults = res.message
        } else {
          this.searchResults = []
          // console.log('不发起请求')
        }
      },
      gotoDetail(id) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + id
        })
      },
      // 清空历史记录
      cleanHistory() {
        this.historyList = []
        // 清空本地存储
        uni.setStorageSync('kw', '[]')
      },
      // 点击历史标签跳转商品列表
      gotoGoodsList(kw){
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + kw
        })
      }
    }
  }
</script>

<style lang="scss">
  .search-box {
    // 设置吸顶效果
    position: sticky;
    top: 0;
    z-index: 999;
  }

  .sugg-list {
    padding: 0 10px;

    .sugg-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #efefef;

      .goods-name {
        font-size: 12px;
        margin-right: 5px;
        white-space: nowrap; // 不换行
        overflow: hidden; // 溢出隐藏
        text-overflow: ellipsis; // 溢出内容用 ... 表示
      }
    }
  }

  .history-box {
    padding: 0 8px;

    .history-title {
      height: 40px;
      font-size: 13px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #efefef;
    }

    .history-list {
      display: flex;
      flex-wrap: wrap;

      .uni-tag {
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
</style>
