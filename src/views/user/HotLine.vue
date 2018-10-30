<template >
  <div class="hotline">
    <v-header title="客服"></v-header>
    <div class="c-scroll-wrapper-top">
      <div style="padding-top:50px">
        <img :src="qrcode" alt="车边妹微信" style="display:block;margin:0 auto">
      </div>
      <p class="help-text--hotline" v-html="message"></p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      qrcode: '',
      message: ''
    }
  },
  methods: {
    async getCode() {
      let res = await this.$api.QRCODE_SERVICE()
      if (res.status === 1) {
        this.qrcode = res.data
        this.message = res.message
      }
    }
  },
  activated() {
    this.getCode()
  }
}
</script>

<style lang="less" >
@import '../../assets/style/var.less';
.hotline {
  background: #fff;
}
.forget-password {
  text-align: right;
  font-size: 14px;
  padding: 15px;
  color: @primary;
}
.help-text--hotline {
  font-size: 16px;
  padding: 20px 0;
  line-height: 1.5;
  text-align: center;
  color: #666;
}

</style>
