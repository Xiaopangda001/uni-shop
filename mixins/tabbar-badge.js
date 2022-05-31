import {
  mapGetters
} from 'vuex'
// 导出一个 mixin 对象
export default {
  computed: {
    ...mapGetters('mycart', ['total'])
  },
  methods: {
    // 设置 tabbar 徽标的方法
    setBadge() {
      uni.setTabBarBadge({
        index: 2, // 购物车tabbar的索引值
        text: this.total + '' // text 属性必须是字符串
      })
    },
    // 当数量为 0 时, 移除徽标
    removeBadge(){
      uni.removeTabBarBadge({
        index: 2
      })
    }
  },
  // 监听数量的改变，实时显示到 tabbar 徽标上
  watch: {
    total(newValue){
      if(newValue){
        // 数量不为 0
        this.setBadge()
      }else{
        // 数量为 0
        this.removeBadge()
      }   
    }
  },
  onShow() {
    // 展示的时候调用方法
    if(this.total){
      // 数量不为 0 才展示
      this.setBadge()
    }
  }
}
