// const proxyKey = ['/ns-index/**/*']
// var proxyList = {}
// proxyKey.map(v => {
//   proxyList[v] = {
//     target: 'http://192.168.2.113:8089', // （这里是代理接口的位置）
//     changeOrigin: true // （允许跨域，如果这不写，调用接口接口时会有跨域错误说缺少请求头）
//   }
// })

var proxyList = {
  '/ns-index': {
    target: 'http://192.168.2.118:8089', //jj
    // target: 'http://192.168.2.136:8082', // yc
    // target: 'http://www.51chebian.com', // ww
    // target: 'http://www.51chebian.com', // yc
    changeOrigin: true,
    pathRewrite: {
      // '^/ns-index': ''
    }
  }
}

console.log('设置代理中...', proxyList)
module.exports = {
  proxyList
}
