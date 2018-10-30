<template>
  <div>
    <v-header title="编辑模板" righttext="保存" @right-click="handleRight" :left-click="handleLeft"></v-header>
    <v-scroll-page top="44" style="overflow-y:scroll">
      <v-br height="20"></v-br>
      <v-cell-group style="margin:0">
        <v-cell title="模板名称" required input v-model="name">
        </v-cell>
      </v-cell-group>
      <v-remark v-model="remark"></v-remark>
      <v-br height="20"></v-br>
      <v-cell-group>
        <v-cell wrap v-for="(item,index) in okCart" :key="item.id">
          <div slot="text" class="order-temp-cell">
            <div class="order-temp-left" @click="delCurrSku(item)">
              <v-icon name="icon-shanchu2"></v-icon>
            </div>
            <div class="order-temp-right">
              <div class="order-temp-title textover1">{{item.gasName}}
                <v-badge v-if="item.gasType==2" size="small" type="服">服</v-badge>
                <v-badge v-else size="small" type="商">商</v-badge>
              </div>
              <div class="clearfix order-temp-sku">
                <span class="fl">{{item.name}}</span>
                <span class="fr" @click="editCurrSku(index)">{{item.count}}
                  <span v-if="item.unit">{{item.unit}}</span>
                  <span v-else>次</span> × {{item.price|currency()}}
                  <v-icon name="icon-lujing1"></v-icon>
                </span>
              </div>
              <div class="order-temp-brand" v-if="item.gasType!=2">品牌：
                <span v-if="item.gasBrand">{{item.gasBrand}}</span>
              </div>
            </div>
          </div>
        </v-cell>
        <div class="order-temp-choice-sku" @click="toChoiceSku">
          <v-icon name="icon-add_bg"></v-icon> 选择服务/商品
        </div>
      </v-cell-group>
      <div style="padding:40px" v-if="okCart.length>0 && id">
        <div class="outline" style="border:1px solid #d73962;color:#d73962;text-align:center" @click="delTemp">删除模板</div>
      </div>
      <v-br></v-br>
    </v-scroll-page>
    <!-- 数量 -->
    <van-dialog class="dialog-price" style="padding-bottom:0" v-if="okCart.length>0" v-model="showCount" :showConfirmButton="true" confirmButtonText="确定" :showCancelButton="true">
      <div class="dialog-price--title">
        {{okCart[currEditSkuIndex].gasName}}
        <p class="dialog-price--title-desc">{{okCart[currEditSkuIndex].name}}</p>
        <v-icon name="icon-shanchu1" class="dialog-price--title-cancel tap-area" @click.native="showCount=false"></v-icon>
      </div>
      <v-cell-group>
        <v-cell title="数量">
          <div slot="text">
            <cart-ctrl :goods="okCart[currEditSkuIndex]" style="margin-top:14px;float:left;margin-left:20px" class="fr add-ctrl sku-ctrl" @add="addGoodsToCar(okCart[currEditSkuIndex])" @cut="checkCarCount(okCart[currEditSkuIndex])"></cart-ctrl>
          </div>
        </v-cell>
      </v-cell-group>
    </van-dialog>
  </div>
</template>

