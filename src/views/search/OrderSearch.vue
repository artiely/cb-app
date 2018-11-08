<template>
  <div class="search">
    <!-- :righttext="src=='kaidan'?'跳过':''" @right-click="toOrder" -->
    <v-header title="选择客户/车辆" :border="false" :left-click="handleLeft">
    </v-header>
    <v-search v-model="keywords" autofocus placeholder="车牌号/客户名/手机号"></v-search>
    <div class="c-scroll-wrapper-top-search">
      <cube-scroll ref="scroll" :options="options" :data="searchResult" @pulling-up="onPullingUp" @pulling-down="onPullingDown">
        <!-- <v-br height="20"></v-br>
        <div class="search-result-list">
          <p v-show="tip" class="search-other-tip">
            未找到“
            <span style="color:red">{{keywords}}</span>”</p>
          <search-item :data="searchResult" @click="handleItem" :keywords="keywords" :isCustomMode="isCustomMode"/>
        </div> -->
        <div v-if="searchResult.length>0">
          <div>
            <div class="custom-result-list" :class="{'disabled':isCustomMode&&!item.member}" v-for="(item,index) in searchResult" :key="index">
              <div slot="text">
                <div class="custom-result-item" @click="handleItem(item)">
                  <div class="custom-result-icon">
                    <img :src="baseUrl+item.motor.motorBrand.logo" v-if="item.motor&&item.motor.motorBrand&&item.motor.motorBrand.logo" alt="">
                    <v-icon name="icon-morencheliang"></v-icon>
                  </div>
                  <div class="custom-result-info">
                    <div class="custom-result-info-idcard" v-if="item.motor">{{item.motor.licence|carIdFormat()}}</div>
                    <div v-else class="custom-result-nodata">—</div>
                    <div class="custom-result-info-userinfo" v-if="item.member">{{item.member.username|telFormat()}} {{item.member.name}}
                      <v-badge type="储值卡" v-if="item.accountMoney>0">储</v-badge>
                      <v-badge v-if="item.discountCardNum>0" type="折扣卡">折</v-badge>
                      <v-badge v-if="item.packageCardNum>0" type="次卡">次</v-badge>
                    </div>
                    <div v-else class="custom-result-nodata" style="padding-top:8px">—</div>
                  </div>
                  <!-- <div class="custom-list-more">
                    <span class="custom-result-more-ps tap-area" @click="more(item,index)">
                      <v-icon name="icon-gengduo"></v-icon>
                    </span>
                  </div> -->
                </div>
                <!-- <div class="cus-result-mark" :class="{'cus-result-mark-show':item.markShow}">
                  <div class="c-order-btn-group">
                    <div class="c-order-btn-cell">
                      <div class="c-order-btn" style="line-height:1;padding-top:10px;" @click="toOrder(item)">
                        开单<br>划卡
                      </div>
                    </div>
                    <div class="c-order-btn-cell">
                      <div class="c-order-btn" @click="fastOrder(item)">快单</div>
                    </div>
                    <div class="c-order-btn-cell">
                      <div class="c-order-btn" @click="chargeActive(item)" :class="item.member?'':'disabled'">充值</div>
                    </div>
                    <div class="c-order-btn-cell">
                      <div class="c-order-btn" @click="chargeCard(item,index)" :class="item.member?'':'disabled'">办卡</div>
                    </div>
                  </div>
                  <span class="custom-result-more-ps tap-area" @click="moreHide(item)">
                    <v-icon name="icon-gengduo"></v-icon>
                  </span>
                </div> -->
              </div>
            </div>
          </div>
        </div>
        <v-nodata v-else :placeholder="placeholder" hasadd="1"></v-nodata>
      </cube-scroll>
    </div>
    <v-fad-button @click.native="handleRight"></v-fad-button>
    <!-- <div class="order-first" v-if="src=='kaidan'" @click="toOrder">跳 过</div> -->
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
      isCustomMode: true,
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
      timer: null,
      src: 'kaidan',
      placeholder: '无客户/车辆，点击新增'
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
        if (this.searchResult.length === 0 && this.keywords.length !== 0) {
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
    },
    baseUrl() {
      return this.$store.state.sys.chebianSaticBrandUrl
    }
  },
  methods: {
    handleRight() {
      let id = null
      if (this.$route.query.id) {
        id = this.$route.query.id
      }
      this.$router.push({
        name: 'NewCusAddCar',
        query: { src: this.src, id: id }
      })
    },
    handleItem(item) {
      if (this.isCustomMode && !item.member) {
        this.$toast('仅车辆不可充值/办卡')
        return
      }
      let id = item.member ? item.member.id : ''
      let carid = item.motor ? item.motor.id : ''
      if (!id && !carid) return
      let data = null
      if (item.member && item.motor) {
        data = item.member
        data.motor = item.motor
        this.$store.commit('ORDER_OF_CUSTOM', data)
      } else if (item.member) {
        data = item.member
        this.$store.commit('ORDER_OF_CUSTOM', data)
      } else if (item.motor) {
        data = item.motor
        this.$store.commit('ORDER_OF_CAR', data)
      }
      let cardId = null
      if (this.$route.query.id) {
        cardId = this.$route.query.id
      }
      if (this.src === 'kaidan') {
        this.$router.replace({
          name: 'Kaidan',
          params: {src: 'index'}
        })
      } else if (this.src === 'kuaidan') {
        this.$router.replace({
          name: 'CashDesk'
        })
      } else if (this.src === 'chargeactive') {
        this.$router.replace({
          name: 'ChargeActive',
          query: { id: cardId }
        })
      } else if (this.src === 'chargeticket') {
        this.$router.replace({
          name: 'ChargeTicket',
          query: { id: cardId }
        })
      }
    },
    toOrder() {
      if (this.src !== 'kaidan') return
      this.$router.replace({
        name: 'Kaidan'
      })
    },
    handleLeft() {
      this.query['searchParameter.keyWord'] = ''
      this.query['pageNo'] = 1
      this.searchResult = []
      this.$router.back()
    },
    async getData() {
      let res = await this.$api.SEARCH_LIST({
        ...this.query
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
    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 500)
    })
    this.keywords = ''
    if (this.$route.query.src) {
      this.src = this.$route.query.src
    }
    if (this.src === 'kaidan' || this.src === 'kuaidan') {
      this.isCustomMode = false
    } else {
      this.isCustomMode = true
    }
    this.getData()
  }
}
</script>
<style>
.search {
  background: #e8e8e8;
}
.order-first {
  text-align: center;
  height: 60px;
  font-size: 18px;
  color: #1690ff;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #e8e8e8;
}
</style>
