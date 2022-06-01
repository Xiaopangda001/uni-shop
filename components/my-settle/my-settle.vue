<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio" @click="changeAllState" v-if="">
      <radio :checked="isFullChecked" color="#C00000" /><text>全选</text>
    </label>
    <!-- 合计 -->
    <view class="amount-box">
      合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
    </view>
    <!-- 结算按钮 -->
    <view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
  </view>
</template>

<script>
  import {
    mapGetters,
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    name: "my-settle",
    data() {
      return {
        // 倒计时的秒数
        seconds: 3,
        // 定义定时器
        timer: null
      };
    },
    computed: {
      ...mapGetters('mycart', ['checkedCount', 'total', 'checkedGoodsAmount']),
      ...mapGetters('myuser', ['addstr']),
      ...mapState('myuser', ['token']),
      ...mapState('mycart', ['cart']),
      // 全选的选中状态
      isFullChecked() {
        return this.checkedCount === this.total
      }
    },
    methods: {
      ...mapMutations('mycart', ['updateAllGoodsState']),
      ...mapMutations('myuser', ['updateRedirectInfo']),
      // 全选的按钮的取反
      changeAllState() {
        // console.log(this.isFullChecked)
        // 拿到全选的值取反，在给 vuex 的每一个商品的状态值改变
        this.updateAllGoodsState(!this.isFullChecked)
      },
      // 结算按钮的点击事件
      settlement() {
        // 1. 先判断是否勾选了要结算的商品
        if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品!')
        // 2. 再判断用户是否选择了收货地址
        if (!this.addstr) return uni.$showMsg('请选择收货地址！')
        // 3. 最后判断用户是否登录了
        // if (!this.token) return uni.$showMsg('请先登录！')
        if (!this.token) return this.delayNavigate()
        // 4. 实现微信支付功能
        this.payOrder()
      },
      // 倒计时跳转登录页面的方法
      delayNavigate() {
        // 每次点击都要把 seconds 重置回 3 秒
        this.seconds = 3
        // 1. 展示提示消息，此时 seconds 的值等于 3
        this.showTip(this.seconds)
        // 2. 创建定时器，每隔 1 秒执行一次
        this.timer = setInterval(() => {
          // 秒数先自减 1
          this.seconds--
          // 判断秒数是否自减到 0，到 0 就停止，不在展示
          if (this.seconds <= 0) {
            // 清除定时器
            clearInterval(this.timer)
            // 跳转到登录页面
            uni.switchTab({
              url: '/pages/my/my',
              // 页面跳转成功之后的回调函数, 保存要重定向页面的信息
              success: () => {
                // 调用方法，把信息保存到 vuex 中
                this.updateRedirectInfo({
                  // 跳转方式
                  openType: 'switchTab',
                  // 跳转前页面的路径
                  from: '/pages/cart/cart'
                })
              }
            })
            // 跳出函数，不在执行后续代码
            return
          }
          // 在此展示提示
          this.showTip(this.seconds)
        }, 1000)
      },
      // 点击登录，显示提示登录倒计时的消息
      showTip(n) {
        // 调用 uni.showToast() 方法，展示提示消息
        uni.showToast({
          // 不展示图标
          icon: 'none',
          // 提示消息内容
          title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
          // 防止触摸穿透
          mask: true,
          // 1.5 秒后自动消失
          duration: 1500
        })
      },
      // 微信支付
      async payOrder() {
        // 1. 创建订单
        // 1.1 整理请求参数 组织订单的信息对象
        const orderInfo = {
          // 开发期间，注释掉真实的订单价格，
          // order_price: this.checkedGoodsAmount,
          // 写死订单总价为 1 分钱
          order_price: 0.01,
          consignee_addr: this.addstr,
          // goods: [{goods_id, goods_number, goods_price}]
          // 先筛选出要结算的商品，在重新定义每个商品的参数字段
          // map 返回的是对象，要用（）包裹起来
          goods: this.cart.filter(item => item.goods_state).map(item => ({
            goods_id: item.goods_id,
            goods_number: item.goods_count,
            goods_price: item.goods_price
          }))
        }
        // 1.2 发起请求创建订单
        const {
          data: res
        } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
        //  1.3 得到服务器响应的“订单编号”
        const orderNumber = res.message.order_number
        // 2. 订单预支付
        // 2.1 发起请求获取订单的支付信息
        const {
          data: res2
        } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {
          order_number: orderNumber
        })
        if (res2.meta.status !== 200) return uni.$showMsg('预付订单生成失败!')
        // 2.3 得到订单支付相关的必要参数
        const payInfo = res2.message.pay
        // 3. 发起微信支付
        // 3.1 调用 uni.requestPayment() 发起微信支付
        const [err, succ] = await uni.requestPayment(payInfo)
        // 3.2 未完成支付
        if (err) return uni.$showMsg('订单未支付！')
        // 3.3 完成了支付，进一步查询支付的结果
        const {
          data: res3
        } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {
          order_number: orderNumber
        })
        // 3.4 检测到订单未支付
        if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
        // 3.5 检测到订单支付完成
        uni.showToast({
          title: '支付完成！',
          icon: 'success'
        })
      }

    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: white;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 5px;
    font-size: 14px;

    .radio {
      display: flex;
      align-items: center;
    }

    .amount {
      color: #c00000;
    }

    .btn-settle {
      background-color: #c00000;
      color: white;
      line-height: 50px;
      min-width: 100px;
      text-align: center;
      padding: 0 10px;
    }
  }
</style>
