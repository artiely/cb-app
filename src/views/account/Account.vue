<template>
  <div class="accountinfo">
    <v-header title="记账账户" :left-click="toBack" :border="false"></v-header>
    <v-br :height="50" style="background:#f8f8f8"></v-br>
    <v-tab-bar :data="tab" v-model="active" style="background:#f8f8f8"></v-tab-bar>

    <v-scroll-page top="90" style="overflow-y:scroll">
      <div class="clearfix" v-if="valShow==0">
        <span class="refresh">拖动刷新</span>
      </div>
      <v-br height="20" v-if="valShow==1"></v-br>
      <div v-if="data.length>0">
        <div class="account">
          <draggable v-model="allList" :move="getmove" @update="datadragEnd" :options="{animation:500,handle:'.account_sort'}" :no-transition-on-drag="true" @start="drag=true" @end="drag=false">
            <div class="account_info clearfix" v-for="item in allList " :key="item.id">
              <div class="account_left enable" @click="accountdetailsFn(item)" :class="item.isEnable==='0'?'disable':'enable'">
                <!-- 支付宝 -->
                <v-icon name="icon-xiaotubiao-9" class="xianjingfu2" v-if="item.accountType==0"></v-icon>
                <v-icon name="icon-zu" class="yinghangka" symbol v-if="item.accountType==1"></v-icon>
                <v-icon name="icon-xiaotubiao-27" class="zhifubao" v-if="item.accountType==2"></v-icon>
                <v-icon name="icon-weixinzhifu" class="payIcon weixin" v-if="item.accountType==3"></v-icon>
                <!-- 现金付 -->
                <div class="account_dec">
                  <span style="font-size: 18px;">{{item.accountBalance+item.recordBalance|currency('￥')}}</span><br>
                  <span class="font_min">{{item.accountName}}</span>
                </div>
                <div class="account_right">
                  <span class="details" :class="{'no_account_sort':item.isEnable==='0'}">详情</span>
                </div>
              </div>
              <!-- 排序 -->
              <div class="account_sort account_right" :class="{'disabled':item.isEnable==='0'}">
                <span class="account_sort_bg ">
                  <i class="icon iconfont icon-shunxuqiehuan"></i>
                </span>
              </div>
            </div>
          </draggable>
        </div>
        <v-br height="100"></v-br>
      </div>
      <!-- 暂无数据 -->
      <v-nodata v-else :placeholder="placeholder" hasadd="1"></v-nodata>
    </v-scroll-page>
    <!-- 新增记账账户按钮 -->
    <v-fad-button @click.native="toNewChargeActive"></v-fad-button>
  </div>
  <!-- 卡种 -->
</template>

