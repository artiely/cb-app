<template>
  <div v-if="data">
    <!-- <div class="c-order-item" v-for="item in data" :key="item.id" @click="toDetail(item)">
      <div class="clearfix">
        <div class="c-order-item--userbox ">
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
          {{item.moneySrc|currency()}}
        </div>
      </div>
      <div class="c-order-item--date">
        <div class="c-order-item--border">{{item.updateDate|timeFormat()}}
          <span class="c-order-item--status" v-if="item.createType==1"></span>
          <span class="c-order-item--status cardcolor" v-if="item.createType==2"> · 折扣卡</span>
          <span class="c-order-item--status cardcolor" v-if="item.createType==3"> · 次卡</span>
          <span class="c-order-item--status stayjs" v-if="item.createType==1 && item.statusPay!=98"> · 待结算</span>
          <span class="c-order-item--status stayhk" v-if="item.createType!=1 && item.statusPay!=98"> · 待划卡</span>
        </div>
      </div>
    
    </div> -->

    <div class="c-order-item-new" v-for="(item,index) in data" :key="item.id">
      <div class="c-order-header">
        <span class="fl c-order-date">{{item.updateDate|timeFormat()}}</span>
        <span class="fr c-order-more tap-area" @click="more(item,index)">
          <v-icon name="icon-gengduo"></v-icon>
        </span>
        <span class="fr c-order-status">
          <span class="c-order-item--status stayjs" v-if="item.createType==1 && item.statusPay!=98">待结算</span>
          <span class="c-order-item--status stayhk" v-if="item.createType!=1 && item.statusPay!=98">待划卡</span>
        </span>
      </div>
      <div class="c-order-body" @click="toDetail(item)">
        <div class="c-order-brand">
          <v-icon name="icon-morencheliang"></v-icon>
        </div>
        <div class="c-order-info">
          <div class="c-order-idcard-price clearfix">
            <div class=" fl c-order-idcard">
              <span v-if="item.motorLicence">{{item.motorLicence |carIdFormat()}}</span>
              <span v-else class="c-order-nodate">—</span>
            </div>
            <div class="fr c-order-price" :class="{'c-order-price-status':item.statusPay!=98}">
              {{item.moneySrc|currency()}}
            </div>
          </div>
          <div class="c-order-userinfo">
            <span v-if="item.memberUsername">
              {{item.memberUsername|telFormat()}} {{item.memberName}}
            </span>
            <span v-else class="c-order-nodate">
              —
            </span>
            <span class="fr">
              <v-badge v-if="item.createType==2" type="折扣卡">折扣卡</v-badge>
              <v-badge v-if="item.createType==3" type="次卡">次卡</v-badge>
            </span>
          </div>
        </div>
      </div>
      <div class="c-order-mark" :class="{'c-order-mark-show':item.markShow}">
        <div class="c-order-btn-group">
          <div class="c-order-btn-cell">
            <div class="c-order-btn" :class="!(
        item.status === '98' ||
        item.statusPay === '98' ||
        item.statusPay === '2'
      )?'':'disabled'" @click="edit(item)">编辑</div>
          </div>
          <div class="c-order-btn-cell">
            <div class="c-order-btn" :class="(item.statusPay === '2' || item.statusPay === '1')?'':'disabled'" @click="pay(item)">结算</div>
          </div>
          <div class="c-order-btn-cell">
            <div class="c-order-btn" @click="del(item,index)" :class="{'disabled':(item.statusPay === '98' || item.status === '98') &&
        (item.statusPay !== '98' || item.status !== '98')}">删除</div>
          </div>
          <div class="c-order-btn-cell">
            <div class="c-order-btn" :class="{'disabled':item.closeFlag=='1' || (item.statusPay === '98' &&item.status==='98')||(item.statusPay !== '98'&&item.statusPay !== '98')}" @click="close(item,index)">关单</div>
          </div>
        </div>
        <span class="c-order-more-ps tap-area" @click="moreHide(item,index)">
          <v-icon name="icon-gengduo"></v-icon>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'dayjs'
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    toDetail(item) {
      // 有人有车
      if (item.member && item.motor) {
        let data = {
          licence: item.motorLicence,
          member: {
            ...item.member,
            name: item.memberName,
            username: item.memberUsername
          },
          id: item.motor.id
        }
        this.$store.commit('ORDER_OF_CAR', data)
        // 只有人
      } else if (item.member) {
        let data = {
          name: item.memberName,
          username: item.memberUsername,
          id: item.member.id
        }
        this.$store.commit('ORDER_OF_CUSTOM', data)
        // 只有车
      } else if (item.motor) {
        let data = { licence: item.motorLicence, id: item.motor.id }
        this.$store.commit('ORDER_OF_CAR', data)
        // 无主
      } else {
        this.$store.commit('CLEAR_ORDER_CUSTOM')
      }
      this.$router.push({ name: 'OrderDetail', query: { id: item.id } })
    },
    more(item, index) {
      this.data = this.data.map((v, i) => {
        v.markShow = false
        if (i === index) {
          v.markShow = !v.markShow
        }
        return v
      })
    },
    moreHide(item, index) {
      this.data = this.data.map((v, i) => {
        v.markShow = false
        return v
      })
    },
    async edit(item) {
      if (
        !(
          item.status === '98' ||
          item.statusPay === '98' ||
          item.statusPay === '2'
        )
      ) {
        let res = await this.$api.ORDER_DETAIL({ id: item.id })
        // 这是一部大操作 拆分组合数据
        // TIP: 这里要设置3种状态
        // 1设置 orderOfCustom 2 设置 shopCar 3 设置 orderInfo
        if (res.status === 1) {
          let data = res.data
          this.$store.dispatch('clearOrder')
          // 如果是划卡要设置当前卡的信息
          if (data.memberCard && data.memberCard.id) {
            this.$store.commit('SET_CURRENT_CARD', data.memberCard)
          }
          let orderInfo = {
            sellEmployee: data.sellEmployee || '',
            id: data.id || '',
            orderNoHand: data.orderNoHand || '',
            motorMileCurrent: data.motorMileCurrent,
            startTime: data.startTime
              ? moment(data.startTime).format('YYYY-MM-DD')
              : '',
            remarks: data.remarks || ''
          }

          this.$store.commit('SET_ORDER_INFO', orderInfo)
          let orderItems =
            data.orderItems &&
            data.orderItems.map(v => {
              return {
                gasName: v.gasName || '',
                gasBrand: v.gasBrand || '', // 品牌
                code: v.gasCode || '', // 编码
                id: v.gasSkuId || '',
                name: v.gasSkuName || '',
                price: (v.moneySrc || 0) / (v.num || 0), // 价格
                gasType: v.gasType || '', // 类型 0 服务 1商品
                gasUnit: v.gasUnit || '', // 单位
                count: v.num || 1, // 数量
                moneyDec: v.moneyDec || '', // 折让金额
                cardType: data.createType || '', // 卡类型
                cardId: data.memberCard ? data.memberCard.id : '', // 卡id
                dealEmployee: v._s || '' // 施工员
              }
            })

          this.$store.commit('PUSH_SHOP_CAR', orderItems)
          // 分 车和人的情况
          // 设置当前的客户
          if (data.member && data.motor) {
            let orderOfCustom = {
              licence: data.motorLicence,
              id: data.motor.id,
              member: {
                ...data.member,
                name: data.memberName ? data.memberName : '',
                username: data.memberUsername
              }
            }
            this.$store.commit('ORDER_OF_CAR', orderOfCustom)
          } else if (data.member) {
            let orderOfCustom = {
              id: data.member.id || '',
              name: data.memberName || '',
              username: data.memberUsername || ''
            }
            this.$store.commit('ORDER_OF_CUSTOM', orderOfCustom)
          } else if (data.motor) {
            let orderOfCar = {
              id: data.motor.id || '',
              licence: data.motorLicence || ''
            }
            this.$store.commit('ORDER_OF_CAR', orderOfCar)
          } else {
            // 无车无人
            this.$store.commit('CLEAR_ORDER_CUSTOM')
          }
          this.$router.push('/kaidan')
        }
      } else {
        this.$toast('已结算订单不可编辑')
      }
    },
    pay(item) {
      if (item.statusPay === '2' || item.statusPay === '1') {
        this.$router.replace({ name: 'Jiesuan', query: { orderId: item.id } })
      } else {
        this.$toast('该订单已结算')
      }
    },
    close(item, index) {
      // 未结算并且未完工 已完工并且已结算 的都不可关闭
      if (
        (item.statusPay === '98' && item.status === '98') ||
        (item.statusPay !== '98' && item.status !== '98')
      ) {
        this.$toast('该订单不可关闭')
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
          let res = await this.$api.ORDER_CLOSE({ ids: item.id })
          if (res.status === 1) {
            this.$toast.success('已关闭')
            this.data.splice(index, 1)
            this.allFalse()
          }
        })
        .catch(() => {
          // on cancel
        })
    },
    allFalse() {
      this.data = this.data.map((v, i) => {
        v.markShow = false
        return v
      })
    },
    async del(item, index) {
      if (
        (item.statusPay === '98' || item.status === '98') &&
        (item.statusPay !== '98' || item.status !== '98')
      ) {
        this.$toast('该订单不可删除')
      } else {
        this.$dialog
          .confirm({
            title: '确定删除吗？',
            message: '删除后不可恢复。',
            confirmButtonText: '确定'
          })
          .then(async() => {
            let res = await this.$api.ORDER_DEL({ id: item.id })
            if (res.status === 1) {
              this.$toast.success('已删除')
              this.data.splice(index, 1)
              this.allFalse()
            }
          })
          .catch(() => {
            // on cancel
          })
      }
    }
  }
}
</script>

