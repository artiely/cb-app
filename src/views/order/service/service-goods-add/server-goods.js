import scroll from '../../../../common/mixins/scroll.js'
export default {
  mixins: [scroll],
  props: {
    keywords: {
      type: String
    },
    statusType: String,
    orderByType: String,
    srcType: String,
    active: [String, Number]
  },
  data() {
    return {
      query: {
        pageNo: 1,
        pageSize: 10,
        'searchParameter.keyWord': '',
        'serverCategory.id': '',
        'goodsCategory.id': '',
        dataSrc: null,
        status: '',
        orderByType: '1',
        'page.orderBy': ''
      },
      serviceList: [], // 服务列表
      totalPage: 0,
      options: {
        pullDownRefresh: false
      },
      categoryId: '',
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
  methods: {
    searchService(item) {
      this.$refs.scroll.scrollTo(0, 0)
      this.noData = false
      this.query['pageNo'] = 1
      this.query['serverCategory.id'] = item.id
      this.query['goodsCategory.id'] = item.id
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
    this.refresh = false // 默认不刷新
    if (this.$route.params.refresh) {
      this.getData()
    }
  }
}
