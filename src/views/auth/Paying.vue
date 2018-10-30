<template>
  <div class="payok">
    <v-header title="支付"></v-header>
    <v-scroll-page top="44">
      <div style="padding:20px 30px">
        <div class="time">
          {{time|timeFormat('mm:ss')}}
        </div>
        <div class="paying-top">
          支付中...
        </div>
        <div style="padding-top:50px">
          <img :src="qrcode" alt="车边妹微信" style="display:block;margin:0 auto">
        </div>
        <div style="font-size:13px;color:#333;text-align:center;padding:10px 0 40px 0;line-height:1.5" v-html="message">
          <!-- <p >扫一扫,骚扰客服妹子!</p>
        <p >微信号：chebianmei (车边妹)</p> -->
        </div>

        <div class="paying-btn-group">
          <div class="paying-btn">
            <button class="primary" @click="payok">确定已支付</button>
          </div>
          <div class="paying-btn">
            <button class="outline" style="margin:0" @click="repay">重新购买</button>
          </div>
        </div>
      </div>
    </v-scroll-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {},
      qrcode: '',
      message: '',
      time: 300000,
      timer: null,
      // timer2: null,
      orderNo: '',
      params: ''
    }
  },
  methods: {
    async payok() {
      let res = await this.$api.COMPANY_ORDER_CHECK({
        code: this.orderNo
      })
      console.log('res-p', res)
      if (res.status === 1) {
        console.log('支付成功1')
        if (res.data === 30904) {
          clearInterval(this.timer)
          console.log('支付成功30904')
          // 30904 /30905
          if (this.params.type === '2') {
            this.$router.replace({
              name: 'SmsPayok',
              params: {
                orderNo: this.orderNo
              }
            })
          } else {
            this.$router.replace({
              name: 'Payok',
              params: {
                orderNo: this.orderNo
              }
            })
          }
        } else if (res.data === 30905) {
          if (this.params.type === '2') {
            this.$router.replace({
              name: 'SmsPayerror',
              params: {
                orderNo: this.orderNo
              }
            })
          } else {
            this.$router.replace({
              name: 'Payerror',
              params: {
                orderNo: this.orderNo
              }
            })
          }
        }
      }
    },
    repay() {
      if (this.params.type === '2') {
        this.$router.replace('/buysms')
      } else {
        this.$router.replace('/buy')
      }
    },
    async getCode() {
      let res = await this.$api.QRCODE_SERVICE()
      if (res.status === 1) {
        this.qrcode = res.data
        this.message = res.message
      }
    },
    async check() {
      console.log('orderNo', this.orderNo)
      let res = await this.$api.COMPANY_ORDER_CHECK({
        code: this.orderNo
      })
      console.log('res-p', res)
      if (res.status === 1) {
        console.log('支付成功11')
        if (res.data === 30904) {
          console.log('支付成功1130904')
          // 30904 /30905
          clearInterval(this.timer)
          if (this.params.type === '2') {
            this.$router.replace({
              name: 'SmsPayok',
              params: {
                orderNo: this.orderNo
              }
            })
          } else {
            this.$router.replace({
              name: 'Payok',
              params: {
                orderNo: this.orderNo
              }
            })
          }
        }
      }
    },
    eq() {
      this.timer = setInterval(() => {
        this.time -= 1000
        this.check()
        if (this.time === 0) {
          this.payok()
          clearInterval(this.timer)
        }
      }, 1000)

      // this.timer2 = setInterval(() => {
      //   this.check()
      //   if (this.time === 2000) {
      //     clearInterval(this.timer2)
      //   }
      // }, 2000)
    }
  },
  activated() {
    this.getCode()
    this.eq()
    // this.orderNo = this.$route.query.orderNo
    if (this.$route.params.params) {
      this.params = this.$route.params.params
      this.orderNo = this.$route.params.params.orderNo
    }
  },
  deactivated() {
    clearInterval(this.timer)
    // clearInterval(this.timer2)
  }
}
</script>

<style lang="less">
@import '../../assets/style/var';
.time {
  text-align: center;
  font-size: 50px;
  font-weight: 500;
  color: @danger;
}
.paying-btn-group {
  display: flex;
  .paying-btn {
    padding: 10px;
    flex: 1;
  }
}
.paying-top {
  text-align: center;
  font-size: 16px;
  color: #333;
}
</style>
