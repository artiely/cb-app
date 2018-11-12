<template>
  <div>

    <v-header title="快单" :left-click="handleLeft"></v-header>
    <div class="c-scroll-wrapper-top-bottom">
      <cube-scroll ref="scroll" :data="orderOfCustom">
        <!-- <order-custom noHeader></order-custom> -->
        <v-br height="20"></v-br>
        <div style="display:flex;background:#e8e8e8">
          <order-custom noHeader style="flex:1;border-bottom-right-radius: 10px;border-top-right-radius: 10px;overflow:hidden" :search-to="{name:'OrderSearch',query:{src:'kuaidan'}}"></order-custom>
          <div style="width:65px;" class="order-base-info-box" @click="orderBaseInfoVisiable=true">
            <div class="order-base-info-card">
              <v-icon name="icon-dingdanjibenxinxi"></v-icon>
              <div>订单信息</div>
            </div>
          </div>
        </div>
        <v-cell title="客户名" v-model="newCustomName" v-if="newCustomTel" input></v-cell>
        <v-br :height="20"></v-br>
        <!-- TIP: 在条件为车辆，新车辆，新客户都是没法使用优惠券的 -->
        <v-business input @click.native="showKeyFunc" :cursor="showKeyboard" :money="orderPrice"></v-business>
        <v-br :height="20"></v-br>
        <v-cell-group v-if="couponList.length>0">
          <v-cell title="优惠券" class="order-total-price-color" link :descText="filterCoupon" :text="(couponList.length==0||filterCouponList.length==0)?'无可用券':(currCoupon?currCoupon.temp.name:filterCouponList.length+' 张可用')" @click.native="choiceCus"></v-cell>
          <!-- <v-cell title="抹零" input v-model="moneyErasing" type="number"></v-cell> -->
        </v-cell-group>
        <p style="font-size:12px;padding:0 15px;color:#666;line-height:1.2;margin-top:-10px;">快单：不用选择服务/商品，即可对客户快速收银或扣储值账户。</p>
        <!-- <div @click="orderBaseInfoVisiable=true" class="kuaidan-baseinfo">订单基本信息
          <v-icon name="icon-youjiantou1" color="#1690ff"></v-icon>
        </div> -->
        <v-remark v-model="remarks" title="结算备注"></v-remark>
      </cube-scroll>
    </div>
    <v-footer>
      <v-footer-item style="flex:2" class="footer-price">
        <div v-if="decMoney>0">
          <div class="footer-price-top">{{orderTotalPrice | currency( '￥')}}</div>
          <div class="footer-price-bottom">优惠金额：{{decMoney| currency( '￥')}}</div>
        </div>
        <div v-else>
          {{orderTotalPrice | currency( '￥')}}
        </div>
      </v-footer-item>
      <v-footer-item @click.native="toPayment">去结算</v-footer-item>
    </v-footer>
    <van-popup v-model="showPopup" position="bottom" style="width:100%;height:70%;background:#f0f0f0">
      <v-popup-title title="请选择券" @close="showPopup=false"></v-popup-title>
      <div class="c-card-coupon--wrapper" v-for="item in filterCouponList" :key="item.id" :class="{'active':currCoupon.id==item.id}" @click="choiceCoupon(item)">
        <div class="c-card-coupon--title clearfix ">
          <div class="c-card-coupon--title--left textover1" v-if="item.temp">{{item.temp.name}}
            <v-badge size="small " v-if="item.temp.type==2" color="#01d10c">礼品券</v-badge>
            <v-badge size="small " v-else color="#fe4a4e">代金券</v-badge>
          </div>
          <div class="c-card-coupon--title--right textover1 ">{{item.temp.moneyReduce|currency('￥')}}
          </div>
        </div>
        <div class="c-card-coupon--desc textover1 ">
          <span v-if="item.temp.type=='1'"> 使用条件：{{item.temp.moneyCondition|currency()}} 赠送金额:{{item.temp.moneyReduce|currency()}}</span>
          <span v-if="item.temp.type=='2'"> 使用条件：{{item.temp.moneyCondition|currency()}} 礼品价值：{{item.temp.moneyGift|currency()}}</span>
        </div>
        <div class="c-card-coupon--footer clearfix ">
          <div class="c-card-coupon--footer--left ">
            备注：{{item.temp.remarks}}
          </div>
          <div class="c-card-coupon--footer--dot " style="left:-10px "></div>
          <div class="c-card-coupon--footer--dot " style="right:-10px "></div>
        </div>
      </div>

    </van-popup>
    <!-- TIP:订单基本信息 -->
    <van-popup v-model="orderBaseInfoVisiable" position="right" style="height:100%;width:100%;background:#f0f0f0">
      <v-header title="订单基本信息" :left-click="closeBaseinfo"></v-header>
      <v-br :height="64"></v-br>
      <v-cell-group>
        <!-- <v-cell title="销售单号" :text="oid" v-if="oid"></v-cell> -->
        <v-cell title="纸质单号" input v-model="orderNoHand"></v-cell>
        <!--  -->
        <v-cell title="当前里程(km)" input v-model="motorMileCurrent" type="number"></v-cell>
        <v-cell title="进场时间" date v-model="startTime" link></v-cell>
      </v-cell-group>
      <v-cell-group style="margin-bottom:5px">
        <v-cell title="销售人" :text="currentStaff.name" link @click.native="staffVisible = true"></v-cell>
      </v-cell-group>
      <v-remark v-model="orderRemarks" placeholder="订单备注" :kdlist="1" @kjRemarkChecked="gteKjRemarkChecked"></v-remark>
      <v-upload :data="attachment"></v-upload>
      <v-footer>
        <v-footer-item @click.native="orderBaseInfoVisiable=false">保存</v-footer-item>
      </v-footer>
    </van-popup>
    <!-- TIP: 销售人 -->
    <van-popup v-model="staffVisible" style="width:100%;height:70%" position="bottom" :lock-scroll="false">
      <v-popup-title title="请选择" @close="staffVisible = false"></v-popup-title>
      <div class="popup-scroll-wrapper" v-if="staffList">
        <cube-scroll>
          <van-radio-group v-model="currentStaff.id">
            <van-cell-group>
              <van-cell :title="item.name" clickable @click.native="handleStaff(item)" v-for="item in staffList" :key="item.id">
                <van-radio :name="item.id" />
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </cube-scroll>
      </div>
    </van-popup>
    <!-- 结算账户 -->
    <account v-model="payPopupVisible" @pay="chargeSave" :password.sync="pwd" :totalPrice="orderTotalPrice" :memberId="memberId"></account>
    <van-number-keyboard :show="showKeyboard" :hide-on-click-outside="true" :transition="false" theme="custom" extra-key="." close-button-text="确定" @blur="handleOk" @input="onInput" @delete="onDelete" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Account from '../../components/Account'
