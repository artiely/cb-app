<template>
  <div>
    <v-header title="卡活动" :border="false" :left-click="handleLeft" righticon="icon-xiaotubiao-20" @right-click="handlerFilter">
    </v-header>
    <!-- <v-search v-model="keywords" placeholder="卡名/备注"></v-search>
    <v-tab-bar :data="orderStatus" v-model="active" :count="count" style="background:#f8f8f8"></v-tab-bar> -->
    <v-scroll-page top="44">
      <cube-scroll ref="scroll" :data="data" :options="options" @pulling-up="onPullingUp" @pulling-down="onPullingDown">
        <filter-bar :data="filterArr" @change-filter="handleReset" v-if="currCardStatus.id!==''||currCardType.id!==0"></filter-bar>
        <v-br></v-br>
        <div v-if="data.length>0">
          <div class="card-active-list">
            <div v-for="item in data" :key="item.id" class="charge-active-cells">
              <!-- class="div-cell" :class="{'no-active':item.isActive=='0'}" -->
              <v-cb-card :currentCard="item" hasBtn btnText="办卡" @click-btn="toCard(item)" @click-detail="toDetail(item)"></v-cb-card>
              <!-- <div @click="toDetail(item)">
                <h3>
                  <span class="name">{{item.name}} <v-tag size="small " v-if="item.cardType==2 " :class="{ 'c-card-coupon--badge--disabled':item.isActive==0} "   :style="item.isActive==0?'background:#ddd!important;color:#fff;border:0':'background:#fff;color:#e2b55e;border:0'" >折扣卡</v-tag>
                  <v-tag size="small " v-else :class="{ 'c-card-coupon--badge--disabled':item.isActive==0} " type="次卡" :style="item.isActive==0?'background:#ddd!important;color:#fff;border:0':'background:#fff;color:#e2b55e;border:0'">次卡</v-tag></span>
                </h3>
                <p class="remarks textover1">
                  <span class="fl" style="font-size:14px">
                  <span v-if="item.scopeType=='1'">全场通用</span>
                  <span v-else>指定服务/商品</span>
                  </span> <span class="fr price" style="font-size:20px">{{item.money|currency()}}</span></p>
              </div>
              <div class="to-charge-active-box to-charge-active-box1" >
                <span class="textover1" >{{'备注：'+item.remarks}}</span>
                <div class="to-charge-active tap-area"  @click="toCard(item)">办卡</div>
              </div> -->
            </div>
          </div>
          <v-br height="100"></v-br>
        </div>
        <v-nodata v-else :placeholder="placeholder" hasadd="1"></v-nodata>
      </cube-scroll>
    </v-scroll-page>
    <v-fad-button @click.native="toNewChargeActive"></v-fad-button>
    <!-- 筛选 -->
    <van-popup v-model="filterVisiable " position="right " style="width:80%;height:100%; ">
      <v-popup-title @close="filterVisiable=false "></v-popup-title>
      <div class="popup-innerbox " style="padding:10px ">
        <div class="filter-title ">卡种</div>
        <van-row gutter="20 ">
          <van-col span="8 " v-for="(item) in filterStatus " :key="item.name " @click.native="changeType(item) " style="margin-bottom:20px; ">
            <v-button :type="item.id==currCardType.id? 'primary-solid': '' ">{{item.name}} </v-button>
          </van-col>
        </van-row>
        <div class="filter-title ">是否可用</div>
        <van-row gutter="20 ">
          <van-col span="8 " v-for="(item) in orderStatus " :key="item.name " @click.native="changestatus(item) " style="margin-bottom:20px; ">
            <v-button :type="item.id===currCardStatus.id? 'primary-solid': '' ">{{item.name}} </v-button>
          </van-col>
        </van-row>
      </div>
      <v-footer>
        <v-footer-item class="footer-white" @click.native="handleShuRest ">重置</v-footer-item>
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
      filterStatus: [
        { name: '全部', id: 0 },
        { name: '折扣卡', id: 1 },
        { name: '次卡', id: 2 }
      ],
      currCardType: { name: '全部', id: 0 },
      keywords: '',
      count: [],
      data: [],
      active: 0,
      currCardStatus: { name: '全部', id: '' },
      query: {
        'searchParameter.keyWord': '',
        cardTypes: ['2', '3'],
        isActive: '',
        scopeType: '',
        pageNo: 1,
        pageSize: 10
      },
      placeholder: '无卡活动，点击新增'
    }
  },
  watch: {
    active: {
      handler(val) {
        this.query.pageNo = 1
        if (val === 1) {
          this.query.isActive = '1'
        } else if (val === 2) {
          this.query.isActive = '0'
        } else {
          this.query.isActive = ''
        }
      },
      immediate: true
    },
    currCardType: {
      handler(val) {
        this.query.pageNo = 1
        // this.filterVisiable = false
        switch (val.id) {
          case 0:
            this.query.cardTypes = ['2', '3']
            break
          case 1:
            this.query.cardTypes = ['2']
            break
          case 2:
            this.query.cardTypes = ['3']
        }
      }
    },
    currCardStatus: {
      handler(val) {
        this.query.pageNo = 1
        this.query.isActive = val.id
      }
    },
    keywords: {
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
    }
  },
  computed: {
    filterArr() {
      let arr = []
      if (this.currCardType.id !== 0) {
        arr.push(this.currCardType)
      }
      if (this.currCardStatus.id !== '') {
        arr.push(this.currCardStatus)
      }
      return arr
    }
  },
  methods: {
    handlerFilter() {
      this.filterVisiable = true
    },
    handleLeft() {
      this.$router.replace('/index')
    },
    handleShuRest() {
      this.currCardType = { name: '全部', id: 0 }
      this.currCardStatus = { name: '全部', id: '' }
    },
    handlerPopup() {
      this.moreCtrlShow = true
    },
    changeType(item) {
      this.currCardType = item
    },
    changestatus(item) {
      this.currCardStatus = item
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
    toCard(item) {
      if (item.isActive === '0') {
        return
      }
      // this.$router.push({ name: 'ChargeTicket', query: { id: item.id } })
      this.$router.push({
        name: 'OrderSearch',
        query: { id: item.id, src: 'chargeticket' }
      })
    },
    toNewChargeActive() {
      this.$router.push('/addnewcard')
    },
    toDetail(item) {
      this.$router.push({ name: 'CardDetail', query: { id: item.id } })
    }
  },
  created() {
    this.getData()
  },
  activated() {
    if (this.$route.params.refresh) {
      this.query.pageNo = 1
      this.getData()
    }
    this.$nextTick(() => {
      this.$refs.scroll && this.$refs.scroll.refresh()
    })
  }
}
</script>
<style lang="less">
.to-charge-active-box1 {
  line-height: 40px;
  display: flex;
  overflow: hidden;
  .textover1 {
    width: 300px;
    font-size: 12px;
    color: #fff;
    flex: 1;
  }
  .to-charge-active {
    background: #d73962;
  }
}
</style>
