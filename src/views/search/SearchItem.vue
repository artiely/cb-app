<template>
  <div>
    <div class="search-table"  v-for="item in data" @click="handleItem(item)" :key="index+item.motor?item.motor.id:item.member?item.member.id:''" :class="{'disabled':isCustomMode&&!item.member}">
      <div class="search-resault-list-item" >
        <div class="search-cus-carid ">
          <span v-if="item.motor&&item.motor.licence" v-highlight="keywords">{{item.motor.licence |carIdFormat()}}</span>
          <span v-else style="color:#c7c7c7">无车辆</span>
        </div>
        <div class="search-cus-tel " v-highlight="keywords" v-if="item.member&&item.member.username">{{item.member.username|telFormat()}}</div>
        <div class="search-table-td">
          <span class="search-cus-name  textover1" v-highlight="keywords" v-if="item.member&&item.member.name">{{item.member.name}}</span>
          <div class="search-cus-tel " v-if="!item.member">
            <span style="color:#c7c7c7;font-weight:500">无客户</span>
          </div>
        </div>
        <div style="width:80px;padding-right:10px;text-align:right">
          <v-badge size="small" type="折扣卡" v-if="item.cardNum>0">卡</v-badge>
          <v-badge size="small" type="储值卡" v-if="item.accountMoney>0">储</v-badge>
          <v-badge size="small" type="优惠券" v-if="item.couponNum>0">券</v-badge>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    isCustomMode: {
      // 当前是否只有客户可选
      type: Boolean,
      default: true
    },
    keywords: [String, Number]
  },
  methods: {
    handleItem(item, event) {
      if (this.isCustomMode && !item.member) {
        return
      }
      this.$emit('click', item, event)
    }
  }
}
</script>