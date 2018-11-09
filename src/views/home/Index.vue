<template>
  <div class="index" style="position:fixed;bottom:50px;background:#e8e8e8">
    <div>
    </div>
    <div class="c-scroll-wrapper-bottom" >
      <cube-scroll @scroll="scroll" ref="scroll" :options="options" @pulling-down="onPullingDown">
        <template slot="pulldown" slot-scope="props">
          <div v-if="props.pullDownRefresh" class="cube-pulldown-wrapper" :style="props.pullDownStyle">
            <div class="before-trigger" :style="{paddingTop: '40px'}">
              <span>
                车边店管家，为百万汽车店铺管店
              </span>
            </div>
          </div>
        </template>
        <div style="background:#e8e8e8;">

          <div class="index-top-box">
            <div class="header-tip" v-if="isExp">
              <div class="header-tip-icon">
                <v-icon name="icon-laba"></v-icon> 体验期余 {{validDays}} 天
              </div>
              <div class="header-notice">
                <van-notice-bar :scrollable="true" background="#ffdd66" color="#000" :text="isExp&&isActive?sysActiveTitle:''" @click="sysActiveShow=true" />
              </div>
              <!-- <span class="exp-dasy" v-if="validDays>0">体验期余 {{validDays}} 天</span>
              <span class="exp-dasy" v-else>体验期今日到期</span> -->
              <div class="top-paybtn" @click="toBuy">
                <div class="top-paybtn-btn">购买</div>
              </div>
            </div>
            <div class="store-name" @click="toSetStore">
              <span class="store-name-icon">
                <v-icon name="icon-qiyeguanli"></v-icon>
              </span> {{storeName}}</div>
            <div class="order-data">
              <!-- <div style="flex:1"></div> -->
              <div class="data-item" @click="toOrder">
                <div>
                  <v-icon name="icon-kaidan" style="margin-right:-2px"></v-icon>
                </div>
                <p>开单</p>
              </div>
              <!-- <div style="flex:1"></div> -->
              <div class="data-item" @click="toFast">
                <div>
                  <v-icon name="icon-kuaidan"></v-icon>
                </div>
                <p>快单</p>
              </div>
              <div class="data-item" @click="toCharge">
                <div>
                  <v-icon name="icon-chongzhi1"></v-icon>
                </div>
                <p>充值</p>
              </div>
              <div class="data-item" @click="toChargeCard">
                <div>
                  <v-icon name="icon-banka"></v-icon>
                </div>
                <p>办卡</p>
              </div>
              <!-- <div style="flex:1"></div> -->
              <!-- <div class="data-item" @click="toSearch">
                <div>
                  <v-icon name="icon-sousuo1"></v-icon>
                </div>
                <p>搜索</p>
              </div> -->
            </div>
          </div>

          <!-- <div class="index-search-box">
            <div class="index-search" @click="toSearch">
              <div class="index-search-input-box">
                <v-icon name="icon-sousuo1" class="index-search-icon"></v-icon>
                <div type="search" placeholder="车牌号/手机号/客户名" class="index-search-input" disabled style="color:#c7c7c7">车牌号/手机号/客户名</div>
              </div>
            </div>
          </div> -->
          <v-br height="20"></v-br>
          <div class="feature-wrapper" style="padding:10px;">
            <Feature/>
            <!-- <div @click="getCamare">调用拍照</div> -->
            <!-- <div @click="getCamare2">开单模板</div> -->
          </div>
        </div>
      </cube-scroll>

    </div>
    <van-dialog v-model="sysActiveShow" :show-cancel-button="false" :show-confirm-button="false" class="sys-active">
      <div class="sys-active-box"><img :src="url" style="width:100%" @click="toSysActive">
        <span class="sys-active-close" @click="sysActiveShow=false">X</span>
        <div class="sys-active-btn" @click="toSysActive">了解一下</div>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import Feature from '@/components/Feature'

