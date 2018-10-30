<template>
  <div class="c_tag--wrapper" :class="[{'small':size=='small'}]" :style="color?'color:'+color+';border:1px solid '+color:''">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'v-tag',
  props: {
    size: {
      type: String,
      default: ''
    },
    type: {
      type: String
    },
    color: String
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
.c_tag--wrapper {
  display: inline-block;
  padding: 0 8px;
  height: 14px;
  font-size: 10px;
  background: transparent;
  color: #01d10c;
  line-height: 14px;
  border-radius: 2px;
  vertical-align: middle;
  text-align: center;
  position: relative;
  border: 1px solid #01d10c;
  &.small {
    height: 12px;
    line-height: 12px;
    font-size: 8px;
    padding: 0 2px;
  }
}
</style>
