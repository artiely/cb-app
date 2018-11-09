// scroll mixins
export default {
  data() {
    return {
      noData: false,
      options: {
        pullUpLoad: {
          threshold: 0,
          txt: {
            more: '加载中',
            noMore: '没有啦'
          }
        },
        pullDownRefresh: {
          threshold: 70,
          txt: '刷新成功'
        }
      }
    }
  },
  watch: {
    query: {
      handler(val, oval) {
        if (val.pageNo === 1) {
          this.$refs.scroll.scrollTo(0, 0)
        }
        // 约定请求数据的方法名为getData()
        this.getData()
      },
      deep: true
    }
  },
  methods: {
    onPullingUp() { // 上拉加载
      if (this.query['pageNo'] < this.totalPage) {
        this.query['pageNo']++
      } else {
        this.$refs.scroll.forceUpdate()
        this.noData = true
      }
    },
    onPullingDown() { // 下拉刷新
      if (this.query.pageNo === 1) {
        this.getData()
      } else {
        this.query.pageNo = 1
      }
      // this.getTagList()
    }
  },
  activated() {
    this.$refs.scroll && this.$refs.scroll.refresh()
  }
}
