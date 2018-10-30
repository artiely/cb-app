<template>
  <transition name="fade">
    <div>
      <div v-show="isShow" class="key-modal">
        <!--汉字键盘-->
        <div class="key-box" v-if="keyShow" v-show="keyType">
          <div class="item" v-for="(item, i) in keyList" :key="i">
            <div class="key" v-for="(val, key) in item" :key="key" :class="{'key-del-btn':val=='del','key-ok-btn':val=='ok'}">
              <div class="val-box">
                <div class="val val-del-btn" v-if="val=='del'" @touchstart="del( $event)" @touchend="touchEnd($event)">
                  <v-icon name="icon-xiaotubiao-54" color="#d73962" />
                </div>
                <div class="val val-ok-btn" v-else-if="val=='ok'" @touchstart="ok( $event)">
                  确定
                </div>
                <div class="val val-switch-btn" v-else-if="val=='A/'" @touchstart="change( $event)">
                  <span style="font-size:10px;position:relative;top:-8px">A</span>/
                  <span>省</span>
                </div>
                <div class="val" v-else @touchstart="inputStart(val, $event)" @touchend="touchEnd($event)">
                  {{val}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 字母键盘 -->
        <div class="key-box key-box2" v-if="keyShow" v-show="!keyType">
          <div class="item" v-show="!fiveInput">
            <div style="flex:4"></div>
            <div style="flex:6;display:flex">
              <div class="key" v-for="(val, key) in keyList3" @touchstart="inputStart(val, $event)" @touchend="touchEnd($event)" :key="key">
                <div class="val-box">
                  <div class="val">
                    {{val}}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="item" v-for="(item, i) in keyList2" :key="i">
            <div class="key" v-for="(val, key) in item" :key="key" :class="{'key-del-btn':val=='del','key-ok-btn':val=='ok'}">
              <div class="val-box">
                <div class="val val-del-btn" v-if="val=='del'" @touchstart="del($event)" @touchend="touchEnd($event)">
                  <v-icon name="icon-xiaotubiao-54" color="#d73962" />
                </div>
                <div class="val val-ok-btn" v-else-if="val=='ok'" @touchstart="ok( $event)">
                  确定
                </div>
                <div class="val val-switch-btn" v-else-if="val=='省/'" @touchstart="change($event)">
                  <span style="font-size:10px;position:relative;top:-8px">省</span>/
                  <span>A</span>
                </div>
                <div class="val" v-else @touchstart="inputStart(val, $event)" @touchend="touchEnd($event)">
                  {{val}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'v-keyboard',
  props: {
    highlightColor: {
      // 高亮颜色
      type: String,
      default: '#ccc'
    },
    value: [Array, String],
    carIdNumber: {
      // 车牌位数
      type: Number,
      default: 8
    },
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // show: true,
      letterShow: true,
      keyShow: true,
      keyType: true,
      fiveInput: false,
      // value: [], // 粤京津泸鲁冀云辽黑湘皖新苏浙赣鄂桂甘晋蒙陕吉闽贵青藏川宁琼豫渝台港澳
      keyList: [
        ['京', '津', '冀', '晋', '蒙', '辽', '吉', '黑', '沪', '苏'],
        ['浙', '赣', '皖', '闽', '鲁', '豫', '鄂', '湘', '粤', '桂'],
        ['琼', '渝', '川', '贵', '云', '藏', '陕', '甘', 'del'],
        ['青', '宁', '新', '港', '澳', '台', 'A/', 'ok']
      ],
      keyList2: [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'],
        ['L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'del'],
        ['U', 'V', 'W', 'X', 'Y', 'Z', '省/', 'ok']
      ],
      keyList3: ['警', '学', '领', '港', '澳', '使'],
      cardIdType: 2
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val.length === 0) {
          this.keyType = true
        } else {
          this.keyType = false
          if (val.length === 7) {
            this.cardIdType = 0
          } else if (val.length === 8) {
            this.cardIdType = 1
          } else {
            this.cardIdType = 2
          }
          if (val.length === 6) {
            this.fiveInput = false
          } else {
            this.fiveInput = true
          }
        }
        if (val.length >= 2 && val.length <= 5) {
          this.letterShow = false
        } else {
          this.letterShow = true
        }
        this.$emit('input', val)
      },
      deep: true
    },
    isShow: {
      handler(val) {
        this.$emit('update:isShow', val)
      }
    }
  },
  methods: {
    handleChangeKey() {
      this.keyType = !this.keyType
    },
    switchKeyboard() {
      this.isShow = false
    },
    touchEnd(e) {
      let ele = e.currentTarget
      ele.style.backgroundColor = '#fff'
      ele.style.color = '#333'
    },
    clearAll() {
      this.value = []
    },
    inputStart(val, e) {
      if (!val) return
      if (this.value.length < this.carIdNumber) {
        this.value.push(val)
      }
      // 设置高亮
      let ele = e.currentTarget
      ele.style.backgroundColor = '#1690ff'
      ele.style.color = '#fff'
    },
    change() {
      this.keyType = !this.keyType
    },
    ok() {
      this.$emit('update:isShow', false)
    },
    del(e) {
      this.value.pop()
      // 设置高亮
      let ele = e.currentTarget
      ele.style.backgroundColor = '#1690ff'
      ele.style.color = '#fff'
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
// FIXME: 样式重构
// modal 的动画
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';

.key-del-btn {
  flex: 2 !important;
}
.key-ok-btn {
  flex: 3 !important;
}

// .v-border {
//   // .border(#333);
//   border: 1px solid #ddd;
// }
// .v-border-l {
//   // .borderL(#333);
//   border-left: 1px solid #ddd;
// }
// .v-border-b {
//   .borderB(#333);
// }

// .fade-enter-active,
// .fade-leave-active {
//   transition: opacity 0.3s ease-out;
// }
// .wrap-enter-active,
// .wrap-leave-active {
//   transition: 0.3s ease-out;
// }
.item {
  background: #d4dadd;
  padding-right: 5px;
  // padding-top: 6px;
}
.key {
  // border: 2px solid #ddd;
  border-radius: 2px;
  background: #d4dadd;
  box-sizing: border-box;
  // padding-left:5px;
  .val-box {
    padding-left: 5px;
    padding-bottom: 6px;
    background: #d4dadd;
    .val {
      height: 42px;
      // margin:6px auto;
      line-height: 42px;
      background: #fff;
      border-radius: 4px;
      color: #333;
      font-size: 18px;
      font-weight: 500;
      box-shadow: 0 1px 2px -1px rgba(0, 0, 0, 0.8);
      &.val-del-btn {
        background: #f0f0f0;
      }
      &.val-ok-btn {
        background: #1690ff;
        color: #fff;
      }
    }
  }
}
// .fade-enter,
// .fade-leave-to {
//   opacity: 0;
// }
// // 键盘的动画
// .slide-move-enter,
// .slide-move-leave-active {
//   transform: translate3d(0, 100%, 0);
// }
// .slide-move-enter-active,
// .slide-move-leave-active {
//   transition: transform 0.28s cubic-bezier(0, 0.8, 0.56, 0.98);
//   opacity: 1;
// }
// div,
// span,
// input {
//   -moz-box-sizing: border-box;
//   -webkit-box-sizing: border-box;
//   -o-box-sizing: border-box;
//   -ms-box-sizing: border-box;
//   box-sizing: border-box;
// }
// input {
//   background: none;
//   outline: none;
//   border: none;
//   background-color: transparent;
//   border-color: transparent;
//   -webkit-appearance: none;
// }
// input:disabled,
// input[disabled] {
//   // color: #000;
//   // -webkit-text-fill-color: #000;
//   -webkit-opacity: 1;
//   opacity: 1;
// }
.keyboard-title {
  text-align: center;
  height: 40px;
  line-height: 40px;
  margin-bottom: 5px;
  position: relative;
}
.pa {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-content: center;
  justify-content: center;
}
.key-modal {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.2);
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  color: #363636;
  background-color: #fff;
  z-index: 9999;
}
/* 键盘盒子 */
.key-box {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  font-size: 16px;
  color: #000;
  padding: 1px;
  background: #d4dadd;
  box-sizing: border-box;
  padding-top: 6px;
  &.key-box2 {
    .key {
      cursor: pointer;
      width: (100% / 7);
      flex: 1;
      height: 100%;
      display: inline-block;
    }
  }
  .password-del-btn {
    width: (100% / 7) * 2;
    float: right;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: #f8f8f8;
    border-radius: 2px;
    border: 2px solid #dddddd;
    .icon {
      font-size: 26px !important;
      vertical-align: 2px;
    }
  }
  .switch-btn {
    width: (100% / 7) * 1.5;
    float: left;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: #f8f8f8;
    border-radius: 2px;
    border: 2px solid #dddddd;
  }
  .ok-btn {
    width: (100% / 7) * 3;
    float: right;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: #38f;
    color: #fff;
    border-radius: 2px;
    border: 2px solid #dddddd;
  }
  .item {
    width: 100%;
    text-align: center;
    height: 48px;
    display: flex;
  }
  .key {
    cursor: pointer;
    flex: 1;
    height: 100%;
    display: inline-block;
    // padding: 2px;
    // border: 2px solid #dddddd !important;
  }
}
/* 输入密码框 */
.carid-input-box {
  width: 80%;
  height: 45px;
  display: flex;
  margin: 5px auto;
  line-height: 45px;
  text-align: center;
  > div {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    > input {
      width: 100%;
      font-size: 18px;
      text-align: center;
      height: 100%;
      display: block;
    }
  }
}
</style>