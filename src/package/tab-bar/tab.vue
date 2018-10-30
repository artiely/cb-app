<template>
  <div>
    <div v-if="type=='btn'" class="c_tab--wrapper">
      <div class="c_tab-btn-group">
        <div class="c_tab--item-btn" v-for="(item,index) in data" :class="{'active':index==value}" @click="handleTabChange(item)" :key="index">
          <div class="c_tab--item-btn--inner" :class="[{'first':index==0&&data.length<3},{'last':index==data.length-1&&data.length<3}]">
            <div class="c_tab--item-btn--text" style="position:relative">
              <div class="c_tab--item-btn--title">{{item.name}}</div>
              <div class="c_tab--item-btn--count" v-if="count.length>1">({{count[index]}})</div>
              <div class="c_tab--line">
                <div class="c_tab--line-show" v-if="index==value"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="c_tab--wrapper">
      <div class="c_tab--item" v-for="(item,index) in data" :class="{'active':index==value}" @click="handleTabChange(item)" :key="index">
        <div class="c_tab--item--inner" :class="[{'first':index==0&&data.length<3},{'last':index==data.length-1&&data.length<3}]">
          <div class="c_tab--item--text" style="position:relative">
            <div class="c_tab--item--title" :style="count.length<1?'padding-top:13px':''">{{item.name}}</div>
            <div class="c_tab--item--count" v-if="count.length>1">({{count[index]}})</div>
            <div class="c_tab--line">
              <div class="c_tab--line-show" v-if="index==value"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'v-tab-bar',
  props: {
    type: {
      type: String,
      default: 'tab'
    },
    data: {
      type: Array,
      default: () => [{ name: '充值', id: 0 }, { name: '办卡', id: 1 }]
    },
    value: {
      type: Number,
      default: 0
    },
    count: {
      type: Array,
      default: () => []
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

<style lang="less">
@import '../../assets/style/var.less';
.c_tab-btn-group {
  height: 30px;
  border-radius: 6px;
  background: transparent;
  color: #1690ff;
  display: flex;
  margin: 7px auto;
  overflow: hidden;
  border: 1px solid #1690ff;
  .c_tab--item-btn {
    flex: 1;
    line-height: 30px;
    border-radius: 4px;
    font-weight: 500;
    font-size: 14px;
    text-align: center;
    width:64px;
    &.active {
      background: #1690ff;
      color: #fff;
    }
  }
}
.c_tab--cover--dot {
  .c_dot--item {
    top: 0 !important;
  }
}
.c_tab--wrapper {
  position: relative;
  z-index: 10;
  height: 40px;
  display: flex;
  background: transparent;
  font-size: 15px;
  font-weight: 600;
  // box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 100;
  .c_tab--item {
    flex: 1;
    .c_tab--item--count {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      font-size: 10px;
      height: 17px;
      padding: 4px 0 5px 0;
      color: #999;
    }
    .c_tab--item--title {
      width: 100%;
      height: 23px;
      padding-top: 9px;
      font-weight: 500;
      color: #999;
    }
    .c_tab--item--inner {
      width: 100%;
      height: 40px;
      text-align: center;
      // overflow: hidden;
      &.first {
        width: 60%;
        float: right;
      }
      &.last {
        width: 60%;
        float: left;
      }
    }
    .c_tab--line {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      z-index: 99;
      .c_tab--line-show {
        width: 20px;
        background: @primary;
        margin: 0 auto;
        height: 2px;
      }
    }
    .c_tab--item--text {
      position: relative;
      display: inline-block;
      height: 40px;
      border-bottom: 2px solid transparent;
      padding: 0 4px;
      overflow: hidden;
    }
    &.active {
      .c_tab--item--title {
        color: @primary;
      }
      .c_tab--item--count {
        color: @primary;
      }
      color: @primary;
    }
  }
}
</style>
