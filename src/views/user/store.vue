<template>
  <div class="storeBox">
    <v-header title="店铺信息" righttext="保存" @right-click="save"></v-header>
    <v-scroll-page top="44">
      <v-br height="20"></v-br>
      <v-cell-group style="margin:0">
        <v-cell title="店铺名称" required placeholder="请输入店铺名称（10字内）" maxlength="10" input v-model="name"></v-cell>
        <v-cell title="经营类目" required link @click.native="typeShow=true" :text="roleLabel"></v-cell>
        <v-cell title="客服电话" required input v-model="tel" type="tel" maxlength="11"></v-cell>
        <v-cell title="店铺所在地" required wrap @click.native="handleAddress" :text="areaDetail"></v-cell>

        <!-- <v-cell title="营业时间" link @click.native="dateShow=true" :text="openHour"></v-cell> -->
         <v-cell title="营业时间" link @click.native="dateShow=true" :text="openHourModel"></v-cell>
        <v-remark placeholder="可输入活动信息、广告、店铺简介等..." :maxlength="30" title="公告" v-model="summary">
          <v-cell slot="handle" title="公告" :wrap="summary.length!==0" :text="summary" link></v-cell>
        </v-remark>

      </v-cell-group>
    </v-scroll-page>
    <!-- 经营项目的弹框 -->
    <van-popup v-model="typeShow" style="width:100%;height:70%" position="bottom" :lock-scroll="false" class="popup-radius">
      <v-popup-title title="请选择类目" @close="typeShow = false"></v-popup-title>
      <div class="popup-scroll-wrapper" style="top:70px">
        <cube-scroll data="disAccountList" ref="scroll">

          <van-checkbox-group v-model="typeResult" style="margin:0 0 0 15px;">
            <div class="role-cell-item clearfix" v-for="(item, index) in roleList" @click="toggle(index)" :key="item.id">
              <span class="fl">{{item.label}}</span>
              <span class="fr">
                <van-checkbox :key="item.id" :name="item.value" ref="checkboxes">
                </van-checkbox>
              </span>
            </div>
          </van-checkbox-group>

        </cube-scroll>
      </div>
    </van-popup>

    <van-popup v-model="dateShow" style="width:100%;height:70%" position="bottom">
      <v-popup-title title="营业时间" @close="dateShow=false"></v-popup-title>
      <van-picker :columns="dateColumns" @change="onChangeDate" />
      <v-footer>
        <v-footer-item @click.native="handleDateOk">确定</v-footer-item>
      </v-footer>
    </van-popup>

  </div>
</template>

