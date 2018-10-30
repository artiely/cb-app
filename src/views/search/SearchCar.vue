<template>
  <div class="search">
    <v-header title="搜索">
    </v-header>
    <div class="search--box">
      <v-tab-bar :data="tabData" @tab-change="tabChange" v-model="active"></v-tab-bar>
      <v-search v-model="keywords" autofocus placeholder="车牌号/客户名/手机号" v-show="active==1" style="margin-top:0px"></v-search>
      <v-cell-group style="padding:5px 0;margin-top:-1px;" v-show="active==0" @click="isShow=true">
        <v-licence v-model="carId"></v-licence>
      </v-cell-group>
    </div>
      <v-scroll-page top="131">
      <cube-scroll ref="scroll" :options="options" :data="searchResult" @pulling-up="onPullingUp" @pulling-down="onPullingDown">
        <div class="search-result-list">
          <div class="search-resault-list-item" v-show='newCustom' @click="handleNew">
            <span v-if="active==1">{{keywords |telFormat()}}</span>
            <span v-else>{{keywords | carIdFormat()}}</span>
            <v-button type="danger" style="width:60px;float:right;margin-top:7px">
              <span v-if="active==1">新客户</span>
              <span v-else>新车辆</span>
            </v-button>
          </div>
          <p v-show="tip&&active==1" class="search-other-tip">
            <span v-highlight="keywords">{{keywords}}</span> 请输入正确的手机号。</p>
          <p v-show="tip&&active==0" class="search-other-tip">
            <span v-highlight="keywords">{{keywords}}</span> 请输入正确的车牌号。</p>
          <search-item :data="searchResult" @click="handleItem" :keywords="keywords" />
        </div>
      </cube-scroll>
      </v-scroll-page>
    <v-keyboard :is-show.sync='isShow' v-model="carId" v-show="active==0"></v-keyboard>
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
      tabData: [{ name: '按车牌', id: 0 }, { name: '按客户', id: 1 }],
      active: 0,
      carId: [],
      isShow: true,
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
    query: {
      handler() {
        if (this.active === 0) {
          this.getDataCar()
        } else {
          this.getData()
        }
      },
      deep: true,
      immediate: true
    },
    active: {
      handler(val) {
        this.keywords = ''
        this.carId = []
        this.query.pageNo = 1
        this.noData = false
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
        if (this.active === 1) {
          // 手机号
          if (
            Number.isInteger(Number(val)) &&
            this.keywords.length < 11 &&
            this.searchResult.length === 0
          ) {
            this.newCustom = false
          } else if (
            // 完整手机号无结果
            Number.isInteger(Number(val)) &&
            this.keywords.length === 11 &&
            this.searchResult.length === 0
          ) {
            this.newCustom = true
          } else {
            // 完整手机号有结果 或其他查询
            this.newCustom = false
          }
          if (this.searchResult.length === 0 && this.keywords.length !== 11) {
            this.tip = true
          } else {
            this.tip = false
          }
        } else {
          // 车牌
          if (this.keywords.length < 7 && this.searchResult.length === 0) {
            // this.tip = true
            this.newCustom = false
          } else if (
            this.keywords.length >= 7 &&
            this.searchResult.length === 0
          ) {
            // 场景1.4 车牌号大于7位 无结果
            this.newCustom = true
          } else {
            this.newCustom = false
          }
          if (this.searchResult.length === 0 && this.keywords.length < 7) {
            this.tip = true
          } else {
            this.tip = false
          }
        }
      }
    }
  },
  computed: {
    orderOfCustom() {
      return this.$store.state.order.orderOfCustom
    },
    orderOfCar() {
      return this.$store.state.order.orderOfCar
    },
    currentCard() {
      return this.$store.state.order.currentCard
    }
  },
  methods: {
    handleItem(item) {
      let userId = this.orderOfCustom
        ? this.orderOfCustom.id
        : this.orderOfCar && this.orderOfCar.member
          ? this.orderOfCar.member.id
          : ''
      if (this.active === 1) {
        // 客户
        // 当前是卡开单 并且更换了用户 （清空购物车和卡）
        if (this.currentCard && item.member.id !== userId) {
          this.$dialog
            .confirm({
              title: '确定更换开单对象吗？',
              message: '划卡开单过程中更换，已选服务/商品将清空。'
            })
            .then(() => {
              this.$store.dispatch('clearShopCar').then(() => {
                // 清空卡
                this.$store.commit('CLEAR_CURRENT_CARD')
                if (item.motor && item.motor.id) {
                  let data = item.motor
                  data.member = item.member
                  this.$store.commit('ORDER_OF_CAR', data)
                } else {
                  let data = item.member
                  data.motor = item.motor
                  this.$store.commit('ORDER_OF_CUSTOM', data)
                }
                this.$router.back()
              })
            })
            .catch(() => {})
        } else {
          // 客户可能有车
          if (item.motor && item.motor.id) {
            let data = item.motor
            data.member = item.member
            this.$store.commit('ORDER_OF_CAR', data)
          } else {
            let data = item.member
            data.motor = item.motor
            this.$store.commit('ORDER_OF_CUSTOM', data)
          }
          this.$router.back()
        }
      } else {
        // 车辆一定有车
        if (this.currentCard && item.member.id !== userId) {
          this.$dialog
            .confirm({
              title: '确定更换开单对象吗？',
              message: '划卡开单过程中更换，已选服务/商品将清空。'
            })
            .then(() => {
              this.$store.dispatch('clearShopCar').then(() => {
                // 清空卡
                this.$store.commit('CLEAR_CURRENT_CARD')
                let data = item.motor
                data.member = item.member
                this.$store.commit('ORDER_OF_CAR', data)
                this.$router.back()
              })
            })
            .catch(() => {})
        } else {
          let data = item.motor
          data.member = item.member
          this.$store.commit('ORDER_OF_CAR', data)
          this.$router.back()
        }
      }
    },
    handleNew() {
      // TIP:新 客户并号码/车牌号 过去
      let userId = this.orderOfCustom
        ? this.orderOfCustom.id
        : this.orderOfCar && this.orderOfCar.member
          ? this.orderOfCar.member.id
          : ''
      if (this.active === 0) {
        // 之前有划卡开单的操作就得清空
        if (this.currentCard && userId) {
          this.$dialog
            .confirm({
              title: '确定更换开单对象吗？',
              message: '划卡开单过程中更换，已选服务/商品将清空。'
            })
            .then(() => {
              this.$store.dispatch('clearShopCar').then(() => {
                // 清空卡
                this.$store.commit('CLEAR_CURRENT_CARD')
                this.$store.commit('NEW_CUSTOM_CAR', this.keywords)
                this.$router.back()
              })
            })
            .catch(() => {})
        } else {
          this.$store.commit('NEW_CUSTOM_CAR', this.keywords)
          this.$router.back()
        }
      } else {
        if (this.currentCard && userId) {
          this.$dialog
            .confirm({
              title: '确定更换开单对象吗？',
              message: '划卡开单过程中更换，已选服务/商品将清空。'
            })
            .then(() => {
              this.$store.dispatch('clearShopCar').then(() => {
                // 清空卡
                this.$store.commit('CLEAR_CURRENT_CARD')
                this.$store.commit('NEW_CUSTOM_TEL', this.keywords)
                this.$router.back()
              })
            })
            .catch(() => {})
        } else {
          this.$store.commit('NEW_CUSTOM_TEL', this.keywords)
          this.$router.back()
        }
      }
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
    },
    async getDataCar() {
      let res = await this.$api.FIND_CAR(this.query)
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
    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 500)
    })
    this.keywords = ''
  },
  mounted() {}
}
</script>
