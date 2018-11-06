import fetch from './fetch'
import Cookies from 'js-cookie'

function urlFilter(name) {
  var menuList = Cookies.getJSON('menuList')
  // 刷新 先判断是否有本地权限 再次store 和 router 都还没实例化
  if (!(menuList && menuList !== 'undefined' && menuList.length > 0)) {
    return '/login'
  }
  let currUrl = menuList.filter(v => {
    if (v.name === name) {
      return v.url
    }
  })[0]
  if (currUrl && currUrl.url) {
    currUrl = currUrl.url
  }
  return currUrl || ''
}
/**
 * 登录
 * @param {String} code
 * @param {String} username
 * @param {String} password
 */
const LOGIN = params => {
  return fetch({
    url: 'login/submit',
    method: 'post',
    data: params
  })
}

/**
 * 体验登录
 * @param {String} code
 * @param {String} username
 * @param {String} password
 */
const LOGIN_EXP = params => {
  return fetch({
    url: 'login/experience/submit',
    method: 'post',
    data: params
  })
}

/**
 * 登出
 */
const LOGOUT = params => {
  return fetch({
    url: 'login/out',
    method: 'post',
    data: params
  })
}
/**
 * 登出index
 */
const LOGOUT_INDEX = params => {
  return fetch({
    url: 'index/logout',
    method: 'post',
    data: params
  })
}
/**
 * 服务分类
 */
const SERVICE_CATEGORY = params => {
  return fetch({
    url: urlFilter('serverCategoryList'),
    method: 'post',
    data: params
  })
}

/**
 * 服务分类（顶级）列表  key：serverCategoryListTop
 */
const SERVICE_CATEGORY_TOP = params => {
  return fetch({
    url: 'gas/si/server/category/list/top',
    method: 'post',
    data: params
  })
}

/**
 * 服务列表
 */
const SERVICE_LIST = params => {
  return fetch({
    url: urlFilter('serverList'),
    method: 'post',
    data: params
  })
}

/**
 * 服务规格
 */
const SERVICE_SKU_LIST = params => {
  return fetch({
    // url: urlFilter('serverSkuList'),
    url: 'gas/si/server/sku/list',
    method: 'post',
    data: {
      pageSize: 100,
      statusStore: '1',
      ...params
    }
  })
}

/**
 * 新增和修改服务
 */
const ADD_NEW_SERVICE = params => {
  return fetch({
    // url: urlFilter('serverSkuList'),
    url: 'gas/si/server/add',
    method: 'post',
    data: params
  })
}

/**
 * 商品规格
 */
const GOODS_SKU_LIST = params => {
  return fetch({
    // url: urlFilter('serverSkuList'),
    url: 'gas/gi/goods/sku/list',
    method: 'post',
    data: {
      pageSize: 100,
      statusStore: '1',
      ...params
    }
  })
}

/**
 * 商品分类
 */
const GOODS_CATEGORY = params => {
  return fetch({
    url: urlFilter('goodsCategoryList'),
    method: 'post',
    data: params
  })
}

/**
 * 商品分类（顶级）列表 key：goodsCategoryListTop
 */
const GOODS_CATEGORY_TOP = params => {
  return fetch({
    url: 'gas/gi/goods/category/list/top',
    method: 'post',
    data: params
  })
}

/**
 * 商品列表
 */
const GOODS_LIST = params => {
  return fetch({
    url: urlFilter('goodsList'),
    method: 'post',
    data: params
  })
}
/**
 * 商品品牌 goodsBrandList
 */
const GOODS_BRAND_LIST = params => {
  return fetch({
    url: 'gas/gi/goods/brand/list',
    method: 'post',
    data: params
  })
}

/**
 * 新增商品 goodsAdd TODO: 新增服务
 */
const ADD_NEW_GOODS = params => {
  return fetch({
    url: 'gas/gi/goods/add',
    method: 'post',
    data: params
  })
}
/* 会员车辆数据模糊查询接口 */
const CUSTOM_LIST = params => {
  return fetch({
    url: 'crm/mi/membermotor/page',
    method: 'post',
    data: params
  })
}

/* 查询商品单位 storeMessageList */
const GOODS_UNIT = params => {
  return fetch({
    url: 'sys/dict/list/code',
    method: 'post',
    data: {
      code: 'gas_gi_goods_unit'
    }
  })
}

/* 移动端获取消息分页接口 storeMessageList */
const MSG_LIST = params => {
  return fetch({
    url: 'msg/st/sys/message/list',
    method: 'post',
    data: params
  })
}

/* 获取会员详情接口 storeMemberFind */
const CUSTOM_DETAIL = params => {
  return fetch({
    url: 'crm/mi/member/find',
    method: 'post',
    data: params
  })
}

/* 获取会员详情接口一对多人车详情 key：membermotorsInfo */
const CUSTOM_DETAIL_BY_CUSID = params => {
  return fetch({
    url: 'crm/mi/membermotors/info/by/member',
    method: 'post',
    data: params
  })
}

/* 删除会员 memberDel */
const CUSTOM_DEL = params => {
  return fetch({
    url: '/crm/mi/member/del',
    method: 'post',
    data: params
  })
}
/* 获取商机分页接口 orderChanceList */
const BUSINESS_LIST = params => {
  return fetch({
    url: 'bus/oi/order/chance/list',
    method: 'post',
    data: params
  })
}

