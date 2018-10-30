<template>
  <div>
    <v-header :title="title" righttext="保存" @right-click="save">
    </v-header>
    <div class="c-scroll-wrapper-top">
      <v-br :height="20"></v-br>
      <!-- 车牌号组件 -->
      <v-cell-group style="padding:15px 0">
        <v-licence v-model="carId" title="车牌号" @click.native="keyboardShow=true"></v-licence>
      </v-cell-group>
      <!-- 更多 -->
      <v-more v-model="more"></v-more>
      <div v-if="more">
        <v-cell-group>
          <!-- <v-cell title="车型" link @click.native="goMotorType" :wrap="motorType.length>0" :text="motorTypeText"></v-cell> -->
          <v-cell title="VIN码" input v-model="query.vin"></v-cell>
          <v-cell title="发动机号" input v-model="query.engineNo"></v-cell>
        </v-cell-group>
        <v-cell-group>
          <v-cell title="保险到期" link date v-model="query.insuranceDueDate"></v-cell>
          <v-cell title="年检到期" link date v-model="query.checkDueDate"></v-cell>
        </v-cell-group>
        <v-remark v-model="remarks"></v-remark>
      </div>
    </div>
    <!-- 车辆键盘 -->
    <v-keyboard :is-show.sync='keyboardShow' v-model="carId"></v-keyboard>
    <!-- 新建成功 -->
    <van-dialog v-model="addOkShow" show-cancel-button confirmButtonText="现在添加客户" cancelButtonText='以后添加客户' :before-close="beforeCloseOK">
      <div style="font-size:20px;text-align:center;line-height:48px;display:flex;padding:20px 0">
        <span style="flex:1"><img :src="require('../../../assets/img/ok.svg')" style="vertical-align: bottom;">车辆保存成功</span>
      </div>
    </van-dialog>
    <!-- 车型 -->
    <v-motor-type v-model="motorTypeShow" :resultData.sync="motorType"></v-motor-type>
  </div>
</template>

<script>
import moment from 'dayjs'
import MotorType from './MotorType'
export default {
  components: {
    'v-motor-type': MotorType
  },
  data() {
    return {
      keyboardShow: false,
      title: '新增车辆',
      motorType: [],
      carId: [],
      query: {
        vin: '',
        engineNo: '',
        insuranceDueDate: ' ',
        checkDueDate: ' ',
        id: ''
      },
      remarks: '',
      cate: 1,
      more: false,
      memberId: '',
      motorId: '',
      refresh: false,
      addOkShow: false,
      motorTypeShow: false
    }
  },
  watch: {
    more: {
      handler(val) {
        if (val) {
          this.keyboardShow = false
        }
      }
    }
  },
  computed: {
    motorTypeText() {
      return this.motorType
        .map(v => {
          return v.name
        })
        .join(' > ')
    }
  },
  methods: {
    goMotorType() {
      this.motorTypeShow = true
    },
    beforeCloseOK(action, done) {
      if (action === 'confirm') {
        done()
        // 添加客户
        this.$router.push({
          name: 'NewCustom',
          query: {
            motorId: this.motorId
          }
        })
      } else {
        done()
        this.$router.replace({ name: 'Detail', query: { carid: this.motorId } })
      }
    },
    async save() {
      if (this.carId.length < 7) {
        this.$toast.fail('请输入正确的车牌号')
        return
      }
      let data = {
        'motorBrand.id': this.motorType[0] ? this.motorType[0].id : '',
        'motorCompany.id': this.motorType[1] ? this.motorType[1].id : '',
        'motorSeries.id': this.motorType[2] ? this.motorType[2].id : '',
        'motorModel.id': this.motorType[3] ? this.motorType[3].id : '',
        licence: this.carId.join(''),
        remarks: this.remarks,
        id: this.query.id,
        'member.id': this.memberId,
        ...this.query
      }
      let res = await this.$api.ADD_NEW_CAR(data)
      if (res.status === 1) {
        this.refresh = true
        // this.$toast.success('保存成功')
        if (this.memberId) {
          this.$toast.success('保存成功')
          this.$router.replace({
            name: 'Detail',
            query: { carid: res.data.id }
          })
        } else {
          this.addOkShow = true
        }
        this.motorId = res.data.id
        // this.$router.replace({ name: 'Detail', query: { carid: res.data.id } })
        this.query = {
          vin: '',
          engineNo: '',
          insuranceDueDate: ' ',
          checkDueDate: ' '
        }
        this.remarks = ''
        this.carId = []
      } else {
        console.error(`保存失败${res}`)
      }
    },
    async getData() {
      let res = await this.$api.MOTOR_DETAIL({ id: this.$route.query.motorId })
      if (res.status === 1) {
        this.query.id = this.$route.query.motorId
        this.carId = res.data.licence.split('')
        this.query.vin = res.data.vin
        this.query.engineNo = res.data.engineNo
        this.query.insuranceDueDate = moment(res.data.insuranceDueDate).format(
          'YYYY-MM-DD'
        )
        this.query.checkDueDate = moment(res.data.checkDueDate).format(
          'YYYY-MM-DD'
        )
        this.remarks = res.data.remarks
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    to.params.refresh = this.refresh
    next()
  },
  activated() {
    this.more = false
    if (this.$route.query.memberId) {
      this.memberId = this.$route.query.memberId
    } else {
      this.memberId = ''
    }
    if (this.$route.query.code === 'edit') {
      // 如果是编辑车辆
      this.title = '编辑车辆'
      this.more = true
      this.getData()
    } else {
      this.title = '新增车辆'
      this.query.id = ''
      this.carId = []
      this.query.vin = ''
      this.query.engineNo = ''
      this.query.insuranceDueDate = ''
      this.query.checkDueDate = ''
    }
    this.keyboardShow = true
  }
}
</script>

<style>
</style>
