<template>
  <view class="my-settle-container">
    <!-- 全选 -->
     <label class="radio" @click="changeAllState" v-if="">
        <radio :checked="isFullChecked" color="#C00000"/><text>全选</text>
      </label>
    <!-- 合计 -->
    <view class="amount-box">
        合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
      </view>
    <!-- 结算按钮 -->
    <view class="btn-settle">结算({{checkedCount}})</view>
  </view>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    name:"my-settle",
    data() {
      return {
        
      };
    },
    computed: {
      ...mapGetters('mycart', ['checkedCount', 'total', 'checkedGoodsAmount']),
      // 全选的选中状态
      isFullChecked(){
        return this.checkedCount === this.total
      }
    },
    methods: {
      ...mapMutations('mycart', ['updateAllGoodsState']),
      // 全选的按钮的取反
      changeAllState(){
        // console.log(this.isFullChecked)
        // 拿到全选的值取反，在给 vuex 的每一个商品的状态值改变
        this.updateAllGoodsState(!this.isFullChecked)
      }
    }
  }
</script>

<style lang="scss">
.my-settle-container{
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
  .radio{
    display: flex;
    align-items: center;
  }
  .amount {
    color: #c00000;
  }
  .btn-settle{
    background-color: #c00000;
    line-height: 50px;
    min-width: 100px;
    text-align: center;
    padding: 0 10px;
  }
}
</style>