/* 获取会员卡分页接口 memberCardList */
const TICKET_LIST = params => {
  return fetch({
    url: 'crm/mc/member/card/list',
    method: 'post',
    data: params
  })
}

/* 人车信息（通配）membermotorPage */
const SEARCH_LIST = params => {
  return fetch({
    url: 'crm/mi/membermotor/page',
    method: 'post',
    data: params
  })
}

/*  充值卡（进入表单数据）formAccount  获取储蓄卡充值表单页所需数据（储值卡充值规则、当前店铺员工列表） */
const ACCOUNT_CARD_LIST = params => {
  return fetch({
    url: 'crm/mc/member/card/form/account',
    method: 'post',
    data: params
  })
}

/*  办卡（进入表单数据） formAccount  获取折扣卡、次卡办卡表单页所需数据（折扣卡、次卡充值规则、当前店铺员工列表）  */
const DISACCOUNT_CARD_LIST = params => {
  return fetch({
    url: 'crm/mc/member/card/form/discount/package',
    method: 'post',
    data: params
  })
}
/* 充值（提交表单） */
const ACCOUNT_CARD_SAVE = params => {
  return fetch({
    url: 'crm/mc/member/card/save/account',
    method: 'post',
    data: params
  })
}

/* 办卡（提交表单） */
const DISACCOUNT_CARD_SAVE = params => {
  return fetch({
    url: 'crm/mc/member/card/save/discount/package',
    method: 'post',
    data: params
  })
}

/* 会员卡详情  memberCardInfo */
const DISACCOUNT_CARD_DETAIL = params => {
  return fetch({
    url: 'crm/mc/member/card/info',
    method: 'post',
    data: params
  })
}

/* 会员卡消费记录列表  memberCardRecordList */
const DISACCOUNT_CARD_RECORD = params => {
  return fetch({
    url: 'crm/mc/member/card/record/list',
    method: 'post',
    data: {
      changeType: 'D',
      ...params
    } // 变动类型。A：增加，D：减少
  })
}

/* 优惠券模板列表  listStoreCouponTemp */
const LIST_STORE_COUPON_TEMP = params => {
  return fetch({
    url: 'ssp/ci/store/coupon/temp/list',
    method: 'post',
    data: {
      operateSrc: 1,
      ...params
    }
  })
}

/* 优惠券模板详情 */
const COUPON_TEMP_DETAIL = params => {
  return fetch({
    url: 'ssp/ci/store/coupon/temp/info',
    method: 'post',
    data: params
  })
}

/* 店铺优惠券列表  listStoreCouponMember */
const LIST_STORE_COUPON_MEMBER = params => {
  return fetch({
    url: 'ssp/ci/store/coupon/member/list',
    method: 'post',
    data: {
      operateSrc: 1,
      ...params
    }
  })
}

/* 优惠券详情  infoStoreCouponMember */
const COUPON_DETAIL = params => {
  return fetch({
    url: 'ssp/ci/store/coupon/member/info',
    method: 'post',
    data: params
  })
}

/* 人车信息（查车辆）  pageByMotor */
const FIND_CAR = params => {
  return fetch({
    url: 'crm/mi/membermotor/page/by/motor',
    method: 'post',
    data: params
  })
}

/* 人车信息（查会员）  pageByMember */
const FIND_CUSTOM = params => {
  return fetch({
    url: 'crm/mi/membermotor/page/by/member',
    method: 'post',
    data: params
  })
}

/* 会员标签列表  storeMemberList */
const CUSTOM_TAG_LIST = params => {
  return fetch({
    url: 'crm/mi/member/tag/list',
    method: 'post',
    data: params
  })
}

/* 服务详情  serverInfo */
const SERVICE_DETAIL = params => {
  return fetch({
    url: 'gas/si/server/info',
    method: 'post',
    data: params
  })
}

/* 商品详情  goodsInfo */
const GOODS_DETAIL = params => {
  return fetch({
    url: 'gas/gi/goods/info',
    method: 'post',
    data: params
  })
}

/* 店铺优惠券分类统计  couponAllByMember */
const COUPON_COUNT = params => {
  return fetch({
    url: 'ssp/ci/store/coupon/member/count/usable/type',
    method: 'post',
    data: params
  })
}

/* 阅读消息 key：readStoreMessage */
const READ_MSG = params => {
  return fetch({
    url: 'msg/st/sys/message/read',
    method: 'post',
    data: params
  })
}

/* 会员优惠券 key：couponAllByMember */
const CUSTOM_OWN_COUPON = params => {
  return fetch({
    url: 'ssp/ci/store/coupon/member/list/all',
    method: 'post',
    data: params
  })
}

/* 会员卡分类统计 key：memberCardAllByMember */
const COUNT_VIP_CARD = params => {
  return fetch({
    url: 'crm/mc/member/card/count/usable/type',
    method: 'post',
    data: params
  })
}

/* 储值账户详情 key：memberCardAccountInfo */
const ACCOUNT_DETAIL = params => {
  return fetch({
    url: 'crm/mc/member/card/info/member/account',
    method: 'post',
    data: params
  })
}

