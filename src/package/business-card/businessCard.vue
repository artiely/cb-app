<template>
  <a>
    <div class="cb-business-card" :class="{'cb-business-border':input}">
      <!-- <div v-if="input" class="cd-business-money" @click="showKeyboard=true">
        <div class="cd-business-tip">{{topTip}}
          <span class="cd-business-required"> *</span>
        </div>
        <div class="cd-business-num">
          <v-icon name="icon-rmb1"></v-icon>{{money}}</div>
      </div>
      <div v-else-if="inputNative" class="cd-business-money" @click="showKeyboard=true">
        <div class="cd-business-tip">{{topTip}}
          <span class="cd-business-required"> *</span>
        </div>
        <div class="cd-business-num">
          <v-icon name="icon-rmb1"></v-icon>
          <input :value="value" type="number" @input="handleInput" />
        </div>
      </div> -->
      <div class="cb-business-card-mainbox">
        <div class="cd-business-placeholder" v-if="data.length==0" @click="add">
          <span> {{noDataTip}}，</span>
          <span class="cd-business-add">
            去新增
          </span>
        </div>
        <!-- <div class="cd-business-main" v-else-if="name" @click="choice">
          <img :src="require('../../assets/img/cardbg.png')" alt="卡">
          <div class="cd-business-main--info">
            <div class="card-info-title">
              {{name}}
              <v-badge v-if="currentCard&&currentCard.cardType==2" type="折扣卡">折扣卡</v-badge>
              <v-badge v-if="currentCard&&currentCard.cardType==3" type="次卡">次卡</v-badge>
            </div>
            <div class="card-info-limit">
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
        </div> -->
        <v-cb-card v-else-if="name" :currentCard="currentCard"  @click="choice"></v-cb-card>
        <div class="cd-business-main" v-else @click="choice">
          <span>{{placeholder}}
            <sup class="cd-business-required">*</sup>
          </span>
          <span class="cd-business-link">
            <v-icon name="icon-youjiantou1" color="#1690ff"></v-icon>
          </span>
        </div>
      </div>
      <div class="cd-business-link-more" @click="choice" v-if="data.length>=1&&name">
        更多活动 ( {{data.length}} )
        <v-icon name="icon-youjiantou1" color="#1690ff"></v-icon>
      </div>
    </div>
    <!-- <van-number-keyboard :show="showKeyboard" theme="custom" extra-key="." close-button-text="完成" @blur="showKeyboard = false" @input="onInput" @delete="onDelete" /> -->
  </a>
</template>

<script>
export default {
  name: 'v-business-card',
  props: {
    placeholder: {
      type: String,
      default: '暂无可用充值活动'
    },
    topTip: {
      type: String,
      default: '充值金额'
    },
    inputNative: {
      type: Boolean,
      default: false
    },
    value: [String, Number],
    noDataTip: String,
    name: String,
    input: Boolean,
    money: [String, Number],
    data: {
      type: Array, // 用来判断是否有活动
      default: () => []
    },
    currentCard: Object
  },
  data() {
    return {
      showKeyboard: false,
      KeyValue: [],
      chargePrice: ''
    }
  },
  watch: {
    // chargePrice: {
    //   handler(val) {
    //     this.$emit('input', val)
    //   },
    //   immediate: true
    // }
  },
  methods: {
    add(e) {
      this.$emit('add', e)
    },
    choice(e) {
      this.$emit('choice', e)
    },
    handleInput(e) {
      // this.$emit('input', e.target.value)
      e.target.value = e.target.value.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
      e.target.value = e.target.value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
      e.target.value = e.target.value
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
      e.target.value = e.target.value.replace(
        /^(-)*(\d+)\.(\d\d).*$/,
        '$1$2.$3'
      ) // 只能输入两个小数
      if (e.target.value.indexOf('.') < 0 && e.target.value !== '') {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        e.target.value = parseFloat(e.target.value)
      }
      // e.target.value = e.target.value.replace(/[^\d]/g, '')
      if (Number(e.target.value) > this.maxValue) {
        e.target.value = this.maxValue
      }
      this.$emit('input', e.target.value)
    }
    // onInput(value) {
    //   if (this.KeyValue.length <= 12) {
    //     this.KeyValue.push(value)
    //     this.chargePrice = this.KeyValue.join('')
    //     this.$emit('input', this.chargePrice)
    //   }
    // },
    // onDelete() {
    //   this.KeyValue.pop()
    //   this.chargePrice = this.KeyValue.join('')
    //   this.$emit('input', this.chargePrice)
    // }
  }
}
</script>

<style lang="less">
@import '../../assets/style/var';
.cb-business-card {
  height: 190px;
  position: relative;
  width: 100%;
  background: #fff;
  overflow: hidden;
  .cb-business-card-mainbox {
    padding: 10px 27px 0 27px;
  }
  .cd-business-link-more {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #1690ff;
    text-align: right;
    padding-right: 12px;
    font-weight: 500;
    .icon{
      font-size: 14px;
    }
  }
  .cd-business-required {
    color: @danger;
    font-size: 16px;
    line-height: 1;
  }
  .cd-business-card {
    position: absolute;
    left: 0;
    bottom: 10px;
  }
  .cd-business-tip {
    font-size: 14px;
    padding-top: 4px;
    color: #666;
    line-height: 25px;
  }
  &.cb-business-border {
    border-bottom: 1px solid #0dcc6d;
  }
  .cd-business-num {
    height: 55px;
    vertical-align: bottom;
    line-height: 55px;
    font-size: 40px;
    color: #333;
    .icon {
      color: #333 !important;
      font-size: 21px;
      position: relative;
      z-index: 99;
    }
    > input {
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 55px;
      text-indent: 25px;
      color: #333;
    }
  }
  .cd-business-placeholder {
    line-height: 140px;
    font-size: 18px;
    text-align: center;
    color: #c7c7c7;
  }
  .cd-business-money {
    position: relative;
    height: 100%;
  }
  .cd-business-main {
    position: relative;
    height: 140px;
    line-height:140px;
    font-size: 20px;
    color: #333;
    object-fit: cover;
    border-radius: 10px;
    >span{font-weight:500;}
    overflow: hidden;
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
      }
    }
  }
  .cd-business-add {
    font-size: 18px;
    color: #1690ff;
    text-decoration: underline;
    font-weight: 600;
  }
  .cd-business-link {
    float: right;
    .icon {
      font-size: 16px;
    }
  }
}
</style>
