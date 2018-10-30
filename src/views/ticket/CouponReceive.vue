<template>
  <div>
    <v-header title="券领用记录" righticon="icon-xiaotubiao-20" @right-click="handlerFilter"></v-header>
    <v-search v-model="keywords" placeholder="券名/客户/关联业务单号"></v-search>
    <v-tab-bar :data="tab" v-model="active" :count="count"></v-tab-bar>
    <div class="c-scroll-wrapper-top-search-tab">
      <cube-scroll ref="scroll" :data="couponList" @pulling-up="onPullingUp" :options="options" @pulling-down="onPullingDown">
        <filter-bar :data="filterBarList" @change-filter="changeFilter"></filter-bar>
        <div v-if="couponList.length>0">
          <div class="c-card-coupon-receive--wrapper " :key="item.id" :class="{'c-card-coupon-receive--disabled':active!==0}" v-for="item in couponList" @click="toDetail(item)">
            <div class="clearfix">
              <div class="c-card-coupon-receive--left">
                <h3 class="c-card-coupon-receive--title textover1">
                  <span>{{item.member.username | telFormat()}}</span>
                  <span v-if="item.member.name">{{item.member.name}}</span>
                </h3>
                <div class="c-card-coupon-receive--desc textover1"> {{item.temp.name}}
                  <v-badge v-if="item.temp.type==1" size="small" color="#fe4a4e">代金券</v-badge>
                  <v-badge v-else class="success" size="small" color="#01d10c">礼品券</v-badge>
                </div>
              </div>
              <div class="c-card-coupon-receive--right">
                <p class="c-card-coupon-receive--price">{{item.temp.moneyCondition|currency('￥')}}</p>
                <small class="c-card-coupon-receive--date">还有{{item.endUsableDate|timeFormatToDays}}天</small>
              </div>
            </div>
            <div class="c-card-coupon-receive--footer clearfix" v-if="active==1">
              <span class="fl">业务单号：
                <span style="color:#1690ff;text-decoration: underline">XS58558822225</span>
              </span>
              <span class="fr">使用时间：2018-12-22</span>
            </div>
          </div>
        </div>
        <v-nodata v-else></v-nodata>
      </cube-scroll>
    </div>
    <!-- 筛选 -->
    <van-popup v-model="filterVisiable" position="right" style="width:80%;height:100%;">
      <v-popup-title @close="filterVisiable=false"></v-popup-title>
      <div class="popup-innerbox" style="padding:10px">
        <div class="filter-title">券种</div>
        <van-row gutter="10">
          <van-col span="8" v-for="(item) in filterStatus" :key="item.name" @click.native="changeType(item)" style="margin-bottom:10px;">
            <v-button :type="item.id==currentCouponType.id?'primary-solid':''">{{item.name}} </v-button>
          </van-col>
        </van-row>
        <!-- <div class="filter-title">按创建时间</div>
        <v-cell title="开始" datepicker v-model="startDate"></v-cell>
        <v-cell title="截止" datepicker v-model="endDate" :mindate="startDate"></v-cell> -->
      </div>
      <v-footer>
        <v-footer-item class="footer-white" @click.native="handleShuRest">重置</v-footer-item>
        <v-footer-item @click.native="filterVisiable=false">确定</v-footer-item>
      </v-footer>
    </van-popup>
  </div>
</template>

