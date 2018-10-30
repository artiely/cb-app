<template>

</template>

<script>
export default {
  data() {
    return {
      filterBarList: [],
      // 以下收支流水的筛选
      balanceType: [
        {
          name: '全部',
          id: ''
        },
        {
          name: '收入',
          id: 0
        },
        {
          name: '支出',
          id: 1
        }
      ],
      serviceType: [
        {
          name: '全部',
          id: ''
        },
        {
          name: '收款单',
          id: 0
        },
        {
          name: '付款单',
          id: 1
        },
        {
          name: '记一笔',
          id: 2
        },
        {
          name: '库存盘点',
          id: 3
        },
        {
          name: '账户初期',
          id: 4
        },
        {
          name: '出入库',
          id: 5
        }
      ],
      accountType: [
        {
          name: '全部',
          id: ''
        },
        {
          name: '现金',
          id: 0
        },
        {
          name: '银行卡',
          id: 1
        },
        {
          name: '支付宝',
          id: 2
        },
        {
          name: '微信支付',
          id: 3
        },
        {
          name: '储值账户',
          id: 99
        }
      ],
      date: [
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
      ],
      currbalanceType: '',
      currserviceType: '',
      curraccountType: '',
      currdate: '',
      user: '',
      // 以下订单列表的筛选
      orderAccountType: [
        {
          name: '全部',
          id: ''
        },
        {
          name: '无',
          id: 0
        },
        {
          name: '现金',
          id: 1
        },
        {
          name: '银行卡',
          id: 2
        },
        {
          name: '支付宝',
          id: 3
        },
        {
          name: '微信支付',
          id: 4
        },
        {
          name: '储值账户',
          id: 5
        },
        {
          name: '折扣卡',
          id: 6
        },
        {
          name: '次卡',
          id: 7
        }
      ],
      currorderAccountType: '',
      orderUser: ''
    }
  },
  watch: {
    filter: {
      handler(val) {
        this.filterBarList = val
      },
      deep: true
    },
    currbalanceType: {
      handler(val) {
        if (val) {
          this.query.recordType = val.id
        } else {
          this.query.recordType = ''
        }
        this.query.pageNo = 1
      }
    },
    curraccountType: {
      handler(val) {
        if (val) {
          this.query.accountType = val.id
        } else {
          this.query.accountType = ''
        }
        this.query.pageNo = 1
      }
    },
    currorderAccountType: {
      handler(val) {
        if (val) {
          this.query['chargeType'] = val.id
        } else {
          this.query['chargeType'] = ''
        }
        this.query.pageNo = 1
      },
      deep: true
    },
    currserviceType: {
      handler(val) {
        if (val) {
          this.query.serviceType = val.id
        } else {
          this.query.serviceType = ''
        }
        this.query.pageNo = 1
      }
    },
    currdate: {
      handler(val) {
        if (val) {
          switch (val.name) {
            case '今日':
              this.query['searchParameter.starTime'] =
                moment()
                  .startOf('day')
                  .format('YYYY-MM-DD') + ' 00:00:00'
              this.query['searchParameter.endTime'] =
                moment().format('YYYY-MM-DD') + ' 23:59:59'
              break
            case '本周':
              this.query['searchParameter.starTime'] =
                moment()
                  .startOf('week')
                  .format('YYYY-MM-DD') + ' 00:00:00'
              this.query['searchParameter.endTime'] =
                moment().format('YYYY-MM-DD') + ' 23:59:59'
              break
            case '本月':
              this.query['searchParameter.starTime'] =
                moment()
                  .startOf('month')
                  .format('YYYY-MM-DD') + ' 00:00:00'
              this.query['searchParameter.endTime'] =
                moment().format('YYYY-MM-DD') + ' 23:59:59'
              break
            case '上月':
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
            case '本年度':
              this.query['searchParameter.starTime'] =
                moment()
                  .startOf('year')
                  .startOf('month')
                  .format('YYYY-MM-DD') + ' 00:00:00'
              this.query['searchParameter.endTime'] =
                moment().format('YYYY-MM-DD') + ' 23:59:59'
              break
          }
        } else {
          this.query['searchParameter.starTime'] = ''
          this.query['searchParameter.endTime'] = ''
        }
        this.query.pageNo = 1
      },
      deep: true
    },
    user: {
      handler(val) {
        if (val) {
          this.query['tradePhone'] = val.id
        } else {
          this.query['tradePhone'] = ''
        }
        this.query.pageNo = 1
      }
    },
    oid: {
      handler(val) {
        if (val) {
          this.query['orderNo'] = val.id
        } else {
          this.query['orderNo'] = ''
        }
        this.query.pageNo = 1
      },
      deep: true
    },
    currorderAccountType: {
      handler(val) {
        if (val) {
          this.query['chargeType'] = val.id
        } else {
          this.query['chargeType'] = ''
        }
        this.query.pageNo = 1
      },
      deep: true
    },
    orderUser: {
      handler(val) {
        if (val) {
          this.query['member.id'] = val.id
        } else {
          this.query['member.id'] = ''
        }
        this.query.pageNo = 1
      }
    }
  },
  computed: {
    filter() {
      let balanceType =
        this.currbalanceType && this.currbalanceType.id !== ''
          ? this.currbalanceType
          : null
      let date = this.currdate && this.currdate.id !== '' ? this.currdate : null

      let oid = this.oid && this.oid.id !== '' ? this.oid : null

      let user = this.user && this.user.id !== '' ? this.user : null
      let orderUser =
        this.orderUser && this.orderUser.id !== '' ? this.orderUser : null

      let currentAccount =
        this.curraccountType && this.curraccountType.id !== ''
          ? this.curraccountType
          : null

      let currentOrderAccount =
        this.currorderAccountType && this.currorderAccountType.id !== ''
          ? this.currorderAccountType
          : null
      let currentService =
        this.currserviceType && this.currserviceType.id !== ''
          ? this.currserviceType
          : null
      return [
        balanceType,
        date,
        oid,
        user,
        orderUser,
        currentAccount,
        currentOrderAccount,
        currentService
      ].filter(v => {
        if (v) {
          return v
        }
      })
    }
  },
  methods: {
    changeBalance__(item) {
      this.currbalanceType = item
    },
    changeAccount__(item) {
      this.curraccountType = item
    },
    changeOrderAccount__(item) {
      this.currorderAccountType = item
    },
    changeService__(item) {
      this.currserviceType = item
    },
    changeDate__(item) {
      this.currdate = item
    },
    changeFilter__(item) {
      this.filterBarList = this.filterBarList.filter(v => {
        if (item === this.currbalanceType) {
          this.currbalanceType = ''
        } else if (item === this.currdate) {
          this.currdate = ''
        } else if (item === this.oid) {
          this.oid = ''
        } else if (item === this.user) {
          this.user = ''
        } else if (item === this.orderUser) {
          this.orderUser = ''
        } else if (item === this.curraccountType) {
          this.curraccountType = ''
        } else if (item === this.currorderAccountType) {
          this.currorderAccountType = ''
        } else if (item === this.currserviceType) {
          this.currserviceType = ''
        }
        if (v !== item) {
          return v
        }
      })
    },
    handleReset() {
      this.query['status'] = ''
      this.query['statusPay'] = ''
      this.query['pageNo'] = 1
      this.query['chargeType'] = ''
      this.query['searchParameter.starTime'] = ''
      this.query['searchParameter.endTime'] = ''
      this.query['member.id'] = ''
      this.query['orderNo'] = ''
      this.query['tradePhone'] = ''
      this.query.accountType = ''
      this.currentType = ''
      this.currentDate = ''
      this.query.recordType = ''
      this.currorderAccountType = ''
      this.orderUser = ''
      this.currbalanceType = ''
      this.currserviceType = ''
      this.curraccountType = ''
      this.currdate = ''
      this.user = ''
    }
  },
  activated() {
    if (this.$route.query.user) {
      this.user = {
        name: this.$route.query.user,
        id: this.$route.query.user
      }
    }
    if (this.$route.query.oid) {
      this.$set(this.oid, 'name', this.$route.query.oid)
      this.$set(this.oid, 'id', this.$route.query.oid)
    }
    if (this.$route.params.user) {
      this.user = this.$route.params.user
      this.active = this.$route.params.active
    }
  }
}
</script>

<style>
</style>
