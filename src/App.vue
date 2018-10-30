<template>
  <div id="app">
    <!-- <transition :name="transitionName" :mode="$router.isBack?'out-in':'in-out'"> -->
    <!-- <transition :name="transitionName"> -->
      <!-- <transition> -->
      <keep-alive :exclude="['AddGoods','Jiesuan']">
        <router-view class="RouterView" />
      </keep-alive>
    <!-- </transition> -->
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      transitionName: 'slide-left'
    }
  },
  watch: {
    $route: {
      handler(val, oval) {
        let isBack = this.$router.isBack
        if (isBack === true) {
          this.transitionName = 'slide-right'
        } else if (
          val.name === 'Kaidan' ||
          val.name === 'Login' ||
          val.name === 'Jieche' ||
          val.name === 'Shigong' ||
          val.name === 'Service' ||
          val.name === 'Search' ||
          val.name === 'SearchCar' ||
          val.name === 'Index' ||
          val.name === 'Home' ||
          val.name === 'SearchCus') {
          this.transitionName = ''
        } else {
          this.transitionName = 'slide-left'
        }
        this.$router.isBack = false
      }
    }
  }
}
</script>

<style lang="less">
</style>