<template>
  <div class="login">
    <v-header title="一步注册账号"></v-header>
    <v-scroll-page top="44">
      <v-br height="20"></v-br>
      <div  style="padding:0 8px;">
      <v-input-group>
        <v-input v-model="tel" lefticon="icon-shoujihao" placeholder="请输入店主手机号" type="tel" maxlength="11"></v-input>
        <div style="position:relative" class="send-msg-box">
          <v-input v-model="code" lefticon="icon-yanzhengma" placeholder="请输入验证码" type="tel" maxlength="11"></v-input>
          <div class="send-msg-btn" :class="{'disabled':!(num==30 && tel.length==11)}">
            <div @click="sendMsg">
              <span v-if="num==30">获取验证码</span>
              <span v-else>{{num}}s</span>
            </div>
          </div>
        </div>
      </v-input-group>
      </div>
      <div class="login-btn-box">
      <button class="primary" @click="register" style="margin-top:70px" :class="{'disabled':!(tel.length==11&&code.length==4)}"> 确定 </button></div>
      <p class="has-account" @click="toLogin">已有账号，去登录</p>
    </v-scroll-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tel: '',
      code: '',
      num: 30,
      timer: null
    }
  },
  methods: {
    async sendMsg() {
      if (this.tel.length !== 11) {
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
        mobile: this.tel,
        smsType: 'register'
      })
    },
    async register() {
      if (this.tel.length !== 11) {
        this.$toast.fail('请先输入手机号')
        return
      } else if (!this.code) {
        this.$toast.fail('请先输入验证码')
        return
      }
      let res = await this.$api.REGISTER({
        mobile: this.tel,
        code: this.code
      })
      if (res.status === 1) {
        this.$toast.success('注册成功')
        window.sessionStorage.setItem(
          '__user_index__',
          JSON.stringify({ username: this.tel })
        )
        this.$router.push({
          name: 'Buy',
          query: { mobile: this.tel }
        })
      }
    },
    toLogin() {
      this.$router.replace('/buylogin')
    }
  }
}
</script>

<style scoped>
</style>