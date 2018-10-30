<template>
  <div class="cb-cell-group" :class="{'cb-cell-group-border':border}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'v-cell-group',
  props: {
    border: {
      type: Boolean,
      default: true
    }
  }
}
</script>
<style lang="less">
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';
.cb-cell-group {
  margin-bottom: 20px;
  background: #fff;
  overflow: hidden;
}
.cb-cell-group-border {
  .borderTB()
}
</style>
