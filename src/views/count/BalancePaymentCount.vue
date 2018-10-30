<template>
  <div class="balance-payment" style="background:#fff">
    <v-header title="收支账本" righttext="明细" @right-click="toList" :border="false">
      <div slot="title">
        <v-tab-bar type="btn" :data="[{name:'按账户',id:0},{name:'按科目',id:1}]" v-model="active"></v-tab-bar>
      </div>
    </v-header>
    <v-br height="44" />
    <div class="cb-sclect">
      <div class="cb-sclect-item" @click="openIncomeType">{{incomeType.name}}
        <v-icon name="icon-iconfontarrows"></v-icon>
      </div>
      <div class="cb-sclect-item" v-if="active == 0" @click="openZhKmType">{{subjectType.name}}
        <v-icon name="icon-iconfontarrows"></v-icon>
      </div>
      <div class="cb-sclect-item" v-else @click="openZhKmType">{{accountType.name}}
        <v-icon name="icon-iconfontarrows"></v-icon>
      </div>
      <div class="cb-sclect-item" @click="opentimeType">{{timeType.name}}
        <v-icon name="icon-iconfontarrows"></v-icon>
      </div>
    </div>
    <v-scroll-page top="84" style="background:#fff">
      <cube-scroll :data="active">
        <div>
          <div class="big-money">
            <span key="收入" v-if="query.recordType==='0'" style="color:#0dcc6d">{{bigMoney|currency()}}</span>
            <span key="支出" v-else-if="query.recordType==1" style="color:#d73962">{{bigMoney|currency()}}</span>
            <span key="支出" v-else style="color:#333">{{bigMoney|currency()}}</span>
            <div style="font-size:14px;color:#999;margin-top:5px;" v-if="active==1&&incomeType.name=='全部类型'">收入 - 支出</div>
            <div style="font-size:14px;color:#999;margin-top:5px;" v-else>合计</div>
          </div>
        </div>
        <keep-alive>
          <div v-if="active == 1 && query.recordType == ''">
            <div class="titleIncome">收入
              <span class="fr" style="padding-right:10px;font-weight:600">{{ incomeDataCount|currency()}}</span>
            </div>
            <div style="padding: 0 30px;">
              <v-cell-group class="balance-count-cell">
                <div v-for="item in incomeData" :key="item.id" class="recoredType-item">
                  <v-cell :title="item.subject.name" v-if="item.subject && item.subject.accountRule == '0'" :text="item.moneyIncome|currency()" link value=" " @click.native="DetaiType(item.subject)"></v-cell>
                </div>
              </v-cell-group>
            </div>
            <div class="titleExpend">支出
              <span class="fr" style="padding-right:10px;font-weight:600">{{expendDataCount |currency()}}</span>
            </div>
            <div style="padding: 0 30px;">
              <v-cell-group class="balance-count-cell">
                <div v-for="item in expendData" :key="item.id" class="recoredType-item">
                  <v-cell :title="item.subject.name" v-if="item.subject && item.subject.accountRule == '1'" :text="item.moneySpend|currency()" link value=" " @click.native="DetaiType(item.subject)"></v-cell>
                </div>
              </v-cell-group>
            </div>
          </div>
          <div v-else>
            <v-cell-group style="padding: 0 30px;" class="balance-count-cell">
              <div v-for="item in data" :key="item.id" class="recoredType-item">
                <v-cell v-if="active == 0 && query.recordType === '0'" :title="item.financeAccount&&item.financeAccount.accountName" :text="item.moneyIncome|currency()" link value=" " @click.native="DetaiType(item.financeAccount)"></v-cell>
                <v-cell v-else-if="active == 0 && query.recordType == 1" :title="item.financeAccount&&item.financeAccount.accountName" :text="item.moneySpend|currency()" link value=" " @click.native="DetaiType(item.financeAccount)"></v-cell>
                <v-cell v-else-if="active == 0 && query.recordType === ''" :title="item.financeAccount&&item.financeAccount.accountName" :text="item.money|currency()" link value=" " @click.native="DetaiType(item.financeAccount)"></v-cell>
                <v-cell v-else-if="active == 1 && query.recordType === '0'" :title="item.subject.name" :text="item.moneyIncome|currency()" link value=" " @click.native="DetaiType(item.subject)"></v-cell>
                <v-cell v-else-if="active == 1 && query.recordType == 1" :title="item.subject.name" :text="item.moneySpend|currency()" link value=" " @click.native="DetaiType(item.subject)"></v-cell>
                <v-cell v-else-if="active == 1 && query.recordType === ''" :title="item.subject.name" :text="item.money|currency()" link value=" " @click.native="DetaiType(item.subject)"></v-cell>
              </div>
            </v-cell-group>
          </div>

        </keep-alive>
      </cube-scroll>
    </v-scroll-page>
    <!-- <div class="detailList" @click="toList">明细</div> -->

    <!--收支类型-->
    <van-actionsheet v-model="actionsshow" :actions="actions" class="my-actionsheet">
      <div class="actionsheet-box-wrapper">
        <div class="actionsheet-box actionsheet-box-border" @click="incomeTypeFun(item)" v-for="item in actionsData" :key="item.id">
          {{item.name}}
        </div>
      </div>
      <v-br></v-br>
      <div class="actionsheet-box-wrapper" @click="actionsshow=false">
        <div class="actionsheet-box" style="color:#666;height:60px;line-height:60px">
          取消
        </div>
      </div>
    </van-actionsheet>

    <!--账户/科目-->
    <van-popup v-model="shigongShow" position="bottom" style="width:100%;height:60%;overflow:hidden;background:#fff" class="popup-radius" :lock-scroll="false">
      <v-popup-title :title="popupTitle" @close="shigongShow=false" style="z-index:99;position:relative"></v-popup-title>
      <div class="popup-scroll-wrapper" style="top:60px;bottom:0;overflow-y:auto">
        <div class="storeStaff-parent-box" v-if="active==0">
          <!-- <v-cell-group style="margin-bottom:0">
            <v-cell title="全部科目" @click.native="ZhKmTypeFun({name:'全部科目',id:''})">
              <div slot="right">
                <v-icon :name="accountType.id==''?'icon-queding1':'icon-yuan'"></v-icon>
              </div>
            </v-cell>
          </v-cell-group> -->
          <!-- <div v-for="(parent,index) in storeStaff" :key="index">
            <div class="storeStaff-parent">
              {{parent.name ? parent.name:parent.accountName}}
            </div>
            <v-cell-group style="margin-bottom:0">
              <v-cell v-for="item in parent.subList" :title="item.name ? item.name:item.accountName" :key="item.id" @click.native="ZhKmTypeFun(item)">
                <div slot="right">
                  <v-icon :name="accountType.id==item.id?'icon-queding1':'icon-yuan'"></v-icon>
                </div>
              </v-cell>
            </v-cell-group>
          </div> -->
          <van-picker :columns="columns" @change="onChange" />
        </div>
        <div v-else class="storeStaff-parent-box">
          <v-cell-group style="margin-bottom:0">
            <v-cell v-for="item in storeStaff" :title="item.name ? item.name:item.accountName" :key="item.id" @click.native="ZhKmTypeFun(item)">
              <div slot="right">
                <v-icon :name="accountType.id==item.id?'icon-queding1':'icon-yuan'"></v-icon>
              </div>
            </v-cell>
          </v-cell-group>
        </div>
      </div>
    </van-popup>

    <!--时间-->
    <van-actionsheet v-model="timeshow" :actions="actions" class="my-actionsheet">
      <div class="actionsheet-box-wrapper">
        <div class="actionsheet-box actionsheet-box-border" v-for="item in time" :key="item.id" @click="timeshowTypeFun(item)">
          {{item.name}}
        </div>
      </div>
      <v-br></v-br>
      <div class="actionsheet-box-wrapper" @click="timeshow=false">
        <div class="actionsheet-box" style="color:#666;height:60px;line-height:60px">
          取消
        </div>
      </div>
    </van-actionsheet>

    <van-popup v-model="customtimeshow" style="width:100%;height:70%" position="bottom">
      <v-popup-title title="自定义时间" @close="customtimeshow=false"></v-popup-title>
      <div style="padding:15px">
        <div class="filter-title">起始时间：<input type="text" placeholder="请选择" readonly :value="query['searchParameter.starTime']|timeFormat('YYYY-MM-DD')"></div>
        <div class="filter-title">结束时间：<input type="text" placeholder="请选择" readonly :value="query['searchParameter.endTime']|timeFormat('YYYY-MM-DD')"></div>
      </div>
      <van-datetime-picker :title="timeTitle" v-model="currentDate" type="date" @cancel="cancel" @confirm="confirm" confirm-button-text="确定" />
    </van-popup>
  </div>
