<template>
  <div>
    <v-header :left-click="handleLeft" :border="false">
      <div slot="title">
        <v-tab-bar :data="tabData" v-model="active" type="btn"></v-tab-bar>
      </div>
    </v-header>

    <v-scroll-page top="44" bottom="50">
      <cube-scroll :data="activeCardList">
        <!-- <div class="c_tab--wrapper-new">
            
          </div> -->
        <!-- TIP: 充值 -->
        <v-br height="20"></v-br>
        <div>
          <div style="display:flex;background:#e8e8e8">
            <order-custom style="flex:1;border-bottom-right-radius: 10px;border-top-right-radius:10px;overflow:hidden" :search-to="{name:'OrderSearch',query:{src:'chargeactive'}}" required placeholder="客户" noHeader></order-custom>
            <div style="width:65px;" class="order-base-info-box" @click="orderBaseInfoVisiable=true">
              <div class="order-base-info-card">
                <v-icon name="icon-dingdanjibenxinxi"></v-icon>
                <div>更多信息</div>
              </div>
            </div>
          </div>
          <v-br :height="20"></v-br>
          <v-business-card :data="activeCardList" :name="currentActiveType?currentActiveType.name:''" v-if="active==0" @choice="handleActiveType" @add="handleActiveType" noDataTip="暂无可用充值活动" placeholder="请选择充值活动" :currentCard="currentActiveType"></v-business-card>
          <v-business :data="activeCardList" input :cursor="showKeyboard" v-if="active==1" :money="chargePrice" @click.native="showKeyFunc"></v-business>
          <!-- <v-sale-people v-model="currentStaff"></v-sale-people>
          <v-remark v-model="remarks" ></v-remark> -->
        </div>
      </cube-scroll>

    </v-scroll-page>
    <!-- TIP: 活动 -->
    <van-popup v-model="activeTypeVisible" style="width:100%;height:70%" position="bottom" :lock-scroll="false" class="popup-radius">
      <v-popup-title title="请选择充值活动" @close="activeTypeVisible = false"></v-popup-title>
      <div class="popup-scroll-wrapper popup-scroll-wrapper-new" style="background:#fff;top: 70px; bottom: 50px;">
        <cube-scroll :data="activeCardList" ref="popup-scroll">
          <div class="card-active--wrapper" v-for="item in activeCardList" :key="item.id" @click="handleActive(item)">
            <div style="padding:5px 12px;">
              <v-cb-card :currentCard="item"></v-cb-card>
            </div>
            <div class="card-active-radio">
              <v-icon :name="currentActiveType.id==item.id?'icon-queding1':'icon-yuan'"></v-icon>
            </div>
          </div>
        </cube-scroll>
      </div>
      <div key="新增充值活动" class="addNewcar1 addCar" @click="toCard" style="color:#1690ff">
        <v-icon name="icon-add_bg" color="#fff"></v-icon> 新增充值活动
      </div>
    </van-popup>
    <v-footer>
      <v-footer-item class="footer-price">
        <div>{{totalPrice|currency("￥")}}</div>
      </v-footer-item>
      <v-footer-item @click.native="toPayment">去结算</v-footer-item>
    </v-footer>
    <!-- 结算账户 -->
    <account v-model="payPopupVisible" @pay="chargeSave" :totalPrice="totalPrice"></account>
    <van-number-keyboard :show="showKeyboard" :hide-on-click-outside="true" :transition="false" theme="custom" extra-key="." close-button-text="确定" @blur="handleOk" @input="onInput" @delete="onDelete" />

    <!-- TIP:订单基本信息 -->
    <van-popup v-model="orderBaseInfoVisiable" position="right" style="height:100%;width:100%;background:#f0f0f0">
      <v-header title="更多信息" :left-click="closeBaseinfo"></v-header>
      <v-br :height="64"></v-br>
      <v-cell-group>
        <v-cell title="销售人" :text="currentStaff.name" link @click.native="staffVisible = true"></v-cell>
      </v-cell-group>
      <v-remark v-model="remarks" placeholder="添加备注..."></v-remark>
      <v-footer>
        <v-footer-item @click.native="orderBaseInfoVisiable=false">保存</v-footer-item>
      </v-footer>
    </van-popup>
    <!-- TIP: 销售人 -->
    <van-popup v-model="staffVisible" style="width:100%;height:70%" position="bottom">
      <v-popup-title title="请选择" @close="staffVisible = false"></v-popup-title>
      <div class="popup-scroll-wrapper" style="top:70px;overflow-y:scroll" v-if="staffList">
        <!-- <cube-scroll> -->
        <van-radio-group v-model="currentStaff.id">
          <van-cell-group>
            <van-cell :title="item.name" clickable @click.native="handleStaff(item)" v-for="item in staffList" :key="item.id">
              <van-radio :name="item.id" />
            </van-cell>
          </van-cell-group>
        </van-radio-group>
        <!-- </cube-scroll> -->
      </div>
    </van-popup>
  </div>