export default {
  components: {
    Feature
  },
  data() {
    return {
      isActive: false,
      sysActiveShow: false,
      searchText: '', // 搜索词
      searchType: false, // 是否显示搜索icon
      isVip: true, // 当前用户是否已升级
      options: {
        probeType: 3,
        pullDownRefresh: {
          threshold: 90,
          stop: 0,
          txt: ' '
        }
      },
      activeData: '',
      url: '',
      adHref: '',
      validDays: 0
    }
  },
  computed: {
    isExp() {
      return this.$store.state.sys.isExp
    },
    storeName() {
      return this.$store.state.sys.currentUser && this.$store.state.sys.currentUser.company && this.$store.state.sys.currentUser.company.name
          ? this.$store.state.sys.currentUser.company.name
          : '去编辑店铺名'
    }
  },
  methods: {
    async getSysActive() {
      let res = await this.$api.SYS_ACTIVE({ type: '1' })
      if (res.status === 1 && res.data.adHref) {
        this.isActive = true
        this.activeData = res.data
        this.url = res.message + '/' + res.data.adPicMobile
        this.adHref = res.data.adHref
        this.sysActiveShow = true
        this.sysActiveTitle = res.data.title
      } else {
        this.isActive = false
        this.sysActiveShow = false
      }
    },
    async getExpDate() {
      let res = await this.$api.CURRENT_USER()
      if (res.status === 1) {
        this.validDays = res.data.validDays
      }
      // console.log(res)
    },
    toSetStore() {
      this.$router.push('/company')
    },
    toBuy() {
      this.$router.push('/buy')
    },
    scroll(o) {
      o.y >= -160 ? (this.searchType = false) : (this.searchType = true)
    },
    toCard() {
      this.$router.push('/addnewcard')
    },
    onPullingDown() {
      this.$refs.scroll.forceUpdate()
    },
    toVip() {
      this.$router.push('/vip')
    },
    toMsg() {
      this.$router.push('/message')
    },
    toOrder() {
      this.$router.push({ name: 'OrderSearch', query: { src: 'kaidan' } })
    },
    toCharge() {
      this.$router.push({ name: 'ChargeActiveList', query: { src: 'chargeactive' } })
    },
    toChargeCard() {
      this.$router.push({ name: 'CardList', query: { src: 'chargeticket' } })
    },
    toFast() {
      this.$router.push({ name: 'OrderSearch', query: { src: 'kuaidan' } })
    },
    showPicker() {},
    toCount() {
      this.$router.push('/count')
    },
    toSearch() {
      this.$router.push({ name: 'Search', params: { src: 'index' } })
    },
    onConfirm(value, index) {
      this.$toast(`当前值：${value}, 当前索引：${index}`)
    },
    onCancel() {
      this.$toast('取消')
    },
    getCamare() {
      this.$api.GET_CAMERA()
    },
    getCamare2() {
      this.$router.push('/tempedit')
    },
    toSysActive() {
      window.location.href = this.adHref
      this.sysActiveShow = false
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$api.SET_STATUSBAR_COLOR('#1690ff')
    })
  },
  beforeRouteLeave(to, from, next) {
    this.$api.SET_STATUSBAR_COLOR('#f8f8f8')
    next()
  },
  created() {
    this.$store.dispatch('getroleMenuNav')
  },
  mounted() {
    if (this.isExp) {
      this.getSysActive()
    }
  },
  activated() {
    this.$store.dispatch('getMessages')
    this.$store.commit('CLEAR_ORDER_CUSTOM')
    this.$store.dispatch('getSmsNum')
    if (this.isExp) {
      this.getExpDate()
    }
    this.$store.dispatch('getCurrentUser')
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';

.store-name {
  font-size: 18px;
  color: #fff;
  padding: 15px;
  line-height: 25px;
  font-weight:600;
  .store-name-icon {
    display: inline-block;
    height: 25px;
    width: 25px;
    border-radius: 25px;
    background: #fff;
    text-align: center;
    line-height: 25px;
    .icon {
      color: #ff8ec7 !important;
    }
  }
}
.header-tip {
  position: relative;
  padding-left:130px;
  padding-right:60px;
  background: #ffdd66;
  font-size: 16px;
  .top-paybtn{
    position: absolute;
    top: 0;
    right:0;
    width: 60px;
    height: 36px;
    .top-paybtn-btn{
      width: 40px;
      height:26px;
      text-align: center;
      line-height: 26px;
      background: #fff9e5;
    color:@danger;
    font-size: 14px;
    border-radius: 4px;
    margin:4px 10px;
    }
  }
  .header-tip-icon{
    position: absolute;
    top:0;
    left:0;
    width: 140px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    font-size: 14px;
    color: #000;
    .icon{
      font-size: 18px;
      color: #ef1c30!important;
    }
  }
  .van-notice-bar {
    font-size: 14px;
  }
  .exp-dasy {
    width: 110px;
    position: absolute;
    top: 0;
    right: 0;
    color: #1690ff;
    line-height: 36px;
    font-size: 14px;
    padding-right: 6px;
  }
}
.sys-active {
  border-radius: 10px;
  overflow: hidden;
  .van-dialog__message {
    padding: 0;
    line-height: 0;
  }
}
.sys-active-box {
  position: relative;
  .sys-active-close {
    width: 50px;
    height: 50px;
    color: #fff;
    font-size: 20px;
    position: absolute;
    top: 0;
    right: 0;
    line-height: 50px;
    text-align: center;
  }
  .sys-active-btn {
    width: 80%;
    margin: 10px auto;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 20px;
    color: #ef1c30;
    background: #ffeb38;
    font-size: 18px;
    font-weight: 600;
    box-shadow: 1px 2px 0px 1px #efb405;
  }
}
.index-search-box {
  position: relative;
  z-index: 9;
  height: 40px;
  background: #f8f8f8;
  .index-search {
    position: absolute;
    width: 100%;
    z-index: 9;
    top: -20px;
    .index-search-input-box {
      background: #fff;
      width: 85%;
      border-radius: 10px;
      display: block;
      margin: 0 auto;
      border: 1px solid @primary;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      position: relative;
      overflow: hidden;
      .index-search-icon {
        position: absolute;
        z-index: 10;
        top: 0;
        left: 8px;
      }
      .icon {
        color: #c7c7c7 !important;
      }
      .index-search-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        text-indent: 25px;
        &::-webkit-input-placeholder {
          color: #c7c7c7 !important;
          text-overflow: ellipsis;
        }
      }
    }
  }
}

