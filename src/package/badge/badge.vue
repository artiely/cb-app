<template>
  <div class="c_badge--wrapper" :class="[tagCls,{'small':size=='small'}]" :style="color?'background:'+color:''">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'v-badge',
  props: {
    size: {
      type: String,
      default: ''
    },
    type: {
      type: String
    },
    color: String
  },
  computed: {
    tagCls() {
      return {
        'c_badge--card-tag': this.type || this.type === 'tag',
        'c_badge--card-discount': this.type === '折扣卡',
        'c_badge--card-times': this.type === '次卡',
        'c_badge--card-cb': this.type === '系统库',
        'c_badge--card-first': this.type === '优先',
        'c_badge--card-hot': this.type === '热卖',
        'c_badge--card-store': this.type === '店铺库',
        'c_badge--card-count': this.type === '代金券',
        // 'c_badge--card-coupon': this.type === '优惠券' || this.type === '礼品券',
        'c_badge--card-goods': this.type === '商',
        'c_badge--card-service': this.type === '服',
        'c_badge--card-count-card': this.type === '储值卡',
        'c_badge--card-popup': this.type === '通用券',
        'c_badge--card-popup2': this.type === '礼品券'
      }
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
.c_badge--wrapper {
  display: inline-block;
  padding: 0 8px;
  height: 14px;
  font-size: 10px;
  background: @primary;
  color: #fff;
  line-height: 14px;
  border-radius: 7px;
  vertical-align: middle;
  text-align: center;
  position: relative;
  // box-shadow: 0 0 1px fade(@primary, 50%);
  &.c_badge--card-tag {
    border-radius: 2px;
    padding: 0 4px;
  }
  &.c_badge--card-popup{
    background: #ffdc65;
    background: linear-gradient(to right,#ffb819 ,#ffdc65);
  }
  &.c_badge--card-popup2{
    background: #97e311;
    background: linear-gradient(to right,#97e311 ,#dee611);
  }
  &.c_badge--card-count-card{
    background: #04954D;
    background: linear-gradient(to right,#0DCC6D ,#04954D);
  }
  &.c_badge--card-first{
     background: #d73962;
    background: linear-gradient(to right, #d73962 ,#fe560c);
    border: 1px solid #fff;
  }
  &.c_badge--card-hot{
     background: #d73962;
    background: linear-gradient(to right, #d73962 ,#fe560c);
    border: none;
  }
  &.c_badge--card-goods{
    background: #f6a95f;
  }
  &.c_badge--card-service{
    background: #ff5616;
  }
  &.c_badge--card-discount {
    background: #eb9641;
    background: linear-gradient(to right, #e8a915 ,#ffa381);
    border: 1px solid #fff;
  }
  &.c_badge--card-times {
    background: #efbf1f;
    background: linear-gradient(to right, #ff8870 ,#ff9b18);
    border: 1px solid #fff;
  }
  &.c_badge--card-cb {
    background: #f9d574;
    background: linear-gradient(to right, #ffdd66 ,#ffb718);
  }
  &.c_badge--card-store {
    background: #f9d574;
    background: linear-gradient(to right, #ffdd66 ,#ffb718);
  }
  &.c_badge--card-count {
    background: #fe4a4e;
  }
  &.c_badge--card-coupon {
    background: #01d10c;
  }
  &.small {
    height: 12px;
    line-height: 12px;
    font-size: 8px;
    padding: 0 2px;
  }
  &.danger {
    background: @danger;
    // box-shadow: 0 1px 4px fade(@danger, 50%);
  }
  &.warning {
    background: @warning;
    // box-shadow: 0 1px 4px fade(@warning, 50%);
  }
  &.success {
    background: @success;
    // box-shadow: 0 1px 4px fade(@success, 50%);
  }
}
</style>