/* 店铺员工列表 key：serverList */
const EMPLOYEE_LIST = params => {
  return fetch({
    url: 'sts/si/employee/list/store',
    method: 'post',
    data: params
  })
}

/* 订单列表 key：orderChanceList */
const ORDER_LIST = params => {
  return fetch({
    url: 'bus/oi/order/list',
    method: 'post',
    data: params
  })
}

/* 订单详情 key：orderInfo */
const ORDER_DETAIL = params => {
  return fetch({
    url: 'bus/oi/order/info',
    method: 'post',
    data: params
  })
}

/* 接车单新增、保存 key：orderInfo */
const ORDER_RECEPTION = params => {
  return fetch({
    url: 'bus/oi/reception/order/save',
    method: 'post',
    data: params
  })
}

/* 订单新增、修改 key：orderAdd */
const ORDER_MAIN = params => {
  return fetch({
    url: 'bus/oi/order/save',
    method: 'post',
    data: params
  })
}

/* 开单模板列表 key：orderTempList */
const ORDER_TEMP = params => {
  return fetch({
    url: 'bus/oi/order/temp/list',
    method: 'post',
    data: params
  })
}

/* 更新开单模板排序 key：orderAdd */
const ORDER_TEMP_SORT = params => {
  return fetch({
    url: 'bus/oi/order/temp/update/sort/no',
    method: 'post',
    data: params
  })
}

/* 开单模板详情 key：orderTempInfo */
const ORDER_TEMP_DETAIL = params => {
  return fetch({
    url: 'bus/oi/order/temp/info',
    method: 'post',
    data: params
  })
}

/* 订单完工 key：orderFinish */
const ORDER_FINISH = params => {
  return fetch({
    url: 'bus/oi/order/finish',
    method: 'post',
    data: params
  })
}

/* 订单结算表单 key：saveCollectOrder */
const PAYMENT_FORM = params => {
  return fetch({
    url: 'fm/cr/cashier/collect/order/form',
    method: 'post',
    data: params
  })
}

/* 订单结算保存 key：saveCollectOrder */
const PAYMENT_SAVE = params => {
  return fetch({
    url: 'fm/cr/cashier/collect/order/save',
    method: 'post',
    data: params
  })
}

/* 商机详情 key：orderInfo */
const BUSINESS_DETAIL = params => {
  return fetch({
    url: 'bus/oi/order/chance/info',
    method: 'post',
    data: params
  })
}

/* 商机读取 key：orderChanceRead */
const BUSINESS_READ = params => {
  return fetch({
    url: 'bus/oi/order/chance/read',
    method: 'post',
    data: params
  })
}

/* 直接收银 key：saveCollectMoney */
const CASHIER_COLLECT_MONEY = params => {
  return fetch({
    url: 'fm/cr/cashier/collect/money/save',
    method: 'post',
    data: params
  })
}

/* 订单保存并划卡 key：orderSaveAndCharge */
const TAKE_CARD = params => {
  return fetch({
    url: 'bus/oi/order/save/charge/member/card',
    method: 'post',
    data: params
  })
}

/* 接车单详情 key：receptionOrderInfo */
const JIECHE_DETAIL = params => {
  return fetch({
    url: 'bus/oi/reception/order/info',
    method: 'post',
    data: params
  })
}

/* 商机新增、保存 key：orderChanceAdd */
const ADD_BUSINESS = params => {
  return fetch({
    url: 'bus/oi/order/chance/save',
    method: 'post',
    data: params
  })
}

/* 车辆删除 key：motorDel */
const CAR_DETAIL = params => {
  return fetch({
    url: 'bus/mt/motor/del',
    method: 'post',
    data: params
  })
}

/* 车辆解除绑定 key：motorBindRemove */
const CAR_UNBIND = params => {
  return fetch({
    url: 'bus/mt/motor/bind/remove',
    method: 'post',
    data: params
  })
}

/* 账户流水列表 key：financeRecordList */
const FINANCE_RECORD_LIST = params => {
  return fetch({
    url: 'fm/fa/finance/record/list',
    method: 'post',
    data: params
  })
}

/* 账户流水详情 key：financeRecordList */
const FINANCE_RECORD_DETAIL = params => {
  return fetch({
    url: 'fm/fa/finance/record/info',
    method: 'post',
    data: params
  })
}

/* 账户流水统计 key：financeRecordSum */
const FINANCE_RECORD_COUNT = params => {
  return fetch({
    url: 'fm/fa/finance/record/sum/account/type',
    method: 'post',
    data: params
  })
}

/* 当前登录员工详情 key：serverList */
const CURRENT_USER = params => {
  return fetch({
    url: 'sts/si/employee/current',
    method: 'post',
    data: params
  })
}

/* 一对多人车详情（通过车辆ID） key：membermotorsInfo */
const CUSTOM_DETAIL_BY_CARID = params => {
  return fetch({
    url: 'crm/mi/membermotors/info/by/motor',
    method: 'post',
    data: params
  })
}

/* 交班表单 key：dutyExchangeForm */
const EXCHANGE_FORM = params => {
  return fetch({
    url: 'fm/de/duty/exchange/form',
    method: 'post',
    data: params
  })
}

