<template>
  <div class="motortypt">
    <van-popup v-model="value" style="width:100%;height:100%" position="bottom">
      <v-header title="请选择车型" :border="false" :left-click="closePopup"></v-header>
      <v-search placeholder="可直接输入车系搜索"></v-search>

      <div class="weui-wepay-flow weui-wepay-flow_vertical" style="padding:20px;" :class="styleFlage==0?'clickb':'clicka'">
        <div class="weui-wepay-flow__bd">
          <div v-for="(item,index) in result" @click="handleResult(item)" :key="item.id">
            <div class="weui-wepay-flow__li weui-wepay-flow__li_done">
              <!-- 实心 -->
              <div class="weui-wepay-flow__state" :class="{'shixin_c':result.length>=3,'kongxin_c':index==3}"></div>
              <p class="weui-wepay-flow__title-right"> {{item.name}}</p>
            </div>

            <div class="weui-wepay-flow__line weui-wepay-flow__line_done" :class="{'weui-none':index==3}">
              <div class="weui-wepay-flow__process"></div>
            </div>
          </div>
          <div class="weui-wepay-flow__li">
            <!-- 空心 -->
            <div class="weui-wepay-flow__state" v-if="result.length<=3&&result.length!==0"></div>
            <p class="weui-wepay-flow__title-right" v-if="result.length==1">请选择厂商</p>
            <p class="weui-wepay-flow__title-right" v-if="result.length==2">请选择车系</p>
            <p class="weui-wepay-flow__title-right" v-if="result.length==3">请选择车型</p>
          </div>
        </div>
      </div>

      <v-scroll-page :top="top" style="margin-top:0px;" class="scroll_page">
        <scroller :on-refresh="refresh" :on-infinite="infinite">
          <p class="pselect" v-if="result.length==0" :class="styleFlage==0?'':'marginTop'">选择品牌</p>
          <p class="pselect" v-if="result.length==1" :class="styleFlage==0?'':'marginTop'">选择厂商</p>
          <p class="pselect" v-if="result.length==2" :class="styleFlage==0?'':'marginTop'">选择车系</p>
          <p class="pselect" v-if="result.length==3" :class="styleFlage==0?'':'marginTop'">选择车型</p>
          <div v-for="(item,index) in data" class="motortype-cell" @click="checkCell(item)" :key="item.id">
            <span class="carModel" style="margin-top:10px;"> {{item.name}}</span>
            <span class="checkOption">
              <i class="icon iconfont icon-duigou1" v-if="index==currSelectIndex"></i>
              <!-- <v-icon name="icon-duigou1" class="duigou" v-if="index==currSelectIndex"></v-icon> -->
            </span>
          </div>
        </scroller>
      </v-scroll-page>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'v-motor-type',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    resultData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      query: {
        pageNo: 1,
        pageSize: 42,
        type: '1',
        parentId: ''
      },
      totalPage: 0,
      data: [],
      currentLevel: 1,
      result: this.resultData,
      currSelectId: '',
      currSelectIndex: 0,
      styleFlage: 0
    }
  },
  computed: {
    top() {
      if (this.result.length === 0) {
        return 94 + this.result.length * 40 + 17
      } else if (this.result.length === 1) {
        return 94 + this.result.length * 40 + 40
      } else if (this.result.length === 2) {
        return 94 + this.result.length * 40 + 27
      } else if (this.result.length === 3) {
        return 94 + this.result.length * 40 + 15
      } else if (this.result.length === 4) {
        return 94 + this.result.length * 40 - 17
      }
    }
  },
  watch: {
    result: {
      handler(val) {
        this.$emit('update:resultData', val)
      },
      deep: true
    }
  },
  methods: {
    async getData(done) {
      let res = await this.$api.MOTOR_TYPE(this.query)
      // 作用域
      let vm = this
      function _findIndex(element) {
        return element.id === vm.currSelectId
      }
      if (res.status === 1) {
        if (this.query.pageNo === 1 || this.query.pageNo === '1') {
          this.data = res.page.list || []
        } else {
          this.data = this.data.concat(res.page.list || [])
        }
        this.totalPage = res.page.totalPage
        this.currentLevel = Number(res.message)
        this.currSelectIndex = this.data.findIndex(_findIndex)
        console.log('index--', this.currSelectIndex)
        done && done()
      }
    },
    handleResult(item) {
      function findFirstLargeNumber(element) {
        return element.id === item.id
      }
      console.log('item', item)
      this.currSelectId = item.id
      var index = this.result.findIndex(findFirstLargeNumber)
      console.log('index', index)
      if (index === 0) {
        this.query.parentId = ''
        this.query.type = '1'
      } else if (index !== 0 && index !== -1) {
        this.query.parentId = this.result[index - 1].id
        this.query.type = index + 1
      }
      this.query.pageNo = 1
      this.getData()
    },
    checkCell(item) {
      this.styleFlage = 1
      this.getResult({ type: this.currentLevel, categoryId: item.id })
      if (this.currentLevel === 4) {
        this.$emit('input', false)
        return
      }
      this.query.parentId = item.id
      this.query.type = this.currentLevel + 1
      this.query.pageNo = 1
      this.getData()
    },
    async getResult(data) {
      let res = await this.$api.MOTOR_TYPE_RESULT(data)
      if (res.status === 1) {
        this.result = res.data
      }
    },
    refresh(done) {
      this.query.pageNo = 1
      this.getData(done)
    },
    infinite(done) {
      if (this.totalPage > this.query.pageNo) {
        this.query.pageNo++
        this.getData(done)
      } else {
        done && done()
      }
    },
    closePopup() {
      this.$emit('input', false)
    }
  },
  activated() {
    this.getData()
  }
}
</script>

