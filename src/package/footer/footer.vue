<template>
  <div class="c_footer--fixed--wrapper" :class="{'c_footer--fixed--no':noFixed,'c_footer--shadow': !noShadow}">
      <slot>
    </slot>
    </div>
</template>

<script>
export default {
  name: 'v-footer',
  props: {
    noFixed: {
      type: Boolean,
      default: false
    },
    noShadow: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';
@import '../../assets/style/tools.less';
.c_footer--fixed--wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 49px;
  line-height: 49px;
  text-align: center;
  display: flex;
  background: #ffffff;
  z-index: 99;
  border-top:1px solid #ddd;
  &.c_footer--fixed--no {
    position: relative;
  }
 
  .c_footer--fixed--item {
    flex: 1;
    background: #1590ff;
    text-align: center;
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
    .borderL(@dividers);
    &.lighten {
      background: lighten(#1590ff, 20%);
    }
    &.darken {
      background: darken(#1590ff, 20%);
    }
    &.light-btn {
      background: #ffffff;
      color: #333333;
      .borderL(@dividers);
    }
    &.yellow-btn {
      background: @warning;
      color: #fff;
    }
    &.success-btn{
      background: @success;
      color: #fff;
    }
    &.footer-disable {
      background-color: #c7c7c7!important;
      color: #ffffff!important;
      .borderL(#fff)!important;
    }
    &.footer-white {
      background-color: #fff;
      color: #333;
    }
    .c_footer--relative {
      position: relative;
      >div{
        font-weight: 600;
      }
    }
    &.footer-price{
      background:#fff!important;
      color:@success!important;
      flex:2;
      text-align:left;
      padding-left:15px;
      font-weight: 600;
      font-size: 20px;
      >.c_footer--relative{
        font-weight: 600;
      }
      .footer-price-top{
        height:30px;line-height:30px;
        font-weight: 600;
      }
      .footer-price-bottom{
        color: #333;
        height:20px;line-height:1.2;font-size:10px;
        font-weight: normal;
        .textover1;
      }
    }
  }
}
</style>
