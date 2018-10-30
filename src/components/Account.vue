<template>
  <div>
    <van-popup v-model="value" position="bottom" style="width:100%;height:80%" class="popup-radius" :close-on-click-overlay="false">
      <div>
        <div v-show="defaultShow" class="slide-inner-popup slide-inner-absolute">
          <v-popup-title :title="placeholder" @close="close"></v-popup-title>
          <v-br :height="20"></v-br>
          <div class="c-pay--cusinfo clearfix">
            <!-- 车的情况 -->
            <div v-if="order.orderOfCar" class="textover1">
              {{order.orderOfCar.licence| carIdFormat()}} &nbsp;&nbsp;
              <span v-if="order.orderOfCar.member">
                <span v-if="order.orderOfCar.member.username">{{order.orderOfCar.member.username |telFormat()}}</span>&nbsp;&nbsp;
                <span v-if="order.orderOfCar.member.name">{{order.orderOfCar.member.name}}</span>
              </span>
            </div>
            <!-- 人的情况 -->
            <div v-if="order.orderOfCustom" class="textover1">
              <span v-if="order.orderOfCustom.motor">{{order.orderOfCustom.motor.licence| carIdFormat()}}</span>&nbsp;&nbsp;
              <span>
                <span v-if="order.orderOfCustom.username">{{order.orderOfCustom.username |telFormat()}}</span>&nbsp;&nbsp;
                <span v-if="order.orderOfCustom.name">{{order.orderOfCustom.name}} </span>
              </span>
            </div>
          </div>
          <div class="c-pay--money" :class="{'expend': expend}">{{totalPrice|currency('￥')}}</div>
          <v-br height="20"></v-br>
          <v-cell :title="acountPlaceholder" link @click.native="moreType=true" :text="accountDefault?accountDefault.accountName:'客户储值账户'" :options="{textStyle:'font-weight:500'}"></v-cell>
          <v-footer style="position:absolute">
            <v-footer-item @click.native="chargeSave">确定结算</v-footer-item>
          </v-footer>
        </div>
        <div class="c-pay--type slide-inner-popup" v-show="moreType">
          <v-popup-title back title="请选择账户" @click.native="moreType=false"></v-popup-title>
          <div style=";overflow-y:scroll">
            <van-radio-group v-model="defaultAccount" v-if="account.accountList">
              <v-cell-group class="account-list--style">
                <v-cell v-if="accountCus&&memberId" class="account-cell" clickable @click.native="handleAccount_cus(accountCus)">
                  <div slot="text" class="account-item" style="width:100%;font-weight:500">
                    <div class="textover1">
                      <div style="display:flex">
                        <v-icon name="icon-chuzhiqia-" class="account-left--icon" color="#0DCC6D"> </v-icon>
                        <div style="flex:1">
                          <div style="line-height:1.2;padding-top:10px;font-weight:500"> 客户储值账户
                            <v-badge type="优先">优先</v-badge>
                            <span class="danger" v-if="limitOver" style="position:absolute;top:16px;right:40px;font-size:14px;color:#d73962">余额不足</span>
                          </div>
                          <div style="font-size:10px;line-height:1;color:#666"> (当前余额：{{accountCus.moneyUsable|currency()}})</div>
                        </div>
                      </div>
                    </div>
                    <van-radio :name="accountCus.id" :disabled="limitOver" class="account-item-radio" />
                  </div>
                </v-cell>
                <v-cell clickable class="account-cell" @click.native="handleAccount(item)" v-for="item in account.accountList" :key="item.id">
                  <div slot="text" class="account-item">
                    <div v-if="item.accountType==0" class="textover1">
                      <v-icon name="icon-xianjinzhifu" class="account-left--icon" color="#1690ff"> </v-icon>现金账户
                    </div>
                    <div v-if="item.accountType==1" class="textover1">
                      <v-icon name="icon-zu" symbol class="account-left--icon" color="#1690ff"> </v-icon>银行/卡（{{item.accountName}}）
                    </div>
                    <div v-if="item.accountType==3" class="textover1">
                      <v-icon name="icon-xiaotubiao-25" class="account-left--icon" color="#20b004"> </v-icon>微信支付（{{item.accountName}}）
                    </div>
                    <div v-if="item.accountType==2" class="textover1">
                      <v-icon name="icon-zhifubao" class="account-left--icon" color="#1194e3"> </v-icon>支付宝（{{item.accountName}}）
                    </div>
                    <!-- {{item.accountName}} -->
                    <van-radio :name="item.id" class="account-item-radio" />
                  </div>
                </v-cell>
              </v-cell-group>
            </van-radio-group>
          </div>
        </div>
        <div v-show="passwordShow">
          <v-popup-title back title="请输入密码" @click.native="passwordShow=false"></v-popup-title>
          <van-password-input v-model="passwordValue" @focus="showKeyboard = true" />
          <p class="cash-table-password-tip">
            <span class="fl">初始密码为111111</span>
            <span class="fr" @click="toNewPayPassword" style="color:#1690ff">修改/忘记密码</span>
          </p>
          <van-number-keyboard :show="showKeyboard" @input="onInput" @delete="onDelete" @blur="showKeyboard = true" />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      moreType: false,
      defaultAccount: {},
      limitOver: false,
      passwordShow: false,
      showKeyboard: true,
      passwordValue: []
    }
  },
  props: {
    acountPlaceholder: {
      type: String,
      default: '收款账户'
    },
    expend: {
      type: Boolean,
      default: false // 支出 金额红色
    },
    placeholder: {
      type: String,
      default: '请确定结算'
    },
    value: {
      type: Boolean,
      default: false
    },
    password: String,
    totalPrice: {
      type: Number,
      default: 0
    },
    memberId: {
      type: String
    }
  },
  watch: {
    accountCus: {
      handler(val) {
        if (val) {
          if (val.moneyUsable >= this.totalPrice) {
            this.limitOver = false
            let def = val
            def.accountName = '客户储值账户'
            this.$store.commit('SET_ACCOUNT_DEFAULT', def)
          } else {
            this.limitOver = true
            this.$store.commit('SET_ACCOUNT_DEFAULT', this.accountList[0])
          }
        } else {
          this.$store.commit('SET_ACCOUNT_DEFAULT', this.accountList[0])
        }
      },
      deep: true,
      immediate: true
    },
    totalPrice: {
      handler(val) {
        if (this.accountCus && this.accountCus.moneyUsable >= val) {
          this.limitOver = false
          let def = this.accountCus
          if (!def.accountName) {
            def.accountName = '客户储值账户'
          }
          this.$store.commit('SET_ACCOUNT_DEFAULT', def)
        } else {
          this.limitOver = true
          this.$store.commit('SET_ACCOUNT_DEFAULT', this.accountList[0])
        }
      },
      immediate: true
    },
    accountDefault: {
      handler(val) {
        if (val) {
          this.defaultAccount = val.id ? val.id : ''
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapState({
      account: state => state.account,
      order: state => state.order,
      accountDefault: state => state.account.accountDefault,
      accountCus: state => state.account.accountCus,
      accountList: state => state.account.accountList
    }),
    defaultShow() {
      if (this.moreType || this.passwordShow) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    handleAccount(item) {
      this.$store.commit('SET_ACCOUNT_DEFAULT', item)
      this.moreType = false
    },
    handleAccount_cus(item) {
      if (this.limitOver) return
      item.accountName = '客户储值账户'
      this.$store.commit('SET_ACCOUNT_DEFAULT', item)
      this.moreType = false
    },
    close() {
      this.value = false
      this.$emit('input', false)
    },
    chargeSave($event) {
      if (this.account.accountType === '2') {
        this.moreType = false
        this.passwordShow = true
        this.passwordValue = ''
        this.$emit('update:password', this.passwordValue)
      } else {
        this.$emit('pay', $event)
      }
    },
    onInput(key, $event) {
      this.passwordValue = (this.passwordValue + key).slice(0, 6)
      this.$emit('update:password', this.passwordValue)
      if (this.passwordValue.length === 6) {
        this.passwordShow = false
        this.$emit('pay', $event)
      }
    },
    onDelete() {
      this.passwordValue = this.passwordValue.slice(
        0,
        this.passwordValue.length - 1
      )
      this.$emit('update:password', this.passwordValue)
    },
    toNewPayPassword() {
      let id = this.$store.state.order.orderOfCustom
        ? this.$store.state.order.orderOfCustom.id
        : this.$store.state.order.orderOfCar.member.id
      this.$router.push({ name: 'CusNewPassword', query: { id: id } })
    }
  },
  activated() {
    // 每次进来都请求账户列表
    this.$store.dispatch('accountCusAndStore', this.memberId)
    console.log('时间：', new Date())
  }
}
</script>

<style lang="less">
.c-pay--money {
  &.expend {
    color: #d73962;
  }
}
.account-cell {
  // .van-cell__value {
  //   width: 40px !important;
  //   flex: none !important;
  // }
  text-align: left;
  .account-item {
    text-align: left;
    display: flex;
    .textover1 {
      flex: 1;
      font-weight: 500;
    }
    .account-item-radio {
      width: 24px;
      float: right;
      line-height: 45px;
    }
  }
}
.account-list--style {
  .van-cell__title {
    font-size: 16px;
    color: #333;
    width: 200px;
  }
  .account-left--icon {
    padding-right: 4px;
    .icon {
      font-size: 30px;
    }
  }
}
</style>
