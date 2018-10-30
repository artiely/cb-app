<template>
  <div>
    <v-header title="短信充值"></v-header>
    <div class="c-scroll-wrapper-top">
      <cube-scroll>
        <v-br height="20"></v-br>
        <v-cell-group>
          <v-cell title="当前短信余量" :text="smsNum+' 条'" :options="{textStyle:'font-size:20px;font-weight:500'}"></v-cell>
        </v-cell-group>
        <div class="c-card-sms--wrapper" v-for="item in data" @click="toPaySms(item)" :key="item.id">
          <div class="c-card-sms--title clearfix">
            <span class="fl">{{item.title}}</span>
            <span class="fr">{{item.priceDisplay|currency()}}</span>
          </div>
          <div class="c-card-sms--desc clearfix">
            <span class="fr">{{item.price|currency()}}</span>
          </div>
          <div class="clearfix">
            <div class="c-card-sms--btn fr">充值</div>
          </div>
        </div>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
// 123
export default {
  name: 'bug-sms',
  data() {
    return {
      data: [],
      smsNum: 0
    }
  },
  methods: {
    async getData() {
      let res = await this.$api.SMS_LIST()
      if (res.status === 1) {
        this.data = res.list
      }
    },
    async toPaySms(item) {
      let res = await this.$api.SYS_ORDER_SMS({ productId: item.id })
      if (res.status === 1) {
        console.log('点击了列表')
        // ..
        // this.$router.push({name: 'Paying', query: {orderNo: res.data.code, src: 'sms'}})
        this.$api.NATIVE_PAY({
          orderNo: res.data.code,
          amount: item.price,
          type: '2'
        })
      }
    },
    async getSmsNum() {
      let res = await this.$api.SMS_USABLE_NUM()
      if (res.status === 1) {
        this.smsNum = res.data
      }
    }
  },
  activated() {
    this.getData()
    this.getSmsNum()
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
.c-card-sms {
  &--wrapper {
    width: 95%;
    margin: 5px auto;
    position: relative;
    background: #1690ff;
    padding: 16px;
    border-radius: 4px;
    overflow: hidden;
  }
  &--title {
    font-size: 20px;
    color: #fff;
    overflow: hidden;
    .fl {
      font-weight: 500;
    }
    .fr {
      font-size: 16px;
      text-decoration: line-through;
    }
  }
  &--desc {
    color: @secondary-text;
    font-size: 14px;
    .fr {
      color: #fff;
      font-weight: 500;
      font-size: 26px;
    }
  }
  &--btn {
    text-align: center;
    background: @danger;
    border-radius: 20px;
    color: #ffffff;
    font-size: 16px;
    padding: 4px 14px;
    margin-top: 10px;
  }
}
</style>
