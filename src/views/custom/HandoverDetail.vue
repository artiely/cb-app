<template>
  <div class="HandoverDetailBox">
    <v-header title="交班明细"></v-header>
    <div class="c-scroll-wrapper-top">
      <cube-scroll>
        <!-- <v-br :height="20"></v-br> -->
        <!-- <v-cell-group>
        <v-cell title="交班时间" :text="data.dutyTime" v-if="data.dutyTime"></v-cell>
        <v-cell title="本人收银" :text="data.moneyTotal |currency()" :options="{textStyle:'color:#333;font-size:24px'}"></v-cell>
        <v-cell title="交班人" v-if="data.dutyEmployee" :text="data.dutyEmployee.name"></v-cell>
        </v-cell-group> -->
        <v-handovertop :jbmoney="data.moneyTotal |currency()" :jbpeo="data.dutyEmployee?data.dutyEmployee.name:''" :jbtime="data.dutyTime"></v-handovertop>
        <div v-if="data.items">
          <div class="balance-detail--title">收银方式及明细</div>
          <v-cell-group class="groupBox">
            <v-cell :text="item.money |currency()" :descText="item.accountName" v-for="item in data.items" :key="item.id">
              <div slot="title">
                <div v-if="item.accountType==0">
                  <v-icon class="handover--icon" name="icon-xianjinzhifu" key="cash" color="#1690ff"></v-icon>现金账户
                </div>
                <div v-if="item.accountType==1">
                  <v-icon symbol class="handover--icon" name="icon-zu"  key="bank" color="#1690ff"></v-icon>银行/卡({{item.accountName}})
                </div>
                <div v-if="item.accountType==2">
                  <v-icon class="handover--icon" name="icon-zhifubao" key="ali" color="#1194e3"></v-icon>支付宝({{item.accountName}})
                </div>
                <div v-if="item.accountType==3">
                  <v-icon class="handover--icon" name="icon-weixinzhifu" key="wx" color="#20b004"></v-icon>微信支付({{item.accountName}})
                </div>
              </div>
            </v-cell>
          </v-cell-group>
        </div>
        <v-br></v-br>
        <span v-if="data.remarks">
          <v-remark v-model="data.remarks" disabled></v-remark>
        </span>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: '',
      id: ''
    }
  },
  methods: {
    handleList() {
      this.$router.push('/handoverhistory')
    },
    async getData() {
      let res = await this.$api.EXCHANGE_DETAIL({ id: this.id })
      if (res.status === 1) {
        this.data = res.data
      } else {
        console.error(res.status + '获取交班详情出错')
      }
    }
  },
  activated() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getData()
    }
  }
}
</script>
<style lang="less">
@import '../../assets/style/var.less';
.HandoverDetailBox {
  .handover--icon {
    padding-right: 4px;
    .icon {
      position: relative;
      margin-top: -3px;
      font-size: 28px;
    }
  }
  .handover-tip {
    font-size: 16px;
    font-weight: 600;
    color: @primary-text;
    height: 30px;
    vertical-align: top;
    .handover-tip-label {
      float: left;
      color: @primary-text;
      width: 80px;
      height: 30px;
      text-align: justify;
      text-align-last: justify;
      font-weight: 600;
      &::after {
        display: inline-block;
        overflow: hidden;
        width: 100%;
        height: 0;
        content: '';
        vertical-align: top;
      }
    }
    .handover-tip-value {
      float: left;
      font-weight: 600;
    }
  }
  .balance-detail--title {
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    font-size: 14px;
    color: #999999;
  }
  .groupBox {
    margin: 0 8px;
    border-radius: 12px;
    .c_cell_wrapper {
      height: 42px;
      line-height: 42px;
      padding: 0 0 0 12px;
      min-height: 40px;
      .c_cell {
        height: 40px;
        line-height: 42px;
        padding-right: 12px;
        .title {
          font-size: 16px;
        }
        .text span {
          color: #333333;
          font-size: 18px;
          font-weight: 500;
        }
      }
      .c_cell:last-child:after {
        background-image: none;
      }
    }
    .c_cell_wrapper:last-child{
      margin-bottom: -2px;
    }
  }
  .groupBox.cb-cell-group-border:after {
    background-image: none;
  }
}
</style>

