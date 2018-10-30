<template>
  <div>
    <v-header title="客户卡列表" righticon="icon-xiaotubiao-20" @right-click="handlerFilter" :border="false"></v-header>
    <v-search v-model="keywords" placeholder="客户名/手机号"></v-search>
    <v-tab-bar :data="tabData" v-model="active" :count="count" style="background:#f8f8f8;"></v-tab-bar>
    <v-scroll-page top="135">
    <!-- <div class="c-scroll-wrapper-top-search-tab"> -->
      <cube-scroll ref="scroll" :options="options" :data="dataFormat" @pulling-up="onPullingUp" @scroll="scroll" @pulling-down="onPullingDown">
        <v-br></v-br>
        <filter-bar :data="filterBarList" @change-filter="changeFilter"></filter-bar>
        <div v-if="dataFormat.length>0">
          <div class="card-ticket" @click="toDetal(item)" v-for="(item,index) in dataFormat" :key="index" v-if="item.cardType!=1" :class="item._status!=='有效'?'disabled':''">
            <div class="card-ticket-header clearfix">
              <div class="fl left textover1"> <div class="card-ticket-icon">
                <span v-if="item.member.name">{{item.member.name.split('')[0]}}</span>
               </div> {{item.member.username |telFormat}} {{item.member.name}} </div>
            </div>
            <div class="card-ticket-body">
              <div class="card-ticket-body-left">
                <h1 class="card-ticket-body-left-title">
                  {{item.name}}
                   <v-badge  v-if="item.cardType==3" type="次卡">次卡</v-badge>
                <v-badge  v-if="item.cardType==2" type="折扣卡">折扣卡</v-badge>
                <v-badge  v-if="item.cardType==1" type="储值卡">储值卡</v-badge>
                  <span class="fr ticket-money" v-if="item.cardType==2">{{item.moneyUsable|currency('￥')}}</span>
                </h1>
              </div>
            </div>
            <div class="card-ticket-footer">
              <div class="card-ticket-footer-inner">
                <span v-if="item.durationStart&&item.durationEnd" key="指定时间">
                  <!-- {{item.durationStart | timeFormat('YYYY-MM-DD')}} 至 {{item.durationEnd | timeFormat('YYYY-MM-DD')}} -->
                  <span v-if="item._status=='有效'&&item._days>0">{{item.durationEnd | timeFormatToDays}}天到期</span>
                  <span v-else-if="item._status=='有效'&&item._days==0">今日到期</span>
                </span>
                <span v-else key="永久有效">
                  <span>永久有效</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <v-nodata v-else></v-nodata>
      </cube-scroll>
    <!-- </div> -->
  </v-scroll-page>
    <!-- 筛选 -->
    <van-popup v-model="filterVisiable" position="right" style="width:80%;height:100%;">
      <v-popup-title @close="filterVisiable=false"></v-popup-title>
      <div class="popup-innerbox" style="padding:10px">
        <div class="filter-title">卡种</div>
        <van-row gutter="20">
          <van-col span="8" v-for="(item) in filterItem" :key="item.name" @click.native="changeType(item)" style="margin-bottom:20px;">
            <v-button :type="item.id==query.cardType?'primary-solid':''">{{item.name}} </v-button>
          </van-col>
        </van-row>

        <!-- <div class="filter-title">状态</div>
        <van-row gutter="10">
          <van-col span="8" v-for="(item) in filterStatus" :key="item.name" @click.native="changeStatus(item)" style="margin-bottom:10px;">
            <v-button :type="item.id==query.usableType?'primary-solid':''">{{item.name}} </v-button>
          </van-col>
        </van-row> -->
        <!-- <div class="filter-title">按办理时间</div>
        <v-cell title="开始" datepicker v-model="query['searchParameter.starTime']" link></v-cell>
        <v-cell title="截止" datepicker v-model="query['searchParameter.endTime']" :mindate="query['searchParameter.starTime']" link></v-cell> -->
      </div>
      <v-footer>
        <v-footer-item class="footer-white" @click.native="handleShuRest">重置</v-footer-item>
        <v-footer-item @click.native="filterVisiable=false">确定</v-footer-item>
      </v-footer>
    </van-popup>
  </div>
