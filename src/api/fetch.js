import axios from 'axios'
import router from '@/router'
// import Cookies from 'js-cookie'
import NProgress from 'nprogress'
import { Toast, Dialog } from 'vant'
import 'nprogress/nprogress.css'
import Cookies from 'js-cookie'
import qs from 'qs'
// import isJSON from 'is-json'
var isProduction = process.env.NODE_ENV === 'production'
const baseURL = isProduction
  // ? '/ns-index/store/rest/'
  ? 'http://dp.51chebian.com/store/rest/'
  // ? 'http://www.51chebian.com/store/rest/'
  : '/ns-index/store/rest/'

NProgress.configure({ showSpinner: false })
// const baseURL = '/ns-index/store/rest/'
export default function fetch(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      // `paramsSerializer`是一个可选的函数，是用来序列化参数
      // 例如：（https://ww.npmjs.com/package/qs,http://api.jquery.com/jquery.param/)
      // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
      transformResponse: [
        // 这里是一个跳转到登录逻辑的判断 如果后台返回的不是json就直接跳转到登录
        function(data) {
          try {
            data = JSON.parse(data)
          } catch (e) {
            console.error(e)
          }
          if (typeof data !== 'object') {
            console.log('%c小样儿~！接口出问题啦', 'padding:4px 6px;background:#f00;color:#fff;font-weight:600')
            return {
              status: 4
            }
          }
          return data
        }
      ],
      withCredentials: true
    })
    instance.interceptors.request.use(
      config => {
        NProgress.start()
        /* const token = Cookies.get('__token__')
        if (token) {
          // 这里将token设置到headers中，header的key是Authorization，这个key值根据你的需要进行修改即可
          config.headers.authorization = token
        } */

        // 判断url是否存在没有直接返回无权限
        let url = config.url
        url = url.split('/ns-index/store/rest/')
        // console.log('config', url)
        if (!url[0]) {
          Toast.fail('无权限！')
          console.error('无权限！')
          return
        }
        if (url[0] === '/login') {
          console.error('无本地权限！')
          window.sessionStorage.removeItem('__token__')
          window.sessionStorage.removeItem('vuex')
          Cookies.remove('menuList')
          router.replace({
            name: 'Login'
          })
          return
        }
        // 参数进行序列化
        config.data = qs.stringify(config.data, {
          arrayFormat: 'indices',
          allowDots: true
        })
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )

    instance.interceptors.response.use(
      response => {
        return response
      },
      error => {
        return Promise.reject(error)
      }
    )

    // 请求处理
    instance(options)
      .then(res => {
        NProgress.done()
        if (res.status === 200) {
          // 请求状态为 4 session 过期 去登录
          // 其他 公用状态 处理 如权限不足的提示
          if (res.data.status === 4) {
            // session过期 清楚本地session
            window.sessionStorage.removeItem('__token__')
            window.sessionStorage.removeItem('vuex')
            router.replace({
              name: 'Login'
            })
            window.location.reload()
          } else if (res.data.status === 1) {
            resolve(res.data)
          } else {
            resolve(res.data)
            // 状态不为1
            Dialog.alert({
              title: '提示',
              confirmButtonText: '确定',
              message: `
              <div>
                <div>【${res.data.status}】${res.data.stateMessage}</div>
              </div>`
            }).then(() => {
              // on close
            })
          }
        } else {
          Toast.fail(res.status)
        }
        return false
      })
      .catch(error => {
        NProgress.done()
        Toast.fail('请求出错')
        console.error(`来自响应结果的错误:${error}`)
        reject(error)
      })
  })
}
