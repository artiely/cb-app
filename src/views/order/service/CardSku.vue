<template>
  <div>
    <div class="c-card-sku">
      <div class="c-card-sku--name textover1" style="padding-right:100px">{{data.gasName}}  <v-badge v-if="data.gasType && data.gasType==1" size="small"  type="商">商</v-badge>
        <v-badge v-else size="small" type="服">服</v-badge></div>
      <div class="c-card-sku--box clearfix">
        <div class="fl">{{data.gasSkuName}}</div>
        <div class="fr" style="margin-top:-10px;">
          <keep-alive>
            <!-- 次卡maxCount -->
            <div v-if="cardType==3">
              <cart-ctrl v-if="data.numUsable!=0" :goods="data" @add="add(data)" @cut="cut(data)" :maxCount="data.numUsable"></cart-ctrl>
            </div>
            <!-- 折扣卡 -->
            <div v-else>
              <cart-ctrl :goods="data" @add="add(data)" @cut="cut(data)"></cart-ctrl>
            </div>
          </keep-alive>
        </div>
      </div>
      <div class="c-card-sku--code clearfix">
        <div class="fl">
          <span v-if="data.gasBrand">品牌：{{data.gasBrand}}</span>
          <span v-if="data.gasCode">编码：{{data.gasCode}}</span>
        </div>
        <div class="c-card-sku--num">
          <span v-if="data.numUsable||data.numUsable==0">可用数量： <span v-if="data.numUsable==0" style="color:#d73962">{{data.numUsable}} 次</span><span v-else>{{data.numUsable}} 次</span></span>
          <span v-else-if="cardType==3">可用数量：不限次</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cartCtrl from '../cartCtrl/cartCtrl'
export default {
  components: {
    cartCtrl
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    cardType: String,
    allData: Object
  },
  computed: {
    shopCar() {
      return this.$store.state.order.shopCar
    }
  },
  watch: {
    shopCar: {
      handler(val) {
        /*
        场景1 购物车有商品
        场景2 购物车无商品
        */
        if (val.length > 0) {
          const findIndex = (element, index, array) => {
            return element.id === this.data.gasSkuId
          }
          let index = val.findIndex(findIndex)
          if (index !== -1) {
            this.data.count = val[index].count
          }
        } else {
          this.data.count = 0
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    add(item) {
      /*
      gasName: '林氏机油',
      gasBrand: '', // 品牌
      code: '001', // 编码
      id: '0d92d7bb32684e80904737367a5fa27c',
      name: '10L',
      price: 150, // 价格
      gasType: '1', // 类型 0 服务 1商品
      gasUnit: '1', // 单位
      count: 1, // 数量
      moneyDec: 10, // 折让金额
      cardType: '', // 卡类型
      cardId: '', // 卡id
      */
      let data = {
        gasName: item.gasName,
        gasBrand: item.gasBrand,
        code: item.gasCode,
        id: item.gasSkuId,
        name: item.gasSkuName,
        price: item.gasSkuPrice,
        gasType: item.gasType,
        unit: item.gasUnit,
        cardId: this.allData.id,
        cardType: this.allData.cardType,
        moneyDec: 0
      }
      this.$store.commit('ADD_SHOP_CAR', data)
    },
    cut(item) {
      let data = {
        id: item.gasSkuId
      }
      this.$store.commit('CUT_SHOP_CAR', data)
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/style/var.less';
@import '../../../assets/style/border.less';
.c-card-sku--gastype {
  position: absolute;
  top: 10px;
  left: 5px;
}
.c-card-sku {
  position: relative;
  height: 80px;
  width: 100%;
  background: #ffffff;
  padding: 10px 15px 10px 30px;
  .borderB(@dividers);
  &--name {
    font-size: 18px;
    font-weight: 500;
    color: #666;
    height: 24px;
    line-height: 24px;
  }
  &--box {
    width: 100%;
    font-size: 16px;
    color: #666;
    font-weight: 500;
    height: 24px;
    line-height: 24px;
  }
  &--code {
    position: relative;
    height: 10px;
    font-size: 12px;
    color: @secondary-text;
  }
  &--num {
    position: absolute;
    top: 0px;
    right: 0px;
  }
}
</style>
