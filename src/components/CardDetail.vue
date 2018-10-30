<template>
  <div class="card-detail">
    <!-- <div class="card-detail--item clearfix" v-for="(item,index) in data" :key="index">
      <span class="fl">{{item.name}}</span>
      <span class="fr">{{item.value}}</span>
    </div> -->
    <table class="card-detail-table clearfix" >
      <tr v-for="(item,index) in data" :key="index">
        <td class="card-detail-table-label ">{{item.name}}</td>
        <td class="card-detail-table-value">
          <span class="card-detail-table-txt">{{item.value}}</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="less">
@import '../assets/style/var.less';
@import '../assets/style/border.less';
.card-detail-table{
  width: 100%;
  font-size: 14px;
  line-height: 24px;
  vertical-align: top;
  .card-detail-table-label{
    width: 100px;
    text-align: left;
    color: @secondary-text;
    padding: 0;
    vertical-align: top;
  }
  .card-detail-table-value{
    text-align: right;
    color: @primary-text;
    padding: 0;
  }
  .card-detail-table-txt{
    float: right;
    font-weight: 500;
    text-align: left;
  }
}
.card-detail {
  width: 100%;
  background: #ffffff;
  padding: 10px 15px;
  &--item {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    color: @secondary-text;
  }
}
</style>
