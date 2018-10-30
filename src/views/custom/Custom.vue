<template >
  <div>
    <v-header title="客户/车辆" righticon="icon-xiaotubiao-20" :border="false" @right-click="handlerFilter" :isBack="false"></v-header>
    <v-search v-model="keywords" placeholder="车牌号/客户名/手机号"></v-search>
    <v-scroll-page top="94" bottom="50">
      <!-- <div v-if="cusData.length > 0"> -->
      <cube-scroll ref="scroll" :options="options"  :scrollEvents="['scroll']"  @scroll="scroll" :data="cusData" @pulling-up="onPullingUp" @pulling-down="onPullingDown">
        <v-br height="20"></v-br>
        <filter-bar :data="filterBarList" v-show="filterBarList.length>0" @change-filter="changeFilter"></filter-bar>
        <!-- <div class="result-list" v-if="cusData.length>0">
          <div class="result-list--item" v-for="(item,index) in cusData" :key="index" @click="toDetail(item)">
            <div class="result-list--carid" v-if="item.motor">{{item.motor.licence|carIdFormat()}}</div>
            <div v-else class="result-list--carid result-list--nodata">无车辆</div>
            <div class="result-list--userinfo" v-if="item.member">
                <span class="textover1 result-list--userleft-username">{{item.member.username|telFormat()}} </span>
                <span class="textover1 result-list--userleft-name">{{item.member.name}}</span>
                <span class="result-list--userleft-tag"><v-tag  color="#ffaa00" type="tag" v-if="item.member&&item.member.memberTag&&item.member.memberTag.id">{{item.member.memberTag.name}}</v-tag></span>
              </div>
            <div v-else class="result-list--userinfo result-list--nodata">无客户</div>
          </div>
        </div> -->
        <!-- <div > -->
        <div v-if="cusData.length > 0">
          <!-- <div> -->
            <div class="custom-result-list" v-for="(item,index) in cusData" :key="index">
              <div slot="text">
                <div class="custom-result-item">
                  <div class="custom-result-icon" @click="toDetail(item)">
                    <v-icon name="icon-morencheliang"></v-icon>
                  </div>
                  <div class="custom-result-info" @click="toDetail(item)">
                    <div class="custom-result-info-idcard" v-if="item.motor">{{item.motor.licence|carIdFormat()}}</div>
                    <div v-else class="custom-result-nodata">—</div>
                    <div class="custom-result-info-userinfo" v-if="item.member">{{item.member.username|telFormat()}} {{item.member.name}}  <v-badge type="储值卡" v-if="item.accountMoney>0">储</v-badge> <v-badge v-if="item.discountCardNum>0" type="折扣卡">折</v-badge>  <v-badge v-if="item.packageCardNum>0" type="次卡">次</v-badge> </div>
                    <div v-else class="custom-result-nodata" style="padding-top:8px">—</div>
                  </div>
                  <div class="custom-list-more">
                    <span class="custom-result-more-ps tap-area" @click="more(item,index)">
                      <v-icon name="icon-gengduo"></v-icon>
                    </span>
                  </div>
                </div>
                <div class="cus-result-mark" :class="{'cus-result-mark-show':item.markShow}" >
                  <div class="c-order-btn-group"  >
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
                </div>
              </div>
            </div>
          </div>
        <!-- </div> -->
        <v-nodata v-else></v-nodata>
      </cube-scroll>
    </v-scroll-page>
    <van-popup v-model="filterVisible" style="width:80%;height:100%" position="right">
      <v-popup-title @close="filterVisible=false"></v-popup-title>
      <div style="padding:10px">
        <div class="filter-title ">客户来源</div>
        <van-row gutter="20 ">
          <van-col span="8 " v-for="(item) in filterSrc " :key="item.name " @click.native="changeSrc(item) " style="margin-bottom:20px; ">
            <v-button :type="item.id===currSrc.id? 'primary-solid': '' ">{{item.name}} </v-button>
          </van-col>
        </van-row>
        <div class="filter-title ">客户标签</div>
        <van-row gutter="20 ">
          <van-col span="8 " v-for="(item) in tagList " :key="item.name " @click.native="changeTag(item) " style="margin-bottom:20px; ">
            <v-button :type="item.id===currTag.id? 'primary-solid': '' " class="textover1">{{item.name}} </v-button>
          </van-col>
        </van-row>
        <v-footer>
          <v-footer-item class="footer-white " @click.native="handleReset ">重置</v-footer-item>
          <v-footer-item @click.native="filterVisible=false ">确定</v-footer-item>
        </v-footer>
      </div>
    </van-popup>
    <v-fad-button @click.native="actionsshow = true"></v-fad-button>
    <van-actionsheet v-model="actionsshow" :actions="actions" class="my-actionsheet">
      <div class="actionsheet-box-wrapper">
        <div class="actionsheet-box actionsheet-box-border" @click="toNewCar">
          <v-icon name="icon-add_bg"></v-icon>新增车辆
        </div>
        <div class="actionsheet-box" @click="toNewCus">
          <v-icon name="icon-add_bg"></v-icon>新增客户
        </div>
      </div>
      <v-br></v-br>
      <div class="actionsheet-box-wrapper" @click="actionsshow=false">
        <div class="actionsheet-box" style="color:#666;height:60px;line-height:60px">
          取消
        </div>
      </div>
    </van-actionsheet>
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
      keywords: '',
      cusData: [],
      filterSrc: [
        { name: '全部', id: '' },
        { name: '主动新增', id: 1 },
        { name: '开单新增', id: 2 },
        { name: '充卡新增', id: 3 },
        { name: '收银新增', id: 4 },
        { name: '领券新增', id: 5 }
      ],
      currSrc: '',
      filterVisible: false,
      query: {
        pageNo: 1,
        pageSize: 10,
        'member.dealType': '',
        'searchParameter.keyWord': '',
        'member.memberTag.id': ''
      },
      tagList: [],
      currTag: '',
      filterBarList: [],
      actionsshow: false
    }
  },
  watch: {
    currSrc: {
      handler(val) {
        this.query['member.dealType'] = val.id
      },
      deep: true
    },
    currTag: {
      handler(val) {
        this.query['member.memberTag.id'] = val.id
      },
      deep: true
    },
    keywords: {
      // TIP: 在搜索的时候页码重置 滚动到顶部
      handler(val, oval) {
        this.query['searchParameter.keyWord'] = val
        this.query.pageNo = 1
        this.noData = false
      },
      deep: true
    },
    filter: {
      handler(val) {
        this.filterBarList = val
      }
    }
  },
  computed: {
    filter() {
      let src = this.currSrc && this.currSrc.id !== '' ? this.currSrc : null
      let type = this.currTag && this.currTag.id !== '' ? this.currTag : null
      return [src, type].filter(v => {
        if (v) {
          return v
        }
      })
    }
  },
  methods: {
    chargeActive(item) {
      if (item.member) {
        this.setCusInfo(item)
        this.$router.push('/chargeactive')
      } else {
        this.$toast('无客户信息无法充值')
      }
    },
    toOrder(item) {
      this.setCusInfo(item)
      this.$router.push('/kaidan')
    },
    fastOrder(item) {
      this.setCusInfo(item)
      this.$router.push('/cashdesk')
    },
    setCusInfo(item) {
      let data = ''
      // 有人有车
      if (item.member && item.motor) {
        data = item.motor
        data.member = item.member
        this.$store.commit('ORDER_OF_CAR', data)
        // 只有人
      } else if (item.member) {
        data = item.member
        this.$store.commit('ORDER_OF_CUSTOM', data)
        // 只有车
      } else if (item.motor) {
        data = item.motor
        this.$store.commit('ORDER_OF_CAR', data)
      }
    },
    chargeCard(item) {
      if (item.member) {
        this.setCusInfo(item)
        this.$store.dispatch('clearShopCar').then(() => {
          this.$store.commit('CLEAR_CURRENT_CARD')
          this.$router.push({ name: 'ChargeTicket' })
        })
      } else {
        this.$toast('无客户信息无法办卡')
      }
    },
    moreHide(item, index) {
      this.cusData = this.cusData.map((v, i) => {
        v.markShow = false
        return v
      })
    },
    scroll() {
      // this.moreHide()
    },
    more(item, index) {
      console.log(1)
      this.cusData = this.cusData.map((v, i) => {
        v.markShow = false
        if (i === index) {
          v.markShow = !v.markShow
        }
        return v
      })
    },
    handleReset() {
      this.currSrc = ''
      this.currTag = ''
    },
    toNewCar() {
      this.$router.push('/newcar')
    },
    toNewCus() {
      this.$router.push('/newcustom')
    },
    async getData() {
      let res = await this.$api.CUSTOM_LIST(this.query)
      if (res.status === 1) {
        if (this.query.pageNo === 1) {
          this.cusData = res.page.list || []
        } else {
          this.cusData = this.cusData.concat(res.page.list || [])
        }
        this.totalPage = res.page.totalPage
      }
    },
    changeFilter(item) {
      this.filterBarList = this.filterBarList.filter(v => {
        if (item === this.currSrc) {
          this.currSrc = ''
        } else if (item === this.currTag) {
          this.currTag = ''
        }
        if (v !== item) {
          return v
        }
      })
    },
    handlerFilter() {
      this.filterVisible = true
    },
    changeSrc(item) {
      this.currSrc = item
    },
    changeTag(item) {
      this.currTag = item
    },
    toDetail(item) {
      // : 带id 跳转到详情
      let id = item.member ? item.member.id : ''
      let carid = item.motor ? item.motor.id : ''
      if (!id && !carid) return
      if (carid) {
        this.$router.push({ name: 'Detail', query: { carid: carid } })
      } else {
        this.$router.push({ name: 'Detail', query: { id: id } })
      }
      if (item.member) {
        let data = item.member
        if (item.motor) {
          // 这里把车带到详情再详情对应高亮
          data.motor = item.motor
        }
        this.$store.commit('ORDER_OF_CUSTOM', data)
      }
    },
    async getTagList() {
      let res = await this.$api.CUSTOM_TAG_LIST({ pageNo: 1, pageSize: 100 })
      if (res.status === 1) {
        this.tagList = res.page.list
      } else {
        console.error('获取标签列表失败')
      }
    }
  },
  created() {
    this.getData()
    this.getTagList()
  },
  activated() {
    // this.getData()
    // this.getTagList()
    this.moreHide()
    if (this.$route.params.refresh) {
      this.onPullingDown()
    }
    this.$nextTick(() => {
      this.$refs.scroll.refresh()
    })
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';
.my-actionsheet{
  .van-hairline--bottom:after{
    border:none;
  }
}
</style>
