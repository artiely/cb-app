<template>
  <div>
    <order-custom></order-custom>
    <div class="order-stream">
      <div class="stream-item" @click="handleStatusChange(0,'接车单')">
        <span class="item-text-line">接车单</span>
      </div>
      <div class="stream-item" @click="handleStatusChange(1,'开单')">
        <v-icon name="icon-xiaotubiao-31" class="fl"></v-icon>
        <span class="item-text-line">订单</span>
      </div>
      <div class="stream-item" @click="handleStatusChange(2,'施工单')">
        <v-icon name="icon-xiaotubiao-31" class="fl"></v-icon>
        <span class="item-text-line active">施工单</span>
      </div>
    </div>
    <div class="billing-box">
      <cube-scroll :data="okCart" ref="scroll">
        <div v-if="okCart.length>0" >
          <v-br></v-br>
          <div v-for="(sku,i) in okCart" :key="sku.id">
            <div class="goods-card">
              <div class="goods-card--gastype">
                <v-badge v-if="sku.gasType && sku.gasType==1" size="small" color="#f6a95f">商</v-badge>
                <v-badge v-else size="small" color="#56d3f7">服</v-badge>
              </div>
              <div class="top-box-goods ">
                <div class="title">{{sku.gasName}}
                </div>
                <div class="clearfix">
                  <div class="specification fl">{{sku.name}}</div>
                  <div class="count-box fr">
                    <span class="price-area">
                      {{sku.price|currency('￥')}}</span> x {{sku.count}}</div>
                </div>
              </div>
              <div class="ctrl-box-wrapper">
                <div>
                  <div class="clearfix ctrl-box-item" @click="toSelect(sku,i)">
                    <span class="fl ctrl-box-title">施工人
                      <span v-if="sku.dealEmployee">({{sku.dealEmployee.length}})</span>
                    </span>
                    <span class="fl ctrl-box-value textover1">
                      <span v-if="sku.dealEmployee">
                        <span v-for="it in sku.dealEmployee" :key="it.id">
                          <span v-if="it&&it.name">{{it.name}} </span>
                        </span>
                      </span>
                    </span>
                    <span class="fr ctrl-box-icon">
                      <v-icon name="icon-youjiantou1"></v-icon>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <v-br></v-br>
          </div>
          <v-br :height="40"></v-br>
        </div>
         <div v-else style="padding:150px 0;text-align:center;color:#c7c7c7;font-size:22px">无内容</div>
      </cube-scroll>
     
      <v-footer>
        <v-footer-item style="background:#fff;color:#0dcc6d;flex:2;text-align:left;padding-left:15px;"> ￥{{totalPrice}}</v-footer-item>
        <v-footer-item @click.native="clearShopcar" class="footer-white">重置</v-footer-item>
        <v-footer-item @click.native="handlerToNext(false,'shigong')" :class="okCart.length==0?'footer-disable':''">保存</v-footer-item>
        <v-footer-item @click.native="orderOver" class="yellow-btn" :class="okCart.length==0?'footer-disable':''">完工</v-footer-item>
      </v-footer>
    </div>
    <van-popup v-model="shigongShow" position="bottom" style="width:100%;height:60%" :lock-scroll="false">
      <v-popup-title :title="popupTitle" @close="shigongShow=false"></v-popup-title>
      <div class="popup-scroll-wrapper">
        <cube-scroll>
          <van-checkbox-group v-model="resultS">
            <van-cell-group>
              <van-cell v-for="item in storeStaff" :title="item.name" :key="item.id">
                <van-checkbox :name="item" />
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
          <v-br :height="50"></v-br>
        </cube-scroll>
      </div>
      <div class="c_bottom_fixed_btn_group">
        <div class="ok-btn" @click="shigongShow = false">确定</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import cartCtrl from './cartCtrl/cartCtrl'
import NoOrder from './NoOrder'
import OrderCustom from './OrderCustom'
import handlerToNext from '../../common/mixins/orderSave.js'
import { mapGetters, mapState } from 'vuex'
export default {
  components: {
    cartCtrl,
    NoOrder,
    OrderCustom
  },
  data() {
    return {
      shigongShow: false,
      lingliaoShow: false,
      popupTitle: '请选择施工人',
      currStaff: '',
      resultS: [],
      resultL: [],
      currSku: {},
      currIndex: 0
    }
  },
  props: {
    refresh: Number
  },
  mixins: [handlerToNext],
  computed: {
    ...mapGetters([
      'okCart',
      'totalPrice',
      'orderCustomInfo',
      'orderOfCustomObject'
    ]),
    ...mapState({
      orderStatus: state => state.order.orderStatus,
      currentCard: state => state.order.currentCard,
      orderInfo: state => state.order.orderInfo,
      storeStaff: state => state.order.storeStaff
    })
  },
  watch: {
    resultS: {
      handler(val) {
        // shigong
        this.currSku.dealEmployee = this.resultS.filter(v => {
          if (v) {
            return v
          }
        })
        this.$store.commit('SHOP_CAR_SG', this.currSku)
      },
      deep: true
    }
  },
  methods: {
    toSelect(sku, i) {
      this.currSku = sku
      this.currIndex = i
      this.shigongShow = true
      let a = this.storeStaff
      // 先清空
      this.resultS = []
      // shigong
      // 先看默认是否有值 默认有值就选中
      if (sku.dealEmployee) {
        let b = sku.dealEmployee
        let intersection = a.filter(v => {
          let has = function(el) {
            return el.id === v.id
          }
          return b.some(has)
        })
        this.resultS = intersection
      }
    },
    handleStaff(item) {
      this.currStaff = item
    },
    handleStatusChange(i) {
      if (i === 0) {
        this.$router.replace('/jieche')
      } else if (i === 1) {
        this.$router.replace('/kaidan')
      } else {
        this.$router.replace('/shigong')
      }
    },
    clearShopcar() {
      let has = this.okCart.filter(v => {
        if (v.dealEmployee.length > 0 || v.receiveEmployee.length > 0) {
          return v
        }
      })
      if (has.length > 0) {
        this.$dialog
          .confirm({
            title: '确定重置吗？',
            message: '重置后，施工人将清空。',
            confirmButtonText: '确定'
          })
          .then(() => {
            // on confirm
            this.$store.commit('CLEAR_STAFF_SL')
          })
          .catch(() => {
            // on cancel
          })
      }
    },
    orderOver() {
      this.handlerToNext(true, 'shigong')
    }
  },
  created() {
    this.$store.dispatch('getStoreStaff')
  },
  mounted() {},
  activated() {
    this.$nextTick(() => {
      this.$refs.scroll.refresh()
    })
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';
.c_bottom_fixed_btn_group {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: #eeeeee;
  display: flex;
  color: #ffffff;
  text-align: center;
  line-height: 50px;
  font-size: 16px;
  .ok-btn {
    flex: 2;
    background: #1690ff;
  }
  .cancel-btn {
    flex: 1;
    background: lighten(#1690ff, 20%);
  }
}
.popup-innerbox {
  padding: 12px;
  .flex-box {
    width: 50%;
    padding: 4px;
    display: inline-block;
    .cc_btn_line {
      border: 1px solid #666666;
      color: #666666;
      text-align: center;
      height: 30px;
      line-height: 30px;
      border-radius: 16px;
      font-size: 14px;
    }
    &.active {
      .cc_btn_line {
        border: 1px solid #1690ff;
        color: #1690ff;
      }
    }
  }
}
.count-box {
  color: #666;
  font-size: 12px;
  .price-area {
    color: @danger;
  }
}
</style>
