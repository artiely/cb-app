<template>
  <div>
    <v-header title="商机详情"></v-header>
    <div class="c-scroll-wrapper-top" v-if="data">
      <v-cell title="车牌号" :text="data.motor.licence"></v-cell>
      <v-cell title="客户名" :text="data.customerName"></v-cell>
      <v-cell title="客户手机号" :text="data.member.username"></v-cell>
      <v-cell title="下次开单提醒" v-if="data.remindType==3"></v-cell>
      <v-br></v-br>
      <div style="width:100%;padding:15px;background:#fff">{{data.remindContent}}</div>
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
  watch: {
    id: {
      handler() {
        this.getData()
      }
    }
  },
  methods: {
    async getData() {
      let res = await this.$api.BUSINESS_DETAIL({ id: this.id })
      if (res.status === 1) {
        this.data = res.data
      } else {
        console.error('获取商机详情失败')
      }
    },
    async read() {
      let res = await this.$api.BUSINESS_READ({ id: this.id })
      if (res.status === 1) {
        this.$toast.success('已读')
      } else {
        console.error('获取商机读取失败')
      }
    }
  },
  activated() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.read()
    }
  }
}
</script>

<style>
</style>
