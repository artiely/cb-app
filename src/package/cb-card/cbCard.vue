<template>
  <div class="cd-business-main-cardinfo" :class="{'cd-business-main-list':hasBtn}" @click="choice">
    <div v-if="currentCard.cardType==1" class="card-bg-box">
      <img :src="require('../../assets/img/activebg.jpg')" alt="卡" v-if="currentCard.isActive==1">
      <img :src="require('../../assets/img/dsactivebg.jpg')" alt="卡" v-else>
    </div>
    <div v-else class="card-bg-box">
      <img :src="require('../../assets/img/dscardbg.jpg')" alt="卡" v-if="currentCard.isActive==0">
      <img :src="require('../../assets/img/cardbg.png')" alt="卡" v-else>
    </div>
    <div class="cd-business-main--info">
      <div class="card-info-title" @click="detail">
        {{currentCard.name}}
        <span class="card-info-detail" v-if="hasBtn">详情
          <v-icon name="icon-youjiantou1"></v-icon>
          <!-- <img :src="require('../../assets/img/carNavRight.png')" alt="右箭头" class="cardNavR"  /> -->
        </span>
        <v-badge v-if="currentCard&&currentCard.cardType==2" type="折扣卡">折扣卡</v-badge>
        <v-badge v-if="currentCard&&currentCard.cardType==3" type="次卡">次卡</v-badge>
      </div>
      <div class="card-info-limit" v-if="currentCard.cardType!=1">
        <span v-if="currentCard&&currentCard.scopeType==1">全场通用
          <span v-if="currentCard&&currentCard.cardType==2"> · [{{currentCard.discount*10}}折]</span>
        </span>
        <span v-else>指定服务/商品
          <span v-if="currentCard&&currentCard.cardType==2"> · [{{currentCard.discount*10}}折]</span>
        </span>
      </div>
      <div class="card-info-price" v-if="currentCard&&currentCard.money">
        {{currentCard.money|currency()}}
      </div>
      <div class="card-info-remark textover1">
        备注：{{currentCard.remarks}}
      </div>
    </div>
    <div class="cb-cardinfo-btn" :class="{'active':currentCard.cardType!=='1','disabled':currentCard.isActive=='0',}" v-if="hasBtn" @click="toBtn">{{btnText}}</div>
  </div>

</template>

<script>
export default {
  name: 'v-cb-card',
  props: {
    currentCard: Object,
    hasBtn: {
      type: Boolean,
      default: false
    },
    btnText: {
      type: String,
      default: '充值'
    }
  },
  methods: {
    choice(e) {
      this.$emit('click', e)
    },
    detail(e) {
      this.$emit('click-detail', e)
    },
    toBtn(e) {
      this.$emit('click-btn', e)
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/var';
.card-info-detail {
  position: absolute;
  top: 17px;
  right: 0;
  font-size: 12px;
  color: #333;
  padding-right: 14px;
  .icon {
    font-size: 0.25rem;
    color: #333 !important;
  }
}
.cd-business-main-cardinfo {
  position: relative;
  height: 140px;
  font-size: 20px;
  color: #333;
  object-fit: cover;
  border-radius: 10px;
  overflow: hidden;
  &.cd-business-main-list {
    height: 195px;
    .cd-business-main--info {
      .card-info-remark {
        bottom: 60px;
      }
    }
  }
  .cb-cardinfo-btn {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 40px;
    width: 100%;
    text-align: center;
    line-height: 40px;
    font-size: 18px;
    color: #fff;
    z-index: 99;
    background: rgba(0, 77, 39, 0.75);
    &.disabled {
      background: rgba(199, 199, 199, 0.75)!important;
    }
    &.active {
      background: rgba(115, 69, 0, 0.75);
    }
  }
  .card-bg-box {
    height: 100%;
    width: 100%;
  }
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
  .cd-business-main--info {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 4;
    .card-info-title {
      font-size: 18px;
      font-weight: 600;
      padding-top: 14px;
      color: #fff;
      text-align: center;
      position: relative;
    }
    .card-info-limit {
      font-size: 12px;
      color: #fff;
      padding-top: 8px;
      text-align: center;
    }
    .card-info-price {
      font-size: 24px;
      font-weight: 600;
      color: #fff;
      text-align: center;
      padding-top: 20px;
    }
    .card-info-remark {
      font-size: 12px;
      text-align: center;
      color: #fff;
      padding-top: 24px;
      position: absolute;
      bottom: 12px;
      left: 0;
      width: 100%;
    }
  }
}
</style>