.cube-pulldown-wrapper {
  .before-trigger {
    font-size: 14px;
    color: #ddd;
  }
}
.scroller-wrapper {
  position: fixed;
  top: 40px;
  left: 0;
  width: 100%;
  bottom: 50px;
}
.store--title {
  height: 40px;
  display: inline-block;
  line-height: 40px;
  position: absolute;
  top: 0;
  left: 8px;
}

.index {
  color: #666;
  font-size: 18px;
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  // height: 100%;
  background: #ffffff;
  .input-box {
    position: relative;
    margin-bottom: 20px;
    border-radius: 20px;
    .v-input {
      position: absolute;
      top: 0;
      left: 0;
      // border: 1px solid @app;
      border-radius: 22px;
      width: 100%;
      // text-indent: 40px;
      font-size: 14px;
      box-shadow: 0 0 0 2px #2d8cf033;
      border: 1px solid rgba(45, 140, 240, 1);
    }

    .icon {
      vertical-align: 2px;
      position: relative;
      z-index: 99;
      font-size: 16px !important;
    }
    .input-icon-box {
      width: 40px;
      height: 40px;
      display: inline-block;
      text-align: center;
    }
  }

  .index-top-box {
    position: relative;
    background: @primary;
    color: #fff;
    // border-bottom-left-radius: 4px;
    // border-bottom-right-radius: 4px;
  }
  // 左右flex
  .order-data {
    display: flex;
    // justify-content:center ;
    padding: 40px 0 50px 0;
    &.no-vip {
      margin-top: 30px;
    }
    .data-item {
      flex: 1;
      font-style: normal;
      text-align: center;
      // width: 80px;
      height: 80px;
      // border-radius: 50%;
      // padding: 30px 0 50px 0;
      // background: #fff;
      // border: 5px solid #2e9bff;
      color: #fff;
      .icon {
        color: #fff !important;
        font-size: 34px;
        line-height: 1.4;
      }
      p {
        font-size: 18px;
        font-weight: 600;
      }
    }
  }
  .index-shearch {
    display: block;
    position: absolute;
    bottom: -20px;
    left: 30px;
    right: 30px;
    height: 40px;
    line-height: 40px;
  }
}
</style>