<script>
import scroll from '../../common/mixins/scroll.js'
import FilterBar from '../../components/FilterBar'
export default {
  components: { FilterBar },
  mixins: [scroll],
  data() {
    return {
      filterVisiable: false,
      startDate: '',
      endDate: '',
      filterStatus: [
        {
          name: '全部',
          id: ''
        },
        {
          name: '代金券',
          id: 1
        },
        {
          name: '礼品券',
          id: 2
        }
      ],
      currentCouponType: 0, // 卡种
      query: {
        pageNo: 1,
        pageSize: 10,
        'temp.type': '', // 类型（1 满减 2 满赠）
        usableType: 1, // 有效类型。1：可用 2：已使用 3：已过期。 （避免和status一起查询
        'searchParameter.keyWord': '',
        'temp.id': '', // 模板id查领用记录
        'member.id': '' // 客户id查领用记录
      },
      couponList: [],
      tab: [
        { name: '未使用', id: 0 },
        { name: '已使用', id: 1 },
        { name: '已过期', id: 2 }
      ],
      active: 0,
      totalPage: 0,
      filterBarList: [],
      keywords: '',
      temp: '',
      cus: '',
      count: []
    }
  },
  computed: {
    orderOfCustom() {
      return this.$store.state.order.orderOfCustom
    },
    filter() {
      let type =
        this.currentCouponType && this.currentCouponType.id !== ''
          ? this.currentCouponType
          : null
      let temp = this.temp && this.temp.id !== '' ? this.temp : null
      let cus = this.cus && this.cus.id !== '' ? this.cus : null

      return [type, temp, cus].filter(v => {
        if (v) {
          return v
        }
      })
    }
  },
  watch: {
    filter: {
      handler(val) {
        this.filterBarList = val
      }
    },
    active: {
      handler(val) {
        this.query.pageNo = 1
        this.query.usableType = val + 1
      }
    },
    keywords: {
      handler(val) {
        this.query.pageNo = 1
        this.query['searchParameter.keyWord'] = val
      }
    },
    currentCouponType: {
      handler(val) {
        this.query['temp.type'] = val.id
      }
    },
    temp: {
      handler(val) {
        if (val) {
          this.query['temp.id'] = val.id
        } else {
          this.query['temp.id'] = ''
        }
      }
    },
    cus: {
      handler(val) {
        if (val) {
          this.query['member.id'] = val.id
        } else {
          this.query['member.id'] = ''
        }
      }
    }
  },
  methods: {
    handlerFilter() {
      this.filterVisiable = true
    },
    toDetail(item) {
      this.$router.push({
        name: 'CouponDetail',
        query: { id: item.id, fromReceive: true }
      })
    },
    async getCount() {
      let res = await this.$api.COUPON_COUNT({
        'temp.type': this.query['temp.type'],
        'temp.id': this.query['temp.id'],
        'member.id': this.query['member.id'],
        'searchParameter.keyWord': this.query['searchParameter.keyWord']
      })
      if (res.status === 1) {
        for (let i = 0; i < res.data.length; i++) {
          this.$set(this.count, i, res.data[i])
        }
      }
    },
    changeFilter(item) {
      this.filterBarList = this.filterBarList.filter(v => {
        if (item === this.currentCouponType) {
          this.currentCouponType = ''
        } else if (item === this.temp) {
          this.temp = ''
        } else if (item === this.cus) {
          this.cus = ''
        }
        if (v !== item) {
          return v
        }
      })
    },
    changeType(item) {
      this.currentCouponType = item
    },
    handleShuRest() {
      this.currentCouponType = ''
      this.startDate = ''
      this.endDate = ''
    },
    toDetal() {
      this.$router.push('/ticketdetail')
    },
    async getData() {
      let res = await this.$api.LIST_STORE_COUPON_MEMBER(this.query)
      if (res.status === 1) {
        if (this.query.pageNo === 1) {
          this.couponList = res.page.list || []
        } else {
          this.couponList = this.couponList.concat(res.page.list || [])
        }
        this.totalPage = res.page.totalPage
      } else {
        console.error('获取券失败')
      }
      this.getCount()
    }
  },
  created() {
    // HACK:第一次从客户详情来或者模板来是不走这的
    if (!this.$route.params.cus && !this.$route.params.temp) {
      this.getData()
    }
  },
  activated() {
    // TIP: 判断是否有模板id带过来
    if (this.$route.params.temp) {
      this.temp = this.$route.params.temp
    }
    if (this.$route.params.cus) {
      this.cus = this.$route.params.cus
    }
    this.$nextTick(() => {
      this.$refs.scroll.refresh()
    })
  }
}
</script>

<style lang="less">
// TIP: 样式不用修改
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';
.c-filter--box {
  padding: 5px 10px;
  .c-filter--item {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    color: @secondary-text;
    padding: 0 6px;
    text-align: center;
    background: #ffffff;
    border-radius: 4px;
    font-size: 12px;
    margin-right: 10px;
    .icon {
      font-size: 12px;
      vertical-align: 0px;
      padding: 0 4px;
      color: @secondary-text!important;
    }
  }
}

.filter-title {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color: #666;
}

.c-card-coupon-receive {
  &--wrapper {
    width: 95%;
    margin: 0 auto 10px auto;
    background: #ffffff;
    border-radius: 4px;
  }
  &--left {
    width: 100%;
    height: 100%;
    float: left;
    margin-right: -100px;
    padding-right: 100px;
    padding-left: 10px;
  }
  &--title {
    height: 40px;
    line-height: 50px;
    font-size: 15px;
    color: @primary-text;
    > span {
      font-weight: 500;
    }
  }
  &--desc {
    height: 40px;
    line-height: 30px;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
  }
  &--price {
    color: @danger;
    font-size: 16px;
    text-align: right;
    height: 40px;
    line-height: 70px;
  }
  &--date {
    display: block;
    color: @secondary-text;
    font-size: 12px;
    text-align: right;
    height: 40px;
    line-height: 30px;
  }
  &--right {
    width: 100px;
    height: 100%;
    float: right;
    padding-right: 10px;
  }
  &--footer {
    height: 20px;
    line-height: 0;
    font-size: 12px;
    padding: 0 10px;
    color: @disable;
  }
}
.c-card-coupon-receive--disabled {
  .c-card-coupon-receive--title,
  .c-card-coupon-receive--desc,
  .c-card-coupon-receive--price,
  .c-card-coupon-receive--date {
    color: @disable;
  }
  .c_badge--wrapper {
    background: @disable!important;
  }
}
</style>