/* 交班保存 key：dutyExchangeForm */
const EXCHANGE_SAVE = params => {
  return fetch({
    url: 'fm/de/duty/exchange/save',
    method: 'post',
    data: params
  })
}

/* 交班详情 key：dutyExchangeForm */
const EXCHANGE_DETAIL = params => {
  return fetch({
    url: 'fm/de/duty/exchange/info',
    method: 'post',
    data: params
  })
}

/* 交班记录列表 key：dutyExchangeList */
const EXCHANGE_LIST = params => {
  return fetch({
    url: 'fm/de/duty/exchange/list',
    method: 'post',
    data: params
  })
}

/* 企业短信余量 key：dutyExchangeList */
const SMS_USABLE_NUM = params => {
  return fetch({
    url: 'sts/ci/company/sms/num/usable',
    method: 'post',
    data: params
  })
}

/* 企业短信余量 key：dutyExchangeList */
const SYS_ORDER_SMS = params => {
  return fetch({
    url: 'index/sys/product/sales/order/sms',
    method: 'post',
    data: params
  })
}

/* 会员卡延期 key：memberCardDelay */
const CARD_DELAY = params => {
  return fetch({
    url: 'crm/mc/member/card/delay',
    method: 'post',
    data: params
  })
}

/* 重置员工密码 key：memberCardDelay */
const PASSWORD_RESET = params => {
  return fetch({
    url: 'sts/si/employee/reset/pwd/save',
    method: 'post',
    data: params
  })
}

/* 找回密码 key：memberCardDelay */
const PASSWORD_FORGET = params => {
  return fetch({
    url: 'forget/password/save',
    method: 'post',
    data: params
  })
}

/* 获取验证码 key：memberCardDelay */
const CAPTCHA_SYSTEM = params => {
  return fetch({
    url: 'sms/captcha/send/system',
    method: 'post',
    data: params
  })
}

/* 用户反馈新增 key：storeSuggestAdd */
const FEEDBACK = params => {
  return fetch({
    url: 'msg/ss/store/suggest/save',
    method: 'post',
    data: params
  })
}

/* 财务科目列表 key：financeSubjectList */
const SUBJECT = params => {
  return fetch({
    url: 'fm/fs/finance/subject/list',
    method: 'post',
    data: params
  })
}

/* 服务删除 key：serverDel */
const SERVER_DEL = params => {
  return fetch({
    url: 'gas/si/server/del',
    method: 'post',
    data: params
  })
}

/* 商品删除 key：goodsDel */
const GOODS_DEL = params => {
  return fetch({
    url: 'gas/gi/goods/del',
    method: 'post',
    data: params
  })
}

/* 直接划卡 key：orderCharge */
const TAKE_CARD_ORDER = params => {
  return fetch({
    url: 'bus/oi/order/charge/member/card',
    method: 'post',
    data: params
  })
}

/* 客户新密码保存 key：memberPayPasswordSave */
const MEMBER_PAY_PASSWORD_SAVE = params => {
  return fetch({
    url: 'crm/mi/member/pay/password/save',
    method: 'post',
    data: params
  })
}

/* 当前角色移动端菜单 key：appMenuList */
const ROLE_MENU = params => {
  return fetch({
    url: 'sts/si/st/role/list/app/menu',
    method: 'post',
    data: params
  })
}

/* 车辆新增接口 key：motorSave */
const ADD_NEW_CAR = params => {
  return fetch({
    url: 'bus/mt/motor/save',
    method: 'post',
    data: params
  })
}

/* 车辆详情接口 key：motorDetail */
const MOTOR_DETAIL = params => {
  return fetch({
    url: 'bus/mt/motor/find',
    method: 'post',
    data: params
  })
}
/* 客户新增接口 key：memberSave */
const ADD_NEW_CUSTOM = params => {
  return fetch({
    url: 'crm/mi/member/save',
    method: 'post',
    data: params
  })
}

/* 客户标签新增接口 key：memberSave */
const ADD_NEW_TAG = params => {
  return fetch({
    url: 'crm/mi/member/tag/save',
    method: 'post',
    data: params
  })
}

/* 客户标签删除接口 key：memberSave */
const DEL_TAG = params => {
  return fetch({
    url: 'crm/mi/member/tag/del',
    method: 'post',
    data: params
  })
}

/* 会员卡活动保存（储值卡） key：saveAccount */
const ADD_ACCOUNT_ACTIVE = params => {
  return fetch({
    url: 'crm/mc/member/card/transact/save/account',
    method: 'post',
    data: params
  })
}
/* 服务上架下架接口 key：serverUpDown */
const SERVER_UP_DOWN = params => {
  return fetch({
    url: 'gas/si/server/updown',
    method: 'post',
    data: params
  })
}

/* 会员卡活动保存（折扣卡） key：saveAccount */
const ADD_DISCOUNT_ACTIVE = params => {
  return fetch({
    url: 'crm/mc/member/card/transact/save/discount',
    method: 'post',
    data: params
  })
}
/* 商品上架下架接口 key：goodsUpDown */
const GOODS_UP_DOWN = params => {
  return fetch({
    url: 'gas/gi/goods/updown',
    method: 'post',
    data: params
  })
}

