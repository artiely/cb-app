<template>
  <transition name="page-move">
    <router-view class="cube-view"></router-view>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {}
</script>

<style lang="less" >
.cube-view {
  transform: translate3d(0, 0, 0);
  min-height: 100vh;
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