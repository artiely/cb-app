<template>
  <!-- 新增客户 -->
  <div class="active-info">
    <v-header title="详情" :border="true">
      <div slot="righttext" @click="toNewChargeActive()">编辑</div>
    </v-header>
    <div class="c-scroll-wrapper-top">
      <v-br :height="20"></v-br>
      <v-cell-group class="ActiveInfo">
        <v-cell title="启用状态">
          <div slot="right" class="right-slot">
            <van-switch v-model="checked" @input="upDown" />
          </div>
        </v-cell>
      </v-cell-group>
      <v-cell-group style="margin-bottom:5px;">
        <v-cell title="充值金额" :text="data.money|currency()"></v-cell>
        <v-cell title="赠送金额" :text="data.moneyGift|currency()"></v-cell>
      </v-cell-group>
      <!-- <v-cell-group>
        <v-cell title="备注" :text="data.remarks"></v-cell>
      </v-cell-group> -->
      <v-remark v-model="data.remarks" disabled v-if="data.remarks"></v-remark>
    </div>
    <!-- <v-footer v-if="data.isActive!=0">
      <v-footer-item @click.native="toCharge">充值</v-footer-item>
    </v-footer> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: true,
      data: {},
      id: ''
    }
  },
  methods: {
    async upDown() {
      await this.$api.CHARGE_ACTIVE_SWITCH({ id: this.id })
      this.getData(true)
    },
    // toCharge() {
    //   if (this.data.isActive === '0') {
    //     return
    //   }
    //   this.$router.replace({ name: 'ChargeActive', query: { id: this.id } })
    // },
    toNewChargeActive() {
      this.$router.push({
        name: 'NewChargeActive',
        query: { id: this.id }
      })
    },
    async getData(update) {
      let res = await this.$api.CHARGE_ACTIVE_DETAIL({
        id: this.id
      })
      if (res.status === 1) {
        if (res.data.isActive === '0') {
          this.checked = false
          if (update === true) {
            this.$toast.success('已停用')
          }
        } else {
          this.checked = true
          if (update === true) {
            this.$toast.success('已启用')
          }
        }
        this.data = res.data
      } else {
        console.error(`获取列表失败${res.stateMessage}`)
      }
    }
  },
  activated() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
    }
    this.getData()
  }
}
</script>

<style lang="less">
.ActiveInfo {
  .c_cell {
    .right-slot {
      text-align: right !important;
      .van-switch {
        margin-top: 13px;
        width: 40px;
        height: 20px;
        .van-switch__node {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
}

.outline {
  border: 1px solid #d73962 !important;
}
.outline:active {
  color: #fff !important;
  background: #d73962 !important;
}
</style>
