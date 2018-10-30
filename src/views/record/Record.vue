<template>
  <div class="record-jyb">
    <v-header :class="active==0?'red':'green'" :border="false">
      <div slot="title">
        <v-tab-bar :data="[{name:'支出',id:0},{name:'收入',id:1}]" v-model="active" type="btn" :class="active==0?'red-tab':'green-tab'"></v-tab-bar>
      </div>
      <div slot="righttext" @click="handleRight" style="color:#fff">
        明细
      </div>
    </v-header>
    <v-scroll-page top="44" style="background:#f8f8f8">
      <!-- <v-br :height="20" :class="active==0?'red':'green'"></v-br> -->
  <!-- input-native -->
      <v-br height="40" :class="active==0?'red':'green'"></v-br>
      <v-business input  class="record-jyb-business" top-tip="金额" :cursor="showKeyboard" :money="orderPrice" :class="active==1?'jyb-business-green':'jyb-business-red'"  @click.native="showKeyFunc"></v-business>
      <keep-alive>
        <div v-if="active==1">
          <div class="clearfix" style="padding:15px;" v-if="currSubject">
            <div class="fl jyb-subject" @click="objectshow=true">
              {{currSubject.name}}
              <v-icon name="icon-iconfontarrows"></v-icon>
            </div>
            <div @click="dateShow=true" class="jyb-date fr">
              {{currentDate |timeFormat('YYYY-MM-DD')}}
              <v-icon name="icon-iconfontarrows"></v-icon>
            </div>
          </div>
          <div v-if="currSubject">
            <van-row :gutter="20" style="padding:0 15px">
              <van-col :span="6" v-for="item in currSubject.subList" :key="item.key" style="margin-bottom:10px" @click.native="choiceSubject(item)">
                <div class="tag-button textover1" :class="{'tag-button-active':item.id==selectSubject.id}">{{item.name}}</div>
              </van-col>
            </van-row>
          </div>
        </div>
        <div v-else>
          <div class="clearfix" style="padding:15px;" v-if="currSubject2">
            <div class="fl jyb-subject" @click="objectshow=true">
              {{currSubject2.name}}
              <v-icon name="icon-iconfontarrows"></v-icon>
            </div>
            <div @click="dateShow=true" class="jyb-date fr">
              {{currentDate |timeFormat('YYYY-MM-DD')}}
              <v-icon name="icon-iconfontarrows"></v-icon>
            </div>
          </div>
          <div v-if="currSubject">
            <van-row :gutter="20" style="padding:0 15px">
              <van-col :span="6" v-for="item in currSubject2.subList" :key="item.key" style="margin-bottom:10px" @click.native="choiceSubject(item)">
                <div class="tag-button textover1" :class="{'tag-button-active':item.id==selectSubject.id}">{{item.name}}</div>
              </van-col>
            </van-row>
          </div>
        </div>
      </keep-alive>

      <v-remark v-model="remarks" placeholder="备注"></v-remark>
    </v-scroll-page>
    <van-popup v-model="dateShow" position="bottom" style="height:300px;width:100%">
      <van-datetime-picker v-model="currentDate" type="date" :min-date="minDate" @confirm="dateShow=false" @cancel="dateShow=false" />
    </van-popup>
    <van-popup v-model="objectshow" position="bottom" style="height:70%;width:100%" class="popup-radius">
      <v-popup-title :title="active==1?'请选择收入科目':'请选择支出科目'" @close="objectshow=false"></v-popup-title>
      <van-radio-group v-model="currSubject.id">
        <van-cell-group>
          <van-cell :title="item.name" v-for="item in list" :key="item.id" clickable @click="handleClick(item)">
            <van-radio :name="item.id" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-popup>
    <v-footer>
      <v-footer-item @click.native="save">确定</v-footer-item>
    </v-footer>
    <!-- 结算账户 -->
    <account v-model="payPopupVisible" :expend="active===0" @pay="chargeSave" :totalPrice="orderPrice" :placeholder="active==1?'请确定收入':'请确定支出'" acount-placeholder="收/支账户"></account>
     <van-number-keyboard :show="showKeyboard" :hide-on-click-outside="true" :transition="false" theme="custom" extra-key="." close-button-text="确定" @blur="handleOk" @input="onInput" @delete="onDelete" />
  </div>
</template>

