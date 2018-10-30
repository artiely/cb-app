<template>
  <div class="c_card--user">
    <div class="c_card--user--icon">
      <div class="c_card--nick--icon">
        <span v-if="data&&data.name">{{data.name.split('')[0]}}</span>
      </div>
    </div>
    <div class="c_card--user--info">
      <div class="c_card--info--name textover1">
        <span v-if="data&&data.name">{{data.name}}</span>
        <span v-else class="disabled">无客户名</span>
        <v-badge v-if="data.memberTag">{{data.memberTag.name}}</v-badge>
      </div>
      <div class="c_card--info--tel">
        <span v-if="data&&data.username">{{data.username|telFormat}}</span>
        <span v-else class="disabled">无手机号 </span>
      </div>
    </div>
    <div class="c_card--user--link" v-if="link" @click="toCustomDetail(data.id)">
      <v-icon v-if="data" name="icon-youjiantou1" color="#f8f8f8"></v-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: 'v-user-card',
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    link: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toCustomDetail(id) {
      if (this.link) {
        this.$router.push({ name: 'CustomDetail', query: { id: id } })
      }
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
.c_card--user {
  height: 60px;
  width: 100%;
  background: @app;
  position: relative;
  .c_card--user--link {
    width: 30px;
    height: 60px;
    padding-top: 10px;
    float: right;
    text-align: center;
  }
  .c_card--user--icon {
    width: 60px;
    height: 60px;
    float: left;
    .c_card--nick--icon {
      height: 40px;
      width: 40px;
      margin-top: 8px;
      margin-right: 10px;
      background: #f8f8f8;
      color: #dddddd;
      font-size: 40px;
      border-radius: 50%;
      line-height: 40px;
      text-align: center;
      float: right;
      overflow: hidden;
    }
  }
  .c_card--user--info {
    width: 100%;
    float: left;
    padding: 8px 30px 0 60px;
    margin-left: -60px;
    margin-right: -30px;
    text-align: left;
    .c_card--info--name {
      font-size: 18px;
      color: #ffffff;
      height: 18px;
    }
    .c_card--info--tel {
      font-size: 16px;
      color: #dddddd;
      line-height: 32px;
    }
    span {
      font-weight: 600;
    }
    .disabled {
      color: @disable;
    }
  }
}
</style>
