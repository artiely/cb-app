<template>
  <div class="cb-sale-people" @click="staffVisible=true">
    <v-icon name="icon-xiaoshouren"></v-icon>
    <div class="cb-sale-people-select" v-if="!value">销售人
    </div>
    <div class="cb-sale-people-select" v-if="value">
      <span class="cb-sale-people-name" >{{value.name}}</span>
    </div>
    <van-popup v-model="staffVisible" style="width:100%;height:70%" class="popup-radius" position="bottom" :lock-scroll="false" :get-container="getBody">
      <v-popup-title title="请选择销售人"  desc=" " @close="staffVisible = false"></v-popup-title>
      <div class="popup-scroll-wrapper" style="top:60px;">
        <cube-scroll>
          <van-radio-group v-model="value.id">
            <van-cell-group>
              <v-cell :title="item.name" clickable @click.native="handleStaff(item)" v-for="item in staffList" :key="item.id">
                <div slot="text">
                  <van-radio :name="item.id" />
                </div>
              </v-cell>
            </van-cell-group>
          </van-radio-group>
        </cube-scroll>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'v-sale-people',
  props: {name: String, value: [String, Object]},
  data() {
    return {
      staffVisible: false,
      staffList: [],
      disAccountList: []
    }
  },
  methods: {
    getBody() {
      return document.getElementById('app')
    },
    handleStaff(item) {
      if (item === this.value) {
        this.value = ''
        this.$emit('input', '')
      } else {
        this.value = item
        this.$emit('input', item)
      }
      this.staffVisible = false
    },
    async getData() {
      let res = await this.$api.EMPLOYEE_LIST()
      if (res.status === 1) {
        this.staffList = res.list
      }
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style lang="less">
.cb-sale-people {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color: #c7c7c7;
  width: 100%;
  background: #fff;
  padding-left:15px;
  display: inline-block;
  border-top:1px solid #c7c7c7;
  .icon{
    font-size: 16px;
    color: #c7c7c7!important;
  }
  .cb-sale-people-name {
    padding: 2px 10px;
    border: 1px solid #c7c7c7;
    font-size: 12px;
    color: #fff;
    background: #c7c7c7;
    border-radius: 2px;
  }
  .cb-sale-people-select {
    height:100%;
    display: inline-block;
  }
}
</style>
