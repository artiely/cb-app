<template>
  <div class="login">
    <v-header title="体验"></v-header>
    <v-scroll-page top="44" >
      <v-br height="20"></v-br>
      <div style="padding:0 8px;" >
      <v-input-group>
        <v-input v-model="tel" lefticon="icon-shoujihao" placeholder="输入手机号体验或领兑换码" type="tel" maxlength="11"></v-input>
      </v-input-group>
      </div>
      <div class="login-btn-box">
      <button class="primary" @click="nextCheck" style="margin-top:70px"> 下一步 </button>
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
export default {
  data() {
    return {
      tel: ''
    }
  },
  methods: {
    async nextCheck() {
      if (this.tel.length !== 11) {
        this.$toast('请输入正确的手机号')
        return
      }
      window.localStorage.setItem('exp_user', this.tel)
      // ...
      const toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        message: '登录中...'
      })
      let res = await this.$api.MOBILE_CHECK({ mobile: this.tel })
      toast.clear()
      if (res.status === 1) {
        if (res.message === '0') {
          this.$router.push({
            name: 'ExperienceCode',
            query: { mobile: this.tel }
          })
        } else if (res.message === '1') {
          this.$router.push({
            name: 'ExperiencePassword',
            query: { mobile: this.tel }
          })
        } else if (res.message === '2') {
          this.$dialog
            .confirm({
              title: '提示',
              confirmButtonText: '购买正式版',
              cancelButtonText: '取消',
              message: '该账号体验已过期'
            })
            .then(() => {
              this.$router.replace('/buy')
            })
            .catch(() => {
              // on cancel
            })
        }
      }
    },
    toBuy() {
      this.$router.push('/buy')
    }
  },
  activated() {
    this.tel = window.localStorage.getItem('exp_user')
  }
}
</script>

<style scoped>
</style>