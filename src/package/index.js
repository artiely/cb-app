// 1.引入组件
import VIcon from './icon'
import { VInputGroup, VInput } from './input'
import VHeader from './header'
// import Vpage from './page'
import { VCell, VCellGroup } from './cell'
import VBr from './br'
import { VKeyboard, VKeyboardNum } from './keyboard'
// import VScroll from './scroll'
import VSearch from './search'
import VNodata from './nodata'
import VNorole from './norole'
import VBadge from './badge'
import VTag from './tag'
import VDot from './dot'
import VButton from './button'
import VPopupTitle from './popup-title'
import VUserCard from './user-card'
import VTabBar from './tab-bar'
import VUpload from './upload'
// import VTextarea from './textarea'
// import VCellRadio from './cell-radio'
// import VCellDialog from './cell-dialog'
import VFadButton from './fad-button'
import VLicence from './licence'
import VMore from './more'
import VScrollPage from './scroll-page'
import VRemark from './remark'
import VBusiness from './business'
import VBusinessCard from './business-card'
import VCbCard from './cb-card'
import VSalePeople from './sale-people'
import VFilterServiceGoods from './filter-service-goods'
//
import VHandovertop from './handovertop'
// 优惠券
import VCouponsTemplate from './coupons-template'
// import VDatePicker from './datePicker'
import { VFooter, VFooterItem } from './footer'

const components = {
  VBusiness,
  VBusinessCard,
  VCbCard,
  VFilterServiceGoods,
  VSalePeople,
  VIcon,
  VUpload,
  VFadButton,
  VRemark,
  VInput,
  VInputGroup,
  VLicence,
  VMore,
  VHeader,
  VCell,
  VTag,
  VCellGroup,
  // VCellDialog,
  VBr,
  VKeyboard,
  // VScroll,
  VNodata,
  VNorole,
  VSearch,
  VScrollPage,
  VFooter,
  VFooterItem,
  VBadge,
  VDot,
  VButton,
  // VDatePicker,
  VPopupTitle,
  VUserCard,
  VTabBar,
  // VTextarea,
  VKeyboardNum,
  // VCellRadio
  VHandovertop,
  VCouponsTemplate
}

const install = function(Vue, Option = {}) {
  if (install.installed) return
  Object.keys(components).forEach(key => {
    Vue.component(components[key].name, components[key])
  })
}

export default {
  install
}
