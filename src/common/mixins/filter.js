/**
 * 所有的筛选条件
 */
import moment from 'dayjs'
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
          name: '销售订单',
          id: 6
        },
        {
          name: '充值',
          id: 7
        },
        {
          name: '办卡',
          id: 8
        },
        {
          name: '直接收银',
          id: 9
        },
        {
          name: '记一笔',
          id: 2
        },
        {
          name: '采购订单',
          id: 1
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
          name: '银行/卡',
          id: 1
        },
        {
          name: '支付宝',
          id: 2
        },
        {
          name: '微信支付',
          id: 3
        }
      ],
      date: [
        {
          name: '全部',
          id: ''
        },
        {
          name: '今日',
          id: 5
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
      curraccountType: {
        name: '全部',
        id: ''
      },
      currdate: {
        name: '全部',
        id: ''
      },
      user: '',
      car: '',
      // 以下订单列表的筛选
      oid: '',
      orderAccountType: [
        {
          name: '全部',
          id: ''
        },
        {
          name: '现金',
          id: 1
        },
        {
          name: '银行/卡',
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
        },
        {
          name: '其他',
          id: 0
        }
      ],
      currorderAccountType: {
        name: '全部',
        id: ''
      },
      orderUser: '',
      currClasoedate: { name: '不显示已关闭订单', id: 0, closeFlag: '0' },
      closeDate: [
        { name: '不显示已关闭订单', id: 0, closeFlag: '0' },
        { name: '仅显示已关闭订单', id: 1, closeFlag: '1' }
      ]
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
      },
      deep: true
    },
    car: {
      handler(val) {
        if (val) {
          this.query['searchParameter.keyWord'] = val.id
        } else {
          this.query['searchParameter.keyWord'] = ''
        }
        this.query.pageNo = 1
      },
      deep: true
    },
    curraccountType: {
      handler(val) {
        if (val) {
          this.query.accountType = val.id
        } else {
          this.query.accountType = ''
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
    currserviceType: {
      handler(val) {
        if (val) {
          this.query.serviceType = val.id
        } else {
          this.query.serviceType = ''
        }
        this.query.pageNo = 1
      },
      deep: true
    },
    currdate: {
      handler(val) {
        if (val) {
          switch (val.name) {
            case '全部':
              this.query['searchParameter.starTime'] = ''
              this.query['searchParameter.endTime'] = ''
              break
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
          this.oid = ''
          // 有值的情况清楚其他
          this.query['searchParameter.keyWord'] = ''
        } else {
          this.query['tradePhone'] = ''
        }
        this.query.pageNo = 1
      },
      deep: true
    },
    oid: {
      handler(val) {
        if (val) {
          this.query['orderNo'] = val.id
          this.user = ''
          // 有值的情况清楚其他
          this.query['searchParameter.keyWord'] = ''
        } else {
          this.query['orderNo'] = ''
        }
        this.query.pageNo = 1
      },
      deep: true
    },
    orderUser: {
      handler(val) {
        if (val) {
          // this.query['memberUsername'] = val.id
          this.query['member.id'] = val.id
          // 有值的情况清楚其他
          this.query['searchParameter.keyWord'] = ''
        } else {
          // this.query['memberUsername'] = ''
          this.query['member.id'] = ''
        }
        this.query.pageNo = 1
      },
      deep: true
    },
    currClasoedate: {
      handler(val) {
        if (val) {
          this.query['closeFlag'] = val.closeFlag
        } else {
          this.query['closeFlag'] = '0'
        }
        this.query.pageNo = 1
      },
      deep: true
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
      let car = this.car && this.car.id !== '' ? this.car : null
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
      let currClasoedate = this.currClasoedate && this.currClasoedate.id !== 0 ? this.currClasoedate : null
      return [
        balanceType,
        date,
        oid,
        user,
        car,
        orderUser,
        currentAccount,
        currentOrderAccount,
        currentService,
        currClasoedate
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
    changeCloseDate__(item) {
      this.currClasoedate = item
      // this.query.closeFlag = item.closeFlag
      // this.query.pageNo = 1
    },
    changeAccount__(item) {
      this.curraccountType = item
    },
    changeOrderAccount__(item) {
      this.currorderAccountType = item
      // this.query['chargeType'] = item.id
      // this.query.pageNo = 1
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
        } else if (item === this.car) {
          this.car = ''
        } else if (item === this.orderUser) {
          this.orderUser = ''
        } else if (item === this.curraccountType) {
          this.curraccountType = ''
        } else if (item === this.currorderAccountType) {
          this.currorderAccountType = ''
        } else if (item === this.currserviceType) {
          this.currserviceType = ''
        } else if (item === this.currClasoedate) {
          this.currClasoedate = { name: '不显示已关闭订单', id: 0, closeFlag: '0' }
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
      this.currorderAccountType = {
        name: '全部',
        id: ''
      }
      this.orderUser = ''
      this.currbalanceType = ''
      this.currserviceType = ''
      this.curraccountType = {
        name: '全部',
        id: ''
      }
      this.currdate = {
        name: '全部',
        id: ''
      }
      this.user = ''
      this.query.closeFlag = ''
      this.currClasoedate = { name: '不显示已关闭订单', id: 0, closeFlag: '0' }
    }
  },
  activated() {
    if (this.$route.query.user) {
      this.user = {
        name: this.$route.query.user,
        id: this.$route.query.user
      }
    }
    if (this.$route.params.user) {
      this.orderUser = this.$route.params.user
      this.active = this.$route.params.active
      this.oid = ''
    } else {
      this.orderUser = ''
    }
    if (this.$route.params.oid) {
      this.oid = this.$route.params.oid
      this.orderUser = ''
    } else {
      this.oid = ''
    }
    if (this.$route.params.car) {
      this.car = this.$route.params.car
      this.active = this.$route.params.active
    }
  }
}
