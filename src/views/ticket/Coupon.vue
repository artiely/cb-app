<template>
  <div>
    <v-header title="优惠券" righticon="icon-xiaotubiao-20" @right-click="handlerFilter" :border="false"></v-header>
    <v-search v-model="keywords" placeholder="券名"></v-search>
    <v-tab-bar :data="tab" :count="count" v-model="active" style="background:#f8f8f8"></v-tab-bar>
    <div class="c-scroll-wrapper-top-search-tab">
      <cube-scroll ref="scroll" :data="couponList" :options="options" @pulling-up="onPullingUp" @pulling-down="onPullingDown">
        <filter-bar :data="filterBarList" @change-filter="changeFilter"></filter-bar>
        <div v-if="couponList.length>0">
          <div class="c-card-coupon--wrapper clearfix" v-for="item in couponList " :key="item.id" :class="{ 'c-card-coupon--disabled':item.status==2} ">
            <div class="c-card-coupon--temp-icon" v-if="item.dataSrc==0">车边模板</div>
            <div class="c-card-coupon--footer--dot--top" style="top:-10px "></div>
            <div style="border-left: 1px dashed #fff;height:90%;line-height:2px;position: absolute;top:10%;left:calc(65% + 10px);"></div>
            <div class="c-card-coupon--footer--dot--bottom " style="bottom:-10px "></div>
            <div class="c-card-coupon--title clearfix " @click="toDetail(item)">
              <div class="c-card-coupon--title--left textover1 ">{{item.name}}
              </div>
              <!-- 满减面值 -->
              <div class="c-card-coupon--title--right textover1 " v-if="item.type==1">{{item.moneyReduce|currency('￥')}}
              </div>
              <!-- 满赠面值 -->
              <div class="c-card-coupon--title--right textover1 " v-if="item.type==2">{{item.moneyGift|currency('￥')}}
              </div>
            </div>
            <div class="c-card-coupon--desc textover1 " @click="toDetail(item)">
              <div class="c-card-coupon--footer--left ">
                <span class="c-card-coupon--text">满{{item.moneyCondition|currency('')}}元可用</span>
                <v-badge size="small " v-if="item.type==2 " :class="{ 'c-card-coupon--badge--disabled':item.status==2} " type="礼品券">礼品券</v-badge>
                <v-badge size="small " v-else :class="{ 'c-card-coupon--badge--disabled':item.status==2} " type="通用券">通用券</v-badge>
              </div>
              <div class="c-card-coupon--footer--right text">
                已领 {{item.numReceive}} 份
              </div>
            </div>

            <div class="c-card-coupon--footer clearfix ">
              <div class="c-card-coupon--footer--left " @click="toDetail(item)">
                <span class="c-card-coupon--footer--text" v-if="item.restrictTimeType=='1'">有效期：{{item.restrictDateStart|timeFormat('YYYY.MM.DD')}}至{{item.restrictDateEnd|timeFormat('YYYY.MM.DD')}}</span>
                <span class="c-card-coupon--footer--text" v-else>有效期：自领取 {{item.restrictDays}} 天有效</span>
              </div>
              <div class="c-card-coupon--footer--right ">
                <span v-if="item.numReceive>0 " class="c-card-coupon--btn tap-area" @click="toShare(item)" :class="{'backgroundSpan':valShow==0}">发券 </span>
                <span v-else class="c-card-coupon--btn tap-area" style="background: #c7c7c7;">已领完</span>
              </div>
            </div>
          </div>
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
      valShow: ''
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
    toDetail(item) {
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
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';
.c-card-coupon--wrapper {
  border-radius: 8px;
  margin: 10px auto;
  background: -webkit-linear-gradient(
    left,
    #f2511f,
    #ff2300
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    left,
    #f2511f,
    #ff2300
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    left,
    #f2511f,
    #ff2300
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(left, #d40000, #ff2300);
  /* 标准的语法 */
}
.backgroundSpan {
  background: #971a28;
}
.c-card-coupon--disabled {
  background: rgb(199, 199, 199);
}
.share-btn-box {
  text-align: center;
}
#shareBtn {
  display: inline-block;
}
.coupon-share-tip {
  font-size: 12px;
  color: @primary-text;
  text-align: center;
}
.c-card-coupon--title--left,
.c-card-coupon--footer--left,
.c-card-coupon--title--right,
.c-card-coupon--footer--right {
  color: #fff;
}
.c-card-coupon--title--right {
  text-align: center;
  font-weight: bold;
  font-size: 20px;
}
.c-card-coupon--text,
.c-card-coupon--footer--right.text {
  line-height: 20px;
}
.c-card-coupon--footer--right.text {
  margin-right: 2%;
}
.c-card-coupon--footer--text {
  height: 25px;
  line-height: 25px;
}
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
.c-card-coupon--btn {
  display: inline-block;
  width: 70px;
  height: 25px;
  line-height: 25px;
  border-radius: 10px;
  text-align: center;
  margin-top: 8px;
  color: #fff;
  // background: #971a28;
}
.c-card-coupon--footer {
  background-image: none;
}
.c-card-coupon--footer--dot--top,
.c-card-coupon--footer--dot--bottom {
  height: 20px;
  width: 20px;
  position: absolute;
  // top: -10px;
  // top:0;
  left: 65%;
  background: #e8e8e8;
  border-radius: 50%;
}
</style>
