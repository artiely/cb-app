<template>
  <div>
    <v-header title="结算" :left-click="handleLeft">
    </v-header>
    <div class="c-scroll-wrapper-top-bottom">
      <cube-scroll>
        <v-br :height="15"></v-br>
        <div class="jiesuan-custion-top" v-if="data.order">
          <div>{{data.order.motorLicence|carIdFormat()}}&nbsp;&nbsp;
            <span v-if="data.order.memberUsername">{{data.order.memberUsername|telFormat()}}</span>&nbsp;&nbsp;
            <span v-if="data.order.memberName">{{data.order.memberName}} </span>
          </div>
          <!-- <div></div> -->
        </div>
        <div class="jiesuan-custion-top--moneyleft" v-if="data.order">
          {{data.order.moneyLeft|currency('￥')}}
          <p style="font-size:14px;color:#999;padding-top:5px">应收金额</p>
        </div>
        <!-- 用券
        场景1 无客户车辆
        场景2 有客户
        场景3 有车辆
        场景4 新车辆
        场景5 新客户
        总结 只有有客户的情况下才有券
          有客户还的区分是否有券 -->
        <v-br :height="5"></v-br>
        <v-cell-group>
          <v-cell v-if="data.order&&data.order.member" title="优惠券" :link="couponList.length!==0&&filterCouponList.length!==0" :text="(couponList.length==0||filterCouponList.length==0)?'无可用券':(currCoupon?currCoupon.name:filterCouponList.length+' 张可用')" @click.native="showCoupon" />
          <v-cell title="抹零" input v-model="query.moneyErasing" type="number" currency :maxValue="maxMoney"></v-cell>
        </v-cell-group>
        <div class="jiesuan-input-box">
          <p class="jiesuan-input--tip">本次结算金额
            <span style="color:red">*</span>
          </p>
          <input type="number" class="jiesuan-input--input" v-model="query.money">
          <v-icon name="icon-rmb1" class="jiesuan-input--rmb"></v-icon>
        </div>
        <div class="jiesuan-moneyleft-tip" v-if="nextPayMoney!=0">待收金额:{{nextPayMoney|currency('￥')}}</div>
        <v-remark v-model="query.remarks" placeholder="结算备注"></v-remark>
        <v-br :height="40"></v-br>
      </cube-scroll>
      <v-footer>
        <v-footer-item @click.native="toPay"> 确定</v-footer-item>
      </v-footer>
    </div>

    <!-- 券 -->
    <van-popup v-model="couponShow" position="bottom" style="width:100%;height:70%;background:#f0f0f0" :lock-scroll="false">
      <v-popup-title title="请选择券" @close="couponShow=false"></v-popup-title>
      <div class="popup-scroll-wrapper" style="top:70px;">
        <!-- <cube-scroll v-if="couponList" :data="filterCouponList">
          <div class="c-card-coupon--wrapper " v-for="item in filterCouponList " :class="{ 'active':currCoupon.id==item.id} " @click="choiceCoupon(item)" :key="item.key">
            <div class="c-card-coupon--title clearfix ">
              <div class="c-card-coupon--title--left textover1">{{item.temp.name}}
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
        </cube-scroll> -->
        <cube-scroll v-if="couponList">
          <!-- <div v-for="item in filterCouponList" :key="item.id"> -->
          <v-coupons-template :data="filterCouponList" @click-detail="toDetail" selectItem></v-coupons-template>
          <!-- </div> -->
        </cube-scroll>
      </div>
    </van-popup>

    <!-- 结算账户  -->
    <!-- <account v-model="payPopupVisible" @pay="chargeSave" :totalPrice="query.money" :accountCard="(orderOfCustom || orderOfCar.member) && data.memberCard ?   data.memberCard :''"></account> -->
    <account v-model="payPopupVisible" @pay="chargeSave" :password.sync="query.memberCardPwd" :totalPrice="query.money" :memberId="memberId"></account>
  </div>
</template>