</template>

<script>
import Account from '../../components/Account'
import { mapState } from 'vuex'
import OrderCustom from '../order/OrderCustom'
export default {
  components: {
    Account,
    OrderCustom
  },
  data() {
    return {
      showKeyboard: false,
      active: 0,
      KeyValue: [],
      activeTypeVisible: false,
      staffVisible: false,
      newCustomName: '',
      currentActiveType: '', // 当前选择的活动卡
      activeCardList: [], // 活动卡
      currentStaff: '', // 当前选择的员工
      activeTotalPage: 0,
      payPopupVisible: false,
      moreType: false,
      defaultAccount: false,
      accountList: '',
      staffList: [],
      orderBaseInfoVisiable: false,
      remarks: '',
      query: {
        pageNo: 1,
        pageSize: 100
      },
      chargePrice: '',
      toast: null,
      tabData: [
        {
          name: '充值活动',
          id: 0
        },
        {
          name: '直接充值',
          id: 1
        }
      ],
      id: ''
    }
  },
  computed: {
    filterActiveMoney() {
      // 充值金额
      let money = this.currentActiveType ? this.currentActiveType.money : ''
      let formatMoney = this.$options.filters['currency'](money)
      // 赠送金额
      let moneyGift = this.currentActiveType
        ? this.currentActiveType.moneyGift
        : ''
      let formatGift = this.$options.filters['currency'](moneyGift)
      if (formatMoney && formatGift && this.active === 0) {
        return `面值:${this.$options.filters['currency'](
          money + moneyGift
        )} 赠送:${formatGift}`
      }
    },
    totalPrice() {
      if (this.active === 0) {
        // 活动
        return this.currentActiveType ? this.currentActiveType.money : 0
      } else {
        // 直接充值
        return this.chargePrice ? this.chargePrice : 0
      }
    },
    ...mapState({
      accountDefault: state => state.account.accountDefault,
      orderOfCustom: state => state.order.orderOfCustom,
      orderOfCar: state => state.order.orderOfCar,
      newCustomTel: state => state.order.newCustomTel
    })
  },
  watch: {
    activeCardList: {
      handler(val) {
        if (this.id) {
          const findIdIndex = element => {
            return element.id === this.id
          }
          let i = val.findIndex(findIdIndex)
          if (i !== -1) {
            this.currentActiveType = val[i]
          } else {
            this.currentActiveType = val[0]
          }
        } else {
          this.currentActiveType = val[0]
        }
      }
    },
    active: {
      handler(val) {
        if (val === 1) {
          this.showKeyboard = true
        } else {
          this.showKeyboard = false
        }
      },
      immediate: true
    },
    id: {
      handler(val) {
        if (this.activeCardList.length > 0) {
          const findIdIndex = element => {
            return element.id === val
          }
          let i = this.activeCardList.findIndex(findIdIndex)
          if (i !== -1) {
            this.currentActiveType = this.activeCardList[i]
          } else {
            this.currentActiveType = this.activeCardList[0]
          }
        } else {
          this.currentActiveType = this.activeCardList[0]
        }
      }
    },
    activeTypeVisible: {
      handler(val) {
        if (val) {
          setTimeout(() => {
            this.$refs['popup-scroll'].refresh()
          }, 500)
        }
      }
    }
  },
  methods: {
    handleActiveType() {
      // 没活动就去新增
      if (this.activeCardList.length === 0) {
        this.$router.push('/newchargeactive')
      } else {
        this.activeTypeVisible = true
      }
    },
    closeBaseinfo() {
      this.orderBaseInfoVisiable = false
    },
    async getEmployee() {
      let res = await this.$api.EMPLOYEE_LIST()
      if (res.status === 1) {
        this.staffList = res.list
      }
    },
    handleOk() {
      this.showKeyboard = false
      // this.toPayment()
    },
    toCard() {
      this.$router.push('/newchargeactive')
    },
    showKeyFunc() {
      this.showKeyboard = true
    },
    onInput(value) {
      if (this.KeyValue.length <= 12) {
        this.KeyValue.push(value)
        this.chargePrice = this.KeyValue.join('')
      }
    },
    onDelete() {
      this.KeyValue.pop()
      this.chargePrice = this.KeyValue.join('')
    },
    handleAccount(item) {
      this.defaultAccount = item
      this.moreType = false
    },
    toPayment() {
      if (!this.orderOfCustom && !(this.orderOfCar && this.orderOfCar.member)) {
        this.$toast.fail('请选择客户')
      } else if (this.active === 0 && !this.currentActiveType.id) {
        this.$toast.fail('请选择您要办理的卡活动')
      } else if (this.chargePrice === '' && this.active === 1) {
        this.$toast.fail('充值金额不能为零')
      } else if (this.totalPrice === '0') {
        this.$toast.fail('充值金额不能为零')
      } else {
        this.payPopupVisible = true
      }
    },
    chargeSave() {
      this.payPopupVisible = false
      this.handleSave()
    },
    async handleSave() {
      var _toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        message: '结算中...'
      })
      setTimeout(() => {
        // 10s 没返回结果
        _toast && _toast.clear()
      }, 10000)
      let data = {
        memberPhone:
          this.orderOfCustom && this.orderOfCustom.username
            ? this.orderOfCustom.username
            : this.orderOfCar && this.orderOfCar.member
              ? this.orderOfCar.member.username
              : '',
        memberName:
          this.orderOfCustom && this.orderOfCustom.name
            ? this.orderOfCustom.name
            : this.orderOfCar && this.orderOfCar.member
              ? this.orderOfCar.member.name
              : '',
        'transact.id': this.active === 0 ? this.currentActiveType.id : '',
        'sellEmployee.id': this.currentStaff.id || '',
        moneyRecharge: this.active === 1 ? this.totalPrice : '',
        remarks: this.remarks,
        'financeAccount.id': this.accountDefault.id
      }
      if (!data.memberPhone) {
        this.$toast.fail('请选择客户')
        return
      } else if (!this.currentActiveType && !this.chargePrice) {
        this.$toast('请选择活动或直接充值')
        return
      }
      let res = await this.$api.ACCOUNT_CARD_SAVE(data)
      _toast && _toast.clear()
      if (res.status === 1) {
        this.$toast.success('充值成功')
        this.$store.commit('ORDER_OF_CUSTOM', '')
        this.$store.commit('REFRESH')
        this.$router.replace('/index')
        this.currentStaff = ''
        this.currentActiveType = ''
        this.remarks = ''
        this.chargePrice = ''
        this.KeyValue = []
      } else {
        this.$toast.fail('充值失败')
      }
    },
    async getData() {
      let res = await this.$api.ACCOUNT_CARD_LIST(this.query)
      if (res.status === 1) {
        console.log('打印活动列表中的数据 =', res)
        if (this.query.pageNo === 1) {
          this.activeCardList = res.page.list || []
        } else {
          this.activeCardList = this.activeCardList.concat(res.page.list || [])
        }
        // this.staffList = res.list
        this.activeTotalPage = res.totalPage
        this.currentActiveType = res.page.list ? res.page.list[0] : {}
      } else {
        console.error('获取卡列表失败')
      }
    },
    handleActive(item) {
      if (item.id === this.currentActiveType.id) {
        this.currentActiveType = ''
      } else {
        this.currentActiveType = item
      }
      this.activeTypeVisible = false
    },
    toSearch() {
      this.$router.push({ name: 'SearchCus' })
    },
    handleLeft() {
      this.chargePrice = ''
      this.KeyValue = []
      this.remarks = ''
      this.currentStaff = ''
      this.currentActiveType = ''
      this.$router.back()
    },
    handleStaff(item) {
      if (item === this.currentStaff) {
        this.currentStaff = ''
      } else {
        this.currentStaff = item
      }
      this.staffVisible = false
    }
  },
  activated() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.active = 0
    } else if (this.$route.query.active && this.$route.query.active === '1') {
      this.active = 1
    }
    this.getData()
    this.getEmployee()
  },
  mounted() {
    // this.$nextTick(() => {
    //   document.addEventListener(
    //     'touchend',
    //     function() {
    //       document.getElementById('remark') &&
    //         document.getElementById('remark').blur()
    //     },
    //     false
    //   )
    // })
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';
.cb-price--box {
  height: 80px;
  overflow: hidden;
  padding: 0 15px;
  background: #fff;
}
.key-input--label {
  font-size: 18px;
  width: 120px;
  float: left;
  padding-left: 20px;
}
.key-input--price {
  float: right;
  padding-left: 120px;
  margin-left: -120px;
  width: 100%;
  height: 100%;
}
.key-input-disabled {
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: left;
  font-size: 24px;
  font-weight: 500;
  border-bottom: 2px solid #eeeeee;
}
.card-popup {
  &--wrapper {
    width: 95%;
    background: #f8f8f8;
    border: 1px solid @border;
    text-align: center;
    margin: 5px auto;
    height: 120px;
    border-radius: 6px;
    &.active {
      border: 1px solid @primary;
    }
  }
  &--title {
    font-size: 15px;
    line-height: 40px;
    font-weight: 600;
    color: @primary-text;
  }
  &--price {
    font-size: 15px;
    color: @danger;
    line-height: 20px;
    height: 20px;
  }
  &--desc {
    color: @secondary-text;
    font-size: 12px;
    height: 30px;
    line-height: 20px;
  }
  &--remark {
    color: #666666;
    font-size: 14px;
    height: 30px;

    line-height: 30px;
    .borderT(@dividers);
  }
}

.popup-scroll-wrapper-new {
  .card-active--wrapper {
    position: relative;
    padding: 5px 35px 5px 10px;
    .card-active-radio {
      width: 35px;
      text-align: center;
      line-height: 150px;
      position: absolute;
      right: 9px;
      top: 0;
      .icon {
        font-size: 22px !important;
        color: #eee !important;
        &.icon-queding1 {
          color: @primary!important;
        }
      }
    }
  }
  .card-active {
    // box-shadow: 0 1px 4px rgba(204, 204, 204, 0.5);
    position: relative;
    height: 110px;
    flex: 1;
  }
  .active-remark {
    // flex: 1;
    width: 200px;
  }
  .active-icon {
    display: none;
    position: absolute;
    top: 26px;
    right: 5px;
  }
  .active .active-icon {
    display: block;
  }
  .card-active .card-active-footer .card-active-footer-item {
    background: none;
    display: flex;
  }
  .card-active .active-price {
    position: relative;
    display: inline-block;
    flex: 1;
    text-align: right;
    padding-right: 15px;
    font-size: 20px;
  }
}
.SearchCus {
  .c_order--custom--link {
    display: none;
  }
  .c_order--custom--main {
    color: #999;
  }
}
.c_tab--wrapper-new {
  background: #f8f8f8;
  .c_tab--wrapper {
    margin: 0 15px;
    height: auto;
  }
}
</style>
