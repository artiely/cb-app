<template>
  <div class="c_card_msg--wrapper">
    <div class="c_card_msg--header clearfix">
      <div class="fl c_card_msg--header--left">
        <v-icon name="icon-naozhong"  v-if="data.sysMessage.type==1"></v-icon>
        <v-icon name="icon-xiaotubiao-35" color="#ffa216" v-else></v-icon>
        <span style="position:relative">
          <span v-if="data.sysMessage.type==1">系统消息</span>
          <span v-else> 普通消息</span>
          <v-dot v-if="data.isRead==0"></v-dot>
        </span>
      </div>
      <div class="fr c_card_msg--header--right">
        {{data.createDate|timeFormat()}}
        <v-icon name="icon-youjiantou1"></v-icon>
      </div>
    </div>
    <div class="c_card_msg--body">
      <div class="c_card_msg--body--content textover2" v-delHtmlTag>
        {{data.sysMessage.content}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'card-msg',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
<style lang="less">
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';
.c_card_msg {
  &--wrapper {
    // height: 100px;
    width: 100%;
    padding: 10px;
    background: #ffffff;
    .borderB(@dividers);
  }
  &--header {
    line-height: 30px;
    &--left {
      font-size: 14px;
      color:@secondary-text;
      font-weight: 500;
      .icon-naozhong {
        color: @primary!important;
      }
    }
    &--right {
      font-size: 14px;
      color: @disable;
      .icon-youjiantou1 {
        vertical-align: 0px;
        color: @disable !important;
      }
    }
  }
  &--body {
    &--content {
      padding-left: 20px;
      padding-right: 10px;
      font-size: 14px;
      color: @primary-text;
      line-height: 1.5;
    }
  }
}
</style>
