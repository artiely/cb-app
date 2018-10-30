<template>
  <div class="nodata-wrapper" @click="toStoreKu">
    <p>请选择
      <span>服务/商品/订单模板</span> 开单</p>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },

  methods: {
    toStoreKu() {
      this.$router.push('/service')
    }
  },
  created() {},
  mounted() {},
  activated() {}
}
</script>

<style lang="less">

</style>
