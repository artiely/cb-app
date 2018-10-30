<template>
  <div class="login">
    <v-header title="体验"></v-header>
    <v-scroll-page top="44">
      <v-br height="20"></v-br>
      <div  style="padding:0 8px;"> 
      <v-input-group>
        <v-input v-model="password" lefticon="icon-mima" :righticon="showPassword?'icon-xiaotubiao-2':'icon-xiaotubiao-1'" placeholder="密码(初始密码为手机号后6位)" :type="showPassword?'text':'password'" @input-right="showPasswordHandle"></v-input>
      </v-input-group>
      <p class="login-forget-password clearfix">
        <span class="frame" @click="toForgetPassword">忘记密码?</span>
      </p>
      </div>
      <div class="login-btn-box">
      <button class="primary" @click="login" style="margin-top:70px"> 登录 </button>
      </div>
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
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      tel: '',
      password: '',
      username: '',
      showPassword: false
    }
  },
  methods: {
    showPasswordHandle() {
      this.showPassword = !this.showPassword
    },
    toForgetPassword() {
      this.$router.push({
        name: 'ForgetPassword',
        query: { tel: this.tel, src: 'experiencepassword' }
      })
    },
    toBuy() {
      this.$router.push('/buy')
    },
    async login() {
      window.sessionStorage.removeItem('vuex')
      window.sessionStorage.removeItem('__token__')
      Cookies.remove('menuList')
      if (this.password === '') {
        this.$toast('请输入密码。')
      } else if (this.password.length < 6) {
        this.$toast('请输入正确的登录密码。')
      } else {
        let res = null
        const toast = this.$toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          message: '登录中...'
        })
        setTimeout(() => {
          toast && toast.clear()
        }, 10000)
        res = await this.$api.LOGIN_EXP({
          username: this.username,
          password: this.password
        })
        toast && toast.clear()
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
          this.$router.push('/index')
          this.$store.commit('MENU_LIST', res.list)
        } else if (res.status === 10020) {
          this.$toast(res.stateMessage)
        } else if (res.status === 10003) {
          this.$toast(res.stateMessage)
        } else if (res.status === 10036) {
          this.$dialog
            .confirm({
              message: res.stateMessage,
              confirmButtonText: '购买正式版',
              cancelButtonText: '取消'
            })
            .then(() => {
              // on confirm
              this.$router.push('/buy')
            })
            .catch(() => {
              // on cancel
            })
        } else {
          this.$toast(res.stateMessage)
        }
      }
    }
  },
  activated() {
    this.username = this.$route.query.mobile
  }
}
</script>

<style scoped>
</style>