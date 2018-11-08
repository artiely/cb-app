import * as types from '../mutation-types'
import { Toast } from 'vant'
import api from '@/api/api'
import Vue from 'vue'
// import moment from 'dayjs'
// import Cookies from 'js-cookie'

// FIXME: 重构购物车数据结构
/*
var s = {
  gasName: '林氏机油',
  gasBrand: '', // 品牌
  code: '001', // 编码
  id: '0d92d7bb32684e80904737367a5fa27c',
  name: '10L',
  price: 150, // 价格
  gasType: '1', // 类型 0 服务 1商品
  gasUnit: '1', // 单位
  count: 1, // 数量
  moneyDec: 10, // 折让金额
  cardType: '', // 卡类型
  cardId: '', // 卡id
  dealEmployee:[], // 施工员
  dealEmployeeIds: '1,2,2', // 施工员ID集（,分割）
}
*/
// initial state
const state = {
  orderInfo: {
    // 接车单信息
    senderName: '',
    senderMobile: '',
    attachment: '',
    // 'receptionOrder.motorTotalMile': '',
    // 'receptionOrder.question': '',
    // 'receptionOrder.suggest': '',
    // 'receptionOrder.expectTime': '',
    // 'receptionOrder.remarks': '',
    // 'receptionOrder.id': '',
    // 订单基本信息
    memberCardPwd: '', // TIP: 划卡多一个密码字段
    orderNoHand: '',
    // orderNo: '',
    motorMileCurrent: '', // 当前里程
    startTime: '',
    sellEmployee: '',
    'memberCard.id': '',
    remarks: '',
    id: '' // 订单的id
  }, // 包含接车单信息 订单基本信息 排除客户信息和购物车
  custom: 'tanjie', // 开单时是否选择了用户
  orderStatus: 1, // 当前开单状态 0123 接车 开单 施工 结算
  storeStatus: 1, // 当前是服务库还是商品库 ->
  shopCar: [], // 用户选择的过的购物车
  goodsUnitMap: [
    { name: '件', id: '件' },
    { name: '个', id: '个' },
    { name: '桶', id: '桶' },
    { name: '套', id: '套' },
    { name: '副', id: '副' },
    { name: '瓶', id: '瓶' },
    { name: '箱', id: '箱' },
    { name: '盒', id: '盒' },
    { name: '支', id: '支' },
    { name: '束', id: '束' }
  ], // 商品单位字典 （目前写死的）
  orderOfCustom: null, // 当前的开单 / 收银 客户信息 开单完成或收银完成 用户信息清空
  orderOfCar: null, // 当前的开单 / 收银 的车信息
  newCustomTel: '',
  newCustomCar: '',
  refresh: 0, // 刷新
  storeStaff: '', // 店铺的员工 由于店铺员工多出使用 FIXME:其他页面的单独请求 去掉
  orderId: '', // 当前操作的订单id 进入开单清空-> 订单保存后生成 修改的时候是订单id
  currentCard: '', // 当前划卡的卡信息
  kdOrderData: 0 // 当前快单订单默认信息状态 0：清空当前数据  1：不变
}

