<template>
  <div class="search">
    <v-header title="搜索" :border="false">
    </v-header>
    <v-search v-model="keywords" autofocus placeholder="车牌号/手机号/客户名"></v-search>
    <div class="c-scroll-wrapper-top-search">
      <cube-scroll ref="scroll" :options="options" :data="searchResult" @pulling-up="onPullingUp" @pulling-down="onPullingDown">
        <div class="search-result-list">
          <!-- <div class="search-resault-list-item" v-show='newCustom' @click="handleNew">
            {{keywords}}
            <v-button type="danger" style="width:60px;float:right;margin-top:7px">新客户</v-button>
          </div> -->
          <p v-show="tip" class="search-other-tip">
            未找到“
            <span style="color:red">{{keywords}}</span>”</p>
          <search-item :data="searchResult" @click="handleItem" :keywords="keywords" />
        </div>
      </cube-scroll>
    </div>
    <!-- <v-keyboard ref="pay" :is-show='isShow' @enter-end='enterEnd' @close='isShow=false'></v-keyboard> -->
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
      carId: [],
      isShow: false,
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
    carId: {
      handler(val) {
        this.keywords = val.join('')
      }
    },
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
        if (
          Number.isInteger(Number(val)) &&
          this.keywords.length < 11 &&
          this.searchResult.length === 0 &&
          this.keywords.length !== 0
        ) {
          this.tip = true // 提示输入完整的手机号
          this.newCustom = false
        } else if (
          // 完整手机号无结果
          Number.isInteger(Number(val)) &&
          this.keywords.length === 11 &&
          this.searchResult.length === 0
        ) {
          this.newCustom = true
          this.tip = false
        } else {
          // 完整手机号有结果 或其他查询
          this.newCustom = false
        }
        // }
        if (this.searchResult.length === 0 && this.keywords.length !== 11 && this.keywords.length !== 0) {
          this.tip = true
        } else {
          this.tip = false
        }
      }
    }
  },
  computed: {
    returnDataFlag() {
      return this.query['searchParameter.keyWord'] === '' ? 0 : 1
    }
  },
  methods: {
    handleItem(item) {
      // TIP: 判断路由过来的值 如果是主页 进详情 如果是开单返回开单
      let src = this.$route.params.src
      // 判断id
      let id = item.member ? item.member.id : ''
      let carid = item.motor ? item.motor.id : ''
      if (!id && !carid) return

      if (src === 'index') {
        if (id) {
          this.$router.replace({
            name: 'Detail',
            query: {
              id: id
            }
          })
        } else {
          this.$router.replace({
            name: 'Detail',
            query: {
              carid: carid
            }
          })
        }
      } else {
        // TIP: 设置当前用户的值
        this.$store.commit('ORDER_OF_CUSTOM', item.member)
        this.$router.back()
      }
    },
    handleNew() {
      // TIP:新 客户并号码过去
      this.$store.commit('NEW_CUSTOM_TEL', this.keywords)
      this.$router.back()
    },
    enterEnd(val) {
      this.carId = val
    },
    async getData() {
      let res = await this.$api.SEARCH_LIST({
        ...this.query,
        returnDataFlag: this.returnDataFlag
      })
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
  mounted() {},
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
