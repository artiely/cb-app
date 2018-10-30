<template>
  <div class="v-input-group">
    <slot/>
  </div>
</template>
<script>
export default {
  name: 'v-input-group'
}
</script>
<style lang="less">
.v-input-group {
  padding-left: 10px;
  background: #ffffff;
  overflow: hidden;
  border-radius: 10px;
  position: relative;
}
</style>
