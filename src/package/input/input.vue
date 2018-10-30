<template>
  <div class="v-input-box" :class="[error?'error':'',border?'':'no-border']">
    <span class="input-icon-box v-input-icon-left" v-if="lefticon">
      <v-icon :name="lefticon"></v-icon>
    </span>
    <input :type="type" class="v-input" :border="border" :value="value" @input="handleInput" :maxlength="maxlength" @blur="handleInput" :placeholder="placeholder" :readonly="readonly" @focus="scrollTo">
    <span class="input-icon-box v-input-icon-right" v-if="righticon" @click="inputRight">
      <v-icon :name="righticon"></v-icon>
    </span>
  </div>
</template>
<script>
import VIcon from '../icon/icon'
export default {
  components: {
    VIcon
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    border: {
      type: Boolean,
      default: true
    },
    error: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'text'
    },
    lefticon: {
      type: String
    },
    righticon: {
      type: String
    },
    placeholder: {
      type: String,
      default: '请输入...'
    },
    maxValue: {
      type: Number,
      default: Number.MAX_VALUE
    },
    minValue: {
      type: Number,
      default: 0
    },
    maxlength: [String, Number]
  },
  name: 'v-input',
  methods: {
    handleInput(event) {
      let value = event.target.value
      this.$emit('input', value)
    },
    inputRight(event) {
      this.$emit('input-right', event)
    },
    scrollTo(e) {
      e.target.scrollIntoViewIfNeeded()
    }
  }
}
</script>
<style lang="less">
@import '../../assets/style/var';
@import '../../assets/style/border';
.v-input-box {
  height: 50px;
  width: 100%;
  position: relative;
  margin-bottom:-1px;
  .borderB();
  &.no-border {
    .v-input {
      box-shadow: none;
      border: none;
      color: #666666;
      &:focus {
        box-shadow: none;
        border: none;
      }
    }
  }
  &.error {
    .v-input {
      // box-shadow: 0 0 0 2px rgba(237, 63, 20, 0.2);
      // border-bottom: 1px solid rgb(237, 63, 20);
      color: rgb(237, 63, 20);
      &:focus {
        // box-shadow: 0 0 0 2px rgba(237, 63, 20, 0.2);
        // border-bottom: 1px solid rgb(237, 63, 20);
      }
    }
    .v-input-icon-left {
      color: rgb(237, 63, 20);
    }
  }
  .v-input {
    height: 50px;
    width: 100%;
    outline: none;
    line-height: normal;
    // border-bottom: 1px solid #c7c7c7;
    border-radius:0;
    // border-radius: 20px;
    padding-left: 35px;
    padding-right: 50px;
    padding-top: 5px;
    padding-bottom: 5px;
    box-sizing: border-box;
    font-size: 18px;
    transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out;
    background: transparent;
    box-shadow: none;
    -webkit-appearance: none;
    vertical-align: middle;
    &:focus {
      // box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
      // border-bottom: 1px solid rgba(45, 140, 240, 1);
    }
    &::-webkit-input-placeholder {
      color: #ccc !important;
      text-overflow: ellipsis;
    }
  }
  .input-icon-box {
    position: absolute;
    top: 0;
    height: 50px;
    font-size: 24px;
    text-align: center;
    line-height: 50px;
    color: rgba(45, 140, 240, 1);
    z-index: 2;
  }
  .v-input-icon-left {
    left: 0;
    .icon {
      font-size: 22px;
      vertical-align: 2px;
      color:#c7c7c7!important;
    }
  }
  .v-input-icon-right {
    right: 0;
    width: 50px;
    color: #c7c7c7;
  }
}
</style>
