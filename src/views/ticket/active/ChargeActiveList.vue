<template>
  <div>
    <v-header title="充值活动" :border="false" :left-click="handleLeft">
      <span slot="righttext">
        <v-icon name="icon-xiaotubiao-20" @click.native="filterVisiable=true"></v-icon>
      </span>
    </v-header>
    <!-- <v-search v-model="keywords" placeholder="充值活动/备注"></v-search>
    <v-tab-bar :data="orderStatus" v-model="active" :count="count" style="background:#f8f8f8"></v-tab-bar> -->
    <v-scroll-page top="44">
      <cube-scroll ref="scroll" :data="data" :options="options" @pulling-up="onPullingUp" @pulling-down="onPullingDown">
        <filter-bar :data="[currentStatus]" @change-filter="handleReset" v-if="currentStatus.id!==''"></filter-bar>
        <div v-if="data.length>0">
          <div v-for="item in data" :key="item.id" class="charge-active-cells">
            <v-cb-card :currentCard="item" hasBtn @click-detail="toDetail(item)" @click-btn="toCharge(item)"></v-cb-card>
          </div>
          <div class="quick-charge" @click="toCharge">直接充值</div>
          <v-br height="100"></v-br>
        </div>
        <v-nodata v-else :placeholder="placeholder" hasadd="1"></v-nodata>
      </cube-scroll>
    </v-scroll-page>
    <v-fad-button @click.native="toNewChargeActive"></v-fad-button>
    <!-- <v-footer>
      <v-footer-item @click.native="toCharge">直接充值</v-footer-item>
    </v-footer> -->

    <!-- 筛选 -->
    <van-popup v-model="filterVisiable " position="right " style="width:80%;height:100%; ">
      <v-popup-title @close="filterVisiable=false "></v-popup-title>
      <div class="popup-innerbox " style="padding:10px ">
        <div class="filter-title ">是否可用</div>
        <van-row gutter="20 ">
          <van-col span="8 " v-for="(item) in orderStatus " :key="item.name " @click.native="changeStatus(item) " style="margin-bottom:20px; ">
            <v-button :type="item.id===currentStatus.id? 'primary-solid': '' ">{{item.name}} </v-button>
          </van-col>
        </van-row>
      </div>
      <v-footer>
        <v-footer-item class="footer-white " @click.native="handleReset ">重置</v-footer-item>
        <v-footer-item @click.native="filterVisiable=false ">确定</v-footer-item>
      </v-footer>
    </van-popup>
  </div>
</template>
<script>
import scroll from '../../../common/mixins/scroll.js'
import FilterBar from '../../../components/FilterBar'
export default {
  mixins: [scroll],
  components: {
    FilterBar
  },
  data() {
    return {
      filterVisiable: false,
      orderStatus: [
        { name: '全部', id: '' },
        { name: '已启用', id: 1 },
        { name: '已停用', id: 0 }
      ],
      keywords: '',
      count: [],
      data: [],
      active: 0,
      currentStatus: { name: '全部', id: '' },
      query: {
        'searchParameter.keyWord': '',
        cardType: '1',
        isActive: '',
        scopeType: '',
        pageNo: 1,
        pageSize: 10
      },
      placeholder: '无充值活动，点击新增'
    }
  },
  watch: {
    // active: {
    //   handler(val) {
    //     this.query.pageNo = 1
    //     if (val === 1) {
    //       this.query.isActive = '1'
    //     } else if (val === 2) {
    //       this.query.isActive = '0'
    //     } else {
    //       this.query.isActive = ''
    //     }
    //   },
    //   immediate: true
    // },
    keywords: {
      // TIP: 在搜索的时候页码重置 滚动到顶部
      handler(val, oval) {
        this.query['searchParameter.keyWord'] = val
        this.query.pageNo = 1
        this.noData = false
      },
      deep: true
    },
    query: {
      handler(val) {
        if (val.pageNo === 1) {
          this.$refs.scroll.scrollTo(0, 0)
        }
        this.getData()
      },
      deep: true
    },
    'query.orderNo': {
      handler() {
        this.active = 0
      }
    },
    currentStatus: {
      handler(val) {
        this.query.pageNo = 1
        this.query.isActive = val.id
      }
    }
  },
  methods: {
    handleReset() {
      this.currentStatus = { name: '全部', id: '' }
    },
    changeStatus(item) {
      this.currentStatus = item
    },
    handleLeft() {
      this.$router.replace('/index')
    },
    handlerPopup() {
      this.moreCtrlShow = true
    },
    toCharge(item) {
      if (item && item.id) {
        if (item.isActive === '0') {
          return
        }
        this.$router.push({
          name: 'OrderSearch',
          query: { id: item.id, src: 'chargeactive' }
        })
      } else {
        this.$router.push({
          name: 'OrderSearch',
          query: { active: '1', src: 'chargeactive' }
        })
      }
    },
    async getData() {
      let res = await this.$api.CHARGE_ACTIVE_LIST(this.query)
      if (res.status === 1) {
        if (this.query.pageNo === 1) {
          this.data = res.page.list || []
        } else {
          this.data = this.data.concat(res.page.list || [])
        }
        this.count = [res.data.numAll, res.data.numActive, res.data.numStop]
        this.totalPage = res.page.totalPage
      } else {
        console.error(`获取列表失败${res.stateMessage}`)
      }
    },
    toNewChargeActive() {
      this.$router.push('/newchargeactive')
    },
    toDetail(item) {
      this.$router.push({ name: 'ChargeActiveInfo', query: { id: item.id } })
    }
  },
  activated() {
    this.getData()
    this.$nextTick(() => {
      this.$refs.scroll && this.$refs.scroll.refresh()
    })
  }
}
</script>
<style>
.quick-charge {
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  line-height: 50px;
  color: #1690ff;
}
</style>