<script>
// 导入数据
import data from '../../assets/js/data2'
var index = 0
var index2 = 0
// var index3 = 0
// 初始化省
let province = Object.keys(data)
// 初始化市
let _y = Object.values(data)
let _m = _y.map(res => {
  return Object.keys(res)
})
let city = _m[index]
// 初始化区
let _c = Object.values(data)
_c = _c.map(res => {
  return Object.values(res)
})
let __d = Object.values(_c[index])
let area = Object.keys(__d[index])
// console.log(province,city,area)
export default {
  data() {
    return {
      addressShow: false,
      typeShow: false,
      typeItem: {},
      columns: [
        {
          values: province,
          className: 'slot1',
          defaultIndex: 0
        },
        {
          values: city,
          className: 'slot3',
          defaultIndex: 0
        },
        {
          values: area,
          className: 'slot5',
          defaultIndex: 0
        }
      ],
      dateColumns: [
        {
          values: [
            '00:00',
            '00:30',
            '01:00',
            '01:30',
            '02:00',
            '02:30',
            '03:00',
            '03:30',
            '05:00',
            '05:30',
            '06:00',
            '06:30',
            '07:00',
            '07:30',
            '08:00',
            '08:30',
            '09:00',
            '09:30',
            '10:00',
            '10:30',
            '11:00',
            '11:30',
            '12:00',
            '12:30',
            '13:00',
            '13:30',
            '14:00',
            '14:30',
            '15:00',
            '15:30',
            '16:00',
            '16:30',
            '17:00',
            '17:30',
            '18:00',
            '18:30',
            '19:00',
            '19:30',
            '20:00',
            '20:30',
            '21:00',
            '21:30',
            '22:00',
            '22:30',
            '23:00',
            '23:30'
          ]
        },
        {
          values: [
            '00:00',
            '00:30',
            '01:00',
            '01:30',
            '02:00',
            '02:30',
            '03:00',
            '03:30',
            '05:00',
            '05:30',
            '06:00',
            '06:30',
            '07:00',
            '07:30',
            '08:00',
            '08:30',
            '09:00',
            '09:30',
            '10:00',
            '10:30',
            '11:00',
            '11:30',
            '12:00',
            '12:30',
            '13:00',
            '13:30',
            '14:00',
            '14:30',
            '15:00',
            '15:30',
            '16:00',
            '16:30',
            '17:00',
            '17:30',
            '18:00',
            '18:30',
            '19:00',
            '19:30',
            '20:00',
            '20:30',
            '21:00',
            '21:30',
            '22:00',
            '22:30',
            '23:00',
            '23:30'
          ]
        }
      ],
      addressArr: [],
      addressStr: '',
      address: '',
      id: '',
      name: '',
      tel: '',
      areaDetail: '',
      summary: '',
      type: '',
      dateShow: false,
      openHour: '',
      openHourModel: '', // 选择时间确定后时间才改变
      roleLabel: '',
      roleLabelArr: [],
      typeResult: [],
      roleList: []
    }
  },
  watch: {
    type: {
      handler(val) {
        switch (val) {
          case '1':
            this.typeItem = { name: '4S店', id: 1 }
            break
          case '2':
            this.typeItem = { name: '汽修店', id: 2 }
            break
          case '3':
            this.typeItem = { name: '零配件店', id: 3 }
            break
          case '4':
            this.typeItem = { name: '汽车保养店', id: 4 }
            break
        }
      },
      immediate: true
    },
    typeShow: {
      handler(val) {
        if (val === false) {
          this.zhuanhuan()
        }
      },
      immediate: true
    },
    id: {
      handler(val) {
        this.getInfo()
      },
      immediate: true
    }
  },
  methods: {
    handleType(item) {
      this.typeShow = false
      this.typeItem = item
    },
    onChangeDate(picker, values) {
      this.openHour = picker.getValues().join('~')
    },
    handleDateOk() {
      // 确定后赋值
      this.openHourModel = this.openHour
      this.dateShow = false
    },
    handleAddress() {
      this.$router.push({ name: 'Address', query: { id: this.id } })
    },
    onChange(picker, values) {
      index = province.indexOf(picker.getColumnValue(0))

      if (index >= 0) {
        picker.setColumnValues(1, _m[index])
        index2 = _m[index].indexOf(picker.getColumnValue(1))
      }
      if (index >= 0 && index2 >= 0) {
        let __d = Object.values(_c[index])
        let area = Object.keys(__d[index2])
        picker.setColumnValues(2, area)
        this.areaString = values.join(',')
      }
      this.addressArr = picker.getValues()
      console.log(this.addressArr)
      this.addressStr = this.addressArr.join()
    },
    async handleSave() {
      // let res = await this.$api.STORE_SAVE({ name: this.name, tel: this.tel })
    },
    async getInfo() {
      let res = await this.$api.STORE_INFO({ id: this.id })
      if (res.status === 1) {
        this.name = res.data.name ? res.data.name : this.name
        this.tel = res.data.tel ? res.data.tel : this.tel
        this.type = res.data.type
        this.summary = res.data.summary ? res.data.summary : this.summary
        // this.openHour = res.data.businessTimeStart
        //   ? res.data.businessTimeStart
        //   : this.openHour
        this.openHourModel = res.data.businessTimeStart
          ? res.data.businessTimeStart
          : this.openHourModel
        this.areaDetail = res.data.areaDetail
          ? res.data.areaDetail
          : this.areaDetail
        this.code = res.data.code

        this.typeResult = res.data.categorys
          ? res.data.categorys.split(',')
          : this.typeResult
        this.zhuanhuan()
      }
    },
    async save() {
      let data = {
        id: this.id,
        name: this.name,
        // type: this.typeItem.id,
        categorys: this.typeResult ? this.typeResult.join(',') : '',
        tel: this.tel,
        // businessTimeStart: this.openHour,
        businessTimeStart: this.openHourModel,
        areaDetail: this.areaDetail,
        summary: this.summary
      }
      if (data.name === '') {
        this.$toast('请填写店铺名称')
        return
      } else if (data.tel === '') {
        this.$toast('请填写客服电话')
        return
      } else if (data.areaDetail === '') {
        this.$toast('请填写店铺所在地')
        return
      }
      let res = await this.$api.STORE_SAVE(data)
      if (res.status === 1) {
        this.$toast.success('保存成功')
      }
    },
    async storeMessage() {
      var params = {
        code: 'sts_si_store_categorys'
      }
      let res = await this.$api.BRAND_JINGYING(params)
      console.log('code_res =', res)
      if (res.status === 1) {
        this.roleList = res.list
      }
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle()
    },
    zhuanhuan() {
      this.roleLabel = this.roleList
        .filter(item => this.typeResult.indexOf(item.value) > -1)
        .map(v => {
          return v.label
        })
        .join(',')
    },
    isNull() {
      this.roleLabel = ''
      this.roleLabelArr = []
      this.typeResult = []
      this.roleList = []
    }
  },
  created() {},
  activated() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
    }
    if (this.$route.params.data) {
      this.address = this.$route.params.data
      this.areaDetail = this.address.district
        ? this.address.district
        : '' + this.address.address
    }
    this.getInfo()
    this.storeMessage()
  }
}
</script>

<style lang="less">
.storeBox {
  .actionsheet-box {
    font-weight: 500;
  }
  .store-tip {
    font-size: 12px;
    color: #999;
    padding: 5px 15px 20px 15px;
  }
  .role-cell-item {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: #666;
    padding-right: 15px;
    border-bottom: 1px solid #eee;
  }
}
.actionsheet-box {
  font-weight: 500;
}
.my-actionsheet.van-actionsheet {
  .van-hairline--bottom::after {
    border: none !important;
  }
}
</style>
