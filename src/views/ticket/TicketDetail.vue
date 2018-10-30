<template>
  <div>
    <v-header title="详情"></v-header>
    <div class="c-scroll-wrapper-top">
      <cube-scroll :data="data" ref="scroll" @pulling-up="onPullingUp" :options="options" @pulling-down="onPullingDown">
        <order-custom noHeader nolink :data="orderOfCustom"></order-custom>
        <v-br :height="20"></v-br>
        <div v-if="detailData">
          <div class="card-ticket-baseinfo">
            <div class="baseinfo-name">
              <span v-if="detailData&&detailData.cardType==2">[{{detailData.discount*10}}折]</span> {{detailData.name}}
              <v-badge size="small" class="success" v-if="detailData&&detailData.cardType==3" type="次卡">次卡</v-badge>
              <v-badge size="small" v-if="detailData&&detailData.cardType==2" type="折扣卡">折扣卡</v-badge>
              <span class="right-status fr" v-if="detailData._status=='有效'">有效</span>
              <span class="right-status stop fr" v-if="detailData._status=='已过期'">已过期</span>
              <span class="right-status disabled fr" v-if="detailData._status=='已用完'">已用完</span>
            </div>
            <p class="otherinfo clearfix">
              <span class="fl">
                电子卡号：{{detailData.no}}
              </span>
              <span class="fr">
                <v-badge style="background:#ddd">
                  <span v-if="detailData.durationStart&&detailData.durationEnd">
                    <span v-if="detailData._days>0">还有{{detailData._days}}天</span>
                    <span v-else-if="detailData._days==0">今日到期</span>
                    <span v-else>已过期</span>
                  </span>
                  <span v-else>
                    永久有效
                  </span>
                </v-badge>
              </span>
            </p>
            <div class="clearfix postpone" v-if="detailData.durationStart&&detailData.durationEnd">
              <v-button class="fr" style="width:50px" type="primary" @click.native="dateVisible=true" >延期</v-button>
            </div>
          </div>
          <v-br :height="20"></v-br>
          <v-cell-group style="margin-bottom:5px;">
            <v-cell title="结余金额" v-if="detailData.cardType==='2'" :text="detailData.moneyUsable|currency()" :options="{textStyle:'font-size:18px;color:#333'}"></v-cell>
            <v-cell title="办卡金额" :text="detailData.money|currency()"></v-cell>
            <v-cell title="办理时间" :text="detailData.createDate | timeFormat('YYYY-MM-DD')"></v-cell>
            <v-cell title="到期时间" v-if="detailData.durationEnd" :text="detailData.durationEnd |timeFormat('YYYY-MM-DD')" key="指定时间"></v-cell>
            <v-cell title="到期时间" v-else text="永久有效" key="永久有效"></v-cell>
            <!-- <v-cell title="备注" :text="detailData.remarks" ></v-cell> -->
            <v-cell title="创建人" :text="detailData.createBy"></v-cell>
            <v-cell title="销售人" :text="detailData.sellEmployee?detailData.sellEmployee.name:''"></v-cell>
          </v-cell-group>
          <span v-if="detailData.remarks">
            <v-remark v-model="detailData.remarks" disabled></v-remark>
          </span>
          <v-br></v-br>
          <v-tab-bar :data="tab" v-model="active" style="background:#fff"></v-tab-bar>
          <div v-if="active==0" key="记录">
            <div v-if="data" class="jiluBox">
              <v-cell :link="item.changeType=='B'" v-for="item in data" :key="item.id" @click.native="toOrder(item)">
                <div style="display:flex;width:100%">
                  <div class="left-slot--popup">
                    <div class="main-top">{{item.createDate|timeFormat()}}</div>
                    <div class="value-bottom" v-if="item.changeType=='A'">办卡</div>
                    <div class="value-bottom" v-if="item.changeType=='D'">销售订单号:{{item.srcBusNo}}</div>
                  </div>
                  <div class="moreinfo-popup fr">
                    <span v-if="detailData.cardType==3&&item.changeType=='B'"> {{'1000'|currency('￥')}} </span>
                    <span v-else-if="item.changeType=='D'" style="color:#1690ff">详情
                      <v-icon name="icon-youjiantou1" color="#1690ff"></v-icon>
                    </span>
                  </div>
                </div>
              </v-cell>
            </div>
            <div v-else class="ticket-all">
              暂无相关记录
            </div>
          </div>
          <div v-else key="范围">
            <div v-if="detailData.scopeType==1" key="全场通用" class="ticket-all">
              全场通用
            </div>
            <div v-else key="指定商品和服务">
              <div class="ticket-detail-item clearfix" v-for="item in detailData.items" :key="item.id">
                <div class="fl ticket-detail-item--left">
                  <div>
                    <v-badge v-if="item.gasType==2" size="small" type="服">服</v-badge>
                    <v-badge v-else size="small" type="商">商</v-badge>
                    {{item.gasName}}
                  </div>
                  <span style="padding-left:20px;">{{item.gasSkuName}}</span>
                </div>
                <div class="fr ticket-detail-item--right">
                  <!-- 次卡才有使用次数 -->
                  <span v-if="detailData.cardType==3">
                    <span v-if="item.num" key="有次数">{{item.numUsable}}/{{item.num}}</span>
                    <span v-else key="无次数限制">不限</span>次</span>
                  <!-- 折扣卡才显示商品价格 -->
                  <span v-if="detailData.cardType==2">{{item.gasSkuPrice|currency('￥')}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <v-br :height="40"></v-br>
      </cube-scroll>
    </div>
    <van-popup v-model="dateVisible" style="width:100%;" position="bottom">
      <!-- <mu-date-picker :date.sync="delayDete" actions :min-date="minDate"></mu-date-picker> -->
      <van-datetime-picker v-model="currentDate" type="date" :min-date="minDate" :max-date="maxDate" @confirm="confirm" @cancel="cancel" confirm-button-text="确定" />
    </van-popup>
  </div>
</template>

<script>
import moment from 'dayjs'
import OrderCustom from '../order/OrderCustom'
import scroll from '../../common/mixins/scroll.js'
export default {
  components: {
    OrderCustom
  },
  mixins: [scroll],
  data() {
    return {
      tab: [{ name: '划卡记录', id: 0 }, { name: '用卡范围', id: 1 }],
      detailData: '',
      dateVisible: false,
      delayDete: undefined,
      query: {
        pageNo: 1,
        pageSize: 10,
        'memberCard.id': ''
      },
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      totalPage: 0,
      data: [],
      active: 0,
      minDate: new Date()
    }
  },
  computed: {
    orderOfCustom() {
      return this.$store.state.order.orderOfCustom
    }
  },
  watch: {
    delayDete: {
      handler(val) {
        if (val) {
          this.dateVisible = false
          this.$dialog
            .confirm({
              title: '确定延期？',
              confirmButtonText: '确定',
              message:
                '此卡将延期至<span style="color:#1690ff">' +
                moment(val).format('YYYY-MM-DD') +
                '</span>'
            })
            .then(() => {
              this.cardDelay()
            })
            .catch(() => {
              // on cancel
            })
        }
      }
    }
  },
  methods: {
    confirm(val) {
      this.delayDete = moment(val).format('YYYY-MM-DD')
    },
    cancel() {
      this.dateVisible = false
    },
    async cardDelay() {
      let res = await this.$api.CARD_DELAY({
        id: this.query['memberCard.id'],
        delayDate: moment(this.delayDete).format('YYYY-MM-DD')
      })
      if (res.status === 1) {
        this.$toast.success('延期成功')
        this.getInfo()
        console.info('卡延期成功')
      } else {
        this.$toast.fail('延期失败')
        console.error(res.status + '卡延期失败')
      }
    },
    async getInfo() {
      let res = await this.$api.DISACCOUNT_CARD_DETAIL({
        id: this.query['memberCard.id']
      })
      if (res.status !== 1) {
        console.error('获取详情失败')
      } else {
        let item = res.data
        var _d = new Date()
        // TIP: 根据卡类型判断当前卡是否可用 卡类型。1：储值卡、2：折扣卡、3：次卡
        if (item.cardType === '3') {
          // 次卡 判断次数和时间
          let days = moment(item.durationEnd).diff(moment(), 'days') + 1
          if (days < 0) {
            item._status = '已过期'
          } else if (item.numUsableTotal > 0 && days >= 0) {
            item._status = '有效'
          } else {
            item._status = '已用完'
          }
          item._days = days
          // 设置卡延期的最小日期
          _d.setTime(item.durationEnd)
          this.minDate = _d
        } else if (item.cardType === '2') {
          // 折扣卡 判断时间和剩余金额
          let days = moment(item.durationEnd).diff(moment(), 'days') + 1
          if (days < 0) {
            item._status = '已过期'
          } else if (item.moneyUsable > 0 && days >= 0) {
            item._status = '有效'
          } else {
            item._status = '已用完'
          }
          item._days = days
          // 设置卡延期的最小日期
          _d.setTime(item.durationEnd)
          this.minDate = _d
        } else {
          // 储值卡 只判断余额 TIP: 储值卡已经移除
          item._status = item.moneyUsable > 0 ? '有效' : '已用完'
        }
        this.detailData = item
      }
    },
    async getData() {
      // 获取会员卡消费记录
      let res = await this.$api.DISACCOUNT_CARD_RECORD(this.query)
      if (res.status === 1) {
        if (this.query.pageNo === 1) {
          this.data = res.page.list || []
        } else {
          this.data = this.data.concat(res.page.list || [])
        }
        this.totalPage = res.page.totalPage
      } else {
        console.error('获取储值卡流水失败')
      }
    },
    toOrder(item) {
      this.$router.push({
        name: 'OrderDetail',
        query: {
          oid: item.srcBusNo
        }
      })
    }
  },
  activated() {
    let id = this.$route.query.id
    this.query['memberCard.id'] = id
    this.getInfo()
    this.getData()
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';
.ticket-all {
  width: 100%;
  padding: 20px;
  background: #ffffff;
  height: 100%;
  text-align: center;
}
.c-card--badge {
  width: 10px;
  height: 10px;
  padding: 2px 4px;
  border-radius: 4px;
  background: @primary;
  color: #ffffff;
  font-size: 12px;
}
.ticket-detail-item {
  // height: 44px;
  margin-bottom: 1px;
  background: #ffffff;
  line-height: 1.2;
  padding: 8px 18px;
  .ticket-detail-item--left {
    font-size: 16px;
    color: #333333;
  }
  .ticket-detail-item--right {
    font-size: 15px;
    color: #999999;
  }
}
.card-ticket-baseinfo {
  padding: 18px 15px 0 15px;
  background: #ffffff;
  margin-bottom: 1px;
  .postpone {
    padding: 8px 0;
    .borderT(@dividers);
  }
  .baseinfo-name {
    font-size: 18px;
    font-weight: 700;
    color: @primary-text;
  }
  .otherinfo {
    height: 44px;
    font-size: 12px;
    line-height: 44px;
    color: @disable;
  }
}
.left-slot--popup {
  flex: 1;
  .main-top {
    font-size: 16px;
    height: 30px;
    line-height: 40px;
    color: #333333;
  }
  .value-bottom {
    font-size: 14px;
    height: 30px;
    line-height: 20px;
    color: #999999;
  }
}
.moreinfo-popup {
  text-align: right;
  font-size: 14px;
  color: #333333;
}
.jiluBox{
  .c_cell_wrapper:last-child .c_cell{
    background-image: none;
  }
}
</style>
