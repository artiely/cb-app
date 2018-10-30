<template>
  <div class="cartcontrol">
      <div class="cart-decrease" v-show="goods.count>0" @click="decreaseCart">
        <span class="inner icon-remove_circle_outline cart-icon">
          -
        </span>
      </div>
    <div class="cart-count" v-show="goods.count>0">{{goods.count}}</div>
    <div class="cart-add icon-add_circle cart-icon" :class="{'cart-icon--active':goods.count>0}" @click="addCart">
      +
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    goods: {
      type: Object
    },
    maxCount: {
      type: [Number, String]
    }
  },
  methods: {
    addCart(event) {
      if (this.goods.count >= this.maxCount) {
      } else {
        this.$emit('add', event.target)
      }
    },
    decreaseCart(event) {
      this.$emit('cut', event.target)
    }
  }
}
</script>

<style lang="less" >
@import '../../../assets/style/var';
.cartcontrol {
  display:flex;
  border-radius: 2px;
  overflow: hidden;
  border: 1px solid @primary;
  .cart-icon{
    display: block;
    height: 20px;
    width: 20px;
    background: @primary;
    color:#fff;
    line-height: 20px;
    text-align: center;
  }
  // .cart-decrease {
  //   // display: inline-block;
  //   // padding: 6px;
  //   // opacity: 1;
  //   // transform: translate3d(0, 0, 0);
  //   // .inner {
  //   //   display: inline-block;
  //   //   line-height: 24px;
  //   //   font-size: 24px;
  //   //   transition: all 0.4s linear;
  //   //   transform: rotate(0);
  //   // }
  //   // &.move-enter-active,
  //   // &.move-leave-active {
  //   //   transition: all 0.4s linear;
  //   // }
  //   // &.move-enter,
  //   // &.move-leave-active {
  //   //   opacity: 0;
  //   //   transform: translate3d(24px, 0, 0);
  //   //   .inner {
  //   //     transform: rotate(180deg);
  //   //   }
  //   // }
  // }
  .cart-count {
    padding: 0 6px;
    line-height: 20px;
    min-width: 30px;
    text-align: center;
    flex: 1
  }
}
</style>