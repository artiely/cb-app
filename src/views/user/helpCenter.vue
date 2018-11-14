<template>
  <div>
    <v-header title="帮助中心"></v-header>
    <v-br height="64"></v-br>
    <van-collapse v-model="activeNames">
      <van-collapse-item title="有赞微商城" name="1">
        提供多样店铺模板，快速搭建网上商城
      </van-collapse-item>
      <van-collapse-item title="有赞零售" name="2">
        网店吸粉获客、会员分层营销、一机多种收款，告别经营低效和客户流失
      </van-collapse-item>
      <van-collapse-item title="有赞美业" name="3" disabled>
        线上拓客，随时预约，贴心顺手的开单收银
      </van-collapse-item>
    </van-collapse>
    <v-cell-group>
      <!-- <v-cell title="客服" link @click.native="toHotLine"></v-cell>
      <v-cell title="我要吐个槽" link @click.native="toShits"></v-cell>
      <v-cell title="使用帮助" link @click.native="switchStore"></v-cell> -->
    </v-cell-group>
  </div>
</template>

<script>
// import { Collapse, CollapseItem } from 'vant'
export default {
  // components: {
  //   Collapse,
  //   CollapseItem
  // },
  methods: {
    toHotLine() {
      this.$router.push('/hotline')
    },
    toShits() {
      this.$router.push('/shits')
    },
    switchStore() {
      this.$dialog.alert({
        message: '亲爱的，该功能暂未对您开放，感谢您的支持与理解'
      })
    }
  }
}
</script>

<style scoped>
</style>
