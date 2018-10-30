<template>
  <div>
    <v-header @to-back="toBack" title="营销统计"></v-header>
    <div class="content">
      <!-- <div class="c_tab">
        <div class="c_tab_item"></div>
        <div class="c_tab_item" v-for="(item, index) in tabList" :key="index" @click="switchTab(index)" :class="{active: currentPage === index}">{{item.text}}</div>
        <div class="c_tab_item"></div>
      </div> -->
      <van-row gutter="10" style="padding:10px;">
        <van-col span="6">
          <v-button type="primary">今天</v-button>
        </van-col>
        <van-col span="6">
          <v-button>本周</v-button>
        </van-col>
        <van-col span="6">
          <v-button>本月</v-button>
        </van-col>
        <van-col span="6">
          <v-button>本年</v-button>
        </van-col>
      </van-row>
      <div class="match-list-wrapper">
        <cash-count></cash-count>
      </div>
      <!-- <div class="statistics">
        <cube-slide :data="tabList" :initialIndex="currentPage" :loop="false" :autoPlay="false" :threshold="0.1" @change="slideChange">
          <cube-slide-item>
            <div class="match-list-wrapper">
              <cash-count></cash-count>
            </div>
          </cube-slide-item>
          <cube-slide-item>
            <div class="match-list-wrapper">
              <busi-count></busi-count>
            </div>
          </cube-slide-item>
          <div slot="dots"></div>
        </cube-slide>
      </div> -->
    </div>

  </div>
</template>

<script>
// import CashCount from './CashCount'
// import BusiCount from './BusiCount'
export default {
  components: {
    // CashCount,
    // BusiCount
  },
  data() {
    return {
      currentPage: 0,
      tabList: [
        {
          text: '收银统计'
        },
        {
          text: '营业统计'
        }
      ]
    }
  },
  methods: {
    toBack() {
      this.$router.go(-1)
    },
    switchTab(index) {
      this.currentPage = index
    },
    slideChange(index) {
      this.currentPage = index
    }
  }
}
</script>

<style lang="stylus">
.time_wrapper {
  padding: 10px 20px;
  display: flex;
  .c_btn_box {
    flex: 1;
  }
}
.c_c_btn {
  height: 24px;
  line-height: 24px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid #c7c7c7;
  display: inline-block;
  font-size: 14px;
  color: #c7c7c7;
  &.active {
    box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
    border: 1px solid rgba(45, 140, 240, 1);
    color: rgba(45, 140, 240, 1);
  }
}
.content {
  margin-top: 40px;
}
.c_tab {
  display: flex;
  height: 40px;
  line-height: 50px;
  font-size: 14px;
  text-align: center;
  .c_tab_item {
    flex: 1;
    text-align: center;
    border-bottom: 2px solid #fff;
    &.active {
      border-bottom: 2px solid #52acff;
      color: #52acff;
    }
  }
}
</style>
