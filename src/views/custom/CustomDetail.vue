<template>
  <div>
    <v-header title="客户资料" righttext="编辑" @right-click="edit"></v-header>
    <div class="c-scroll-wrapper-top">
      <cube-scroll :data="data">
        <div v-if="data">
          <v-cell-group>
            <v-cell title="手机号" :text="data.username"></v-cell>
            <v-cell title="客户名" :text="data.name" v-if="data.name"></v-cell>
          </v-cell-group>
          <v-cell-group>
            <v-cell title="性别" :text="data.sex==1?'男':'女'"></v-cell>
            <v-cell title="编码" :text="data.code" ></v-cell>
            <v-cell title="标签" :text="data.memberTag.name" v-if="data.memberTag"></v-cell>
            <v-cell title="公司" :text="data.invoiceTitle"></v-cell>
            <v-cell title="来源" :text="dealType"></v-cell>
          </v-cell-group>
          <v-remark v-model="data.remarks" disabled v-if="data.remarks"></v-remark>
          <!-- <v-cell-group></v-cell-group>
            <v-cell title="备注" :text="data.remarks" wrap></v-cell>
          </v-cell-group> -->
          <!-- <v-cell-group>
            <v-cell title="修改支付密码" class="change-pay-password editblue" link @click.native="toNewPassword"></v-cell>
            <v-cell title="将该客户移黑名单" class="blacklist" @click.native="del"></v-cell>
          </v-cell-group> -->
        </div>
      </cube-scroll>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      data: '',
      id: ''
    }
  },
  computed: {
    dealType() {
      return this.$options.filters['srcType'](this.data.dealType)
    }
  },
  methods: {
    toNewPassword() {
      this.$router.replace({
        name: 'CusNewPassword',
        query: { id: this.data.id }
      })
    },
    async getData() {
      let res = await this.$api.CUSTOM_DETAIL({ id: this.id })
      if (res.status === 1) {
        this.data = res.data
      } else {
        console.error('获取客户资料失败')
      }
    },
    del() {
      this.$dialog
        .confirm({
          title: '确定移至黑名单吗？',
          message: '移除后，该客户将无法恢复，其名下车辆将各自成为无主车辆'
        })
        .then(async() => {
          let res = await this.$api.CUSTOM_DEL({ id: this.id })
          if (res.status === 1) {
            this.$toast.success('删除成功')
            this.$router.replace({ name: 'Custom', params: { refresh: true } })
          } else {
            this.$toast.fail('删除失败')
          }
        })
        .catch(() => {
          // on cancel
        })
    },
    edit() {
      this.$router.push({ name: 'NewCustom', query: { memberId: this.id } })
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

<style lang="less">
@import '../../assets/style/var';
.change-pay-password {
  .v-cell__title {
    color: @primary;
  }
}
.del-custom {
  background: #ffffff !important;
  color: #c7c7c7 !important;
}
</style>
