<template>
  <div class="v_title--popup">
    <div class="v_title--popup-top">
    <slot name="left">
    <div class="v_title--popup--icon" >
      <v-icon name="icon-zuojiantou" class="v_title--popup--cancel" @click.native="close" v-if="back"></v-icon>
    </div>
    </slot>
    <div class="v_title--popup--title">{{title}}</div>
     <div class="v_title--popup--icon">
      <v-icon name="icon-shanchu1" class="v_title--popup--cancel" @click.native="close"></v-icon>
    </div>
    </div>
    <div class="v_title--popup--desc">{{desc}}</div>
   
  </div>
</template>

<script>
export default {
  name: 'v-popup-title',
  props: {
    title: {
      type: String,
      default: ''
    },
    desc: String,
    back: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close(event) {
      this.$emit('close', event)
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';
.v_title--popup {
  position: absolute;
  top: 0;
  left:0;
  z-index: 999;
  width: 100%;
  height: 70px;
  background: #fff;
  position: relative;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  overflow: hidden;
  .borderB();
  .v_title--popup-top{
    display: flex;
  }
  .v_title--popup--desc {
    font-size: 12px;
    color: #999;
    text-align: center;
    padding-bottom: 10px;
  }
  .v_title--popup--icon {
    height: 40px;
    width: 40px;
    line-height: 40px;
    text-align: center;
  }
  .v_title--popup--title {
    flex: 1;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    height: 40px;
    line-height: 50px;
    overflow: hidden;
  }
}
</style>
