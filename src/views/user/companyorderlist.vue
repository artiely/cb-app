<template>
  <div class="companyorderlistBox">
    <v-header title="企业消费记录"></v-header>
    <v-scroll-page top="64">
      <cube-scroll :data="data">
        <div class="company-order-list" v-for="item in data" @click="toinfo(item)" :key="item.id">
          <div class="time">
            {{item.createDate |timeFormat()}}
            <!-- <span  style="color:#333333;font-weight:500" >支付失败</span> -->
            <!-- <span  style="color:#333333;font-weight:500" >已完成</span> -->
          </div>
          <h1 class="mealName">{{item.salesOrderProduct.title}}
            <span class="fr" style="color:#333333;font-weight:500">{{item.salesOrderProduct.price|currency()}}</span>
          </h1>
          <p style="font-size:16px;color:#666;padding:8px 16px 0;font-weight: 500;">
            <span v-if="item.salesOrderProduct.productType==1">车边店管家系统</span>
            <span v-if="item.salesOrderProduct.productType==2">短信</span>
          </p>
          <!-- <div class="orderStateBox">
            <div class="orderState yzfColor">我已支付</div>
            <div  class="orderState">关闭</div>
          </div> -->
        </div>
      </cube-scroll>
    </v-scroll-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      time: ''
    }
  },
  methods: {
    async getdata() {
      let res = await this.$api.COMPANY_ORDER_LIST()
      if (res.status === 1) {
        this.data = res.page.list
        console.log('data =', this.data)
      }
    },
    toinfo(item) {
      this.$router.push({
        name: 'companyorderinfo',
        query: { id: item.id }
      })
    }
  },
  activated() {
    this.getdata()
  }
}
</script>

<style scoped lang="less">
.companyorderlistBox{
  .company-order-list {
    // width: 100%;
    background: #fff;
    // height: 90px;
    padding-bottom: 12px;
    margin: 0 8px 20px;
    border-radius: 10px;
    box-sizing: border-box;
    h1.mealName {
      font-size: 18px;
      font-weight: 500;
      padding: 0 16px;
      margin-top: 5px;
      color: #333;
    }
    .time{
      width: 100%;
      height: 30px;
      // background-color: #f8f8f8;
      color: #999999;
      font-size: 12px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    // 订单底部的两个按钮的样式
    .orderStateBox{
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: 12px;
      .orderState{
        font-size: 13px;
        border: 1px solid #666;
        color: #333;
        padding: 2px 5px;
        border-radius: 20px;
        margin-left: 12px;
      }
      .yzfColor{
        color: #1690ff;
        border: 1px solid #1690ff;
      }
    }
  }
}

</style>