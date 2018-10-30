<template>
  <div class="jztsBox">
    <v-scroll-page top="44">
      <v-header title="自动推送" righticon="icon-zujianku-16" @right-click="handlerTip"></v-header>
      <cube-scroll :data="data">
        <v-br height="20"></v-br>
        <!-- <span class="jzts-count" @click="toRecord">共发送 {{count[0]+count[1]}} 条
          <span v-if="count[1]>0" class="jzts-count-dot"></span>
        </span> -->
        <div class="topListBox" @click="toRecord">
          <div>
            成功发送<span class="successColor"> {{ count[0]}} </span>条，失败<span  class="errorColor"> {{count[1]}} </span>条
          </div>
          <div class="rBox">
            查看<v-icon class="link-icon r_icon" name="icon-youjiantou1" color="#1690ff"></v-icon>
          </div>
          
        </div>
        <v-br height="15"></v-br>
        <div v-if="data.length>0">
          <div v-for="item in data" class="jzts-cell" :key="item.id">
            <div class="jzts-cell-name">
              {{item.name}}
            </div>
            <div class="jzts-cell-desc">
              短信类型：{{item.categoryType.name}} 发送条件：{{item.categoryScene.name}}
            </div>
            <div class="jzts-cell-content">
              {{item.contentPreview}}
            </div>
            <div class="jzts-cell-footer">
              已发送 {{item.smsStore.numSent}} 条
            </div>
            <div class="jzts-cell-switch">
              <van-switch v-model="item.checked" @change="handleChange(item)" />
            </div>
          </div>
        </div>
      </cube-scroll>
    </v-scroll-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      count: [],
      topLitle: ''
    }
  },
  methods: {
    async getData() {
      let res = await this.$api.JZTS({ autoFlag: 1 })
      if (res.status === 1) {
        this.data = res.page.list.map(v => {
          v.checked =
            v.smsStore.pushFlag === undefined
              ? v.pushFlag === '1'
              : v.smsStore.pushFlag === '1'
          return v
        })
      }
    },
    async switch(checked, item) {
      let res = await this.$api.JZTS_ONOFF({ templateId: item.id })
      if (res.status === 1) {
        if (!checked) {
          this.$toast.success('开启成功')
        } else {
          this.$toast.success('关闭成功')
        }
      } else {
        this.$toast.fail('失败')
      }
      this.getData()
    },
    async handleChange(item) {
      let checked =
        item.smsStore.pushFlag === undefined
          ? item.pushFlag === '1'
          : item.smsStore.pushFlag === '1'
      if (checked) {
        this.$dialog
          .confirm({
            title: '确定关闭吗',
            confirmButtonText: '确定',
            message: '关闭后，您的客户将无法收到服务的温馨提示。'
          })
          .then(() => {
            this.switch(checked, item)
          })
          .catch(() => {
            this.getData()
          })
      } else {
        this.switch(checked, item)
      }
    },
    toRecord() {
      this.$router.push('/jztsrecord')
    },
    async getCount() {
      let res = await this.$api.JZTS_COUNT()
      if (res.status === 1) {
        this.count = res.data
      }
    },
    handlerTip() {
      this.$dialog
        .alert({
          title: '说明',
          confirmButtonText: '我知道了',
          message: `
          <div class="jzts-tip">
          <p>1、短信自动推送开启后，当满足发送条件时，自动推送给对应客户。</p>
            <p>2、营销和需增加店铺曝光率类的短信，如节日问候、客户关怀、新品宣传、活动等，需手动推送。</p>
          <p>3、为保证短信发送成功率，系统暂不支持自定义短信。</p>
          <p>4、短信前自带的【车边】，为监管部门规定的短信通道签名，不可更改和删除，如有不便，敬请谅解。</p>
          <p>5、通讯公司规定短信字数<=67个字数，按1条短信计费。</p>
          <p>6、短信发送失败的可能原因。手机号可能有误，或客户手机可能安装了安全软件被拦截到垃圾信箱了，或该客户短时间内接收数量超过了监管规定上限（可稍后尝试）等。</p>
          <div>
          `
        })
        .then(() => {
          // on close
        })
    }
  },
  activated() {
    this.getData()
    this.getCount()
  }
}
</script>

<style lang="less">
@import '../../assets/style/var';
.jztsBox{

  .topListBox{
    width:100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    padding-left: 16px;
    font-size: 18px;
    color: #333333;
    .successColor{
      color: #0dcc6d;
    }
    .errorColor{
      color: #d73962;
    }
    .rBox{
      color: #1690ff;
      font-weight: 500; 
      display: flex;
      align-items: center;
    }
    .r_icon{
      line-height: 50px;
      margin-right: 12px;
    }
  }
}
.jzts-count {
  font-size: 14px;
  color: #1069ff;
  padding-left: 15px;
  position: relative;
  .jzts-count-dot {
    position: absolute;
    height: 8px;
    width: 8px;
    top: 0;
    right: -12px;
    border-radius: 50%;
    background: @danger;
  }
}
.jzts-tip {
  font-size: 16px;
  color: #666;
  height: 300px;
  overflow-y: scroll;
  p {
    line-height: 1.2;
    padding-bottom: 8px;
  }
}
.jzts-cell {
  border-radius: 8px;
  background: #fff;
  width: 95%;
  margin: 10px auto;
  padding: 8px;
  position: relative;
  .jzts-cell-name {
    font-size: 18px;
    color: #333;
  }
  .jzts-cell-desc {
    font-size: 12px;
    color: #999;
    padding: 4px 0 10px 0;
  }
  .jzts-cell-content {
    font-size: 14px;
    color: #666;
    line-height: 1.5;
  }
  .jzts-cell-footer {
    font-size: 12px;
    text-align: right;
    color: #999;
  }
  .jzts-cell-switch {
    position: absolute;
    top: 8px;
    right: 8px;
    text-align: right;
    .van-switch {
      font-size: 24px !important;
    }
  }
}
.jzts_TanBox {
  padding: 24px 20px 35px;
  color: #666666;
  font-size: 16px;
  .jsts_title {
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    color: #333333;
    margin-bottom: 20px;
  }
  .jzts_nr {
    color: #333333;
    font-size: 16px;
    line-height: 22px;
  }
}

.van-dialog .van-dialog__footer.van-dialog__footer--buttons {
  color: #999999;
  font-size: 16px;
}
.van-button--large {
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: #999999;
}
.van-dialog .van-button__text {
  font-size: 16px;
}
.van-dialog__confirm .van-button__text {
  color: #1690ff;
}
// 默认弹框的内容样式
.van-dialog__header {
  font-weight: 500;
  padding-top: 20px;
}
.van-dialog .van-dialog__content .van-dialog__message {
  font-size: 16px;
}
</style>