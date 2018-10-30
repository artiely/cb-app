<template>
  <div class="payok">
    <v-header title="短信购买"></v-header>
    <v-scroll-page top="44">
      <div style="padding:20px 40px">
        <div class="payok-top smspayerror">
          <v-icon name="icon-icon-"></v-icon>
          <div>支付失败！</div>
        </div>
        <div class="payok-tip">
          <!-- 微信提供的错误说明：{{}}！ -->
        </div>
        <div style="padding-top:50px">
          <img :src="qrcode" alt="车边妹微信" style="display:block;margin:0 auto">
        </div>
        <p style="font-size:13px;color:#333;text-align:center;padding:10px 0 40px 0;line-height:1.5" v-html="message"></p>
        <div>
          <button class="primary" @click="rePay">重新购买</button>
        </div>
      </div>
    </v-scroll-page>

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
    rePay() {
      this.$router.replace('/buysms')
    },
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
<style lang="less">
@import '../../assets/style/var';
.smspayerror {
  text-align: center;
  .icon {
    color: @warning!important;
    font-size: 54px !important;
  }
}
</style>


