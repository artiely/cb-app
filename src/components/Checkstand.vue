<template>
  <div>
    <van-popup v-model="data.show" style="width:100%;height:450px" position="bottom" class="popup-radius">
      <v-popup-title :title="title" @close="data.show = false"></v-popup-title>
      <div class="cash-table-cus" v-if="data.userinfo">
        <span v-if="data.userinfo.motor">{{data.userinfo.motor.licence |carIdFormat()}}</span>
        <span v-if="data.userinfo.member">
          <span v-if="data.userinfo.member.username">{{data.userinfo.member.username|telFormat()}}</span>
          <span v-if="data.userinfo.member.name">{{data.userinfo.member.name}}</span>
        </span>
      </div>
      <div class="cash-table-money">
        <div v-if="data.type==1">
          <span key="折扣卡" v-if="currentCard&&currentCard.cardType==='2'">划卡数额：{{data.money|currency('￥')}}</span>
          <span key="次卡" v-else>划卡数额：{{data.money}}次</span>
          <div style="font-size:12px;color:#666;padding:8px 0">
            <span v-if="currentCard&&currentCard.cardType==2"><v-badge size="small"   type="折扣卡">折扣卡 </v-badge> [{{currentCard.discount*10}}折] </span>
            <v-badge size="small" v-else  type="次卡">次卡</v-badge> {{currentCard.name}}
          </div>
        </div>
        <div v-else>
          <span>本次结算金额：{{data.money}}</span>
        </div>
      </div>
      <!-- 划卡开单 输入密码 -->
      <van-password-input v-model="password" @focus="showKeyboard = true" />
      <p class="cash-table-password-tip">
        <span class="fl">初始密码为111111</span>
        <span class="fr" @click="toNewPayPassword" style="color:#1690ff">修改/忘记密码</span>
      </p>
      <van-number-keyboard :show="showKeyboard" @input="onInput" @delete="onDelete" @blur="showKeyboard = true" />
      <!-- 直接开单 选账号 -->
    </van-popup>
  </div>
</template>

<script>
/* 这是收银台组件 */
export default {
  props: {
    title: {
      type: String,
      default: '请确定划卡数额'
    },
    options: {
      type: Object,
      default: function() {
        return {
          show: false, // 是否展示收银台
          userinfo: '', // 结算对象的信息
          money: '', // 结算的金额
          type: 0 // 0直接开单，1卡开单
        }
      }
    }
  },
  data() {
    return {
      data: {},
      showKeyboard: true, // 键盘是否展示
      password: '' // 输入的密码
    }
  },
  computed: {
    currentCard() {
      return this.$store.state.order.currentCard
    }
  },
  watch: {
    options: {
      handler(val) {
        this.data = val
      },
      deep: true,
      immediate: true
    },
    'data.show': {
      handler() {
        this.password = ''
      }
    }
  },
  methods: {
    onInput(key) {
      this.password = (this.password + key).slice(0, 6)
      this.$emit('input', this.password)
    },
    onDelete() {
      this.password = this.password.slice(0, this.password.length - 1)
      this.$emit('input', this.password)
    },
    toNewPayPassword() {
      let id = this.$store.state.order.orderOfCustom
        ? this.$store.state.order.orderOfCustom.id
        : this.$store.state.order.orderOfCar.member.id
      this.$router.push({ name: 'CusNewPassword', query: { id: id } })
    }
  }
}
</script>

<style>
</style>
