const { resolve } = require('path')
var express = require('express')
var app = express()
app.use(express.static(__dirname + '/dist'))
var proxy = require('http-proxy-middleware')
var options = {
  // target: 'http://192.168.2.116:8089', // 目标主机
  //target: '//192.168.2.113:8089', // 张金俊
  target: 'http://www.51chebian.com', // 线上
  changeOrigin: true, // 需要虚拟主机站点
  pathRewrite: {
     '^/ns-index': ''
  }
}
var exampleProxy = proxy(options) //开启代理功能，并加载配置
app.use('/ns-index', exampleProxy) //对地址为’/‘的请求全部转发
app.listen(3099)
