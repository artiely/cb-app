<template>
  <div class="c-filter--box">
    <div class="c-filter--item" v-for="(item,index) in data" @click="changeFilter(item)" :key="index">
      {{item.name}}
      <v-icon name="icon-shanchu1"></v-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: 'filter-bar',
  props: {
    data: {
      type: Array,
      default: () => {}
    }
  },
  methods: {
    changeFilter(item, event) {
      this.$emit('change-filter', item, event)
    }
  }
}
</script>

<style lang="less">
@import '../assets/style/var.less';
.c-filter--box {
  padding: 5px 10px;
  .c-filter--item {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    color: @secondary-text;
    padding: 0 6px;
    text-align: center;
    background: #ffffff;
    border-radius: 4px;
    font-size: 12px;
    margin-right: 10px;
    .icon {
      font-size: 12px;
      vertical-align: 0px;
      padding: 0 4px;
      color: @secondary-text!important;
    }
  }
}
</style>
