<template>
  <!-- 账户详情 -->
  <div class="active-info">
    <v-header title="记账账户详情" :border="true" :left-click="toBack">
      <div slot="righttext" @click="editAccountDetails(data)" v-if="data.accountType!=0">编辑</div>
    </v-header>
    <div class="c-scroll-wrapper-top">
      <cube-scroll :data="data">
        <div v-if="data">
          <v-br :height="20"></v-br>
          <v-cell-group class="topList">
            <v-cell wrap>
              <div slot="title">
                <div class="cb_store-box">
                  <div class="cb_store-icon-box">
                    <div class="cb_store-icon">
                      <v-icon name="icon-xiaotubiao-9" class="xianjingfu2" v-if="data.accountType==0"></v-icon>
                      <v-icon name="icon-zu" class="yinghangka" symbol v-if="data.accountType==1"></v-icon>
                      <v-icon name="icon-xiaotubiao-27" class="zhifubao" v-if="data.accountType==2"></v-icon>
                      <v-icon name="icon-weixinzhifu" class="payIcon weixin" v-if="data.accountType==3"></v-icon>
                    </div>
                  </div>
                  <div class="cb_store-info">
                    <h1 style="font-size:18px;color:#333;font-weight:600">{{data.accountName}}</h1>
                    <p style="font-size:14px;color:#999;padding-top:5px;" v-if="data.accountType==1">银行/卡</p>
                    <p style="font-size:14px;color:#999;padding-top:5px;" v-if="data.accountType==2">支付宝</p>
                    <p style="font-size:14px;color:#999;padding-top:5px;" v-if="data.accountType==3">微信</p>
                  </div>
                </div>
              </div>
            </v-cell>
          </v-cell-group>
          <div class="towList">
            <v-cell-group class="active-info">
              <!-- 现金没有启用状态 -->
              <v-cell title="启用状态" :class="{'hidden':data.accountType==='0'}">
                <div slot="right" class="right-slot">
                  <van-switch v-model="checked" @input="upDown" />
                </div>
              </v-cell>
              <v-cell title="当前余额">
                <div slot="right">
                  {{data.accountBalance+data.recordBalance|currency('￥')}}
                </div>
              </v-cell>
              <v-cell title="明细">
                <div slot="right" class="right-slot" @click="toBalancePaymentHistory(data)">
                  <span class="see">查看</span>
                  <i class="icon iconfont icon-youjiantou1"></i>
                </div>
              </v-cell>
            </v-cell-group>
          </div>
          <!-- 微信有备注 -->
          <v-remark v-model="remarks" disabled style="font-size:12px;color:#666;" :class="{'hidden':data.accountType==='0'}"></v-remark>
          <v-br height="5"></v-br>
        </div>
        <!-- 暂无数据 -->
        <div v-else>
          <v-nodata></v-nodata>
        </div>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      remarks: '', // 备注
      checked: true,
      data: {},
      id: ''
    }
  },
  watch: {
    query: {
      handler() {
        this.noData = false
        this.getData()
      },
      deep: true
    }
  },
  methods: {
    // 返回
    toBack() {
      this.$router.replace({ name: 'Account', params: { refresh: true } })
    },
    // 编辑
    editAccountDetails(data) {
      this.$router.push({ name: 'AddAccount', query: { id: data.id } })
    },
    // 明细 --收支账本明细 过滤
    toBalancePaymentHistory(data) {
      this.$router.push({
        name: 'BalancePaymentHistory',
        query: { id: data.id }
      })
    },
    // 跟新启用状态
    async upDown() {
      await this.$api.ACCOUNTDETAILSSTATUS_LIST({ id: this.id })
      this.getData(true)
    },
    // 获取数据
    async getData(update) {
      let res = await this.$api.ACCOUNTDETAILS_LIST({ id: this.id })
      console.log(res)
      if (res.status === 1) {
        if (res.data.isEnable === '0') {
          this.checked = false
          if (update === true) {
            this.$toast.success('已停用')
          }
        } else {
          this.checked = true
          if (update === true) {
            this.$toast.success('已启用')
          }
        }
        console.log('打印内容 =', res)
        this.data = res.data
        this.remarks = res.data.remarks
      } else {
        console.error(`获取列表失败${res.stateMessage}`)
      }
    }
  },
  activated() {
    if (this.$route.query.id) {
      // 财务账户id
      this.id = this.$route.query.id
    }
    this.getData()
  }
}
</script>

<style lang="less">
.see,
.icon-youjiantou1 {
  color: #1690ff;
}
.weixin i,
.zhifubao i,
.xianjingfu2 i,
.yinghangka svg {
  font-size: 36px;
}
.weixin i {
  color: rgb(13, 204, 109) !important;
}
.zhifubao i {
  color: rgb(17, 148, 227) !important;
}
.xianjingfu2 i {
  color: rgb(22, 144, 255) !important;
}
.cb_store-icon-box,
.cb_store-info {
  display: inline-block;
  vertical-align: middle;
}
.cb_store-icon-box {
  padding: 0 9px 0 0;
}
.active-info {
  .c_cell_wrapper {
    min-height: 45px;
  }

  // 去掉列表框的上下线条
  .cb-cell-group-border:after {
    background-image: none;
  }
  .topList {
    margin: 0 8px;
    border-radius: 10px;
    margin-bottom: -2px;
    .c_cell_wrapper:last-child .c_cell {
      background-image: none;
    }
  }
  .towList {
    margin: 2px 8px 0;
    border-radius: 10px;
    overflow: hidden;
    background-color: #fff;
    .active-info .c_cell_wrapper {
      min-height: 40px;
      height: 42px;
      line-height: 42px;
      .c_cell {
        height: 40px;
        line-height: 40px;
      }
    }
    .c_cell_wrapper:last-child .c_cell {
      background-image: none;
    }
  }
  .cb-cell-group {
    margin-bottom: 0;
  }
}
.outline {
  border: 1px solid #d73962 !important;
}
.outline:active {
  color: #fff !important;
  background: #d73962 !important;
}
.hidden {
  display: none;
}
</style>
