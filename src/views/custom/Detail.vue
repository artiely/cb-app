<template>
  <div v-if="dataReady" class="detailBox">
    <v-header title="详情">
    </v-header>
    <div class="c_scroll_wrapper">
      <cube-scroll @scroll="scroll" :options="options" :data="detailData">
        <div v-if="detailData">
          <div class="top-cus-box top-cus-box-new">
            <div class="top-cus-info" v-if="!onCustomData">
              <v-icon name="icon-nan" class="icon-sex" color="#ff4d94" v-if="detailData.member.sex == 1"></v-icon>
              <v-icon name="icon-nv" class="icon-sex" color="#ff4d94" v-else></v-icon>
              <div class="top-cus-portrait" @click="toCusDetail">
                <v-icon name="icon-xiaotubiao-49" class="sexSmPic" color="#ccc"></v-icon>
                <!-- <i class="top-cus-edit">编辑</i> -->
              </div>
              <div class="top-cus-name">
                <div class="top-cus-names" v-if="cusDate.name">{{cusDate.name}}
                  <em class="top-cus-name-badge" v-if="orderOfCustom.memberTag && orderOfCustom.memberTag.name">{{orderOfCustom.memberTag.name}}</em>
                </div>
                <div class="top-cus-names" v-else>
                  <span style="color:#c7c7c7">无客户名</span>
                  <em class="top-cus-name-badge" v-if="orderOfCustom.memberTag && orderOfCustom.memberTag.name">{{orderOfCustom.memberTag.name}}</em>
                </div>

                <div class="top-cus-phone">
                  {{cusDate.username |telFormat()}}
                  <!-- <span class="telBox"> -->
                  <a :href="'sms:'+ detailData.member.username" v-if="detailData&&detailData.member" class="smsTopPicBox">
                    <v-icon class="smsTopPic" name="icon-dianhua-" color="#1690ff" size="20"></v-icon>
                  </a>
                  <a :href="'tel:'+ detailData.member.username" v-if="detailData&&detailData.member">
                    <v-icon class="telTopPic" name="icon-dianhua-1" color="#1690ff" size="20"></v-icon>
                  </a>
                  <!-- </span> -->
                </div>
              </div>
              <!-- <div class="cus-contact">
                <a :href="'sms:'+ detailData.member.username" v-if="detailData&&detailData.member"   @click.stop>
                <v-icon name="icon-dianhua-" color="#1690ff"></v-icon>
                </a>
                <a :href="'tel:'+ detailData.member.username" v-if="detailData&&detailData.member"  @click.stop>
                  <v-icon name="icon-dianhua-1" color="#1690ff"></v-icon>
                </a>
              </div> -->
              <div class="topMoreBox" @click="toCusDetail">
                更多
                <v-icon class="link-icon topRight" name="icon-youjiantou1" color="#1790ff"></v-icon>
              </div>
            </div>
            <!-- <order-custom noHeader :noCus="onCustomData" :data="cusDate" :to="{name:'CustomDetail',id:cusDate?cusDate.id:''}" @click.native="toCusDetail"></order-custom> -->
            <div v-else key="无客户信息" class="no-cus addCar" @click="addNewMember">
              <v-icon name="icon-add_bg"></v-icon>添加客户</div>
          </div>

          <!-- 无客户信息隐藏会员卡等客户信息 -->
          <div key="无客户信息" v-if="!onCustomData">
            <!-- <div class="detail-tab-nav detail-tab-nav-new">
              <div class="detail-tab-item clearfix" @click="toOrderUnPay">
                <span class="detail-tab-item-text">待结算订单
                  <em class="detail-tab-item-num">({{cusDate.unsettledNum}})</em>
                  <v-dot :number="cusDate.unsettledNum"></v-dot>
                </span>
                <div class="line fr">
                </div>
              </div>
              <div class="detail-tab-item" @click="toChargeRecords">
                <span class="detail-tab-item-text">历史订单
                  <em class="detail-tab-item-num">({{cusDate.expendNum}})</em>
                  <v-dot :number="cusDate.expendNum"></v-dot>
                </span>
              </div>
            </div> -->
            <v-br height="75" style="background: #f8f8f8;"></v-br>
            <!-- 第一栏的内容 -->
            <div class="nineBox">
              <div class="detail-tab detail-tab-new">
                <div class="detail-tab-item" @click="countVisible=true">
                  <div class="tab-item-icon">
                    {{cusDate.accountMoneyUsable?cusDate.accountMoneyUsable:0|currency('￥')}}
                  </div>
                  <span class="tab-item-text">储值账户</span>
                </div>
                <div class="detail-tab-item" @click="toVipCard">
                  <div class="tab-item-icon">
                    <span class="detail-icon-relative">
                      <v-icon name="icon-banqia" color="#1690ff"></v-icon>
                      <v-dot :number="cusDate.cardNum"></v-dot>
                    </span>
                  </div>
                  <span class="tab-item-text">卡
                  </span>
                </div>
                <div class="detail-tab-item" @click="toVipCoupon">
                  <div class="tab-item-icon">
                    <span class="detail-icon-relative">
                      <v-icon name="icon-xiaotubiao-17"></v-icon>
                      <v-dot :number="cusDate.couponNum"></v-dot>
                    </span>
                  </div>
                  <span class="tab-item-text">优惠券
                  </span>
                </div>
              </div>
              <!-- 第二栏的内容 -->
              <div class="detail-tab detail-tab-new">
                <div class="detail-tab-item" @click="toOrderUnPay">
                  <div class="tab-item-icon" style="color:#d73962 !important;">
                    {{cusDate.leftMoney?cusDate.leftMoney:0|currency('￥')}}
                  </div>
                  <span class="tab-item-text">待结算</span>
                </div>
                <div class="detail-tab-item" @click="toChargeRecords">
                  <div class="tab-item-icon">
                    {{cusDate.expendMoney?cusDate.expendMoney:0|currency('￥')}}
                  </div>
                  <span class="tab-item-text">累计消费</span>
                </div>
              </div>
            </div>
            <!--  -->
          </div>

          <v-br></v-br>
          <div v-if="detailData&&detailData.motors" class="momtor-tab-box">
            <v-icon name="icon-plus-add" color="1690ff" v-if="!onCustomData" class="addmotor" @click.native="addCarFun"></v-icon>
            <van-tabs v-model="currCarIndex" class="my-detail--tabs my-detail--tabs-nws" swipe-threshold="2">
              <van-tab v-for="(car,index) in detailData.motors" :title="car.licence|carIdFormat()" :key="index">
                <v-cell-group>
                  <v-cell title="车型" :text="car.motorModel?car.motorModel.name:''" van-if="car.motorModel"></v-cell>
                  <v-cell title="最近养修时间" :text="car.lastOrderTime|timeFormat('YYYY-MM-DD')"></v-cell>
                  <v-cell title="最近养修里程(km)" :text="car.mileCurrent"></v-cell>
                  <v-cell title="该车辆历史养修订单" link @click.native="checkOrderByCar()" text=" "></v-cell>
                  <v-cell title="该车辆待结算订单" link @click.native="checkUnPayOrderByCar()" text=" "></v-cell>
                </v-cell-group>
                <v-cell-group>
                  <v-cell title="保险到期" :text="car.insuranceDueDate|timeFormat('YYYY-MM-DD')"></v-cell>
                  <v-cell title="年检到期" :text="car.checkDueDate|timeFormat('YYYY-MM-DD')"></v-cell>
                </v-cell-group>
                <v-cell-group style="margin-bottom:0">
                  <v-cell title="VIN码" :text="car.vin"></v-cell>
                  <v-cell title="发动机号" :text="car.engineNo"></v-cell>
                  <v-cell title="发动机型号" :text="car.engineNo"></v-cell>
                  <v-cell title="前轮胎规格" :text="car._json.wheel.fronttiresize" v-if="car._json&&car._json.wheel"></v-cell>
                  <v-cell title="后轮胎规格" :text="car._json.wheel.reartiresize" v-if="car._json&&car._json.wheel"></v-cell>
                </v-cell-group>
                <!-- <v-cell-group>
                  <v-cell title="备注" :text="car.remarks" wrap></v-cell>
                </v-cell-group> -->
                <v-remark v-model="car.remarks" disabled v-if="car.remarks"></v-remark>
                <v-br height="20"></v-br>
                <v-cell-group>
                  <v-cell title="编辑该车辆" text=" " class="editblue" @click.native="addCarFun('edit')"></v-cell>
                  <v-cell v-if="!onCustomData" title="解绑该车辆" text=" " class="editblue" @click.native="unBindCar"></v-cell>
                  <v-cell title="将该车辆移至黑名单" text=" " class="blacklist" @click.native="delCar"></v-cell>
                </v-cell-group>
              </van-tab>
            </van-tabs>
          </div>

          <div v-else key="无车辆" class="no-car addCar" @click="addCarFun">
            <v-icon name="icon-add_bg"></v-icon>添加车辆</div>
          <v-br :height="40"></v-br>
        </div>
      </cube-scroll>

      <v-footer v-if="!onCustomData||(detailData&&detailData.motors)">
        <v-footer-item @click.native="toCashdesk" class="yellow-btn">
          快单
        </v-footer-item>
        <v-footer-item @click.native="toOrder">
          开单
        </v-footer-item>
      </v-footer>
    </div>
    <van-actionsheet v-model="moreCtrl" :actions="actions" cancel-text="取消" />
    <!-- TIP: 储值账户 -->
    <van-popup v-model="countVisible" style="width:100%;height:350px" class="popup-radius" position="bottom" :lock-scroll="false">
      <v-popup-title title="客户储值账户" @close="countVisible = false"></v-popup-title>
      <div style="padding:20px;">
        <div style="font-size:32px;text-align:center">{{cusDate.accountMoneyUsable?cusDate.accountMoneyUsable:0|currency('￥')}}</div>
        <p style="font-size:14px;color:#666;text-align:center;padding-top:6px;">当前余额</p>
        <div @click="toVipCharge" v-if="detailData&&detailData.member&&detailData.member.accountCardId" style="font-size:16px;color:#1590ff;text-align:center;margin:40px;">查看明细</div>
        <v-br :height="100" v-else></v-br>
        <div class="primary" style="text-align:center" @click="toCharge">充值</div>
      </div>
    </van-popup>
    <!-- TIP: 选卡 -->
    <van-popup v-model="cardTypeVisible" style="width:100%;height:70%" position="bottom" class="popup-radius" :lock-scroll="false">
      <v-popup-title title="客户卡包" desc="该处仅显示可用折扣卡/次卡" @close="cardTypeVisible = false"></v-popup-title>
      <!-- <p class="popup-scroll-tishi"></p> -->
      <div class="popup-scroll-wrapper" style="background:#f0f0f0;top:62px;bottom:52px;overflow-y:scroll">
        <!-- <cube-scroll :data="data"> -->
        <div v-if="data.length">
          <div v-for="item in data" :key="item.id" style="padding:10px">
            <v-cb-card :currentCard="item" btnText="办卡" @click-btn="toCard(item)"></v-cb-card>
          </div>
        </div>
        <div v-else class="motor-no-card">该客户暂无可用卡</div>
        <!-- </cube-scroll> -->
      </div>
      <div key="办理新卡" class="addNewcar addCar" @click="transactionNewCard" style="color:#1690ff">
        <v-icon name="icon-add_bg"></v-icon> 办理新卡</div>
    </van-popup>

    <!-- TIP: 选优惠券 -->
    <van-popup v-model="couponTypeVisible" style="width:100%;height:70%" position="bottom" :lock-scroll="false">
      <v-popup-title title="客户优惠券" desc="该处仅显示可用优惠券" @close="couponTypeVisible = false"></v-popup-title>
      <div class="popup-scroll-wrapper" style="background:#f0f0f0;top:70px;bottom:0px;overflow-y:scroll">
        <!-- <cube-scroll> -->
        <div v-if="couponList.length>0">
          <!-- 客户优惠券数据 可预览 -->
          <v-coupons-template :data="filterCouponList"></v-coupons-template>
          <v-br height="20"></v-br>
        </div>
        <div v-else class="motor-no-card">该客户暂无可用优惠券</div>
        <!-- </cube-scroll> -->
      </div>
      <!-- <div key="办理新卡" class="addNewcar addCar" @click="transactionNewCoupon">
        <v-icon name="icon-add_bg"></v-icon>送券</div> -->
    </van-popup>
  </div>

