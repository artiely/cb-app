<template>
  <div class="c_search_box" v-bind="$attrs">
    <div class="c_input_wrapper">
      <v-icon class="c_left_icon" name="icon-sousuo1"></v-icon>
      <form>
        <input type="text" style="display:none">
        <div class="c_search_input_box">
          <input type="search" ref="cinput" class="c_search_input" v-focus="autofocus" :value="value" @input="handleInput" maxlength="11" :placeholder="placeholder" :disabled="disabled">
          <div class="c_search--clear" @click="clearValue" v-if="value">
            <v-icon name="icon-shanchu"></v-icon>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'v-search',
  props: {
    value: String,
    placeholder: {
      type: String,
      default: '编码/名称/品牌/备注'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleInput(event) {
      let value = event.target.value
      this.value = value
      this.$emit('input', value)
    },
    clearValue() {
      this.value = ''
      this.$emit('input', '')
    }
  },
  mounted() {
    document.addEventListener('keyup', event => {
      if (event.keyCode === 13) {
        this.$refs.cinput.blur()
      }
    })
  },
  created() {},
  activated() {
    this.$emit('input', '')
    this.$nextTick(() => {
      document.addEventListener('keyup', event => {
        if (event.keyCode === 13) {
          this.$refs.cinput.blur()
        }
      })
    })
  }
}
</script>

<style lang="less">
@import '../../assets/style/var';
@import '../../assets/style/border';
.c_search_box {
  height: 50px;
  padding-left: 18px;
  background: #f8f8f8;
  padding: 5px 10px;
  margin-top:44px;
  .borderB();
  .c_input_wrapper {
    height: 40px;
    position: relative;
    padding-left: 30px;
  }
  .c_left_icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    z-index: 9;
    .icon {
      color: #999!important;
      vertical-align: top;
      font-size: 18px;
    }
  }
  .c_search_input_box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    .c_search--clear {
      position: absolute;
      top: 0;
      right: 0;
      width: 45px;
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
      .icon{
        color:#999!important;
        font-size: 22px;
      }
    }
    .c_search_input {
      height: 40px;
      border-radius: 22px;
      background: #dcdcdd;
      outline: none;
      padding: 0;
      border: none;
      font-size: 18px;
      text-indent: 36px;
      flex: 1;
      line-height: normal;
      &::-webkit-input-placeholder {
      color: #999 !important;
      text-overflow: ellipsis;
    }
    }
  }
}
</style>
