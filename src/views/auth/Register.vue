<template>
  <div class="login">
    <v-header title="注册" ></v-header>
    <div class="c-scroll-wrapper-top" style="padding:15px;background:#fff">
      <div>
        <v-input class="input-margin" placeholder="请输入手机号" maxlength="11" v-model="username" lefticon="icon-xiaotubiao-" type="tel"></v-input>
      </div>
      <div class="input-sms-code">
        <v-input placeholder="短信验证码" lefticon="icon-duanxinyanzhengma" type="tel" v-model.trim="code"></v-input>
        <div @click="sendMsg" class="send-sms-text">
          <span v-if="num==30">获取验证码</span>
          <span v-else>{{num}}s后重试</span>
        </div>
      </div>
      <p class="read-agree" style="color:#999">
        <van-checkbox v-model="readAndAgree"> 我已阅读并同意《车边平台服务协议》 </van-checkbox>
      </p>
      <button class="primary" style="margin-top:20px" @click="register">
        确定
      </button>
      <p class="has-account" @click="toLogin">已有账号，去登录</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timer: null,
      num: 30,
      readAndAgree: true,
      username: '',
      code: ''
    }
  },
  methods: {
    async sendMsg() {
      if (this.username.length !== 11) {
        this.$toast.fail('请先输入手机号')
        return
      }

      if (this.num < 30) return
      this.num--
      this.timer = setInterval(() => {
        this.num--
        if (this.num === 0) {
          this.num = 30
          clearInterval(this.timer)
        }
      }, 1000)
      await this.$api.CAPTCHA_SYSTEM({
        mobile: this.username,
        smsType: 'register'
      })
    },
    async register() {
      if (this.username.length !== 11) {
        this.$toast.fail('请先输入手机号')
        return
      } else if (!this.code) {
        this.$toast.fail('请先输入验证码')
        return
      }
      let res = await this.$api.REGISTER({
        mobile: this.username,
        code: this.code
      })
      if (res.status === 1) {
        this.$toast.success('注册成功')
        window.sessionStorage.setItem('__user_index__', JSON.stringify({username: this.username}))
        this.$router.push({
          name: 'Registerok',
          query: { mobile: this.username }
        })
      }
    },
    toLogin() {
      this.$router.push('/buylogin')
    }
  },
  activated() {
    this.username = ''
    this.code = ''
  }
}
</script>

<style lang="less">

</style>