// getters
const getters = {
  // 用户通过增删改查过后的实际结算购物车
  okCart: state => {
    let okCart = state.shopCar.filter(v => {
      console.info('购物车发生了改变 (*￣︶￣)')
      if (v.count > 0) {
        return v
      }
    })
    return okCart
  },
  // 购物车总价
  totalPrice: (state, getters) => {
    let totalPrice = 0
    getters.okCart.map(v => {
      totalPrice += v.price * v.count - (v.moneyDec ? v.moneyDec : 0)
    })
    console.info('总价改变了')
    if (
      state.currentCard &&
      state.currentCard.cardType === '2' &&
      state.currentCard.discount
    ) {
      console.info('总价改变了，并打了折扣')
      totalPrice = totalPrice * state.currentCard.discount
    }
    return Number(totalPrice).toFixed(2)
  },

  // 判断搜索是添加的手机号还是车牌号
  isCar: (state, getters) => {
    if (state.newCustomTel.length === 11) {
      return 11
    } else if (
      state.newCustomTel.length >= 6 &&
      state.newCustomTel.length !== 11
    ) {
      return 7
    }
  },
  // 订单的客户信息 4种场景只有一种存在值得情况
  orderCustomInfo: (state, getters) => {
    return {
      'member.id':
        state.orderOfCustom && !state.orderOfCar && !state.orderOfCustom.motor
          ? state.orderOfCustom.id
          : '',
      'motor.id': state.orderOfCar
        ? state.orderOfCar.id
        : state.orderOfCustom.motor
          ? state.orderOfCustom.motor.id
          : '',
      memberKeyword: state.newCustomTel,
      motorKeyword: state.newCustomCar
    }
  },
  // 这是一个把当前开单的对象封装成 member 和 motor的开单对象
  orderOfCustomObject: (state, getters) => {
    // 客户有车
    if (state.orderOfCustom && state.orderOfCustom.motor) {
      return {
        member: state.orderOfCustom,
        motor: state.orderOfCustom.motor
      }
      // 车有人
    } else if (state.orderOfCar && state.orderOfCar.member) {
      return {
        member: state.orderOfCar.member,
        motor: state.orderOfCar
      }
      // 只有人
    } else if (state.orderOfCustom && !state.orderOfCustom.motor) {
      return {
        member: state.orderOfCar.member
      }
      // 只有车
    } else if (state.orderOfCar && !state.orderOfCustom.member) {
      return {
        motor: state.orderOfCar
      }
      // 新人
    } else if (state.newCustomTel) {
      return {
        member: { username: state.newCustomTel }
      }
      // 新车
    } else if (state.newCustomCar) {
      return {
        motor: { licence: state.newCustomCar }
      }
    }
  }
}