<script>
import cartCtrl from '../cartCtrl/cartCtrl'
export default {
  components: {
    cartCtrl
  },
  data() {
    return {
      name: '',
      remark: '',
      id: '',
      src: '',
      tempDetail: {},
      showCount: false,
      currEditSkuIndex: 0
    }
  },
  computed: {
    okCart() {
      return this.$store.getters.okCart
    }
  },
  watch: {
    id: {
      handler(val) {
        if (val) {
          this.getTempDetail().then(() => {
            this.$store.commit('PUSH_SHOP_CAR', this.formatTemp)
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    handleLeft() {
      this.id = ''
      this.name = ''
      this.remark = ''
      this.$router.back()
      this.$store.dispatch('clearShopCar')
    },
    editCurrSku(index) {
      this.currEditSkuIndex = index
      this.showCount = true
    },
    addGoodsToCar(item) {
      this.$store.commit('ADD_SHOP_CAR', item)
    },
    checkCarCount(item) {
      if (item.count === 1) return
      this.$store.commit('CUT_SHOP_CAR', item)
    },
    delTemp() {
      this.$dialog
        .confirm({
          title: '确定删除吗？',
          confirmButtonText: '确定',
          message: '删除后将无法恢复。'
        })
        .then(() => {
          this.del()
        })
        .catch(() => {
          // on cancel
        })
    },
    handleRight() {
      if (this.okCart.length === 0) {
        this.$toast('您还未选择服务/商品')
      } else if (this.name === '') {
        this.$toast('请输入模板名称')
      } else {
        this.save()
      }
      // alert(1)
      // this.$router.push({ name: 'Service', params: { order: true } })
    },
    toChoiceSku() {
      this.$router.push({ name: 'Service', query: { src: 'orderTemp' } })
    },
    async del() {
      let res = await this.$api.ORDER_TEMP_DEL({ id: this.id })
      if (res.status === 1) {
        this.$toast.success('删除成功')
        this.$store.dispatch('clearShopCar')
        this.id = ''
        this.name = ''
        this.remark = ''
        this.$router.replace('/templist')
      } else {
        this.$toast.success('删除失败')
      }
    },
    async save() {
      let data = this.okCart.map(v => {
        return {
          gasType: v.gasType,
          gasSkuId: v.id,
          num: v.count
        }
      })
      let res = await this.$api.ORDER_TEMP_SAVE({
        name: this.name,
        id: this.id,
        remarks: this.remark,
        items: data
      })
      if (res.status === 1) {
        // 如果来自开单 保存回开单
        this.$toast.success('保存成功')
        if (this.src === 'kaidan') {
          this.$router.replace('/kaidan')
        } else {
          this.name = ''
          this.remark = ''
          this.id = ''
          this.$store.dispatch('clearShopCar')
          this.$router.replace('/templist')
        }
      } else {
        this.$toast.fail('保存失败')
      }
    },
    getTempDetail() {
      return new Promise((resolve, reject) => {
        this.$api.ORDER_TEMP_DETAIL({ id: this.id }).then(res => {
          if (res.status === 1) {
            this.name = res.data.name
            this.remark = res.data.remarks
            let val = res.data.items || []
            this.formatTemp = val.map(v => {
              return {
                gasName: v.gasName,
                gasBrand: v.gasBrand,
                code: v.gasCode,
                name: v.gasSkuName,
                id: v.gasSkuId,
                gasType: v.gasType,
                price: v.gasSkuPrice,
                unit: v.gasUnit,
                dealEmployee: [],
                receiveEmployee: [],
                moneyDec: '',
                count: 1
              }
            })
            resolve()
          } else {
            console.error('获取模板详情失败')
            resolve()
          }
        })
      })
    },
    delCurrSku(item) {
      this.$store.commit('DEL_SHOP_CAR', item)
    }
  },
  activated() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
    }
    if (this.$route.query.src) {
      this.src = this.$route.query.src
    } else {
      this.src = ''
    }
  }
}
</script>

<style  lang="less">
.order-temp-choice-sku {
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 16px;
  color: #1690ff;
  .icon {
    font-size: 22px;
    color: #1690ff !important;
  }
}
.order-temp-cell {
  display: flex;
  .order-temp-left {
    width: 25px;
    padding-top: 10px;
    .icon {
      font-size: 20px;
      color: #d73861 !important;
    }
  }
  .order-temp-right {
    flex: 1;
  }
  .order-temp-title {
    font-size: 18px;
    color: #333;
  }
  .order-temp-sku {
    font-size: 16px;
    color: #666;
    padding-bottom: 4px;
    .fr {
      font-size: 18px;
      color: #333;
      .icon {
        font-size: 16px;
        color: #1690ff !important;
      }
    }
  }
  .order-temp-brand {
    font-size: 12px;
    color: #999;
  }
}
</style>