</template>

<script>
import moment from 'dayjs'
import FilterBar from '../../components/FilterBar'
import scroll from '../../common/mixins/scroll.js'
export default {
  components: {
    FilterBar
  },
  mixins: [scroll],
  data() {
    return {
      filterVisiable: false,
      startDate: '',
      endDate: '',
      filterItem: [
        {
          name: '全部',
          id: ''
        },
        {
          name: '折扣卡',
          id: '2'
        },
        {
          name: '次卡',
          id: '3'
        }
      ],
      filterStatus: [
        {
          name: '全部',
          id: ''
        },
        {
          name: '有效',
          id: '1'
        },
        {
          name: '已过期',
          id: '2'
        },
        {
          name: '已用完',
          id: '3'
        }
      ],
      currentTicketTypeId: 0,
      currentTicketStatusId: 0,
      data: [],
      query: {
        pageNo: 1,
        pageSize: 10,
        'searchParameter.keyWord': '',
        'searchParameter.starTime': '',
        'searchParameter.endTime': '',
        cardType: '',
        usableType: '1', // 有效类型。1：有效 2：已过期 3：已用完。
        cardTypes: ['3', '2'],
        'member.id': '' // 通过会员查
      },
      active: 0,
      totalPage: 0,
      keywords: '',
      scrollY: -1,
      tabData: [
        { name: '有效', id: 0 },
        { name: '已用完', id: 1 },
        { name: '已过期', id: 2 }
      ],
      count: [],
      filterBarList: [],
      cus: '',
      currCarType: '', // 当前的卡类型
      currUsableType: '' // 当前的卡状态
    }
  },
  watch: {
    active: {
      handler(val) {
        this.query.pageNo = 1
        this.query.usableType = val + 1
        this.$refs.scroll.scrollTo(0, 0)
      }
    },
    keywords: {
      handler(val) {
        this.query['searchParameter.keyWord'] = val
        this.query.pageNo = 1
        this.$refs.scroll.scrollTo(0, 0)
      }
    },
    filter: {
      handler(val) {
        this.filterBarList = val
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
  computed: {
    // refresh() {
    //   return this.$store.state.order.refresh
    // },
    orderOfCustom() {
      return this.$store.state.order.orderOfCustom
    },
    dataFormat() {
      return this.data.map(item => {
        // TIP: 根据卡类型判断当前卡是否可用 卡类型。1：储值卡、2：折扣卡、3：次卡
        if (item.cardType === '3') {
          // 次卡 判断次数和时间
          let days = moment(item.durationEnd).diff(moment(), 'days')
          if (days < 0) {
            item._status = '已过期'
          } else if (item.numUsableTotal > 0 && days >= 0) {
            item._status = '有效'
          } else {
            item._status = '已用完'
          }
        } else if (item.cardType === '2') {
          // 折扣卡 判断时间和剩余金额
          let days = moment(item.durationEnd).diff(moment(), 'days')
          if (days < 0) {
            item._status = '已过期'
          } else if (item.moneyUsable > 0 && days >= 0) {
            item._status = '有效'
          } else {
            item._status = '已用完'
          }
        } else {
          // 储值卡 只判断余额 TIP: 储值卡已经移除
          item._status = item.moneyUsable > 0 ? '有效' : '已用完'
        }
        return item
      })
    },
    filter() {
      let src =
        this.currCarType && this.currCarType.id !== '' ? this.currCarType : null
      let type =
        this.currUsableType && this.currUsableType.id !== ''
          ? this.currUsableType
          : null

      let cus = this.cus && this.cus.id !== '' ? this.cus : null
      return [src, type, cus].filter(v => {
        if (v) {
          return v
        }
      })
    }
  },
  methods: {
    async getData() {
      let res = await this.$api.TICKET_LIST(this.query)
      if (res.status === 1) {
        let data = []
        if (this.query.pageNo === 1) {
          data = res.page.list || []
        } else {
          data = this.data.concat(res.page.list || [])
        }
        this.data = data.map(v => {
          if (v.durationStart && v.durationEnd) {
            v._days = this.$options.filters['timeFormatToDays'](v.durationEnd)
          }
          return v
        })
        this.totalPage = res.page.totalPage
      } else {
        console.error(`获取列表失败${res.stateMessage}`)
      }
      this.getCount()
    },
    async getCount() {
      let res = await this.$api.COUNT_VIP_CARD({
        'searchParameter.keyWord': this.query['searchParameter.keyWord'],
        'searchParameter.starTime': this.query['searchParameter.starTime'],
        'searchParameter.endTime': this.query['searchParameter.endTime'],
        cardType: this.query['cardType'],
        usableType: this.query['usableType'], // 有效类型。1：有效 2：已过期 3：已用完。
        cardTypes: this.query['cardTypes'],
        'member.id': this.query['member.id'] // 通过会员查
      })
      if (res.status === 1) {
        for (let i = 0; i < res.data.length; i++) {
          this.$set(this.count, i, res.data[i])
        }
      } else {
        console.error('获取数量失败')
      }
    },
    changeFilter(item) {
      this.filterBarList = this.filterBarList.filter(v => {
        if (item === this.currCarType) {
          this.currCarType = ''
          this.query.cardType = ''
        } else if (item === this.currUsableType) {
          this.currUsableType = ''
          this.query.usableType = ''
        } else if (item === this.cus) {
          this.cus = ''
        }
        if (v !== item) {
          return v
        }
      })
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    handlerFilter() {
      this.filterVisiable = true
    },
    changeType(item) {
      this.query.cardType = item.id
      this.currCarType = item
    },
    changeStatus(item) {
      this.query.usableType = item.id
      this.currUsableType = item
    },
    handleShuRest() {
      this.query['searchParameter.starTime'] = ''
      this.query['searchParameter.endTime'] = ''

      this.query.cardType = ''
      this.query.usableType = ''
      this.filterBarList = []
    },
    toDetal(item) {
      this.$router.push({ name: 'TicketDetail', query: { id: item.id } })
      this.$store.commit('ORDER_OF_CUSTOM', item.member)
    }
  },
  created() {
    // HACK:第一次从客户详情来是不走这的
    if (!this.$route.params.cus) {
      this.getData()
      // this.getCount()
    }
  },
  activated() {
    if (this.$route.params.cus) {
      this.cus = this.$route.params.cus
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';
.filter-title {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color: #666;
}
.fixed-tab {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transform: translate3d(0, 0, 0);
  z-index: 99;
}
.card-ticket {
  background: #ffffff;
  width: 100%;
  overflow: hidden;
  margin-bottom:20px;
  .card-ticket-icon{
    height: 24px;
    width:24px;
    border-radius: 50%;
    background: #ddd;float: left;
    margin-right:6px;
    margin-top:8px;
    font-size: 18px;
    text-align: center;
    line-height: 24px;
    overflow: hidden;
    color:#fff;
  }
  &.disabled {
    color: #999999 !important;
    .left {
      color: #999999 !important;
    }
    .ticket-money {
      color: #999999 !important;
    }
    .card-ticket-body-left-title {
      color: #999999 !important;
    }
    .card-ticket-body-left-des {
      color: #999999 !important;
    }
    .c_badge--wrapper {
      background: #999999 !important;
    }
    .card-ticket-footer {
      color: #999999 !important;
      .card-ticket-footer-inner{
        span{
          color: #999999 !important;
        }
      }
    }
  }
  .card-ticket-header {
    background: #f8f8f8;
    overflow: hidden;
    height:40px;
    line-height: 40px;
    font-weight: 600;
    font-size: 18px;
    padding-left:8px;
  }
  .ticket-money {
    font-size: 18px;
    font-weight: 500;
    color: #333;
  }
  .card-ticket-body {
    padding-left:36px;
    padding-right: 18px;
    height: 30px;
    line-height: 30px;
    overflow: hidden;

    .card-ticket-body-left {
      .card-ticket-body-left-title {
        font-size: 18px;
        color: #333;
      }
      .card-ticket-body-left-des {
        font-size: 16px;
        color: #333;
        line-height: 22px;
      }
    }
  }

  .card-ticket-footer {
    padding-left: 36px;
    height: 30px;
    line-height: 20px;
    font-size: 16px;
    color: #0dcc6d;
    .borderB();
  }
}
</style>
