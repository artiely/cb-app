<template>
  <div>
    <v-header :border="false">
      <div slot="title">
        <v-tab-bar type="btn" :data="[{name:'服务库',id:0},{name:'商品库',id:1}]" v-model="active" style="background:#f8f8f8"></v-tab-bar>
      </div>
    </v-header>
    <div class="goods-box">
      <div>
        <!-- <v-tab-bar :data="[{name:'服务库',id:0},{name:'商品库',id:1}]" v-model="active"></v-tab-bar> -->
        <v-search v-model="keywords" style="margin:0" :placeholder="active==1?'编码/名称/品牌':'编码/名称'"></v-search>
      </div>
      <div class="cb-sclect">
        <div class="cb-sclect-item" @click="useShow=true">{{currentUseType.name}}
          <v-icon name="icon-iconfontarrows"></v-icon>
        </div>
        <div class="cb-sclect-item" @click="storeShow=true">{{currentStore.name}}
          <v-icon name="icon-iconfontarrows"></v-icon>
        </div>
      </div>
      <keep-alive>
        <choice-service v-if="active==0" :srcType="srcType" :statusType="statusType" :orderByType="orderByType" :active="active"></choice-service>
        <choice-goods v-if="active==1" :srcType="srcType" :statusType="statusType" :orderByType="orderByType" :active="active"></choice-goods>
      </keep-alive>
      <v-footer>
        <v-footer-item class="footer-white" @click.native="showShopcart=true">
          <v-icon name="icon-lujing" size="24"></v-icon>
          <v-dot :number="skuListFilter.length"></v-dot>
        </v-footer-item>
        <v-footer-item style="flex:2" @click.native="handleChoiceOK" :style="skuListFilter.length==0?'background:#bbb':''">
          <span v-if="skuListFilter.length>0">选好了
          </span>
          <span v-else>请选择服务/商品</span>
        </v-footer-item>
      </v-footer>
    </div>

    <!-- 已选规格 -->
    <van-popup v-model="showShopcart" position="bottom" class="popup-radius" style="width:100%;height:70%" :lock-scroll="false">
      <v-popup-title @close="showShopcart=false">
        <div slot="left" style="padding:15px ;font-size:14px" @click="clearAll">
          <v-icon name="icon-shanchu2"></v-icon>清空</div>
      </v-popup-title>
      <div class="sku-goods-wrapper">
        <cube-scroll :data="skuListFilter" ref="scroll">
          <div class="selected-sku-box" v-for="(it,i) in skuListFilter" :key="it.id">
            <div class="selected-sku-item ">
              <div class="selected-sku-del tap-area" @click="delSku(i)">
                <v-icon name="icon-shanchu2"></v-icon>
              </div>
              <div class="selected-sku-main">
                <h1 class="selected-sku-goodsname textover1">{{it.gasName}}
                  <v-badge size="small" v-if="it.gasType=='1'" type="商">商</v-badge>
                  <v-badge size="small" v-if="it.gasType=='2'" type="服">服</v-badge>
                </h1>
                <p class="selected-sku-name"> {{it.name}}</p>
                <p class="selected-sku-price"> {{it.price|currency()}}
                  <span style="color:#666">
                    /
                    <span v-if="it.unit">{{it.unit}}</span>
                    <span v-else>次</span>
                  </span>
                </p>
              </div>
            </div>
            <div class="cb-card-ctrl-box" v-if="cardType==3">
              <div class="ctrl-nolimit tap-area" @click.stop.prevent="noLimit(it)" :class="{'no-limit-active':it.count==-1}">不限次</div>
              <div class="plus-cut-ctrl-box tap-area" v-if="it.count>0">
                <div class="ctrl-cut tap-area" @click.stop.prevent="cut(it)">-</div>
                <div type="tel" class="ctrl-input" maxlength="7">{{it.count}}</div>
                <div class="ctrl-plus tap-area" @click.stop.prevent="add(it)">+</div>
              </div>
              <div v-else class="plus-cut-ctrl-add">
                <div class="ctrl-plus ctrl-icon tap-area" @click.stop.prevent="push(it)">+</div>
              </div>
            </div>
          </div>
        </cube-scroll>
      </div>
      <v-footer>
        <v-footer-item @click.native="showShopcart=false">确定</v-footer-item>
      </v-footer>
    </van-popup>
    <van-actionsheet class="cb-actionsheet" v-model="storeShow" :actions="actions" cancel-text="取消" @select="onSelect" @cancel="onCancel" />
    <van-actionsheet class="cb-actionsheet" v-model="useShow" :actions="useActions" cancel-text="取消" @select="onSelectUse" @cancel="onCancelUse" />
  </div>
</template>

<script>
import ChoiceGoods from './GoodsItems'
import ChoiceService from './ServiceItems'
export default {
  name: 'service',
  components: {
    ChoiceGoods,
    ChoiceService
  },
  data() {
    return {
      // 0选中服务1选中商品
      active: 0,
      // 显示购物车
      showShopcart: false,
      // 关键词
      keywords: '',
      actions: [
        {
          name: '全部库',
          id: ' '
        },
        {
          name: '系统库',
          id: '0'
        },
        {
          name: '店铺库',
          id: '1'
        }
      ],
      useActions: [
        {
          name: '经常使用',
          id: '1'
        },
        {
          name: '最近使用',
          id: '2'
        }
      ],
      currentStore: { name: '全部库', id: '' },
      currentUseType: { name: '经常使用', id: '1' },
      orderByType: '1',
      statusType: '',
      useShow: false,
      storeShow: false
    }
  },
  watch: {
    showShopcart: {
      handler() {
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 500)
      }
    }
  },
  computed: {
    skuList() {
      return this.$store.state.card.skuList
    },
    skuListFilter() {
      return this.$store.getters.skuListFilter
    },
    cardType() {
      return this.$store.state.card.cardType
    }
  },
  methods: {
    onSelect(item) {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      this.currentStore = item
      this.storeShow = false
      this.srcType = item.id
    },
    onCancel() {
      this.storeShow = false
    },
    onSelectUse(item) {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      this.currentUseType = item
      this.useShow = false
      // this.srcType = item.id
      this.orderByType = item.id
    },
    onCancelUse() {
      this.useShow = false
    },
    /* 搜索相关操作 e */
    add(item) {
      this.$store.commit('ADD_SKU_LIST_CARD', item)
    },
    push(item) {
      this.$store.commit('PUSH_SKU_LIST_CARD', item)
    },
    cut(item) {
      this.$store.commit('CUT_SKU_LIST_CARD', item)
    },
    noLimit(item) {
      this.$store.commit('NOLIMIT_SKU_LIST_CARD', item)
    },
    delSku(i) {
      this.$store.commit('DEL_SKU_CARD', i)
      this.$toast.success('删除成功')
    },
    clearAll() {
      this.$dialog
        .confirm({
          title: '确定清空已选服务/商品吗？',
          confirmButtonText: '确定',
          message: ' '
        })
        .then(() => {
          // on confirm
          this.$store.commit('CLEAR_SKU_CARD')
        })
        .catch(() => {
          // on cancel
        })
    },
    handleChoiceOK() {
      if (this.skuList.length !== 0) {
        this.$router.push('/addnewcard')
      }
    }
  },
  mounted() {},
  activated() {}
}
</script>
