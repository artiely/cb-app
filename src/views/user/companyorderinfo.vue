<template>
  <div class="companyorderinfoBox">
    <v-header title="详情"></v-header>
    <v-scroll-page top="44">
      <v-br height="20"></v-br>
      <div class="box">
        <div class="company-order-info" v-if="data.salesOrderProduct">
          <h1 class="order-production-name" >{{data.salesOrderProduct.title}}
            <v-badge class="danger" v-if="data.status=='1'||data.status=='2'">待支付</v-badge>
            <v-badge class="success" v-if="data.status=='3'">已支付</v-badge>
            <v-badge class="success" v-if="data.status=='98'">已完成</v-badge>
            <v-badge class="success" v-if="data.status=='99'">已关闭</v-badge>
          </h1>
          <p style="padding-top:8px;color:#666666;font-size:14px;">
            <span v-if="data.salesOrderProduct.productType==1">车边店管家系统</span>
            <span v-if="data.salesOrderProduct.productType==2">短信</span>
          </p>
        </div>
      </div>
      <v-br height="1"></v-br>
      <div  class="box1">
        <div class="company-order-info" v-if="data.salesOrderProduct">
          <p class="clearfix order-production-item"> 订单号
            <span class="fr">{{data.code}}</span>
          </p>
          <p class="clearfix order-production-item"> 创建时间
            <span class="fr">{{data.createDate|timeFormat()}}</span>
          </p>
        </div>
      </div>

      <v-br height="20"></v-br>
      <div class="box"> 
        <div class="company-order-info">
          <p class="clearfix order-production-item"> 产品金额
            <span class="fr">{{data.moneyTotal|currency()}}</span>
          </p>
          <p class="clearfix order-production-item"> 优惠金额
            <span class="fr">{{data.moneyCoupon|currency('-￥')}}</span>
          </p>
          <p class="clearfix order-production-item"> 优惠方式
            <span class="fr" v-if="data.sysCoupon">优惠券</span>
            <span class="fr" v-else>-</span>
          </p>
          <p class="clearfix order-production-item order-production-item-qipa"> 应付金额
            <span class="fr">{{data.money|currency()}}</span>
          </p>
          <p class="clearfix order-production-item"> 购买账号
            <span class="fr" v-if="data.employee">{{data.employee.username|telFormat()}}</span>
          </p>
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
      id: ''
    }
  },
  methods: {
    async getdata() {
      let res = await this.$api.COMPANY_ORDER_INFO({ id: this.id })
      if (res.status === 1) {
        this.data = res.data
      }
    }
  },
  activated() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getdata()
    }
  }
}
</script>

<style scoped lang="less">
.companyorderinfoBox{
  
  .company-order-info {
    width: 100%;
    padding: 10px  0 10px 16px;
    background: #fff;
    .order-production-name {
      font-size: 18px;
      color: #333;
      font-weight: 500;
      .danger{
        border-radius: 3px;

      }
    }
    .order-production-item {
      font-size: 14px;
      color: #333;
      height: 25px;
      line-height: 25px;
      padding-right: 16px;
      &.order-production-item-qipa {
        color: #333;
        font-size: 16px;
        font-weight: 500;
      }
    }
  }
  .c_badge--wrapper{
    padding: 1px 6px;
    border-radius: 10px;
    height: auto;
    margin-left: 5px;
  }
  .box{
    margin: 0 8px;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;  
  }
  .box1{
    margin: 0 8px;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;  
    padding:  0;
    .company-order-info{
      padding: 5px 0 5px 16px;
      .order-production-item {
        height: 25px;
        line-height: 25px;
      }
    }
  }
}

</style>