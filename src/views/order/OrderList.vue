<template>
  <div>
    <v-header :title="title" :border="false">
    </v-header>
    <div class="c-scroll-wrapper-top">
      <cube-scroll ref="scroll" :data="data" @pulling-up="onPullingUp" :options="options" @pulling-down="onPullingDown">
        <v-br :height="20"></v-br>
        <div v-if="data.length>0">
          <order-item class="orderList" :data="data"></order-item>
        </div>
        <v-nodata v-else></v-nodata>
      </cube-scroll>
    </div>
  </div>
</template>
<script>
import OrderItem from '@/components/OrderItem'
import scroll from '../../common/mixins/scroll.js'
export default {
  components: {
    OrderItem
  },
  mixins: [scroll],
  data() {
    return {
      timer: null,
      query: {
        pageNo: 1,
        pageSize: 10,
        'searchParameter.keyWord': '',
        'searchParameter.starTime': '',
        'searchParameter.endTime': '',
        chargeType: '',
        orderNo: '',
        type: '',
        createType: '',
        status: '',
        statusPay: '',
        memberUsername: '',
        'member.id': '',
        'motor.id': '',
        memberName: '',
        motorLicence: '',
        closeFlag: '',
        statusPaySearch: ''
      },
      data: '',
      totalPage: 0
    }
  },
  watch: {
    // query: {
    //   handler(val) {
    //     if (val.pageNo === 1) {
    //       this.$refs.scroll.scrollTo(0, 0)
    //     }
    //     this.getData()
    //   },
    //   deep: true
    // }
  },
  methods: {
    async getData() {
      let res = await this.$api.ORDER_LIST(this.query)
      if (res.status === 1) {
        if (this.query.pageNo === 1) {
          this.data = res.page.list || []
        } else {
          this.data = this.data.concat(res.page.list || [])
        }
        this.totalPage = res.page.totalPage
      } else {
        console.error('获取订单失败')
      }
    }
  },
  activated() {
    // if (this.$route.params.oid || this.$route.params.user) {
    //   this.getData()
    // } else if (this.$route.params.refresh) {
    //   this.getData()
    // }
    if (this.$route.query.active && this.$route.query.active === '0') {
      // 历史订单（全部）
      this.title = '历史订单'
      this.query['status'] = ''
      this.query['statusPay'] = ''
      this.query['pageNo'] = 1
      this.query['statusPaySearch'] = ''
    } else if (this.$route.query.active && this.$route.query.active === '1') {
      // 待结算
      this.title = '待结算订单'
      this.query['status'] = ''
      this.query['statusPay'] = ''
      this.query['pageNo'] = 1
      this.query['statusPaySearch'] = 1
    }
    if (this.$route.query.memberId) {
      this.query['member.id'] = this.$route.query.memberId
      this.query['motor.id'] = ''
    } else if (this.$route.query.motorId) {
      this.query['motor.id'] = this.$route.query.motorId
      this.query['member.id'] = ''
    }
    this.getData()
  }
}
</script>
