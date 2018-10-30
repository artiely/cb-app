import * as types from '../mutation-types'
import Cookies from 'js-cookie'
import {
  Toast
} from 'vant'
import api from '@/api/api'
import router from '../../router'
// initial state
const state = {
  role: null, // 角色权限\
  storeId: '', // 当前登录店铺的id
  menuList: [], // 当前用户的可用请求
  menuNav: [], // 当前用户可用功能
  unAuthMenu: [],
  messages: [],
  isExp: false, // 当前是否体验版
  product: {}, // 购买的产品
  smsNum: 0, // 短信余量
  currentUser: '', // 当前登陆者信息
  refresh: false, // 全局定义的刷新状态，在为true的时候执行特定的操作，然后重置为false
  brand: {}, // 当前新增的商品的品牌
  roleAdmin: [
    // {
    //   text: '充值',
    //   path: '/chargeactivelist',
    //   name: 'ChargeActiveList',
    //   color: '#fff',
    //   bgColor: '#5db1ff',
    //   icon: 'icon-chongzhi',
    //   params: ''
    // },
    // {
    //   text: '办卡',
    //   path: '/cardlist',
    //   name: 'CardList',
    //   color: '#fff',
    //   bgColor: '#5db1ff',
    //   icon: 'icon-banka',
    //   params: ''
    // },
    {
      text: '记一笔',
      path: '/record',
      name: 'Record',
      color: '#0dcc6d',
      bgColor: 'transparent',
      icon: 'icon-jiyibi',
      params: ''
      // disabled: true
    },
    {
      text: '收支账本',
      path: '/balancepaymentcount',
      name: 'BalancePaymentCount',
      color: '#0090ff',
      bgColor: 'transparent',
      icon: 'icon-shouzhizhangben',
      params: ''
    },
    {
      text: '优惠券',
      path: '/coupon',
      name: 'Coupon',
      color: '#1690ff',
      bgColor: 'transparent',
      icon: 'icon-xiaotubiao-17',
      params: ''
      // disabled: true
    },
    {
      text: '客户储值账户',
      path: '/valuecard',
      name: 'ValueCard',
      color: '#0dcc6d',
      bgColor: 'transparent',
      icon: 'icon-chuzhiqia-',
      params: ''
    },
    {
      text: '客户卡列表',
      path: '/ticket',
      name: 'Ticket',
      color: '#ffaa00',
      bgColor: 'transparent',
      icon: 'icon-bankajilu',
      params: ''
    },
    {
      text: '服务库/商品库',
      path: '/serviceadd',
      name: 'ServiceAdd',
      color: '#0ebfee',
      bgColor: 'transparent',
      icon: 'icon-fuwushangpinku',
      params: ''
    },
    // {
    //   text: '商机',
    //   path: '/business',
    //   name: 'Business',
    //   color: '#1690ff',
    //   icon: 'icon-xiaotubiao-24',
    //   params: '',
    //   disabled: true
    // },
    {
      text: '交班',
      path: '/handover',
      name: 'Handover',
      color: '#0090ff',
      bgColor: 'transparent',
      icon: 'icon-jiaoban',
      params: ''
    },
    // {
    //   text: '券领用记录',
    //   path: '/couponreceive',
    //   name: 'CouponReceive',
    //   color: '#0dcc6d',
    //   icon: 'icon-xiaotubiao-21',
    //   params: ''
    // },
    {
      text: '开单模板',
      path: '/templist',
      name: 'TempList',
      color: '#ef1080',
      bgColor: 'transparent',
      icon: 'icon-kaidanmoban',
      params: ''
      // disabled: true
    },
    {
      text: '员工管理',
      path: '/yggl',
      name: 'yggl',
      color: '#0090ff',
      bgColor: 'transparent',
      icon: 'icon-yuangongguanli',
      params: ''
      // disabled: true
    },
    {
      text: '角色管理',
      path: '/rolemanagement',
      name: 'RoleManagement',
      color: '#0ebfee',
      bgColor: 'transparent',
      icon: 'icon-jiaoseguanli',
      params: ''
      // disabled: true
    },
    {
      text: '自动推送',
      path: '/jzts',
      name: 'jzts',
      color: '#ffaa00',
      bgColor: 'transparent',
      icon: 'icon-zidongtuisong',
      params: ''
      // disabled: true
    },
    {
      text: '商家管理',
      path: '/company',
      name: 'company',
      color: '#0090ff',
      bgColor: 'transparent',
      icon: 'icon-qiyeguanli',
      params: ''
      // disabled: true
    },
    {
      text: '短信充值',
      path: '/buysms',
      name: 'BuySms',
      color: '#ffaa00',
      bgColor: 'transparent',
      icon: 'icon-duanxinyuliang',
      params: ''
      // disabled: true
    },
    {
      text: '消息',
      path: '/message',
      name: 'Message',
      color: '#0ebfee',
      bgColor: 'transparent',
      icon: 'icon-xiaoxi1',
      params: '',
      num: 0
    },
    {
      text: '小程序管理',
      path: '/wxmp',
      name: 'Wxmp',
      color: '#0ebfee',
      bgColor: 'transparent',
      icon: 'icon-xiaoxi1',
      params: '',
      num: 0
    }
  ]
}

