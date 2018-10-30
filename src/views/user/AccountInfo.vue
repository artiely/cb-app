<template >
  <div>
    <v-header title="账号信息"></v-header>
    <div class="c-scroll-wrapper-top-bottom">
      <!-- <v-cell title="头像"></v-cell> -->
      <v-br :height="20"></v-br>
      <v-cell-group>
      <v-cell title="姓名" :text="data.name"></v-cell>
      <v-cell title="手机号" :text="data.mobile||data.username|telFormat"></v-cell>
      </v-cell-group>
      <v-cell-group>
      <v-cell title="工号" :text="data.workNo"></v-cell>
      </v-cell-group>
      <v-cell-group>
      <v-cell title="更改密码" text=" " link @click.native="toChangePassword"></v-cell>
      </v-cell-group>
      <div class="login-btn-box">
        <button class="outline" style="border:1px solid #d73962;color:#d73962"  @click="logout">退出当前账号</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: this.$store.state.sys.currentUser.name
    }
  },
  watch: {
    name: {
      handler() {
        // 更改姓名的接口函数
        this.$toast.success('更改成功')
        this.$store.dispatch('getCurrentUser')
      }
    }
  },
  computed: {
    data() {
      return this.$store.state.sys.currentUser
    }
  },
  methods: {
    toChangePassword() {
      this.$router.push('/changepassword')
    },
    logout() {
      const toast = this.$toast.loading({
        duration: 0,       // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        message: '退出中...'
      })
      this.$store.dispatch('logout').then(() => {
        toast.clear()
        this.$destroy()
      }).catch((e) => {
        this.$toast.fail(e)
      })
    }
  },
  activated() {
    this.name = this.data.name
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
.forget-password {
  text-align: right;
  font-size: 14px;
  padding: 15px;
  color: @primary;
}
.help-text--hotline {
  font-size: 14px;
  padding: 20px 0;
  text-align: center;
  color: @secondary-text;
}
</style>