import OrderCustom from '../order/OrderCustom'
export default {
  components: {
    Account,
    OrderCustom
  },
  data() {
    return {
      showKeyboard: false,
      staffVisible: false,
      pwd: '',
      orderBaseInfoVisiable: false,
      orderNoHand: '',
      currentStaff: '',
      motorMileCurrent: '',
      startTime: '',
      KeyValue: [],
      orderPrice: '', // 应收金额
      showMore: true,
      showPopup: false,
      payPopupVisible: false,
      radio: '',
      moreType: false,
      accountList: '',
      couponList: [],
      currCoupon: '',
      defaultAccount: '',
      newCustomName: '',
      moneyErasing: '',
      toast: '',
      orderRemarks: '',
      remarks: '',
      quickRemarksFlag: 0,
      filterCouponList: [],
      accounType: [
        {
          title: '现金账户',
          icon: '',
          color: ''
        },
        {
          title: '银行卡',
          icon: '',
          color: ''
        },
        {
          title: '现金账户',
          icon: '',
          color: ''
        },
        {
          title: '现金账户',
          icon: '',
          color: ''
        }
      ],
      kuaidanOrderData: '',
      isShow: 1
    }
  },
  computed: {
    filterCoupon() {
      let money = this.currCoupon.temp ? this.currCoupon.temp.moneyReduce : ''
      let gift = this.currCoupon.temp ? this.currCoupon.temp.moneyGift : ''
      let formatMoney = this.$options.filters['currency'](money, '-')
      let formatGift = this.$options.filters['currency'](gift)
      return formatMoney
        ? `优惠金额：${formatMoney}`
        : formatGift ? `礼品价值：${formatGift}` : ''
    },
    isCar() {
      return this.$store.getters.isCar
    },
    attachment: {
      get() {
        return this.$store.state.native.orderPicList
      },
      set() {}
    },
    decMoney() {
      let moneyErasing = this.moneyErasing ? this.moneyErasing : 0
      if (this.currCoupon) {
        // 券的金额（TIP:忽略满多少的条件）
        let moneyReduce = this.currCoupon.temp.moneyReduce
          ? this.currCoupon.temp.moneyReduce
          : 0

        return moneyErasing + moneyReduce
      } else {
        return moneyErasing
      }
    },
    orderTotalPrice() {
      let orderPrice = this.orderPrice ? this.orderPrice : 0
      let moneyErasing = this.moneyErasing ? this.moneyErasing : 0
      // 有券
      if (this.currCoupon) {
        // 券的金额（TIP:忽略满多少的条件）
        let moneyReduce = this.currCoupon.temp.moneyReduce
          ? this.currCoupon.temp.moneyReduce
          : 0

        return orderPrice - moneyReduce - moneyErasing >= 0
          ? orderPrice - moneyReduce - moneyErasing
          : 0
      } else {
        return orderPrice - moneyErasing > 0 ? orderPrice - moneyErasing : 0
      }
    },
    orderCustomInfo() {
      return this.$store.getters.orderCustomInfo
    },
    ...mapState({
      accountDefault: state => state.account.accountDefault,
      accountType: state => state.account.accountType,
      orderOfCustom: state => state.order.orderOfCustom,
      newCustomTel: state => state.order.newCustomTel,
      orderOfCar: state => state.order.orderOfCar,
      newCustomCar: state => state.order.newCustomCar
    }),
    memberId() {
      return this.orderOfCustom && this.orderOfCustom.id
        ? this.orderOfCustom.id
        : this.orderOfCar && this.orderOfCar.member
          ? this.orderOfCar.member.id
          : ''
    }
    // kuaidanOrderData() {
    //   return this.$store.state.order.kdOrderData
    // }
  },
  watch: {
    orderPrice: {
      handler(val) {
        this.filterCouponList = this.couponList.filter(v => {
          return v.temp.moneyCondition <= this.orderPrice
        })
        this.currCoupon = ''
      }
    },
    $route(to, from) {
      if (from.path === '/cashdesk' && to.path === '/index') {
        this.$store.commit('CLEAR_ORDER_DATA', 0)
      } else if (from.path === '/cashdesk' && to.path === '/ordersearch') {
        this.$store.commit('CLEAR_ORDER_DATA', 1)
      }
    }
  },
  methods: {
    closeBaseinfo() {
      this.orderBaseInfoVisiable = false
    },
    choiceCus() {
      if (this.couponList.length === 0 || this.filterCouponList.length === 0) {
        this.$toast.fail('无可用优惠券')
        return
      }
      this.showPopup = true
    },
    handleOk() {
      this.showKeyboard = false
      // this.toPayment()
    },
    showKeyFunc() {
      this.showKeyboard = true
    },
    onInput(value) {
      if (this.KeyValue.length <= 12) {
        this.KeyValue.push(value)
        this.orderPrice = this.KeyValue.join('')
      }
    },
    onDelete() {
      this.KeyValue.pop()
      this.orderPrice = this.KeyValue.join('')
    },
    handleStaff(item) {
      if (item === this.currentStaff) {
        this.currentStaff = ''
      } else {
        this.currentStaff = item
      }
      this.staffVisible = false
    },
    async getEmployee() {
      let res = await this.$api.EMPLOYEE_LIST()
      if (res.status === 1) {
        this.staffList = res.list
      }
    },
    choiceCoupon(item) {
      if (item.id === this.currCoupon.id) {
        this.currCoupon = ''
      } else {
        this.currCoupon = item
      }
      this.showPopup = false
    },
    toSearch() {
      this.$router.push('/searchcar')
    },
    toPayment() {
      if (!this.currCoupon && !this.remarks && !this.orderPrice) {
        this.$toast.fail('请输入应收金额')
      } else {
        this.payPopupVisible = true
      }
    },
    async getCustomCoupon() {
      let res = await this.$api.CUSTOM_OWN_COUPON({
        memberId: this.memberId
      })
      if (res.status === 1) {
        this.couponList = res.list || []
      } else {
        console.error('获取优惠券失败')
      }
    },

    async getCollect() {
      let data = {
        moneyErasing: this.moneyErasing,
        'member.id': this.orderOfCustom
          ? this.orderOfCustom.id
          : this.orderOfCar.member ? this.orderOfCar.member.id : '',
        'motor.id': this.orderOfCar
          ? this.orderOfCar.id
          : this.orderOfCustom.motor ? this.orderOfCustom.motor.id : '',
        isMemberCardCashier: this.accountType === '2' ? 1 : 0,
        financeAccountId: this.accountDefault.id,
        memberCardPwd: this.pwd,
        moneySrc: this.orderPrice,
        couponId: this.currCoupon.id,
        remarks: this.remarks,
        motorMileCurrent: this.motorMileCurrent,
        orderNoHand: this.orderNoHand,
        startTime: this.startTime,
        'sellEmployee.id': this.currentStaff.id || '',
        orderRemarks: this.orderRemarks,
        quickRemarksFlag: this.quickRemarksFlag,
        attachment: this.attachment.join(',')
      }
      if (!data['member.id'] && !data['motor.id']) {
        this.$toast('请选择客户/车辆')
        return
      }
      var toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        message: '收银中...'
      })
      setTimeout(() => {
        // 10s 没返回结果
        toast && toast.clear()
      }, 10000)
      // let res = await this.$api.CASHIER_COLLECT_MONEY(data)
      let res = await this.$api.QUICK_ORDER(data)
      toast && toast.clear()
      if (res.status === 1) {
        this.$toast.success('结算成功')
        this.payPopupVisible = false
        this.currCoupon = ''
        this.orderPrice = ''
        this.remarks = ''
        this.moneyErasing = ''
        this.pwd = ''
        this.couponList = []
        this.KeyValue = []
        this.orderRemarks = ''
        this.orderNoHand = ''
        this.motorMileCurrent = ''
        this.startTime = ''
        this.currentStaff = ''
        this.isShow = 1
        this.$store.commit('CLEAR_ORDER_CUSTOM')
        this.$router.replace({ name: 'Order', params: { refresh: true } })
      }
    },
    handleLeft() {
      this.currCoupon = ''
      this.orderPrice = ''
      this.remarks = ''
      this.moneyErasing = ''
      this.pwd = ''
      this.couponList = []
      this.KeyValue = []
      this.orderRemarks = ''
      this.orderNoHand = ''
      this.motorMileCurrent = ''
      this.startTime = ''
      this.currentStaff = ''
      this.$router.back()
    },
    chargeSave() {
      this.passwordKey = true
      this.getCollect()
    },
    gteKjRemarkChecked(item) {
      console.log('获取到当前的item =', item)
      if (item === true) {
        this.quickRemarksFlag = 1
      } else {
        this.quickRemarksFlag = 0
      }
    },
    isNull() {
      this.currCoupon = ''
      this.orderPrice = ''
      this.remarks = ''
      this.moneyErasing = ''
      this.pwd = ''
      this.couponList = []
      this.KeyValue = []
      this.orderRemarks = ''
      this.orderNoHand = ''
      this.motorMileCurrent = ''
      this.startTime = ''
      this.currentStaff = ''
      this.isShow = 1
    }
  },
  activated() {
    this.couponList = []
    this.getEmployee()
    this.kuaidanOrderData = this.$store.state.order.kdOrderData
    console.log('打印当前的开单订单状态 =', this.kuaidanOrderData)
    if (this.kuaidanOrderData === 0) {
      this.isNull()
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';
.kuaidan-baseinfo {
  font-size: 16px;
  padding-left: 15px;
  color: #999;
  .icon {
    font-size: 16px;
  }
}
.bank-icon {
  .icon {
    font-size: 22px;
    margin-right: 5px;
  }
}

.card-popup-item {
  height: 60px;
  width: 90%;
  background: #f8f8f8;
  position: relative;
  overflow: hidden;
  margin: 5px auto;
  &.active {
    border: 1px solid @primary;
  }
  .card-popup-flex {
    display: flex;
    padding: 0 8px;
  }
  .card-popup-name {
    height: 40px;
    line-height: 45px;
    overflow: hidden;
    font-size: 15px;
    font-weight: 500;
  }
  .card-popup-condition {
    height: 20px;
    height: 20px;
    line-height: 1;
    font-size: 12px;
  }
  .card-popup-title {
    height: 60px;
    overflow: hidden;
    font-size: 15px;
  }
  .card-popup-price {
    color: @danger;
    line-height: 60px;
    flex: 1;
    text-align: right;
  }
  .dot-line {
    position: relative;
    margin-left: -8px;
    &.fr {
      margin-left: none;
      margin-right: -8px;
    }
  }
  .dot-item {
    height: 10px;
    width: 10px;
    background: #ffffff;
    border-radius: 50%;
    margin: 2px;
    line-height: 60px;
  }
}
.pay-money {
  flex-direction: column;
  display: flex;
  text-align: left;
  height: 100%;
  line-height: 100%;
  .price-total {
    height: 100%;
    line-height: 50px;
    text-align: left;
    padding-left: 15px;
  }
  .other-info {
    height: 25px;
    line-height: 25px;
    font-size: 14px;
    color: #333;
  }
}
.order-total-price-color {
  .c_cell_input {
    color: red !important;
    font-size: 18px !important;
  }
}
.cb-cell-title {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  background: #fff;
  text-align: center;
}
.pay-money {
  background: #ffffff;
  color: @success;
}
.c_cell .title-icon .icon.icon-xiaotubiao-25 {
  color: #0dcc6d !important;
}
.search-wrapper {
  margin-top: 40px;
  background: #ffffff;
  padding: 5px 0;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 99;
}
.c--scroll-wrapper {
  position: fixed;
  top: 90px;
  bottom: 50px;
  width: 100%;
}

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(100%);
}
</style>
