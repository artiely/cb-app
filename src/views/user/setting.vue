<template>
  <div>
    <v-header title="系统设置"></v-header>
    <v-br height="64"></v-br>
    <v-cell-group>
      <v-cell title="关于我们" link @click.native="toAbout"></v-cell>
    </v-cell-group>
  </div>
</template>

<script>
export default {
  methods: {
    toAbout() {
      this.$router.push('/about')
    }
  }
}
</script>

<style scoped>
</style>