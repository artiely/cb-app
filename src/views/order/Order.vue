<template>
  <div :class="{orderBox: showBatch}">
    <!-- TIP: 批量操作 lefticon="icon-xiaotubiao-45" @left-click="handlerPopup" -->
    <v-header title="销售订单" :border="false" :isBack="false">
      <span slot="righttext">
        <v-icon name="icon-lujing2" class="batchIcon" @click.native="batchFun('batchClose')"></v-icon>
        <v-icon name="icon-xiaotubiao-20" @click.native="filterVisiable=true"></v-icon>
      </span>
    </v-header>
    <v-search v-model="keywords" placeholder="车牌号/客户名/手机号"></v-search>
    <v-tab-bar :data="orderStatus" v-model="active" :count="count" style="background:#f8f8f8"></v-tab-bar>
    <div class="c-scroll-wrapper-top-search-tab-bottom">
        <cube-scroll ref="scroll" :data="data" @scroll="scroll" :scrollEvents="['scroll']" @pulling-up="onPullingUp" :options="options" @pulling-down="onPullingDown">
          <v-br height="15"></v-br>
          <filter-bar :data="filterBarList" @change-filter="changeFilter__"></filter-bar>
          <div v-if="data.length>0">
            <div class="c-order-item-new" v-for="(item,index) in data" :key="item.id">
              <div class="c-order-header">
                <span class="fl c-order-date">{{item.updateDate|timeFormat()}}</span>
                <span class="fr c-order-more tap-area" @click="more(item,index)">
                  <v-icon name="icon-gengduo"></v-icon>
                </span>
                <span class="fr c-order-status">
                  <span class="c-order-item--status stayjs" v-if="item.createType==1 && item.statusPay!=98">待结算</span>
                  <span class="c-order-item--status stayhk" v-if="item.createType!=1 && item.statusPay!=98">待划卡</span>
                </span>
              </div>
              <div class="c-order-body" @click="toDetail(item)">
                <div class="c-order-brand">
                  <v-icon name="icon-morencheliang"></v-icon>
                </div>
                <div class="c-order-info">
                  <div class="c-order-idcard-price clearfix">
                    <div class=" fl c-order-idcard">
                      <span v-if="item.motorLicence">{{item.motorLicence |carIdFormat()}}</span>
                      <span v-else class="c-order-nodate">—</span>
                    </div>
                    <div class="fr c-order-price" :class="{'c-order-price-status':item.statusPay!=98}">
                      {{item.moneySrc|currency()}}
                    </div>
                  </div>
                  <div class="c-order-userinfo">
                    <span v-if="item.memberUsername">
                      {{item.memberUsername|telFormat()}} {{item.memberName}}
                    </span>
                    <span v-else class="c-order-nodate">
                      —
                    </span>
                    <span class="fr">
                      <v-badge v-if="item.createType==2" type="折扣卡">折扣卡</v-badge>
                      <v-badge v-if="item.createType==3" type="次卡">次卡</v-badge>
                    </span>
                  </div>
                </div>
              </div>
              <div class="c-order-mark" :class="{'c-order-mark-show':item.markShow}">
                <div class="c-order-btn-group">
                  <div class="c-order-btn-cell">
                    <div class="c-order-btn" :class="!(
        item.status === '98' ||
        item.statusPay === '98' ||
        item.statusPay === '2'
      )?'':'disabled'" @click="edit(item)">编辑</div>
                  </div>
                  <div class="c-order-btn-cell">
                    <div class="c-order-btn" :class="(item.statusPay === '2' || item.statusPay === '1')?'':'disabled'" @click="pay(item)">结算</div>
                  </div>
                  <div class="c-order-btn-cell">
                    <div class="c-order-btn" @click="del(item,index)" :class="{'disabled':(item.statusPay === '98' || item.status === '98'|| item.statusPay === '2')}">删除</div>
                  </div>
                  <div class="c-order-btn-cell">
                    <div class="c-order-btn" :class="{'disabled':item.closeFlag=='1' || (item.statusPay === '98' &&item.status==='98')||(item.statusPay !== '98'&&item.statusPay !== '98')}" @click="close(item,index)">关单</div>
                  </div>
                </div>
                <span class="c-order-more-ps tap-area" @click="moreHide(item,index)">
                  <v-icon name="icon-gengduo"></v-icon>
                </span>
              </div>
            </div>
          </div>
      <v-nodata v-else></v-nodata>
        </cube-scroll>
    </div>

    <!-- 批量操作 -->
    <!-- <van-popup v-model="showBatch" class="showBatch" position="right" style="width:120px;top:66px;">
      <div @click="batchFun('batchClose')">批量关闭</div>
    </van-popup> -->

    <!-- 筛选 -->
    <van-popup v-model="filterVisiable " position="right " style="width:80%;height:100%; ">
      <v-popup-title @close="filterVisiable=false "></v-popup-title>
      <div class="popup-innerbox " style="padding:10px ">
        <div class="filter-title ">结算方式</div>
        <van-row gutter="20 ">
          <van-col span="8 " v-for="(item) in orderAccountType " :key="item.name " @click.native="changeOrderAccount__(item) " style="margin-bottom:20px; ">
            <v-button :type="item.id===currorderAccountType.id? 'primary-solid': '' ">{{item.name}} </v-button>
          </van-col>
        </van-row>
        <div class="filter-title ">按开单时间</div>
        <van-row gutter="20">
          <van-col span="8 " v-for="(item) in date " :key="item.name " @click.native="changeDate__(item) " style="margin-bottom:20px; ">
            <v-button :type="item.id==currdate.id? 'primary-solid': '' ">{{item.name}} </v-button>
          </van-col>
        </van-row>
        <div class="filter-title ">已关闭订单</div>
        <van-row gutter="20">
          <van-col span="12 " v-for="(item) in closeDate " :key="item.name " @click.native="changeCloseDate__(item) " style="margin-bottom:20px; ">
            <v-button :type="item.id==currClasoedate.id? 'primary-solid': '' ">{{item.name}} </v-button>
          </van-col>
        </van-row>
      </div>
      <v-footer>
        <v-footer-item class="footer-white " @click.native="handleReset ">重置</v-footer-item>
        <v-footer-item @click.native="filterVisiable=false ">确定</v-footer-item>
      </v-footer>
    </van-popup>
    <van-popup v-model="moreCtrlShow" style="width:120px;height:80px;left:60px;top:0px" position="top">
      <div class="order-ctrl-btn" @click="toComplete">批量完工</div>
      <div class="order-ctrl-btn">批量关闭</div>
    </van-popup>
    <!-- 密码 -->
    <Checkstand :options="CheckstandOptions" v-model="password" />
  </div>
