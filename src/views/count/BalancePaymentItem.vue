<template>
  <div class="c_balance_payment--wrapper" v-if="data" @click="toDetail(data)">
    <div class="c_balance_payment--header clearfix">
      <!-- <div class="c_balance_payment--header--tel" v-if="data.tradePhone">{{data.tradePhone |telFormat()}}</div>
      <div v-else class="c_balance_payment--header--tel">-</div> -->
      <div class="c_balance_payment--header--carid fl textover1" v-if="data.tradeName">{{data.tradeName}}</div>
      <div v-else class="c_balance_payment--header--carid fl">-</div>
      
    </div>
    <div class="c_balance_payment--footer ">
      <span class="fl leftNr"> {{data.createDate|timeFormat()}} · 
        <span v-if="data.subject"> {{data.serviceTypeText}}</span> · {{data.accountName}}
      </span>
      <span class="fr c_balance_payment--money" v-if="data.money&&data.recordType==0" key="收入" style="color:#0dcc6d"> {{data.money|currency('+￥')}}</span>
      <span class="fr c_balance_payment--money" v-if="data.money&&data.recordType==1" key="支出" style="color:#d73962"> {{data.money|currency('-￥')}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    toDetail(data) {
      this.$router.push({
        name: 'BalancePaymentDetail',
        query: { id: data.id }
      })
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';
.c_balance_payment {
  &--wrapper {
    padding: 0 15px;
    width: 100%;
    background: #ffffff;
  }
  &--header {
    padding-top: 10px;
    height: 40px;
    line-height: 50px;
    overflow: hidden;
    font-size: 14px;
    &--carid {
      width: 100%;
      height: 100%;
      margin-right: -120px;
      padding-right: 120px;
      font-size: 16px;
      font-weight: 500;
    }
    &--tel {
      font-size: 16px;
      font-weight: 500;
      width: 120px;
      height: 100%;
      text-align: right;
    }
  }
  &--footer {
    font-size: 12px;
    padding: 6px 0 12px 0;
    .borderB(@dividers);
    .leftNr{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
      margin-right: 10px;
    }
  }
  &--money {
    font-size: 14px;
  }
}
</style>