</template>

<script>
// FIXME: TypeError: Cannot read property 'licence' of undefined
import OrderCustom from '../order/OrderCustom'
// import VCouponPreview from '../ticket/CouponDetail'
export default {
  components: {
    OrderCustom
    // VCouponPreview
  },
  data() {
    return {
      // previewShow: false, // 显示预览
      storeInfo: '', // 数据
      previewDetail: false, // 关闭优惠券预览
      dataReady: false,
      cardTypeVisible: false,
      couponTypeVisible: false,
      countVisible: false,
      top: 0,
      options: {
        type: 3
      },
      id: '',
      detailData: null,
      moreCtrl: false,
      actions: [
        {
          name: '解绑该车辆',
          callback: this.unBindCar,
          subname: ''
        },
        {
          name: '删除该车辆',
          callback: this.delCar,
          subname: ''
        }
      ],
      currCarIndex: 0,
      totalPage: 0,
      couponList: [],
      data: [],
      previewDetailData: [],
      query: {
        pageNo: 1,
        pageSize: 50,
        cardType: '',
        usableType: '1', // 有效类型。1：有效 2：已过期 3：已用完。
        cardTypes: ['3', '2'],
        'temp.id': '', // 模板id查领用记录
        'member.id': '' // 通过会员查
      },
      temp: '',
      currCar: '',
      onCustomData: true,
      refresh: false
    }
  },
  watch: {
    detailData: {
      handler(val) {
        if (val) {
          this.currCar = val && val.motors ? val.motors[0] : ''
          if (
            this.currCar &&
            val.member &&
            val.motors &&
            val.motors.length > 0
          ) {
            this.actions = [
              {
                name: '解绑该车辆',
                callback: this.unBindCar,
                subname: val.motors ? val.motors[this.currCarIndex].licence : ''
              },
              {
                name: '删除该车辆',
                callback: this.delCar,
                subname: val.motors ? val.motors[this.currCarIndex].licence : ''
              }
            ]
          } else {
            // 无客户不存在解绑
            if (!val.motors) return
            this.actions = [
              {
                name: '删除该车辆',
                callback: this.delCar,
                subname: val.motors ? val.motors[0].licence : '' // 无主车辆只会存在一辆所以[0]
              }
            ]
          }
        }
      }
    },
    currCarIndex: {
      handler(val) {
        if (
          this.detailData &&
          this.detailData.motors &&
          this.detailData.motors.length > 0
        ) {
          this.currCar = this.detailData.motors[val]
          this.actions = [
            {
              name: '解绑该车辆',
              callback: this.unBindCar,
              subname: this.detailData.motors
                ? this.detailData.motors[val].licence
                : ''
            },
            {
              name: '删除该车辆',
              callback: this.delCar,
              subname: this.detailData.motors
                ? this.detailData.motors[val].licence
                : ''
            }
          ]
        }
      },
      temp: {
        handler(val) {
          if (val) {
            this.query['temp.id'] = val.id
          } else {
            this.query['temp.id'] = ''
          }
        }
      }
    }
  },
  computed: {
    // 取temp
    filterCouponList() {
      return this.couponList.map(v => {
        return {...v.temp, id: v.id, endUsableDate: v.endUsableDate ? v.endUsableDate : 'x'} // 把券数据循环  券id  有效期(过期时间)传到组件去
      })
    },
    chargeNum() {
      return this.detailData &&
        this.detailData.member &&
        this.detailData.member.chargeRecords
        ? this.detailData.member.chargeRecords.length
        : 0
    },
    cusDate() {
      var _cusData
      if (this.detailData && this.detailData.member) {
        _cusData = this.detailData.member
      } else {
        _cusData = ''
      }
      return _cusData
    },
    orderOfCustom() {
      return this.$store.state.order.orderOfCustom
    }
  },
  created() {},
  methods: {
    toCusDetail() {
      this.$router.push({
        name: 'CustomDetail',
        query: { id: this.cusDate.id }
      })
    },
    transactionNewCoupon() {
      // TODO:
      this.$router.push('/coupon')
    },
    checkOrderByCar() {
      this.$router.push({
        name: 'OrderList',
        query: {
          motorId:
            this.detailData.motors && this.detailData.motors[this.currCarIndex]
              ? this.detailData.motors[this.currCarIndex].id
              : '',
          active: '0'
        }
      })
    },
    checkUnPayOrderByCar() {
      // 查看车辆待结算的订单
      this.$router.push({
        name: 'OrderList',
        query: {
          motorId:
            this.detailData.motors && this.detailData.motors[this.currCarIndex]
              ? this.detailData.motors[this.currCarIndex].id
              : '',
          active: '1'
        }
      })
    },
    async delCar() {
      this.$dialog
        .confirm({
          confirmButtonText: '确定',
          title: '确定移至黑名单吗？',
          message: '移入后可在黑名单中查看或恢复。'
        })
        .then(async () => {
          let res = await this.$api.CAR_DETAIL({ id: this.currCar.id })
          if (res.status === 1) {
            this.$toast.success('删除成功')
            this.refresh = true
            this.moreCtrl = false
            this.getDataByCarOrCus()
          } else {
            this.$toast.fail('删除失败')
          }
        })
        .catch(() => {
          // on cancel
        })
    },
    async unBindCar() {
      this.$dialog
        .confirm({
          confirmButtonText: '确定',
          title: '确定解绑吗？',
          message: '解绑后，该车辆将成为无主车辆。'
        })
        .then(async () => {
          // on confirm
          let res = await this.$api.CAR_UNBIND({ id: this.currCar.id })
          if (res.status === 1) {
            this.$toast.success('解绑成功')
            this.refresh = true
            this.moreCtrl = false
            this.getDataByCarOrCus()
          } else {
            this.$toast.fail('解绑失败')
          }
        })
        .catch(() => {
          // on cancel
        })
    },
    async getCardList() {
      if (this.cusDate.id) {
        this.query['member.id'] = this.cusDate.id
      } else {
        this.query['member.id'] = ''
      }
      let res = await this.$api.TICKET_LIST(this.query)
      if (res.status === 1) {
        if (this.query.pageNo === 1) {
          this.data = res.page.list || []
        } else {
          this.data = this.data.concat(res.page.list || [])
        }
        this.totalPage = res.page.totalPage
      } else {
        console.error(`获取列表失败${res.stateMessage}`)
      }
    },
    toVipCard() {
      this.cardTypeVisible = true
    },
    toVipCharge() {
      this.$router.push({
        name: 'ValueCardDetail',
        query: {
          accountCardId: this.detailData.member.accountCardId
        }
      })
    },
    async toVipCoupon() {
      // 客户优惠券
      if (this.cusDate.couponNum === 0) {
        // this.$toast.fail('该功能尚未开通!')
      }
      this.couponTypeVisible = true
      if (this.cusDate.id) {
        let res = await this.$api.CUSTOM_OWN_COUPON({
          memberId: this.cusDate.id
        })
        if (res.status === 1) {
          if (this.query.pageNo === 1) {
            this.couponList = res.list || []
          }
        } else {
          console.error('获取券失败')
        }
      }
    },
    toCoupon() {
      this.$router.push('/coupon')
    },
    toCard() {
      this.$router.push('/chargeticket')
    },
    toCharge() {
      this.$router.push('/chargeactive')
    },
    toOrderUnPay() {
      if (this.cusDate.unsettledNum) {
        this.$router.push({
          name: 'OrderList',
          query: {
            memberId: this.cusDate.id,
            active: '1'
          }
        })
      } else {
        this.$toast.fail('无待结算')
      }
    },
    toChargeRecords() {
      if (this.cusDate.expendNum) {
        this.$router.push({
          name: 'OrderList',
          query: {
            memberId: this.cusDate.id,
            active: '0'
          }
        })
      } else {
        this.$toast.fail('无历史消费')
      }
    },
    async getData() {
      // 只有
      this.detailData = ''
      let res = await this.$api.CUSTOM_DETAIL_BY_CUSID({ id: this.id })
      if (res.status === 1) {
        let _data = res.data
        if (_data.motors) {
          _data.motors = _data.motors.map(v => {
            let json =
              v.motorModel && v.motorModel.detailJson
                ? v.motorModel.detailJson
                : null
            var _json = {}
            if (json) {
              try {
                _json = JSON.parse(json)
              } catch (e) {
                console.error(e)
              }
            }
            v._json = _json
            return v
          })
        }
        this.detailData = _data
        if (_data.member) {
          this.onCustomData = false
        } else {
          this.onCustomData = true
        }
        this.dataReady = true
        let data = ''
        // 有人有车
        if (this.detailData.member && this.detailData.motors) {
          data = this.detailData.motors[this.currCarIndex]
          data.member = this.detailData.member
          this.$store.commit('ORDER_OF_CAR', data)
          // 只有人
        } else if (this.detailData.member) {
          data = this.detailData.member
          this.$store.commit('ORDER_OF_CUSTOM', data)
          // 自有车
        } else if (this.detailData.motors) {
          data = this.detailData.motors[0]
          this.$store.commit('ORDER_OF_CAR', data)
        }
        this.getCardList()
      } else {
        console.error('获取详情失败')
      }
    },
    async getDataByCar() {
      /**
       * 有车的时候就用车的id来查
       */
      this.detailData = ''
      let res = await this.$api.CUSTOM_DETAIL_BY_CARID({ id: this.carid })
      if (res.status === 1) {
        let _data = res.data
        if (_data.motors) {
          _data.motors = _data.motors.map(v => {
            let json =
              v.motorModel && v.motorModel.detailJson
                ? v.motorModel.detailJson
                : null
            var _json = {}
            if (json) {
              try {
                _json = JSON.parse(json)
              } catch (e) {
                console.error(e)
              }
            }
            v._json = _json
            return v
          })
        }
        this.detailData = _data
        if (_data.member) {
          this.onCustomData = false
        } else {
          this.onCustomData = true
        }
        /**
         * 算出当前选中的车牌
         */
        const _index = element => {
          return element.id === this.carid
        }
        if (this.detailData.motors && this.detailData.motors.length > 0) {
          let $index = this.detailData.motors.findIndex(_index)
          if ($index !== -1) {
            this.currCarIndex = $index
          } else {
            this.currCarIndex = 0
          }
          this.dataReady = true
        }
        let data = ''
        // 有人有车
        if (this.detailData.member && this.detailData.motors) {
          // data = this.detailData.member
          data = this.detailData.motors[this.currCarIndex]
          data.member = this.detailData.member
          this.$store.commit('ORDER_OF_CAR', data)
          // 只有人
        } else if (this.detailData.member) {
          data = this.detailData.member
          this.$store.commit('ORDER_OF_CUSTOM', data)
          // 自有车
        } else if (this.detailData.motors) {
          data = this.detailData.motors[this.currCarIndex]
          this.$store.commit('ORDER_OF_CAR', data)
        }
        this.getCardList()
      } else {
        console.error('获取详情失败')
      }
    },
    toOrder() {
      // TODO: 把当前的用户信息带到开单
      this.$store.dispatch('clearShopCar').then(() => {
        this.$store.commit('CLEAR_CURRENT_CARD')
        this.$router.replace({ name: 'Kaidan', src: 'index' })
      })
    },
    transactionNewCard() {
      // TODO: 把当前的用户信息带到快单
      this.$store.dispatch('clearShopCar').then(() => {
        this.$store.commit('CLEAR_CURRENT_CARD')
        this.$router.push({ name: 'ChargeTicket' })
      })
    },
    scroll(obj) {
      this.top = -obj.y
    },
    getDataByCarOrCus() {
      // TIP: 这个id可能是车的id也可能是人的id（此处先人）
      if (this.$route.query.id) {
        // HACK: 这里如果有id就赋值 没有就保持之前的id
        this.id = this.$route.query.id
        this.getData()
      }
      if (this.$route.query.carid) {
        this.carid = this.$route.query.carid
        this.getDataByCar()
        // 只要是车id就是无客户信息的情况
        this.onCustomData = true
      }
    },
    toDetal(item) {
      this.$router.push({ name: 'TicketDetail', query: { id: item.id } })
      this.$store.commit('ORDER_OF_CUSTOM', item.member)
    },
    addCarFun(code) {
      // 添加车辆
      this.$router.push({
        // 如果是新增车辆
        name: 'NewCar',
        query: {
          memberId: this.cusDate ? this.cusDate.id : '',
          motorId:
            this.detailData.motors &&
            this.detailData.motors[this.currCarIndex].id
              ? this.detailData.motors[this.currCarIndex].id
              : '',
          code: code || ''
        }
      })
    },
    addNewMember() {
      // 添加客户
      this.$router.push({
        name: 'NewCustom',
        query: {
          motorId: this.$route.query.carid ? this.$route.query.carid : ''
        }
      })
    },
    toCashdesk() {
      // TODO: 把当前的用户信息带到开单
      this.$store.dispatch('clearShopCar').then(() => {
        this.$store.commit('CLEAR_CURRENT_CARD')
        this.$router.replace({ name: 'CashDesk' })
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    to.params.refresh = this.refresh
    next()
  },
  activated() {
    this.refresh = false
    if (this.$route.params.refresh) {
      this.currCarIndex = 0
    }
    this.getDataByCarOrCus()
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
.detailBox {
  .c_header .c_header-isborder.c_header-border {
    background-image: none;
  }
}
.addCar {
  color: @primary!important;
  font-size: 18px;
  .icon {
    font-size: 24px;
    color: @primary!important;
  }
}
.no-car {
  padding: 100px 0;
  font-size: 18px;
  text-align: center;
  color: #999;
}
.nineBox {
  margin: -70px 8px 5px 8px;
  box-shadow: 0px 0px 5px 1px #ededed;
  // border: 1px solid #000;
  background-color: #ffffff;
  border-radius: 5px;
  overflow: hidden;
}
.detail-tab-nav {
  display: flex;
  height: 50px;
  line-height: 50px;
  background: #ffffff;
  text-align: center;
  justify-content: space-between;
  .detail-tab-item {
    flex: 1;
    // width: 33.3%;
    border-right: 1px solid #fcfcfc;
    border-bottom: 1px solid #fcfcfc;
    .detail-tab-item-text {
      position: relative;
      font-size: 14px;
    }
    .line {
      width: 1px;
      height: 17px;
      margin-top: 17px;
      border-right: 1px solid @app;
    }
  }
}
.detail-icon-relative {
  position: relative;
}
.detail-footer-btn {
  background: #ffffff;
  height: 50px;
  color: #333333;
  font-size: 14px;
  line-height: 1;
  text-align: center;
  .icon {
    color: #333333 !important;
    font-size: 26px;
    line-height: 1.2;
  }
}
.cus-info-test {
  height: 80px;
  width: 100%;
  background: #000;
  color: #ffffff;
  display: none;
}
.cus-fixed {
  position: fixed;
  top: 40px;
  left: 0;
  z-index: 99;
  display: block;
}
.top-cus-box {
  background: #434a5a;
  width: 100%;
  .cus-info {
    height: 60px;
    display: flex;
    color: #ffffff;
    .cus-icon-box {
      width: 80px;
      .cus-icon-detail {
        margin-top: 10px;
        margin-right: 10px;
        float: right;
        height: 45px;
        width: 45px;
        border-radius: 50%;
        background: #eeeeee;
        text-align: center;
        line-height: 50px;
        font-size: 28px;
        color: #434a5a;
        vertical-align: top;
        overflow: hidden;
      }
    }

    .cus-info {
      flex: 1;
      display: block;
      .cus-name {
        font-size: 18px;
        font-weight: 700;
        line-height: 2.2;
      }
      .cus-tel {
        font-size: 14px;
      }
    }
  }
  .cus-payment {
    display: flex;
    height: 66px;
    .payment-item {
      flex: 1;
      display: block;
      text-align: center;
      color: #bbbbbb;
      font-size: 15px;
      .money {
        font-size: 16px;
        font-weight: 700;
        line-height: 2;
      }
    }
  }
}
.detail-tab {
  display: flex;
  height: 80px;
  background: @app;
  .detail-tab-item {
    flex: 1;
    // width: 33.3%;
    border-right: 1px solid #fcfcfc;
    border-bottom: 1px solid #fcfcfc;
    justify-content: space-between;
    text-align: center;
    .tab-item-text {
      position: relative;
      font-size: 15px;
      color: #fff;
      .text-badge {
        height: 15px;
        width: 15px;
        line-height: 15px;
        text-align: center;
        color: #ffffff;
        font-size: 12px;
        background: #e50000;
        border-radius: 50%;
        position: absolute;
        right: -10px;
        top: -10px;
      }
    }
    .tab-item-icon {
      height: 48px;
      line-height: 60px;
      color: #ffffff;
      font-weight: 600;
      .icon {
        font-size: 28px;
        color: #fff !important;
      }
    }
  }
}
.footer-btn--fixed {
  height: 50px;
  display: flex;
  .footer-btn-item {
    flex: 1;
    background: #1590ff;
    color: #ffffff;
    text-align: center;
    line-height: 50px;
    font-size: 18px;
    font-weight: 700;
    &.darken {
      background: darken(#1590ff, 20%);
    }
    &.lighten {
      background: lighten(#1590ff, 20%);
    }
  }
}
.van-tab--active {
  color: #1590ff;
}
.van-tabs__nav-bar {
  background-color: #1590ff;
}
.van-tabs--scrollable .van-tab {
  flex: 0 0 25%;
}
.detail-tab-new {
  background: #fff;
  // border-radius: 8px;
  // margin: 10px 5px;
  .detail-tab-item {
    .tab-item-icon {
      color: @primary !important;
    }
    .tab-item-text {
      color: #000;
    }
    .line {
      border-right: 1px solid #ccc;
    }
    .tab-item-icon {
      .iconfont {
        color: @primary !important;
      }
    }
  }
}
.detail-tab-nav-new {
  .detail-tab-item {
    .line {
      border-right: 1px solid #f8f8f8;
    }
    .detail-tab-item-num {
      color: #d73962;
      font-style: normal;
    }
  }
}
.top-cus-box-new {
  background: #f8f8f8;
  .top-cus-names,
  .top-cus-phone {
    font-weight: 500;
    display: flex;
    align-items: center;
    .telBox {
      display: flex;
      align-items: center;
      height: 22px;
      position: relative;
    }
  }
  .top-cus-info {
    height: 80px;
    margin-left: 10px;
    border-bottom: 1px solid #f8f8f8;
    padding-top: 20px;

    .top-cus-name {
      display: inline-block;
      vertical-align: top;
      padding-left: 10px;
      line-height: 20px;
      position: relative;
      font-weight: 500;
      .top-cus-name-badge {
        background: #e6bd81;
        color: #fff;
        font-size: 10px;
        border-radius: 2px;
        padding: 1px 2px;
        font-style: normal;
      }
      .v_icon--wrapper {
        display: inline;

        .icon-nv {
          color: #ff4d94 !important;
        }
      }
    }
    .icon-sex {
      position: absolute;
      top: 44px;
      left: 40px;
      z-index: 9;
      color: @primary !important;
    }
    .top-cus-portrait {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      position: relative;
      background: #ccc;
      overflow: hidden;
      display: inline-block;
      .v_icon--wrapper {
        height: ato;
      }

      .top-cus-edit {
        // font-style: normal;
        // font-size: 8px;
        // width: 100%;
        // background: rgba(0, 0, 0, 0.3);
        // position: absolute;
        // bottom: 0;
        // text-align: left;
        // color: #fff;
        // padding: 2px 0 0 12px;
      }
      .icon-xiaotubiao-49 {
        position: absolute;
        top: 1px;
        left: 2px;
        color: #fff !important;
        font-size: 38px;
      }
    }
    .cus-contact {
      float: right;
      margin: 18px 10px 0 0;
      .iconfont {
        font-size: 20px;
        color: @primary;
        margin-left: 20px;
      }
    }
  }
}
.no-cus {
  padding: 47px 10px 20px 14px;
  .v_icon--wrapper {
    text-align: center;
  }
}
.my-detail--tabs-nws {
  .van-tabs__wrap {
    right: 50px;
  }
  .van-tab {
    width: auto !important;
    padding: 0 5px;
    .van-ellipsis {
      color: #333333;
      font-weight: 600;
      font-size: 16px;
    }
    &.van-tab--active {
      .van-ellipsis {
        color: #1690ff;
        font-weight: 600;
        font-size: 16px;
      }
    }
  }

  .van-tabs__nav {
    background: #ddd;
    .van-tab {
      background: #e8e8e8;
      margin-top: 3px;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      margin-right: 2px;
    }
    .van-tab--active {
      background: #fff;
      border-radius: 4px 4px 0 0;
    }
  }
  .van-icon {
    color: @primary;
  }
}
.momtor-tab-box {
  position: relative;
  .my-detail--tabs {
    background: #ddd;
  }
  .van-tabs__content {
    background: #f0f0f0;
  }
  .addmotor {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 9;
    background: #fff;
    line-height: 44px;
    height: 44px;
    width: 46px;
    text-align: center;
    .iconfont {
      color: @primary;
    }
  }
}
.editblue {
  .c_cell .title {
    color: @primary;
  }
}
.blacklist {
  .c_cell .title {
    color: #d73962;
  }
}
.popup-card-new {
  border: 1px solid #cb9c2e;
  background: #fff4dc;
  padding: 10px 10px 0 20px;
  .card-scope {
    font-size: 14px;
  }
  .ps {
    border: none;
    background: none;
    line-height: 33px;
  }
}
.popup-scroll-tishi {
  font-size: 12px;
  color: #999;
  border-bottom: 1px solid #ddd;
  text-align: center;
  padding-bottom: 3px;
}
.addNewcar {
  position: absolute;
  bottom: 0;
  text-align: center;
  width: 100%;
  padding: 16px 0;
  border-top: 1px solid #ddd;
}
.motor-no-card {
  color: #999;
  text-align: center;
  padding: 100px 0;
}
.coupon-list {
  border: 1px solid #ffa216;
  background: #fff3e2;
  padding: 0 10px 0 20px;
  border-radius: 6px;
  margin: 10px 5px;
  line-height: 27px;
  .c-card-coupon-receive--left {
    float: left;
    width: 70%;
    padding: 10px 0;
  }
  .c-card-coupon-receive--right {
    float: right;
    position: relative;
    width: 29%;
    border-left: 1px dashed #ffa216;
    padding: 10px 0 10px 15px;
    .c-card-coupon-receive--date {
      font-size: 12px;
      color: #666;
    }
    .c-card-coupon-receive--price {
      color: #d73962;
    }
    .up-circle {
      width: 30px;
      height: 15px;
      border: 1px solid #ffa216;
      background: #f0f0f0;
      position: absolute;
      top: -1px;
      left: -15px;
      border-radius: 0 0 30px 30px;
      border-top: 1px solid #f0f0f0;
    }
    .dwn-circle {
      width: 30px;
      height: 15px;
      border: 1px solid #ffa216;
      background: #f0f0f0;
      position: absolute;
      bottom: -1px;
      left: -15px;
      border-radius: 30px 30px 0 0;
      border-bottom: #f0f0f0;
    }
  }
}
.topMoreBox {
  position: absolute;
  right: 16px;
  top: 35px;
  color: #1790ff;
  font-size: 16px;
  font-weight: 500;
}
.smsTopPicBox {
  margin: 0 15px;
}
</style>
