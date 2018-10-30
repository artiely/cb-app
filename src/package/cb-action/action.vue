<template>
  <div>
    <van-actionsheet v-model="show" :actions="dateactions" class="my-actionsheet">
      <div class="actionsheet-box-wrapper">
        <div class="actionsheet-box actionsheet-box-title">
          请选择有效方式
        </div>
        <div class="actionsheet-box actionsheet-box-border" @click="noLimit">
          永久有效
        </div>
        <div class="actionsheet-box" style="line-height:1" @click="hasLimit">
          <p style="padding-top:10px;padding-bottom:5px">固定时长</p>
          <p style="font-size:12px;color:#666">自办理起的有效天数</p>
        </div>
      </div>
      <v-br></v-br>
      <div class="actionsheet-box-wrapper" @click="limitDateShow=false">
        <div class="actionsheet-box actionsheet-box-cancel">
          取消
        </div>
      </div>
    </van-actionsheet>
  </div>
</template>

<script>
export default {
  name: 'v-cb-action',
  props: {
    show: {
      type: Boolean
    },
    actions: {
      type: Array
    }
  },
  methods: {
    handleTabChange(item, event) {
      this.value = item.id
      this.$emit('tab-change', event)
      this.$emit('input', item.id)
    }
  }
}
</script>
