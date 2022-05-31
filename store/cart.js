export default {
  // 开启命名空间
  namespaced: true,
  state: {
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    // 从本地存储取值
    cart: JSON.parse(uni.getStorageSync('cart') || '[]'),
  },
  mutations: {
    // 加入购物车的方法
    addToCart(state, goods) {
      // 先在之前的购物车列表找有没有。没有就添加进数组，有就对数量直接加1
      const goodsResult = state.cart.find(item => item.goods_id === goods.goods_id)
      if (goodsResult) {
        // 原数组中有该商品，数量加1
        goodsResult.goods_count++
      } else {
        // 原数组中没有，就将该商品添加到数组
        state.cart.push(goods)
      }
      // 通过 commit 方法，调用 mycart 命名空间下的 saveToStorage 方法
      // console.log(this) this 指向的是大仓库 Store
      this.commit('mycart/saveToStorage')
    },
    // 持久化存储购物车的数据
    saveToStorage(state) {
      // 调用 uni.setStorageSync 方法
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 更新商品的选中状态
    updateGoodsState(state, goods) {
      // 根据 id 找到对应的商品
      const goodsResult = state.cart.find(item => item.goods_id === goods.goods_id)
      // 找到了对应的商品
      if (goodsResult) {
        // 更新 state
        goodsResult.goods_state = goods.goods_state
        // 更新本地存储的状态
        this.commit('mycart/saveToStorage')
      }
    },
    // 更新商品的数量
    updateGoodsCount(state, goods) {
      // 根据 id 找到对应的商品
      const goodsResult = state.cart.find(item => item.goods_id === goods.goods_id)
      // 找到了对应的商品
      if (goodsResult) {
        // 更新 state 中的数据
        goodsResult.goods_count = goods.goods_count
        // 更新本地存储数据
        this.commit('mycart/saveToStorage')
      }
    },
    // 删除购物车的商品
    removeGoodsById(state, goods_id) {
      // 使用数组的 filter 方法删选数组
      state.cart = state.cart.filter(goods => goods.goods_id !== goods_id)
      // 更新本地存储数据
      this.commit('mycart/saveToStorage')
    },
    // 全选按钮改变每一个商品的选中状态
    updateAllGoodsState(state, newState) {
      state.cart.forEach(item => item.goods_state = newState)
      // 更新本地存储数据
      this.commit('mycart/saveToStorage')
    }
  },
  getters: {
    // 定义一个商品总数量的值
    total: (state) => {
      /* const sum = 0
      state.cart.forEach(item => sum += item.goods_count)
      return sum */
      return state.cart.reduce((sum, item) => sum += item.goods_count, 0)
    },
    // 勾选商品的总数量
    checkedCount: (state) => {
      return state.cart.filter(item => item.goods_state).reduce((sum, item) => sum += item.goods_count, 0)
    },
    // 选中商品的总价格
    checkedGoodsAmount: (state) => {
      return state.cart.filter(item => item.goods_state).reduce((sum, item) => sum += item.goods_count * item
        .goods_price, 0).toFixed(2)
    }
  }
}
