// FIXME:逮删除文件
// 新增卡的
import * as types from '../mutation-types'
// import api from '@/api/api'

// initial state
const state = {
  cardType: '', // 办卡的类型 2是折扣卡 3是次卡
  skuList: [] // 新增次卡和折扣卡选择的商品sku
}

// getters
const getters = {
  // 用户通过增删改查过后的实际结算购物车
  skuListFilter: state => {
    let skuList = state.skuList.filter(v => {
      if (state.cardType === '3') {
        if (v.count !== 0) {
          return v
        }
      } else {
        return v
      }
    })
    return skuList
  }
}

// mutations
const mutations = {
  [types.SET_SKU_LIST_CARD](state, payload) {
    const findHasIndex = (element) => {
      return element.id === payload.id
    }
    let index = state.skuList.findIndex(findHasIndex)
    //   折扣卡直接选择sku
    if (index !== -1) { // 存在删除
      state.skuList.splice(index, 1)
      console.info('折扣卡添加sku 删除')
    } else { // 不存在添加
      console.info('折扣卡添加sku ++')
      state.skuList.push(payload)
    }
  },
  [types.SETONCE_SKU_LIST_CARD](state, payload) {
    state.skuList.push(...payload)
  },
  [types.ADD_SKU_LIST_CARD](state, payload) {
    console.info('次卡添加sku')
    const findHasIndex = (element) => {
      return element.id === payload.id
    }
    let index = state.skuList.findIndex(findHasIndex)
    if (index !== -1) { // 存在count++
      state.skuList[index].count++
    } else { // 不存在添加
      payload.count = 1
      state.skuList.push(payload)
    }
  },
  [types.PUSH_SKU_LIST_CARD](state, payload) {
    console.info('次卡添加sku')
    const findHasIndex = (element) => {
      return element.id === payload.id
    }
    let index = state.skuList.findIndex(findHasIndex)
    if (index !== -1) { // 存在=1
      state.skuList[index].count = 1
    } else { // 不存在添加
      payload.count = 1
      state.skuList.push(payload)
    }
  },
  [types.CUT_SKU_LIST_CARD](state, payload) {
    console.info('次卡减sku')
    const findHasIndex = (element) => {
      return element.id === payload.id
    }
    let index = state.skuList.findIndex(findHasIndex)
    if (index !== -1) { // 存在count++
      state.skuList[index].count--
      // 减到0 还是不能删除
    } else {
      // ...
    }
  },
  [types.NOLIMIT_SKU_LIST_CARD](state, payload) {
    console.info('次卡不限sku')
    const findHasIndex = (element) => {
      return element.id === payload.id
    }
    let index = state.skuList.findIndex(findHasIndex)
    if (index !== -1) {
      // count=0大致等于删除但是存在 如果存在让其变成无限次否则0(删除)
      if (state.skuList[index].count === 0) {
        state.skuList[index].count = -1
      } else {
        state.skuList[index].count = 0
      }
    } else { // 不存在添加
      payload.count = -1
      state.skuList.push(payload)
    }
  },
  [types.DEL_SKU_CARD](state, index) {
    state.skuList.splice(index, 1)
  },
  [types.CLEAR_SKU_CARD](state, index) {
    state.skuList = []
  }
}

const actions = {
}

export default {
  state,
  getters,
  actions,
  mutations
}
