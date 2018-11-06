<template>
  <div class="remarkBox">
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
      <v-scroll-page :top="64" class="remarkScrollBox">
        <textarea class="c_remark--input" type="text" rows="6" v-focus v-model="value" :placeholder="placeholder" :maxlength="maxlength"></textarea>
        <div class="valueLength">{{nextLength}}</div>
        <div style="margin-top:10px;margin-left:10px;" v-if="upload">
          <van-uploader :after-read="onRead" :disabled="disabled">
            <div class="c-upload">
              <v-icon name="icon-iconfont56" />
            </div>
          </van-uploader>
        </div>
        <!-- 新增快速添加备注部分内容 @click="kjRemarkCheck"-->
        <div v-if="kdlist === 1">
          <div class="kjRemarkBox">
            <van-checkbox v-model="kjRemarkChecked" label-position="right" size="12">设为快捷备注</van-checkbox>
          </div>
          <div class="bzBtBox">
            <div>快捷备注</div>
            <div @click="delFunc">
              <v-icon name="icon-shanchu2" color="#da5779" size="16" v-if="delPic === 1" />
              <div v-if="delPic === 0" class="wordText">完成</div>
            </div>
          </div>
          <div class="kjRemarkInfo">
            <div class="kjRemarkItem" v-for="(item,index) in remarkInfo" :key="index" @click.stop="checkNameItem($event)">
              <div class="kjRemarkItemName">{{ item.content }}</div>
              <div class="remarkDelPicBox" v-if="itemDel === 1" @click.stop="deleteKjRemark(index, item.id)">
                <v-icon name="icon-shanchu1" color="#ffffff" size="10" />
              </div>
            </div>
          </div>
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
    data: Object,
    kdlist: [Number, String]
  },
  data() {
    return {
      show: false,
      nextLength: this.maxlength,
      kjRemarkChecked: true, // 设为快捷备注的选项
      remarkInfo: [],
      delPic: 1, // 是否显示删除图标 1: 不显示    0：显示
      itemDel: 0, // 快捷备注列表中中的删除图标 0：不显示删除图标  1：显示删除图标
      currCheck: [] // 当前选中的项目
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
    },
    kjRemarkChecked: {
      handler(val) {
        this.$emit('kjRemarkChecked', val)
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
      this.value = ''
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
    },
    async kjRemarkInfoFunc() {
      // console.log('1111111111111111111111111111111')
      this.remarkInfo = []
      let res = await this.$api.KJ_REMARK_LIST(
        Object.assign({}, this.data, { type: 1, numLimit: 5 })
      )
      if (res.status === 1) {
        // console.log('res =', res)
        this.remarkInfo = res.list
      }
    },
    async kjRemarkDeleteFunc(delIndex, id) {
      let res = await this.$api.KJ_REMARK_DELETE(
        Object.assign({}, this.data, { id: id })
      )
      if (res.status === 1) {
        this.$toast.success('删除成功')
        this.remarkInfo.splice(delIndex, 1)
      }
    },
    // 点击删除快捷备注的图标
    delFunc() {
      if (this.delPic === 1) {
        this.delPic = 0
        this.itemDel = 1
      } else if (this.delPic === 0) {
        this.delPic = 1
        this.itemDel = 0
      }
    },
    // 点击选中当前快捷备注栏
    checkNameItem(e) {
      // console.log('当前e =', e)
      if (e.currentTarget.className.indexOf('remarkNameItemHl') === -1) {
        e.currentTarget.className = 'kjRemarkItem remarkNameItemHl'

        if (this.value.length !== 0) {
          this.value = this.value + '，' + e.srcElement.textContent
        } else {
          this.value = this.value + e.srcElement.textContent
        }
      } else {
        e.currentTarget.className = 'kjRemarkItem'
      }
    },
    // 删除当前的列表
    deleteKjRemark(delIndex, id) {
      this.kjRemarkDeleteFunc(delIndex, id)
    },
    init() {
      // 初始化数据
      this.kjRemarkChecked = true // 设为快捷备注的选项
      this.remarkInfo = []
      this.delPic = 1 // 是否显示删除图标
      this.itemDel = 0 // 快捷备注列表中中的删除图标
      this.currCheck = [] // 当前选中的项目
    }
  },
  mounted() {
    let len = this.value ? this.value.length : 0
    this.nextLength = this.maxlength - len
    this.kjRemarkInfoFunc()
    this.init()
  },
  activated() {
    this.kjRemarkInfoFunc()
    this.init()
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
// 设置快捷备注中的选择样式
.remarkScrollBox {
  .kjRemarkBox {
    margin-top: 6px;
    font-size: 12px;
    color: #999;
    padding-left: 16px;
    // border: 1px solid #000;
  }
  .van-checkbox {
    display: flex;
    .van-checkbox__icon {
      display: flex;
      align-items: center;
      line-height: 16px;
      .van-icon {
        width: 16px;
        height: 16px;
      }
      .van-checkbox__label {
        margin-left: 6px;
      }
    }
  }
  // 快捷备注
  .bzBtBox {
    color: #999999;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 25px 16px 10px 16px;
    .wordText {
      color: #1690ff;
    }
  }
  //快捷备注的内容
  .kjRemarkInfo {
    margin-left: 16px;
    padding-top: 10px;
    border-top: 1px solid #ddd;
    display: flex;
    flex-wrap: wrap;
    .kjRemarkItem {
      font-size: 15px;
      border-radius: 20px;
      color: #333;
      background: #fff;
      padding: 5px 10px;
      display: flex;
      align-items: center;
      margin: 0 10px 10px 0;
      .kjRemarkItemName {
        display: flex;
        flex: 1;
        max-width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .remarkDelPicBox {
        background-color: #d73962;
        border-radius: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 18px;
        height: 18px;
        margin-left: 5px;
      }
    }
    .remarkNameItemHl {
      color: #ffffff;
      background-color: #1690ff;
    }
  }
}
</style>
