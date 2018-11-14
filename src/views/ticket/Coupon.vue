<template>
  <div>
    <v-header title="优惠券" righticon="icon-xiaotubiao-20" @right-click="handlerFilter" :border="false"></v-header>
    <v-search v-model="keywords" placeholder="券名"></v-search>
    <v-tab-bar :data="tab" :count="count" v-model="active" style="background:#f8f8f8"></v-tab-bar>
    <div class="c-scroll-wrapper-top-search-tab">
      <cube-scroll ref="scroll" :data="couponList" :options="options" @pulling-up="onPullingUp" @pulling-down="onPullingDown">
        <filter-bar :data="filterBarList" @change-filter="changeFilter"></filter-bar>
        <div v-if="couponList.length>0">
          <!-- 优惠券列表数据    showInfo=发券、已领完显示 、优惠券点击进详情（点击预览才预览）-->
          <v-coupons-template :data="couponList" @click-detail="toDetail" @click-toShare="toShare" showInfo></v-coupons-template>
          <v-br height="100"></v-br>
        </div>
        <div v-else>
          <v-nodata></v-nodata>
        </div>
      </cube-scroll>
    </div>
    <!-- 筛选 -->
    <van-popup v-model="filterVisiable " position="right " style="width:80%;height:100%; ">
      <v-popup-title @close="filterVisiable=false "></v-popup-title>
      <div class="popup-innerbox " style="padding:10px ">
        <div class="filter-title ">券种</div>
        <van-row gutter="10 ">
          <van-col span="8 " v-for="(item) in filterStatus " :key="item.name " @click.native="changeType(item) " style="margin-bottom:10px; ">
            <v-button :type="item.id==currentCouponType.id? 'primary-solid': '' ">{{item.name}} </v-button>
          </van-col>
        </van-row>
      </div>
      <v-footer>
        <v-footer-item class="footer-white" @click.native="handleShuRest ">重置</v-footer-item>
        <v-footer-item @click.native="filterVisiable=false ">确定</v-footer-item>
      </v-footer>
    </van-popup>
    <van-actionsheet v-model="showShare" title="支持以下分享方式">
      <p class="coupon-share-tip">微信分享仅支持 QQ 或 UC 浏览器</p>
      <div class="share-btn-box">
        <div id="shareBtn" style="margin:10px auto;text-algin:center"> </div>
      </div>
    </van-actionsheet>
    <v-fad-button @click.native="AddCouponTemp"></v-fad-button>
  </div>
</template>

