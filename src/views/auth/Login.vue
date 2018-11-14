<template >
  <div class="login">
    <div class="cb-wrapper">
      <div class="login-slide">
        <div class="login-slide-item">
          <div class="logo" style="text-align:center;padding-top:20px">
            <v-icon name="icon-zu1" symbol></v-icon>
          </div>
          <div class="slide-wrapper" style="padding-top:26px;">
            <v-input-group>
              <v-input v-model="params.code" :error="error.code" placeholder="企业号" type="tel" lefticon="icon-qiyehao"></v-input>
              <v-input v-model="params.username" :error="error.username" lefticon="icon-shoujihao" placeholder="登录手机号" type="tel" maxlength="11"></v-input>
              <v-input v-model="params.password" :error="error.password" lefticon="icon-mima" :righticon="showPassword?'icon-xiaotubiao-2':'icon-xiaotubiao-1'" placeholder="密码" :type="showPassword?'text':'password'" @input-right="showPasswordHandle"></v-input>
            </v-input-group>
            <p class="login-forget-password clearfix">
              <span class="frame" @click="toForgetPassword">忘记密码?</span>
            </p>
            <div class="msg-box">
              <p class="error-msg" v-show="error.code || error.username || error.password">{{error.msg}}</p>
            </div>
          </div>
          <div class="login-btn-box">
          <button class="primary" @click="login" style="margin-top:20px"> 登录 </button>
            <button class="outline" @click="experience" style="margin-top:20px"> 体验一下 </button>
            </div>
        </div>
      </div>
      <div class="register-box">
        <div class="register">
          <span class="link">
            <a class="link" @click="toBuy">购买正式版</a>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      params: {
        code: '',
        username: '',
        password: ''
      },
      error: {
        code: false,
        username: false,
        password: false,
        msg: ''
      },
      showPassword: false,
      currentPage: 0
    }
  },
  watch: {
    currentPage: {
      handler(value) {
        this.error.code = false
        this.error.username = false
        this.error.password = false
        this.error.msg = ''
      }
    }
  },
  methods: {
    experience() {
      this.$router.push('/experiencelogin')
    },
    showPasswordHandle() {
      this.showPassword = !this.showPassword
    },
    toForgetPassword() {
      this.$router.push({
        name: 'ForgetPassword',
        query: { src: 'login', tel: this.params.username }
      })
    },
    toRegister() {
      this.$router.push('/register')
    },
    async login() {
      window.sessionStorage.removeItem('vuex')
      window.sessionStorage.removeItem('__token__')
      Cookies.remove('menuList')
      if (this.params.username === '') {
        this.error.code = false
        this.error.username = true
        this.error.password = false
        this.error.msg = '请输入手机号。'
      } else if (this.params.username.length !== 11) {
        this.error.code = false
        this.error.username = true
        this.error.password = false
        this.error.msg = '请输入正确的手机号。'
      } else if (this.params.password === '') {
        this.error.code = false
        this.error.username = false
        this.error.password = true
        this.error.msg = '请输入密码。'
      } else if (this.params.password.length < 6) {
        this.error.code = false
        this.error.username = false
        this.error.password = true
        this.error.msg = '请输入正确的登录密码。'
      } else {
        this.error.code = false
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
        if (this.currentPage === 0) {
          res = await this.$api.LOGIN(this.params)
          if (res.status === 1) {
            this.$store.commit('IS_EXP', false)
            this.$store.commit('SET_AUTOLOGIN', true)
          }
        } else {
          res = await this.$api.LOGIN_EXP({
            username: this.params.username,
            password: this.params.password
          })
          if (res.status === 1) {
            this.$store.commit('IS_EXP', true)
          }
        }
        toast && toast.clear()
        if (res.status === 1) {
          // 登录成功
          // 获取功能权限
          this.$store.dispatch('getroleMenuNav')
          if (res.list.length === 0) {
            this.$toast('获取权限失败！')
            return
          }
          let _token = res.list ? res.list.length : 0
          window.sessionStorage.setItem('__token__', _token)
          window.localStorage.setItem('__user__', encodeURI(JSON.stringify(this.params)))
          this.$router.push('/index')
          this.$store.commit('MENU_LIST', res.list)
        } else if (res.status === 10020) {
          this.error.code = true
          this.error.username = false
          this.error.password = false
          this.error.msg = res.stateMessage
        } else if (res.status === 10003) {
          this.error.code = true
          this.error.username = true
          this.error.password = false
          this.error.msg = res.stateMessage
        } else {
          this.error.code = true
          this.error.username = true
          this.error.password = true
          // this.error.msg = res.stateMessage
        }
      }
    },
    freeTrial() {
      this.$router.push('/index')
    },
    toBuy() {
      this.$router.push('/buy')
    },
    switchTab(index) {
      this.currentPage = index
    },
    slideChange(index) {
      this.currentPage = index
    }
  },
  activated() {
    this.$api.SET_STATUSBAR_COLOR('#f8f8f8')
    if (this.$route.params.active) {
      this.currentPage = this.$route.params.active
    }
    let accountInfo = decodeURI(window.localStorage.getItem('__user__'))
    try {
      let obj = JSON.parse(accountInfo)
      if (typeof obj === 'object' && obj) {
        this.params = obj
      }
    } catch (e) {
      console.error(e)
    }
  }
}
</script>
<style lang="less">
.logo {
  .icon {
    font-size: 66px;
  }
}
/* .cb-wrapper{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: scroll;
} */
</style>
