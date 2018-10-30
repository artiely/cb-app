<template>
  <div class="handovertopBox" >
    <div class="jb_money">{{jbmoney}}</div>
    <div class="jb_peo">{{jbpeo}}</div>
    <div class="jb_time">{{jbtime}}</div>
  </div>
</template>
<script>
export default {
  name: 'v-handovertop',
  props: {
    jbmoney: {
      type: String,
      default: 0.00
    },
    jbpeo: {
      type: String,
      default: '本人收银'
    },
    jbtime: {
      type: String

    }
  }
}
</script>
<style lang="less"> 
.handovertopBox {
    width: 100%;
    padding: 40px 0 35px 0;
    text-align: center;
    .jb_money{
      font-size: 32px;
      font-weight: 500;
      color: #333333;
    }
    .jb_peo{
      margin-top: 10px;
      font-size: 16px;
      color: #666666;
    }
    .jb_time{
      margin-top: 30px;
      font-size: 14px;
      color: #333333;
      
    }
}
</style>