// getters
const getters = {}

// mutations
const mutations = {
  [types.MENU_LIST](state, payload) {
    state.menuList = payload
    window.menuList = payload
    Cookies.set('menuList', JSON.stringify(payload))
  },
  [types.UNAUTH_MENU](state, payload) {
    state.unAuthMenu = payload
  },
  [types.SET_BRAND](state, payload) {
    state.brand = payload
  },
  [types.CLEAR_BRAND](state) {
    state.brand = {}
  },
  [types.SER_REFRESH](state, payload) {
    state.refresh = payload
  },
  [types.IS_EXP](state, payload) {
    state.isExp = payload
  },
  [types.SET_MESSAGES](state, payload) {
    state.messages = payload
  },
  [types.SET_PRODUCT](state, payload) {
    state.product = payload
  },
  [types.SMS_USABLE](state, payload) {
    state.smsNum = payload
  },
  [types.CURRENT_USER](state, payload) {
    state.currentUser = payload
  },
  [types.SET_MENU_NAV](state, payload) {
    state.menuNav = state.roleAdmin.filter((v) => {
      var has = function(el) {
        return v.name === el.code
      }
      if (payload.some(has)) {
        return v
      }
    })
  }
}

// actions
const actions = {
  // 获取消息
  async getMessages({
    commit
  }, payload) {
    let res = await api.MSG_LIST()
    if (res.status === 1) {
      commit('SET_MESSAGES', res.page.list)
    } else {
      console.error(res.status + '获取消息失败')
    }
  },
  // 获取短信余量
  async getSmsNum({
    commit
  }, payload) {
    let res = await api.SMS_USABLE_NUM()
    if (res.status === 1) {
      commit('SMS_USABLE', res.data)
    } else {
      console.error(res.status + '获取消息失败')
    }
  },
  // 获取当前登陆者信息
  async getCurrentUser({
    commit
  }, payload) {
    let res = await api.CURRENT_USER()
    if (res.status === 1) {
      commit('CURRENT_USER', res.data)
    } else {
      console.error(res.status + '获取当前登陆者失败')
    }
  },
  logout({
    commit
  }, payload) {
    return new Promise(async(resolve, reject) => {
      let res = await api.LOGOUT()
      if (res.status === 1) {
        Toast.success('退出成功')
        window.sessionStorage.removeItem('vuex')
        window.sessionStorage.removeItem('__token__')
        Cookies.remove('menuList')
        router.replace('/login')
        window.location.reload()
        resolve()
      } else {
        console.error('退出失败')
        reject(new Error('退出失败'))
      }
    })
  },
  async getroleMenuNav({
    commit
  }, payload) {
    let res = await api.ROLE_MENU()
    if (res.status === 1) {
      commit('SET_MENU_NAV', res.list || [])
      let add = []
      // 手动添加权限 一组权限就是一组路径不可访问 没有列表的权限就没有对应的编辑的权限
      res.data.map(v => {
        if (v.code === 'ChargeActiveList') {
          add.push({
            code: 'ChargeActive'
          })
        }
        if (v.code === 'CardList') {
          add.push({
            code: 'ChargeTicket'
          })
        }
        if (v.code === 'TempList') {
          add.push({
            code: 'TempEdit'
          })
        }
      })

      commit('UNAUTH_MENU', res.data.concat(add))
      console.log('获取的菜单结果', res.list)
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
