<template>
  <div>
    <v-header righticon="icon-xiaotubiao-20" :border="false" @right-click="handlerFilter" :left-click="handleLeft">
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
      <v-fad-button @click.native="addNewGoods"></v-fad-button>
      <keep-alive>
        <choice-service v-if="active==0" :keywords="keywords" :srcType="srcType" :statusType="statusType" :orderByType="orderByType" :active="active"></choice-service>
        <choice-goods v-if="active==1" :keywords="keywords" :srcType="srcType" :statusType="statusType" :orderByType="orderByType" :active="active"></choice-goods>
      </keep-alive>
      <v-footer>
        <v-footer-item class="footer-white" @click.native="showShopcart=true">
          <v-icon name="icon-lujing" size="24"></v-icon>
          <v-dot :number="okCart.length"></v-dot>
        </v-footer-item>
        <v-footer-item style="flex:2" @click.native="handleChoiceOK" :style="okCart.length==0?'background:#bbb':''">
          <span v-if="okCart.length>0">选好了
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
        <cube-scroll :data="okCart" ref="scroll">
          <v-br></v-br>
          <div class="selected-sku-box" v-for="(it) in okCart" :key="it.id">
            <div class="selected-sku-item ">
              <div class="selected-sku-del tap-area" @click="delSku(it)">
                <v-icon name="icon-shanchu2"></v-icon>
              </div>
              <div class="selected-sku-main">
                <h1 class="selected-sku-goodsname textover1">{{it.gasName}}
                  <v-badge size="small" type="商" v-if="it.gasType=='1'">商</v-badge>
                  <v-badge size="small" type="服" v-else>服</v-badge>
                </h1>
                <p class="selected-sku-name"> {{it.name}}</p>
                <p class="selected-sku-price"> {{it.price|currency()}}</p>
              </div>
            </div>
            <div class="cb-card-ctrl-box">
              <div class="plus-cut-ctrl-box tap-area" v-if="it.count>0">
                <div class="ctrl-cut tap-area" @click="cut(it)">-</div>
                <div type="tel" class="ctrl-input" maxlength="7">{{it.count}}</div>
                <div class="ctrl-plus tap-area" @click="add(it)">+</div>
              </div>
              <div v-else class="plus-cut-ctrl-add">
                <div class="ctrl-plus ctrl-icon tap-area" @click="add(it)">+</div>
              </div>
            </div>
          </div>
        </cube-scroll>
      </div>
      <v-footer>
        <v-footer-item @click.native="showShopcart=false">确定</v-footer-item>
      </v-footer>
    </van-popup>
    <!-- 筛选 -->
    <van-popup v-model="filterVisiable " position="right " style="width:80%;height:100%; ">
      <v-popup-title @close="filterVisiable=false "></v-popup-title>
      <div class="popup-innerbox " style="padding:10px ">
        <div class="filter-title ">来源</div>
        <van-row gutter="10">
          <van-col span="8" v-for="(item) in filterItem" :key="item.name" @click.native="changeStore(item)">
            <v-button :type="item.srcType==srcType?'primary-solid':''">{{item.name}} </v-button>
          </van-col>
        </van-row>
        <div class="filter-title ">销售状态
        </div>
        <van-row gutter="10 ">
          <van-col span="8 " v-for="(item) in filterStatus " :key="item.name " @click.native="changeStatus(item)" style="margin-bottom:10px; ">
            <v-button :type="item.statusType==statusType?'primary-solid':''">{{item.name}} </v-button>
          </van-col>
        </van-row>
      </div>
      <v-footer>
        <v-footer-item class="footer-white" @click.native="handleShuRest">重置</v-footer-item>
        <v-footer-item @click.native="filterVisiable=false ">确定</v-footer-item>
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
      storeShow: false,
      // 0选中服务1选中商品
      active: 0,
      // 显示购物车
      showShopcart: false,
      // 关键词
      keywords: '',
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
      src: ''
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
    okCart() {
      return this.$store.getters.okCart
    },
    skuListFilter() {
      return this.$store.getters.skuListFilter
    }
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    // console.log(to,from,to.path,from.path)
    // if (from.path === '/service' && to.path !== '/addgoods') {
    //   next({path: '/kaidan'})
    // }
    next()
  },
  methods: {
    onSelect(item) {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      this.currentStore = item
      this.storeShow = false
      this.srcType = item.id
    },
    handleLeft() {
      this.$router.replace('kaidan')
    },
    addNewGoods() {
      if (this.active === 0) {
        this.$router.push({
          name: 'AddGoods',
          query: { gasType: '2', src: 'Service' }
        })
      } else {
        this.$router.push({
          name: 'AddGoods',
          query: { gasType: '1', src: 'Service' }
        })
      }
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
    changeStore(item) {
      this.srcType = item.srcType
    },
    changeStatus(item) {
      this.statusType = item.statusType
    },
    delSku(GoodsItems) {
      this.$store.commit('DEL_SHOP_CAR', GoodsItems)
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
          this.$store.commit('CLEAR_SHOP_CAR')
        })
        .catch(() => {
          // on cancel
        })
    },
    handleShuRest() {
      this.statusType = ''
      this.srcType = null
    },
    handleChoiceOK() {
      if (this.okCart.length !== 0) {
        if (this.src && this.src === 'orderTemp') {
          this.$router.replace({ name: 'TempEdit' })
        } else {
          this.$router.replace({ name: 'Kaidan' })
        }
      }
    },
    handlerFilter() {
      this.filterVisiable = true
    },
    add(item) {
      this.$store.commit('ADD_SHOP_CAR', item)
    },
    cut(item) {
      this.$store.commit('CUT_SHOP_CAR', item)
    }
  },
  mounted() {},
  activated() {
    this.handleShuRest()
    if (this.$route.query.src) {
      this.src = this.$route.query.src
    } else {
      this.src = ''
    }
  }
}
</script>
