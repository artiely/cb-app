<template>
  <div class="payok">
    <v-header title="支付" :left-click="handleLeft"></v-header>
    <v-scroll-page top="44">
      <div style="padding:20px 40px">
        <div class="payok-top">
          <v-icon name="icon-queding1"></v-icon> 注册成功
        </div>
        <div class="payok-tip">
          <!-- 点击确定前去体验或购买 -->
        </div>
        <div class="payok-result">登陆手机号：{{mobile|telFormat()}}</div>
        <div class="payok-result">初始密码：手机号后6位</div>
        <div class="payok-result">电脑端登陆：www.51chebian.com</div>
        <div style="padding-top:50px">
          <img :src="require('../../assets/img/wx160x160.png')" alt="车边妹微信" style="display:block;margin:0 auto">
        </div>
        <p style="text-align:center;color:#666;padding:10px 0 40px 0;">如有困惑,欢迎骚扰客服妹子!</p>
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
      mobile: ''
    }
  },
  methods: {
    handleLeft() {
      this.$router.replace('/buylogin')
    },
    tologin() {
      this.$router.replace('/buy')
    }
  },
  activated() {
    this.mobile = this.$route.query.mobile
  }
}
</script>

<style lang="less">
@import '../../assets/style/var';
.payok {
  background: #fff;
}
.payok-top {
  font-size: 24px;
  color: #333;
  .icon {
    font-size: 44px;
    color: @success!important;
  }
}
.payok-tip {
  font-size: 18px;
  color: #999;
  padding: 14px 0 30px 0;
}
.payok-result {
  color: #666;
  font-size: 14px;
  line-height: 2;
}
</style>