/* 会员卡活动保存（次卡） key：saveAccount */
const ADD_PACKAGE_ACTIVE = params => {
  return fetch({
    url: 'crm/mc/member/card/transact/save/package',
    method: 'post',
    data: params
  })
}
/* 商品规格删除接口 key：goodsSkuDel */
const GOODS_SKU_DEL = params => {
  return fetch({
    url: 'gas/gi/goods/sku/del',
    method: 'post',
    data: params
  })
}

/* 会员卡活动启用停用 key：savePackage */
const CHARGE_ACTIVE_SWITCH = params => {
  return fetch({
    url: 'crm/mc/member/card/transact/update/is/active',
    method: 'post',
    data: params
  })
}
/* 服务规格删除接口 key：serverSkuDel */
const SERVER_SKU_DEL = params => {
  return fetch({
    url: 'gas/si/server/sku/del',
    method: 'post',
    data: params
  })
}

/* 会员卡活动列表（分页） key：MemberCardTransactApi */
const CHARGE_ACTIVE_LIST = params => {
  return fetch({
    url: 'crm/mc/member/card/transact/list',
    method: 'post',
    data: params
  })
}

/* 会员卡活动删除 key：MemberCardTransactApi */
const DEL_ACTIVE = params => {
  return fetch({
    url: 'crm/mc/member/card/transact/del',
    method: 'post',
    data: params
  })
}

/* 获取服务（含服务SKU）分页接口 key：serverList */
const SERVICE_AND_SKU = params => {
  return fetch({
    url: 'gas/si/server/list/with/skus',
    method: 'post',
    data: {
      operateSrc: 1,
      ...params
    }
  })
}

/* 获取商品（含商品SKU）分页接口 key：goodsWithSkusList */
const GOODS_AND_SKU = params => {
  return fetch({
    url: 'gas/gi/goods/list/with/skus',
    method: 'post',
    data: {
      operateSrc: 1,
      ...params
    }
  })
}

/* 会员卡活动保存（折扣卡） key：saveDiscount */
const SAVE_DISCOUNT_CARD = params => {
  return fetch({
    url: 'crm/mc/member/card/transact/save/discount',
    method: 'post',
    data: {
      ...params
    }
  })
}

/* 会员卡活动保存（次卡） key：savePackage */
const SAVE_TIMES_CARD = params => {
  return fetch({
    url: 'crm/mc/member/card/transact/save/package',
    method: 'post',
    data: {
      ...params
    }
  })
}

/* 会员卡活动详情  key：MemberCardTransactApi */
const CHARGE_ACTIVE_DETAIL = params => {
  return fetch({
    url: 'crm/mc/member/card/transact/info',
    method: 'post',
    data: params
  })
}

/* 订单批量关闭  key：orderClose */
const ORDER_CLOSE = params => {
  return fetch({
    url: 'bus/oi/order/close/batch',
    method: 'post',
    data: params
  })
}

/* 收支流水  key：financeRecordSum */
const FINANCE_RECORD_SUM = params => {
  return fetch({
    url: 'fm/fa/finance/record/group/sum',
    method: 'post',
    data: params
  })
}
/* 快速开单保存  key：saveQuickOrder */
const QUICK_ORDER = params => {
  return fetch({
    url: 'bus/oi/order/quick/save',
    method: 'post',
    data: params
  })
}

/* 客户车辆新增并绑定  key：saveQuickOrder */
const MEMBER_MOTOR = params => {
  return fetch({
    url: 'crm/mi/member/save/with/motor',
    method: 'post',
    data: params
  })
}

/* 更新各业务的备注、附件  key：saveQuickOrder */
const SYS_TABLE_REMARK = params => {
  return fetch({
    url: 'sys/table/operate/save',
    method: 'post',
    data: params
  })
}

/* 修改订单备注、对应车辆当前里程、手工单号  key：updateInfo */
const UPDATE_ORDER_INFO = params => {
  return fetch({
    url: 'bus/oi/order/update/info',
    method: 'post',
    data: params
  })
}

/* 获取可用的店铺账户集合、客户储值账户  key：financeAccountListEnable */
const ACCOUNT_CUS_STORE = params => {
  return fetch({
    url: 'fm/cr/cashier/list/accounts/and/card',
    method: 'post',
    data: params
  })
}

/* 系统产品列表  key：SysProductApi */
const SYS_PRODUCT = params => {
  return fetch({
    url: 'index/sys/product/list',
    method: 'post',
    data: params
  })
}

/* 验证兑换码接口  key：SysProductApi */
const CHECK_COUPON_SYS = params => {
  return fetch({
    url: 'index/sys/product/check/coupon',
    method: 'post',
    data: params
  })
}

/* 移动端注册接口  */
const REGISTER = params => {
  return fetch({
    url: 'register/login/experience/submit',
    method: 'post',
    data: params
  })
}

/* 移动端官网登录接口  */
const INDEX_LOGIN = params => {
  return fetch({
    url: 'index/login',
    method: 'post',
    data: params
  })
}

/* 创建系统产品购买订单  */
const INDEX_ORDER = params => {
  return fetch({
    url: 'index/sys/product/sales/order',
    method: 'post',
    data: params
  })
}

/* 获取财务科目列表接口  */
const SUBJECT_LIST = params => {
  return fetch({
    url: 'fm/fs/finance/subject/list/parent',
    method: 'post',
    data: params
  })
}

