<template>
  <div class="login">
    <v-header title="体验"></v-header>
    <v-scroll-page top="44">
      <v-br height="22"></v-br>
      <div style="padding:0 8px;">
        <v-input-group class="send-msg-box">
          <v-input v-model="code" lefticon="icon-yanzhengma" placeholder="请输入验证码" type="tel" maxlength="11"></v-input>
          <div class="send-msg-btn" :class="{'disabled':num<30}">
            <div @click="sendMsg">
              <span v-if="num==30">获取验证码</span>
              <span v-else>{{num}}s</span>
            </div>
          </div>
        </v-input-group>
      </div>
      <div class="login-btn-box">
      <button class="primary" @click="login" style="margin-top:70px"> 登录 </button></div>
    </v-scroll-page>
    <div class="register-box">
      <div class="register">
        <span class="link">
          <a class="link" @click="toBuy">购买正式版</a>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      code: '',
      username: '',
      num: 30
    }
  },
  methods: {
    async login() {
      if (this.code === '') {
        this.$toast('请输入验证码')
        return
      }
      let res = await this.$api.REGISTER({
        mobile: this.username,
        code: this.code
      })
      if (res.status === 1) {
        this.$store.commit('IS_EXP', true)
        // 登录成功
        // 获取功能权限
        this.$store.dispatch('getroleMenuNav')
        if (res.list.length === 0) {
          this.$toast('获取权限失败！')
          return
        }
        let _token = res.list ? res.list.length : 0
        window.sessionStorage.setItem('__token__', _token)
        window.sessionStorage.setItem(
          '__user__',
          JSON.stringify({ username: this.username })
        )
        this.$router.replace('/index')
        this.$store.commit('MENU_LIST', res.list)
      }
    },
    toBuy() {
      this.$router.push('/buy')
    },
    async sendMsg() {
      // ..发短信
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
    }
  },
  activated() {
    this.username = this.$route.query.mobile
    this.sendMsg()
  }
}
</script>

<style scoped>
</style>