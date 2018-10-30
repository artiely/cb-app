import store from '../store'
/* global sendNativeApi */
window.cbStorePicUploadResult = params => {
  alert('回调了成功函数，参数为：', params)
  store.commit('NATIVE_PIC_UPLOAD_OK', params)
}
// 支付成功的回传
window.cbStorePayResult = params => {
  store.commit('NATIVE_PAY_SYS_OK', params)
  // if (params.type === '1') {
  //   store.commit('NATIVE_PAY_SYS_OK', params)
  // } else if (params.type === '2') {
  //   store.commit('NATIVE_PAY_SMS_OK', params)
  // }
}

// 保存成功的回传
window.cbStorePicDownOK = params => {

}

window.sendNativeApi = (method, param) => {
  const _AGREEMENT = 'chebian://'
  const _PARAM = '?param='
  const request = document.createElement('iframe')
  if (param === null || param === '') {
    request.src = _AGREEMENT + method
  } else {
    param = escape(param)
    request.src = _AGREEMENT + method + _PARAM + param
  }
  request.style.display = 'none'
  document.body.appendChild(request)
  window.setTimeout(() => {
    document.body.removeChild(request)
  }, 2000)
}
/**
 * @param {String} params #c7c7c7
 */
const SET_STATUSBAR_COLOR = params => {
  let color = JSON.stringify({
    color: params
  })
  if (window.sendNativeApi) {
    return sendNativeApi('setStatusBar', color)
  } else {}
}

const GET_CAMERA = params => {
  alert(`camera,参数：${params}`, JSON.stringify(params))
  if (window.sendNativeApi) {
    return sendNativeApi('camera', JSON.stringify(params))
  } else {
    console.log('网页环境')
  }
}

const NATIVE_PAY = params => {
  console.info(`pay,参数：${params}`)
  if (window.sendNativeApi) {
    return sendNativeApi('pay', JSON.stringify(params))
  } else {
    console.log('网页环境')
  }
}

const nativeApiList = {
  SET_STATUSBAR_COLOR,
  GET_CAMERA,
  NATIVE_PAY
}
export default nativeApiList
