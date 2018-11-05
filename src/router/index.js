import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/auth/Login'
import Home from '@/views/home/Home'
import Index from '@/views/home/Index'
import Cookies from 'js-cookie'
import store from '../store'
import Kaidan from '@/views/order/Kaidan'
import Order from '@/views/order/Order'
import Custom from '@/views/custom/Custom'
import OrderSearch from '@/views/search/OrderSearch'
import CashDesk from '@/views/cash/CashDesk'
import {
  Toast
} from 'vant'
var timer

function lazyLoad(path) {
  return () => {
    clearTimeout(timer)
    let toast = Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      message: '跳转中...'
    })
    timer = setTimeout(() => {
      if (toast) {
        toast = Toast.loading({
          forbidClick: true, // 禁用背景点击
          message: '网络差...'
        })
      }
    }, 10000)
    return import(`@/views/${path}`).then(component => {
      return component
    }).catch(() => {
      console.error('获取页面失败')
      window.location.reload()
    }).finally(() => {
      toast.clear()
      toast = null
    })
  }
}

let menuList = Cookies.getJSON('menuList')
if (menuList && menuList !== 'undefined') {
  store.commit('MENU_LIST', menuList)
} else {
  menuList = []
}
Vue.use(Router)
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: lazyLoad('auth/Register')
  },
  {
    path: '/changepassword',
    name: 'ChangePassword',
    component: lazyLoad('user/ChangePassword')
  },
  {
    path: '/forgetpassword',
    name: 'ForgetPassword',
    component: lazyLoad('auth/ForgetPassword')
  },
  {
    path: '/customdetail',
    name: 'CustomDetail',
    component: lazyLoad('custom/CustomDetail'),
    meta: {
      auth: true
    }
  },
  {
    path: '/search',
    name: 'Search',
    component: lazyLoad('search/Search'),
    meta: {
      auth: true
    }
  },
  {
    path: '/tempedit',
    name: 'TempEdit',
    component: lazyLoad('order/orderTemp/TempEdit'),
    meta: {
      auth: true
    }
  },
  {
    path: '/templist',
    name: 'TempList',
    component: lazyLoad('order/orderTemp/TempList'),
    meta: {
      auth: true
    }
  },
  {
    path: '/buy',
    name: 'Buy',
    component: lazyLoad('auth/Buy')
  },
  {
    path: '/payok',
    name: 'Payok',
    component: lazyLoad('auth/Payok')
  },
  {
    path: '/paying',
    name: 'Paying',
    component: lazyLoad('auth/Paying')
  },
  {
    path: '/smspayok',
    name: 'SmsPayok',
    component: lazyLoad('sys/SmsPayok')
  },
  {
    path: '/smspayerror',
    name: 'SmsPayerror',
    component: lazyLoad('sys/SmsPayerror')
  },
  {
    path: '/buylogin',
    name: 'BuyLogin',
    component: lazyLoad('auth/BuyLogin')
  },
  {
    path: '/topay',
    name: 'ToPay',
    component: lazyLoad('auth/ToPay')
  },
  {
    path: '/registerok',
    name: 'Registerok',
    component: lazyLoad('auth/Registerok')
  },
  {
    path: '/payerror',
    name: 'Payerror',
    component: lazyLoad('auth/Payerror')
  },
  {
    path: '/shits',
    name: 'Shits',
    component: lazyLoad('user/Shits'),
    meta: {
      auth: true
    }
  },
  {
    path: '/searchcar',
    name: 'SearchCar',
    component: lazyLoad('search/SearchCar'),
    meta: {
      auth: true
    }
  },
  {
    path: '/searchcus',
    name: 'SearchCus',
    component: lazyLoad('search/SearchCus'),
    meta: {
      auth: true
    }
  },
  {
    path: '/countrecord',
    name: 'CountRecord',
    component: lazyLoad('count/CountRecord'),
    meta: {
      auth: true
    }
  },
  // {
  //   path: '/jieche',
  //   name: 'Jieche',
  //   component: lazyLoad('order/Jieche'),
  //   meta: {
  //     auth: true
  //   }
  // },
  {
    path: '/kaidan',
    name: 'Kaidan',
    // component: lazyLoad('order/Kaidan'),
    component: Kaidan,
    meta: {
      auth: true
    }
  },
  {
    path: '/addgoods',
    name: 'AddGoods',
    component: lazyLoad('goods/AddGoods'),
    meta: {
      auth: true
    }
  },
  {
    path: '/goodsdetail',
    name: 'GoodsDetail',
    component: lazyLoad('goods/GoodsDetail'),
    meta: {
      auth: true
    }
  },
  {
    path: '/jiechedetail',
    name: 'JiecheDetail',
    component: lazyLoad('order/JiecheDetail'),
    meta: {
      auth: true
    }
  },
  {
    path: '/shigong',
    name: 'Shigong',
    component: lazyLoad('order/Shigong'),
    meta: {
      auth: true
    }
  },
  {
    path: '/detail',
    name: 'Detail',
    component: lazyLoad('custom/Detail'),
    meta: {
      auth: true
    }
  },
  {
    path: '/jiesuan',
    name: 'Jiesuan',
    component: lazyLoad('order/Jiesuan'),
    meta: {
      auth: true
    }
  },
  {
    path: '/business',
    name: 'Business',
    component: lazyLoad('custom/Business'),
    meta: {
      auth: true
    }
  },
  {
    path: '/brand',
    name: 'Brand',
    component: lazyLoad('goods/Brand'),
    meta: {
      auth: true
    }
  },
  {
    path: '/cusnewpassword',
    name: 'CusNewPassword',
    component: lazyLoad('custom/CusNewPassword'),
    meta: {
      auth: true
    }
  },
  {
    path: '/batchcomplete',
    name: 'BatchComplete',
    component: lazyLoad('order/BatchComplete'),
    meta: {
      auth: true
    }
  },
  {
    path: '/businessdetail',
    name: 'BusinessDetail',
    component: lazyLoad('custom/BusinessDetail'),
    meta: {
      auth: true
    }
  },
  {
    path: '/addbusiness',
    name: 'AddBusiness',
    component: lazyLoad('custom/AddBusiness'),
    meta: {
      auth: true
    }
  },
  {
    path: '/vip',
    name: 'Vip',
    component: lazyLoad('custom/Vip'),
    meta: {
      auth: true
    }
  },
  {
    path: '/xzyg',
    name: 'xzyg',
    component: lazyLoad('yggl/xzyg'),
    meta: {
      auth: true
    }
  },
  {
    path: '/fpjs',
    name: 'fpjs',
    component: lazyLoad('yggl/fpjs'),
    meta: {
      auth: true
    }
  },
  {
    path: '/yggl',
    name: 'yggl',
    component: lazyLoad('yggl/yggl'),
    meta: {
      auth: true
    }
  },
  {
    path: '/yginfo',
    name: 'yginfo',
    component: lazyLoad('yggl/yginfo'),
    meta: {
      auth: true
    }
  },
  {
    path: '/hotline',
    name: 'HotLine',
    component: lazyLoad('user/HotLine'),
    meta: {
      auth: true
    }
  },
  {
    path: '/about',
    name: 'About',
    component: lazyLoad('user/About'),
    meta: {
      auth: true
    }
  },
  {
    path: '/accountinfo',
    name: 'AccountInfo',
    component: lazyLoad('user/AccountInfo'),
    meta: {
      auth: true
    }
  },
  {
    path: '/cashdesk',
    name: 'CashDesk',
    component: CashDesk,
    meta: {
      auth: true
    }
  },
  // 账户管理
  {
    path: '/accountmanagement',
    name: 'AccountManagement',
    component: lazyLoad('account/AccountManagement'),
    meta: {
      auth: true
    }
  },
  // 记账账户
  {
    path: '/account',
    name: 'Account',
    component: lazyLoad('account/Account'),
    meta: {
      auth: true
    }
  },
  // 新增记账账户
  {
    path: '/addaccount',
    name: 'AddAccount',
    component: lazyLoad('account/AddAccount'),
    meta: {
      auth: true
    }
  },
  // 记账账户详情
  {
    path: '/accountdetails',
    name: 'AccountDetails',
    component: lazyLoad('account/AccountDetails'),
    meta: {
      auth: true
    }
  },
  // 账户提示
  {
    path: '/accounttips',
    name: 'AccountTips',
    component: lazyLoad('account/AccountTips'),
    meta: {
      auth: true
    }
  },

  {
    path: '/ticket',
    name: 'Ticket',
    component: lazyLoad('ticket/Ticket'),
    meta: {
      auth: true
    }
  },
  {
    path: '/valuecard',
    name: 'ValueCard',
    component: lazyLoad('ticket/ValueCard'),
    meta: {
      auth: true
    }
  },
  {
    path: '/valuecarddetail',
    name: 'ValueCardDetail',
    component: lazyLoad('ticket/ValueCardDetail'),
    meta: {
      auth: true
    }
  },
  {
    path: '/ticketdetail',
    name: 'TicketDetail',
    component: lazyLoad('ticket/TicketDetail'),
    meta: {
      auth: true
    }
  },
  {
    path: '/coupon',
    name: 'Coupon',
    component: lazyLoad('ticket/Coupon'),
    meta: {
      auth: true
    }
  },
  {
    path: '/coupondetail',
    name: 'CouponDetail',
    component: lazyLoad('ticket/CouponDetail'),
    meta: {
      auth: true
    }
  },
  {
    path: '/couponTempdetail',
    name: 'CouponTempDetail',
    component: lazyLoad('ticket/CouponTempDetail'),
    meta: {
      auth: true
    }
  },
  {
    path: '/couponreceive',
    name: 'CouponReceive',
    component: lazyLoad('ticket/CouponReceive'),
    meta: {
      auth: true
    }
  },
  {
    path: '/chargeactive',
    name: 'ChargeActive',
    component: lazyLoad('ticket/ChargeActive'),
    meta: {
      auth: true
    }
  },
  {
    path: '/chargeticket',
    name: 'ChargeTicket',
    component: lazyLoad('ticket/ChargeTicket'),
    meta: {
      auth: true
    }
  },
  {
    path: '/message',
    name: 'Message',
    component: lazyLoad('message/Message'),
    meta: {
      auth: true
    }
  },
  {
    path: '/messagedetail',
    name: 'MessageDetail',
    component: lazyLoad('message/MessageDetail'),
    meta: {
      auth: true
    }
  },
  {
    path: '/buysms',
    name: 'BuySms',
    component: lazyLoad('sys/BuySms'),
    meta: {
      auth: true
    }
  },
  {
    path: '/rolemanagement',
    name: 'RoleManagement',
    component: lazyLoad('sys/RoleManagement'),
    meta: {
      auth: true
    }
  },
  {
    path: '/addnewrole',
    name: 'AddNewRole',
    component: lazyLoad('sys/Addnewrole'),
    meta: {
      auth: true
    }
  },
  {
    path: '/rolemanagedetail',
    name: 'RoleManageDetail',
    component: lazyLoad('sys/RoleManageDetail'),
    meta: {
      auth: true
    }
  },
  {
    path: '/rolemanageedit',
    name: 'RoleManageEdit',
    component: lazyLoad('sys/RoleManageEdit'),
    meta: {
      auth: true
    }
  },
  {
    path: '/handover',
    name: 'Handover',
    component: lazyLoad('custom/Handover'),
    meta: {
      auth: true
    }
  },
  {
    path: '/handoverdetail',
    name: 'HandoverDetail',
    component: lazyLoad('custom/HandoverDetail'),
    meta: {
      auth: true
    }
  },
  {
    path: '/handoverhistory',
    name: 'HandoverHistory',
    component: lazyLoad('custom/HandoverHistory'),
    meta: {
      auth: true
    }
  },
  {
    path: '/balancepaymenthistory',
    name: 'BalancePaymentHistory',
    component: lazyLoad('count/BalancePaymentHistory'),
    meta: {
      auth: true
    }
  },
  {
    path: '/balancepaymentdetail',
    name: 'BalancePaymentDetail',
    component: lazyLoad('count/BalancePaymentDetail'),
    meta: {
      auth: true
    }
  },
  {
    path: '/balancepaymentcount',
    name: 'BalancePaymentCount',
    component: lazyLoad('count/BalancePaymentCount'),
    meta: {
      auth: true
    }
  },
  {
    path: '/service',
    name: 'Service',
    component: lazyLoad('order/service/service-goods-order/ServiceGoods'),
    meta: {
      auth: true
    }
  },
  {
    path: '/serviceadd',
    name: 'ServiceAdd',
    component: lazyLoad('order/service/service-goods-add/ServiceAdd'),
    meta: {
      auth: true
    }
  },
  {
    path: '/cardgoods',
    name: 'CardGoods',
    component: lazyLoad('order/service/CardGoods'),
    meta: {
      auth: true
    }
  },
  {
    path: '/address',
    name: 'Address',
    component: lazyLoad('user/Address'),
    meta: {
      auth: true
    }
  },
  {
    path: '/newcar',
    name: 'NewCar',
    component: lazyLoad('custom/newAdd/NewCar'),
    meta: {
      auth: true
    }
  },
  {
    path: '/orderdetail',
    name: 'OrderDetail',
    component: lazyLoad('order/OrderDetail'),
    meta: {
      auth: true
    }
  },
  {
    path: '/orderlist',
    name: 'OrderList',
    component: lazyLoad('order/OrderList'),
    meta: {
      auth: true
    }
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/login',
    children: [
      {
        path: '/index',
        name: 'Index',
        component: Index,
        meta: {
          auth: true
        }
      },
      {
        path: '/order',
        name: 'Order',
        // component: lazyLoad('order/Order'),
        component: Order,
        meta: {
          auth: true
        }
      },
      {
        path: '/custom',
        name: 'Custom',
        // component: lazyLoad('custom/Custom'),
        component: Custom,
        meta: {
          auth: true
        }
      },
      {
        path: '/user',
        name: 'User',
        component: lazyLoad('user/User'),
        meta: {
          auth: true
        }
      }
    ]
  },
  {
    path: '/newcustom',
    name: 'NewCustom',
    component: lazyLoad('custom/newAdd/NewCustom'),
    meta: {
      auth: true
    }
  },
  {
    path: '/record',
    name: 'Record',
    component: lazyLoad('record/Record'),
    meta: {
      auth: true
    }
  },
  {
    path: '/newcusaddcar',
    name: 'NewCusAddCar',
    component: lazyLoad('search/NewCusAddCar'),
    meta: {
      auth: true
    }
  },
  {
    path: '/newtag',
    name: 'NewTag',
    component: lazyLoad('custom/newAdd/NewTag'),
    meta: {
      auth: true
    }
  },
  {
    path: '/tagsetting',
    name: 'TagSetting',
    component: lazyLoad('custom/newAdd/TagSetting'),
    meta: {
      auth: true
    }
  },
  {
    path: '/taginfo',
    name: 'TagInfo',
    component: lazyLoad('custom/newAdd/TagInfo'),
    meta: {
      auth: true
    }
  },
  {
    path: '/chargeactivelist',
    name: 'ChargeActiveList',
    component: lazyLoad('ticket/active/ChargeActiveList'),
    meta: {
      auth: true
    }
  },
  {
    path: '/chargeactiveinfo',
    name: 'ChargeActiveInfo',
    component: lazyLoad('ticket/active/ChargeActiveInfo'),
    meta: {
      auth: true
    }
  },
  {
    path: '/newchargeactive',
    name: 'NewChargeActive',
    component: lazyLoad('ticket/active/NewChargeActive'),
    meta: {
      auth: true
    }
  },
  {
    path: '/addnewcard',
    name: 'AddNewCard',
    component: lazyLoad('ticket/add-new-card/AddNewCard'),
    meta: {
      auth: true
    }
  },
  {
    path: '/servicegoods',
    name: 'ServiceGoods',
    component: lazyLoad('ticket/add-new-card/service-goods-card/ServiceGoods'),
    meta: {
      auth: true
    }
  },
  {
    path: '/cardlist',
    name: 'CardList',
    component: lazyLoad('ticket/active/CardList'),
    meta: {
      auth: true
    }
  },
  {
    path: '/carddetail',
    name: 'CardDetail',
    component: lazyLoad('ticket/active/CardDetail'),
    meta: {
      auth: true
    }
  },
  {
    path: '/ordersearch',
    name: 'OrderSearch',
    component: OrderSearch,
    meta: {
      auth: true
    }
  },
  {
    path: '/jzts',
    name: 'jzts',
    component: lazyLoad('jzts/jzts'),
    meta: {
      auth: true
    }
  },
  {
    path: '/jztsrecord',
    name: 'jztsrecord',
    component: lazyLoad('jzts/jzts-record'),
    meta: {
      auth: true
    }
  },
  {
    path: '/help',
    name: 'help',
    component: lazyLoad('user/help'),
    meta: {
      auth: true
    }
  },
  {
    path: '/store',
    name: 'store',
    component: lazyLoad('user/store'),
    meta: {
      auth: true
    }
  },
  {
    path: '/wxmp',
    name: 'Wxmp',
    component: lazyLoad('wx-mini-app/Wxmp'),
    meta: {
      auth: true
    }
  },
  {
    path: '/company',
    name: 'company',
    component: lazyLoad('user/company'),
    meta: {
      auth: true
    }
  },
  {
    path: '/wxcode',
    name: 'Wxcode',
    component: lazyLoad('wx-mini-app/Wxcode'),
    meta: {
      auth: true
    }
  },
  {
    path: '/addcoupontemp',
    name: 'AddCouponTemp',
    component: lazyLoad('ticket/AddCouponTemp'),
    meta: {
      auth: true
    }
  },
  {
    path: '/companyinfo',
    name: 'companyinfo',
    component: lazyLoad('user/companyinfo'),
    meta: {
      auth: true
    }
  },
  {
    path: '/companyorderlist',
    name: 'companyorderlist',
    component: lazyLoad('user/companyorderlist'),
    meta: {
      auth: true
    }
  },
  {
    path: '/companyorderinfo',
    name: 'companyorderinfo',
    component: lazyLoad('user/companyorderinfo'),
    meta: {
      auth: true
    }
  },
  {
    path: '/experiencelogin',
    name: 'ExperienceLogin',
    component: lazyLoad('auth/ExperienceLogin')
  },
  {
    path: '/experiencecode',
    name: 'ExperienceCode',
    component: lazyLoad('auth/ExperienceCode')
  },
  {
    path: '/experiencepassword',
    name: 'ExperiencePassword',
    component: lazyLoad('auth/ExperiencePassword')
  },
  {
    path: '/onestepsignup',
    name: 'OneStepSignup',
    component: lazyLoad('auth/OneStepSignup')
  },
  {
    path: '/setting',
    name: 'setting',
    component: lazyLoad('user/setting'),
    meta: {
      auth: true
    }
  },
  {
    path: '/*',
    name: 'Login',
    component: Login
  }
]

/**
 * 登录拦截
 */
const router = new Router({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  },
  routes
})

Router.prototype.back = function() {
  this.isBack = true
  router.go(-1)
}
let token = window.sessionStorage.getItem('__token__')
router.beforeEach((to, from, next) => {
  token = window.sessionStorage.getItem('__token__')
  // 判断是否有页面的访问权限
  function has(el) {
    return el.code === to.name
  }
  if (store.state.sys.unAuthMenu.some(has)) {
    Toast.fail('权限不足')
    return
  }
  if (to.meta.auth) {
    if (token && token !== 'undefined') {
      next({
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } else {
    next()
  }
})

export default router
