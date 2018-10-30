<template>
  <div class="order-detail">
    <v-header title="详情" :to="{name:'Order'}" toCusDetail :left-click="handleLeft"></v-header>
    <div class="c-scroll-wrapper-top" v-if="ready">
      <cube-scroll :data="data">
        <v-br></v-br>
        <div class="order-user-info">
          <div class="order-type-icon">
            <v-icon name="icon-paimingbiaoqian" v-if="data.createType!=1" :color="data.createType==2?'#338095':'#01d10c'"></v-icon>
            <v-icon name="icon-paimingbiaoqian" v-if="data.type==3" color="#0066bf"></v-icon>
            <span class="order-type-text" v-if="data.createType==2">
              <div>折扣</div>
              <div>卡</div>
            </span>
            <span class="order-type-text" v-if="data.createType==3">次卡</span>
            <span class="order-type-text" v-if="data.type==3">快单</span>
          </div>
          <p class="clearfix">
            <span v-if="data.motorLicence" style="font-weight:500">{{data.motorLicence |carIdFormat()}}</span>
            <span v-else>-</span>
            <span>
              <v-badge v-if="data.statusPay==98" class="success">已结算</v-badge>
              <v-badge v-if="data.statusPay==2||data.statusPay==1" color="#d73962">待结算</v-badge>
            </span>
          </p>
          <p style="font-size:16px;padding-top:6px;" v-if="data.memberName||data.memberUsername">
            <span v-if="data.memberUsername">{{data.memberUsername|telFormat()}}</span>
            <span v-if="data.memberName">{{data.memberName}}</span>
          </p>
        </div>
        <div class="order-status" @click="switchBaseinfoShow">
          <!-- 订单基本信息 -->
          <div class="order-card-info">
            <div class="order-baseinfo-item clearfix">
              <span class="fl">销售单号</span>
              <span class="fr">{{data.orderNo}}</span>
            </div>
            <div class="order-baseinfo-item clearfix" @click="orderNoShow=true">
              <span class="fl">纸质单号</span>
              <span class="fr">{{data.orderNoHand}}
                <v-icon name="icon-lujing1" color="#1690ff"></v-icon>
              </span>
            </div>
           
            <div class="order-baseinfo-item clearfix">
              <span class="fl">销售人</span>
              <span class="fr" v-if="data.sellEmployee">{{data.sellEmployee.name}}</span>
            </div>
            <div class="order-baseinfo-item clearfix">
              <span class="fl">创建时间</span>
              <span class="fr">{{data.createDate|timeFormat()}}</span>
            </div>
            <div class="order-baseinfo-item clearfix">
              <span class="fl">创建人</span>
              <span class="fr">{{data.createBy}}</span>
            </div>
            <div class="order-baseinfo-item clearfix">
              <span class="fl">更新时间</span>
              <span class="fr">{{data.updateDate|timeFormat()}}</span>
            </div>
            <div class="order-baseinfo-item clearfix">
              <span class="fl">更新人</span>
              <span class="fr">{{data.updateBy}}</span>
            </div>
          </div>
        </div>
        <v-br></v-br>
        <div class="order-status">
          <div class="order-card-info">
             <div class="order-baseinfo-item clearfix">
              <span class="fl">进场时间</span>
              <span class="fr">{{data.startTime}}</span>
            </div>
            <div class="order-baseinfo-item clearfix" @click="mileCurrentShow=true">
              <span class="fl">当前里程(km)</span>
              <span class="fr">{{data.motorMileCurrent}}
                <v-icon name="icon-lujing1" color="#1690ff"></v-icon>
              </span>
            </div>
            <div class="order-baseinfo-item clearfix">
              <span class="fl">送车人</span>
              <span class="fr">{{data.senderName}}</span>
            </div>
             <div class="order-baseinfo-item clearfix">
              <span class="fl">送车人电话</span>
              <span class="fr">{{data.senderMobile}}</span>
            </div>
          </div>
        </div>
        <v-remark v-model="data.remarks" :data="{dataId:id,tableCode:'order'}" placeholder="订单备注"></v-remark>
        <v-upload readonly :data="picList"></v-upload>
        <v-br></v-br>
        <div class="main-info" @click="switchOrderinfoShow">
          <!-- 订单信息 -->
          <div>
            <div class="main-info-item">
              <div class="clearfix detail-item--clearfix ">
                <span class="fl secondary-text">总费用</span>
                <span class="fr secondary-text">{{data.moneySrc|currency()}}</span>
              </div>
            </div>
            <div class="main-info-item " v-if="data.createType!=3">
              <div class="clearfix detail-item--clearfix border">
                <span class="fl secondary-text">折让金额</span>
                <span class="fr secondary-text" >{{discountMoney|currency('-￥')}}</span>
              </div>
            </div>
            <!-- 卡场景 -->
            <!-- 折扣卡 -->
            <div key="折扣卡" v-if="currentCard&&currentCard.cardType==='2'">
              <div class="main-info-item " v-if="data.createType==2">
                <div class="clearfix mian-info--weight">
                  <span class="fl ">划卡数额</span>
                  <span class="fr ">{{data.moneySrc*data.memberCard.discount|currency()}}</span>
                </div>
              </div>
              <div class="main-info-item ">
                <div class="clearfix detail-item--clearfix">
                  <span class="fl secondary-text">卡种</span>
                  <span class="fr secondary-text">
                    <v-badge size="small" type="折扣卡">折扣卡</v-badge>
                    <span v-if="data.memberCard&&data.memberCard.transact">{{data.memberCard.transact.name}}</span>
                  </span>
                </div>
              </div>
              <div class="main-info-item ">
                <div class="clearfix detail-item--clearfix">
                  <span class="fl secondary-text">划卡时间</span>
                  <span class="fr secondary-text" v-if="data.chargeRecords">{{data.chargeRecords[0].createDate|timeFormat()}}</span>
                  <span class="fr secondary-text" v-else>-</span>
                </div>
              </div>
              <div class="main-info-item ">
                <div class="clearfix detail-item--clearfix">
                  <span class="fl secondary-text">划卡人</span>
                  <span class="fr secondary-text" v-if="data.chargeRecords">{{data.chargeRecords[0].updateBy}}</span>
                  <span class="fr secondary-text" v-else>-</span>
                </div>
              </div>
            </div>
            <!-- 次卡 -->
            <div key="次卡" v-else-if="currentCard&&currentCard.cardType==='3'">
              <div class="main-info-item ">
                <div class="clearfix mian-info--weight">
                  <span class="fl ">划卡数额</span>
                  <span class="fr ">{{data.numMemberCard}}次</span>
                </div>
              </div>
              <div class="main-info-item ">
                <div class="clearfix detail-item--clearfix">
                  <span class="fl secondary-text">卡种</span>
                  <span class="fr secondary-text">
                    <v-badge size="small" type="次卡">次卡</v-badge>
                    <span v-if="data.memberCard&&data.memberCard.transact">{{data.memberCard.transact.name}}</span>
                  </span>
                </div>
              </div>
              <div class="main-info-item ">
                <div class="clearfix detail-item--clearfix">
                  <span class="fl secondary-text">划卡时间</span>
                  <span class="fr secondary-text" v-if="data.chargeRecords">{{data.chargeRecords[0].createDate|timeFormat()}}</span>
                  <span class="fr secondary-text" v-else>-</span>
                </div>
              </div>
              <div class="main-info-item ">
                <div class="clearfix detail-item--clearfix">
                  <span class="fl secondary-text">划卡人</span>
                  <span class="fr secondary-text" v-if="data.chargeRecords">{{data.chargeRecords[0].updateBy}}</span>
                  <span class="fr secondary-text" v-else>-</span>
                </div>
              </div>
            </div>
            <!-- 直接开单场景 -->
            <div v-else>
              <div class="main-info-item">
                <div class="clearfix mian-info--weight">
                  <span class="fl secondary-text">应收金额</span>
                  <span class="fr secondary-text">{{data.moneySrc-data.moneyDec|currency()}}</span>
                </div>
              </div>
              <div class="main-info-item ">
                <div class="clearfix detail-item--clearfix">
                  <span class="fl secondary-text">券抵扣</span>
                  <span class="fr secondary-text" >{{data.moneyCoupon|currency('-￥')}}</span>
                </div>
              </div>
              <div class="main-info-item ">
                <div class="clearfix detail-item--clearfix">
                  <span class="fl secondary-text">抹零</span>
                  <span class="fr secondary-text" >{{data.moneyErasing|currency('-￥')}}</span>
                </div>
              </div>
              <div class="main-info-item ">
                <div class="clearfix detail-item--clearfix">
                  <span class="fl secondary-text" style="color:#333;">已结算金额</span>
                  <span class="fr secondary-text" style="color:#333;" >{{data.moneyCharged|currency()}}</span>
                </div>
              </div>
              <div class="main-info-item main-info-moneyleft">
                <div class="clearfix detail-item--clearfix">
                  <span class="fl secondary-text" style="color:#d73962;">待结算金额</span>
                  <span class="fr secondary-text" style="color:#d73962;" v-if="data.moneyLeft">{{data.moneyLeft|currency()}}</span>
                </div>
              </div>
              <div class="main-info-item" v-if="data.type==3">
                <div class="clearfix detail-item--clearfix">
                  <span class="fl secondary-text">结算方式</span>
                  <span class="fr secondary-text" v-if="data.chargeRecords">{{data.chargeRecords[0].chargeType|chargeType()}}</span>
                  <span class="fr secondary-text" v-else>-</span>
                </div>
              </div>
              <v-cell link title="结算明细" v-if="data.chargeRecords&&data.chargeRecords.length!=0" class="show-text-hight" text="查看" @click.native="show=true"></v-cell>
            </div>
          </div>
        </div>
        <v-br></v-br>
        <div class="order-info-title" v-if="data.orderItems">
          服务/商品
        </div>
        <div v-for="sku in data.orderItems" :key="sku.id">
          <div class="detail-info">
            <div class="detail-info--title ">
              <div class="clearfix">
                <div class="detail-info--title-l">
                  {{sku.gasName}}
                  <v-badge v-if="sku.gasType==2" size="small" type="服">服</v-badge>
                  <v-badge v-else size="small" type="商">商</v-badge>
                </div>
                <div class="detail-info--title-r">
                  {{sku.num}}
                  <span v-if="sku.gasType=='1'">{{sku.gasUnit}}</span>
                  <span v-else>次</span> × {{sku.price|currency()}}
                </div>
              </div>
              <div class="clearfix detail-info--sku">
                <div class="detail-info--title-sku fl">{{sku.gasSkuName}}</div>
                <div class="detail-info--title-dis fr">
                  折让:
                  <span key="折扣卡" v-if="currentCard&&currentCard.cardType==='2'&&currentCard.discount">{{(sku.price-sku.price*currentCard.discount)*sku.num|currency('-￥')}}</span>
                  <span v-else key="其他">{{sku.moneyDec|currency('-￥')}} </span>
                </div>
              </div>
            </div>
            <div class="ctrl-box-wrapper" v-if="sku">
              <div>
                <div class="clearfix ctrl-box-item" v-if="data.finishTime">
                  <span class="fl ctrl-box-title">完工时间
                  </span>
                  <span class="fr ctrl-box-value textover1">
                    <span>
                      {{data.finishTime}}
                    </span>
                  </span>

                </div>
              </div>
            </div>
          </div>
          <v-br></v-br>
        </div>
        <v-br :height="100"></v-br>
      </cube-scroll>
    </div>
    <van-popup v-model="show" position="right" style="height:100%;width:100%">
      <v-header title="结算明细">
        <div slot="left" @click="show=false">
          <span class="c_header_icon_box">
            <v-icon name="icon-zuojiantou" color="#fff"></v-icon>
          </span>
        </div>
      </v-header>
      <div class="c-scroll-wrapper-top" style="background:#eee">
        <v-br :height="20"></v-br>
        <div v-for="item in data.chargeRecords" :key="item.id">
          <div class="main-info-item--detail clearfix">
            <span class="fl secondary-text">结算时间</span>
            <span class="fr secondary-text">{{item.createDate|timeFormat()}}</span>
          </div>
          <div class="main-info-item--detail clearfix">
            <span class="fl secondary-text">结算人</span>
            <span class="fr secondary-text">{{data.createBy}}</span>
          </div>
          <div class="main-info-item--detail clearfix">
            <span class="fl secondary-text">券抵扣</span>
            <span class="fr secondary-text">{{item.moneyCoupon|currency('-￥')}}</span>
          </div>
          <div class="main-info-item--detail clearfix">
            <span class="fl secondary-text">抹零</span>
            <span class="fr secondary-text">{{item.moneyErasing|currency('-￥')}}</span>
          </div>
          <div class="main-info-item--detail clearfix">
            <span class="fl secondary-text" style="color:#333">本次结算金额</span>
            <span class="fr secondary-text" style="color:#333">{{item.money|currency()}}</span>
          </div>
          <div class="main-info-item--detail clearfix">
            <span class="fl secondary-text">结算方式</span>
            <span class="fr secondary-text">{{item.chargeType|chargeType()}}</span>
          </div>
          <v-remark v-model="item.remarks" placeholder="结算备注" :data="{dataId:item.id,tableCode:'chargeRecord'}"></v-remark>
          <v-br style="background:#eee" :height="20"></v-br>
        </div>
      </div>
    </van-popup>
    <v-footer v-if="data.statusPay!=98">
      <v-footer-item :class="editAble?'':'footer-disable'" @click.native="toEdit"> 编辑</v-footer-item>
      <!-- <v-footer-item class="yellow-btn" :class="finishAble?'':'footer-disable'" @click.native="toOver"> 完工</v-footer-item> -->
      <v-footer-item class="success-btn" v-if="data.createType==1" :key="1" :class="payAble?'':'footer-disable'" @click.native="toPay">结算</v-footer-item>
      <!-- 划卡结算 -->
      <v-footer-item class="success-btn" v-else :key="23" :class="cardAble?'':'footer-disable'" @click.native="toCardPay">结算</v-footer-item>
    </v-footer>
    <!-- 密码 -->
    <Checkstand :options="CheckstandOptions" v-model="password" />
    <van-dialog class="dialog-price" style="padding:0" v-model="orderNoShow" @confirm="updateInfoOid" :showCancelButton="true" confirmButtonText="确定">
      <div class="dialog-price--title">
        纸质单号
      </div>
      <input type="text" v-model="orderNoHand" class="dialog-input" placeholder="请输入">
    </van-dialog>
    <van-dialog class="dialog-price" style="padding:0" v-model="mileCurrentShow" @confirm="updateInfoMile" :showCancelButton="true" confirmButtonText="确定">
      <div class="dialog-price--title">
        当前里程
      </div>
      <input type="number" v-model="motorMileCurrent" class="dialog-input" placeholder="请输入">
    </van-dialog>
  </div>
