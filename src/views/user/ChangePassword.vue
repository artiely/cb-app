<template >
  <div>
    <v-header title="更改密码" righttext="确定" @right-click="save"></v-header>
    <div class="c-scroll-wrapper-top-bottom">
      <v-cell-group>
      <v-cell title="旧密码" input v-model="oldPassword" type="password"></v-cell>
      <v-cell title="新密码" input v-model="password" type="password"></v-cell>
      <v-cell title="确定新密码" input v-model="rePassword" type="password"></v-cell>
      </v-cell-group>
      <p class="re-password-error" v-if="error">{{error}}!</p>
      <p class="forget-password" @click="forgetFn">忘记密码</p>
    </div>
    <!-- <v-footer>
      <v-footer-item @click.native="save">确定</v-footer-item>
    </v-footer> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      oldPassword: '',
      password: '',
      rePassword: '',
      error: ''
    }
  },
  methods: {
    async save() {
      if (this.oldPassword === '') {
        this.error = '请输入原密码'
        return
      } else if (this.password.length < 6) {
        this.error = '请输入6位以上新密码'
        return
      } else if (this.rePassword.length < 6) {
        this.error = '请重复新密码'
        return
      } else if (this.rePassword !== this.password) {
        this.error = '两次输入不一致'
        return
      }
      let res = await this.$api.PASSWORD_RESET({
        password: this.oldPassword,
        passwordNew: this.password
      })
      if (res.status === 1) {
        this.$toast.success('重置成功')
        this.error = false
        this.$store.dispatch('logout')
      } else {
        this.error = res.statusMessage
        this.$toast.fail('重置失败')
      }
    },
    forgetFn() {
      this.$router.push('/forgetpassword')
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
.forget-password {
  text-align: right;
  font-size: 14px;
  padding:0 15px;
  color: @primary;
}
.re-password-error {
  text-align: center;
  font-size: 14px;
  color: @danger;
  padding: 15px;
}
</style>
