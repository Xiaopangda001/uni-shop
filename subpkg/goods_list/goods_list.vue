<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 定义请求参数对象
        queryObj: {
          query: '',
          cid: '',
          pagenum: 1,
          pagesize: 10
        },
        // 定义接收商品列表数据的数组
        goodsList: [],
        // 返回数据的总数
        total: 0,
        // 定义节流阀的开关
        isLoading: false
      };
    },
    onLoad(option) {
      // console.log(option)
      this.queryObj.query = option.query || ''
      this.queryObj.cid = option.cid || ''
      // 调用获取商品列表数据的方法
      this.getGoodsList()
    },
    // 页面的上拉触底事件
    onReachBottom(){
      // 判断是否有下一页数据
      if(this.queryObj.pagenum*this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
      // 节流阀是否关闭
      if(this.isLoading){
        return
      }
      // 当前页面值 +1
      this.queryObj.pagenum += 1 
      // 在发起请求
      this.getGoodsList()
    },
    // 页面的下拉刷新
    onPullDownRefresh(){
      // 重置关键数据
      this.queryObj.pagenum = 1
      this.total = 0
      this.goodsList = []
      this.isLoading = false
      // 重新发起请求 手动关闭下拉刷新，自动关闭耗时较长
      this.getGoodsList(() => uni.stopPullDownRefresh())
    },
    methods: {
      async getGoodsList(callback) {
        // 开启节流阀
        this.isLoading = true
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        // 关闭节流阀
        this.isLoading = false
        // 数据请求回来，就执行回调关闭下拉刷新的界面
        callback && callback()
        if (res.meta.status !== 200) return uni.$showMsg()
        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total
      },
      // 点击商品跳转商品详情
      gotoDetail(goods){
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id 
        })
      }
    }
  }
</script>

<style lang="scss">
  .goods-list {
    padding: 0 10px;
  }
</style>
