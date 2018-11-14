<template>
  <div id="serviceadd">
    <v-header title="服务库/商品库" righticon="icon-xiaotubiao-20" :border="false" :left-click="handleLeft" @right-click="handlerFilter">
      <div slot="title">
        <v-tab-bar type="btn" :data="[{name:'服务库',id:0},{name:'商品库',id:1}]" v-model="active" style="background:#f8f8f8"></v-tab-bar>
      </div>
    </v-header>
    <div v-show="!loadReady">
      <v-br height="60"></v-br>
      <img v-for="i in 10" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMTA4MCAyNjEiPjxkZWZzPjxwYXRoIGlkPSJiIiBkPSJNMCAwaDEwODB2MjYwSDB6Ii8+PGZpbHRlciBpZD0iYSIgd2lkdGg9IjIwMCUiIGhlaWdodD0iMjAwJSIgeD0iLTUwJSIgeT0iLTUwJSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij48ZmVPZmZzZXQgZHk9Ii0xIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+PGZlQ29sb3JNYXRyaXggaW49InNoYWRvd09mZnNldE91dGVyMSIgdmFsdWVzPSIwIDAgMCAwIDAuOTMzMzMzMzMzIDAgMCAwIDAgMC45MzMzMzMzMzMgMCAwIDAgMCAwLjkzMzMzMzMzMyAwIDAgMCAxIDAiLz48L2ZpbHRlcj48L2RlZnM+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDEpIj48dXNlIGZpbGw9IiMwMDAiIGZpbHRlcj0idXJsKCNhKSIgeGxpbms6aHJlZj0iI2IiLz48dXNlIGZpbGw9IiNGRkYiIHhsaW5rOmhyZWY9IiNiIi8+PHBhdGggZmlsbD0iI0Y2RjZGNiIgZD0iTTIzMCA0NGg1MzN2NDZIMjMweiIvPjxyZWN0IHdpZHRoPSIxNzIiIGhlaWdodD0iMTcyIiB4PSIzMCIgeT0iNDQiIGZpbGw9IiNGNkY2RjYiIHJ4PSI0Ii8+PHBhdGggZmlsbD0iI0Y2RjZGNiIgZD0iTTIzMCAxMThoMzY5djMwSDIzMHpNMjMwIDE4MmgzMjN2MzBIMjMwek04MTIgMTE1aDIzOHYzOUg4MTJ6TTgwOCAxODRoMjQydjMwSDgwOHpNOTE3IDQ4aDEzM3YzN0g5MTd6Ii8+PC9nPjwvc3ZnPg==">
    </div>
    <div class="goods-box" v-show="loadReady">
      <div>
        <v-search v-model="keywords" :placeholder="active==1?'编码/名称/品牌':'编码/名称'" style="margin:0;"></v-search>
      </div>
      <div class="cb-sclect">
        <div class="cb-sclect-item" @click="useShow=true">{{currentUseType.name}}
          <v-icon name="icon-iconfontarrows"></v-icon>
        </div>
        <div class="cb-sclect-item" @click="storeShow=true">{{currentStore.name}}
          <v-icon name="icon-iconfontarrows"></v-icon>
        </div>
      </div>
      <v-fad-button @click.native="addNewGoods"></v-fad-button>
      <keep-alive>
        <choice-service v-if="active==0" :keywords="keywords" :srcType="srcType" :statusType="statusType" :orderByType="orderByType" @choice-sku="choiceSku"></choice-service>
        <choice-goods v-if="active==1" :keywords="keywords" :srcType="srcType" :statusType="statusType" :orderByType="orderByType" @choice-sku="choiceSku"></choice-goods>
      </keep-alive>
    </div>
    <!-- 筛选 -->
    <van-popup v-model="filterVisiable " position="right " style="width:80%;height:100%; ">
      <v-popup-title @close="filterVisiable=false "></v-popup-title>
      <div class="popup-innerbox " style="padding:10px ">
        <div class="filter-title ">来源</div>
        <van-row gutter="20">
          <van-col span="8" v-for="(item) in filterItem" :key="item.name" @click.native="changeStore(item)" style="margin-bottom:20px; ">
            <v-button :type="item.srcType==srcType?'primary-solid':''">{{item.name}} </v-button>
          </van-col>
        </van-row>
        <div class="filter-title ">销售状态
        </div>
        <van-row gutter="20 ">
          <van-col span="8 " v-for="(item) in filterStatus " :key="item.name " @click.native="changeStatus(item)" style="margin-bottom:20px; ">
            <v-button :type="item.statusType==statusType?'primary-solid':''">{{item.name}} </v-button>
          </van-col>
        </van-row>
      </div>
      <v-footer>
        <v-footer-item class="footer-white" @click.native="handleShuRest ">重置</v-footer-item>
        <v-footer-item @click.native="filterVisiable=false ">确定</v-footer-item>
      </v-footer>
    </van-popup>
    <van-actionsheet class="cb-actionsheet" v-model="storeShow" :actions="actions" cancel-text="取消" @select="onSelect" @cancel="onCancel" />
    <van-actionsheet class="cb-actionsheet" v-model="useShow" :actions="useActions" cancel-text="取消" @select="onSelectUse" @cancel="onCancelUse" />
  </div>