<style scoped>
.clickb {
  background: rgb(232, 232, 232);
}
.clicka {
  background: #fff;
}
.marginTop {
  margin-top: 10px;
}
.weui-none {
  display: none;
}
.pselect {
  margin-left: 15px;
  color: #81818e;
}
.motortype-cell {
  height: 45px;
  line-height: 45px;
  padding-left: 5%;
  font-size: 15px;
}
.checkOption {
  padding-left: 5px;
}
.checkOption i {
  color: rgb(23, 144, 255) !important;
  font-size: 22px;
}
.weui-wepay-flow__bd {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  -webkit-box-align: left;
  -webkit-align-items: baseline;
  align-items: baseline;
}
.weui-wepay-flow__li {
  width: 12px;
  height: 12px;
  position: relative;
  z-index: 1;
}
.weui-wepay-flow__li .weui-wepay-flow__state {
  /*空心蓝色*/
  position: absolute;
  left: 0;
  top: 0;
  width: 14px;
  height: 14px;
  font-size: 10px;
  line-height: 14px;
  text-align: center;
  color: #fff;
  border: 1px solid #1690ff;
  border-radius: 7px;
  box-sizing: border-box;
}
.weui-wepay-flow__state {
  background-color: #e2e2e2;
}
.weui-wepay-flow__li_done .weui-wepay-flow__state {
  /*实心蓝色*/
  background-color: #1690ff;
}
.kongxin_c {
  background-color: #e2e2e2 !important;
}
.shixin_c {
  background-color: #1690ff;
}
[class^='weui-wepay-flow__title-'],
[class*=' weui-wepay-flow__title-'] {
  position: absolute;
  color: #1690ff;
  font-size: 14px;
  font-weight: normal;
  white-space: nowrap;
  text-align: center;
}
.weui-wepay-flow__title-top {
  bottom: 20px;
  left: 50%;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
}
.weui-wepay-flow__li_done .weui-wepay-flow__title-top {
  color: #333;
}
.weui-wepay-flow__title-bottom {
  top: 20px;
  left: 50%;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
}
.weui-wepay-flow__li_done .weui-wepay-flow__title-bottom {
  color: #333;
}
.weui-wepay-flow__title-left {
  right: 30px;
  top: 50%;
  -webkit-transform: translate(0, -50%);
  transform: translate(0, -50%);
  text-align: right;
}
.weui-wepay-flow__li_done .weui-wepay-flow__title-left {
  color: #333;
}
.weui-wepay-flow__title-right {
  left: 30px;
  top: 50%;
  -webkit-transform: translate(0, -50%);
  transform: translate(0, -50%);
  text-align: left;
}
.weui-wepay-flow__li_done .weui-wepay-flow__title-right {
  color: #333;
}
[class^='weui-wepay-flow__intro-'],
[class*=' weui-wepay-flow__intro-'] {
  height: 20px;
  line-height: 20px;
  background-color: #ff8a00;
  font-size: 10px;
  color: #fff;
  white-space: nowrap;
  padding: 0 6px;
  position: relative;
  border-radius: 4px;
}
[class^='weui-wepay-flow__intro-']:after,
[class*=' weui-wepay-flow__intro-']:after {
  content: '';
  display: inline-block;
  width: 0;
  height: 0;
  overflow: hidden;
  font-size: 0;
  position: absolute;
}
.weui-wepay-flow__intro-top {
  bottom: 25px;
  left: 50%;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
  position: absolute;
}
.weui-wepay-flow__intro-top:after {
  border-color: #ff8a00 transparent transparent transparent;
  border-style: solid;
  border-width: 5px 3px;
  left: 50%;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
  bottom: -10px;
}
.weui-wepay-flow__intro-bottom {
  top: 25px;
  left: 50%;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
  position: absolute;
}
.weui-wepay-flow__intro-bottom:after {
  border-color: transparent transparent #ff8a00 transparent;
  border-style: dashed dashed solid dashed;
  border-width: 5px 3px;
  left: 50%;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
  top: -10px;
}
.weui-wepay-flow__intro-right {
  left: 36px;
  top: 50%;
  -webkit-transform: translate(0, -50%);
  transform: translate(0, -50%);
  position: absolute;
}
.weui-wepay-flow__intro-right:after {
  border-color: transparent #ff8a00 transparent transparent;
  border-style: solid;
  border-width: 3px 5px;
  top: 50%;
  -webkit-transform: translate(0, -50%);
  transform: translate(0, -50%);
  left: -10px;
}
.weui-wepay-flow__intro-left {
  right: 36px;
  top: 50%;
  -webkit-transform: translate(0, -50%);
  transform: translate(0, -50%);
  position: absolute;
}
.weui-wepay-flow__intro-left:after {
  border-color: transparent transparent transparent #ff8a00;
  border-style: solid;
  border-width: 3px 5px;
  top: 50%;
  -webkit-transform: translate(0, -50%);
  transform: translate(0, -50%);
  right: -10px;
}
[class^='weui-wepay-flow__info-'] {
  height: 14px;
  line-height: 14px;
  /* background-color: #09bb07; */
  background-color: #1690ff;
  font-size: 10px;
  color: #fff;
  white-space: nowrap;
  padding: 0 6px;
  position: relative;
  border-radius: 2px;
  position: absolute;
}
[class^='weui-wepay-flow__info-']:after {
  content: '';
  display: inline-block;
  width: 0;
  height: 0;
  overflow: hidden;
  font-size: 0;
  position: absolute;
}
.weui-wepay-flow__line_ing [class^='weui-wepay-flow__info-'] {
  display: block;
}
.weui-wepay-flow__info-top {
  display: none;
  left: 50%;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
  bottom: 11px;
}
.weui-wepay-flow__line_ing .weui-wepay-flow__info-top {
  display: block;
}
/* .weui-wepay-flow__info-top:after {
  border-color: #1690ff transparent transparent transparent;
  border-style: solid;
  border-width: 5px 3px;
  left: 50%;
  -webkit-transform: translate(-50%, 0);
          transform: translate(-50%, 0);
  bottom: -10px;
} */
.weui-wepay-flow__info-bottom {
  display: none;
  left: 50%;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
  top: 11px;
}
.weui-wepay-flow__line_ing .weui-wepay-flow__info-bottom {
  display: block;
}
.weui-wepay-flow__info-bottom:after {
  border-color: transparent transparent #09bb07 transparent;
  border-style: dashed dashed solid dashed;
  border-width: 5px 3px;
  left: 50%;
  -webkit-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
  top: -10px;
}
.weui-wepay-flow__info-left {
  display: none;
  top: 50%;
  -webkit-transform: translate(0, -50%);
  transform: translate(0, -50%);
  right: 12px;
}
.weui-wepay-flow__line_ing .weui-wepay-flow__info-left {
  display: block;
}
.weui-wepay-flow__info-left:after {
  border-color: transparent transparent transparent #09bb07;
  border-style: solid;
  border-width: 3px 5px;
  top: 50%;
  -webkit-transform: translate(0, -50%);
  transform: translate(0, -50%);
  right: -10px;
}
.weui-wepay-flow__info-right {
  display: none;
  top: 50%;
  -webkit-transform: translate(0, -50%);
  transform: translate(0, -50%);
  left: 12px;
}
.weui-wepay-flow__line_ing .weui-wepay-flow__info-right {
  display: block;
}
.weui-wepay-flow__info-right:after {
  border-color: transparent #09bb07 transparent transparent;
  border-style: solid;
  border-width: 3px 5px;
  top: 50%;
  -webkit-transform: translate(0, -50%);
  transform: translate(0, -50%);
  left: -10px;
}
.weui-wepay-flow__line {
  /*灰色*/
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  background-color: #e2e2e2;

  position: relative;
}

