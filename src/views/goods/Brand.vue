<template>
  <div>
    <v-header title="品牌" righttext="确定" @right-click="handleRight"></v-header>
    <v-scroll-page top="44" style="overflow-y:scroll">
      <v-br height="20"></v-br>
      <v-cell-group style="margin-bottom:0">
        <v-cell input placeholder="请输入品牌名称" v-model="query.brandName"></v-cell>
      </v-cell-group>
      <v-badge class="customTag" color="#e6bd81" v-for="item in brand" :key="item.id" @click.native="setCurrBrand(item)">{{item.name}}</v-badge>
    </v-scroll-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      brand: [],
      query: {
        brandName: ''
      },
      choiceBrand: ''
    }
  },
  methods: {
    handleRight() {
    },
    setCurrBrand(item) {
      this.choiceBrand = item
      this.$store.commit('SET_BRAND', item)
      this.$router.replace('/addgoods')
    },
    async getBrand() {
      let res = await this.$api.GOODS_BRAND_LIST({ pageNo: 1, pageSize: 100 })
      if (res.status === 1) {
        this.brand = res.page.list
      } else {
        this.$toast('获取商品品牌失败')
      }
    }
  },
  activated() {
    this.getBrand()
  }
}
</script>

<style scoped>
</style>