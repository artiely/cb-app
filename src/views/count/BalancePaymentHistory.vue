<template>
  <div class="BalancePaymentHistorBox">
    <!-- <v-header title="收支流水" @right-click="filterVisiable=true" righticon="icon-xiaotubiao-20"></v-header> -->
    <!-- 去掉了删选 -->
    <v-header title="收支流水" :border="false"></v-header>
    <v-search placeholder="客户/供应商/单号" v-model="keywords"></v-search>
    <div class="c-scroll-wrapper-top-search">
      <cube-scroll ref="scroll" :data="data" @pulling-up="onPullingUp" :options="options" @pulling-down="onPullingDown">
        <filter-bar :data="filterBarList" @change-filter="changeFilter__"></filter-bar>
        <div v-if='data.length>0'>
          <div v-for="item in data" :key="item.id" class="itemClass">
            <balance-payment-item :data="item" class="incomeList"></balance-payment-item>
          </div>
        </div>
        <!-- <v-nopayment v-else></v-nopayment> -->
        <v-nodata v-else placeholder="无收支流水"></v-nodata>
      </cube-scroll>
    </div>
    <van-popup v-model="filterVisiable " position="right " style="width:80%;height:100%; ">

      <v-popup-title @close="filterVisiable=false "></v-popup-title>
      <div class="popup-innerbox " style="padding:10px ">
        <div class="filter-title ">收支类型</div>
        <van-row gutter="10 ">
          <van-col span="8 " v-for="(item) in balanceType " :key="item.name " @click.native="changeBalance__(item) " style="margin-bottom:10px; ">
            <v-button :type="item.id===currbalanceType.id? 'primary-solid': '' ">{{item.name}} </v-button>
          </van-col>
        </van-row>
        <div class="filter-title ">业务类型</div>
        <van-row gutter="10 ">
          <van-col span="8 " v-for="(item) in serviceType " :key="item.name " @click.native="changeService__(item) " style="margin-bottom:10px; ">
            <v-button :type="item.id===currserviceType.id? 'primary-solid': '' ">{{item.name}} </v-button>
          </van-col>
        </van-row>
        <div class="filter-title ">结算方式</div>
        <van-row gutter="10 ">
          <van-col span="8 " v-for="(item) in accountType " :key="item.name " @click.native="changeAccount__(item) " style="margin-bottom:10px; ">
            <v-button :type="item.id===curraccountType.id? 'primary-solid': '' ">{{item.name}} </v-button>
          </van-col>
        </van-row>
        <div class="filter-title ">按结算时间</div>
        <van-row gutter="10">
          <van-col span="8 " v-for="(item) in date " :key="item.name " @click.native="changeDate__(item) " style="margin-bottom:10px; ">
            <v-button :type="item.id==currdate.id? 'primary-solid': '' ">{{item.name}} </v-button>
          </van-col>
        </van-row>
      </div>
      <v-footer>
        <v-footer-item class="footer-white" @click.native="handleReset ">重置</v-footer-item>
        <v-footer-item @click.native="filterVisiable=false ">确定</v-footer-item>
      </v-footer>
    </van-popup>
    <van-popup v-model="moreCtrlShow" style="width:120px;height:80px;left:60px;top:0px" position="top">
      <div class="order-ctrl-btn" @click="toComplete">批量完工</div>
      <div class="order-ctrl-btn">批量关闭</div>
    </van-popup>
  </div>
</template>

