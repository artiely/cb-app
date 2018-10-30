<template>
  <transition name="fade">
    <div>
      <div v-show="isShow" class="key-modal">
        <!--汉字键盘-->
        <div class="key-box" v-if="keyShow" v-show="keyType">
            <div class="item">
            <div style="flex:5;display:flex">
            </div>
            <div style="flex:2;display:flex">
              <!-- <div class="key" style="color:red" @click="clearAll">清空</div> -->
              <div class="key" @click="switchKeyboard">收起</div>
            </div>
          </div>
          <div class="item" v-for="(item, i) in keyList" :key="i">
            <div class="key" v-for="(val, key) in item" :key="key" @touchstart="inputStart(val, $event)" @touchend="inputEnd($event)">
              {{val}}
            </div>
          </div>
          <div class="key-btn-group">
            <div class="switch-btn" @click="handleChangeKey">A</div>
            <div class="ok-btn" @click="isShow=false">确定</div>
            <div class="password-del-btn" @touchstart="del($event)" @touchend="inputEnd($event,'del')">
              <v-icon name="icon-xiaotubiao-54"></v-icon>
            </div>
          </div>
        </div>
        <!-- 字母键盘 -->
        <div class="key-box key-box2" v-if="keyShow" v-show="!keyType">
          <div class="item">
            <div style="flex:5;display:flex">
              <div class="key" v-show="!fiveInput" v-for="(val, key) in keyList3" :key="key" @touchstart="inputStart(val, $event)" @touchend="inputEnd($event)">
                {{val}}
              </div>
            </div>
            <div style="flex:2;display:flex">
              <div class="key" style="color:red" @click="clearAll">清空</div>
              <div class="key" @click="switchKeyboard">收起</div>
            </div>
          </div>
          <div class="item" v-for="(item, i) in keyList2" :key="i">
            <div class="key" v-for="(val, key) in item" :key="key" @touchstart="inputStart(val, $event)" @touchend="inputEnd($event)">
              {{val}}
            </div>
          </div>
          <div class="key-btn-group">
            <div class="switch-btn" @click="handleChangeKey" v-show="letterShow">省</div>
            <div class="ok-btn" @click="isShow=false">确定</div>
            <div class="password-del-btn" @touchstart="del($event)" @touchend="inputEnd($event,'del')">
              <v-icon name="icon-xiaotubiao-54"></v-icon>
            </div>
          </div>
        </div>
      </div>
      <!-- <div style="line-height:50px;width:100%;text-align:center;position:fixed;bottom:0;right:0;height:50px;z-index:998;background:#fff" @click="isShow=true">
        <v-icon name="icon-jianpan" class="jianpan-icon"></v-icon>
      </div> -->
    </div>
  </transition>
</template>
<script>
// FIXME: 多指同时操作高亮无法消失的问题
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
      keyList:[
        ['京', '津','冀','晋', '蒙','辽','吉','黑','泸', '苏',],
        [ '浙','赣','皖','闽',]
      ],
      keyList: [
        ['粤',   '鲁',  '云'],
        [  '湘',  '新',],
        [ '鄂', '桂', '甘',  '陕'],
        [  '贵', '青', '藏', '川', '宁'],
        ['琼', '豫', '渝', '台', '港', '澳', '使']
      ],
      keyList2: [
        ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        ['H', 'J', 'K', 'L', 'M', 'N', 'P'],
        ['Q', 'R', 'S', 'T', 'U', 'V', 'W'],
        ['X', 'Y', 'Z', '1', '2', '3', '4'],
        ['5', '6', '7', '8', '9', '0', '']
      ],
      keyList3: ['警', '学', '领', '港', '澳'],
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
    inputEnd(e, d) {
      this.unhighLight(e.currentTarget, d)
    },
    clearAll() {
      this.value = []
    },
    // 恢复默认
    unhighLight(ele, d) {
      if (d) {
        ele.style.backgroundColor = '#f8f8f8'
      } else {
        ele.style.backgroundColor = '#fff'
      }
    },
    // 高亮
    highlight(ele) {
      ele.style.backgroundColor = this.highlightColor
    },
    // 用touchstart
    inputStart(val, e) {
      if (!val) return
      if (this.value.length < this.carIdNumber) {
        this.value.push(val)
      }
      // 设置高亮
      this.highlight(e.currentTarget)
    },
    // 删除输入
    del() {
      if (this.value.length > 0) {
        this.value.pop()
      }
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
@import '../../assets/style/border.less';

.v-border {
  // .border(#333);
  border: 1px solid #ddd;
}
.v-border-l {
  // .borderL(#333);
  border-left: 1px solid #ddd;
}
.v-border-b {
  .borderB(#333);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-out;
}
.wrap-enter-active,
.wrap-leave-active {
  transition: 0.3s ease-out;
}
.item {
  background: #dddddd;
}
.key {
  border: 2px solid #ddd;
  border-radius: 2px;
  background: #ffffff;
  box-sizing: border-box;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
// 键盘的动画
.slide-move-enter,
.slide-move-leave-active {
  transform: translate3d(0, 100%, 0);
}
.slide-move-enter-active,
.slide-move-leave-active {
  transition: transform 0.28s cubic-bezier(0, 0.8, 0.56, 0.98);
  opacity: 1;
}
div,
span,
input {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
}
input {
  background: none;
  outline: none;
  border: none;
  background-color: transparent;
  border-color: transparent;
  -webkit-appearance: none;
}
input:disabled,
input[disabled] {
  // color: #000;
  // -webkit-text-fill-color: #000;
  -webkit-opacity: 1;
  opacity: 1;
}
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
  background: #dddddd;
  box-sizing: border-box;
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
    line-height: 36px;
    height: 40px;
    display: flex;
  }
  .key {
    cursor: pointer;
    flex: 1;
    height: 100%;
    display: inline-block;
    padding: 2px;
    border: 2px solid #dddddd !important;
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