/* 记一笔接口  */
const FINANCE_SAVE = params => {
  return fetch({
    url: 'fm/fa/finance/make/save',
    method: 'post',
    data: params
  })
}

/* 获取店铺自动推送模板列表接口  */
const JZTS = params => {
  return fetch({
    url: 'msg/sms/store/list/auto',
    method: 'post',
    data: params
  })
}

/* 变更模板的店铺推送开关状态接口  */
const JZTS_ONOFF = params => {
  return fetch({
    url: 'msg/sms/store/change/push',
    method: 'post',
    data: params
  })
}

/* 获取店铺短信推送记录分页接口  */
const JZTS_RECORD = params => {
  return fetch({
    url: 'msg/sms/sms/record/list',
    method: 'post',
    data: params
  })
}

/* 获取店铺短信推送记录分页接口  */
const JZTS_CATEGORY = params => {
  return fetch({
    url: 'msg/sms/store/template/category/list',
    method: 'post',
    data: params
  })
}

/* 获取短信成功失败数量汇总接口 key：SmsRecordApi */
const JZTS_COUNT = params => {
  return fetch({
    url: 'msg/sms/sms/record/list/count',
    method: 'post',
    data: params
  })
}

/* 短信重发 key：SmsRecordApi */
const JZTS_SMSRESEND = params => {
  return fetch({
    url: 'msg/sms/store/reset/send',
    method: 'post',
    data: params
  })
}

/* 短信重发 key：StoreApi */
const STORE_SAVE = params => {
  return fetch({
    url: 'sts/si/store/save',
    method: 'post',
    data: params
  })
}

/* 订单编号查企业接口 key：CompanyApi */
const COMPANY_INFO_BY_PRODUCTION_ORDERNO = params => {
  return fetch({
    url: 'index/company/get/by/order',
    method: 'post',
    data: params
  })
}

/* 查询企业详情接口 key：CompanyApi */
const COMPANY_INFO = params => {
  return fetch({
    url: 'sts/ci/company/info',
    method: 'post',
    data: params
  })
}

/* 查询企业详情接口 key：CompanyApi */
const STORE_INFO = params => {
  return fetch({
    url: 'sts/si/store/info',
    method: 'post',
    data: params
  })
}

/* 更新企业信息接口 key：CompanyApi */
const COMPANY_SAVE = params => {
  return fetch({
    url: 'sts/ci/company/save',
    method: 'post',
    data: params
  })
}

/* 更新企业信息接口 key：CompanyApi */
const COMPANY_ORDER_LIST = params => {
  return fetch({
    url: 'sal/so/salesOrder/list',
    method: 'post',
    data: params
  })
}

/* 获取企业消费记录详情 key：SalesOrderApi */
const COMPANY_ORDER_INFO = params => {
  return fetch({
    url: 'sal/so/salesOrder/info',
    method: 'post',
    data: params
  })
}

/* 购买订单支付结果查询 key：salesOrderInspect */
const COMPANY_ORDER_CHECK = params => {
  return fetch({
    url: 'index/sys/product/sales/order/inspect',
    method: 'post',
    data: params
  })
}

/* 移动端验证手机号是否已注册、是否可体验 */
const MOBILE_CHECK = params => {
  return fetch({
    url: 'index/register/mobile/validate',
    method: 'post',
    data: params
  })
}

/* 官网注册并登陆  */
// const INDEX_SIGN = params => {
//   return fetch({
//     url: 'index/register/and/login',
//     method: 'post',
//     data: params
//   })
// }

/* 车边短信包产品列表  */
const SMS_LIST = params => {
  return fetch({
    url: 'index/sys/product/sms/list',
    method: 'post',
    data: params
  })
}

/* 获取客服二维码及说明接口  */
const QRCODE_SERVICE = params => {
  return fetch({
    url: 'sys/config/qr/customer/service',
    method: 'post',
    data: params
  })
}

/* 系统活动  */
const SYS_ACTIVE = params => {
  return fetch({
    url: 'index/mkt/cb/marketing/activity/get/by/type',
    method: 'post',
    data: params
  })
}

/* 更新开单模板排序（所有  key：OrderTempApi */
const ORDER_TEMP_SORT_ALL = params => {
  return fetch({
    url: 'bus/oi/order/temp/update/sort/no/all',
    method: 'post',
    data: params
  })
}

/* 新增或修改开单模板  key：orderAdd */
const ORDER_TEMP_SAVE = params => {
  return fetch({
    url: 'bus/oi/order/temp/save',
    method: 'post',
    data: params
  })
}

/* 开单模板删除  key：OrderTempApi */
const ORDER_TEMP_DEL = params => {
  return fetch({
    url: 'bus/oi/order/temp/del',
    method: 'post',
    data: params
  })
}

/* 权限列表接口  */
const ROLE_LIST = params => {
  return fetch({
    // url: 'sts/si/employee/store/role/list',
    url: 'sts/si/st/role/list/all',
    method: 'post',
    data: params
  })
}
/* 新增或编辑员工  key：EmployeeApi */
const NEW_EMPLOYEE_SAVE = params => {
  return fetch({
    url: 'sts/si/employee/save',
    method: 'post',
    data: params
  })
}

