<template>
  <div class="record-jyb1">
    <v-header title="账户管理" :left-click="handleLeft" :border="false" class="blackicon">
    </v-header>
    <v-scroll-page top="44">
      <div class="aggregate clearfix">
        <div class="balance-history--item">
          <div class="balance-history--title clearfix">
            <div class="fl textover1"> 账户余额合计</div>
          </div>
          <div class="balance-history--price" style="display: inline-block;">{{managementList.allAccountBalance|currency('￥')}}
          </div>
          <div class="fr" style="height:50px;" @click="accountJump">
            <span>收支账本</span>
            <v-icon name="icon-youjiantou1" class="rightarrow"></v-icon>
          </div>
        </div>
      </div>
      <v-br height="20"></v-br>
      <div class="balance-history--item-info" @click="accountTips">
        <div class="balance-history--title_b font_l first_border clearfix">
          <div class="fl textover1 color_a"> 扫码收款账号户</div>
          <div class="fr title_a">
            <span class="color_b">仅对部分店铺开放</span>
            <v-icon name="icon-youjiantou1" class="color_d"></v-icon>
          </div>
        </div>
      </div>

      <div class="balance-history--item-info" @click="accountdetailsJump">
        <div class="balance-history--title_b font_l clearfix title_r">
          <div class="fl textover1 color_a"> 记账账户</div>
          <div class="fr title_a">
            <span class="color_c">{{managementList.chargeAccountBalance|currency('￥')}}</span>
            <v-icon name="icon-youjiantou1" class="color_d"></v-icon>
          </div>
        </div>
      </div>
    </v-scroll-page>
  </div>
</template>

<script>
import Account from '../../components/Account'
export default {
  components: {
    Account
  },
  data() {
    return {
      managementList: [] // 接口数据
    }
  },
  methods: {
    // 返回
    handleLeft() {
      this.$router.replace('/index')
    },
    // 收支账本
    accountJump() {
      // this.$router.push('/account')
      this.$router.push('/balancepaymentcount')
    },
    // 记账账户
    accountdetailsJump() {
      this.$router.push('/account')
    },
    // 提示
    accountTips() {
      this.$router.push('/accounttips')
    },
    // 获取数据
    async getData() {
      let res = await this.$api.ACCOUNTMANAGEMENT_ALL()
      if (res.status === 1) {
        this.managementList = res.data || []
      } else {
        console.error('获取数据失败')
      }
    }
  },
  activated() {
    // this.active = 0
    this.getData()
  }
}
</script>

<style  lang="less">
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';
.record-jyb1 .bule {
  background: #1690ff !important;
}
.record-jyb1 .c_header .c_header_title,
.record-jyb1 .rightarrow i {
  color: #fff !important;
}
.record-jyb1 .aggregate {
  height: 106px;
  background: #1690ff !important;
  padding: 28px 16px 28px 12px;
  color: #fff !important;
}
.record-jyb1 {
  .blackicon {
    background: #1690ff;
    .c_header_left .icon {
      color: #fff !important;
    }
    .c_header_title {
      color: #fff !important;
    }
  }
  .balance-history--title {
    font-size: 14px;
  }
  .balance-history--price {
    font-size: 28px;
    margin: 10px 0 0 -5px;
  }
  .balance-history--item-info {
    padding-left: 16px;
    height: 50px;
    background: #fff;
    line-height: 50px;
  }
  .first_border {
    .borderB();
  }
  .font_l {
    font-size: 16px;
  }
  .color_a {
    color: #666;
  }
  .color_b {
    color: #c7c7c7;
  }
  .color_c {
    color: #333;
  }
  .color_d i {
    margin-right: 16px;
    color: #1690ff !important;
  }
  .title_r {
    position: relative;
  }
  .title_a {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