</template>
<script>
// import OrderItem from '@/components/OrderItem'
import FilterBar from '../../components/FilterBar'
import filter from '../../common/mixins/filter.js'
import scroll from '../../common/mixins/scroll.js'
import moment from 'dayjs'
import Checkstand from '@/components/Checkstand'
export default {
  components: {
    // OrderItem,
    FilterBar,
    Checkstand
  },
  mixins: [filter, scroll],
  data() {
    return {
      filterVisiable: false,
      CheckstandOptions: {
        money: '',
        show: false,
        type: 1,
        userinfo: ''
      },
      // showBatch: false,
      orderStatus: [
        { name: '全部', id: 0 },
        { name: '待结算', id: 1 },
        { name: '已结算', id: 2 }
      ],
      // currClasoedate: { name: '不显示已关闭订单', id: 0, closeFlag: '0' },
      // closeDate: [
      //   { name: '不显示已关闭订单', id: 0, closeFlag: '0' },
      //   { name: '仅显示已关闭订单', id: 1, closeFlag: '1' }
      // ],
      keywords: '',
      timer: null,
      count: [],
      query: {
        pageNo: 1,
        pageSize: 10,
        'searchParameter.keyWord': '',
        'searchParameter.starTime': '',
        'searchParameter.endTime': '',
        chargeType: '',
        orderNo: '',
        type: '',
        createType: '',
        status: '',
        statusPay: '',
        memberUsername: '',
        'member.id': '',
        memberName: '',
        motorLicence: '',
        closeFlag: '0',
        statusPaySearch: ''
      },
      data: [],
      totalPage: 0,
      moreCtrlShow: false,
      active: 0,
      password: '',
      currentData: {}
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
    active: {
      handler(val) {
        switch (val) {
          case 0: // 全部
            this.query['status'] = ''
            this.query['statusPay'] = ''
            this.query['pageNo'] = 1
            this.query['statusPaySearch'] = ''
            break
          case 2: // 已结算
            this.query['status'] = ''
            this.query['statusPay'] = '98'
            this.query['pageNo'] = 1
            this.query['statusPaySearch'] = ''
            break
          case 1: // 待结算
            this.query['status'] = ''
            this.query['statusPay'] = ''
            this.query['pageNo'] = 1
            this.query['statusPaySearch'] = 1
        }
      },
      immediate: true
    },
    query: {
      handler(val) {
        if (val.pageNo === 1) {
          this.$refs.scroll.scrollTo(0, 0)
        }
        this.getData()
      },
      deep: true
    },
    'query.orderNo': {
      handler() {
        this.active = 0
      }
    },
    keywords: {
      handler(val) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.query['searchParameter.keyWord'] = val
          this.query.pageNo = 1
        }, 500)
      }
    }
  },
  methods: {
    batchFun(data) {
      this.$router.push({ name: 'BatchComplete', params: { type: data } })
    },
    toComplete() {
      this.$router.push('/batchcomplete')
    },
    scroll() {
      // console.log('123')
      // this.moreHide()
    },
    handlerPopup() {
      this.moreCtrlShow = true
    },
    async getData() {
      let res = await this.$api.ORDER_LIST(this.query)
      if (res.status === 1) {
        if (this.query.pageNo === 1) {
          this.data = res.page.list || []
        } else {
          this.data = this.data.concat(res.page.list || [])
        }
        this.count = [
          res.data.numAll,
          res.data.numStatusPayUnsettled,
          res.data.numStatusPaySettled
        ]
        this.totalPage = res.page.totalPage
      } else {
        console.error('获取订单失败')
      }
    },
    changeType(item) {
      this.currentType = item
    },
    changeStatus() {},
    changeDate(item) {
      this.currentDate = item
    },
    toDetail(item) {
      // 有人有车
      if (item.member && item.motor) {
        let data = {
          licence: item.motorLicence,
          member: {
            ...item.member,
            name: item.memberName,
            username: item.memberUsername
          },
          id: item.motor.id
        }
        this.$store.commit('ORDER_OF_CAR', data)
        // 只有人
      } else if (item.member) {
        let data = {
          name: item.memberName,
          username: item.memberUsername,
          id: item.member.id
        }
        this.$store.commit('ORDER_OF_CUSTOM', data)
        // 只有车
      } else if (item.motor) {
        let data = { licence: item.motorLicence, id: item.motor.id }
        this.$store.commit('ORDER_OF_CAR', data)
        // 无主
      } else {
        this.$store.commit('CLEAR_ORDER_CUSTOM')
      }
      this.$router.push({ name: 'OrderDetail', query: { id: item.id } })
    },
    more(item, index) {
      this.data = this.data.map((v, i) => {
        v.markShow = false
        if (i === index) {
          v.markShow = !v.markShow
        }
        return v
      })
    },
    moreHide(item, index) {
      this.data = this.data.map((v, i) => {
        v.markShow = false
        return v
      })
    },
    async edit(item) {
      if (
        !(
          item.status === '98' ||
          item.statusPay === '98' ||
          item.statusPay === '2'
        )
      ) {
        let res = await this.$api.ORDER_DETAIL({ id: item.id })
        // 这是一部大操作 拆分组合数据
        // TIP: 这里要设置3种状态
        // 1设置 orderOfCustom 2 设置 shopCar 3 设置 orderInfo
        if (res.status === 1) {
          let data = res.data
          this.$store.dispatch('clearOrder')
          // 如果是划卡要设置当前卡的信息
          if (data.memberCard && data.memberCard.id) {
            this.$store.commit('SET_CURRENT_CARD', data.memberCard)
          }
          let orderInfo = {
            sellEmployee: data.sellEmployee || '',
            id: data.id || '',
            orderNoHand: data.orderNoHand || '',
            motorMileCurrent: data.motorMileCurrent,
            startTime: data.startTime
              ? moment(data.startTime).format('YYYY-MM-DD')
              : '',
            remarks: data.remarks || ''
          }

          this.$store.commit('SET_ORDER_INFO', orderInfo)
          let orderItems =
            data.orderItems &&
            data.orderItems.map(v => {
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
                cardType: data.createType || '', // 卡类型
                cardId: data.memberCard ? data.memberCard.id : '', // 卡id
                dealEmployee: v._s || '' // 施工员
              }
            })

          this.$store.commit('PUSH_SHOP_CAR', orderItems)
          // 分 车和人的情况
          // 设置当前的客户
          if (data.member && data.motor) {
            let orderOfCustom = {
              licence: data.motorLicence,
              id: data.motor.id,
              member: {
                ...data.member,
                name: data.memberName ? data.memberName : '',
                username: data.memberUsername
              }
            }
            this.$store.commit('ORDER_OF_CAR', orderOfCustom)
          } else if (data.member) {
            let orderOfCustom = {
              id: data.member.id || '',
              name: data.memberName || '',
              username: data.memberUsername || ''
            }
            this.$store.commit('ORDER_OF_CUSTOM', orderOfCustom)
          } else if (data.motor) {
            let orderOfCar = {
              id: data.motor.id || '',
              licence: data.motorLicence || ''
            }
            this.$store.commit('ORDER_OF_CAR', orderOfCar)
          } else {
            // 无车无人
            this.$store.commit('CLEAR_ORDER_CUSTOM')
          }
          this.$router.push('/kaidan')
        }
      } else {
        this.$toast('已结算订单不可编辑')
      }
    },
    pay(item) {
      this.setCusInfo(item)
      this.currentData = item
      console.log(this.userinfo)
      if (item.statusPay === '2' || item.statusPay === '1') {
        if (item.createType === '2' || item.createType === '3') {
          let data = {
            cardType: item.createType,
            discount: item.memberCard.discount,
            name: item.memberCard.name
          }
          this.$store.commit('SET_CURRENT_CARD', data)
          this.CheckstandOptions.show = true
          this.CheckstandOptions.money = item.moneySrc
          this.CheckstandOptions.userinfo = {
            motor: { licence: item.motorLicence || '' },
            member: {
              name: item.memberName || '',
              username: item.memberUsername || ''
            }
          }
        } else {
          this.$router.replace({ name: 'Jiesuan', query: { orderId: item.id } })
        }
      } else {
        this.$toast('该订单已结算')
      }
    },
    async takeCard() {
      const toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        message: '结算中...'
      })
      let res = await this.$api.TAKE_CARD_ORDER({
        id: this.currentData.id,
        memberCardPwd: this.password
      })
      this.password = ''
      toast.clear()
      if (res.status === 1) {
        this.$toast.success('结算成功')
        this.query.pageNo = 1
        this.getData()
      } else {
        console.error(res)
      }
    },
    close(item, index) {
      // 未结算并且未完工 已完工并且已结算 的都不可关闭
      if (
        (item.statusPay === '98' && item.status === '98') ||
        (item.statusPay !== '98' && item.status !== '98') ||
        item.closeFlag === '1'
      ) {
        this.$toast('该订单不可关闭')
        return
      }
      this.$dialog
        .confirm({
          title: '确定关闭吗？',
          message: ' ',
          confirmButtonText: '确定'
        })
        .then(async() => {
          // on close
          let res = await this.$api.ORDER_CLOSE({ ids: item.id })
          if (res.status === 1) {
            this.$toast.success('已关闭')
            this.data.splice(index, 1)
            this.allFalse()
          }
        })
        .catch(() => {
          // on cancel
        })
    },
    allFalse() {
      this.data = this.data.map((v, i) => {
        v.markShow = false
        return v
      })
    },
    setCusInfo(item) {
      let data = ''
      // 有人有车
      if (item.member && item.motor) {
        data = item.motor
        data.member = item.member
        this.$store.commit('ORDER_OF_CAR', data)
        // 只有人
      } else if (item.member) {
        data = item.member
        this.$store.commit('ORDER_OF_CUSTOM', data)
        // 只有车
      } else if (item.motor) {
        data = item.motor
        this.$store.commit('ORDER_OF_CAR', data)
      }
    },
    async del(item, index) {
      if (
        item.statusPay === '98' ||
        item.status === '98' ||
        item.statusPay === '2'
      ) {
        this.$toast('该订单不可删除')
      } else {
        this.$dialog
          .confirm({
            title: '确定删除吗？',
            message: '删除后不可恢复。',
            confirmButtonText: '确定'
          })
          .then(async() => {
            let res = await this.$api.ORDER_DEL({ id: item.id })
            if (res.status === 1) {
              this.$toast.success('已删除')
              this.data.splice(index, 1)
              this.allFalse()
            }
          })
          .catch(() => {
            // on cancel
          })
      }
    }
  },
  created() {
    if (!this.$route.params.oid && !this.$route.params.user) {
      this.getData()
    }
  },
  activated() {
    if (this.$route.params.oid || this.$route.params.user) {
      this.getData()
    } else if (this.$route.params.refresh) {
      this.query.pageNo = 1
      this.getData()
    }
    this.moreHide()
    this.$nextTick(() => {
      this.$refs.scroll && this.$refs.scroll.refresh()
    })
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
.c-order-item-new {
  margin-bottom: 20px;
  position: relative;
  .c-order-mark {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.75);
    display: none;
    .c-order-more-ps {
      position: absolute;
      top: 0;
      right: 10px;
      height: 30px;
      line-height: 30px;
      .icon {
        font-size: 20px;
        color: #fff !important;
      }
    }
    &.c-order-mark-show {
      display: block;
    }
    .c-order-btn-group {
      padding-left: 16px;
      padding-right: 30px;
      line-height: 110px;
      display: flex;
    }
    .c-order-btn-cell {
      flex: 1;
      .c-order-btn {
        display: inline-block;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        text-align: center;
        line-height: 50px;
        font-size: 15px;
        font-weight: 500;
        color: #1690ff;
        background: #fff;
        &.disabled {
          background: #c7c7c7;
          color: #fff;
        }
      }
    }
  }
  .c-order-nodate {
    font-size: 14px;
    color: #999;
  }
  .c-order-header {
    height: 30px;
    line-height: 30px;
    background: #f8f8f8;
    padding: 0 10px 0 15px;
    overflow: hidden;
    .c-order-date {
      color: #999;
      font-size: 12px;
    }
    .c-order-more {
      .icon {
        font-size: 20px;
        color: #1690ff !important;
      }
      &.c-order-more-zindex {
        z-index: 99;
        .icon {
          color: #fff !important;
        }
      }
    }
    .c-order-status {
      font-size: 14px;
      padding: 0 10px;
    }
  }
  .c-order-body {
    height: 80px;
    background: #fff;
    display: flex;
    padding: 0 15px;
    .c-order-brand {
      width: 44px;
      height: 44px;
      margin-top: 18px;
      background: #f0f0f0;
      border-radius: 50%;
      text-align: center;
      line-height: 44px;
      .icon {
        font-size: 22px;
        color: #fff !important;
      }
    }
    .c-order-info {
      flex: 1;
      padding-left: 15px;
      .c-order-idcard-price {
        padding-top: 20px;
        .c-order-idcard {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          span {
            font-weight: 600;
          }
        }
        .c-order-price {
          font-size: 18px;
          color: #0dcc6d;
          font-weight: 500;
          &.c-order-price-status {
            color: #d73962;
          }
          span {
            font-weight: 500;
          }
        }
      }
      .c-order-userinfo {
        padding-top: 8px;
        font-size: 14px;
        color: #666;
        font-weight: 500;
        span {
          font-weight: 500;
        }
      }
    }
  }
}
.order-ctrl-btn {
  height: 40px;
  line-height: 40px;
  padding: 0 15px;
  font-size: 14px;
}
.orderList {
  .c-order-item {
    width: auto;
    .c-order-item--border {
      padding-top: 4px;
    }
  }
}
.orderBox {
  .van-modal {
    top: 48px;
  }
}
.showBatch {
  div {
    font-size: 14px;
    color: #666;
    padding: 10px 20px 10px 10px;
  }
}
.batchIcon {
  margin-right: 15px;
}
</style>
