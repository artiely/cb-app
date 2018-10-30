<template>
  <div class="balance-payment">
    <v-header title="收支统计"  @right-click="toList" righttext="明细"></v-header>
    <div class="c-scroll-wrapper-top">
      <v-tab-bar :data="[{name:'收入',id:0},{name:'支出',id:1}]" v-model="active"></v-tab-bar>
      <van-row gutter="10" style="padding:10px;">
        <van-col style="width:20%" v-for="item in time" :key="item.id">
          <v-button :type="currTime.id==item.id?'primary':''" @click.native="handleTime(item)">{{item.name}}</v-button>
        </van-col>
      </van-row>
      <div>
        <div class="big-money">
          <span key="收入" v-if="active==0" style="color:#0dcc6d">{{bigMoney|currency()}}</span>
          <span key="支出" v-else style="color:#d73962">{{bigMoney|currency()}}</span>
          <div class="change-btn"   @click="changeType">
            <v-icon name="icon-neirongqiehuan"></v-icon>
          </div>
        </div>
      </div>
      <div class="balance-payment--type">
        <span v-if="type">按付款方式</span> <span  v-else>按收银方式</span>
      </div>
      <div v-for="item in data" :key="item.id" class="recoredType-item">
        <van-row  style="padding: 0 50px;">
          <van-col span="12" class="recoredType-item-center" style="text-align:left"> {{item.type}}</van-col>
          <van-col span="12" class="recoredType-item-center" style="text-align:right">{{ item.money|currency()}}</van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
import BalancePaymentItem from './BalancePaymentItem'
import moment from 'dayjs'
export default {
  components: {
    BalancePaymentItem
  },
  data() {
    return {
      type: true,
      query: {
        recordType: '0', // 记录类型 0 收入 1 支出 2 不变更
        'searchParameter.starTime': '',
        'searchParameter.endTime': '',
        groupType: 1
      },
      data: '',
      bigMoney: 0,
      active: 0,
      currTime: {
        name: '今日',
        id: 0
      },
      time: [
        {
          name: '今日',
          id: 0
        },
        {
          name: '本周',
          id: 1
        },
        {
          name: '本月',
          id: 2
        },
        {
          name: '上月',
          id: 3
        },
        {
          name: '本年度',
          id: 4
        }
      ]
    }
  },
  watch: {
    type: {
      handler(val) {
        this.bigMoney = 0
        this.query.groupType = val ? 1 : 2
      }
    },
    currTime: {
      handler(val) {
        this.bigMoney = 0
        switch (val.id) {
          case 0:
            this.query['searchParameter.starTime'] =
              moment()
                .startOf('day')
                .format('YYYY-MM-DD') + ' 00:00:00'
            this.query['searchParameter.endTime'] =
              moment().format('YYYY-MM-DD') + ' 23:59:59'
            break
          case 1:
            this.query['searchParameter.starTime'] =
              moment()
                .startOf('week')
                .format('YYYY-MM-DD') + ' 00:00:00'
            this.query['searchParameter.endTime'] =
              moment().format('YYYY-MM-DD') + ' 23:59:59'
            break
          case 2:
            this.query['searchParameter.starTime'] =
              moment()
                .startOf('month')
                .format('YYYY-MM-DD') + ' 00:00:00'
            this.query['searchParameter.endTime'] =
              moment().format('YYYY-MM-DD') + ' 23:59:59'
            break
          case 3:
            this.query['searchParameter.starTime'] =
              moment()
                .subtract(1, 'month')
                .startOf('month')
                .format('YYYY-MM-DD') + ' 00:00:00'
            this.query['searchParameter.endTime'] =
              moment()
                .subtract(1, 'month')
                .endOf('month')
                .format('YYYY-MM-DD') + ' 23:59:59'
            break
          case 4:
            this.query['searchParameter.starTime'] =
              moment()
                .startOf('year')
                .startOf('month')
                .format('YYYY-MM-DD') + ' 00:00:00'
            this.query['searchParameter.endTime'] =
              moment().format('YYYY-MM-DD') + ' 23:59:59'
            break
        }
      }
    },
    active: {
      handler(val) {
        this.bigMoney = 0
        this.query.recordType = val
      }
    },
    query: {
      handler() {
        this.bigMoney = 0
        this.getData()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    changeType() {
      if (this.type) {
        this.type = false
      } else {
        this.type = true
      }
    },
    handleTime(item) {
      this.currTime = item
    },
    async getData() {
      this.bigMoney = 0
      const toast = this.$toast.loading({
        duration: 0,       // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        message: '加载中...'
      })
      setTimeout(() => {
        toast && toast.clear()
      }, 10000)
      let res = await this.$api.FINANCE_RECORD_COUNT(this.query)
      toast && toast.clear()
      if (res.status === 1) {
        let data = res.list || []
        this.data = data.map(v => {
          this.bigMoney += v.money
          let type = ''
          if (v.serviceType) {
            type = this.$options.filters['serviceTypeFormat'](v.serviceType)
          } else {
            switch (v.accountType) { // 财务账户类型：0 现金，1 银行卡 2 支付宝 3 微信（copy FinanceAccount记录中的账户类型）99 储值卡
              case '0':
                type = '现金'
                break
              case '1':
                type = '银行/卡'
                break
              case '2':
                type = '支付宝'
                break
              case '3':
                type = '微信'
                break
              case '99':
                type = '储值卡'
                break
            }
          }
          v.type = type
          return v
        })
      } else {
        console.error(res.status + '获取收支统计失败')
      }
    },
    toList() {
      this.$router.push('/balancepaymenthistory')
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
.balance-payment--type{
  text-align: center;
  font-size: 16px;
  color: #333;
  padding-bottom: 20px;
}
.change-btn {
  width: 40px;
  height: 40px;
  padding-top: 8px;
  border-radius: 2px;
  font-size: 12px;
  text-align: center;
  position: absolute;
  top: 45px;
  right: 15px;
  line-height: 1;
  .icon{
    color: @primary!important;
    font-size: 24px
  }
}
.recoredType-item {
  height: 40px;
  line-height: 40px;
}
.balance-payment {
  background: #ffffff;
}
.recoredType-item-center {
  text-align: center;
  color: #333;
}
.big-money {
  position: relative;
  font-size: 34px;
  text-align: center;
  padding-top: 50px;
  padding-bottom: 40px;
}
</style>
