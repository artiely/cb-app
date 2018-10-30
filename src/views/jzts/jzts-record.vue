<template>
  <div>

    <v-header title="发送记录" righticon="icon-xiaotubiao-20" @right-click="handlerFilter" :border="false"></v-header>
    <v-search placeholder="客户名/手机号" v-model="keyword"></v-search>
    <v-scroll-page>
      <cube-scroll :data="data" ref="scroll" @pulling-up="onPullingUp" :options="options" @pulling-down="onPullingDown">
        <v-br height="20"></v-br>
        <div v-if="data.length>0">
          <div v-for="item in data" class="jztsrecord-cell" :key="item.id">
            <div class="jztsrecord-cell-name">
              {{item.recMobile}} {{item.recName}}
            </div>
            <div class="jztsrecord-cell-desc">
              {{item.createDate|timeFormat('YYYY-MM-DD HH:mm:ss')}}
            </div>
            <div class="jztsrecord-cell-content">
              {{item.formatConent}}
            </div>
            <div class="jztsrecord-cell-switch" v-if="!(item.resultFlag=='1'&& item.sendFlag=='1')" @click="reSend(item)">
              <v-button class="">重发</v-button>
            </div>
          </div>
        </div>
      </cube-scroll>
    </v-scroll-page>
    <!-- 筛选 -->
    <van-popup v-model="filterVisiable " position="right " style="width:80%;height:100%; ">
      <v-popup-title @close="filterVisiable=false "></v-popup-title>
      <div class="popup-innerbox " style="padding:10px ">
        <div class="filter-title ">短信类型</div>
        <van-row gutter="20 ">
          <van-col span="8 " v-for="(item) in category " :key="item.name " @click.native="changeType(item) " style="margin-bottom:20px; ">
            <v-button :type="item.id==currType.id? 'primary-solid': '' ">{{item.name}} </v-button>
          </van-col>
        </van-row>
        <div class="filter-title ">发送状态</div>
        <van-row gutter="20 ">
          <van-col span="8 " v-for="(item) in filterStatus " :key="item.name " @click.native="changeStatus(item) " style="margin-bottom:20px; ">
            <v-button :type="item.id==currStatus.id? 'primary-solid': '' ">{{item.name}} </v-button>
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
import scroll from '../../common/mixins/scroll'
export default {
  data() {
    return {
      data: [],
      keyword: '',
      query: {
        pageNo: 1,
        pageSize: 10,
        autoFlag: 1,
        succFailFlag: '',
        'smsTemplate.categoryType.id': '',
        'searchParameter.keyWord': ''
      },
      category: [],
      currType: { name: '全部', id: '' },
      filterVisiable: false,
      currStatus: { name: '全部', id: '' },
      filterTypes: [
        { name: '全部', id: '' },
        { name: '营销类', id: '' },
        { name: '开单类', id: '' }
      ],
      filterStatus: [
        { name: '全部', id: '' },
        { name: '发送成功', id: '1' },
        { name: '发送失败', id: '0' }
      ],
      timer: null
    }
  },
  watch: {
    keyword: {
      handler(val) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.query.pageNo = 1
          this.query['searchParameter.keyWord'] = val
        }, 400)
      }
    }
  },
  mixins: [scroll],
  methods: {
    handleShuRest() {
      this.query.pageNo = 1
      this.query.succFailFlag = ''
      this.query['smsTemplate.categoryType.id'] = ''
      this.currType = { name: '全部', id: '' }
      this.currStatus = { name: '全部', id: '' }
    },
    async getData() {
      let res = await this.$api.JZTS_RECORD(this.query)
      if (res.status === 1) {
        let data = []
        if (this.query.pageNo === 1) {
          data = res.page.list || []
        } else {
          data = this.data.concat(res.page.list || [])
        }
        this.data = data.map(v => {
          let params = {}
          try {
            params = JSON.parse(v.contentParamJson)
          } catch (e) {
            console.error(e)
          }
          let {
            storeName,
            startDate,
            moneySpend,
            moneyUsable,
            moneyErasing,
            moneyCardSpend,
            memberCardName,
            endDate,
            licence,
            servicePhone
          } = params
          v.formatConent = v.content
            .replace('${storeName}', storeName)
            .replace('${startDate}', startDate)
            .replace('${moneySpend}', moneySpend)
            .replace('${moneyErasing}', moneyErasing)
            .replace('${moneyCardSpend}', moneyCardSpend)
            .replace('${memberCardName}', memberCardName)
            .replace('${endDate}', endDate)
            .replace('${licence}', licence)
            .replace('${moneyUsable}', moneyUsable)
            .replace('${servicePhone}', servicePhone)
          return v
        })
        this.totalPage = res.page.totalPage
      }
    },
    async handleChange(item, ok) {},
    handlerFilter() {
      this.filterVisiable = true
    },
    changeType(item) {
      this.currType = item
      this.query.pageNo = 1
      this.query['smsTemplate.categoryType.id'] = item.id
    },
    changeStatus(item) {
      this.currStatus = item
      this.query.pageNo = 1
      this.query.succFailFlag = item.id
    },
    async reSend(item) {
      let res = await this.$api.JZTS_SMSRESEND({ id: item.id })
      if (res.status === 1) {
        this.$toast.success('成功')
        this.getData()
      } else {
        this.$toast.fail('失败')
      }
    },
    async getCategory() {
      let res = await this.$api.JZTS_CATEGORY({ depth: 1 })
      if (res.status === 1) {
        this.category = [{ name: '全部', id: '' }, ...res.list]
      }
    }
  },
  activated() {
    this.getData()
    this.getCategory()
  }
}
</script>

<style scoped lang="less">
@import '../../assets/style/var';
.jztsrecord-cell {
  border-radius: 8px;
  background: #fff;
  width: 95%;
  margin: 10px auto;
  padding: 8px;
  position: relative;
  .jztsrecord-cell-name {
    font-size: 16px;
    color: #333;
  }
  .jztsrecord-cell-desc {
    font-size: 12px;
    color: #999;
    padding: 4px 0 10px 0;
  }
  .jztsrecord-cell-content {
    font-size: 14px;
    color: #666;
    line-height: 1.5;
  }
  .jztsrecord-cell-footer {
    font-size: 12px;
    text-align: right;
    color: #999;
  }
  .jztsrecord-cell-switch {
    position: absolute;
    width: 60px;
    top: 8px;
    right: 8px;
    text-align: right;
    .c_button--wrapper {
      background: @danger;
      color: #fff;
    }
  }
}
</style>