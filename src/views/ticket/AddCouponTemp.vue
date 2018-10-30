<template>
  <div>
    <v-header title="新建优惠券" righttext="保存" @right-click="handleRight"></v-header>
    <v-scroll-page top="44" style="overflow-y:scroll">
      <v-br height="20"></v-br>
      <v-cell-group>
        <v-cell title="券种" required link @click.native="couponType=true" :text="typeName"></v-cell>
      </v-cell-group>
      <v-cell-group>
        <v-cell title="券名" required v-model="name" input></v-cell>
        <v-cell title="面值" required v-if="type==1" input v-model="moneyReduce" placeholder="请输入面值金额（仅限整数）" type="tel"></v-cell>
        <v-cell title="礼品价值" required v-if="type==2" input v-model="moneyGift" placeholder="请输入面值金额（仅限整数）" type="tel"></v-cell>
      </v-cell-group>
      <v-cell-group>
        <v-cell title="使用门槛" input required v-model="moneyCondition" placeholder="满多少元可用"></v-cell>
        <v-cell title="每人限领" input v-model="restrictNum" placeholder="每人限领张数(不填即1张)"></v-cell>
        <v-cell title="有效期" required link :text="dateText" @click.native="restrictWeekShow=true"></v-cell>
      </v-cell-group>
      <v-more v-model="moreshow"></v-more>
      <div v-show="moreshow">
        <v-cell-group style="margin-bottom:0">
          <v-cell title="使用时间" link @click.native="useDateShow = true" :text="restrictWeek"></v-cell>
          <v-cell title="发行数量" input v-model="numPublish" type="tel" maxlength="10" placeholder="不填即无限"></v-cell>
          <v-cell title="使用说明" input v-model="descriptionUse"></v-cell>
        </v-cell-group>
        <v-remark v-model="remarks"></v-remark>
        <v-br height="50"></v-br>
      </div>
    </v-scroll-page>
    <!-- 券种 -->
    <van-actionsheet v-model="couponType" class="my-actionsheet">
      <div class="actionsheet-box-wrapper">
        <!-- <div class="actionsheet-box actionsheet-box-title">
          请选择券种
        </div> -->
        <div class="actionsheet-box actionsheet-box-border" @click="setType(1)">
          通用券
        </div>
        <div class="actionsheet-box" @click="setType(2)">
          礼品券
        </div>
      </div>
      <v-br></v-br>
      <div class="actionsheet-box-wrapper" @click="couponType=false">
        <div class="actionsheet-box actionsheet-box-cancel">
          取消
        </div>
      </div>
    </van-actionsheet>
    <!-- 有效期 -->
    <van-actionsheet v-model="restrictWeekShow" class="my-actionsheet">
      <div class="actionsheet-box-wrapper">
        <!-- <div class="actionsheet-box actionsheet-box-title">
          请选择有效期
        </div> -->
        <div class="actionsheet-box actionsheet-box-border" @click="setDateType(1)">
          固定日期
        </div>
        <div class="actionsheet-box" @click="setDateType(2)">
          相对有效期
        </div>
      </div>
      <v-br></v-br>
      <div class="actionsheet-box-wrapper" @click="restrictWeekShow=false">
        <div class="actionsheet-box actionsheet-box-cancel">
          取消
        </div>
      </div>
    </van-actionsheet>
    <!-- 指定天数 -->
    <van-dialog class="dialog-price" style="padding:0" v-model="showdurationDays" :showConfirmButton="true" :showCancelButton="true" confirmButtonText="确定" :before-close="beforeClose">
      <div class="dialog-price--title">
        请输入固定时长天数
      </div>
      <input type="tel" maxlength="10" v-model="restrictDays" style="border:1px solid #ddd;height:40px;line-height:40px;border-radius:4px;display:block;margin:10px auto;width:90%;text-indent:10px;color:#333;font-weight:500;font-size:18px;" placeholder="请输入">
    </van-dialog>
    <!-- 指定日期 -->
    <van-popup v-model="otherDateShow" style="width:100%;height:90%" position="bottom">
      <p class="date-toolbar">起始时间</p>
      <van-datetime-picker v-model="startDate" type="date" :item-height="40" :show-toolbar="false" :min-date="minDate" />
      <p class="date-toolbar">截止时间</p>
      <van-datetime-picker v-model="endDate" :show-toolbar="false" :item-height="40" type="date" :min-date="startDate" />
      <v-footer>
        <v-footer-item class="footer-white" @click.native="otherDateShow = false">取消</v-footer-item>
        <v-footer-item @click.native="othderDateConfirm">确定</v-footer-item>
      </v-footer>
    </van-popup>
    <!-- 使用时间 -->
    <van-popup v-model="useDateShow" style="width:100%;height:70%" position="bottom">
      <v-popup-title title="使用时间" @close="useDateShow = false"></v-popup-title>
      <div class="popup-scroll-wrapper" style="top:70px;overflow-y:scroll;bottom:50px">
        <van-checkbox-group v-model="useDateArr">
          <van-cell-group>
            <van-cell :title="item" @click="toggle(index)" v-for="(item,index) in weekDate" :key="item">
              <van-checkbox :name="item" ref="checkboxes" />
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </div>
      <v-footer>
        <v-footer-item @click.native="useDateShow=false">确定</v-footer-item>
      </v-footer>
    </van-popup>
    <!-- 新建成功 -->
    <van-dialog v-model="addOkShow" show-cancel-button confirmButtonText="现在开启" cancelButtonText='以后开启' :before-close="beforeCloseOK">
      <div style="font-size:20px;text-align:center;line-height:48px;display:flex;padding:20px 0">
        <span style="flex:1"><img :src="require('../../assets/img/ok.svg')" style="vertical-align: bottom;">优惠券保存成功</span>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import moment from 'dayjs'
