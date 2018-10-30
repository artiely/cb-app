<template>
  <div class="c_scroll-page" :style="{top:topPx,bottom:bottomPx}">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'v-scroll-page',
  props: {
    top: {
      type: [String, Number],
      default: 94
    },
    bottom: {
      type: [String, Number],
      default: 0
    }
  },
  computed: {
    topPx() {
      return this.top + 'px'
    },
    bottomPx() {
      return this.bottom + 'px'
    }
  }
}
</script>

<style>
.c_scroll-page {
  position: fixed;
  width: 100%;
  /* height: 100%; */
  background: #e8e8e8;
}
</style>
