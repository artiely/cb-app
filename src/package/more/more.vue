<template>
  <div class="c_more-button" v-if="!value" @click="switchMore">
    <span>更多
      <v-icon name="icon-iconfontarrows"></v-icon>
    </span>
  </div>
</template>

<script>
export default {
  name: 'v-more',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    switchMore() {
      this.value = true
      this.$emit('input', true)
    }
  }
}
</script>

<style lang="less">
.c_more-button {
  text-align: center;
  height: 40px;
  line-height: 40px;
  color: #999;
  > span {
    font-size: 14px;
    .icon{
      color: #999!important;
      font-size: 12px;
    }
  }
}
</style>