<script>
import OrderCustom from './OrderCustom'
import Account from '../../components/Account'
import { mapState } from 'vuex'
export default {
  components: { OrderCustom, Account },
  data() {
    return {
      passwordKey: false,
      showKeyboard: true,
      orderId: '',
      data: '',
      payPopupVisible: false,
      moreType: false,
      radio: this.$store.state.order.OrderCustom ? 1 : 2,
      query: {
        'order.id': '',
        accountType: '',
        'financeAccount.id': '',
        'storeCouponMember.id': '',
        moneyErasing: '',
        memberCardPwd: '',
        money: 0,
        remarks: ''
      },
      couponShow: false,
      couponList: [],
      currCoupon: '',
      usableAccount: '',
      overTopMoney: 0
    }
  },
  watch: {
    'query.moneyErasing': {
      handler(val) {
        let jiesuanMoney =
          (this.data && this.data.order.moneyLeft
            ? this.data.order.moneyLeft
            : 0) -
          (this.currCoupon && this.currCoupon.moneyReduce
            ? this.currCoupon.moneyReduce
            : 0) -
          (val || 0)
        // 监听抹零金额 抹零金额改变 自动计算本次最大可结算金额
        this.query.money = jiesuanMoney
      }
    },
    'query.money': {
      handler(val) {
        let moneyLeft =
          (this.data && this.data.order.moneyLeft
            ? this.data.order.moneyLeft
            : 0) -
          (this.query.moneyErasing || 0) -
          (this.currCoupon && this.currCoupon.moneyReduce
            ? this.currCoupon.moneyReduce
            : 0)
        if (val > moneyLeft) {
          this.query.money = moneyLeft
        }
      },
      deep: true
    },
    accountType: {
      handler(val) {
        // 收款账户类别（1店铺账户 2会员储值账户）【订单收款时，前端提交】
        this.query.accountType = val
        this.query['financeAccount.id'] = ''
      },
      immediate: true
    },
    data: {
      handler(val) {
        if (val) {
          this.query.money = val.order.moneyLeft
        }
      },
      deep: true
    },
    accountDefault: {
      handler(val) {
        if (val) {
          this.query['financeAccount.id'] = val.id
        } else {
          this.query['financeAccount.id'] = ''
        }
      },
      deep: true,
      immediate: true
    },
    currCoupon: {
      handler(val) {
        if (val) {
          this.query['storeCouponMember.id'] = val.id
        } else {
          this.query['storeCouponMember.id'] = ''
        }
        // 优惠券改变都让抹零金额变为0
        this.query.moneyErasing = ''
        this.query.money =
          (this.data && this.data.order.moneyLeft
            ? this.data.order.moneyLeft
            : 0) -
          (val && val.moneyReduce ? val.moneyReduce : 0) -
          (this.query.moneyErasing ? this.query.moneyErasing : 0)
      },
      immediate: true
    },
    /**
     * 这里重新监听一下memberId设置账户的默认值的目的是，组件默认传递的memberId是通过请求获取的，是个异步过程，可能会滞后，就会导致查不出对应的储值账户
     */
    memberId: {
      handler(val) {
        this.$store.dispatch('accountCusAndStore', val)
      }
    }
  },
  computed: {
    filterCouponList() {
      return this.couponList
        .filter(v => {
          return v.temp.moneyCondition <= this.data.order.moneyLeft
        })
        .map(v => {
          return {...v.temp, id: v.id, endUsableDate: v.endUsableDate ? v.endUsableDate : 'x'}
        })
    },
    orderOfCustomObject() {
      return this.$store.getters.orderOfCustomObject
    },
    memberId() {
      return this.data && this.data.order && this.data.order.member
        ? this.data.order.member.id
        : ''
    },
    maxMoney() {
      // 最大可抹零的值 也是最大可结算的值
      return (
        (this.data && this.data.order.moneyLeft
          ? this.data.order.moneyLeft
          : 0) -
        (this.currCoupon && this.currCoupon.moneyReduce
          ? this.currCoupon.moneyReduce
          : 0)
      )
    },
    maxMolin() {
      let mf = this.$options.filters['currency'](this.maxMoney)
      return `最大可抹零金额${mf}`
    },
    maxPay() {
      let mf = this.$options.filters['currency'](this.maxMoney)
      return `最大可结算金额${mf}`
    },
    nextPayMoney() {
      // 未收的金额 = 应收 - 券优惠 - 抹零 - 本次结算
      let ysMoney =
        this.data && this.data.order.moneyLeft ? this.data.order.moneyLeft : 0
      let yhMoney = 0
      // 判断是否礼品券
      if (this.currCoupon && this.currCoupon.type === '1') {
        yhMoney = this.currCoupon ? this.currCoupon.moneyReduce : 0
      } else {
        yhMoney = 0
      }
      let zdMoney = this.query.moneyErasing ? this.query.moneyErasing : 0
      let res = ysMoney - yhMoney - zdMoney - this.query.money
      if (res < 0) {
        // 溢出的价格（结算金额大于订单金额）
        this.overTopMoney = -res
      }
      return res > 0 ? res : 0
    },
    totalPrice() {
      // 结算总金额 = 应收金额 - 优惠券金额 - 抹零
      // 选择券和抹零的时候 本次结算应该自动减少
      let ysMoney = this.data ? this.data.order.moneyLeft : 0
      let yhMoney = 0
      // 判断是否礼品券
      if (this.currCoupon && this.currCoupon.type === '1') {
        yhMoney = this.currCoupon ? this.currCoupon.moneyReduce : 0
      } else {
        yhMoney = 0
      }
      let zdMoney = this.query.moneyErasing
      let res = ysMoney - yhMoney - zdMoney
      return res > 0 ? res : 0
    },
    ...mapState({
      orderOfCustom: state => state.order.orderOfCustom,
      orderOfCar: state => state.order.orderOfCar,
      newCustomTel: state => state.order.newCustomTel,
      newCustomCar: state => state.order.newCustomCar,
      currentCard: state => state.order.currentCard,
      accountType: state => state.account.accountType,
      accountDefault: state => state.account.accountDefault
    })
  },
  methods: {
    handleLeft() {
      this.query.moneyErasing = ''
      this.query.money =
        this.data && this.data.order.moneyLeft ? this.data.order.moneyLeft : 0
      this.currCoupon = ''
      this.query.remarks = ''
      this.$router.replace({
        name: 'OrderDetail',
        query: { id: this.query['order.id'] }
      })
    },
    chargeSave() {
      this.paySave()
    },
    toPay() {
      if (this.query.money === '') {
        this.$toast('请输入结算金额')
        return
      }
      this.payPopupVisible = true
    },
    toDetail(item) {
      if (this.currCoupon && item.id === this.currCoupon.id) {
        this.currCoupon = ''
      } else {
        this.currCoupon = item
      }
      this.couponShow = false
    },
    async getForm() {
      let res = await this.$api.PAYMENT_FORM({
        orderId: this.query['order.id']
      })
      if (res.status === 1) {
        this.data = res.data
        // 可使用的账户
        this.usableAccount = res.data.financeAccounts.filter(v => {
          if (v.isEnable === '1') {
            return v
          }
        })
        if (res.data.order && res.data.order.member && res.data.order.motor) {
          let data = res.data.order.member
          data.motor = res.data.order.motor
          this.$store.commit('ORDER_OF_CUSTOM', data)
        } else if (res.data.order && res.data.order.member) {
          this.$store.commit('ORDER_OF_CUSTOM', res.data.order.member)
        } else if (res.data.order && res.data.order.motor) {
          this.$store.commit('ORDER_OF_CAR', res.data.order.motor)
        }
        this.getCoupon()
      } else {
        console.error('获取账户错误')
      }
    },
    async paySave() {
      var _toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        message: '结算中...'
      })
      setTimeout(() => {
        // 10s 没返回结果
        _toast && _toast.clear()
      }, 10000)
      this.payPopupVisible = false
      let res = await this.$api.PAYMENT_SAVE(this.query)
      _toast && _toast.clear()
      this.query.memberCardPwd = ''
      if (res.status === 1) {
        this.$toast.success('结算成功')
        /* 语音播报 s */
        /*
        let str = ''
        if (this.data.order.motorLicence && this.data.order.memberUsername) {
          let pre1 = this.data.order.motorLicence.slice(0, 1)
          let pre2 = this.data.order.motorLicence.slice(1, 2)
          let end = this.data.order.motorLicence.slice(2)
          str = `"${pre1},${pre2},${end}", 收款成功`
        } else if (this.data.order.motorLicence) {
          let pre1 = this.data.order.motorLicence.slice(0, 1)
          let pre2 = this.data.order.motorLicence.slice(1, 2)
          let end = this.data.order.motorLicence.slice(2)
          str = `"${pre1},${pre2},${end}", 收款成功`
        } else if (this.data.order.memberUsername) {
          let end4 = this.data.order.memberUsername.slice(7, 11)
          str = `手机尾号， "${end4}", 收款成功`
        } else {
          str = '收款成功'
        }
        this.$api.NATIVE_AUDIO({ type: 'jiesuan', str: str })
        console.log('播报的数据', str)
        */
        /* 语音播报 e */
        this.query.moneyErasing = ''
        this.$router.replace({
          name: 'Order',
          params: { refresh: true }
        })
      } else {
        console.error(`结算失败[${res.status}]`)
      }
    },
    async getCoupon() {
      // 获取用户可用优惠券
      let id = this.data.order.member ? this.data.order.member.id : ''
      if (!id) return
      let res = await this.$api.CUSTOM_OWN_COUPON({
        memberId: id
      })
      if (res.status === 1) {
        let data = res.list || []
        // 返回可用的优惠券（应收金额> 优惠券限制金额）
        this.couponList = data.filter(v => {
          let limitMoney = v.temp.moneyCondition ? v.temp.moneyCondition : 0
          return this.data.order.moneyLeft >= limitMoney
        })
      } else {
        console.error(res.status + '获取优惠券失败')
      }
    },
    showCoupon() {
      if (this.couponList.length === 0) {
        return
      }
      this.couponShow = true
    }
  },
  activated() {
    if (this.$route.query.orderId) {
      this.query['order.id'] = this.$route.query.orderId
      this.getForm()
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
.jiesuan-moneyleft-tip {
  font-size: 14px;
  color: @danger;
  text-align: right;
  padding: 10px 15px;
}
.jiesuan-input-box {
  position: relative;
  height: 80px;
  width: 100%;
  background: #fff;
  padding: 10px 15px 0 15px;
  border-bottom: 2px solid @success;
  .jiesuan-input--tip {
    font-size: 12px;
    color: #999;
  }
  .jiesuan-input--input {
    position: absolute;
    left: 15px;
    right: 15px;
    bottom: 0;
    top: 26px;
    font-size: 32px;
    color: @success;
    text-indent: 20px;
  }
  .jiesuan-input--rmb {
    position: absolute;
    height: auto;
    bottom: 16px;
    left: 15px;
    z-index: 99;
    .icon {
      color: @success!important;
      font-size: 16px;
    }
  }
}
.jiesuan-custion-top {
  padding: 10px;
  text-align: center;
  font-size: 16px;
  color: #333;
  line-height: 1.5;
  * {
    color: #333;
    font-weight: 500;
  }
}
.jiesuan-custion-top--moneyleft {
  font-size: 24px;
  color: #333;
  text-align: center;
  font-weight: 500;
  padding-bottom: 15px;
}
.money-left--icon {
  .icon {
    font-size: 20px;
  }
}
.order-money {
  border-bottom: 2px solid @success;
  .c_cell_input {
    font-size: 22px;
    color: @success!important;
    font-weight: 500;
  }
}
.c_cell-input--danger {
  .c_cell_input {
    color: @danger!important;
  }
}
</style>