/* 角色详情接口 */
const ROLE_DETAIL = params => {
  return fetch({
    url: 'sts/si/st/role/info',
    method: 'post',
    data: params
  })
}

/* 删除角色 */

const ROLE_DELETE = params => {
  return fetch({
    url: 'sts/si/st/role/del',
    method: 'post',
    data: params
  })
}

/* 角色保存，如果有id则为更新，没有则为新增 */

const ROLE_SAVE = params => {
  return fetch({
    url: 'sts/si/st/role/save/for/mobile',
    method: 'post',
    data: params
  })
}

/* 企业员工列表  key：serverList */
const STS_EMPLOYEE_LIST = params => {
  return fetch({
    url: 'sts/si/employee/list',
    method: 'post',
    data: params
  })
}

/* 员工详情  key：EmployeeApi */
const EMPLOYEE_INFO = params => {
  return fetch({
    url: 'sts/si/employee/info',
    method: 'post',
    data: params
  })
}

/* 员工在职离职  key：EmployeeApi */
const EMPLOYEE_JOB = params => {
  return fetch({
    url: 'sts/si/employee/job',
    method: 'post',
    data: params
  })
}

/* 员工启用停用  key：EmployeeApi */
const EMPLOYEE_ACTIVE = params => {
  return fetch({
    url: 'sts/si/employee/active',
    method: 'post',
    data: params
  })
}

/* 删除员工  key：EmployeeApi */
const EMPLOYEE_DEL = params => {
  return fetch({
    url: 'sts/si/employee/del',
    method: 'post',
    data: params
  })
}

/* 当前角色可分配的移动端权限列表  key：EmployeeApi */
const APP_MENU = params => {
  return fetch({
    url: 'sts/si/st/role/list/app/menu',
    method: 'post',
    data: params
  })
}

/* 店铺角色集合  key：EmployeeApi */
const STORE_ROLE_LIST = params => {
  return fetch({
    url: 'sts/si/st/role/list/all',
    method: 'post',
    data: params
  })
}

/* 店铺角色集合  key：EmployeeApi */
const ORDER_DEL = params => {
  return fetch({
    url: 'bus/oi/order/del',
    method: 'post',
    data: params
  })
}

/* 店铺角色集合  key：EmployeeApi */
const BRAND_SAVE = params => {
  return fetch({
    url: 'gas/gi/goods/brand/save',
    method: 'post',
    data: params
  })
}

/* 店铺信息，经营类目  key：storeMessageList */
const BRAND_JINGYING = params => {
  return fetch({
    url: 'sys/dict/list/code',
    method: 'post',
    data: params
  })
}

/* 店铺优惠券模板更新发行量  key：StoreCouponTempApi */
const UPDATE_COUPON_PUB_NUN = params => {
  return fetch({
    url: 'ssp/ci/store/coupon/temp/update/num/publish',
    method: 'post',
    data: params
  })
}

/* 店铺优惠券模板更新上下架状态  key：StoreCouponTempApi */
const UPDATE_COUPON_STATUS = params => {
  return fetch({
    url: 'ssp/ci/store/coupon/temp/isstop',
    method: 'post',
    data: params
  })
}

/* 优惠券模板新增接口 优惠券模板不可以修改，只可以停启用、增加发行量 key：StoreCouponTempApi */
const ADD_NEW_COUPON_TEMP = params => {
  return fetch({
    url: 'ssp/ci/store/coupon/temp/save',
    method: 'post',
    data: params
  })
}

/* 获取车辆品牌、厂商、车系、车型分页接口 key：motorList */
const MOTOR_TYPE = params => {
  return fetch({
    url: 'bus/mt/motor/category/select',
    method: 'post',
    data: params
  })
}

/* 品牌、厂商、车系、车型详情接口 key：motorList */
const MOTOR_TYPE_RESULT = params => {
  return fetch({
    url: 'bus/mt/motor/category/info',
    method: 'post',
    data: params
  })
}

/* 快捷备注列表 */
const KJ_REMARK_LIST = params => {
  return fetch({
    url: 'cfg/qr/quick/remarks/list/by/type',
    method: 'post',
    data: params
  })
}

/* 删除快捷备注列表 */
const KJ_REMARK_DELETE = params => {
  return fetch({
    url: 'cfg/qr/quick/remarks/del',
    method: 'post',
    data: params
  })
}

