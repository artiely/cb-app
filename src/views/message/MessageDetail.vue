<template>
  <div>
    <v-header title="消息"></v-header>
    <v-scroll-page top="44" style="overflow-y:scroll">
      <div class="c-detail">
        <h1 class="c-detail--title" v-if="data.sysMessage&&data.sysMessage.title">{{data.sysMessage.title}}</h1>
        <p class="c-detail--date">{{data.createDate|timeFormat()}}</p>
        <div class="c-detail--content" v-if="data.sysMessage" v-html="data.sysMessage.content">
        </div>
      </div>
    </v-scroll-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: ''
    }
  },
  activated() {
    this.data = this.$route.params.data
  }
}
</script>
<style lang="less">
@import '../../assets/style/var.less';
.c-detail {
  background: #ffffff;
  padding: 15px;
  &--title {
    font-size: 18px;
    font-weight: 700;
    color: #333333;
  }
  &--date {
    font-size: 14px;
    color: @secondary-text;
    line-height: 2;
  }
  &--content {
    font-size: 16px;
    color: @primary-text;
    line-height: 1.5;
    img {
      width: 100%;
    }
  }
}
</style>



