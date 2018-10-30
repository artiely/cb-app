<template>
  <transition name="page-move" class="v-view">
    <slot name="content"></slot>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'v-page'
}
</script>

<style lang="less">
.v-view {
  transform: translate3d(0, 0, 0);
}
.page-move-enter,
.page-move-leave-active {
  transform: translate3d(100%, 0, 0);
}
.page-move-enter-active,
.page-move-leave-active {
  transition: transform 0.3s;
}
</style>