import Vue from 'vue'
import Vuex from 'vuex'
import sys from './modules/sys'
import order from './modules/order'
import card from './modules/card'
import native from './modules/native'
// import shopcart from './modules/shopcart'
import account from './modules/account'
import createLogger from 'vuex/dist/logger'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    sys,
    order,
    card,
    native,
    // shopcart,
    account
    // permission
  },
  plugins: [createLogger(), createPersistedState({
    storage: window.sessionStorage
  })]
})

export default store
