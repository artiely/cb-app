<template>
  <!-- 新增客户 -->
  <div class="new-active">
    <v-header :title="id?'修改充值活动':'新建充值活动'" :border="true" :isBack="true">
      <div slot="righttext" @click="save()">保存</div>
    </v-header>
    <div class="c-scroll-wrapper-top">
      <v-br :height="20"></v-br>
      <v-cell-group style="margin-bottom:5px">
        <v-cell title="充值金额" input required v-model="query.money" type="tel" maxlength="7"></v-cell>
        <v-cell title="赠送金额" input v-model="query.moneyGift" type="tel" maxlength="7"></v-cell>
      </v-cell-group>
      <v-remark v-model="remarks" ></v-remark>
      <div style="padding:15px" v-if="id">
        <button class="outline" style="border:#d73962;color:#d73962;" @click="del">删除该充值活动</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: {
        money: '',
        moneyGift: ''
      },
      id: '',
      remarks: '',
      data: []
    }
  },
  methods: {
    async save() {
      if (this.query.money === '') {
        this.$toast.fail('请输入充值金额')
        return
      }
      if (parseInt(this.query.moneyGift) > parseInt(this.query.money)) {
        this.$toast.fail('赠送金额不能大于充值金额')
        return
      }
      let data = {
        money: this.query.money,
        moneyGift: this.query.moneyGift,
        id: this.id,
        remarks: this.remarks
      }
      let res = await this.$api.ADD_ACCOUNT_ACTIVE(data)
      if (res.status === 1) {
        this.$toast.success('保存成功')
        this.query = {
          money: '',
          moneyGift: ''
        }
        this.remarks = ''
        this.$router.replace({ name: 'ChargeActiveList' })
      } else {
        console.error(`保存失败${res}`)
      }
    },
    del() {
      this.$dialog
        .confirm({
          title: '确定删除吗？',
          message: ' ',
          confirmButtonText: '确定'
        })
        .then(async() => {
          // on confirm
          let res = await this.$api.DEL_ACTIVE({ id: this.id })
          if (res.status === 1) {
            this.$toast.success('删除成功')
            this.$router.replace('/chargeactivelist')
          }
        })
        .catch(() => {
          // on cancel
        })
    },
    async getData() {
      let res = await this.$api.CHARGE_ACTIVE_DETAIL({ id: this.id })
      if (res.status === 1) {
        this.query.money = res.data.money
        this.query.moneyGift = res.data.moneyGift
        this.remarks = res.data.remarks
        // this.totalPage = res.page.totalPage
      } else {
        console.error(`获取列表失败${res.stateMessage}`)
      }
    }
  },
  activated() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getData()
    } else {
      this.id = ''
      this.query.money = ''
      this.query.moneyGift = ''
      this.remarks = ''
    }
  }
}
</script>
