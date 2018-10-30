<template>
  <div class="c_button--wrapper" @click="click" :class="[{'c_button--primary':type=='primary'},{'c_button--danger':type=='danger'},{'c_button--primary--solid':type=='primary-solid'},{'inline':inline},{'c_button--large':size=='large'},{'is-shadow':isShadow}]">
    <span class="c_button--slot">
      <slot></slot>
    </span>
  </div>
</template>

<script>
export default {
  name: 'v-button',
  props: {
    type: {
      type: String,
      default: ''
    },
    inline: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small'
    },
    isShadow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    click(event) {
      this.$emit('click', event)
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
.c_button--wrapper {
  height: 26px;
  line-height: 26px;
  font-size: 14px;
  width: 100%;
  display: inline-block;
  border: 1px solid @border;
  border-radius: 16px;
  position: relative;
  color: @secondary-text;
  text-align: center;
  &.c_button--large {
    height: 40px;
    line-height: 40px;
    border-radius: 22px;
    font-size: 16px;
  }
  .c_button--slot {
    position: relative;
  }
  &.c_button--primary {
    color: @primary;
    border: 1px solid @primary;
    &.is-shadow {
      box-shadow: 0px 1px 6px fade(@primary, 60%);
    }
  }
  &.c_button--primary--solid {
    color: @white;
    background: @primary;
    border: 1px solid @primary;
    &.is-shadow {
      box-shadow: 0px 1px 6px fade(@primary, 60%);
    }
  }
  &.c_button--danger {
    color: @danger;
    border: 1px solid @danger;
    &.is-shadow {
      box-shadow: 0px 1px 6px fade(@danger, 60%);
    }
  }
  &.inline {
    display: inline-block !important;
    padding: 0 10px;
    font-size: 14px;
    min-width: 50px;
    width: auto;
  }

  &::before {
    content: '';
    position: absolute;
    top: -10px;
    right: -10px;
    bottom: -10px;
    left: -10px;
  }
}
</style>