<script>
import FilterBar from '../../components/FilterBar'
import scroll from '../../common/mixins/scroll.js'
export default {
  components: {
    FilterBar
  },
  mixins: [scroll],
  data() {
    return {
      showShare: false,
      filterVisiable: false,
      startDate: '',
      endDate: '',
      filterItem: [
        {
          name: '全部',
          id: ''
        },
        {
          name: '店铺创建',
          id: 1
        },
        {
          name: '车边模板',
          id: 0
        }
      ],
      filterStatus: [
        {
          name: '全部',
          id: ''
        },
        {
          name: '通用券',
          id: 1
        },
        {
          name: '礼品券',
          id: 2
        }
      ],
      currentCouponSrc: 0, // 来源
      currentCouponType: 0, // 卡种
      query: {
        pageNo: 1,
        pageSize: 10,
        type: '', // 类型（1 满减 2 满赠）
        status: 1, // 状态（1 上架 2 下架）
        'searchParameter.keyWord': '',
        dataSrc: '' // 数据来源（0 系统库 1 店铺库）
      },
      couponList: [],
      tab: [{ name: '已启用', id: 0 }, { name: '已停用', id: 1 }],
      active: 0,
      totalPage: 0,
      filterBarList: [],
      count: [],
      keywords: '',
      valShow: 0
    }
  },
  computed: {
    filter() {
      let src =
        this.currentCouponSrc && this.currentCouponSrc.id !== ''
          ? this.currentCouponSrc
          : null
      let type =
        this.currentCouponType && this.currentCouponType.id !== ''
          ? this.currentCouponType
          : null
      return [src, type].filter(v => {
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
        this.query.status = val + 1
        this.valShow = val
        console.log(this.valShow)
        console.log('11111' + this.query.status)
      }
    },
    keywords: {
      handler(val) {
        this.query.pageNo = 1
        this.query['searchParameter.keyWord'] = val
      }
    },
    currentCouponSrc: {
      handler(val) {
        this.query.pageNo = 1
        this.query.dataSrc = val.id
      }
    },
    currentCouponType: {
      handler(val) {
        this.query.pageNo = 1
        this.query.type = val.id
      }
    },
    query: {
      handler() {
        this.noData = false
        this.getData()
      },
      deep: true
    }
  },
  methods: {
    handlerFilter() {
      this.filterVisiable = true
    },
    AddCouponTemp() {
      this.$router.push('/addcoupontemp')
    },
    changeFilter(item) {
      this.filterBarList = this.filterBarList.filter(v => {
        if (item === this.currentCouponSrc) {
          this.currentCouponSrc = ''
        } else if (item === this.currentCouponType) {
          this.currentCouponType = ''
        }
        if (v !== item) {
          return v
        }
      })
    },
    changeSrc(item) {
      this.currentCouponSrc = item
    },
    changeType(item) {
      this.currentCouponType = item
    },
    handleShuRest() {
      this.currentCouponSrc = ''
      this.currentCouponType = ''
      this.startDate = ''
      this.endDate = ''
    },
    toDetail(item) { // 跳预览页面
      this.$router.push({
        name: 'CouponTempDetail',
        query: { id: item.id }
      })
    },
    async getData() {
      let res = await this.$api.LIST_STORE_COUPON_TEMP(this.query)
      if (res.status === 1) {
        this.count = [res.data.numStatusUp, res.data.numStatusDown]
        if (this.query.pageNo === 1) {
          this.couponList = res.page.list || []
        } else {
          this.couponList = this.couponList.concat(res.page.list || [])
        }
        console.log(this.couponList)
        this.totalPage = res.page.totalPage
      } else {
        console.error('获取券失败')
      }
    },
    toShare(item) {
      // this.$toast.fail('敬请期待')
      // this.showShare = true
      // this.$nextTick(() => {
      //   soshm('#shareBtn', {
      //     // 分享的链接，默认使用location.href
      //     url: '',
      //     // 分享的标题，默认使用document.title
      //     title: `您有一张价值${item.moneyReduce}元的优惠券`,
      //     // 分享的摘要，默认使用<meta name="description" content="">content的值
      //     digest: `${item.name}`,
      //     // 分享的图片，默认获取本页面第一个img元素的src
      //     pic: '',
      //     // 默认显示的网站为以下六个个,支持设置的网站有
      //     // weixin,weixintimeline,qq,qzone,yixin,weibo,tqq,renren,douban,tieba
      //     sites: ['weixin', 'weixintimeline', 'weibo', 'qq', 'qzone', 'tqq']
      //   })
      // })
      if (this.valShow === 0) {
        this.$api.NATIVE_SHARE({
          shareUrl: `http://dp.51chebian.com/store/ssp/ci/store/coupon/temp/receive/form?id=${
            item.id
          }`,
          title: `您有一张价值${item.moneyCondition}元的优惠券`,
          thumbnail:
            'https://static-oss-chebian.oss-cn-beijing.aliyuncs.com/public/share-popup-01.png',
          summary: `满${item.moneyReduce}元可用`
        })
      }
    }
  },
  created() {
    this.getData()
  },
  mounted() {},
  activated() {
    this.$nextTick(() => {
      this.$refs.scroll && this.$refs.scroll.refresh()
    })
  }
}
</script>

<style lang="less">
// TIP: 样式不用修改
</style>
