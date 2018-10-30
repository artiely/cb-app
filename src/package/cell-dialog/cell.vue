<template>
  <div class=" c_cell_wrapper">
    <div class="c_cell">
      <div class="title" v-if="title">
        <v-icon class="title-icon" :name="titleicon" v-if="titleicon"></v-icon>
        {{title}}
        <span v-if="required" class="c_cell_required">*</span>
        <v-badge v-if="badge" size="small">{{badge}}</v-badge>
      </div>
      <div class="datepicker" v-if="datepicker||datetimepicker">
        <!-- <mu-date-picker :hintText="datepicker?date:datetime" :fullWidth="true" :value="value" @input="handleDate" :minDate="mindate" /> -->
        <mu-date-input v-if="datetimepicker" class="c_cell--muse--datepicker" solo @input="handleDate" v-model="value" :min-date="mindate" :label="label" :label-float="false" actions clock-type="24hr" type="dateTime" container="dialog" full-width></mu-date-input>
        <mu-date-input v-if="datepicker" class="c_cell--muse--datepicker" solo @input="handleDate" v-model="value" :min-date="mindate" :label="label" :label-float="false" actions clock-type="24hr" type="date" container="dialog" full-width></mu-date-input>
      </div>
      <div class="text" v-if="text&&!datepicker&&!input&&!datetimepicker" @click="rightClick">
        <span :style="options&&options.textStyle?options.textStyle:''">{{text}}</span>
      </div>
      <slot name="left" class="left-slot">
      </slot>
      <slot name="right" class="right-slot">
      </slot>
      <div class="c_cell_input_box" v-if="input">
        <input :type="type" placeholder="请输入" @input="handleInput" @blur="handleInput" :value="value" :class="{'c_cell--warning':value.length>maxlength}" :disabled="disabled" class="c_cell_input" :maxlength="maxlength" @focus="scrollTo">
        <!-- @onKeyUp="keyup" @onpaste="keyup" @oncontextmenu="keyup" -->
      </div>
      <v-icon class="link-icon" name="icon-youjiantou1" v-if="link"></v-icon>
      <p class="c_cell_desc textover1 clearfix" v-if="descTitle||descText||maxlength">
        <span class="fl" v-if="descTitle">{{descTitle}}</span>
        <span class="fr" v-if="descText">{{descText}}</span>
        <span class="fr" v-if="maxlength">
          <span :class="{'c_cell--warning':value.length>maxlength}">{{value.length}}</span> /{{maxlength}}</span>
      </p>
    </div>
  </div>
</template>

<script>
import moment from 'dayjs'
import VBadge from '../badge/badge'
export default {
  components: {
    VBadge
  },
  name: 'v-cell-dialog',
  data() {
    return {
      date: moment().format('YYYY-MM-DD'),
      datatime: moment().format('YYYY-MM-DD HH:mm')
    }
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: moment().format('YYYY-MM-DD HH:mm')
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
    date: {
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    handleInput(e) {
      var value = e.target.value
      if (this.type.toLowerCase() === 'number') {
        e.target.value = e.target.value.replace(/[^\d]/g, '')
        if (e.target.value > this.maxValue) {
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
      this.$emit('right-click', event)
    },
    scrollTo(e) {
      // this.$emit('scroll', e)
      // e.target.scrollIntoViewIfNeeded(true)
      // setTimeout(() => {
      //   this.$emit('input', '123 ')
      // }, 200)
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';
.c_cell_wrapper {
  position: relative;
  overflow: hidden;
  margin-bottom: 1px;
  border: 1px solid #fff;
  background: #ffffff;
  .borderB(@dividers);
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
  height: 60px;
  line-height: 60px;
  padding: 0 16px;
  background: #ffffff;
  position: relative;
  display: flex;

  overflow: hidden;
  .right-slot {
    flex: 1;
  }
  .left-slot {
    flex: 1;
  }
  .c_cell_required {
    color: #f50;
  }
  .datepicker {
    flex: 1;
    .mu-text-field {
      width: 100%;
    }
  }
  .title {
    font-size: 16px;
    text-align: left;
    // flex: 1;
    // max-width: 100px;
    color: #333;
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
    }
  }
  .text {
    font-size: 15px;
    text-align: right;
    color: #999;
    flex: 1;
  }
  .c_cell_input_box {
    flex: 1;
    .c_cell_input {
      width: 100%;
      text-align: left;
      font-size: 16px;
      float: right;
      height: 60px;
      padding: 10px 0;
      color: #666666;
      box-sizing: border-box;
      outline: none;
      border: 0;
      line-height: normal;
      &::-webkit-input-placeholder {
        color: #999999 !important;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
