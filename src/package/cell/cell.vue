<template>
  <div class=" c_cell_wrapper">
    <div class="c_cell" :class="{'c_cell--wrap':wrap}">
      <slot>
        <div class="title" v-if="title||$slots.title" :style="options&&options.titleStyle?options.titleStyle:''">
          <slot name="title">
            <v-icon class="title-icon" :name="titleicon" v-if="titleicon"></v-icon>
            <span style="position:relative">{{title}}
              <span v-if="required" class="c_cell_required">*</span>
            </span>
            <v-badge v-if="badge&&badgetitle" size="small">{{badgetitle}}</v-badge>
          </slot>
        </div>
        <div class="datepicker text" v-if="datetime||date" @click="show=true">
          {{value}}
        </div>
        <div class="text" v-if="!datepicker&&!input&&!datetimepicker&&!datetime&&!date" @click.prevent="rightClick">
          <slot name="text">
            <span class="fr" :class="{'c_cell--cursor-placeholder': cursor}" style="text-align:left;color:#c7c7c7;font-weight:500" v-if="options&&options.placeholder&&text==''" :style="options&&options.textStyle?options.textStyle:''">{{placeholder}}</span>
            <span class="fr" :class="{'c_cell--cursor': cursor}" style="text-align:left;padding-left:10px" v-else :style="options&&options.textStyle?options.textStyle:''">{{text}}</span>
            <v-badge v-if="badge&&badge.textbadge" size="small" :color="badge.textbadgecolor">{{badge.textbadge}}</v-badge>
          </slot>
        </div>
        <slot name="left" class="left-slot">
        </slot>
        <slot name="right" class="right-slot">
        </slot>
        <div class="c_cell_input_box" v-if="input">
          <input :type="type" ref="input" :placeholder="placeholder" v-focus="focus" @input="handleInput" :style="options&&options.textStyle?options.textStyle:''" @blur="handleInput" :value="value" :class="{'c_cell--warning':value.length>maxlength}" :disabled="disabled" class="c_cell_input" :maxlength="maxlength">
        </div>
        <v-icon class="link-icon" name="icon-youjiantou1" v-if="link"></v-icon>
      </slot>
    </div>
    <van-popup v-model="show" position="bottom" style="height:300px;width:100%;" :get-container="getBody">
      <van-datetime-picker v-model="currentDate" :type="dateType"  :visible-item-count="6" @confirm="confirm" @cancel="cancel" @change="change" confirm-button-text="确定" />
    </van-popup>
  </div>
</template>

