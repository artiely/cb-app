/**
 * 与收银账户相关的store
 * 与account.vue组件重度耦合
 */
import * as types from '../mutation-types'
import api from '@/api/api'

// initial state
const state = {
  accountDefault: {},
  accountList: [],
  accountCus: null,
  accountType: '1' // 收款账户类别（1店铺账户 2会员储值账户）【订单收款时，前端提交】
}

// getters
const getters = {
  // 用户通过增删改查过后的实际结算购物车
}
// mutations
const mutations = {
  /**
   * 设置默认账户
   * payload是账户列表的每一项数据结构为下
   * 客户的储值账户带有cardType=1就表示是储值账户
   * {
      cardType: "1",
      createBy: "张金俊",
      createDate: 1530090638000,
      delFlag: "0",
      id: "b7d5a88cc4dd4d429d608cb8f4684b51",
      isNewRecord: false,
      member: {
        id: "239b127b8f2c40aaa0a2fe8cd11c64fe",
        isNewRecord: false,
        operateSrc: "1"
      },
      moneyTotal: 15693,
      moneyUsable: 11210,
      name: "储值卡",
      no: "CN000051",
      operateSrc: "1",
      remarks: "够够够够",
      scopeType: "1"
    }
   * 商户的收款账户
   * {
    "id": "5d46b66488a946fcb191b522ab738746",
    "isNewRecord": false,
    "operateSrc": "1",
    "createDate": 1529045956000,
    "updateDate": 1534126965000,
    "delFlag": "0",
    "store": {
    "id": "d4ed2e380bdd4304a7257448c40a7c7a",
    "isNewRecord": false,
    "operateSrc": "1"
    },
    "accountType": "0",
    "accountName": "现金账户",
    "accountBalance": 0,
    "recordBalance": 2194955,
    "isPayDefault": "1",
    "isReceiptDefault": "1",
    "isEnable": "1"
    },
   * cardType为1就是储值账户提交给后台的`accountType=2`表示是储值账户`=1`表示是商户账户
   * 在提交结算的时候需要同时提交`accountType`和`accountDefault.id`
   */
  [types.SET_ACCOUNT_DEFAULT](state, payload) {
    if (payload && payload.cardType === '1') {
      state.accountType = '2'
    } else {
      state.accountType = '1'
    }
    state.accountDefault = payload
  },
  /**
   * 设置当前商户的收款账户列表
   */
  [types.SET_ACCOUNT_LIST](state, payload) {
    state.accountList = payload
  },
  /**
   * 设置当前会员储值账户（有些情况是只有商户收款列表没有会员储值账户的，在组件accout.vue中如果没有传递memberId属性的时候是需要手动将会员储值账户清空的）调用如下
   * this.$store.commit('SET_ACCOUNT_CUS',null)
   */
  [types.SET_ACCOUNT_CUS](state, payload) {
    state.accountCus = payload
  }
}

// actions
const actions = {
  /**
   * 所有获取账户信息的统一action(包含用户的储值账户，有memberId表示有会员信息)
   * 有会员信息很大概率有储值账户
   * 有会员储值账户就赋值,没有就清空之前的，充值办卡业务是没有客户储值的
   */
  async accountCusAndStore({
    commit
  }, payload) {
    let res = await api.ACCOUNT_CUS_STORE({
      memberId: payload
    })
    if (res.status === 1) {
      if (res.data && res.data.id) {
        commit('SET_ACCOUNT_CUS', res.data)
        commit('SET_ACCOUNT_DEFAULT', res.data)
      } else {
        commit('SET_ACCOUNT_CUS', null)
        commit('SET_ACCOUNT_DEFAULT', res.list[0])
      }
      commit('SET_ACCOUNT_LIST', res.list)
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
