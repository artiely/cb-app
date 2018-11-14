<template>
  <div class="coupos-template">
    <div v-for="(item, index) in data" :key="index" class="wrapper-coupon" @click="showDetailInfo(item)">
      <div class="c-card-coupon--wrapper clearfix" :key="item.id" :class="{ 'c-card-coupon--disabled':item.status==2,'c-card-coupon--jiesuan':selectItem} ">
        <div class="c-card-coupon--temp-icon" v-if="item.dataSrc==0">车边模板</div>
        <div class="c-card-coupon--footer--dot--top" style="top:-6px"></div>
        <div style="border-left: 1px dashed #fff;height:83%;line-height:2px;position: absolute;top:8%;left:calc(65% + 10px);"></div>
        <div class="c-card-coupon--footer--dot--bottom " style="bottom:-6px"></div>
        <div class="c-card-coupon--title clearfix " @click="toDetail(item)">
          <!-- 优惠券列表名称 -->
          <div class="c-card-coupon--title--left textover1">{{item.name}}
          </div>
          <!-- 满减面值 -->
          <div class="c-card-coupon--title--right textover1 " v-if="item.type==1" :class="showInfo?'':'c-card-text-right'">{{item.moneyReduce|currency('￥')}}
          </div>
          <!-- 满赠面值 -->
          <div class="c-card-coupon--title--right textover1 " v-if="item.type==2" :class="showInfo?'':'c-card-text-right'">{{item.moneyGift|currency('￥')}}
          </div>
        </div>
        <div class="c-card-coupon--desc textover1 " @click="toDetail(item)">
          <div class="c-card-coupon--footer--left ">
            <span class="c-card-coupon--text">满{{item.moneyCondition|currency('')}}元可用</span>
            <v-badge size="small " v-if="item.type==2 " :class="{ 'c-card-coupon--badge--disabled':item.status==2} " type="礼品券">礼品券</v-badge>
            <v-badge size="small " v-else :class="{ 'c-card-coupon--badge--disabled':item.status==2} " type="通用券">通用券</v-badge>
          </div>
          <div class="c-card-coupon--footer--right text" v-if="showInfo">
            已领 {{item.numReceive}} 份
          </div>
        </div>

        <div class="c-card-coupon--footer clearfix ">
          <div class="c-card-coupon--footer--left" @click="toDetail(item)" v-if="item.endUsableDate">
            <span class="c-card-coupon--footer--text">有效期至：{{item.endUsableDate|timeFormat('YYYY.MM.DD')}}</span>
          </div>

          <div class="c-card-coupon--footer--left" @click="toDetail(item)" v-else>
            <span class="c-card-coupon--footer--text" v-if="item.restrictTimeType=='1'">有效期：{{item.restrictDateStart|timeFormat('YYYY.MM.DD')}}至{{item.restrictDateEnd|timeFormat('YYYY.MM.DD')}}</span>
            <span class="c-card-coupon--footer--text" v-else>有效期：自领取 {{item.restrictDays}} 天有效</span>
          </div>

          <div class="c-card-coupon--footer--right" v-if="showInfo">
            <span v-if="item.numPublish&&item.numReceive==item.numPublish" class="c-card-coupon--btn tap-area" style="background: #c7c7c7;">已领完</span>
            <!-- status 1是以启用 2是已停用 -->
            <span v-else class="c-card-coupon--btn tap-area" @click="toShare" :class="{'backgroundSpan':item.status==='1'}">发券 </span>
          </div>
        </div>
      </div>
      <!-- 结算勾选 -->
      <div class="card-active-radio" v-if="selectItem" @click="toDetail(item)">
        <!-- 券的id和当前点击的id比较 -->
        <v-icon :name="currItem.id==item.id?'icon-queding1':'icon-yuan'"></v-icon>
      </div>
    </div>

    <!-- 券详情-预览 currItem当前点击的    showDetail客户优惠券预览 ：text-->
    <v-coupon-preview v-model="previewShow" :data="currItem" :storeInfo="storeInfo" style="width:100%;height:100%;background:#e8e8e8" position="bottom" showDetail></v-coupon-preview>

  </div>
