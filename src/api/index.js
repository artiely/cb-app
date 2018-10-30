import apiList from './api'
import nativeApiList from './nativeApi'

const install = function(Vue) {
  if (install.installed) return
  install.installed = true
  Object.defineProperties(Vue.prototype, {
    $api: {
      get() {
        return {...apiList, ...nativeApiList}
      }
    }
  })
}

export default {
  install
}
