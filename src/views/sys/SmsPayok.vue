<template>
  <div class="payok">
    <v-header title="短信购买" :left-click="handleLeft"></v-header>
    <v-scroll-page top="44">
      <div style="padding:20px 30px">
        <div class="payok-top payok-sms" style="text-align:center">
          <v-icon name="icon-queding1"></v-icon> 
          <div>支付成功</div>
        </div>
        <!-- <div class="payok-tip">
          恭喜您成功购买！
        </div> -->
        <!-- <div class="payok-result">企业号：
          <span v-if="data.company" class="payok-result-value">{{data.company.code}}</span>
        </div>
        <div class="payok-result">登录手机号：
          <span v-if="data.company" class="payok-result-value">{{data.company.ownerEmployee.username |telFormat()}}</span>
        </div>
        <div class="payok-result">初始密码：
          <span class="payok-result-value">手机号后6位</span> <span style="font-size:14px;">(请及时更改)</span>
          </div> -->
        <div style="padding-top:50px">
          <img :src="qrcode" alt="车边妹微信" style="display:block;margin:0 auto">
        </div>
        <div style="font-size:13px;color:#333;text-align:center;padding:10px 0 40px 0;line-height:1.5" v-html="message">
          <!-- <p >扫一扫,骚扰客服妹子!</p>
        <p >微信号：chebianmei (车边妹)</p> -->
        </div>
        
        <div>
          <button class="primary" @click="tologin">确定</button>
        </div>
      </div>
    </v-scroll-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {},
      qrcode: '',
      message: ''
    }
  },
  methods: {
    handleLeft() {
      this.$router.replace('/login')
    },
    tologin() {
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
.payok-sms{
  .icon{
    font-size: 40px;
  }
}
</style>
