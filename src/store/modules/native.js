import * as types from '../mutation-types'
import router from '../../router'
// import api from '@/api'
const state = {
  imgBaseUrl: 'https://static-oss-chebian.oss-cn-beijing.aliyuncs.com/public/',
  orderPicList: [], // 开单 单据/照片
  wxPicList: [] // 小程序宣传图 最多4张
}

// getters
const getters = {}

// mutations
const mutations = {
  [types.NATIVE_PAY_SYS_OK](state, payload) {
    console.log('payload', payload)
    if (payload.status === 'success') {
      router.replace({
        name: 'Paying',
        params: {
          params: payload
        }
      })
    } else {
      if (payload.type === '1') {
        router.replace({
          name: 'Payerror',
          params: {
            params: payload
          }
        })
      } else {
        router.replace({
          name: 'SmsPayerror',
          params: {
            params: payload
          }
        })
      }
    }
  },
  [types.NATIVE_PIC_UPLOAD_OK](state, payload) {
    if (state.wxPicList.length < 4) {
      state.wxPicList.push(payload.fileName)
    }
  },
  [types.NATIVE_PIC_UPLOAD_OK_ORDER](state, payload) {
    if (state.orderPicList.length < 4) {
      state.orderPicList.push(payload.fileName)
    }
  },
  [types.SET_NATIVE_PIC_ORDER](state, payload) {
    state.orderPicList = payload
  },
  [types.CLEAR_NATIVE_PIC_ORDER](state, payload) {
    state.orderPicList = []
  },
  [types.NATIVE_PIC_DEL_ORDER](state, index) {
    state.orderPicList.splice(index, 1)
  }
}

const actions = {}

export default {
  state,
  getters,
  actions,
  mutations
}
