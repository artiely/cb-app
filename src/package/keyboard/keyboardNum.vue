<template>
  <transition name="fade">
    <div class="keyboard-box keybord-box-num" v-show="isShow">
      <transition name="fade">
        <div class="mark"></div>
      </transition>
      <transition name="slide-move">
        <div v-show="isShow" class="key-modal">
          <!-- 标题 -->
          <div class="keyboard-title v-border-b pr">
            <span>{{keyBoardTitle}}</span>
            <span class="pa" @click="close">
              <svg t="1501505446265" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1904" xmlns:xlink="http://www.w3.org/1999/xlink" width="18" height="18">
                <path d="M550.659 490.565l324.395-324.386c10.945-10.945 10.945-28.699 0-39.644-10.948-10.95-28.704-10.95-39.648-0.004L511.01 450.916 186.625 126.53c-10.946-10.947-28.703-10.947-39.648 0-10.946 10.95-10.946 28.703 0 39.648l324.385 324.386-324.385 324.401c-10.946 10.944-10.946 28.703 0 39.65 10.945 10.943 28.702 10.943 39.648 0L511.01 530.213l324.396 324.401c10.944 10.944 28.7 10.944 39.648 0 10.945-10.946 10.945-28.705 0-39.649L550.66 490.565z" p-id="1905"></path>
              </svg>
            </span>
          </div>
          <!--输入的 价格-->
          <div class="carid-input-box v-border">
            {{value}}
            <input type="text" class="input-result" :value="value" disabled>
          </div>
          <!-- 字母键盘 -->
          <div class="key-box key-box2" >
            <div class="item" v-for="(item, i) in keyList" :key="i">
              <div class="key" v-for="(val, key) in item" :key="key" :class="{'ok--btn':val=='确定'}" @click="inputStart(val)">
                <div v-if="val=='del'">
                  <v-icon name="icon-xiaotubiao-54"></v-icon>
                </div>
                <div v-else>
                  {{val}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>
<script>
// FIXME: 多指同时操作高亮无法消失的问题
export default {
  name: 'v-keyboard-num',
  props: {
    keyBoardTitle: {
      type: String,
      default: '请输入充值金额'
    },
    isShow: {
      type: Boolean,
      default: false
    },
    value: [String, Number]
  },
  data() {
    return {
      keyType: true,
      fiveInput: false,
      val: [],
      keyList: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [0, 'del', '确定']]
    }
  },
  watch: {
    isShow: {
      handler(val) {
        // this.$emit('input', '')
        // this.val = []
        // this.value = ''
      },
      deep: true
    }
  },
  methods: {
    beforeLeave() {},
    // 用touchstart
    inputStart(val, e) {
      if (val === 'del') {
        this.val.pop()
        return
      }
      if (val === '确定') {
        this.isShow = false
        return
      }
      // 设置高亮
      this.val.push(val)
      this.$emit('input', this.val.join(''))
    },
    // 删除输入
    del() {
      if (this.val.length > 0) {
        this.val.pop()
      }
      this.$emit('input', this.val.join(''))
      // this.value = this.val.join('')
    }
  }
}
</script>
<style lang="less" scoped>
// FIXME: 样式重构
// modal 的动画
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';
.v-border {
  .border(#333);
}
.v-border-l {
  .borderL(#333);
}
.v-border-b {
  .borderB(#333);
}
.input-result {
  font-size: 18px;
  text-indent: 12px;
  width: 100%;
}
.mark {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 998;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-out;
}
.wrap-enter-active,
.wrap-leave-active {
  transition: 0.3s ease-out;
}
.wrap-enter,
.wrap-leave-to {
}
.item {
  background: #dddddd;
}
.key {
  border: 2px solid #ddd;
  border-radius: 6px;
  background: #ffffff;
  box-sizing: border-box;
  &.ok--btn {
    background: @primary;
    color: #ffffff;
  }
}
.keybord-box-num {
  .key-box .item {
    height: 70px;
    line-height: 70px;
    font-size: 20px;
  }
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
  height: 50px;
  line-height: 50px;
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
.keyboard-box {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  z-index: 999;
  .key-modal {
    box-shadow: 0px 1px 6px 1px rgba(0, 0, 0, 0.4);
    position: absolute;
    width: 100%;
    min-height: 390px;
    left: 0;
    bottom: 0;
    color: #363636;
    background-color: #fff;
    z-index: 9999;
  }
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
  .del-btn {
    width: (100% / 7) * 2;
    float: right;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: #f8f8f8;
    border-radius: 6px;
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
    border-radius: 6px;
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
    border-radius: 6px;
    border: 2px solid #dddddd;
  }
  .item {
    width: 100%;
    text-align: center;
    line-height: 50px;
    height: 50px;
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