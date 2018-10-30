<template>
  <div>
    <v-header title="销售订单" righttext="批量关闭" @right-click="batchClose" :leftClick="cancel" :isBack="false" lefttext="取消"></v-header>
    <v-scroll-page top="44">
      <cube-scroll ref="scroll" :data="data" @pulling-up="onPullingUp" :options="options" @pulling-down="onPullingDown">
        <div v-if="data.length>0" class="orderList1">
          <v-br></v-br>
          <van-checkbox-group v-model="result">
            <van-checkbox v-for="item in data" :key="item.id" :name="item.id">
              <div class="c-order-item">
                <div>
                  <div class="c-order-item--userbox clearfix">
                    <div class="c-order-item--carid" v-if="item.motorLicence">
                      {{item.motorLicence |carIdFormat()}}
                    </div>
                    <div v-else class="c-order-item--carid c-order-item--no">
                      无车辆

                    </div>
                    <div class="c-order-item--userinfo textover1" v-if="item.memberUsername">
                      {{item.memberUsername|telFormat()}} {{item.memberName}}
                    </div>
                    <div v-else class="c-order-item--userinfo c-order-item--no">
                      无客户

                    </div>
                  </div>
                  <div class="c-order-item--price" :class="{'has-payment':item.statusPay=='98'}">
                    {{item.moneySrc|currency('')}}
                  </div>
                </div>
                <div class="c-order-item--date">
                  <div class="c-order-item--border">{{item.createDate|timeFormat()}}
                    <span class="c-order-item--status" v-if="item.createType==1"></span>
                    <span class="c-order-item--status cardcolor" v-if="item.createType==2"> · 折扣卡</span>
                    <span class="c-order-item--status cardcolor" v-if="item.createType==3"> · 次卡</span>
                    <span class="c-order-item--status stayjs" v-if="item.createType==1 && item.statusPay==1"> · 待结算</span>
                    <span class="c-order-item--status stayhk" v-if="item.createType!=1 && item.statusPay==1"> · 待划卡</span>
                  </div>
                </div>

              </div>
            </van-checkbox>
          </van-checkbox-group>

          <!-- <order-item class="orderList1" :data="data"></order-item> -->
        </div>
        <v-nodata v-else></v-nodata>
      </cube-scroll>
    </v-scroll-page>
  </div>
</template>

<script>
import OrderItem from '@/components/OrderItem'
import scroll from '../../common/mixins/scroll.js'
export default {
  components: {
    OrderItem
  },
  mixins: [scroll],
  data() {
    return {
      result: [],
      query: {
        pageNo: 1,
        pageSize: 10,
        closeableType: '1',
        closeFlag: '0'
      },
      data: []
    }
  },
  methods: {
    cancel() {
      this.result = []
      this.$router.back()
    },
    async getData() {
      let res = await this.$api.ORDER_LIST(this.query)
      if (res.status === 1) {
        if (this.query.pageNo === 1) {
          this.data = res.page.list || []
        } else {
          this.data = this.data.concat(res.page.list || [])
        }
        this.totalPage = res.page.totalPage
      } else {
        console.error('获取订单失败')
      }
    },
    batchClose() {
      if (this.result.length === 0) {
        this.$toast.fail('请先选择订单')
        return
      }
      this.$dialog
        .confirm({
          title: '确定关闭吗？',
          message: ' ',
          confirmButtonText: '确定'
        })
        .then(async() => {
          // on close
          let res = await this.$api.ORDER_CLOSE({ ids: this.result.join() })
          if (res.status === 1) {
            this.$toast.success('已关闭')
            this.query.pageNo = 1
            this.getData()
            this.result = []
            this.$router.back()
          }
        })
    }
  },
  activated() {
    this.getData()
  }
}
</script>

<style lang="less">
.orderList1 {
  .van-checkbox__label {
    width: calc(100% - 34px);
  }
  .van-checkbox {
    margin: 10px;
  }
  .c-order-item {
    width: auto;
    border-radius: 5px;
    margin: 0;
    .c-order-item--border {
      background: none;
      padding-bottom: 6px;
    }
    .c-order-item--price {
      padding-top: 0;
    }
  }
}
</style>