<script>
import BalancePaymentItem from './BalancePaymentItem'
import FilterBar from '../../components/FilterBar'
import filter__ from '../../common/mixins/filter.js'
import scroll from '../../common/mixins/scroll.js'
export default {
  components: {
    BalancePaymentItem,
    FilterBar
  },
  mixins: [filter__, scroll],
  data() {
    return {
      query: {
        pageNo: 1,
        pageSize: 10,
        // groupType: '', // 统计分组类型（1：账户类型，2：业务类型，3：所属科目，4：账户)
        recordNo: '',
        accountType: '',
        recordType: '',
        serviceType: '',
        tradePhone: '',
        'subject.id': '',
        'financeAccount.id': '',
        createDateType: '', // （1：今日 2：本周 3：本月 4：上月 5：本年度)
        'searchParameter.starTime': '',
        'searchParameter.endTime': '',
        'searchParameter.keyWord': ''
      },
      keywords: '',
      filterVisiable: false,
      data: '',
      totalPage: 0,
      timer: null,
      filterBarList: []
    }
  },
  watch: {
    keywords: {
      handler(val) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.query['searchParameter.keyWord'] = val
          this.query.pageNo = 1
        }, 500)
      }
    }
  },
  methods: {
    async getData() {
      let res = await this.$api.FINANCE_RECORD_LIST(this.query)
      if (res.status === 1) {
        if (this.query.pageNo === 1) {
          this.data = res.page.list || []
        } else {
          this.data = this.data.concat(res.page.list || [])
        }
        this.data = this.data.map(v => {
          v.serviceTypeText = this.$options.filters['serviceTypeFormat'](
            v.serviceType
          )
          return v
        })
        this.totalPage = res.page.totalPage
      } else {
        console.error(res.status + '获取收支流失失败')
      }
    },
    changeFilter__(item) {
      this.filterBarList = this.filterBarList.filter(v => {
        if (item.id === this.query.recordType) {
          this.query.recordType = ''
        } else if (item.id === this.query['subject.id']) {
          this.query['subject.id'] = ''
        } else if (item.id === this.query['financeAccount.id']) {
          this.query['financeAccount.id'] = ''
        } else if (item.id === this.$route.params.timeType.id) {
          this.query['searchParameter.starTime'] = ''
          this.query['searchParameter.endTime'] = ''
          this.query.createDateType = ''
        }
        if (v !== item) {
          return v
        }
      })
    }
  },
  created() {
    this.getData()
  },
  activated() {
    this.query['pageNo'] = 1
    if (this.$route.params.parameter) {
      //  this.query = this.$route.params.parameter
      this.query.recordNo = this.$route.params.parameter.recordNo

      // this.query.createDateType = this.$route.params.parameter.createDateType // （1：今日 2：本周 3：本月 4：上月 5：本年度)
      // this.query['searchParameter.starTime'] = this.$route.params.timeType['searchParameter.starTime']
      // this.query['searchParameter.endTime'] = this.$route.params.timeType['searchParameter.endTime']

      if (this.$route.params) {
        this.query.createDateType = this.$route.params.timeType.id || ''
        this.query.recordType = this.$route.params.incomeType.id || '' // 记录类型 0 收入 1 支出 2 不变更
        this.query['subject.id'] = this.$route.params.subject
          ? this.$route.params.subject.id
          : ''
        this.query['financeAccount.id'] =
          this.$route.params.accountType.id || ''
        let filterBar = [
          this.$route.params.incomeType,
          this.$route.params.subject
            ? this.$route.params.subject
            : { name: '全部科目', id: '' },
          this.$route.params.accountType,
          this.$route.params.timeType
        ]
        this.filterBarList = filterBar.filter(v => {
          return (
            v.name !== '全部类型' &&
            v.name !== '全部账户' &&
            v.name !== '全部时间' &&
            v.name !== '全部科目'
          )
        })
      }
    }
    if (this.$route.query.tradePhone) {
      this.keywords = this.$route.query.tradePhone
    } else {
      this.keywords = ''
    }
  }
}
</script>

<style lang="less">
.BalancePaymentHistorBox {
  .itemClass {
    padding-left: 16px;
    background-color: #fff;
  }
  .itemClass:last-child .incomeList {
    border-bottom: none;
  }
  .balance-payment {
    .c-fixed--header {
      height: 50px;
      background: #eeeeee;
      width: 100%;
    }
  }
  .incomeList {
    padding: 0 16px 0 0;
    height: 70px;
    border-bottom: 1px solid #e8e8e8;
    .c_balance_payment--header--tel {
      text-align: left;
      padding-top: 5px;
    }
    .c_balance_payment--header {
      font-size: 18px;
      font-weight: 500;
      color: #333333;
      padding: 12px 0 6px 0;
      height: auto;
      line-height: 20px;
    }
    .c_balance_payment--footer {
      width: 100%;
      padding: 0;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-image: none;
      .fl {
        color: #999;
      }
    }
    .c_balance_payment--money {
      margin-top: 0;
      font-size: 18px;
      font-weight: 500;
      max-width: 135px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
