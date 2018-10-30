<template>
  <div>
    <v-header title="更改支付密码"></v-header>
    <div class="c-scroll-wrapper-top">
      <v-br></v-br>
      <!-- 密码输入框 -->
      <p style="font-size:16px;text-align:center;padding:20px 0 15px 0">请输入新密码</p>
      <van-password-input :value="value" info="密码为 6 位数字" @focus="showKeyboard = true" />
      <van-number-keyboard :show="show" theme="custom" close-button-text="确定" @blur="postSave" @input="onInput" @delete="onDelete" :hide-on-click-outside="false" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true,
      value: ''
    }
  },
  methods: {
    onInput(key) {
      this.value = (this.value + key).slice(0, 6)
    },
    onDelete() {
      this.value = this.value.slice(0, this.value.length - 1)
    },
    async postSave() {
      if (this.value.length !== 6) {
        this.$toast.fail('请输入6位密码')
      } else {
        let res = await this.$api.MEMBER_PAY_PASSWORD_SAVE({
          id: this.$route.query.id,
          payPasswordNew: this.value
        })
        if (res.status === 1) {
          this.$toast.success('修改成功')
          this.$router.back()
        } else {
          this.$toast.fail('修改失败')
        }
        this.value = ''
      }
    }
  }
}
</script>

<style>
</style>
