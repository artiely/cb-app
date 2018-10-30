<template>
  <div>
    <div @click="handleInput">
      <slot name="handle">
        <div class="cb-remarks-wrapper">
          <div>{{title}}
            <v-icon name="icon-lujing1" color="#1690ff" v-if="!disabled"></v-icon>
          </div>
          <div class="c-remarks-value " :class="{'textover1':!disabled}">{{value}}</div>
        </div>
      </slot>
    </div>
    <van-popup v-model="show" position="bottom" style="height:100%;width:100%;background:#f8f8f8" :get-container="getBody">
      <v-header :title="title" isBack="false" :left-click="handleLeft" @right-click="handleClick" righttext="确定" lefttext="取消">
      </v-header>
      <v-scroll-page :top="64">
        <textarea class="c_remark--input" type="text" rows="6" v-focus v-model="value" :placeholder="placeholder" :maxlength="maxlength"></textarea>
        <div class="valueLength">{{nextLength}}</div>
        <div style="margin-top:10px;margin-left:10px;" v-if="upload">
          <van-uploader :after-read="onRead" :disabled="disabled">
            <div class="c-upload">
              <v-icon name="icon-iconfont56" />
            </div>
          </van-uploader>
        </div>
      </v-scroll-page>
    </van-popup>
  </div>

</template>

<script>
export default {
  name: 'v-remark',
  props: {
    value: String,
    placeholder: {
      type: String,
      default: '添加备注...'
    },
    title: {
      type: String,
      default: '备注'
    },
    headerTitle: {
      type: String,
      default: '备注'
    },
    upload: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: [Number, String],
      default: 200
    },
    save: {
      type: Boolean,
      default: false
    },
    data: Object
  },
  data() {
    return {
      show: false,
      nextLength: this.maxlength
    }
  },
  watch: {
    value: {
      handler(val) {
        this.$emit('input', val)
        if (val) {
          this.nextLength = this.maxlength - val.length
        }
      },
      immediate: true
    }
  },
  methods: {
    handleInput(e) {
      if (this.disabled) {
        return
      }
      this.show = true
      // this.$emit('input', e.target.value)
    },
    handleLeft() {
      this.show = false
    },
    handleClick() {
      this.show = false
      if (this.data) {
        this.saveFn()
      }
    },
    getBody() {
      return document.getElementById('app')
    },
    async saveFn() {
      let res = await this.$api.SYS_TABLE_REMARK(
        Object.assign({}, this.data, { remarks: this.value })
      )
      if (res.status === 1) {
        this.$toast.success('更新成功')
      }
    }
  },
  mounted() {
    let len = this.value ? this.value.length : 0
    this.nextLength = this.maxlength - len
  }
}
</script>

<style lang="less">
.c-remarks-value {
  padding-top: 5px;
  padding-right: 15px;
  line-height: 1.5;
  font-size: 14px;
  color: #333;
}
.cb-remarks-wrapper {
  padding-top: 15px;
  font-size: 14px;
  color: #666;
  padding-left: 15px;
  display: inline-block;
  .icon {
    font-size: 12px;
  }
}
.c-upload {
  width: 60px;
  height: 60px;
  background: #fff;
  text-align: center;
  line-height: 60px;
}
.c_remark--input {
  padding: 20px;
  background: #fff;
  width: 100%;
  height: 150px;
  font-size: 16px;
  vertical-align: top;
  line-height: 1.2;
  position: relative;
}
textarea {
  width: 100%;
  font-size: 16px;
  line-height: 1.2;
  padding: 8px 15px;
  background: transparent;
}
input::-moz-placeholder,
textarea::-moz-placeholder {
  color: #c7c7c7;
  text-overflow: ellipsis;
}
input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
  color: #c7c7c7;
  text-overflow: ellipsis;
} /*注意它是一个冒号，textarea里面用的是input*/
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: #c7c7c7;
  text-overflow: ellipsis;
}
.valueLength {
  position: absolute;
  top: 128px;
  right: 14px;
  z-index: 16;
  color: #c7c7c7;
}
</style>
