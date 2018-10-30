<template>
  <div>
    <div class="c_clicence-title" v-if="title">
      <div class="c_clicence-title-text">{{title}}</div>

    </div>
    <div class="c_clicence-wrapper">
      <div class="c_clicence-item c_clicence-flex2">
        <div class="c_clicence-sub">
          {{value[0]}}
        </div>
        <div class="c_clicence-sub-divider"></div>
        <div class="c_clicence-sub">
          {{value[1]}}
        </div>
      </div>
      <div class="c_clicence-divider"></div>
      <div class="c_clicence-item c_clicence-flex5">
        <div class="c_clicence-sub">
          {{value[2]}}
        </div>
        <div class="c_clicence-sub">
          {{value[3]}}
        </div>
        <div class="c_clicence-sub">
          {{value[4]}}
        </div>
        <div class="c_clicence-sub">
          {{value[5]}}
        </div>
        <div class="c_clicence-sub">
          {{value[6]}}
        </div>
      </div>
      <div class="c_clicence-divider"></div>
      <div class="c_clicence-item c_clicence-flex1">
        <div class="c_clicence-sub">
          {{value[7]}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'v-licence',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    title: String
  },
  data() {
    return {}
  }
}
</script>

<style lang="less">
@import '../../assets/style/var';
.c_clicence-title {
  display: flex;
  justify-content: center;
  .c_clicence-title-text {
    text-align: left;
    font-size: 12px;
    width: 332px;
    padding-bottom: 4px;
    color: #666;
  }
}
.c_clicence-wrapper {
  display: flex;
  align-content: center;
  text-align: center;
  align-items: center;
  justify-content: center;
  .c_clicence-divider {
    width: 6px;
  }

  .c_clicence-item {
    display: flex;
    background: #ffffff;
    .c_clicence-sub {
      height: 40px;
      width: 40px;
      line-height: 40px;
      text-align: center;
      background: #ffffff;
      font-size: 24px;
    }
  }
  .c_clicence-flex2 {
    border: 1px solid @primary;
    overflow: hidden;
    color: @primary;
    align-content: center;
    .c_clicence-sub-divider {
      margin-top: 10px;
      height: 20px;
      border-left: 1px solid @primary;
      align-items: center;
    }
  }
  .c_clicence-flex5 {
    border: 1px solid #999;
    .c_clicence-sub {
      border-left: 1px solid #999;
      position: relative;
      margin-left: -1px;
    }
  }
  .c_clicence-flex1 {
    border: 1px solid @success;
    color: @success
  }
}
</style>