</template>

<script>
import BalancePaymentItem from './BalancePaymentItem'
import scroll from '../../common/mixins/scroll.js'
import moment from 'dayjs'
export default {
  components: {
    BalancePaymentItem
  },
  mixins: [scroll],
  data() {
    return {
      timeTitle: '起始时间',
      expendDataCount: 0,
      incomeDataCount: 0,
      incomeData: [],
      expendData: [],
      currentDate: new Date(),
      customtimeshow: false, // 自定义时间
      timeshow: false, // 时间选择
      shigongShow: false, // 账户科目
      actionsshow: false, // 收支类型
      incomeType: { name: '全部类型', id: '' }, // 收支类型
      accountType: { name: '全部账户', id: '' }, // 账户类型
      subjectType: { name: '全部科目', id: '' }, // 账户类型
      timeType: { name: '全部时间', id: '' }, // 时间类型
      popupTitle: '科目',
      type: true,
      // kmResult: '',
      subJectList: [], // 科目、
      storeStaff: [], // 账户
      query: {
        groupType: '4', // 统计分组类型（1：账户类型，2：业务类型，3：所属科目，4：账户)
        recordType: '', // 记录类型 0 收入 1 支出 2 不变更
        recordNo: '',
        'subject.id': '',
        'financeAccount.id': '',
        createDateType: '5', // （1：今日 2：本周 3：本月 4：上月 5：本年度)
        'searchParameter.starTime': '',
        'searchParameter.endTime': ''
      },
      data: '',
      isStart: true,
      bigMoney: 0,
      active: 1,
      currTime: {
        name: '今日',
        id: '0'
      },
      transmit: {
        'subject.id': '',
        'financeAccount.id': ''
      },
      actionsData: [
        {
          name: '全部类型',
          id: ''
        },
        {
          name: '收入',
          id: '0'
        },
        {
          name: '支出',
          id: '1'
        }
      ],
      time: [
        {
          name: '全部时间',
          id: ''
        },
        {
          name: '今日',
          id: '1'
        },
        {
          name: '本周',
          id: '2'
        },
        {
          name: '本月',
          id: '3'
        },
        {
          name: '自定义',
          id: '4'
        }
      ]
      // columns: [
      //   {
      //     values: '',
      //     className: 'column1'
      //   },
      //   {
      //     values: '',
      //     className: 'column2',
      //     defaultIndex: 2
      //   }
      // ]
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
        if (val === 0) {
          this.popupTitle = '科目'
          this.query.groupType = 4
          this.accountType = { name: '全部账户', id: '' }
          this.query['subject.id'] = ''
          this.query['financeAccount.id'] = ''
        } else {
          this.popupTitle = '账户'
          this.query.groupType = 3
          this.accountType = { name: '全部账户', id: '' }
          this.query['subject.id'] = ''
          this.query['financeAccount.id'] = ''
        }
        this.timeType = { name: '全部时间', id: '' }
        this.query.createDateType = ''
        this.incomeType = { name: '全部类型', id: '' }
        this.query.recordType = ''
        this.query['searchParameter.starTime'] = ''
        this.query['searchParameter.endTime'] = ''
        this.getSubject()
      },
      immediate: true
    },
    query: {
      handler(value) {
        if (value['searchParameter.starTime']) {
          this.timeTitle = '结束时间'
        } else {
          this.timeTitle = '起始时间'
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    listenScroll() {
      return this.expendData.concat(this.data)
    },
    columns() {
      let val1 = this.subJectList.map(v => {
        return v.name
      })
      let val2 = this.subJectList[0].subList.map(v => {
        return v.name
      })
      return [{ values: val1 }, { values: val2 }]
    }
    // incomeDataCoun() {
    //   return this.incomeData.reduce((x, y) => {
    //     return x.moneyIncome + y.moneyIncome
    //   })
    // },
    // expendDataCount() {
    //   return this.incomeData.reduce((x, y) => {
    //     return x.moneySpend + y.moneySpend
    //   })
    // }
  },
  methods: {
    onChange(picker, values) {
      let index = picker.getIndexes()
      console.log('当前的index', index)
      let val2 = this.subJectList[index[0]].subList.map(v => {
        return v.name
      })
      picker.setColumnValues(1, val2)
      this.query['subject.id'] = this.subJectList[index[0]].subList[index[1]].id
      this.subjectType = this.subJectList[index[0]].subList[index[1]]
      this.query['financeAccount.id'] = ''
    },
    cancel() {
      this.query['searchParameter.starTime'] = ''
      this.query['searchParameter.endTime'] = ''
      this.timeType = { name: '全部时间', id: '' }
      this.createDateType = ''
      this.customtimeshow = false
    },
    confirm(value) {
      this.query.createDateType = ''
      if (
        this.query['searchParameter.starTime'] &&
        !this.query['searchParameter.endTime']
      ) {
        this.query['searchParameter.endTime'] =
          moment(value).format('YYYY-MM-DD') + ' 23:59:59'
        setTimeout(() => {
          this.customtimeshow = false
        }, 1000)
      }
      if (
        !this.query['searchParameter.starTime'] &&
        !this.query['searchParameter.endTime']
      ) {
        this.query['searchParameter.starTime'] =
          moment(value).format('YYYY-MM-DD') + ' 00:00:00'
      }
    },
    DetaiType(item) {
      if (this.active === 0) {
        this.query['financeAccount.id'] = item.id
      } else {
        this.query['subject.id'] = item.id
      }
      this.$router.push({
        name: 'BalancePaymentHistory',
        params: {
          parameter: this.query,
          // params: [this.accountType, this.incomeType, this.timeType, item],
          accountType: this.accountType,
          incomeType: this.incomeType,
          timeType: this.timeType,
          subject: item
        }
      })
    },
    ZhKmTypeFun(item) {
      this.shigongShow = false
      // this.kmResult = item.id
      item.name = item.name ? item.name : item.accountName
      this.accountType = item
      if (this.active === 0) {
        this.query['subject.id'] = item.id
        this.query['financeAccount.id'] = ''
      } else {
        this.query['subject.id'] = ''
        this.query['financeAccount.id'] = item.id
      }
    },
    openZhKmType() {
      this.shigongShow = true
    },
    incomeTypeFun(item) {
      this.incomeType = item
      this.query.recordType = item.id
      this.actionsshow = false
    },
    openIncomeType() {
      this.actionsshow = true
    },
    opentimeType(data) {
      this.timeshow = true
    },
    timeshowTypeFun(item) {
      if (item.name === '自定义') {
        this.customtimeshow = true
      } else {
        this.query.createDateType = item.id
      }
      this.query['searchParameter.starTime'] = ''
      this.query['searchParameter.endTime'] = ''
      this.timeType = item
      this.timeshow = false
    },
    changeType() {
      this.type = !this.type
    },
    handleTime(item) {
      this.currTime = item
    },
    async getSubject() {
      let res = await this.$api.SUBJECT_LIST()
      if (res.status === 1) {
        this.subJectList = []
        this.subJectList = res.list || []
        this.subJectList.unshift({
          name: '全部科目',
          id: '',
          subList: [{ name: '全部科目', id: '' }]
        })
      }
    },
    async getData() {
      this.bigMoney = 0
      const toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        message: '加载中...'
      })
      setTimeout(() => {
        toast && toast.clear()
      }, 10000)
      let res = await this.$api.FINANCE_RECORD_SUM(this.query)
      toast && toast.clear()
      if (res.status === 1) {
        this.incomeData = []
        this.expendData = []
        this.storeStaff = []
        this.storeStaff = res.data || []
        // this.storeStaff.unshift({name:'全部账户',id:''})
        // subjectArr.push(res.data||[])
        this.data = res.list || []
        if (this.active === 1) {
          for (let i = 0; i < this.data.length; i++) {
            if (
              this.data[i].subject &&
              this.data[i].subject.accountRule === '0'
            ) {
              this.incomeData.push(this.data[i])
            } else {
              this.expendData.push(this.data[i])
            }
          }
          this.incomeDataCount = this.incomeData.reduce((prev, y) => {
            return prev + y.moneyIncome
          }, 0)

          this.expendDataCount = this.expendData.reduce((prev, y) => {
            return prev + y.moneySpend
          }, 0)
        }
        for (let i = 0; i < this.data.length; i++) {
          if (this.query.recordType === '0') {
            this.bigMoney += this.data[i].moneyIncome
          } else if (this.query.recordType === '1') {
            this.bigMoney += this.data[i].moneySpend
          } else {
            this.bigMoney += this.data[i].money
          }
        }
      } else {
        console.error(res.status + '获取收支统计失败')
      }
    },
    toList() {
      this.$router.push({
        name: 'BalancePaymentHistory',
        params: {
          parameter: this.query,
          accountType: this.accountType,
          incomeType: this.incomeType,
          timeType: this.timeType
        }
      })
    }
  },
  activated() {
    this.accountType = { name: '全部账户', id: '' }
    this.timeType = { name: '全部时间', id: '' }
    this.incomeType = { name: '全部类型', id: '' }
    this.query['subject.id'] = ''
    this.query['financeAccount.id'] = ''
    this.query['searchParameter.starTime'] = ''
    this.query['searchParameter.endTime'] = ''
    this.transmit['financeAccount.id'] = ''
    this.transmit['subject.id'] = ''
    this.query.createDateType = ''
    this.query.recordType = ''
    this.getSubject()
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
.storeStaff-parent-box {
  .icon {
    font-size: 22px;
    &.icon-queding1 {
      color: @primary!important;
    }
  }
  .c_cell .title {
    color: #333;
  }
}
.storeStaff-parent {
  padding: 8px 15px;
  color: #999;
  border-bottom: 1px solid #ddd;
}
.balance-count-cell {
  .icon {
    margin-left: 10px;
  }
  .text .fr {
    font-weight: 500;
  }
}
.balance-payment--type {
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
  .icon {
    color: @primary!important;
    font-size: 24px;
  }
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
  padding-bottom: 23px;
}
.selectType {
  margin-top: 10px;
  text-align: center;
  font-size: 10px;
  display: flex;
  padding: 0 10px;
  .selectTypeList {
    position: relative;
    flex: 1;
    height: 22px;
    overflow: hidden;
    margin: 2px;
    display: inline-block;
    background: #f0f0f0;
    padding: 5px;
    text-align: left;
    color: #666;
    box-sizing: border-box;
    border-radius: 4px;
    .v_icon--wrapper {
      position: absolute;
      right: 3px;
      top: 4px;
      .icon {
        font-size: 10px;
      }
    }
  }
}
.detailList {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #1690ff !important;
}
.titleIncome,
.titleExpend {
  margin: 0 30px 0 30px;
  padding-left: 5px;
  color: #19ce74;
  height: 30px;
  line-height: 30px;
  background: #e6fff3;
  border-left: 3px solid #19ce74;
}
.titleExpend {
  margin-top: 20px;
  color: #d73962;
  background: #ffe5ec;
  border-left: 3px solid #d73962;
}
.selectName {
  flex: 1;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
  vertical-align: top;
}

@media screen and (max-width: 350px) {
  .selectType .selectTypeList {
    font-size: 10px;
  }
}
</style>
