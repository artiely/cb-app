<template>
  <div class="v_br" :style="'height:'+height+'px'">
  </div>
</template>

<script>
export default {
  name: 'v-br',
  props: {
    height: {
      type: Number,
      default: 10
    }
  }
}
</script>

<style lang="less">
.v_br {
  width: 100%;
  background: transparent;
}
</style>