</template>

<script>
import ChoiceGoods from './ChoiceGoods'
import ChoiceService from './ChoiceService'
export default {
  name: 'service',
  components: {
    ChoiceGoods,
    ChoiceService
  },
  data() {
    return {
      loadReady: false,
      actions: [
        {
          name: '全部库',
          id: null
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
      storeShow: false,
      active: 0,
      order: false,
      filterVisiable: false,
      filterItem: [
        { name: '全部', srcType: null },
        { name: '店铺库', srcType: '1' },
        { name: '系统库', srcType: '0' }
      ],
      filterStatus: [
        {
          name: '全部',
          statusType: ''
        },
        {
          name: '在售',
          statusType: 1
        },
        {
          name: '停售',
          statusType: 2
        }
      ],
      srcType: null,

      keywords: '',
      currGoods: null, // 当前要查sku的商品
      currSku: '', // 当前操作的sku
      skuData: [],
      timer: 0,
      skuToTitle: false
    }
  },
  computed: {
    storeStatus() {
      // 当前是服务 还是商品判断
      return this.$store.state.order.storeStatus
    },
    shopCar() {
      return this.$store.state.order.shopCar
    },
    okCart() {
      return this.$store.getters.okCart
    }
  },
  methods: {
    /* 搜索相关操作 s */
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
    handleLeft() {
      this.$router.replace('/index')
    },
    changeStore(item) {
      this.srcType = item.srcType
    },
    changeStatus(item) {
      this.statusType = item.statusType
    },
    handleShuRest() {
      this.srcType = null
      this.statusType = ''
    },
    handlerFilter() {
      this.filterVisiable = true
    },
    switchPath(index) {
      this.$store.commit('STORE_STATUS', index)
    },
    async choiceSku(goods) {
      this.$router.push({
        name: 'GoodsDetail',
        // query 传递true和false的时候，第一次是布尔值，页面刷新就变成String了，所以直接用String
        query: {
          id: goods.id,
          isGoods: this.active === 1 ? 'true' : 'false'
        }
      })
    },
    addNewGoods() {
      if (this.active === 0) {
        this.$router.push({
          name: 'AddGoods',
          query: { gasType: '2', src: 'ServiceAdd' }
        })
      } else {
        this.$router.push({
          name: 'AddGoods',
          query: { gasType: '1', src: 'ServiceAdd' }
        })
      }
    }
  },
  mounted() {
    this.loadReady = true
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  activated() {
    if (this.$route.params.order) {
      this.order = this.$route.params.order
    }
    if (this.$route.query.cardId) {
      this.cardId = this.$route.query.cardId
      this.cardType = this.$route.query.cardType
    } else {
      this.cardId = ''
      this.cardType = ''
    }
  }
}
</script>
<style lang="less">
</style>
