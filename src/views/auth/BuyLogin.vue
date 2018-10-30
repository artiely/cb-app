<template>
  <div class="login">
    <v-header title="登录"></v-header>
    <v-scroll-page :top="44" >
      <div style="padding:0 8px;">
        <v-br height="20"></v-br>
      <v-input-group>
        <v-input class="input-margin" placeholder="请输入手机号" maxlength="11" v-model="params.username" lefticon="icon-shoujihao" type="tel"></v-input>
        <v-input class="input-margin" placeholder="密码(初始密码为手机号后6位)" v-model="params.password" lefticon="icon-mima" :righticon="showPassword?'icon-xiaotubiao-2':'icon-xiaotubiao-1'" :type="showPassword?'text':'password'" @input-right="showPasswordHandle"></v-input>
      </v-input-group>
      <p class="login-forget-password clearfix">
        <span class="frame" @click="toForgetPassword">忘记密码?</span>
      </p>
      </div>
      <div style="margin-top:40px" class="login-btn-box">
        <button class="primary" @click="login">登录</button>
      </div>
      <div class="has-account" @click="toLogin">没有账号，免费注册</div>
    </v-scroll-page>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      showPassword: false,
      params: {
        username: '',
        password: ''
      },
      error: {
        username: false,
        password: false,
        msg: ''
      }
    }
  },
  computed: {
    item() {
      return this.$store.state.sys.product
    }
  },
  methods: {
    showPasswordHandle() {
      this.showPassword = !this.showPassword
    },
    toLogin() {
      this.$router.replace('/onestepsignup')
    },
    toForgetPassword() {
      this.$router.push({
        name: 'ForgetPassword',
        query: { src: 'buylogin', tel: this.params.username }
      })
    },
    async login() {
      window.sessionStorage.removeItem('vuex')
      window.sessionStorage.removeItem('__token__')
      Cookies.remove('menuList')
      if (this.params.username === '') {
        this.error.username = true
        this.error.password = false
        this.error.msg = '请输入手机号。'
      } else if (this.params.username.length !== 11) {
        this.error.username = true
        this.error.password = false
        this.error.msg = '请输入正确的手机号。'
      } else if (this.params.password === '') {
        this.error.username = false
        this.error.password = true
        this.error.msg = '请输入密码。'
      } else if (this.params.password.length < 6) {
        this.error.username = false
        this.error.password = true
        this.error.msg = '请输入正确的登录密码。'
      } else {
        this.error.username = false
        this.error.password = false
        this.error.msg = ''
        let res = null
        const toast = this.$toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          message: '登录中...'
        })
        setTimeout(() => {
          toast && toast.clear()
        }, 10000)
        res = await this.$api.INDEX_LOGIN(this.params)
        toast && toast.clear()
        if (res.status === 1) {
          // 登录成功
          window.sessionStorage.setItem(
            '__user_index__',
            JSON.stringify(this.params)
          )
          // 有参数直接去支付 没有参数先去购买页
          if (this.item && this.item.id) {
            this.$router.replace({ name: 'ToPay' })
          } else {
            this.$router.replace({ name: 'Buy' })
          }
        } else {
          this.error.code = true
          this.error.username = true
          this.error.password = true
          this.error.msg = res.stateMessage
        }
      }
    },
    toregister() {
      this.$router.push('/register')
    }
  },
  activated() {
    let accountInfo = window.sessionStorage.getItem('__user__')
    try {
      let obj = JSON.parse(accountInfo)
      if (typeof obj === 'object' && obj) {
        this.params.username = obj.username
        this.params.password = ''
      }
    } catch (e) {
      console.error(e)
    }
    this.item = this.$route.query.item
  }
}
</script>

<style>
.buylogin {
  background: #f8f8f8;
}
</style>
