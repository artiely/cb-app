<template>
  <div class="noroleBox">
    <div class="no_role--wrapper" >
      本店铺暂未设置角色
    </div>
  </div>
</template>
<script>
export default {
  name: 'v-norole',
  props: {
    number: {
      type: Number,
      default: 4
    }
  }
}
</script>
<style lang="less" > 
.noroleBox{
  background-color: #F0F0F0;
  position: fixed;
  top: -44px;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.no_role--wrapper {
  text-align: center;
  color: #484848;
  font-size: 18px;
  letter-spacing: 1px;
}
</style>
