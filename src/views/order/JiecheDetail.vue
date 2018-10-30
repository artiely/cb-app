<template>
  <div>
    <v-header title="接车单详情"></v-header>
    <div class="c-scroll-wrapper-top">
      <cube-scroll :data="data">
        <van-cell title="接车单号" :value="data.receptionNo"></van-cell>
        <van-cell title="接车时间" :value="data.createDate|timeFormat"></van-cell>
        <van-cell title="接车人" :value="data.createBy"></van-cell>
        <v-br></v-br>
        <van-cell title="送车人" :value="data.senderName"></van-cell>
        <van-cell title="送车人手机号" :value="data.senderMobile"></van-cell>
        <van-cell title="当前里程(km)" :value="data.motorTotalMile"></van-cell>
        <v-br></v-br>
        <van-cell title="问题描述" :value="data.question"></van-cell>
        <van-cell title="技师建议" :value="data.suggest"></van-cell>
        <van-cell title="预计完工时间" :value="data.expectTime|timeFormat"></van-cell>
        <v-br></v-br>
        <van-cell title="备注" :value="data.remarks" ></van-cell>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      data: ''
    }
  },
  methods: {
    async getData() {
      let res = await this.$api.JIECHE_DETAIL({ id: this.id })
      if (res.status === 1) {
        this.data = res.data
      } else {
        console.error('获取接车单详情出错')
      }
    }
  },
  activated() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getData()
    }
  }
}
</script>

<style>
</style>