export default {
  data() {
    return {
      name: '',
      type: 1,
      addOkShow: false,
      typeName: '通用券',
      moreshow: false,
      couponType: false,
      restrictWeekShow: false,
      showdurationDays: false,
      restrictDays: '',
      restrictTimeType: 1,
      restrictDateStart: '',
      dateText: '',
      restrictWeek: '',
      moneyReduce: '',
      moneyGift: '',
      moneyCondition: '',
      restrictNum: '',
      numPublish: '',
      descriptionUse: '',

      otherDateShow: false,
      minDate: new Date(),
      startDate: new Date(),
      endDate: new Date(),

      useDateShow: false,
      weekDate: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      useDateArr: []
    }
  },
  watch: {
    useDateArr: {
      handler(val) {
        this.restrictWeek = val.join('、')
      },
      deep: true
    }
  },
  methods: {
    async handleRight() {
      if (this.name === '') {
        this.$toast('请输入券名')
        return
      } else if (this.type === 1) {
        if (this.moneyReduce === '') {
          this.$toast('请输入面值')
          return
        } else if (this.moneyCondition === '') {
          this.$toast('请输入使用门槛')
          return
        } else if (this.moneyCondition < this.moneyReduce) {
          this.$toast('使用门槛必须大于等于面值')
          return
        } else if (this.restrictTimeType === 1) {
          if (this.restrictDateStart === '' || this.restrictDateEnd === '') {
            this.$toast('请选择有效期')
            return
          }
        } else if (this.restrictTimeType === 2) {
          if (this.restrictDays === '') {
            this.$toast('请选择有效期')
            return
          }
        }
      } else if (this.type === 2) {
        if (this.moneyGift === '') {
          this.$toast('请输入礼品价值')
          return
        } else if (this.moneyCondition === '') {
          this.$toast('请输入使用门槛')
          return
        } else if (this.restrictTimeType === 1) {
          if (this.restrictDateStart === '' || this.restrictDateEnd === '') {
            this.$toast('请选择有效期')
            return
          }
        } else if (this.restrictTimeType === 2) {
          if (this.restrictDays === '') {
            this.$toast('请选择有效期')
            return
          }
        }
      }
      let res = await this.$api.ADD_NEW_COUPON_TEMP({
        name: this.name,
        status: 1,
        type: this.type,
        moneyCondition: this.moneyCondition,
        moneyReduce: this.moneyReduce,
        moneyGift: this.moneyGift,
        restrictNum: this.restrictNum,
        restrictTimeType: this.restrictTimeType,
        restrictDays: this.restrictDays,
        restrictDateStart: this.restrictDateStart,
        restrictDateEnd: this.restrictDateEnd,
        restrictWeek: this.restrictWeek,
        descriptionUse: this.descriptionUse,
        numPublish: this.numPublish,
        remarks: this.remarks
      })
      if (res.status === 1) {
        this.addOkShow = true
      }
    },
    setType(type) {
      if (type === 1) {
        this.type = 1
        this.typeName = '通用券'
      } else {
        this.type = 2
        this.typeName = '礼品券'
      }
      this.couponType = false
    },
    setDateType(type) {
      if (type === 1) {
        this.restrictTimeType = 2
        this.showdurationDays = true
      } else {
        this.restrictTimeType = 1
        this.otherDateShow = true
      }
      this.restrictWeekShow = false
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle()
    },
    beforeClose(action, done) {
      if (action === 'confirm') {
        if (this.restrictDays > 0) {
          this.dateText = `自办理起 ${this.restrictDays} 天有效`
          done()
        } else {
          this.$toast('请填写天数')
          done(false)
        }
      } else {
        done()
      }
    },
    async beforeCloseOK(action, done) {
      if (action === 'confirm') {
        done()
        this.$router.replace({ name: 'Coupon', params: { refresh: true } })
      } else {
        // on cancel
        let res = await this.$api.UPDATE_COUPON_STATUS({ id: this.id })
        if (res.status === 1) {
          this.$router.replace({
            name: 'Coupon',
            params: { refresh: true }
          })
        }
        done()
      }
    },
    othderDateConfirm() {
      this.restrictDateStart = moment(this.startDate).format('YYYY-MM-DD')
      this.restrictDateEnd = moment(this.endDate).format('YYYY-MM-DD')
      this.dateText = `${this.restrictDateStart} ~ ${this.restrictDateEnd}`
      this.otherDateShow = false
    }
  },
  activated() {
    this.name = ''
    this.type = 1
    this.typeName = '通用券'
    this.moreshow = false
    this.couponType = false
    this.restrictWeekShow = false
    this.showdurationDays = false
    this.restrictDays = ''
    this.moneyReduce = ''
    this.restrictTimeType = 1
    this.restrictDateStart = ''
    this.dateText = ''
    this.restrictWeek = ''
    this.moneyGift = ''
    this.moneyCondition = ''
    this.restrictNum = ''
    this.numPublish = ''
    this.descriptionUse = ''

    this.otherDateShow = false
    this.minDate = new Date()
    this.startDate = new Date()
    this.endDate = new Date()

    this.useDateShow = false
    this.weekDate = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    this.useDateArr = []
  }
}
</script>

<style scoped>
.date-toolbar {
  padding-top: 10px;
  text-align: center;
}
</style>