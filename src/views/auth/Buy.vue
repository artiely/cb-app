<template>
  <div class="buy">
    <v-header title="购买" :righttext="haslogin?'注销':''" @right-click="handleRight"></v-header>
    <div class="c-scroll-wrapper-top" style="background:#f8f8f8">
      <cube-scroll :data="data" ref="scroll">
        <div class="buy-title">
          <div>一次购买，终身免费升级</div>
          <div>账号数量不限，电脑、手机可同步登录</div>
        </div>
        <div class="buy-step-tips">
          <div class="buy-step-item">立即购买</div>
          <div class="buy-step-item">支付</div>
          <div class="buy-step-item">立即使用</div>
        </div>
        <p class="buy-steps">
          <span class="buy-step-dot">1</span>
          <span class="buy-step-line"></span>
          <span class="buy-step-dot">2</span>
          <span class="buy-step-line"></span>
          <v-icon name="icon-queding1"></v-icon>
        </p>
        <div class="buy-product" v-for="(item , index) in data" :key="index">
          <div class="product-header">
            <!-- 活动类型（1抢购	2促销		3热卖） -->
            <!-- <img class="badge-img" v-if="item.activityType==1" :src="require('../../assets/img/5379.png')" />
            <img class="badge-img" v-if="item.activityType==3" :src="require('../../assets/img/5380.png')" />
            <img class="badge-img" v-if="item.activityType==2" :src="require('../../assets/img/5381.png')" /> -->
            <div class="product-header-title">
              <!-- {{item.name}} -->
              <!-- <v-badge type="热卖">热卖</v-badge>
              <v-badge type="热卖">今日热卖</v-badge> -->
              <div class="titleTextBox">
                {{item.name}}
                <div class="bqSmText" v-if="item.activityType==1">抢购</div>
                <div class="bqSmText" v-if="item.activityType==2">促销</div>
                <div class="bqSmText" v-if="item.activityType==3">热卖</div>
              </div>
            </div>
            <p class="product-header-subtitle" v-if="item.summary">{{item.summary}}</p>
          </div>
          <div class="product-price">
            <div class="curr-price">{{item.price|currency()}}</div>
            <div class="old-price">{{ item.priceDisplay|currency() }}</div>
          </div>
          <div class="product-desc">
            <span v-html="item.descritpion"></span>
          </div>
          <div class="topay-buttom">
            <button class="primary" @click="toPay(item)">立即购买</button>
          </div>
        </div>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      haslogin: false,
      data: []
    }
  },
  methods: {
    async getData() {
      let res = await this.$api.SYS_PRODUCT()
      this.data = res.list
      setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 300)
    },
    toPay(item) {
      if (this.haslogin) {
        this.$store.commit('SET_PRODUCT', item)
        this.$router.push({
          name: 'ToPay'
        })
      } else {
        this.$store.commit('SET_PRODUCT', item)
        this.$router.push({
          name: 'OneStepSignup'
        })
      }
    },
    handleRight() {
      this.$api.LOGOUT_INDEX()
      window.sessionStorage.removeItem('__user_index__')
      this.haslogin = window.sessionStorage.getItem('__user_index__')
    }
  },
  activated() {
    // 判断是否登陆过了，登陆过的点击直接去支付，否则去登录
    this.haslogin = window.sessionStorage.getItem('__user_index__')
    this.getData()
    setTimeout(() => {
      this.$refs.scroll.refresh()
    }, 300)
  }
}
</script>

<style lang="less">
@import '../../assets/style/var';

.buy-product {
  width: 300px;
  margin: 50px auto;
  padding-bottom: 10px;
  background: #fff6e1;
  // overflow: hidden;
  border-radius: 10px;
  .product-header {
    background: #ffb718;
    // overflow: hidden;
    height: 80px;
    width: 100%;
    border-radius: 10px 10px 0 0;
    .badge-img {
      position: absolute;
      top: 0;
      left: 0;
    }
    .product-header-title {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      font-weight: bold;
      padding-top: 25px;
      text-align: center;
      margin-top: 0;
      color: #fff;
      box-sizing: border-box;
      .titleTextBox {
        position: relative;
        .bqSmText {
          position: absolute;
          right: -65px;
          top: 0px;
          color: #fff;
          height: 23px;
          line-height: 23px;
          font-size: 14px;
          min-width: 50px;
          margin-left: 5px;
          padding: 0 3px;
          border-radius: 3px;
          background: -webkit-linear-gradient(
            left,
            #d40000,
            #ff2300
          ); /* Safari 5.1 - 6.0 */
          background: -o-linear-gradient(
            left,
            #d40000,
            #ff2300
          ); /* Opera 11.1 - 12.0 */
          background: -moz-linear-gradient(
            left,
            #d40000,
            #ff2300
          ); /* Firefox 3.6 - 15 */
          background: linear-gradient(left, #d40000, #ff2300); /* 标准的语法 */
          animation: mymove 0.4s infinite alternate;
        }
        @keyframes mymove {
          0% {
            transform: scale(0.9, 0.9);
          }
          100% {
            transform: scale(1.1, 1.1);
          }
        }
      }
    }
    .product-header-subtitle {
      font-size: 15px;
      color: #fff;
      margin-top: 5px;
    }
  }
  .topay-buttom {
    width: 270px;
    height: 40px;
    line-height: 40px;
    margin: 0 auto;
    > button {
      font-size: 15px;
    }
    .primary {
      height: 36px;
      line-height: 36px;
      font-size: 15px;
      font-weight: 500;
    }
  }

  .product-desc {
    padding: 5px 20px 20px 20px;
    line-height: 35px;
    font-size: 16px;
    height: fit-content;
    text-align: center;
    color: #333;
    margin-top: 4px;
  }
  .product-price {
    font-size: 22px;
    padding-bottom: 5px;
    border-bottom: 2px solid #ffb718;
    color: #d73962;
    font-weight: 600;
    margin: 0 40px;

    .curr-price {
      color: #d73962;
      margin-top: 15px;
      font-size: 28px;
    }
    .old-price {
      text-decoration: line-through;
      text-align: center;
      color: #666;
      font-size: 14px;
      margin-top: 2.5px;
      overflow-x: hidden;
      overflow-y: hidden;
      height: 20px;
    }
  }
}
.buy {
  text-align: center;
}
.buy-title {
  font-size: 20px;
  line-height: 30px;
  text-align: center;
  margin-top: 1.75rem;
  color: #333;
}
.buy-subtitle {
  font-size: 14px;
  padding: 10px;
  color: #999;
}
.buy-step-tips {
  display: flex;
  width: 268px;
  margin: 0 auto;
  padding-bottom: 5px;
  color: #999;
  font-size: 16px;
  margin-top: 1.5rem;
  .buy-step-item {
    flex: 1;
    text-align: center;
  }
}
.buy-steps {
  font-size: 12px;
  color: #999;
  display: flex;
  width: 200px;
  margin: 0 auto;
  line-height: 20px;
  .icon {
    font-size: 20px !important;
    color: #999 !important;
    &.icon-queding1 {
      color: #999 !important;
    }
  }
  .buy-step-dot {
    height: 20px;
    width: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 50%;
    background: #999;
    color: #ffffff;
    display: inline-block;
  }
  .buy-step-line {
    flex: 1;
    height: 2px;
    background: #999;
    margin-top: 8px;
  }
}
.buy {
  background: #ffffff;
}
</style>
