<template>
  <div>
    <div class="no_data--wrapper">
      {{placeholder}}
    </div>
    <div class="rbIconBox" v-if="hasadd==1">
      <v-icon name="icon-caozuozhiyin" color="#999999"></v-icon>
    </div>
  </div>
</template>
<script>
export default {
  name: 'v-nodata',
  props: {
    placeholder: {
      type: String,
      default: '暂无数据'
    },
    hasadd: {
      type: [String, Number],
      default: 0
    }
  }
}
</script>
<style lang="less">
.no_data--wrapper {
  text-align: center;
  // padding-top: 210px;
  color: #666666;
  font-size: 22px;
  font-weight: 500;
  position: absolute;
  bottom: 420px;
  right: 0px;
  left: 0;
}
.rbIconBox {
  position: absolute;
  bottom: 190px;
  right: 35px;
  .icon-caozuozhiyin {
    font-size: 10rem;
  }
}
</style>