</template>
<script>
import Checkstand from '@/components/Checkstand'
import moment from 'dayjs'
export default {
  components: {
    Checkstand
  },
  data() {
    return {
      ready: false,
      orderNoShow: false,
      mileCurrentShow: false,
      motorMileCurrent: '',
      orderNoHand: '',
      picList: [],
      id: '',
      oid: '',
      data: {},
      show: false,
      password: '',
      CheckstandOptions: {
        money: '',
        show: false,
        type: 1,
        userinfo: ''
      },
      refresh: false
    }
  },
  watch: {
    password: {
      handler(val) {
        if (val.length === 6) {
          this.CheckstandOptions.show = false
          this.takeCard()
        }
      }
    },
    orderOfCustomObject: {
      handler(val) {
        this.CheckstandOptions.userinfo = val
      },
      deep: true,
      immediate: true
    },
    moneyOrTimes: {
      handler(val) {
        this.CheckstandOptions.money = val
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    discountMoney() {
      let _money = 0
      this.data.orderItems &&
        this.data.orderItems.map(v => {
          _money +=
            v.num * (v.price - this.currentCard.discount * v.price).toFixed(2)
        })
      return this.data.createType === '1' ? this.data.moneyDec : _money
    },
    orderOfCustomObject() {
      return this.$store.getters.orderOfCustomObject
    },
    editAble() {
      return !(
        this.data.status === '98' ||
        this.data.statusPay === '98' ||
        this.data.statusPay === '2'
      )
    },
    payAble() {
      return this.data.statusPay === '2' || this.data.statusPay === '1'
    },
    cardAble() {
      return this.data.statusPay === '2' || this.data.statusPay === '1'
    },
    currentCard() {
      return this.$store.state.order.currentCard
    },
    finishAble() {
      return this.data.status === '1'
    },
    moneyOrTimes() {
      // 划卡的情况
      if (this.currentCard && this.currentCard.cardType === '2') {
        // 折扣卡是显示折扣金额
        return (
          this.data.moneySrc *
          (this.data.memberCard ? this.data.memberCard.discount : 1)
        )
      } else {
        // 次卡是显示次数
        let i = 0
        this.data.orderItems &&
          this.data.orderItems.map(v => {
            i += v.num
          })
        return i
      }
    }
  },
  methods: {
    async updateInfoMile() {
      let res = await this.$api.UPDATE_ORDER_INFO({
        id: this.id,
        tag: 'mileCurrent',
        info: this.motorMileCurrent
      })
      if (res.status === 1) {
        this.$toast.success('修改成功')
        this.getData()
      }
    },
    async updateInfoOid() {
      let res = await this.$api.UPDATE_ORDER_INFO({
        id: this.id,
        tag: 'orderNoHand',
        info: this.orderNoHand
      })
      if (res.status === 1) {
        this.$toast.success('修改成功')
        this.getData()
      }
    },
    handleLeft() {
      this.$store.commit('CLEAR_CURRENT_CARD')
      // this.$router.replace('/order')
      this.$router.back()
    },
    switchBaseinfoShow() {
      this.baseinfoShow = !this.baseinfoShow
    },
    switchOrderinfoShow() {
      this.orderinfoShow = !this.orderinfoShow
    },
    toCardPay() {
      if (!this.cardAble) {
        return
      }
      this.CheckstandOptions.show = true
    },
    async takeCard() {
      const toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        message: '结算中...'
      })
      let res = await this.$api.TAKE_CARD_ORDER({
        id: this.data.id,
        memberCardPwd: this.password
      })
      this.password = ''
      toast.clear()
      if (res.status === 1) {
        this.$toast.success('结算成功')
        this.payAble = false
        this.refresh = true
        this.getData()
      } else {
        console.error(res)
      }
    },
    toPay() {
      if (!this.payAble) {
        return
      }
      this.$router.replace({ name: 'Jiesuan', query: { orderId: this.id } })
    },
    toOver() {
      if (!this.finishAble) {
        return
      }
      this.$dialog
        .confirm({
          title: '确定完工吗？',
          message: ' ',
          confirmButtonText: '确定'
        })
        .then(async() => {
          const toast = this.$toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            message: '完工中...'
          })
          let res = await this.$api.ORDER_FINISH({ id: this.id })
          toast && toast.clear()
          if (res.status === 1) {
            this.$toast.success('完工成功')
            this.finishAble = false
            this.refresh = true
            this.getData()
          } else {
            this.$toast.fail('完工失败')
          }
        })
        .catch(() => {
          // on cancel
        })
    },
    async getData() {
      const toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        message: '加载中...'
      })
      // 初始清空卡如果有卡后面会添加
      this.$store.commit('CLEAR_CURRENT_CARD')
      let iddata = null
      if (this.id) {
        iddata = { id: this.id }
      } else {
        iddata = { orderNo: this.oid }
      }
      let res = await this.$api.ORDER_DETAIL(iddata)
      toast.clear()
      if (res.status === 1) {
        if (res.data.orderItems && res.data.orderItems.length > 0) {
          res.data.orderItems.map(v => {
            if (v.orderItemEmployees) {
              v._s = v.orderItemEmployees
                .filter(s => {
                  if (s.operateType === '1') {
                    return s
                  }
                })
                .map(s => {
                  return s.employee
                })
            }
            if (v.orderItemEmployees && v.orderItemEmployees.length > 0) {
              v._l = v.orderItemEmployees
                .filter(l => {
                  if (l.operateType === '2') {
                    return l
                  }
                })
                .map(l => {
                  return l.employee
                })
            }
            return v
          })
        }
        this.data = res.data
        this.id = res.data.id
        this.picList = res.data.attachment ? res.data.attachment.split(',') : []
        this.motorMileCurrent = res.data.motorMileCurrent
        this.orderNoHand = res.data.orderNoHand
        // 有卡的信息设置当前卡否则无法
        if (this.data.memberCard && this.data.memberCard.id) {
          this.$store.commit('SET_CURRENT_CARD', this.data.memberCard)
        } else {
          this.$store.commit('CLEAR_CURRENT_CARD')
        }
        this.ready = true
      } else {
        this.ready = false
        console.error('获取订单详情出错')
      }
    },
    toEdit() {
      if (!this.editAble) {
        return
      }
      // 这是一部大操作 拆分组合数据
      // TIP: 这里要设置3种状态
      // 1设置 orderOfCustom 2 设置 shopCar 3 设置 orderInfo
      this.$store.dispatch('clearOrder')

      // 如果是划卡要设置当前卡的信息
      if (this.data.memberCard && this.data.memberCard.id) {
        this.$store.commit('SET_CURRENT_CARD', this.data.memberCard)
      }
      let orderInfo = {
        sellEmployee: this.data.sellEmployee || '',
        id: this.data.id || '',
        orderNoHand: this.data.orderNoHand || '',
        motorMileCurrent: this.data.motorMileCurrent,
        senderName: this.data.senderName,
        senderMobile: this.data.senderMobile,
        attachment: this.data.attachment,
        startTime: this.data.startTime ? moment(this.data.startTime).format('YYYY-MM-DD') : '',
        remarks: this.data.remarks || ''
      }
      this.$store.commit('SET_NATIVE_PIC_ORDER', this.data.attachment ? this.data.attachment.split(',') : [])
      this.$store.commit('SET_ORDER_INFO', orderInfo)
      let orderItems =
        this.data.orderItems &&
        this.data.orderItems.map(v => {
          return {
            gasName: v.gasName || '',
            gasBrand: v.gasBrand || '', // 品牌
            code: v.gasCode || '', // 编码
            id: v.gasSkuId || '',
            name: v.gasSkuName || '',
            price: (v.moneySrc || 0) / (v.num || 0), // 价格
            gasType: v.gasType || '', // 类型 0 服务 1商品
            gasUnit: v.gasUnit || '', // 单位
            count: v.num || 1, // 数量
            moneyDec: v.moneyDec || '', // 折让金额
            cardType: this.data.createType || '', // 卡类型
            cardId: this.data.memberCard ? this.data.memberCard.id : '', // 卡id
            dealEmployee: v._s || '' // 施工员
          }
        })

      this.$store.commit('PUSH_SHOP_CAR', orderItems)
      // 分 车和人的情况
      // 设置当前的客户
      if (this.data.member && this.data.motor) {
        let orderOfCustom = {
          licence: this.data.motorLicence,
          id: this.data.motor.id,
          member: {
            ...this.data.member,
            name: this.data.memberName ? this.data.memberName : '',
            username: this.data.memberUsername
          }
        }
        this.$store.commit('ORDER_OF_CAR', orderOfCustom)
      } else if (this.data.member) {
        let orderOfCustom = {
          id: this.data.member.id || '',
          name: this.data.memberName || '',
          username: this.data.memberUsername || ''
        }
        this.$store.commit('ORDER_OF_CUSTOM', orderOfCustom)
      } else if (this.data.motor) {
        let orderOfCar = {
          id: this.data.motor.id || '',
          licence: this.data.motorLicence || ''
        }
        this.$store.commit('ORDER_OF_CAR', orderOfCar)
      } else {
        // 无车无人
        this.$store.commit('CLEAR_ORDER_CUSTOM')
      }
      this.$router.push('/kaidan')
    }
  },
  beforeRouteLeave(to, from, next) {
    to.params.refresh = this.refresh
    next()
  },
  activated() {
    this.ready = false
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.oid = ''
      this.getData()
    } else if (this.$route.query.oid) {
      this.oid = this.$route.query.oid
      this.id = ''
      this.getData()
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';

.show-text-hight {
  .c_cell {
    padding: 0 10px 0 0 !important;
  }
  .text {
    color: @primary!important;
  }
}
.main-info-item--detail {
  height: 30px;
  line-height: 30px;
  padding: 0 15px;
  color: #999;
  font-size: 14px;
  background: #fff;
}
.main-info-price {
  height: 40px !important;
  line-height: 40px !important;
  font-size: 16px !important;
  color: #333333;
  margin-bottom: 5px;
  > div {
    .borderB(@dividers);
  }
}
.main-info-moneyleft {
  height: 30px !important;
  > div {
    height: 30px !important;
    .borderB(@dividers);
  }
}
.detail-info {
  position: relative;
  background: #ffffff;
  padding: 0 15px 0px 15px;
  width: 95%;
  margin: 0 auto;
  border-radius: 8px;
  &--title {
    height: 60px;
    overflow: hidden;
    color: #333;
    padding-top: 8px;
    &-l {
      font-size: 18px;
      float: left;
      color: #333;
    }
    &-r {
      font-size: 16px;
      float: right;
    }
    &-sku {
      font-size: 16px;
      color: #666;
    }
    &-dis {
      font-size: 12px;
      color: @secondary-text;
    }
  }
  .detail-info--sku {
    padding-top: 6px;
  }
}
.order-detail {
  .main-info-item {
    font-size: 16px;
    padding-left: 15px;
    .secondary-text {
      font-size: 16px;
      color: #666666;
    }
  }
  .order-card-info {
    background: #ffffff;
    padding: 10px 0;
    .order-baseinfo-item {
      font-size: 14px;
      color: #999999;
      line-height: 26px;
      > span {
        font-size: 14px !important;
      }
      .icon {
        font-size: 14px;
      }
    }
  }
  .order-user-info {
    position: relative;
    width: 95%;
    margin: 1px auto;
    background: #ffffff;
    font-size: 18px;
    line-height: 20px;
    padding: 10px 15px 0 15px;
    color: #333333;
    border-radius: 8px;
    .order-type-icon {
      position: absolute;
      top: 0;
      right: 15px;
      z-index: 99;
      width: 40px;
      height: 60px;
      .v_icon--wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 40px;
        height: 60px;
      }
      .icon {
        position: absolute;
        top: 8px;
        overflow: visible;
        vertical-align: top !important;
        font-size: 45px;
      }
      .order-type-text {
        position: absolute;
        padding-top: 6px;
        top: 0;
        left: 0;
        width: 100%;
        text-align: center;
        color: #fff;
        font-size: 12px;
        line-height: 1;
      }
    }
  }
  .status-1 {
    color: @warning;
  }
  .main-info {
    background: #ffffff;
    width: 95%;
    margin: 0 auto;
    padding: 10px 0;
    border-radius: 8px;
  }
  .pay-type {
    text-align: center;
    font-size: 12px;
    line-height: 30px;
    color: @secondary-text;
  }
  .order-total-price {
    padding-top: 20px;
    font-size: 32px;
    font-weight: 500;
    text-align: center;
  }
  .order-status {
    width: 95%;
    margin: 0 auto;
    border-radius: 8px;
    background: #ffffff;
    padding: 0 15px;
  }
  .order-status-item {
    font-size: 15px;
    font-weight: 600;
    line-height: 50px;
    margin-right: 8px;
  }
  .order-info-title {
    height: 30px;
    font-size: 15px;
    line-height: 30px;
    padding: 0 15px;
    margin-top: 15px;
    color: @secondary-text;
  }
}
.order-detail .main-info-item {
  .mian-info--weight {
    font-size: 18px;
    height: 45px;
    line-height: 45px;
    padding-right: 15px;
    overflow: hidden;
    .borderB();
    .secondary-text {
      font-size: 18px;
      font-weight: 500;
    }
    > span {
      color: #333333;
      font-weight: 500;
    }
  }
}
.detail-item--clearfix {
  // .borderB();
  // padding-bottom: 6px;
  padding-right: 15px;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  &.border {
    .borderB();
  }
}
</style>
