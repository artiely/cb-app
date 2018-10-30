<template>
  <div>
    <v-header title="办卡" :left-click="handleLeft"></v-header>

    <div class="c-scroll-wrapper-top-bottom">
      <cube-scroll>
        <v-br height="20"></v-br>
        <div style="display:flex;background:#e8e8e8">
          <order-custom :search-to="{name:'OrderSearch',query:{src:'chargeticket'}}" style="flex:1;border-bottom-right-radius: 10px;border-top-right-radius: 10px;overflow:hidden" placeholder="客户" required noHeader></order-custom>
          <div style="width:65px;" class="order-base-info-box" @click="orderBaseInfoVisiable=true">
            <div class="order-base-info-card">
              <v-icon name="icon-dingdanjibenxinxi"></v-icon>
              <div>更多信息</div>
            </div>
          </div>
        </div>
        <v-cell title="客户名" v-model="newCustomName" v-if="newCustomTel" input></v-cell>
        <!-- TIP: 办卡 -->
        <div class="cardActivity">
          <v-br :height="20"></v-br>
          <v-business-card noDataTip="暂无可用卡活动" placeholder="请选择卡活动" :data="disAccountList" @choice="cardTypeVisible=true" @add="addCardType" :name="currentCardType?currentCardType.name:''" :currentCard="currentCardType"></v-business-card>
          <!-- <v-sale-people v-model="currentStaff"></v-sale-people>
          <v-remark v-model="remarks"></v-remark> -->
        </div>
      </cube-scroll>
    </div>
    <!-- TIP: 选卡 -->
    <van-popup v-model="cardTypeVisible" class="cardActivity popup-radius" style="width:100%;height:80%" position="bottom" :lock-scroll="false">
      <v-popup-title title="请选择卡活动" @close="cardTypeVisible = false"></v-popup-title>
      <div class="popup-scroll-wrapper" style="background:#fff;top: 70px; bottom: 50px;">
        <cube-scroll data="disAccountList" ref="scroll">
          <div class="popup-card-wrapper" v-for="item in disAccountList" @click="handleCard(item)" :key="item.id">
            <!-- <div class="popup-card popup-card-new"  :class="{'has-selected':item==currentCardType}">
            <div class="clearfix title-top">
              <div class="popup-card-name">
                <div class="textover1 inner-text">
                  <span v-if="item.discount">[{{item.discount*10}}折]</span> {{item.name}}
                  <v-badge  v-if="item.cardType==2" type="折扣卡" style="background:#fff;color:#e2b55e">折</v-badge>
                <v-badge  v-else type="次卡" style="background:#fff;color:#e2b55e">次</v-badge>
                </div>
              </div>
              <div class="card-scope">
                <span v-if="item.scopeType==2">用卡范围：指定服务/商品</span>
                <span v-if="item.scopeType==1">用卡范围：全场通用</span>
                <span class="fr" style="color:#fff;font-size:20px;">{{item.money|currency('￥')}}</span>
              </div>
            </div>
            <p class="ps textover1">备注：{{item.remarks}}</p>
          </div> -->
            <div style="padding:5px 12px;">
              <v-cb-card :currentCard="item"></v-cb-card>
            </div>
            <div class="popup-card-radio">
              <v-icon :name="currentCardType.id==item.id?'icon-queding1':'icon-yuan'"></v-icon>
            </div>
          </div>
        </cube-scroll>
      </div>
      <div key="新增卡活动" class="addNewcar1" @click="toCard" style="color:#1690ff">
        <v-icon name="icon-add_bg"></v-icon> 新增卡活动</div>
    </van-popup>

    <van-popup v-model="dateShow" position="bottom" style="height:300px;width:100%">
      <van-datetime-picker v-model="currentDate" type="date" :min-date="minDate" @confirm="dateShow=false" @cancel="dateShow=false" />
    </van-popup>
    <v-footer>
      <v-footer-item class="footer-price" v-if="currentCardType">
        <div v-if="formatCardMoney">
          {{currentCardType.money || '0' |currency("￥")}}
        </div>
        <div v-else>{{currentCardType.money || '0' |currency("￥")}}</div>
      </v-footer-item>
      <v-footer-item @click.native="toPayment">去结算</v-footer-item>
    </v-footer>
    <!-- 结算账户 -->
    <account v-model="payPopupVisible" @pay="paySave" :totalPrice="currentCardType?currentCardType.money:0"></account>
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
      dateShow: false,
      cardTypeVisible: false,
      activeTypeVisible: false,
      payPopupVisible: false,
      orderBaseInfoVisiable: false,
      staffVisible: false,
      currentCardType: '',
      disAccountList: [],
      staffList: [],
      remarks: '',
      newCustomName: '',
      currentStaff: '',
      disTotalPage: 0,
      query: {
        pageNo: 1,
        pageSize: 100
      },
      minDate: new Date(),
      currentDate: new Date(),
      id: ''
    }
  },
  watch: {
    id: {
      handler(val) {
        if (this.disAccountList.length > 0) {
          const findIdIndex = element => {
            return element.id === val
          }
          let i = this.disAccountList.findIndex(findIdIndex)
          if (i !== -1) {
            this.currentCardType = this.disAccountList[i]
          } else {
            this.currentCardType = this.disAccountList[0]
          }
        } else {
          this.currentCardType = this.disAccountList[0]
        }
      }
    },
    cardTypeVisible: {
      handler() {
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 500)
      }
    },
    disAccountList: {
      handler(val) {
        if (this.id) {
          const findIdIndex = element => {
            return element.id === this.id
          }
          let i = val.findIndex(findIdIndex)
          if (i !== -1) {
            this.currentCardType = val[i]
          } else {
            this.currentCardType = val[0]
          }
        } else {
          this.currentCardType = val[0]
        }
      }
    }
  },
  computed: {
    formatCardMoney() {
      let money = this.currentCardType ? this.currentCardType.money : ''
      let formatMoney = this.$options.filters['currency'](money)
      if (formatMoney) {
        return `面值:${formatMoney}`
      }
    },
    ...mapState({
      accountDefault: state => state.account.accountDefault,
      orderOfCustom: state => state.order.orderOfCustom,
      orderOfCar: state => state.order.orderOfCar,
      newCustomTel: state => state.order.newCustomTel
    })
  },
  methods: {
    addCardType() {
      this.$router.push('/addnewcard')
    },
    toCard() {
      this.$router.push('/addnewcard')
    },
    async getData() {
      let res = await this.$api.DISACCOUNT_CARD_LIST(this.query)
      if (res.status === 1) {
        if (this.query.pageNo === 1) {
          this.disAccountList = res.page.list || []
          // this.staffList = res.list
        } else {
          this.disAccountList = this.disAccountList.concat(res.page.list || [])
        }
        this.disTotalPage = res.totalPage
      }
    },
    toPayment() {
      if (!this.orderOfCustom && !(this.orderOfCar && this.orderOfCar.member)) {
        this.$toast.fail('请选择客户')
      } else if (!this.currentCardType) {
        this.$toast.fail('请选择您要办理的卡活动')
      } else {
        this.payPopupVisible = true
      }
    },
    paySave() {
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
        'transact.id': this.currentCardType.id || '',
        'sellEmployee.id': this.currentStaff.id || '',
        moneyRecharge: this.totalPrice,
        remarks: this.remarks,
        'financeAccount.id': this.accountDefault.id
      }
      if (!data.memberPhone) {
        this.$toast.fail('请完善必填项')
        return
      } else if (!this.currentCardType) {
        this.$toast('请选择卡')
        return
      }
      let res = await this.$api.DISACCOUNT_CARD_SAVE(data)
      _toast && _toast.clear()
      if (res.status === 1) {
        this.currentCardType = ''
        this.currentStaff = ''
        this.remarks = ''
        this.$toast.success('办理成功')
        this.$store.commit('ORDER_OF_CUSTOM', '')
        this.$store.commit('REFRESH')
        this.$router.replace('/index')
      } else {
        this.$toast.fail('办理失败')
      }
    },
    handleClose() {
      this.cardTypeVisible = false
    },
    handleCard(item) {
      if (item.id === this.currentCardType.id) {
        this.currentCardType = ''
      } else {
        this.currentCardType = item
      }
      this.cardTypeVisible = false
    },
    toSearch() {
      this.$router.push({ name: 'SearchCus' })
    },
    async getEmployee() {
      let res = await this.$api.EMPLOYEE_LIST()
      if (res.status === 1) {
        this.staffList = res.list
      }
    },
    handleLeft() {
      this.currentCardType = ''
      this.currentStaff = ''
      this.remarks = ''
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
    }
    this.getData()
    this.getEmployee()
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
.card-date {
  padding: 4px 8px;
  background: #fff;
  border-radius: 4px;
  display: inline-block;
  margin-left: 15px;
  font-size: 14px;
  border: 1px solid #c7c7c7;
  color: #999;
  .icon {
    font-size: 12px;
  }
}
</style>