<script>
import Account from '../../components/Account'
import moment from 'dayjs'
export default {
  components: {
    Account
  },
  data() {
    return {
      payPopupVisible: false,
      showKeyboard: false,
      orderPrice: '',
      active: 0,
      currentDate: new Date(),
      dateShow: false,
      objectshow: false,
      currSubject: {},
      currSubject2: {},
      selectSubject: {},
      list: [],
      KeyValue: [],
      remarks: ''
    }
  },
  computed: {
    accountDefault() {
      return this.$store.state.account.accountDefault
    }
  },
  watch: {
    active: {
      handler(val) {
        this.KeyValue = []
        this.orderPrice = ''
        this.remarks = ''
        if (val) {
          this.$api.SET_STATUSBAR_COLOR('#0dcc6d')
        } else {
          this.$api.SET_STATUSBAR_COLOR('#d73962')
        }
      },
      immediate: true
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$api.SET_STATUSBAR_COLOR('#f8f8f8')
    next()
  },
  methods: {
    showKeyFunc() {
      this.showKeyboard = true
    },
    onInput(value) {
      if (this.KeyValue.length <= 9) {
        this.KeyValue.push(value)
        this.orderPrice = this.KeyValue.join('')
      }
    },
    onDelete() {
      this.KeyValue.pop()
      this.orderPrice = this.KeyValue.join('')
    },
    handleOk() {
      this.showKeyboard = false
      // this.save()
    },
    // 获取支出的科目
    async getData() {
      let res = await this.$api.SUBJECT_LIST({
        isAccounting: 1,
        accountRule: 0
      })
      if (res.status === 1) {
        this.list = res.list
        this.currSubject = res.list[0]
        this.selectSubject = res.list[0].subList[0]
      }
    },
    // 获取收入的支出
    async getData2() {
      let res = await this.$api.SUBJECT_LIST({
        isAccounting: 1,
        accountRule: 1
      })
      if (res.status === 1) {
        this.list = res.list
        this.currSubject2 = res.list[0]
        this.selectSubject = res.list[0].subList[0]
      }
    },
    handleRight() {
      this.$router.push('/balancepaymenthistory')
    },
    choiceSubject(item) {
      this.selectSubject = item
    },
    handleClick(item) {
      this.currSubject = item
      this.selectSubject = item.subList[0]
      this.objectshow = false
    },
    save() {
      if (!this.orderPrice) {
        this.$toast.fail('请输入金额')
      } else if (!(this.selectSubject && this.selectSubject.id)) {
        this.$toast.fail('请选择科目')
      } else {
        this.payPopupVisible = true
      }
    },
    async chargeSave() {
      let data = {
        'subject.id': this.selectSubject.id,
        money: this.orderPrice,
        makeDate: moment(this.currentDate).format('YYYY-MM-DD'),
        remarks: this.remarks,
        'financeAccount.id': this.accountDefault.id
      }
      let res = await this.$api.FINANCE_SAVE(data)
      if (res.status === 1) {
        this.$toast.success('结算成功')
        this.orderPrice = ''
        this.remarks = ''
        this.currentDate = new Date()
      }
      this.payPopupVisible = false
    }
  },
  activated() {
    // this.orderPrice = ''
    // this.remarks = ''
    // this.active = 0
    this.currentDate = new Date()
    this.getData()
    this.getData2()
  }
}
</script>

<style  lang="less">
@import '../../assets/style/var';
.record-jyb {
  .record-jyb-business{
    .cb-business .cd-business-num{
      color:#fff
    }
  }
  .red {
    background: @danger;
    .c_header_left .icon {
      color: #fff !important;
    }
    .c_header_title {
      color: #fff !important;
    }
  }
  .green {
    background: @success;
    .c_header_left .icon {
      color: #fff !important;
    }
    .c_header_title {
      color: #fff !important;
    }
  }
  .red-tab {
    .c_tab-btn-group {
      border: none;
      color: #fff;
    }
    .c_tab--wrapper {
      background: @danger;
    }
    .c_tab--item-btn.active {
      background: #fff;
      color: @danger;
    }
    .c_tab-btn-group {
      background: #e788a1;
      border: none;
    }
  }
  .green-tab {
    .c_tab-btn-group {
      border: none;
      color: #fff;
    }
    .c_tab--wrapper {
      background: @success;
    }
    .c_tab--item-btn.active {
      background: #fff;
      color: @success;
    }
    .c_tab-btn-group {
      background: #6ee0a7;
      border: none;
    }
  }
}
.jyb-business-green {
  .cd-business-tip {
    display: none;
  }
  .cb-business {
    background: @success;
  }
  .cb-business .cd-business-num .icon {
    color: #fff !important;
    font-size: 30px;
  }
  .cb-business .cd-business-num {
    line-height: 77px;
  }
  .cb-business .cd-business-num > input {
    color: #fff !important;
    height: 77px;
    text-indent: 30px;
    background: transparent;
  }
  .cb-business {
    border-bottom: 1px solid @success!important;
  }
}
.jyb-business-red {
  .cd-business-tip {
    display: none;
  }
  .cb-business {
    background: @danger;
  }
  .cb-business .cd-business-num .icon {
    color: #fff !important;
    font-size: 30px;
  }
  .cb-business .cd-business-num {
    line-height: 77px;
  }
  .cb-business .cd-business-num > input {
    color: #fff !important;
    height: 77px;
    text-indent: 30px;
    background: transparent;
  }
  .cb-business {
    border-bottom: 1px solid @danger!important;
  }
}
.jyb-subject {
  font-size: 16px;
  color: #666;
  .icon {
    font-size: 15px !important;
  }
}
.jyb-date {
  height: 25px;
  line-height: 25px;
  border-radius: 4px;
  border: 1px solid #c7c7c7;
  background: transparent;
  font-size: 12px;
  padding: 0 8px;
  color: #666;
  .icon {
    font-size: 13px !important;
  }
}
.tag-button {
  height: 25px;
  line-height: 25px;
  width: 100%;
  border: 1px solid #c7c7c7;
  color: #999;
  border-radius: 4px;
  text-align: center;
  background: transparent;
  font-size: 12px;
  &.tag-button-active {
    border: 1px solid @primary;
    background: @primary;
    color: #fff;
  }
}
</style>
