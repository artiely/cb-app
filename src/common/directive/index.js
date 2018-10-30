import Vue from 'vue'
// 搜索高亮
Vue.directive('highlight', {
  bind: function(el, binding, vnode) {
    let keywords = binding.value
    let allText = el.innerText
    let res = allText.replace(
      keywords,
      `<span style="color:red">${keywords}</span>`
    )
    el.innerHTML = res
  },
  update: function(el, binding, vnode) {
    let keywords = binding.value
    let allText = el.innerText
    let res = allText.replace(
      keywords,
      `<span style="color:red">${keywords}</span>`
    )
    el.innerHTML = res
  }
})

// 搜索高亮
Vue.directive('delHtmlTag', {
  bind: function(el, binding, vnode) {
    let str = el.innerText
    el.innerHTML = str.replace(/<[^>]+>/g, '')
  },
  update: function(el, binding, vnode) {
    let str = el.innerText
    el.innerHTML = str.replace(/<[^>]+>/g, '')
  }
})

// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function(el, binding) {
    // 聚焦元素
    if (binding.value) {
      el.focus()
    }
  },
  update: function(el, binding) {
    // 聚焦元素
    if (binding.value) {
      el.focus()
    }
  }
})
