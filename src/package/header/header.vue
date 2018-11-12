<template>
  <div class="c_header">
    <div class="c_header-isborder" :class="{'c_header-border':border}">
      <div class="c_header_left" @click="handleLeft">
        <slot name="left" v-if="!lefttext">
          <div v-if="isBack" @click="toBack" class="c_header_icon_box">
              <v-icon name="icon-zuojiantou" color="#fff"></v-icon>
          </div>
          <div v-else>
            <span class="c_header_icon_box">
              <v-icon :name="lefticon" color="#fff"></v-icon>
            </span>
          </div>
        </slot>
        <slot name="lefttext">
          {{lefttext}}
        </slot>
      </div>
      <div class="c_header_title">
        <slot name="title"> {{title}}</slot>
      </div>
      <div class="c_header_right" @click="rightClick">
        <slot name="right-icon" v-if="righticon">
          <v-icon :name="righticon" color="#fff"></v-icon>
        </slot>
        <slot name="righttext">
          {{righttext}}
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import VIcon from '../icon/icon'
export default {
  name: 'v-header',
  components: {
    VIcon
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    isBack: {
      type: Boolean,
      default: true
    },
    lefticon: {
      type: String,
      default: ''
    },
    righticon: {
      type: String,
      default: ''
    },
    to: {
      type: String,
      default: ''
    },
    replace: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    },
    righttext: {
      type: String,
      default: ''
    },
    lefttext: {
      type: String,
      default: ''
    },
    leftClick: {
      type: Function
    }
  },
  methods: {
    toBack(event) {
      if (this.leftClick) return
      if (this.to) {
        if (this.replace) {
          this.$router.replace({
            name: this.to.name,
            params: this.to.params,
            query: this.to.query
          })
        } else {
          this.$router.push({
            name: this.to.name,
            params: this.to.params,
            query: this.to.query
          })
        }
      } else {
        // console.log('this.$route', this.$route)
        // console.log('this.$router', this.$router)
        this.$router.back()
      }
    },

    handleLeft(e) {
      if (this.leftClick) {
        this.leftClick(e)
      }
    },
    rightClick(event) {
      this.$emit('right-click', event)
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';

.c_header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 44px;
  line-height: 44px;
  background: #f8f8f8;
  color: #434a5a;
  text-align: center;
  z-index: 999;
  font-size: 17px;
  // box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.1);
  .c_header-isborder {
    display: flex;
    &.c_header-border {
      .borderB();
    }
  }

  .c_header_icon_box {
    height: 44px;
    width: 44px;
    text-align: left;
    font-size: 22px;
  }
  .c_header_back {
    font-size: 17px;
    vertical-align: top;
  }
  .c_header_left {
    width: 27%;
    height: 44px;
    line-height: 44px;
    overflow: hidden;
    text-align: left;
    padding-left: 15px;
    font-weight: 500;
    .v_icon--wrapper {
      height: 44px;
      line-height: 44px;
      overflow: hidden;
      margin-left:-10px;
    }
    .icon {
      vertical-align: 2px;
      font-size: 18px;
      color: @primary!important;
      &.icon-zuojiantou{
        font-size: 24px;
      }
    }
  }
  .c_header_title {
    flex: 1;
    font-size: 17px;
    color: #333;
    font-weight: 500;
  }
  .c_header_right {
    font-weight: 500;
    padding-right: 15px;
    text-align: right;
    width: 27%;
    line-height: 44px;
    font-size: 17px;
    color: @primary!important;
    .icon {
      font-size: 20px;
      color: @primary!important;
    }
  }
}
.c_header_left {
  color: @primary!important;
}
</style>
