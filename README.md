# chebian-mobile

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
<!-- TODO: scroll 监听query除了page改变外，都应该将page重置为1并滚动到顶端 -->

## vue你或许不知道的小知识
1.js中使用过滤器
2.父子组件事件传参$emit(params,$event)
3.骨架屏
### vuex篇
1.在一个模块中调用另一个模块的属性或方法
2.mixins大发好
3.store持久化
4.计算属性的get和set
5.action中调用action
### router篇
1.传值query,params
2.是否显示导航的路由设计
3.router中使用store
4.前进刷新（有操作后退也刷新）
### 数据请求篇
5.axios封装
6.qs的使用
/**
 * 移动端bug总结
 * 部分安卓机（小米）input获取焦点后 点击input外 无法失去焦点
 * 解决办法 特定操作是手动让input失去焦点
 * var input = document.getElementsByClassName('c_cell_input')
      for (let i = 0; i < input.length; i++) {
        input[i].blur()
      }
 */
