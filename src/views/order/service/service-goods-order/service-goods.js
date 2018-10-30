// scroll mixins
export default {
  props: {
    keywords: {
      type: String
    },
    active: [String, Number],
    orderByType: String,
    statusType: String,
    srcType: String
  },
  data() {
    return {
      //   多规格的显示模态
      skuVisiable: false,
      rerviceNav: [], // 菜单
      // 查询条件
      query: {
        pageNo: 1,
        pageSize: 10,
        'searchParameter.keyWord': '',
        'serverCategory.id': '',
        'goodsCategory.id': '',
        dataSrc: null,
        status: '1',
        orderByType: '1',
        'page.orderBy': ''
      },
      serviceList: [], // 服务列表
      totalPage: 0,
      skuData: [],
      options: {
        pullDownRefresh: false
      },
      currGoods: '',
      categoryId: 0,
      timer: null
    }
  },
  watch: {
    keywords: {
      handler(nval, oval) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.query['searchParameter.keyWord'] = nval
          this.query.pageNo = 1
        }, 500)
      },
      immediate: true
    },
    active: {
      handler() {
        this.getData()
      }
    },
    orderByType: {
      handler(val) {
        this.query.orderByType = val
      },
      immediate: true
    },
    shopCar: {
      handler() {
        this.watchChoice()
      },
      deep: true,
      immediate: true
    },
    statusType: {
      handler(val) {
        this.query.status = val
        this.query.pageNo = 1
      },
      immediate: true
    },
    srcType: {
      handler(val) {
        this.query.dataSrc = val
        this.query.pageNo = 1
      },
      immediate: true
    }
  },
  computed: {
    desc() {
      let brand =
        this.currGoods && this.currGoods.goodsBrand ? this.currGoods.goodsBrand.name : ''
      let code =
        this.currGoods && this.currGoods.code ? this.currGoods.code : ''
      return `品牌：${brand}  编码：${code}`
    },

    shopCar() {
      return this.$store.state.order.shopCar
    },
    cardType() {
      return this.$store.state.card.cardType
    }
  },
  methods: {
    watchChoice() {
      if (this.shopCar.length >= 1) {
        this.shopCar.map((v, index) => {
          // 循环出商品下的sku与购物车对比 id相等就返回对应的index index!=-1就是存在 设置checked=true
          this.serviceList.map((goods, eq) => {
            goods.count = 0
            let goodsSkuList = goods.serverSkus ? goods.serverSkus : goods.goodsSkus ? goods.goodsSkus : []
            goodsSkuList.map((sku, i) => {
              function findHasSkuIndex(element) {
                return element.id === sku.id
              }
              let _skuIndex = this.shopCar.findIndex(findHasSkuIndex)
              if (v.id === sku.id) {
                sku.count = v.count
              }
              // 存在就让商品的count+1(统计该商品下的已选sku)
              if (_skuIndex !== -1 && sku.count !== 0) {
                goods.count++
              }
              this.$set(this.serviceList, eq, goods)
            })
          })
        })
      } else {
        console.log('购物车没有商品了')
        // 如果sku被清空为0的时候 重置一切
        this.serviceList.map((goods, eq) => {
          let goodsSkuList = goods.serverSkus ? goods.serverSkus : goods.goodsSkus ? goods.goodsSkus : []
          goodsSkuList.map((sku, i) => {
            goods.count = 0
            sku.count = 0
          })
          this.$set(this.serviceList, eq, goods)
          console.log(this.serviceList, eq, goods)
        })
      }
    },
    searchService(item) {
      this.$refs.scroll.scrollTo(0, 0)
      this.noData = false
      this.query['pageNo'] = 1
      this.query['serverCategory.id'] = item.id
      this.query['goodsCategory.id'] = item.id
    },
    mixins_showSku(item, type) {
      this.currGoods = item
      this.skuData = item.goodsSkus ? item.goodsSkus : item.serverSkus ? item.serverSkus : []
      this.skuVisiable = true
    },
    cut(params) {
      /**
       * params
       * sku的数据
       */
      this.$store.commit('CUT_SHOP_CAR', {
        id: params.sku.id
      })
    },
    add(params) {
      /**
       * add params
       * {goods} Object 商品和服务对象
       * {sku} Object 商品和服务的sku
       * {gasType} String 1商品2服务
       */
      this.$store.commit('ADD_SHOP_CAR', {
        gasName: params.goods.name,
        gasBrand: params.goods.goodsBrand ? params.goods.goodsBrand.name : '',
        unit: params.goods.unit ? params.goods.unit : '',
        code: params.goods.code ? params.goods.code : '',
        gasId: params.goods.id,
        gasType: params.gasType,
        ...params.sku
      })
    }
  },
  created() {
    this.getNav()
    this.getData()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  activated() {
    this.$nextTick(() => {
      this.$refs.scroll.refresh()
    })
    // this.refresh = false // 默认不刷新
    // if (this.$route.params.refresh) {
    //   this.getData()
    // }
    this.getData()
  }
}
