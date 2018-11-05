<template>
  <div>
    <v-header :title="id?'编辑记账账户':'新增记账账户'" righttext="保存" @right-click="save()" :isBack="true"></v-header>
    <v-scroll-page top="44">
      <cube-scroll>
        <v-br :height="20"></v-br>
        <!-- 卡种样式修改开始 -->
        <v-cell-group style="margin:0">
          <v-cell v-if="!this.$route.query.id" title="账号类型" required link :text="accountCradName" @click.native="cardFn"></v-cell>
          <v-cell v-if="this.$route.query.id" title="账号类型" :text="accountCradName"></v-cell>
        </v-cell-group>
        <v-br :height="20"></v-br>

        <!-- 新增记账账户 -->
        <v-cell-group style="margin-bottom:0">
          <v-cell title="账号名称" required input v-model="query.accountName" placeholder='如“老板娘的微信” (10字内)' :maxlength="10"></v-cell>
          <v-cell title="期初余额" placeholder="请输入改账户期初金额，可不填" type="number" currency input v-model="query.accountBalance"></v-cell>
        </v-cell-group>

        <v-remark v-model="query.remarks"></v-remark>
        <div style="padding:40px" v-if="id">
          <div class="outline" style="border:1px solid #d73962;color:#d73962;text-align:center" @click="delTemp">删除该记账账户</div>
        </div>
      </cube-scroll>
    </v-scroll-page>
    <!-- 卡种 -->
    <van-actionsheet v-model="cardDateShow" :actions="dateactions" class="my-actionsheet">
      <div class="actionsheet-box-wrapper">
        <div class="actionsheet-box actionsheet-box-border" v-for="item in data" @click="sel_cell(item)">
          {{item.name}}
        </div>
      </div>
      <v-br></v-br>
      <div class="actionsheet-box-wrapper" @click="cardDateShow=false">
        <div class="actionsheet-box actionsheet-box-cancel">
          取消
        </div>
      </div>
    </van-actionsheet>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: {
        accountType: '1', // 账户类型 0 现金，1 银行卡 2 支付宝 3 微信
        accountName: '', // 账户名称
        accountBalance: '', // 初期余额  编辑是多少就是多少
        remarks: '',
        isEnable: '1', // 是否启用 0 停用 1启用
        isReceiptDefault: '0', // 是否默认收款账户 0 否 1是
        recordBalance: 0, // 流水余额（系统内收支均改变此余额）
        isPayDefault: '0' // 是否默认付款账户 0 否 1是
      },
      accountCradName: '银行/卡',
      id: '',
      isEdit: false,
      cardDateShow: false, // 选择卡类型
      data: [
        { name: '银行/卡', accountType: 1 },
        { name: '支付宝', accountType: 2 },
        { name: '微信', accountType: 3 }
      ]
    }
  },
  methods: {
    // 返回
    handleLeft() {
      if (this.src === 'accountdetails') {
        this.$router.replace('/accountdetails')
      } else {
        this.$router.replace('/rolemanagement')
      }
    },
    cardFn() {
      this.cardDateShow = true
    },
    // 卡选项
    sel_cell(item) {
      this.query.accountType = item.accountType
      this.accountCradName = item.name
      this.cardDateShow = false
    },
    // 新增
    async save() {
      if (!this.query.accountName) {
        this.$toast.fail('请输入账户名称')
        return
      }
      let res = await this.$api.ADDACCOUNT_LIST({
        id: this.id,
        ...this.query
      })
      if (res.status === 1) {
        this.$toast.success('保存成功')
        if (this.src === 'accountdetails') {
          this.$router.replace({ name: 'accountdetails' })
        } else {
          this.$router.back()
        }
        // 成功 返回 刷新
        this.$router.replace({ name: 'Account', params: { refresh: true } })
      } else if (res.status === 30109) {
        this.$toast('无法新建。记账账户数量已达到上限。')
      } else {
        console.error(`新增记账账户失败${res}`)
      }
    },
    // 编辑获取数据
    async getDetail() {
      // 获取卡详情
      if (!this.id) {
        return
      }
      let res = await this.$api.ACCOUNTDETAILS_LIST({ id: this.id })
      if (res.status === 1) {
        this.query.accountType = res.data.accountType // 账户类型 0 现金，1 银行卡 2 支付宝 3 微信
        this.query.accountName = res.data.accountName // 账户名称
        this.query.accountBalance = res.data.accountBalance // 初期余额  编辑是多少就是多少
        this.query.remarks = res.data.remarks // 备注
        this.query.isEnable = res.data.isEnable // 是否启用 0 停用 1启用
        this.query.isReceiptDefault = res.data.isReceiptDefault // 是否默认收款账户 0 否 1是
        this.query.recordBalance = res.data.recordBalance // 流水余额（系统内收支均改变此余额）
        this.query.isPayDefault = res.data.isPayDefault // 是否默认付款账户 0 否 1是
      } else {
        console.error(`获取卡详情失败${res.stateMessage}`)
      }
    },
    // 删除
    delTemp() {
      this.$dialog
        .confirm({
          title: '确定删除吗？',
          confirmButtonText: '确定',
          message: '删除后将无法恢复。'
        })
        .then(async () => {
          let res = await this.$api.DELACCOUNT_LIST({ id: this.id })
          if (res.status === 1) {
            this.$toast.success('删除成功')
            this.$router.replace({ name: 'Account', params: { refresh: true } })
          }
        })
        .catch(() => {
          // on cancel
        })
    }
  },
  activated() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.isEdit = true
      this.getDetail()
    } else {
      this.id = ''
      this.query.accountType = 1
      this.accountCradName = '银行/卡' // 卡名称默认
      this.query.accountName = '' // 账户名称
      this.query.accountBalance = '' // 初期余额  编辑是多少就是多少
      this.query.remarks = '' // 备注
      this.query.isEnable = '1'
      this.query.isReceiptDefault = '0'
      this.query.recordBalance = '0'
      this.query.isPayDefault = '0'
    }
  }
}
</script>

<style lang="less">
.card-date-col {
  .van-col--8 {
    padding-bottom: 10px;
    .primary {
      color: #fff;
    }
  }
}
.card-date-day {
  text-align: center;
  font-size: 20px;
  height: 30px;
  line-height: 30px;
  color: #666;
  .day-num {
    padding: 0 12px;
    border: 1px solid #c7c7c7;
    border-radius: 2px;
  }
}
.cardtype-radios {
  .van-radio {
    float: left;
    margin-left: 20px;
  }
}
.tishi {
  width: 100%;
  font-size: 12px;
  padding: 5px 16px 5px 16px;
  color: #666666;
  box-sizing: border-box;
  line-height: 18px;
}
.addGoods {
  font-size: 16px;
  font-weight: 500;
}
</style>
