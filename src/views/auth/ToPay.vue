<template>
  <div class="topay login">
    <v-header title="购买" :left-click="handleLeft"></v-header>
    <v-scroll-page style="padding:20px" top="44">
      <div class="topay-box">
        <div class="topay-title">车边店管家 {{item.name}}</div>
        <div class="topay-price">{{proPrice|currency()}}</div>
        <div class="topay-price-src" v-if="couponPrice">{{item.price|currency()}}</div>
        <div style="margin-top:20px">
          <input class="topay-box-input " :class="{'error':error}" v-show="codeshow" placeholder="请输入兑换码" type="tel" maxlength="9" v-model="code" />
        </div>
        <div @click="codeshow=true" v-show="!codeshow" class="duihuan-btn ">兑换码</div>
      </div>
      <p style="padding-bottom:10px;color:#d73962" v-if="couponPrice">已优惠：￥{{couponPrice}}</p>
      <div>
        <button class="primary" @click="toPay">微信支付</button>
      </div>
    </v-scroll-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      code: '',
      couponPrice: '',
      codeshow: false,
      error: false
    }
  },
  computed: {
    item() {
      return this.$store.state.sys.product
    },
    proPrice() {
      return this.$store.state.sys.product.price - Number(this.couponPrice)
    }
  },
  watch: {
    code: {
      async handler(val) {
        if (val.length >= 9) {
          this.error = false
          let res = await this.$api.CHECK_COUPON_SYS({
            productId: this.item.id,
            sysCouponCode: this.code
          })
          if (res.status === 1) {
            this.couponPrice = res.message
          } else {
            this.couponPrice = 0
            this.code = ''
          }
        } else {
          this.couponPrice = 0
        }
      }
    }
  },
  methods: {
    handleLeft() {
      this.$router.replace('/buy')
    },
    async toPay() {
      if (this.code.length >= 1 && this.code.length !== 9) {
        this.$toast.fail('请输入正确的兑换码')
        this.error = true
      } else {
        let pro = await this.$api.INDEX_ORDER({
          productId: this.item.id,
          sysCouponCode: this.code
        })
        if (pro.status === 1) {
          // this.$router.push({
          //   name: 'Paying',
          //   query: {orderNo: pro.data.code, src: 'sys'}
          // })
          this.$api.NATIVE_PAY({
            orderNo: pro.data.code,
            amount: pro.data.money,
            type: '1'
          })
        } else {
          alert('订单生成失败')
        }
      }
    }
  },
  activated() {
    this.code = ''
    this.couponPrice = ''
    // let item = this.$route.query.item
    // try {
    //   this.item = JSON.parse(item)
    // } catch (e) {
    //   console.info('参数出错')
    // }
  }
}
</script>

<style lang="less">
@import '../../assets/style/var';
.topay-box {
  padding: 10px;
  width: 98%;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 10px;
  margin-bottom: 50px;
  position: relative;
  .duihuan-btn {
    position: absolute;
    bottom: -30px;
    left: 0;
    color: #1690ff;
    font-size: 14px;
  }
  .topay-box-input {
    height: 50px;
    width: 95%;
    text-indent: 10px;
    border: 1px solid #c7c7c7;
    border-radius: 8px;
    font-size: 18px;
    &.error {
      border: 1px solid @danger;
      color: @danger;
    }
  }
}
.topay {
  text-align: center;
  .topay-title {
    font-size: 18px;
    color: #333;
    line-height: 1.5;
  }
  .topay-desc {
    font-size: 18px;
    color: #333;
    padding-bottom: 40px;
    padding-top: 8px;
  }
  .topay-price {
    font-size: 24px;
    padding-top: 30px;
  }
  .topay-price-src {
    font-size: 14px;
    color: #999;
    text-decoration: line-through;
  }
}
</style>