.weui-wepay-flow__title {
  color: #999999;
  font-size: 14px;
  font-weight: normal;
}
.weui-wepay-flow__info {
  color: #999999;
  font-size: 12px;
}
.weui-wepay-flow__process {
  /*线条*/
  display: none;
  background-color: #1690ff;
  height: 3px;
  position: relative;
}
.weui-wepay-flow__line_ing .weui-wepay-flow__process {
  display: block;
  width: 50%;
}
.weui-wepay-flow__line_done .weui-wepay-flow__process {
  display: block;
}
.weui-wepay-flow_custom .weui-wepay-flow__bd {
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  justify-content: flex-start;
}
.weui-wepay-flow_custom .weui-wepay-flow__line {
  -webkit-box-flex: 0;
  -webkit-flex: none;
  flex: none;
  width: 100px;
}
.weui-wepay-flow_vertical .weui-wepay-flow__bd {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}
.weui-wepay-flow_vertical .weui-wepay-flow__line {
  height: 15px;
  /* height: auto; */
  width: 3px;
  margin-left: 5px;
}
/* .weui-wepay-flow_vertical .weui-wepay-flow__line_d {
  height: 22px;
} */
.weui-wepay-flow_vertical .weui-wepay-flow__line_ing .weui-wepay-flow__process {
  height: 50%;
}
.weui-wepay-flow_vertical .weui-wepay-flow__process {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
}
.weui-wepay-flow_vertical
  .weui-wepay-flow__line_done
  .weui-wepay-flow__process {
  height: 100%;
}
.weui-wepay-flow_vertical-custom .weui-wepay-flow__bd {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}
.weui-wepay-flow_vertical-custom .weui-wepay-flow__line {
  width: 3px;
  -webkit-box-flex: 0;
  -webkit-flex: none;
  flex: none;
}
.weui-wepay-flow_vertical-custom
  .weui-wepay-flow__line_ing
  .weui-wepay-flow__process {
  height: 50%;
}
.weui-wepay-flow_vertical-custom .weui-wepay-flow__process {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
}
.weui-wepay-flow_vertical-custom
  .weui-wepay-flow__line_done
  .weui-wepay-flow__process {
  height: 100%;
}
.weui-wepay-flow-auto {
  position: relative;
}
.weui-wepay-flow-auto__bd {
  position: relative;
}
.weui-wepay-flow-auto__state {
  position: absolute;
  left: 0;
  top: 4px;
  width: 14px;
  height: 14px;
  font-size: 10px;
  line-height: 14px;
  text-align: center;
  color: #fff;
  border-radius: 7px;
  background-color: #e2e2e2;
  z-index: 2;
}
.weui-wepay-flow-auto__state_on {
  background-color: #09bb07;
}
.weui-wepay-flow-auto__line {
  position: absolute;
  width: 2px;
  background-color: #dddddd;
  top: 10px;
  bottom: -4px;
  left: 6px;
  z-index: 1;
}
.weui-wepay-flow-auto__line_on {
  background-color: #09bb07;
}
.weui-wepay-flow-auto__li {
  position: relative;
  padding-bottom: 20px;
  padding-left: 30px;
}
.weui-wepay-flow-auto__title {
  color: #999999;
  font-size: 14px;
  font-weight: normal;
}
.weui-wepay-flow-auto__info {
  color: #999999;
  font-size: 12px;
}
</style>
