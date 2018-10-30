<template>
  <div class="c_fad-button">
    <v-icon name="icon-plus-add" color="#fff"></v-icon>
  </div>
</template>

<script>
export default {
  name: 'v-fad-button'
}
</script>

<style lang="less">
@import '../../assets/style/var';
.c_fad-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: @primary;
  position: fixed;
  bottom: 60px;
  right: 20px;
  z-index: 99;
  line-height: 50px;
  text-align: center;
  // box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
  .icon {
    font-size: 25px;
  }
}
</style>