<script>
import moment from 'dayjs'
import VBadge from '../badge/badge'
export default {
  components: {
    VBadge
  },
  name: 'v-cell',
  data() {
    return {
      show: false,
      minHour: 10,
      maxHour: 20,
      datetimeValue: '',
      currentDate: new Date()
    }
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    focus: {
      type: Boolean,
      default: false
    },
    cursor: {
      type: Boolean,
      default: false
    },
    currency: {
      type: Boolean,
      default: false
    },
    wrap: {
      type: Boolean,
      default: false
    },
    datetime: {
      type: Boolean,
      default: false
    },
    date: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: moment().format('YYYY-MM-DD HH:mm')
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    mindate: {
      type: String
    },
    titleicon: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    text: {
      type: String,
      default: ' '
    },
    datepicker: {
      type: Boolean,
      default: false
    },
    datetimepicker: {
      type: Boolean,
      default: false
    },
    input: {
      type: Boolean,
      default: false
    },
    link: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    badge: {
      type: Object
    },
    textbadge: {
      type: String
    },
    descTitle: String,
    descText: String,
    maxlength: Number,
    pattern: String,
    maxValue: {
      type: [Number, String],
      default: Number.MAX_VALUE
    },
    minValue: {
      type: [Number, String],
      default: 0
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    // date: {
    //   handler(val) {
    //     // this.$emit('input', val)
    //     this.value
    //   }
    // }
  },
  computed: {
    dateType() {
      return this.date ? 'date' : 'datetime'
    }
  },
  methods: {
    confirm(val) {
      if (this.date) {
        this.datetimeValue = moment(val).format('YYYY-MM-DD')
      } else {
        this.datetimeValue = moment(val).format('YYYY-MM-DD HH:mm')
      }
      this.$emit('input', this.datetimeValue)
      this.show = false
    },
    cancel() {
      this.show = false
    },
    change(picker) {
      console.log(picker.getValues())
      picker = picker.getValues()
      let Y = picker[0]
      let M = picker[1]
      let D = picker[2]
      let H = picker[3]
      let m = picker[4]
      if (this.date) {
        this.datetimeValue = `${Y}-${M}-${D}`
      } else {
        this.datetimeValue = `${Y}-${M}-${D} ${H}:${m}`
      }
      this.$emit('input', this.datetimeValue)
    },
    getBody() {
      return document.getElementById('app')
    },
    handleInput(e) {
      var value = e.target.value
      if (this.currency) {
        e.target.value = e.target.value.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
        e.target.value = e.target.value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        e.target.value = e.target.value
          .replace('.', '$#$')
          .replace(/\./g, '')
          .replace('$#$', '.')
        e.target.value = e.target.value.replace(
          /^(-)*(\d+)\.(\d\d).*$/,
          '$1$2.$3'
        ) // 只能输入两个小数
        if (e.target.value.indexOf('.') < 0 && e.target.value !== '') {
          // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          e.target.value = parseFloat(e.target.value)
        }
        // e.target.value = e.target.value.replace(/[^\d]/g, '')
        if (Number(e.target.value) > this.maxValue) {
          e.target.value = this.maxValue
        }
        this.$emit('input', e.target.value)
      } else {
        this.$emit('input', value)
      }
    },
    handleDate(value) {
      this.$emit('input', value)
      this.value = value
    },
    rightClick() {
      // this.$refs.input.blur()
      // console.log(this.$refs)
      this.$emit('right-click', event)
    },
    scrollTo(e) {}
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';

.c_cell--cursor::after {
  content: '';
  position: absolute;
  top: 15px;
  display: inline-block;
  width: 2px;
  height: 20px;
  animation: blink 1s infinite steps(1, start);
}
.c_cell--cursor{
  font-weight: 500;
}
.c_cell--cursor-placeholder {
  color: #c7c7c7;
  font-weight: 500;
}
@keyframes blink {
  0% {
    background-color: white;
  }
  50% {
    background-color: black;
  }
  100% {
    background-color: white;
  }
}
.c_cell--cursor-placeholder::before {
  content: '';
  position: absolute;
  top: 15px;
  display: inline-block;
  width: 2px;
  height: 20px;
  animation: blink 1s infinite steps(1, start);
}
.c_cell_wrapper {
  position: relative;
  overflow: hidden;
  border: 1px solid #fff;
  // background: #ffffff;
  padding-left: 15px;
  margin-bottom: -1px;
  min-height: 50px;
  .datepicker {
    position: relative;
  }
  .c_cell--muse--datepicker {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  &.active {
    border: 1px solid @primary;
  }
}
.c_cell--warning {
  color: @danger!important;
}
.c_cell_desc {
  font-size: 10px;
  color: @disable;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1;
  line-height: 15px;
  padding: 0 15px;
}
.c_cell {
  height: 50px;
  line-height: 50px;
  // background: #ffffff;
  position: relative;
  display: flex;
  padding-right: 10px;
  &.c_cell--wrap {
    height: auto;
    padding-top: 15px;
    padding-bottom: 15px;
    .title {
      vertical-align: top;
      line-height: 1.2;
    }
    .text {
      line-height: 1.2;
      text-align: left;
    }
  }
  .borderB(@dividers);
  overflow: hidden;
  .right-slot {
    flex: 1;
  }
  .left-slot {
    flex: 1;
  }
  .c_cell_required {
    color: #f50;
    position: absolute;
    top: 0;
    right: -4px;
    height: 4px;
    width: 4px;
    line-height: 1;
  }
  .datepicker {
    flex: 1;
    .mu-text-field {
      width: 100%;
    }
  }
  .title {
    font-size: 18px;
    text-align: left;
    min-width: 64px;
    color: #333333;
  }
  .title-icon {
    .icon {
      font-size: 26px;
      color: @primary!important;
    }
  }
  .link-icon {
    vertical-align: top;
    .icon {
      vertical-align: top;
      color: @primary!important;
    }
  }
  .text {
    font-size: 18px;
    text-align: right;
    color: #333;
    flex: 1;
    font-weight: 500;
  }
  .c_cell_input_box {
    flex: 1;
    .c_cell_input {
      width: 100%;
      text-align: left;
      font-size: 18px;
      float: right;
      height: 50px;
      padding: 10px 20px;
      color: #333;
      box-sizing: border-box;
      outline: none;
      border: 0;
      line-height: normal;
      background: transparent !important;
      font-weight: 500;
      &::-webkit-input-placeholder {
        // color: #999999 !important;
        color: #c7c7c7 !important;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