<style lang="less">
.c-order-item-new {
  margin-bottom: 20px;
  position: relative;
  .c-order-mark {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.75);
    display: none;
    .c-order-more-ps {
      position: absolute;
      top: 0;
      right: 15px;
      height: 30px;
      line-height: 30px;
      .icon {
        font-size: 20px;
        color: #fff !important;
      }
    }
    &.c-order-mark-show {
      display: block;
    }
    .c-order-btn-group {
      padding-left: 16px;
      padding-right: 30px;
      line-height: 110px;
      display: flex;
    }
    .c-order-btn-cell {
      flex: 1;
      .c-order-btn {
        display: inline-block;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        text-align: center;
        line-height: 50px;
        font-size: 15px;
        font-weight: 500;
        color: #1690ff;
        background: #fff;
        &.disabled {
          background: #c7c7c7;
          color: #fff;
        }
      }
    }
  }
  .c-order-nodate {
    font-size: 14px;
    color: #999;
  }
  .c-order-header {
    height: 30px;
    line-height: 30px;
    background: #f8f8f8;
    padding: 0 15px;
    overflow: hidden;
    .c-order-date {
      color: #999;
      font-size: 12px;
    }
    .c-order-more {
      .icon {
        font-size: 20px;
        color: #1690ff !important;
      }
      &.c-order-more-zindex {
        z-index: 99;
        .icon {
          color: #fff !important;
        }
      }
    }
    .c-order-status {
      font-size: 14px;
      padding: 0 10px;
    }
  }
  .c-order-body {
    height: 80px;
    background: #fff;
    display: flex;
    padding: 0 15px;
    .c-order-brand {
      width: 44px;
      height: 44px;
      margin-top: 18px;
      background: #f0f0f0;
      border-radius: 50%;
      text-align: center;
      line-height: 44px;
      .icon {
        font-size: 22px;
        color: #fff !important;
      }
    }
    .c-order-info {
      flex: 1;
      padding-left: 15px;
      .c-order-idcard-price {
        padding-top: 20px;
        .c-order-idcard {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          span {
            font-weight: 600;
          }
        }
        .c-order-price {
          font-size: 18px;
          color: #0dcc6d;
          font-weight: 500;
          &.c-order-price-status {
            color: #d73962;
          }
          span {
            font-weight: 500;
          }
        }
      }
      .c-order-userinfo {
        padding-top: 8px;
        font-size: 14px;
        color: #666;
        font-weight: 500;
        span {
          font-weight: 500;
        }
      }
    }
  }
}
</style>
