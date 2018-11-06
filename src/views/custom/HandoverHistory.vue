<template>
  <div>
    <v-header title="交班记录"></v-header>
    <div class="c-scroll-wrapper-top">
      <v-br height="20"></v-br>
      <cube-scroll ref="scroll" :data="data" @pulling-up="onPullingUp" :options="options" @pulling-down="onPullingDown" class="scrollBox">
        <div class="balance-history--item" v-for="item in data" @click="toDetail(item)" :key="item.id">
          <div class="balance-history--title clearfix">
            <div class="fl textover1"> {{item.dutyEmployee.name}}</div>
          </div>
          <div class="balance-history--price">{{item.moneyTotal|currency()}}
            <v-icon name="icon-youjiantou1"></v-icon>
          </div>
          <div class="balance-history--name" >{{item.dutyTime}} </div>
        </div>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
import scroll from '../../common/mixins/scroll.js'
export default {
  mixins: [scroll],
  data() {
    return {
      data: '',
      query: {
        pageNo: 1,
        pageSize: 10
      },
      totalPage: 0
    }
  },
  methods: {
    toDetail(item) {
      this.$router.push({ name: 'HandoverDetail', query: { id: item.id } })
    },
    async getData() {
      let res = await this.$api.EXCHANGE_LIST()
      if (res.status === 1) {
        if (this.query.pageNo === 1) {
          this.data = res.page.list || []
        } else {
          this.data = this.data.concat(res.page.list || [])
        }
        this.totalPage = res.page.totalPage
      } else {
        console.error(res.status + '获取交班列表失败')
      }
    }
  },
  activated() {
    this.getData()
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';
.scrollBox{
  .textover1{
    margin-top: 10px;
    font-size: 18px;
    font-weight: 500;
  }
  .balance-history {
    &--item {
      // height: 80px;
      background: #fff;
      padding: 0 0 0 16px;
      position: relative;
      height: 62px;
      box-sizing: border-box;
    }
    &--title {
      font-size: 16px;
      font-weight: 600;
      color: @primary-text;
      // height: 30px;
      // line-height: 40px;
      overflow: hidden;
      color: #666;
    }
    &--price {
      position: absolute;
      top: 0;
      right: 10px;
      height: 62px;
      line-height: 62px;
      font-size: 18px;
      font-weight: 500;
      color: #333;
      .icon {
        vertical-align: 1px;
        color: @primary!important;
      }
    }
    &--name {
      // height: 30px;
      // line-height: 25px;
      font-size: 14px;
      color: #999;
      .borderB(@dividers);
      margin-top: 10px;
      padding-bottom: 10px;
    }
    .balance-history--item:last-child .balance-history--name{
       background-image: none;
     }
    
  }
}

</style>
