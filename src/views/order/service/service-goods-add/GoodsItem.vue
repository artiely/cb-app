<template>
  <!-- 单个规格s -->
  <li class="service-item" :key="item.id" @click="toDetail(item)" :class="{'service-item-status':item.status==2}">
    <div class="title textover1">
      {{item.name}}
      <v-badge size="small" v-if="item.dataSrc=='1'" class="title-icon" type="店铺库">店铺库</v-badge>
      <div v-else class="title-icon">
        <v-badge size="small" type="系统库">系统库</v-badge>
      </div>
    </div>
    <p class="code textover1">
      <span v-if="item.goodsBrand&&item.goodsBrand.name" style="padding-right:10px">品牌:{{item.goodsBrand.name}}</span>
      <span >编码:<span v-if="item.code">{{item.code}} </span></span>
    </p>
    <p class="price" style="width:100%;padding-right:25px" v-if="item.priceRange">￥{{item.priceRange}}
      <span class="service-item-unit">
        <span v-if="item.unit">/{{item.unit}}</span>
        <span v-else>/次</span>
      </span>
    </p>
  </li>
  <!-- 单个规格e -->
</template>

<script>
export default {
  name: 'goods-item',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    toDetail(item) {
      this.$router.push({
        name: 'GoodsDetail',
        query: {
          id: item.id,
          gasType: item.gasType
        }
      })
    }
  },
  activated() {}
}
</script>
