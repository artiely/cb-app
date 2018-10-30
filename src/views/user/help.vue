<template>
  <div>
    <v-header title="帮助"></v-header>
    <v-br height="64"></v-br>
    <v-cell-group>
      <v-cell title="客服" link @click.native="toHotLine"></v-cell>
      <v-cell title="我要吐个槽" link @click.native="toShits"></v-cell>
      <v-cell title="使用帮助" link @click.native="switchStore"></v-cell>
    </v-cell-group>
  </div>
</template>

<script>
export default {
  methods: {
    toHotLine() {
      this.$router.push('/hotline')
    },
    toShits() {
      this.$router.push('/shits')
    },
    switchStore() {
      this.$dialog.alert({
        message: '亲爱的，该功能暂未对您开放，感谢您的支持与理解'
      })
    }
  }
}
</script>

<style scoped>
</style>