<script>
import draggable from 'vuedraggable'
import FilterBar from '../../components/FilterBar'
export default {
  components: {
    FilterBar,
    draggable
  },
  data() {
    return {
      data: [],
      cardDateShow: false, // 新增账号显示
      allList: [], // 列表数据
      accountType: '0', // 账户类型 0现金 1银行卡 2支付宝 3微信
      isEnable: '1', // 1启用,0禁用
      valShow: '',
      active: 0,
      tab: [{ name: '已启用', id: 0 }, { name: '已停用', id: 1 }],
      filterBarList: [],
      currCarType: '', // 当前的卡类型
      ableData: [], // 启用数据
      enableData: [], // 禁用数据
      currUsableType: '', // 当前的卡状态
      drag: false, // 拖动
      currMoveDate: {},
      placeholder: '无记账账户，点击新增'
    }
  },
  watch: {
    // tab切换
    active: {
      handler(val) {
        if (val) {
          this.allList = this.data.filter(v => {
            return v.isEnable === '0'
          })
        } else {
          this.allList = this.data.filter(v => {
            return v.isEnable === '1'
          })
        }
        this.valShow = val
        console.log(this.valShow)
      },
      immediate: true
    },
    filter: {
      handler(val) {
        this.filterBarList = val
      }
    }
  },
  methods: {
    // 返回
    toBack() {
      this.$router.replace('/accountmanagement')
    },
    // 新增
    toNewChargeActive() {
      this.$router.push('/addaccount')
    },
    // 账户详情
    accountdetailsFn(item) {
      this.$router.push({ name: 'AccountDetails', query: { id: item.id } })
    },
    // 列表数据
    async getData(evt) {
      let res = await this.$api.ACCOUNT_LIST()
      if (res.status === 1) {
        this.data = res.list || []
        for (let i = 0; i < this.allList; i++) {
          this.query.isEnable = this.allList[i].isEnable
          this.accountType = this.allList[i].accountType // 账户类型
        }

        if (this.active) {
          // 禁用数据
          this.allList = this.data.filter(v => {
            return v.isEnable === '0'
          })
        } else {
          // 启用数据
          this.allList = this.data.filter(v => {
            return v.isEnable === '1'
          })
        }
      } else {
        console.error('获取数据失败')
      }
    },
    getmove(evt) {
      this.currMoveDate = evt.draggedContext.element
    },
    // 排序
    datadragEnd(evt) {
      let val = this.allList
      let arrIds = val.map(v => {
        return v.id
      })
      this.$api.ACCOUNT_SORT({ ids: arrIds.join() }).then(res => {
        if (res.status === 1) {
          this.$toast.success('排序已更新')
        }
      })
    }
  },
  created() {
    this.getData()
  },
  activated() {
    // 已停用、新增、编辑、删除完后重新请求刷新页面
    if (this.$route.params.refresh) {
      this.getData()
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/border';
.accountinfo {
  .c_header .c_header_title,
  .rightarrow i {
    color: #333;
  }
  .cb_store-icon-box,
  .cb_store-info {
    display: inline-block;
    vertical-align: middle;
  }
  .cb_store-icon-box {
    padding: 0 9px 0 0;
  }
  .accountinfo .weixin i,
  .zhifubao i,
  .xianjingfu2 i,
  .yinghangka svg {
    font-size: 44px;
  }
  .weixin i {
    color: rgb(13, 204, 109) !important;
  }
  .zhifubao i {
    color: rgb(17, 148, 227) !important;
  }
  .xianjingfu2 i {
    color: rgb(22, 144, 255) !important;
  }

  .refresh {
    float: right;
    color: #b0b0b0;
    padding: 18px 15px 6px 0;
  }
  .account {
    width: 100%;
    background: #fff;
    padding-left: 15px;
  }
  /*判断启用禁用*/
  .enable {
    width: 80%;
  }
  .disable {
    width: 100%;
  }
  .account_left {
    float: left;
    padding: 5px 0;
  }
  .account_right {
    float: right;
  }
  .account_info {
    background: #fff;
  }
  .account_info:not(:last-child){
    .borderB();
  }
  .account_dec,
  .moneyIcon {
    display: inline-block;
    vertical-align: middle;
  }
  .account_dec span {
    line-height: 28px;
  }
  .moneyIcon {
    height: 44px;
    width: 44px;
    line-height: 44px;
    text-align: center;
    border-radius: 50%;
    background: #1690ff;
  }
  .moneyIcon i {
    color: #f0f0f0 !important;
    font-size: 25px;
  }
  .font_min,
  .details {
    font-size: 14px;
  }
  .account_sort_bg i {
    font-size: 10px !important;
  }
  .font_min,
  .account_sort_bg i {
    color: #999;
  }
  .details {
    color: #1690ff;
    line-height: 54px;
  }
  .account_sort {
    width: 40px;
    height: 65px;
    text-align: center;
    line-height: 42px;
    background: #f8f8f8;
    line-height: 65px;
  }
  .account_sort_bg {
    height: 100%;
    display: inline-block;
  }
  .weixin i {
    font-size: 38px;
    color: rgb(13, 204, 109);
  }
  .no_account_sort {
    padding-right: 16px;
  }
  .disabled {
    display: none;
  }
}
</style>