</template>

<script>
import VCouponPreview from '../../views/ticket/CouponDetail'
export default {
  name: 'v-coupons-template',
  components: {
    VCouponPreview
  },
  data() {
    return {
      previewShow: false, // 显示预览
      currItem: {}
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    showInfo: { // 券列表 发券已领完显示
      type: Boolean,
      default: false
    },
    // showDetail: {
    //   type: Boolean,
    //   default: false
    // },
    selectItem: { //
      type: Boolean,
      default: false
    }
  },
  methods: {
    toDetail(item, e) {
      this.$emit('click-detail', item, e)
    },
    toShare(e) {
      this.$emit('click-toShare', e)
    },
    showDetailInfo(item) { // 点击客户优惠券预览预览
      if (!this.selectItem && !this.showInfo) { // 优惠券点击进详情（点击预览才预览）、结算不预览
        this.previewShow = true
      }
      this.currItem = item
    }
  }
}
</script>

<style lang="less">
// TIP: 样式不用修改
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';
.c-card-coupon--detail {
  margin: 10px auto;
  width: 95%;
}
.wrapper-coupon {
  position: relative;
  .c-card-coupon--jiesuan {
    margin: 10px 0 10px 10px !important;
    width: 89% !important;
  }
  /*选择券*/
  .card-active-radio {
    width: 35px;
    text-align: center;
    line-height: 100px;
    position: absolute;
    right: 0;
    top: 0;
    .icon {
      font-size: 22px !important;
      color: #ddd !important;
      &.icon-queding1 {
        color: @primary!important;
      }
    }
  }
}

.c-card-coupon--wrapper {
  border-radius: 8px;
  margin: 10px auto;
  background: -webkit-linear-gradient(
    left,
    #f2511f,
    #ff2300
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    left,
    #f2511f,
    #ff2300
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    left,
    #f2511f,
    #ff2300
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(left, #d40000, #ff2300);
  /* 标准的语法 */
}
.backgroundSpan {
  background: #971a28;
}
.c-card-coupon--disabled {
  background: rgb(199, 199, 199);
}
.share-btn-box {
  text-align: center;
}
#shareBtn {
  display: inline-block;
}
.coupon-share-tip {
  font-size: 12px;
  color: @primary-text;
  text-align: center;
}
.c-card-coupon--title--left,
.c-card-coupon--footer--left,
.c-card-coupon--title--right,
.c-card-coupon--footer--right {
  color: #fff;
}
.c-card-coupon--title--right {
  text-align: center;
  font-weight: bold;
  font-size: 20px;
}
.c-card-coupon--text,
.c-card-coupon--footer--right.text {
  line-height: 20px;
}
.c-card-coupon--footer--right.text {
  margin-right: 2%;
}
.c-card-coupon--footer--text {
  height: 25px;
  line-height: 25px;
}
.c-filter--box {
  padding: 5px 10px;
  .c-filter--item {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    color: @secondary-text;
    padding: 0 6px;
    text-align: center;
    background: #ffffff;
    border-radius: 4px;
    font-size: 12px;
    margin-right: 10px;
    .icon {
      font-size: 12px;
      vertical-align: 0px;
      padding: 0 4px;
      color: @secondary-text!important;
    }
  }
}
.c-card-coupon--btn {
  display: inline-block;
  width: 70px;
  height: 25px;
  line-height: 25px;
  border-radius: 10px;
  text-align: center;
  margin-top: 8px;
  color: #fff;
}
.c-card-coupon--footer {
  background-image: none;
}
.c-card-coupon--footer--dot--top,
.c-card-coupon--footer--dot--bottom {
  height: 12px;
  width: 12px;
  position: absolute;
  left: 66%;
  background: #e8e8e8;
  border-radius: 50%;
}
.c-card-text-right {
  position: absolute;
  right: 0;
  top: 25%;
}
</style>


