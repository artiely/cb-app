<template>
  <div>
    <v-header title="账户充值/消费"></v-header>
    <div class="c-scroll-wrapper-top">
      <cube-scroll :data="data" ref="scroll" @pulling-up="onPullingUp" :options="options" @pulling-down="onPullingDown">
        <order-custom noHeader :data="orderOfCustom"></order-custom>
        <v-br :height="20"></v-br>
        <v-cell-group>
          <v-cell title="当前余额" :text="infoData?infoData.moneyUsable:''|currency('￥')" :options="cellOptions"></v-cell>
        </v-cell-group>
        <v-tab-bar :data="tab" v-model="active" style="background:#fff"></v-tab-bar>
        <v-cell-group>
          <v-cell wrap v-for="v in data" link :key="v.id" @click.native="oneDetail(v)" :label="'余额:'+v.moneyUsablePost|currency('￥')">
            <div slot="text" style="line-height:1.5" class="zhls-cell">
              <div>
                <div class="clearfix">
                  <span class="van-cell-text" style="color:#999">{{v.createDate|timeFormat()}}</span>
                  <span v-if="v.changeType=='A'" class="fr" style="color:#333;font-size:18px;padding-right:5px">{{v.money|currency('+')}}</span>
                  <span v-if="v.changeType=='D'" class="fr" style="color:#333;font-size:18px;padding-right:5px">{{v.money|currency('-')}}</span>
                </div>
                <div style="color:#999;font-size:12px">余额:{{v.moneyUsablePost|currency('￥')}}
                  <span v-if="v.changeType=='A'" class="fr" style="padding-right:5px">充值</span>
                  <span v-if="v.changeType=='D'" class="fr" style="padding-right:5px">销售订单</span>
                </div>
              </div>
            </div>
          </v-cell>
        </v-cell-group>
      </cube-scroll>
    </div>
    <van-popup v-model="showDetail" style="width:100%;height:100%;background:#f8f8f8" position="right">
      <v-header title="详情">
        <div slot="left" @click="showDetail=false">
          <v-icon name="icon-zuojiantou" color="#fff"></v-icon>
        </div>
      </v-header>
      <div v-if="detail">
        <v-br :height="40"></v-br>
        <!-- 不用小cell 因为有自定义的options -->
        <v-cell-group>
          <v-cell title="创建时间" :text="detail.createDate|timeFormat()"></v-cell>
          <v-cell title="交易类型" v-if="detail.srcBusType=='A1'" text="充值活动"></v-cell>
          <v-cell title="交易类型" v-if="detail.srcBusType=='A4'" text="充值活动赠送"></v-cell>
          <v-cell title="交易类型" v-if="detail.srcBusType=='A2'" text="直接充值"></v-cell>
          <v-cell title="交易类型" v-if="detail.srcBusType=='A3'" text="批量导入"></v-cell>
          <!-- 开单划卡 -->
          <v-cell title="交易类型" v-if="detail.srcBusType=='D1'" :text="detail.srcBusNo" :options="{textStyle:'color:#1690ff'}" @click.native="toDetail(detail.srcBusNo)"></v-cell>
          <v-cell title="交易金额" v-if="detail.changeType=='A'" :text="detail.money|currency('+￥')"></v-cell>
          <v-cell title="交易金额" v-if="detail.changeType=='D'" :text="detail.money|currency('-￥')"></v-cell>
          <v-cell title="账户余额" :text="detail.memberCard.moneyUsable|currency('￥')"></v-cell>
        </v-cell-group>
        <v-cell-group v-if="detail.srcBusType!='D1'" style="margin-bottom:0">
          <v-cell title="销售人" :text="detail.dealEmployee?detail.dealEmployee.name:' '"></v-cell>
          <!-- <v-cell title="备注" :text="detail.remarks"></v-cell> -->
        </v-cell-group>
        <v-remark v-if="detail.srcBusType!='D1'" v-model="detail.remarks" disabled></v-remark>
      </div>
    </van-popup>
  </div>

</template>

<script>
import OrderCustom from '../order/OrderCustom'
import cellOptions from '../../common/mixins/options.js'
import scroll from '../../common/mixins/scroll.js'
export default {
  components: {
    OrderCustom
  },
  mixins: [cellOptions, scroll],
  data() {
    return {
      item: '',
      data: [],
      infoData: '',
      tab: [
        { name: '全部', id: 0 },
        { name: '充值', id: 1 },
        { name: '消费', id: 2 }
      ],
      active: 0,
      query: {
        pageNo: 1,
        pageSize: 10,
        'memberCard.id': '',
        changeType: '',
        'memberCard.member.id': '',
        'memberCard.cardType': '1' // 储值卡
      },
      showDetail: false,
      totalPage: 0,
      detail: ''
    }
  },
  watch: {
    active: {
      handler(val) {
        switch (val) {
          case 0:
            this.query.changeType = ''
            this.query.pageNo = 1
            break
          case 1:
            this.query.changeType = 'A' // +
            this.query.pageNo = 1
            break
          case 2:
            this.query.changeType = 'D' // -
            this.query.pageNo = 1
            break
        }
      }
    }
  },
  computed: {
    orderOfCustom() {
      return this.$store.state.order.orderOfCustom
    }
  },
  methods: {
    async getData() {
      // TIP: 这是获取卡的领用记录
      let res = await this.$api.DISACCOUNT_CARD_RECORD(this.query)
      if (res.status === 1) {
        if (this.query.pageNo === 1) {
          this.data = res.page.list || []
        } else {
          this.data = this.data.concat(res.page.list || [])
        }
        this.infoData = res.data
        this.totalPage = res.page.totalPage
        this.$store.commit('ORDER_OF_CUSTOM', res.data.member)
      } else {
        console.error('获取储值卡流水失败')
      }
    },
    oneDetail(item) {
      this.detail = item
      this.showDetail = true
    },
    toCharge() {
      if (this.item) {
        this.$router.replace({ name: 'ChargeActive' })
      }
    },
    toDetail(oid) {
      this.$router.push({ name: 'OrderDetail', query: { oid: oid } })
    }
  },
  activated() {
    if (this.$route.query.accountCardId) {
      this.query['memberCard.id'] = this.$route.query.accountCardId
    }
    // if (this.$route.query.valuecarddetail) {
    //   this.query['memberCard.member.id'] = this.$route.query.memberId
    //   this.query['memberCard.id'] = ''
    //   this.item = JSON.parse(this.$route.query.data)
    //   this.getData()
    // }
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
.c-valuecard-cell {
  height: 60px;
  width: 100%;
  display: flex;
  background: #ffffff;
  margin-bottom: 1px;
  padding: 0 15px;
  &--left {
    flex: 1;
  }
  &--right {
    width: 100px;
    text-align: right;
    position: relative;
    .icon {
      position: absolute;
      right: -12;
      top: 22px;
    }
  }
  &--title {
    height: 30px;
    font-size: 14px;
    line-height: 40px;
    color: @primary-text;
  }
  &--des {
    height: 30px;
    font-size: 12px;
    line-height: 25px;
    color: @secondary-text;
  }
}
</style>
