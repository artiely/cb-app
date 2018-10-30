<template>
  <div>
    <div class="wrapper-goods">
      <div class="left-nav">
        <cube-scroll ref="navScroll">
          <ul>
            <li class="nav-item" :class="query['goodsCategory.id']==''?'active':''" @click="searchService({id: ''})">全部</li>
            <li class="nav-item" :class="query['goodsCategory.id']==item.id?'active':''" :key="item.id+index" v-for="(item,index) in rerviceNav" @click="searchService(item)">{{item.name}}</li>
          </ul>
          <v-br :height="50"></v-br>
        </cube-scroll>
      </div>
      <div class="right-list">
        <cube-scroll ref="scroll" :options="options" :data="serviceList" @pulling-up="onPullingUp" @pulling-down="onPullingDown">
          <ul>
            <goods-item :item="item" v-for="item  in serviceList" :key="item.id"></goods-item>
          </ul>
          <v-br :height="50"></v-br>
        </cube-scroll>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsItem from './GoodsItem'
import mixins from './server-goods.js'
export default {
  name: 'choice-goods',
  components: {
    GoodsItem
  },
  mixins: [mixins],
  methods: {
    async getNav() {
      let res = await this.$api.GOODS_CATEGORY_TOP()
      if (res.status === 1) {
        this.rerviceNav = res.list
      } else {
        this.$toast(res.stateMessage)
      }
    },
    async getData() {
      let res = await this.$api.GOODS_LIST(this.query)
      if (res.status === 1) {
        let result = []
        if (this.query.pageNo === 1) {
          result = res.page.list ? res.page.list : []
        } else {
          result = this.serviceList.concat(res.page.list)
        }
        this.serviceList = result
        this.totalPage = res.page.totalPage
      } else {
        this.$toast.fail(res.stateMessage)
      }
    }
  }
}
</script>
