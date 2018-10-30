<template>
  <div class="handoverBox">
    <v-header title="交班" @right-click="handleList" righttext="交班记录"></v-header>
    <div class="c-scroll-wrapper-top">
      <cube-scroll>
        <!-- <v-br :height="20"></v-br> -->
        <!-- <v-cell-group>
          <v-cell title="交班时间" :text="data.dutyTime" v-if="data.dutyTime"></v-cell>
          <v-cell title="本人收银" :text="data.moneyTotal |currency()" :options="{textStyle:'color:#333;font-size:24px'}"></v-cell>
        </v-cell-group> -->
        <v-handovertop :jbmoney="data.moneyTotal |currency()" jbpeo="本人收银" :jbtime="data.dutyTime"></v-handovertop>
        <div v-if="data.items">
          <div class="balance-detail--title">收银明细及方式</div>
          <v-cell-group class="groupBox">
            <v-cell v-for="item in data.items" :key="item.id" :text="item.money |currency()" :descText="item.accountName" :options="{iconStyle:'font-size:22px'}">
              <div slot="title">
                <div v-if="item.accountType==0">
                  <v-icon class="handover--icon" name="icon-xianjinzhifu" key="cash" color="#1690ff"></v-icon>现金账户
                </div>
                <div v-if="item.accountType==1">
                  <v-icon class="handover--icon" symbol name="icon-zu" key="bank" color="#1690ff"></v-icon>银行/卡({{item.accountName}})
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
        <!-- <v-cell-group style="margin-bottom:5px">
          <v-cell title="交班人" v-if="data.dutyEmployee" :text="data.dutyEmployee.name"></v-cell>
        </v-cell-group> -->
        <v-remark v-model="remarks"></v-remark>
        <v-button type="primary-solid"  size="large" style="width: 270px;margin: 40px auto;display: block;height: 40px;line-height: 40px;font-size: 18px;" @click.native="save">交班</v-button>
        <v-br :height="100"></v-br>
      </cube-scroll>
    </div>
    <van-dialog v-model="dialogShow"  show-cancel-button  confirm-button-text="确定交班" cancel-button-text="暂不交班"  :before-close="beforeClose" @confirm="post"   style="left:50%;transform: translate3d(-50%,-50%,0);width: 280px;border-radius: 12px;">
      <div class="handTanBox">
        <div class="handNrBox">
          <div><span class="spanLabel">本人收银：</span><span class="spanNr1">{{ this.data.moneyTotal| currency() }}</span></div>
          <div class="handList"><span class="spanLabel">交班时间：</span><span class="spanNr">{{ this.data.dutyTime }}</span></div>
          <div class="handList"><span class="spanLabel">交 班 人：</span><span class="spanNr">{{ this.data.dutyEmployee?this.data.dutyEmployee.name:'' }}</span></div>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: '',
      remarks: '',
      dialogShow: false
    }
  },
  methods: {
    handleList() {
      this.$router.push('/handoverhistory')
    },
    async getData() {
      let res = await this.$api.EXCHANGE_FORM()
      if (res.status === 1) {
        this.data = res.data
      } else {
        console.error(res.status + '获取交班表单失败')
      }
    },
    async save() {
      this.dialogShow = true
    },
    async post() {
      let res = await this.$api.EXCHANGE_SAVE({ remarks: this.remarks })
      if (res.status === 1) {
        this.data = res.data
        this.$toast.success('交班成功')
        this.$router.replace({ name: 'HandoverHistory' })
        this.dialogShow = false
      } else {
        console.error(res.status + '提交交班表单失败')
      }
    }
  },
  activated() {
    this.getData()
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
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
  // color: @secondary-text;
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
  .c_cell_wrapper:last-child {
    margin-bottom: -2px;
  }
}
.groupBox.cb-cell-group-border:after {
  background-image: none;
}
.handTanBox{
  padding: 24px 20px 35px;
  color: #666666;
  font-size: 16px;
  .spanNr1{
    font-size: 20px;
    color: #333333;
    font-weight: 500;
  }
  .handList{
    margin-top: 16px;
  }
}
.van-dialog .van-dialog__footer.van-dialog__footer--buttons{
  color: #999999;
  font-size: 16px;
}
.van-button--large {
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: #999999;
}
.van-dialog .van-button__text {
    font-size: 16px;
}
.van-dialog__confirm .van-button__text {
    color: #1690ff;
}
</style>
