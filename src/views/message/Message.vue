<template>
  <div>
    <v-header title="消息中心"></v-header>
    <!-- <v-tab-bar :data="tabData" style="margin-top:40px;"></v-tab-bar> -->
    <div class="c-scroll-wrapper-top">
      <cube-scroll  ref="scroll" :data="data" @pulling-up="onPullingUp" :options="options" @pulling-down="onPullingDown">
        <v-br></v-br>
        <div v-if="data.length>0">
        <card-msg @click.native="toDetail(item)" v-for="item in data" :key="item.id" :data="item"></card-msg>
        </div>
        <v-nodata v-else></v-nodata>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
import CardMsg from './CardMsg'
import scroll from '../../common/mixins/scroll.js'
export default {
  components: {
    CardMsg
  },
  mixins: [scroll],
  data() {
    return {
      tabData: [{ name: '通知', id: 0 }, { name: '消息', id: 1 }],
      query: {
        'storeMessage.isRead': '0',
        pageNo: 1,
        pageSize: 10
      },
      // noData: false,
      totalPage: 0,
      // options: {
      //   pullUpLoad: {
      //     threshold: 0
      //   },
      //   pullDownRefresh: {
      //     txt: '刷新成功'
      //   }
      // },
      data: []
    }
  },
  watch: {
    query: {
      handler(val) {
        if (val.pageNo === 1) {
          this.$refs.scroll.scrollTo(0, 0)
        }
        this.getData()
        this.noData = false
      },
      deep: true
    }
  },
  computed: {
    data() {
      return this.$store.state.sys.messages
    }
  },
  methods: {
    async getData() {
      let res = await this.$api.MSG_LIST(this.query)
      if (res.status === 1) {
        if (this.query.pageNo === 1) {
          this.data = res.page.list || []
        } else {
          this.data = this.data.concat(res.page.list || [])
        }
        this.totalPage = res.page.totalPage
      } else {
        console.error('获取消息失败')
      }
    },
    // onPullingUp() {
    //   if (this.query.pageNo < this.totalPage) {
    //     this.query.pageNo++
    //   } else {
    //     this.$refs.scroll.forceUpdate()
    //     this.noData = true
    //   }
    // },
    // onPullingDown() {
    //   if (this.query.pageNo === 1) {
    //     this.getData()
    //   } else {
    //     this.query.pageNo = 1
    //   }
    // },
    toDetail(item) {
      this.$router.push({ name: 'MessageDetail', params: { data: item } })
      this.$api.READ_MSG({ id: item.id })
    }
  },
  activated() {
    this.getData()
  }
}
</script>


