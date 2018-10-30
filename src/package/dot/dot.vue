<template>
  <div class="c_dot--wrapper" v-if="number!==0">
    <div class="c_dot--item" v-if="number!==0" >
      <span v-if="number<1000">{{number}}</span>
      <span v-else>999+</span>
    </div>
    <div v-else class="c_dot--item c_dot--small" ></div>
  </div>
</template>

<script>
export default {
  name: 'v-dot',
  props: {
    number: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
.c_dot--wrapper {
  display: inline-block;
  .c_dot--item {
    position: absolute;
    top: -8px;
    right: -8px;
    height: 20px;
    min-width: 20px;
    border-radius: 10px;
    padding: 0 4px;
    color: #fff;
    text-align: center;
    font-size: 14px;
    line-height: 20px;
    background: @danger;
    // box-shadow: 0 1px 4px fade(@danger, 50%);
    transform: scale(0.8);
    &.c_dot--small {
      width: 9px;
      min-width: 9px;
      height: 9px;
      top: -4px;
      right: -4px;
    }
  }
}
</style>
