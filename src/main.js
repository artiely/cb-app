import Vue from 'vue'
// By default we import all the components.
// Only reserve the components on demand and remove the rest.
// Style is always required.
import router from './router'
import './assets/font/iconfont.css'
import './assets/style/main.less'
import './assets/style/router.less'
import './assets/style/border.less'
// import 'muse-ui/lib/styles/base.less'
// import 'muse-ui/lib/styles/theme.less'
import './assets/style/cover.less'
import Vui from './package'
import store from './store'
import Api from './api'
// import draggable from 'vuedraggable'
// import AlloyFinger from 'alloyfinger'
// import AlloyFingerPlugin from 'alloyfinger/vue/alloy_finger.vue'
import {
  Row,
  Col,
  Tabbar,
  TabbarItem,
  Popup,
  Toast,
  Tab,
  Tabs,
  Dialog,
  Switch,
  RadioGroup,
  Radio,
  Cell,
  Field,
  CellGroup,
  Actionsheet,
  Step,
  Steps,
  Checkbox,
  CheckboxGroup,
  PasswordInput,
  DatetimePicker,
  NumberKeyboard,
  Uploader,
  NoticeBar,
  Lazyload,
  Picker,
  Swipe, SwipeItem
  // List
} from 'vant'
// import VueScroller from 'vue-scroller'
import * as filters from './common/filter'
import './common/directive'
// register global utility filters.

// FIXME:  所有组件按需引用 注意多余组件
/**
 * TODO:
 * 所有的组件本地化
 * 逐渐舍弃第三方组件
 * 优化打包体积 提取公共库
 * 字体本地化
 * 路由动画
 * 样式变量管理
 * 去掉pug
 * 考虑是否stylus改为less
 *
 */
import {
  /* eslint-disable no-unused-vars */
  Style,
  Scroll,
  Slide
  // Swipe
  // Dialog as CbDialog,
  // createAPI
} from 'cube-ui'
// import {
//   DateInput,
//   Picker
// } from 'muse-ui'
import App from './App'
import VueScroller from 'vue-scroller'
Vue.use(VueScroller)
// import VConsole from 'vconsole'
/* eslint-disable no-new */
// new VConsole()
// Vue.use(AlloyFingerPlugin, {
//   AlloyFinger
// })
// Vue.use(CbDialog)
// Vue.use(List)
// Vue.use(draggable)
Vue.use(Uploader)
Vue.use(Picker)
Vue.use(NoticeBar)
Vue.use(Lazyload)
// Vue.use(DateInput)
// Vue.use(Picker)
// Vue.use(VueScroller)
Vue.use(Actionsheet)
Vue.use(Vui)
Vue.use(Popup)
Vue.use(Toast)
Vue.use(Swipe).use(SwipeItem)
Vue.use(DatetimePicker)
// Toast.allowMultiple()
Vue.use(Switch)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Field)
Vue.use(Cell).use(CellGroup)
Vue.use(Step).use(Steps)
Vue.use(Checkbox).use(CheckboxGroup)
Vue.use(Dialog)
Vue.use(Scroll)
Vue.use(Slide)
// Vue.use(Swipe)
Vue.use(Api)

Vue.use(Row).use(Col)
Vue.use(Tabbar).use(TabbarItem)
Vue.use(Tab).use(Tabs)
Vue.use(PasswordInput).use(NumberKeyboard)
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// Vue.use(VueAMap);

Vue.config.productionTip = false
Vue.config.devtools = true
// var attachFastClick = require('fastclick')
// attachFastClick(document.body)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
// var _toast = null
// setInterval(function() {
//   var x = navigator.onLine
//   if (!x) {
//     _toast = Toast.loading({
//       message: '请检查您的网络',
//       duration: 0, // 持续展示 toast
//       forbidClick: false // 禁用背景点击
//     })
//   } else {
//     _toast && _toast.clear()
//   }
// }, 3000)

/* global plus */
// document.addEventListener('plusready', function() {
//   var webview = plus.webview.currentWebview()
//   plus.key.addEventListener('backbutton', function() {
//     webview.canBack(function(e) {
//       if (e.canBack) {
//         webview.back()
//       } else {
//         webview.close() // hide,quit
//       }
//     })
//   })
// })
console.log(
  '%c车边团队提供技术支持 v2.0.0',
  'background:#1690ff;color:#fff;padding:4px 6px;font-weight:600'
)

/**
 * 移动端bug总结
 * 部分安卓机（小米）input获取焦点后 点击input外 无法失去焦点
 * 解决办法 特定操作是手动让input失去焦点
 * var input = document.getElementsByClassName('c_cell_input')
      for (let i = 0; i < input.length; i++) {
        input[i].blur()
      }
 */
