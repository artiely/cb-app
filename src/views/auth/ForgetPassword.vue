<template>
  <div class="login">
    <v-header title="忘记密码"></v-header>
    <v-scroll-page top="44">
      <div class="forget-password-wrapper">
        <v-br height="20"></v-br>
        <v-input-group>
          <v-input placeholder="员工请输入企业号" v-if="src=='login'" lefticon="icon-qiyehao" v-model="storeNum"></v-input>
          <v-input placeholder="请输入手机号" lefticon="icon-shoujihao" v-model="tel" type="tel" maxlength="11"></v-input>
          <div class="send-msg-box ">
            <div class="msg-code-input">
              <v-input placeholder="短信验证码" lefticon="icon-yanzhengma" v-model="code"></v-input>
            </div>
            <div class="send-msg-btn" :class="{'disabled':!(num==30 && tel.length==11)}">
              <div @click="sendMsg">
                <span v-if="num==30">获取验证码</span>
                <span v-else>{{num}}s</span>
              </div>
            </div>
          </div>
          <v-input placeholder="请输入新密码" lefticon="icon-mima" :righticon="showPassword?'icon-xiaotubiao-2':'icon-xiaotubiao-1'" :type="showPassword?'text':'password'" @input-right="showPassword=!showPassword" v-model="newPassword"></v-input>
        </v-input-group>
      </div>
      <div class="login-btn-box">
        <button class="primary" style="margin-top:50px" @click="save">确定</button>
      </div>
    </v-scroll-page>
  </div>
</template>
<script>
export default {
  data() {
    return {
      timer: null,
      num: 30,
      showPassword: false,
      storeNum: '',
      tel: '',
      code: '',
      src: '',
      newPassword: ''
      // error: {
      //   tel: false,
      //   code: false,
      //   newPassword: false
      // }
    }
  },
  watch: {},
  computed: {},
  methods: {
    async sendMsg() {
      if (this.tel.length !== 11) {
        // this.error.tel = true
        // this.error.msg = '请输入正确的手机号'
        this.$toast('请输入正确的手机号')
        return
      } else {
        // this.error.tel = false
        // this.error.msg = ''
        if (this.num === 30) {
          let res = await this.$api.CAPTCHA_SYSTEM({
            smsType: 'forgetPw',
            mobile: this.tel
          })
          if (res.status === 1) {
            this.$toast.success('短信已发送')
          } else {
            this.$toast.fail('短信发送失败')
            // this.error.tel = true
            // this.error.msg = res.status + res.stateMessage
            this.$toast(res.stateMessage)
          }
        }
      }
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
    },
    async save() {
      if (this.tel === '' || this.tel.length !== 11) {
        // this.error.tel = true
        // this.error.code = false
        // this.error.newPassword = false
        // this.error.msg = '请输入正确的手机号'
        this.$toast('请输入正确的手机号')
        return
      } else if (this.code === '') {
        // this.error.tel = false
        // this.error.code = true
        // this.error.newPassword = false
        // this.error.msg = '请输入验证码'
        this.$toast('请输入验证码')
        return
      } else if (this.newPassword.length < 6) {
        // this.error.tel = false
        // this.error.code = false
        // this.error.newPassword = true
        // this.error.msg = '请输入6位以上的密码'
        this.$toast('请输入6位以上的密码')
        return
      } else {
        // this.error.tel = false
        // this.error.code = false
        // this.error.newPassword = false
        // this.error.msg = ''
      }
      let res = await this.$api.PASSWORD_FORGET({
        code: this.storeNum,
        username: this.tel,
        captcha: this.code,
        password: this.newPassword
      })
      if (res.status === 1) {
        this.$toast.success('找回成功')
        this.$router.replace({ name: 'Login' })
      } else {
        this.$toast.fail(res.status + res.stateMessage)
      }
    }
  },
  mounted() {},
  activated() {
    if (this.$route.query.src) {
      this.src = this.$route.query.src
    }
    if (this.$route.query.tel) {
      this.tel = this.$route.query.tel
    }
    this.code = ''
    this.newPassword = ''
    this.storeNum = ''
  }
}
</script>
<style lang="less">
</style>
