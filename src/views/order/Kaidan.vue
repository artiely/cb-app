<template>
  <div>
    <v-header title="开单" :leftClick="handleLeft"></v-header>
    <!-- <v-br :height="64"></v-br> -->
    
    <v-scroll-page :top="44" :bottom="50">
      
      <cube-scroll ref="orderScroll" :data="okCart">
        <div>
          <v-br height="20"></v-br>
          <div style="display:flex;background:#e8e8e8">
      <order-custom noHeader style="flex:1;border-bottom-right-radius: 10px;border-top-right-radius: 10px;overflow:hidden"></order-custom>
      <div style="width:65px;" class="order-base-info-box" @click="orderBaseInfoVisiable=true">
        <div class="order-base-info-card">
          <v-icon name="icon-dingdanjibenxinxi"></v-icon>
          <div>订单信息</div>
        </div>
      </div>
    </div>
          <div class="order-temp-wrapper">
            <cube-scroll v-if="tempList" ref="scroll" :data="tempList" direction="horizontal">
              <div class="order-temp-list-wrapper" style="padding-right:50px">
                <div v-for="item in tempList" :key="item.id" class="order-temp--item tap-area" :class="{'active':currentTemp.id==item.id}" @click="choiceTemp(item)">{{ item.name }}</div>
              </div>
            </cube-scroll>
            <div v-else style="font-size:14px;height:40px;line-height:40px;color:#c7c7c7;padding:0 15px" @click="toTemp">暂无开单模板，
              <a style="color:#1690ff">去设置。</a>
            </div>
            <div class="order-baseinfo--box" @click="alertTip">
              <div>
                <v-icon name="icon-icon-"></v-icon>
              </div>
            </div>
          </div>
          <div v-if="okCart.length>0">
            <div v-for="(sku,i) in okCart" :key="i">
              <div class="goods-card">
                <div class="goods-card--gastype">
                  <div class="goods_del" @click="delShopCart(sku)">
                    <v-icon name="icon-shanchu2"></v-icon>
                  </div>
                </div>
                <div class="top-box-goods">
                  <div class="title textover1">{{sku.gasName}}
                    <v-badge v-if="sku.gasType && sku.gasType==1" size="small" type="商">商</v-badge>
                    <v-badge v-else size="small" type="服">服</v-badge>
                  </div>
                  <p class="specification">{{sku.name}}
                    <span class="fr tap-area" @click="editCurrSku(i)"> {{sku.count}}
                      <span v-if="sku.gasType=='2'">次</span>
                      <span v-else>{{sku.unit}}</span>
                      &nbsp;&nbsp;×&nbsp;&nbsp; {{sku.price|currency()}}
                      <v-icon name="icon-lujing1"></v-icon>
                    </span>
                  </p>
                </div>
                <div class="discount-price clearfix" v-if="currentCard&&currentCard.discount||sku.moneyDec">
                  <div class="discount-price--badge">
                    <div class="discount-price--badge-icon">折</div>
                    <div class="discount-price--badge-money">
                      <span v-if="currentCard&&currentCard.discount">{{sku.price*sku.count*(1-currentCard.discount)|currency()}}</span>
                      <span v-else>{{sku.moneyDec|currency()}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <v-br :height="20"></v-br>
            </div>
          </div>
          <v-br :height="100" v-if="okCart.length==0"></v-br>
          <div class="add_goods">
            <div class="add_goods-item" @click="toStoreKu">选择服务/商品</div>
            <div class="add_goods-item add_goods-white" v-if="cardList.length>0" @click="cardTypeVisible=true">划卡
              <span style="color:#d73962">({{cardList.length}})</span>
            </div>
          </div>
          <v-br :height="40"></v-br>
        </div>
      </cube-scroll>
      <v-footer v-if="okCart.length>0">
        <v-footer-item class="footer-price">
          <div>
            <div class="footer-price-top">
              {{totalPrice|currency()}}
            </div>
            <div class="textover1 footer-price-bottom">
              <div v-if="currentCard">
                <v-badge v-if="currentCard&&currentCard.cardType==2" size="small" type="折扣卡">折扣卡</v-badge>
                <v-badge v-if="currentCard&&currentCard.cardType==3" size="small" type="次卡">次卡</v-badge>
                <span>
                  <span v-if="currentCard&&currentCard.cardType==2">[{{currentCard.discount*10}}折]</span>{{currentCard.name}}</span>
              </div>
              <div v-else>
                直接开单
              </div>
            </div>
          </div>
        </v-footer-item>
        <v-footer-item @click.native="handlerToNext(false,'kaidan')" :class="okCart.length==0?'footer-disable':''"> 保存</v-footer-item>
        <!-- <v-footer-item class="yellow-btn" :class="okCart.length==0?'footer-disable':''" @click.native="orderOver"> 完工</v-footer-item> -->
        <v-footer-item @click.native="toPayment" v-if="!currentCard" class="success-btn" :class="okCart.length==0?'footer-disable':''">结算</v-footer-item>
        <!-- 确定并划卡 -->
        <v-footer-item @click.native="toPaymentByCard" v-if="currentCard" class="success-btn" :class="okCart.length==0?'footer-disable':''">结算</v-footer-item>
      </v-footer>
    </v-scroll-page>
    <!-- TIP:订单基本信息 -->
    <van-popup v-model="orderBaseInfoVisiable" position="right" style="height:100%;width:100%;background:#f0f0f0" :lock-scroll="false">
      <v-header title="订单基本信息" :left-click="closeBaseinfo"></v-header>
      <v-br :height="64"></v-br>
      <v-cell-group>
        <!-- <v-cell title="销售单号" :text="oid" v-if="oid"></v-cell> -->
        <v-cell title="纸质单号" input v-model="orderNoHand"></v-cell>
        <v-cell title="销售人" :text="currentStaff.name" link @click.native="staffVisible = true"></v-cell>
        <!--  -->
        </v-cell-group>
         <v-cell-group>
        <v-cell title="进场时间" date v-model="startTime" link></v-cell>
        <v-cell title="当前里程(km)" input v-model="motorMileCurrent" type="number"></v-cell>
        <v-cell title="送车人" input v-model="senderName" 
        
        ></v-cell>
        <v-cell title="送车人电话" input v-model="senderMobile" type="tel" maxlength="11"></v-cell>
      </v-cell-group>
      <v-cell-group style="margin-bottom:5px">
      </v-cell-group>
      <v-remark v-model="remarks" placeholder="添加订单备注，如车主描述，维修说明..." ></v-remark>
      <v-upload :data="attachment"></v-upload>
      <v-br height="50"></v-br>
      <v-footer>
        <v-footer-item @click.native="orderBaseInfoVisiable=false">保存</v-footer-item>
      </v-footer>
    </van-popup>
    <!-- TIP: 销售人 -->
    <van-popup v-model="staffVisible" style="width:100%;height:70%" position="bottom" >
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

    <!-- TIP: 选卡 -->
    <van-popup v-model="cardTypeVisible" style="width:100%;height:70%" position="bottom" :lock-scroll="false" class="popup-radius">
      <v-popup-title title="请选择卡" @close="cardTypeVisible = false"></v-popup-title>
      <div class="popup-scroll-wrapper" style="top:70px">
        <cube-scroll data="disAccountList" ref="scroll">
           <div class="popup-card-wrapper" v-for="item in cardList" @click="handleCard(item)" :key="item.id">
          <div style="padding:5px 12px;">
          <v-cb-card :currentCard="item"></v-cb-card></div>
          <div class="popup-card-radio">
              <v-icon :name="currentCard.id==item.id?'icon-queding1':'icon-yuan'"></v-icon>
            </div>
        </div>
        </cube-scroll>
      </div>
    </van-popup>
    <!-- 密码 -->
    <Checkstand :options="CheckstandOptions" v-model="password" />
    <!-- 折让金额 -->
    <van-dialog class="dialog-price" v-if="okCart.length>0" v-model="showDisPrice" :showConfirmButton="false">
      <div class="dialog-price--title">
        {{okCart[currEditSkuIndex].gasName}}
        <p class="dialog-price--title-desc">{{okCart[currEditSkuIndex].name}}</p>
        <v-icon name="icon-shanchu1" class="dialog-price--title-cancel tap-area" @click.native="showDisPrice=false"></v-icon>
      </div>
      <v-cell-group>
        <v-cell title="数量">
          <div slot="text">
            <cart-ctrl :goods="okCart[currEditSkuIndex]" style="margin-top:14px;float:left;margin-left:20px" class="fr add-ctrl sku-ctrl" @add="addGoodsToCar(okCart[currEditSkuIndex])" @cut="checkCarCount(okCart[currEditSkuIndex])"></cart-ctrl>
          </div>
        </v-cell>
        <v-cell title="销售单价" input v-model="okCart[currEditSkuIndex].price" type="number" currency>
        </v-cell>
        <v-cell title="折让额" v-if="currentCard&&currentCard.discount" class="dialog-price--cell" :text="currSkuDecMoney"></v-cell>
        <v-cell title="折让额" v-else-if="currentCard&&currentCard.cardType=='3'" class="dialog-price--cell" text="不可折让"></v-cell>

        <v-cell title="折让额" v-else input v-model="okCart[currEditSkuIndex].moneyDec" type="number" currency :maxValue="okCart[currEditSkuIndex].price*okCart[currEditSkuIndex].count"></v-cell>
        <!-- <v-cell title="折让额" > -->
        <!-- </v-cell> -->
      </v-cell-group>
      <div class="dialog-price--sure" @click="showDisPrice=false">
        <div class="dialog-price--sure-money">{{currSkuSubToatl}}</div>
        <div class="dialog-price--sure-ok">确定</div>
      </div>
    </van-dialog>

  </div>
</template>

<script>
import cartCtrl from './cartCtrl/cartCtrl'
import NoOrder from './NoOrder'
import OrderCustom from './OrderCustom'
import moment from 'dayjs'
import { mapGetters, mapState } from 'vuex'
import Checkstand from '@/components/Checkstand'
import handlerToNext from '../../common/mixins/orderSave.js'
export default {
  components: {
    cartCtrl,
    NoOrder,
    OrderCustom,
    Checkstand
  },
  data() {
    return {
      name: '',
      goods: {
        count: 0
      },
      currEditSkuIndex: 0,
      currEditSkuDecMoney: '',
      // index: 0,
      password: '',
      cardKuVisible: false,
      cardTypeVisible: false,
      tempList: [],
      motorMileCurrent: '',
      currentTemp: '',
      tempDetail: '',
      orderBaseInfoVisiable: false,
      staffList: '',
      staffVisible: false,
      receptionId: '',
      cardList: [],
      orderItems: '',
      currentStaff: '',
      startTime: '',
      orderNoHand: '',
      senderName: '',
      senderMobile: '',
      remarks: '',
      // oid: '',
      CheckstandOptions: {
        show: false,
        money: '',
        type: 1
      },
      showPrice: false,
      showDisPrice: false,
      moneyDec: '',
      price: ''
    }
  },
  mixins: [handlerToNext],
  computed: {
    ...mapGetters([
      'okCart',
      'totalPrice',
      'orderCustomInfo',
      'orderOfCustomObject'
    ]),
    ...mapState({
      orderStatus: state => state.order.orderStatus,
      orderOfCustom: state => state.order.orderOfCustom,
      orderOfCar: state => state.order.orderOfCar,
      orderInfo: state => state.order.orderInfo,
      currentCard: state => state.order.currentCard
    }),
    attachment: {
      get() {
        return this.$store.state.native.orderPicList
      },
      set() {}
    },
    moneyOrTimes() {
      // 划卡的情况
      if (this.currentCard && this.currentCard.cardType === '2') {
        // 折扣卡是显示折扣金额
        return this.totalPrice
      } else {
        // 次卡是显示次数
        let i = 0
        this.okCart.map(v => {
          i += v.count
        })
        return i
      }
    },
    currSkuDecMoney() {
      // 折扣卡当前修改的折扣金额
      return this.$options.filters['currency'](
        this.okCart[this.currEditSkuIndex].price *
          this.okCart[this.currEditSkuIndex].count *
          (1 - this.currentCard.discount)
      )
    },
    currSkuSubToatl() {
      // 当前编辑的小计
      let _discount = 1
      if (this.currentCard && this.currentCard.cardType === '2') {
        _discount = this.currentCard.discount
        return this.$options.filters['currency'](
          this.okCart[this.currEditSkuIndex].price *
            this.okCart[this.currEditSkuIndex].count *
            _discount
        )
      } else if (this.currentCard && this.currentCard.cardType === '3') {
        _discount = 1
        return this.$options.filters['currency'](
          this.okCart[this.currEditSkuIndex].price *
            this.okCart[this.currEditSkuIndex].count *
            _discount
        )
      } else {
        return this.$options.filters['currency'](
          this.okCart[this.currEditSkuIndex].price *
            this.okCart[this.currEditSkuIndex].count -
            (this.okCart[this.currEditSkuIndex].moneyDec
              ? this.okCart[this.currEditSkuIndex].moneyDec
              : 0)
        )
      }
    }
  },
  watch: {
    cardTypeVisible: {
      handler() {
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 500)
      }
    },
    showDisPrice: {
      // 每次修改sku信息模态关闭后currEditSkuIndex=0避免删除sku时模态里找不到对应的索引
      handler(val) {
        if (!val) {
          this.currEditSkuIndex = 0
        }
      }
    },
    okCart: {
      handler(val) {
        // 商品为空的时候清空模板
        if (val.length === 0) {
          this.currentTemp = ''
        }
        // 单价改变的时候判断折让金额
        if (val.length > 0) {
          val.map(v => {
            if (v.moneyDec > v.price * v.count) {
              v.moneyDec = v.price * v.count
            }
          })
        }
      },
      deep: true
    },
    orderNoHand: {
      handler(val) {
        this.$store.commit('SET_ORDER_INFO', { orderNoHand: val })
      }
    },
    currentStaff: {
      handler(val) {
        this.$store.commit('SET_ORDER_INFO', { sellEmployee: val })
      }
    },
    motorMileCurrent: {
      handler(val) {
        this.$store.commit('SET_ORDER_INFO', { motorMileCurrent: val })
      }
    },
    senderName: {
      handler(val) {
        this.$store.commit('SET_ORDER_INFO', { senderName: val })
      }
    },
    senderMobile: {
      handler(val) {
        this.$store.commit('SET_ORDER_INFO', { senderMobile: val })
      }
    },
    startTime: {
      handler(val) {
        if (val) {
          this.$store.commit('SET_ORDER_INFO', {
            startTime: moment(val).format('YYYY-MM-DD')
          })
        }
      }
    },
    remarks: {
      handler(val) {
        this.$store.commit('SET_ORDER_INFO', {
          remarks: val
        })
      }
    },
    moneyOrTimes: {
      handler(val) {
        this.CheckstandOptions.money = val
      },
      deep: true,
      immediate: true
    },
    orderOfCustomObject: {
      handler(val) {
        this.CheckstandOptions.userinfo = val
      },
      deep: true,
      immediate: true
    },
    orderOfCustom: {
      handler(val, oval) {
        if (val) {
          this.getCardList(val.id)
        }
      },
      deep: true,
      immediate: true
    },
    tempDetail: {
      handler(val) {
        if (val) {
          this.formatTemp = val.map(v => {
            return {
              gasName: v.gasName,
              gasBrand: v.gasBrand,
              code: v.gasCode,
              name: v.gasSkuName,
              id: v.gasSkuId,
              gasType: v.gasType,
              price: v.gasSkuPrice,
              unit: v.gasUnit,
              dealEmployee: [],
              receiveEmployee: [],
              moneyDec: '',
              count: 1
            }
          })
        }
      },
      deep: true
    },
    password: {
      handler(val) {
        if (val.length === 6) {
          this.CheckstandOptions.show = false
          this.takeCard()
        }
      }
    },
    orderStatus: {
      handler(val) {
        this.$nextTick(() => {
          if (this.$refs.orderScroll) {
            this.$refs.orderScroll.refresh()
          }
        })
      }
    },
    refresh: {
      handler(val) {
        this.$nextTick(() => {
          if (this.$refs.orderScroll) {
            this.$refs.orderScroll.refresh()
          }
        })
      }
    },
    orderOfCar: {
      /* 新增的车有人的id查一下卡，没人卡情空 */
      handler(val) {
        if (val && val.member) {
          this.getCardList(val.member.id)
        } else {
          this.cardList = []
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    alertTip() {
      this.$dialog
        .confirm({
          title: '说明',
          message: '可将常用的服务/商品设为模板，开单时一键即可选择。',
          cancelButtonText: '取消',
          confirmButtonText: '去设置'
        })
        .then(() => {
          // on close
          this.toTemp()
        })
        .catch(() => {
          // on cancel
        })
    },
    toTemp() {
      this.$store.dispatch('clearShopCar')
      this.$router.push({ name: 'TempEdit', query: { src: 'kaidan' } })
    },
    handleLeft() {
      this.$store.dispatch('clearShopCar').then(() => {
        this.$router.replace('/index')
        this.$store.commit('CLEAR_CURRENT_CARD')
        this.$store.commit('CLEAR_ORDER_INFO')
      })
    },
    closeBaseinfo() {
      this.orderBaseInfoVisiable = false
    },
    editCurrSku(index) {
      this.currEditSkuIndex = index
      this.showDisPrice = true
    },
    toStoreKu() {
      if (this.currentCard) {
        this.$dialog
          .confirm({
            title: '确定更换吗？',
            message: '更换后，无法用卡进行结算。',
            confirmButtonText: '确定'
          })
          .then(() => {
            // 清空卡
            this.$store.commit('CLEAR_CURRENT_CARD')
            this.currentTemp = ''
            this.$router.push({ name: 'Service', params: { order: true } })
          })
          .catch(() => {})
      } else {
        this.$router.push({ name: 'Service', params: { order: true } })
      }
    },
    toOrder() {
      /*
      场景1 购物车无商品 可能是第一次开单（清空购物车后开单状态 orderType要改为0）
      场景2 购物车有商品了
      场景2.1 开单状态之前是划卡 提示清空
      场景2.2 划卡开单后改为直接开单
      */

      //  TIP:1之前无卡
      if (!this.currentCard) {
        this.$router.push({ name: 'Service', params: { order: true } })
        this.cardKuVisible = false
        // TIP:2之前有卡
      } else {
        this.$dialog
          .confirm({
            title: '确定更换吗？',
            message: '更换后，已选服务/商品将清空。',
            confirmButtonText: '确定'
          })
          .then(() => {
            this.$store.dispatch('clearShopCar').then(() => {
              this.$router.push({ name: 'Service', params: { order: true } })
              this.cardKuVisible = false
              // 清空卡
              this.$store.commit('CLEAR_CURRENT_CARD')
              this.currentTemp = ''
            })
          })
          .catch(() => {})
      }
    },
    async getCardList(id) {
      let res = await this.$api.TICKET_LIST({
        pageNo: 1,
        pageSize: 50,
        cardTypes: '2,3',
        usableType: '1',
        'member.id': id
      })
      if (res.status === 1) {
        this.cardList = res.page.list || []
      } else {
        console.error('获取卡列表失败')
      }
    },
    handleCard(item) {
      /*
      场景-1 之前无卡
      场景0 全场通用卡
      场景1 购物车没商品 直接选卡
      场景2 购物车有商品
      场景2.1 有商品且卡id不一样 提示
      场景2.2 有商品且卡id一样 提示
      场景3 卡还得判断是折扣卡还是次卡 折扣卡要带折扣
      */
      const valid = () => {
        if (item.scopeType === '1') {
          // TIP:1 全场通用 无商品
          if (this.okCart.length === 0) {
            this.$router.push({
              name: 'Service',
              query: { cardId: item.id, cardType: item.cardType }
            })
            this.$store.commit('SET_CURRENT_CARD', item)
            // TIP:2 全场通用 有商品
          } else {
            // TIP:3
            // 全场通用 有商品 卡一致
            if (this.currentCard.id === item.id) {
              this.$router.push({
                name: 'Service',
                query: { cardId: item.id, cardType: item.cardType }
              })
              this.$store.commit('SET_CURRENT_CARD', item)
              // TIP:4全场通用 有商品 卡不一致
            } else {
              this.$dialog
                .confirm({
                  title: '确定更换吗？',
                  message: '更换后，已选服务/商品将清空。',
                  confirmButtonText: '确定'
                })
                .then(() => {
                  this.$store.commit('CLEAR_SHOP_CAR')
                  this.$router.push({
                    name: 'Service',
                    query: { cardId: item.id, cardType: item.cardType }
                  })
                  this.$store.commit('SET_CURRENT_CARD', item)
                })
                .catch(() => {})
            }
          }
          // TIP:5 其他卡
        } else {
          // TIP:6 其他卡 无商品
          if (this.okCart.length === 0) {
            this.$store.commit('SET_CURRENT_CARD', item)
            this.$router.push({ name: 'CardGoods', query: { id: item.id } })
            // TIP:7 其他卡 有商品 卡不一致
          } else if (
            this.okCart.length > 0 &&
            this.currentCard.id !== item.id
          ) {
            this.$dialog
              .confirm({
                title: '确定更换吗？',
                message: '更换后，已选服务/商品将清空。',
                confirmButtonText: '确定'
              })
              .then(() => {
                // on confirm
                this.$store.commit('CLEAR_SHOP_CAR')
                this.$store.commit('SET_CURRENT_CARD', item)
                this.$router.push({ name: 'CardGoods', query: { id: item.id } })
              })
              .catch(() => {
                // on cancel
              })
            // TIP:8 其他卡 有商品 卡一致
          } else if (
            this.okCart.length > 0 &&
            this.currentCard.id === item.id
          ) {
            this.$router.push({ name: 'CardGoods', query: { id: item.id } })
          }
        }
      }

      valid()
      // this.$store.commit('SET_CURRENT_CARD', item)
      this.cardTypeVisible = false
    },
    async getEmployee() {
      let res = await this.$api.EMPLOYEE_LIST()
      if (res.status === 1) {
        this.staffList = res.list
      }
    },
    clearShopcar() {
      if (this.okCart.length === 0) return
      this.$dialog
        .confirm({
          title: '确定重置吗？',
          message: '重置后，已选服务/商品将清空。',
          confirmButtonText: '确定'
        })
        .then(() => {
          // on confirm
          this.$store.commit('CLEAR_SHOP_CAR')
          this.$store.commit('CLEAR_CURRENT_CARD')
        })
        .catch(() => {
          // on cancel
        })
    },
    handleStaff(item) {
      if (item === this.currentStaff) {
        this.currentStaff = ''
      } else {
        this.currentStaff = item
      }
      this.staffVisible = false
    },
    addGoodsToCar(item) {
      this.$store.commit('ADD_SHOP_CAR', item)
    },
    choiceTemp(item) {
      /**
       * 场景1 没有选择模板 购物车是否空
       * 场景2 选择了模板
       * 场景3 选择了模板再次选择同样的模板
       * 场景4 再次选择了不一样的模板
       */
      if (this.currentTemp === '') {
        // TIP:这里之前的逻辑是可以先选择商品后选择模板 但是由于存在划卡的模式 商品可能是从卡里出来的 所以存在问题 改为替换模板就清空购物车的做法
        // 购物车为空
        if (this.okCart.length === 0) {
          // currentTemp 会在请求前后都赋值 这不是多余的操作 请求中会清空currentTemp（因为清空购物车就清空了currentTemp）所以结束后重新赋值
          this.currentTemp = item
          const toast = this.$toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            message: '加载中...'
          })
          this.getTempDetail()
            .then(() => {
              // PUSH_SHOP_CAR 是追加商品
              this.$store.commit('PUSH_SHOP_CAR', this.formatTemp)
              this.$store.commit('CLEAR_CURRENT_CARD')
              this.currentTemp = item
            })
            .catch(() => {
              this.$toast.fail('获取模板失败')
              this.currentTemp = ''
            })
            .finally(() => {
              toast.clear()
            })
        } else {
          // 修改为购物车只要有商品 就清空
          this.$dialog
            .confirm({
              title: '确定更换模板吗？',
              message: '更换后，已选服务/商品将清空。',
              confirmButtonText: '确定'
            })
            .then(() => {
              this.currentTemp = item
              const toast = this.$toast.loading({
                duration: 0, // 持续展示 toast
                forbidClick: true, // 禁用背景点击
                message: '加载中...'
              })
              this.$store.dispatch('clearShopCar').then(() => {
                this.getTempDetail()
                  .then(() => {
                    this.$store.commit('PUSH_SHOP_CAR', this.formatTemp)
                    this.$store.commit('CLEAR_CURRENT_CARD')
                    this.currentTemp = item
                  })
                  .catch(() => {
                    this.$toast.fail('获取模板失败')
                    this.currentTemp = ''
                  })
                  .finally(() => {
                    toast.clear()
                  })
              })
            })
            .catch(() => {
              // on cancel
            })
        }
      } else if (item.id !== this.currentTemp.id) {
        this.$dialog
          .confirm({
            title: '确定更换模板吗？',
            message: '更换后，已选服务/商品将清空。',
            confirmButtonText: '确定'
          })
          .then(() => {
            this.currentTemp = item
            const toast = this.$toast.loading({
              duration: 0, // 持续展示 toast
              forbidClick: true, // 禁用背景点击
              message: '加载中...'
            })
            this.$store.dispatch('clearShopCar').then(() => {
              this.getTempDetail()
                .then(() => {
                  this.$store.commit('PUSH_SHOP_CAR', this.formatTemp)
                  this.$store.commit('CLEAR_CURRENT_CARD')
                  this.currentTemp = item
                })
                .catch(() => {
                  this.$toast.fail('获取模板失败')
                  this.currentTemp = ''
                })
                .finally(() => {
                  toast.clear()
                })
            })
          })
          .catch(() => {
            // on cancel
          })
      } else {
        // this.tempVisible = false
      }
    },
    checkCarCount(item) {
      if (item.count === 1) return
      this.$store.commit('CUT_SHOP_CAR', item)
    },
    // 开单模板
    async getOrderTemp() {
      let res = await this.$api.ORDER_TEMP({ pageNo: 1, pageSize: 50 })
      if (res.status === 1) {
        this.tempList = res.page.list
      } else {
        console.error('获取模板失败')
        this.currentTemp = ''
      }
    },
    // 异步返回模板详情
    getTempDetail() {
      return new Promise((resolve, reject) => {
        this.$api.ORDER_TEMP_DETAIL({ id: this.currentTemp.id }).then(res => {
          if (res.status === 1) {
            this.tempDetail = res.data.items || []
            resolve()
          } else {
            console.error('获取模板详情失败')
            resolve()
          }
        })
      })
    },
    delShopCart(item) {
      this.$dialog
        .confirm({
          title: '确定删除吗？',
          message: ' ',
          confirmButtonText: '确定'
        })
        .then(() => {
          // on confirm
          this.$store.commit('DEL_SHOP_CAR', item)
        })
        .catch(() => {
          // on cancel
        })
    },
    toPayment() {
      // TIP: 去结算
      this.handlerToNext(true, 'kaidan')
    },
    async takeCard() {
      // 划卡
      if (this.okCart.length === 0) {
        return
      }
      this.$store.commit('SET_ORDER_INFO', {
        memberCardPwd: this.password, // TIP: 划卡多一个密码字段
        'memberCard.id': this.currentCard.id
      })
      this.orderItems = this.okCart.map(v => {
        var dealEmployeeIds = []
        if (v.dealEmployee) {
          dealEmployeeIds = v.dealEmployee
            .filter(it => {
              if (it) {
                return it
              }
            })
            .map(it => {
              return it.id
            })
            .join()
        }

        return {
          gasType: v.gasType,
          gasSkuId: v.id,
          price: v.price,
          num: v.count,
          moneyDec: v.moneyDec,
          dealEmployeeIds: dealEmployeeIds
        }
      })
      let data = {
        orderItems: this.orderItems,
        ...this.orderCustomInfo,
        ...this.orderInfo
      }
      let res = await this.$api.TAKE_CARD(data)
      this.password = ''
      if (res.status === 1) {
        this.$toast.success('结算成功')
        this.$router.push({
          name: 'Order',
          params: { refresh: true }
        })
        this.$store.dispatch('clearOrder')
      } else {
        this.$dialog
          .alert({
            title: '提示',
            message: res.stateMessage
          })
          .then(() => {
            // on close
          })
      }
    },
    toPaymentByCard() {
      this.CheckstandOptions.show = true
    },
    orderOver() {
      this.handlerToNext(true, 'shigong')
    }
  },
  activated() {
    this.getOrderTemp()
    if (this.$route.query.id) {
      this.receptionId = this.$route.query.id
    }
    // 先清空
    if (this.$route.params.src === 'index') {
      // this.$store.dispatch('clearOrder')
      this.$store.commit('CLEAR_ORDER_INFO')
      this.$store.commit('CLEAR_SHOP_CAR')
      this.$store.commit('CLEAR_CURRENT_CARD')
      this.$store.commit('CLEAR_NATIVE_PIC_ORDER')
    }
    this.currentStaff = this.$store.state.order.orderInfo.sellEmployee || ''
    this.startTime = this.$store.state.order.orderInfo.startTime || ''
    this.orderNoHand = this.$store.state.order.orderInfo.orderNoHand || ''
    this.remarks = this.$store.state.order.orderInfo.remarks || ''
    this.senderName = this.$store.state.order.orderInfo.senderName || ''
    this.senderMobile = this.$store.state.order.orderInfo.senderMobile || ''
    this.motorMileCurrent =
      this.$store.state.order.orderInfo.motorMileCurrent || ''

    this.$nextTick(() => {
      if (this.$refs.orderScroll) {
        this.$refs.orderScroll.refresh()
      }
    })
    this.getEmployee()
  }
}
</script>
