<template>
  <div class="search">
    <v-header title="搜索" border="false">
    </v-header>
    <v-search v-model="keywords" autofocus placeholder="客户名/手机号"></v-search>
    <div class="c-scroll-wrapper-top-search">
      <cube-scroll ref="scroll" :options="options" :data="searchResult" @pulling-up="onPullingUp" @pulling-down="onPullingDown">
        <div class="search-result-list">
          <div class="search-resault-list-item" v-show='newCustom' @click="handleNew">
            <span>{{keywords |telFormat()}}</span>
            <v-button type="danger" style="width:60px;float:right;margin-top:7px">新客户</v-button>
          </div>
          <p v-show="tip" class="search-other-tip">
            <span v-highlight="keywords">{{keywords}}</span>请输入正确的手机号。</p>
          <div v-if="searchResult">
            <search-item :data="searchResult" @click="handleItem" :keywords="keywords" />
          </div>
        </div>
      </cube-scroll>
    </div>
  </div>
</template>
<script>
import SearchItem from './SearchItem'
import scroll from '../../common/mixins/scroll.js'
export default {
  components: {
    SearchItem
  },
  mixins: [scroll],
  data() {
    return {
      searchResult: [],
      keywords: '',
      query: {
        pageNo: 1,
        pageSize: 18,
        'searchParameter.keyWord': ''
      },
      options: {
        pullDownLoad: false
      },
      totalPage: 0,
      newCustom: false,
      timer: null
    }
  },
  watch: {
    keywords: {
      handler(val) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.query['searchParameter.keyWord'] = val
          this.query.pageNo = 1
          this.$refs.scroll.scrollTo(0, 0)
        }, 500)
        this.noData = false
      }
    },
    searchResult: {
      handler(val) {
        /*
        场景1 车牌号
        场景1.1 车牌号小于6位 有结果
        场景1.2 车牌号小于6位 无结果
        场景1.3 车牌号大于6位 有结果
        场景1.4 车牌号大于6位 无结果
        场景2 手机号
        场景2.1 手机号小于11位 有结果
        场景2.2 手机号小于11位 无结果
        场景2.2 手机号等于11位 有结果
        场景2.3 手机号等于11位 无结果
        场景3 其他 如客户名
        场景3.1 有结果
        场景3.2 无结果
        */
        // if (this.active === 1) {
        // 手机号
        if (
          Number.isInteger(Number(val)) &&
          this.keywords.length < 11 &&
          this.searchResult.length === 0
        ) {
          // this.tip = true // 提示输入完整的手机号
          this.newCustom = false
        } else if (
          // 完整手机号无结果
          Number.isInteger(Number(val)) &&
          this.keywords.length === 11 &&
          this.searchResult.length === 0
        ) {
          this.newCustom = true
          // this.tip = false
        } else {
          // 完整手机号有结果 或其他查询
          this.newCustom = false
        }
        // }
        if (this.searchResult.length === 0 && this.keywords.length !== 11) {
          this.tip = true
        } else {
          this.tip = false
        }
      }
    }
  },
  methods: {
    handleItem(item) {
      // TIP: 判断路由过来的值 如果是主页 进详情 如果是开单返回开单
      let src = this.$route.params.src
      // 判断id
      let id = item.member ? item.member.id : item.motor ? item.motor.id : ''
      if (!id) return

      if (src === 'index') {
        this.$router.replace({
          name: 'Detail',
          params: {
            id: id
          }
        })
      } else {
        // TIP: 设置当前用户的值
        let data = item.member
        if (item.motor) {
          data.motor = item.motor
        }
        this.$store.commit('ORDER_OF_CUSTOM', data)
        this.$router.back()
      }
    },
    handleNew() {
      // TIP:新 客户并号码过去
      this.$store.commit('NEW_CUSTOM_TEL', this.keywords)
      this.$router.back()
    },
    async getData() {
      let res = await this.$api.FIND_CUSTOM(this.query)
      if (res.status === 1) {
        if (this.query.pageNo === 1) {
          this.searchResult = res.page.list || []
        } else {
          this.searchResult = this.searchResult.concat(res.page.list || [])
        }
        this.totalPage = res.page.totalPage
      } else {
        console.error('搜索出错')
      }
    }
  },
  activated() {
    this.getData()
    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 500)
    })
    this.keywords = ''
  }
}
</script>
