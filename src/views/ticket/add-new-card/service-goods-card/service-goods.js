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
      }
    },
    active: {
      handler() {
        this.getData()
      }
    },
    skuList: {
      handler(val) {
        this.watchChoice()
      },
      deep: true,
      immediate: true
    },
    statusType: {
      handler(val) {
        this.query.status = val
      },
      immediate: true
    },
    orderByType: {
      handler(val) {
        this.query.orderByType = val
      },
      immediate: true
    },
    srcType: {
      handler(val) {
        this.query.dataSrc = val
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
    watchChoice() {
      if (this.skuList.length >= 1) {
        this.skuList.map((v, index) => {
          // 循环出商品下的sku与购物车对比 id相等就返回对应的index index!=-1就是存在 设置checked=true
          this.serviceList.map((goods, eq) => {
            goods.count = 0
            let goodsSkuList = goods.serverSkus ? goods.serverSkus : goods.goodsSkus ? goods.goodsSkus : []
            goodsSkuList.map((sku, i) => {
              function findHasSkuIndex(element) {
                return element.id === sku.id
              }
              let _skuIndex = this.skuList.findIndex(findHasSkuIndex)
              // 折扣卡
              if (this.cardType === '2') {
                // 商品下被选中的sku

                goodsSkuList[i].checked = _skuIndex !== -1
                // 存在就让商品的count+1(统计该商品下的已选sku)
                if (_skuIndex !== -1) {
                  goods.count++
                }
              } else {
                // 次卡
                if (v.id === sku.id) {
                  sku.count = v.count
                }
                // 存在就让商品的count+1(统计该商品下的已选sku)
                if (_skuIndex !== -1 && sku.count !== 0) {
                  goods.count++
                }
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
            sku.checked = false
          })
          this.$set(this.serviceList, eq, goods)
          console.log(this.serviceList, eq, goods)
        })
      }
    },
    mixins_choiceSku(item, type) {
      this.$store.dispatch('setSkuListCard', {
        gasName: this.currGoods.name,
        gasId: this.currGoods.id,
        gasType: type,
        unit: this.currGoods.gasType === '1' ? this.currGoods.unit : '次',
        ...item
      })
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
      if (this.skuData.length > 1) {
        this.skuVisiable = true
      } else {
        this.$store
          .dispatch('setSkuListCard', {
            gasName: item.name,
            gasId: item.id,
            gasType: type,
            ...this.skuData[0]
          })
      }
    },
    cut(item, src, type) {
      // 参数1 参数2告诉你是单个sku还是多个sku,第三个参数告诉你是商品还是服务
      if (src === 'goods') {
        let data = item.serverSkus && item.serverSkus[0] ? item.serverSkus[0] : item.goodsSkus && item.goodsSkus[0] ? item.goodsSkus[0] : []
        this.$store.commit('CUT_SKU_LIST_CARD', {
          gasName: item.name,
          gasId: item.id,
          gasType: type,
          ...data
        })
      } else {
        this.$store.commit('CUT_SKU_LIST_CARD', {
          gasName: this.currGoods.name,
          gasId: this.currGoods.id,
          gasType: type,
          ...item
        })
      }
    },
    add(item, src, type) {
      if (src === 'goods') {
        let data = item.serverSkus && item.serverSkus[0] ? item.serverSkus[0] : item.goodsSkus && item.goodsSkus[0] ? item.goodsSkus[0] : []
        this.$store.commit('ADD_SKU_LIST_CARD', {
          gasName: item.name,
          gasId: item.id,
          gasType: type,
          ...data
        })
      } else {
        this.$store.commit('ADD_SKU_LIST_CARD', {
          gasName: this.currGoods.name,
          gasId: this.currGoods.id,
          gasType: type,
          ...item
        })
      }
    },
    push(item, src, type) {
      if (src === 'goods') {
        let data = item.serverSkus && item.serverSkus[0] ? item.serverSkus[0] : item.goodsSkus && item.goodsSkus[0] ? item.goodsSkus[0] : []
        this.$store.commit('PUSH_SKU_LIST_CARD', {
          gasName: item.name,
          gasId: item.id,
          gasType: type,
          ...data
        })
      } else {
        this.$store.commit('PUSH_SKU_LIST_CARD', {
          gasName: this.currGoods.name,
          gasId: this.currGoods.id,
          gasType: type,
          ...item
        })
      }
    },
    noLimit(item, src, type) {
      if (src === 'goods') {
        let data = item.serverSkus && item.serverSkus[0] ? item.serverSkus[0] : item.goodsSkus && item.goodsSkus[0] ? item.goodsSkus[0] : []
        this.$store.commit('NOLIMIT_SKU_LIST_CARD', {
          gasName: item.name,
          gasId: item.id,
          gasType: type,
          ...data
        })
      } else {
        this.$store.commit('NOLIMIT_SKU_LIST_CARD', {
          gasName: this.currGoods.name,
          gasId: this.currGoods.id,
          gasType: type,
          ...item
        })
      }
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
    // this.watchChoice()
    this.$nextTick(() => {
      this.$refs.scroll.refresh()
    })
    this.refresh = false // 默认不刷新
    if (this.$route.params.refresh) {
      this.getData()
    }
  }
}
