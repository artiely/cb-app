<template>
  <van-popup :value="value" style="width:100%;height:100%;background:#e8e8e8" position="bottom">
    <div>
      <!-- 预览 -->
      <v-header title="优惠券预览" :left-click="handleLeft">
      </v-header>
      <v-scroll-page top="44" style="overflow-y:scroll">
        <div style="padding:10px">
          <div class="c_coupon--preview-header" v-if="storeInfo">
            <div class="preview-header-name">
              <div class="header-name-icon">
                <v-icon name="icon-qiyeguanli"></v-icon>
              </div>
              {{storeInfo.name}}</div>
            <div class="preview-header-address">
              <span style="color:#666;width:40px">地址 </span>
              <span style="flex:1">{{storeInfo.areaDetail}}</span>
            </div>
          </div>
          <v-br></v-br>
          <div class="preview-body">
            <div class="preview-money" v-if="data.type==1">{{data.moneyReduce|currency('￥')}}</div>
            <div class="preview-money" v-else>{{data.moneyCondition|currency('￥')}}</div>
            <p style="font-size:18px;color:#666;text-align:center;padding-bottom:5px">全店商品满立减</p>
            <p style="font-size:14px;color:#999;text-align:center"> {{'满 '+data.moneyCondition+'元可用'}}</p>
            <p style="font-size:14px;color:#999;text-align:center;padding-top:30px" v-if="data.restrictTimeType==1">{{data.restrictDateStart|timeFormat('YYYY.MM.DD')}} - {{data.restrictDateEnd|timeFormat('YYYY.MM.DD')}}</p>
            <p style="font-size:14px;color:#999;text-align:center;padding-top:30px" v-else>自领取 {{data.restrictDays}} 天有效</p>
            <div></div>
            <div class="preview-border">
              <div class="preview-dot dot-left"></div>
              <div style="padding:0 5px;overflow:hidden;height:30px">
                <div class="preview-dot-small" v-for="item in 40" :key="item"></div>
              </div>
              <div class="preview-dot dot-right"></div>
            </div>
            <ul style="padding:10px">
              <li class="preview-li">
                <v-icon name="icon-dot"></v-icon> {{'满 '+data.moneyCondition+'元可用'}}</li>
              <li class="preview-li">
                <v-icon name="icon-dot"></v-icon> 每人限领 {{data.restrictNum+' 张'}}</li>
              <li class="preview-li">
                <v-icon name="icon-dot"></v-icon> 使用时间 {{data.restrictWeek}}</li>
              <li class="preview-li" v-if="data.descriptionUse">
                <v-icon name="icon-dot"></v-icon> {{data.descriptionUse}}</li>
            </ul>
          </div>
        </div>
      </v-scroll-page>
    </div>
  </van-popup>
</template>

<script>
export default {
  name: 'v-coupon-preview',
  data() {
    return {
      show: false,
      id: ''
    }
  },
  props: {
    data: '',
    value: {
      type: Boolean,
      default: false
    },
    storeInfo: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    handleLeft() {
      this.$emit('input', false)
    }
  }
}
</script>
<style lang="less">
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';
.preview-body {
  border-radius: 10px;
  background: #fff;
  .preview-money {
    font-size: 35px;
    color: #d73962;
    text-align: center;
    font-weight: 600;
    padding: 25px 0 15px 0;
  }
}
.preview-li {
  line-height: 1.8;
  font-size: 12px;
  color: #999;
  .icon {
    color: #ff7316 !important;
    font-size: 6px;
  }
}
.c_coupon--preview-header {
  border-radius: 10px;
  background: #fff;
  .preview-header-name {
    font-size: 18px;
    font-weight: 600;
    height: 50px;
    line-height: 50px;
    color: #333;
    display: flex;
    .borderB();
    .header-name-icon {
      display: inline-block;
      margin: 10px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      width: 30px;
      border-radius: 50%;
      background: #eee;
      .icon {
        color: #c7c7c7 !important;
      }
    }
  }
  .preview-header-address {
    padding-top: 8px;
    padding-left: 53px;
    font-size: 12px;
    color: #999;
    line-height: 1.2;
    display: flex;
    padding-bottom: 8px;
  }
}
.preview-border {
  position: relative;
  background: #fff;
  height: 30px;
  .preview-dot {
    border-radius: 50%;
    position: absolute;
    height: 30px;
    width: 30px;
    line-height: 30px;
    top: 0;
    left: -15px;
    background: #e8e8e8;
    &.dot-right {
      left: auto;
      right: -15px;
    }
  }
  .preview-dot-small {
    height: 8px;
    width: 8px;
    border-radius: 8px;
    background: #e8e8e8;
    display: inline-block;
    margin: 11px 2px;
  }
}
</style>