const apiList = {
  LOGIN,
  ORDER_DEL,
  MOTOR_TYPE_RESULT,
  UPDATE_COUPON_STATUS,
  BRAND_SAVE,
  MOTOR_TYPE,
  UPDATE_COUPON_PUB_NUN,
  ADD_NEW_COUPON_TEMP,
  ORDER_TEMP_SAVE,
  STORE_ROLE_LIST,
  APP_MENU,
  EMPLOYEE_JOB,
  EMPLOYEE_ACTIVE,
  EMPLOYEE_DEL,
  EMPLOYEE_INFO,
  NEW_EMPLOYEE_SAVE,
  STS_EMPLOYEE_LIST,
  INDEX_LOGIN,
  ORDER_TEMP_DEL,
  ORDER_TEMP_SORT_ALL,
  LOGOUT_INDEX,
  SMS_LIST,
  SYS_ACTIVE,
  SYS_ORDER_SMS,
  FINANCE_SAVE,
  QRCODE_SERVICE,
  ORDER_TEMP_SORT,
  // INDEX_SIGN,
  COMPANY_ORDER_CHECK,
  MOBILE_CHECK,
  COMPANY_ORDER_INFO,
  STORE_INFO,
  COMPANY_SAVE,
  COMPANY_INFO,
  COMPANY_ORDER_LIST,
  COMPANY_INFO_BY_PRODUCTION_ORDERNO,
  STORE_SAVE,
  JZTS_COUNT,
  JZTS_CATEGORY,
  JZTS_RECORD,
  JZTS_SMSRESEND,
  INDEX_ORDER,
  SUBJECT_LIST,
  JZTS,
  JZTS_ONOFF,
  REGISTER,
  LOGIN_EXP,
  SYS_PRODUCT,
  CHECK_COUPON_SYS,
  QUICK_ORDER,
  ACCOUNT_CUS_STORE,
  UPDATE_ORDER_INFO,
  MEMBER_MOTOR,
  SYS_TABLE_REMARK,
  SERVICE_AND_SKU,
  GOODS_AND_SKU,
  SAVE_DISCOUNT_CARD,
  SAVE_TIMES_CARD,
  LOGOUT,
  ADD_NEW_CAR,
  SERVICE_CATEGORY,
  SERVICE_LIST,
  GOODS_CATEGORY,
  GOODS_LIST,
  SERVICE_SKU_LIST,
  GOODS_BRAND_LIST,
  ADD_NEW_GOODS,
  CUSTOM_LIST,
  GOODS_SKU_LIST,
  ADD_NEW_SERVICE,
  GOODS_UNIT,
  CUSTOM_DETAIL,
  BUSINESS_LIST,
  TICKET_LIST,
  SEARCH_LIST,
  ACCOUNT_CARD_LIST,
  DISACCOUNT_CARD_LIST,
  ACCOUNT_CARD_SAVE,
  DISACCOUNT_CARD_SAVE,
  DISACCOUNT_CARD_DETAIL,
  DISACCOUNT_CARD_RECORD,
  LIST_STORE_COUPON_TEMP,
  LIST_STORE_COUPON_MEMBER,
  COUPON_DETAIL,
  FIND_CAR,
  CUSTOM_TAG_LIST,
  CUSTOM_DEL,
  FIND_CUSTOM,
  MSG_LIST,
  SERVICE_DETAIL,
  GOODS_DETAIL,
  COUPON_TEMP_DETAIL,
  COUPON_COUNT,
  READ_MSG,
  CUSTOM_OWN_COUPON,
  COUNT_VIP_CARD,
  ACCOUNT_DETAIL,
  EMPLOYEE_LIST,
  ORDER_LIST,
  ORDER_DETAIL,
  ORDER_RECEPTION,
  ORDER_MAIN,
  ORDER_TEMP,
  ORDER_TEMP_DETAIL,
  ORDER_FINISH,
  PAYMENT_FORM,
  PAYMENT_SAVE,
  BUSINESS_DETAIL,
  BUSINESS_READ,
  CASHIER_COLLECT_MONEY,
  TAKE_CARD,
  JIECHE_DETAIL,
  ADD_BUSINESS,
  CAR_DETAIL,
  CAR_UNBIND,
  FINANCE_RECORD_LIST,
  FINANCE_RECORD_DETAIL,
  FINANCE_RECORD_COUNT,
  CURRENT_USER,
  CUSTOM_DETAIL_BY_CARID,
  EXCHANGE_FORM,
  EXCHANGE_SAVE,
  EXCHANGE_LIST,
  SMS_USABLE_NUM,
  CARD_DELAY,
  PASSWORD_RESET,
  EXCHANGE_DETAIL,
  CUSTOM_DETAIL_BY_CUSID,
  SERVICE_CATEGORY_TOP,
  GOODS_CATEGORY_TOP,
  PASSWORD_FORGET,
  CAPTCHA_SYSTEM,
  FEEDBACK,
  SUBJECT,
  SERVER_DEL,
  GOODS_DEL,
  TAKE_CARD_ORDER,
  MEMBER_PAY_PASSWORD_SAVE,
  ROLE_MENU,
  MOTOR_DETAIL,
  ADD_NEW_TAG,
  DEL_TAG,
  ADD_NEW_CUSTOM,
  ADD_ACCOUNT_ACTIVE,
  ADD_DISCOUNT_ACTIVE,
  ADD_PACKAGE_ACTIVE,
  CHARGE_ACTIVE_SWITCH,
  CHARGE_ACTIVE_LIST,
  DEL_ACTIVE,
  CHARGE_ACTIVE_DETAIL,
  SERVER_UP_DOWN,
  GOODS_UP_DOWN,
  GOODS_SKU_DEL,
  SERVER_SKU_DEL,
  ORDER_CLOSE,
  FINANCE_RECORD_SUM,
  ROLE_LIST,
  ROLE_DETAIL,
  ROLE_SAVE,
  ROLE_DELETE,
  BRAND_JINGYING,
  KJ_REMARK_LIST,
  KJ_REMARK_DELETE
}

export default apiList