// mutations
const mutations = {
  [types.ORDER_STATUS](state, payload) {
    state.orderStatus = payload
  },
  [types.SET_ORDER_INFO](state, payload) {
    state.orderInfo = Object.assign({}, state.orderInfo, payload)
  },
  [types.CLEAR_ORDER_INFO](state, payload) {
    // 应该还没地方需要使用
    state.orderInfo = {
      senderName: '',
      senderMobile: '',
      attachment: '', // 附件
      // 'receptionOrder.motorTotalMile': '',
      // 'receptionOrder.question': '',
      // 'receptionOrder.suggest': '',
      // 'receptionOrder.expectTime': '',
      // 'receptionOrder.remarks': '',
      // 'receptionOrder.id': '',
      // 订单基本信息
      orderNoHand: '',
      startTime: '',
      sellEmployee: '',
      remarks: '',
      'memberCard.id': '',
      memberCardPwd: '', // TIP: 划卡多一个密码字段
      id: '' // 订单的id
    }
  },
  [types.CLEAR_ORDER_CUSTOM](state, payload) {
    state.newCustomTel = ''
    state.newCustomCar = ''
    state.orderOfCustom = ''
    state.orderOfCar = ''
  },
  [types.STORE_STATUS](state, payload) {
    state.storeStatus = payload
  },
  [types.CLEAR_STAFF_SL](state, payload) {
    // 清空施工人
    state.shopCar.map(v => {
      v.dealEmployee = []
    })
  },
  [types.ORDER_OF_CUSTOM](state, payload) {
    // TIP:在选择当前用户的时候把 新客户清空（充值办卡业务）
    state.newCustomTel = ''
    state.newCustomCar = ''
    state.orderOfCustom = payload
    state.orderOfCar = ''
  },
  [types.NEW_CUSTOM_TEL](state, payload) {
    // TIP: 在设置新客户的时候要把之前选的客户清空（充值办卡业务）
    state.orderOfCustom = ''
    state.newCustomCar = ''
    state.orderOfCar = ''
    state.newCustomTel = payload // 可能是电话号码 也有可能是车牌号 根据长度判断
  },
  [types.NEW_CUSTOM_CAR](state, payload) {
    // TIP: 在设置新客户的时候要把之前选的客户清空（充值办卡业务）
    state.orderOfCustom = ''
    state.orderOfCar = ''
    state.newCustomTel = '' // 可能是电话号码 也有可能是车牌号 根据长度判断
    state.newCustomCar = payload // 可能是电话号码 也有可能是车牌号 根据长度判断
  },
  [types.ORDER_OF_CAR](state, payload) {
    // TIP: 当前收银的车辆
    state.orderOfCar = payload
    state.orderOfCustom = ''
    state.newCustomTel = ''
    state.newCustomCar = ''
  },
  // 添加到购物车
  // 添加数量
  [types.ADD_SHOP_CAR](state, payload) {
    const checkSkuId = (ele, index, array) => {
      return ele.id === payload.id
    }
    // 之前不存在就添加
    if (!state.shopCar.some(checkSkuId)) {
      payload.count = 1
      if (!payload.sellEmployee) {
        payload.sellEmployee = []
      }
      state.shopCar.push(payload)
    } else {
      // 存在就只加数量
      const findIndex = (ele, index, array) => {
        return ele.id === payload.id
      }
      let index = state.shopCar.findIndex(findIndex)
      if (index === -1) return
      state.shopCar[index].count++
    }
  },
  // 减去数量或删除购物车某项
  [types.CUT_SHOP_CAR](state, payload) {
    // 检查购物车里的商品是否减到0了
    let findIndex = (ele, index, array) => {
      return ele.id === payload.id
    }
    let index = state.shopCar.findIndex(findIndex)
    if (index === -1) return
    // TIP: 这里减到0不删除的目的是防止删除后找不到id
    state.shopCar[index].count--
    if (state.shopCar[index].count === 0) {
      // state.shopCar.splice(index, 1)
    }
  },
  // 为商品添加施工人 FIXME: state改变 getters似乎没有重新计算
  [types.SHOP_CAR_SG](state, payload) {
    let findIndex = (ele, index, array) => {
      return ele === payload
    }
    let index = state.shopCar.findIndex(findIndex)
    if (index === -1) return
    Vue.set(state.shopCar, index, payload)
  },
  [types.DEL_SHOP_CAR](state, payload) {
    let findIndex = (el, i, arr) => {
      return el.id === payload.id
    }
    let index = state.shopCar.findIndex(findIndex)
    if (index === -1) return
    state.shopCar.splice(index, 1)
    Toast.success('删除成功')
    if (state.shopCar.length === 0) {
      // 购物车为空时回到最初状态
      state.currentCard = ''
    }
  },
  // 清空购物车
  [types.CLEAR_SHOP_CAR](state, payload) {
    state.shopCar = []
    if (state.shopCar.length === 0) {
      // 购物车为空时回到最初状态
      state.currentCard = ''
    }
  },
  [types.REFRESH](state, payload) {
    state.refresh++
  },
  [types.SET_STORE_STAFF](state, payload) {
    state.storeStaff = payload
  },
  // 直接添加一个数组到购物车 在选择模板的时候 并过滤掉已选择的商品
  /**
   * 添加商品数组到购物车
   * 场景1 购物车没有商品
   * 场景2 购物车有商品
   * 场景3 购物车有商品且商品数量为0 商品数量为0是不会加入到最终购物列表的
   */
  [types.PUSH_SHOP_CAR](state, payload) {
    if (state.shopCar.length === 0) {
      state.shopCar.push(...payload)
    } else {
      let data = payload.filter(v => {
        // 剔除id不等并count=0的商品
        const hasIn = (el, i) => {
          return el.id === v.id && el.count > 0
        }

        if (!state.shopCar.some(hasIn)) {
          return v
        }
      })
      state.shopCar.push(...data)
    }
  },
  [types.SET_ORDER_ID](state, payload) {
    state.orderId = payload
  },
  [types.SET_CURRENT_CARD](state, payload) {
    state.currentCard = payload
    state.orderInfo['memberCard.id'] = payload.id
  },
  [types.CLEAR_CURRENT_CARD](state) {
    state.currentCard = ''
  },
  [types.CLEAR_ORDER_DATA](state, orderDataState) {
    state.kdOrderData = orderDataState
  }
}

// actions
const actions = {
  async getStoreStaff({ commit }, payload) {
    let res = await api.EMPLOYEE_LIST()
    if (res.status === 1) {
      commit('SET_STORE_STAFF', res.list)
    }
  },
  // 异步清空购物车
  clearShopCar({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit('CLEAR_SHOP_CAR')
      resolve()
    })
  },
  // 清空重置订单
  clearOrder({ commit }, payload) {
    commit('CLEAR_ORDER_INFO')
    commit('CLEAR_ORDER_CUSTOM')
    commit('CLEAR_SHOP_CAR')
    commit('CLEAR_CURRENT_CARD')
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
