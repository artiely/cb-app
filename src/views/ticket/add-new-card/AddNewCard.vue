<template>
  <div>
    <v-header :title="id?'编辑卡活动':'新建卡活动'" righttext="保存" @right-click="save" :left-click="toBack"></v-header>
    <v-scroll-page top="44">
      <cube-scroll>
        <v-br :height="20"></v-br>
        <!-- <v-cell-group>
          <v-cell title="卡种" required v-if="!isEdit">
            <div slot="text">
              <van-radio-group v-model="cardType" class="cardtype-radios" :disabled="isEdit">
                <van-radio name="2" @click.native="cardType='2'">折扣卡</van-radio>
                <van-radio name="3" @click.native="cardType='3'">次卡</van-radio>
              </van-radio-group>
            </div>
          </v-cell>
          <v-cell v-else title="卡种" required :text="cardType=='2'?'折扣卡':'次卡'">
          </v-cell>
        </v-cell-group> -->
        <!-- 卡种样式修改开始 -->
        <v-cell-group style="margin:0">
          <v-cell  v-if="!this.$route.query.id" title="卡种" required link :text="cardType === '2'?'折扣卡':'次卡'" @click.native="cardFn"></v-cell>
          <v-cell v-if="this.$route.query.id" title="卡种"   :text="cardType === '2'?'折扣卡':'次卡'" ></v-cell>
        </v-cell-group>
        <div class="tishi" v-if="cardType === '2'">
          折扣卡：可针对指定服务/商品或全场通用进行优惠的卡，消费时在正常销售价格基础上享受一定的折扣优惠。
        </div>
        <div class="tishi" v-if="cardType === '3'">
          次卡：即针对指定的服务/商品，以次数为单位进行优惠的卡，通过减少次数的形式来消费。
        </div>
        <!-- 卡种样式修改 -->
        <v-cell-group style="margin-bottom:0">
          <v-cell title="卡名" required input v-model="name" :maxlength="10"></v-cell>
          <v-cell title="售价" required input v-model="money" type="tel"></v-cell>
          <v-cell title="原价" v-if="cardType=='3'" input v-model="moneySrc" type="tel"></v-cell>
          <v-cell title="折扣" v-if="cardType=='2'" required placeholder="请输入1~10之间的折扣数" type="number" currency :maxValue="10" input v-model="discount"></v-cell>
        </v-cell-group>
        <p style="font-size:14px;padding-left:15px;color:#666;padding-top:5px;" v-if="cardType==2">如输入9折，即服务/商品销售单价 × 0.9</p>
        <v-br :height="20"></v-br>
        <v-cell-group style="margin:0">
          <v-cell title="有效期" required link :text="limitDateText" @click.native="limitFn"></v-cell>
          <v-cell title="用卡范围" v-if="cardType=='2'" required link :text="cardLimitType" @click.native="actionsshow =true"></v-cell>
          <v-cell title="用卡范围" v-if="cardType=='3'" required link text="指定服务/商品" @click.native="choiceLimit()"></v-cell>
        </v-cell-group>
        <div class="has-limit-card" v-if="cardType=='2'&&scopeType=='2'" @click="choiceLimit">
          <span class="fl">
            <span style="color:#666">已选：</span>{{skuListFilter.length}}</span>
          <span class="fr">
            <v-icon name="icon-add_bg"></v-icon> 添加服务/商品</span>
        </div>
        <div class="has-limit-card" v-if="cardType=='3'" @click="choiceLimit()">
          <span class="fl">
            <span style="color:#666">已选：</span>{{skuListFilter.length}}</span>
          <span class="fr addGoods">
            <v-icon name="icon-add_bg"></v-icon> 添加服务/商品</span>
        </div>
        <v-remark v-model="remarks"></v-remark>
        <div style="padding:0 15px" v-if="id">
          <button class="outline" style="border:1px solid #d73962;color: #d73962;margin-top: 50px;" @click="del">删除该卡活动</button>
        </div>
      </cube-scroll>
    </v-scroll-page>
    <van-actionsheet v-model="actionsshow" :actions="actions" class="my-actionsheet">
      <div class="actionsheet-box-wrapper">
        <div class="actionsheet-box actionsheet-box-title">
          请选择用卡范围
        </div>
        <div class="actionsheet-box actionsheet-box-border" @click="choiceAll">
          全场通用
        </div>
        <div class="actionsheet-box" @click="choiceLimit">
          指定服务/商品
        </div>
      </div>
      <v-br></v-br>
      <div class="actionsheet-box-wrapper" @click="actionsshow=false">
        <div class="actionsheet-box actionsheet-box-cancel">
          取消
        </div>
      </div>
    </van-actionsheet>
    <van-actionsheet v-model="limitDateShow" :actions="dateactions" class="my-actionsheet">
      <div class="actionsheet-box-wrapper">
        <div class="actionsheet-box actionsheet-box-title">
          请选择有效方式
        </div>
        <div class="actionsheet-box actionsheet-box-border" @click="noLimit">
          永久有效
        </div>
        <div class="actionsheet-box" style="line-height:1" @click="hasLimit">
          <p style="padding-top:10px;padding-bottom:5px">固定时长</p>
          <p style="font-size:12px;color:#666">自办理起的有效天数</p>
        </div>
      </div>
      <v-br></v-br>
      <div class="actionsheet-box-wrapper" @click="limitDateShow=false">
        <div class="actionsheet-box actionsheet-box-cancel">
          取消
        </div>
      </div>
    </van-actionsheet>
    <!-- 卡种 -->
    <van-actionsheet v-model="cardDateShow" :actions="dateactions" class="my-actionsheet">
      <div class="actionsheet-box-wrapper">
        <div class="actionsheet-box actionsheet-box-title">
          请选择卡种
        </div>
        <div class="actionsheet-box actionsheet-box-border" @click="sel_zkk">
          折扣卡
        </div>
        <div class="actionsheet-box" @click="sel_ck">
          次卡
        </div>
      </div>
      <v-br></v-br>
      <div class="actionsheet-box-wrapper" @click="cardDateShow=false">
        <div class="actionsheet-box actionsheet-box-cancel">
          取消
        </div>
      </div>
    </van-actionsheet>
    <!-- 天数 -->
    <van-dialog class="dialog-price" style="padding:0" v-model="showdurationDays" :showConfirmButton="true" :showCancelButton="true" confirmButtonText="确定" :before-close="beforeClose">
      <div class="dialog-price--title">
        请输入固定时长天数
      </div>
      <input type="tel" maxlength="10" v-model="tempdurationDays" style="border:1px solid #ddd;height:40px;line-height:40px;border-radius:4px;display:block;margin:10px auto;width:90%;text-indent:10px;color:#333;font-weight:500;font-size:18px;" placeholder="请输入">
    </van-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      money: '',
      discount: '',
      scopeType: '1',
      durationType: '1',
      cardType: '2',
      cardLimitType: '全场通用',
      limitDateText: '永久有效',
      limitDateShow: false,
      dateKeyshow: false,
      actionsshow: false,
      showdurationDays: false,
      cardDateShow: false,
      moneySrc: '',
      tempdurationDays: '',
      durationDays: '',
      KeyValue: [],
      remarks: '',
      data: [
        { name: '永久有效', id: 0 },
        { name: '一个月', id: 30 },
        { name: '半年', id: 182 },
        { name: '一年', id: 365 },
        { name: '两年', id: 750 }
      ],
      id: '',
      isEdit: false
    }
  },
  watch: {
    dateKeyshow: {
      handler(val) {
        if (!val) {
          this.limitDateShow = false
        }
      }
    },
    scopeType: {
      handler(val) {
        if (val === '1') {
          this.cardLimitType = '全场通用'
        } else {
          this.cardLimitType = '指定服务/商品'
        }
      }
    },
    cardType: {
      handler(val) {
        this.$store.commit('SET_CARD_TYPE', val)
        if (!this.isEdit) {
          this.$store.commit('CLEAR_SKU_CARD')
        }
      },
      immediate: true
    },
    durationDays: {
      handler(val) {
        if (val && val !== 0) {
          this.durationType = '2'
          this.limitDateText = `自办理起 ${val} 天有效`
        } else {
          this.durationType = '1'
          this.limitDateText = '永久有效'
        }
      }
    },
    id: {
      handler(val) {
        this.getDetail()
      },
      immediate: true
    },
    durationType: {
      handler(val) {
        if (val === '1') {
          this.limitDateText = '永久有效'
        } else {
          this.limitDateText = `自办理起 ${this.durationDays} 天有效`
        }
      }
    }
  },
  computed: {
    skuList() {
      return this.$store.state.card.skuList
    },
    skuListFilter() {
      return this.$store.getters.skuListFilter
    }
  },
  methods: {
    beforeClose(action, done) {
      if (action === 'confirm') {
        if (
          this.tempdurationDays !== '' &&
          this.tempdurationDays !== 0 &&
          this.tempdurationDays !== '0'
        ) {
          this.durationDays = this.tempdurationDays
          this.durationType = '2'
        }
        done()
      } else {
        done()
      }
    },
    limitFn() {
      this.limitDateShow = true
      var input = document.getElementsByClassName('c_cell_input')
      for (let i = 0; i < input.length; i++) {
        input[i].blur()
      }
    },
    cardFn() {
      this.cardDateShow = true
    },
    sel_zkk() {
      this.cardType = '2'
      this.cardDateShow = false
    },
    sel_ck() {
      this.cardType = '3'
      this.cardDateShow = false
    },
    async save() {
      if (this.cardType === '2') {
        // 折扣卡
        let transactItems = this.skuList.map(v => {
          return { gasSkuId: v.id, gasType: v.gasType }
        })
        let _data = {}
        if (this.scopeType === '1') {
          // 折扣卡全场通用
          _data = {
            id: this.id,
            name: this.name,
            money: this.money,
            discount: this.discount,
            scopeType: this.scopeType,
            durationType: this.durationType,
            durationDays: this.durationDays,
            remarks: this.remarks
          }
        } else {
          // 折扣卡指定商品
          _data = {
            id: this.id,
            name: this.name,
            money: this.money,
            discount: this.discount,
            scopeType: this.scopeType,
            durationType: this.durationType,
            durationDays: this.durationDays,
            remarks: this.remarks,
            transactItems
          }
        }
        if (!this.name) {
          this.$toast.fail('请输入卡名')
          return
        } else if (!this.money) {
          this.$toast.fail('请输入售价')
          return
        } else if (!this.discount) {
          this.$toast.fail('请输入折扣')
          return
        }
        let res = await this.$api.SAVE_DISCOUNT_CARD(_data)
        if (res.status === 1) {
          this.$toast.success('保存成功')
          this.$router.replace({name: 'CardList', params: {refresh: true}})
        } else {
          console.error(`新增折扣卡失败${res}`)
        }
      } else {
        // 次卡

        let transactItems = this.skuList.map(v => {
          return {
            gasSkuId: v.id,
            gasType: v.gasType,
            num: v.count > 0 ? v.count : null
          }
        })
        if (!this.name) {
          this.$toast.fail('请输入卡名')
          return
        } else if (!this.money) {
          this.$toast.fail('请输入售价')
          return
        } else if (this.moneySrc !== '' && Number(this.moneySrc) <= Number(this.money)) {
          this.$toast.fail('卡原价不得小于卡售价')
          return
        } else if (transactItems.length === 0) {
          this.$toast.fail('请选择指定服务/商品')
          return
        }
        // 次卡指定商品
        let _data = {
          id: this.id,
          name: this.name,
          moneySrc: this.moneySrc,
          money: this.money,
          durationType: this.durationType,
          durationDays: this.durationDays,
          remarks: this.remarks,
          transactItems
        }
        let res = await this.$api.SAVE_TIMES_CARD(_data)
        if (res.status === 1) {
          this.$toast.fail('保存成功')
          // this.toBack()
          this.$toast.success('保存成功')
          this.$router.replace({name: 'CardList', params: {refresh: true}})
        } else {
          console.error(`新增次卡失败${res}`)
        }
      }
    },
    async getDetail() {
      // 获取卡详情
      if (!this.id) {
        return
      }
      let res = await this.$api.CHARGE_ACTIVE_DETAIL({ id: this.id })
      if (res.status === 1) {
        this.money = res.data.money
        this.moneySrc = res.data.moneySrc
        this.discount = res.data.discount * 10
        this.name = res.data.name
        this.remarks = res.data.remarks
        this.scopeType = res.data.scopeType
        this.isActive = res.data.isActive
        this.durationType = res.data.durationType
        this.durationDays = res.data.durationDays
        this.cardType = res.data.cardType
        // if (res.data.cardType === '3') {
        //   // 次卡的一些情况
        //   // this.discountMoney = res.data.moneySrc - res.data.money
        // } else
        if (res.data.scopeType === '1') {
          // 全场通用
          this.scopeType = '1'
        } else {
          this.scopeType = '2'
          let transactItems =
            res.data.transactItems &&
            res.data.transactItems.map(v => {
              let count = v.num ? v.num : -1
              const {
                gasSKuName: name,
                gasName,
                gasCode: code,
                gasType,
                gasSkuId: id,
                id: gasId,
                gasSkuPrice: price
              } = v
              return { count, name, code, gasType, id, gasId, price, gasName }
            })
          this.$store.commit('SETONCE_SKU_LIST_CARD', transactItems)
        }
      } else {
        console.error(`获取卡详情失败${res.stateMessage}`)
      }
    },
    toBack() {
      this.$store.commit('CLEAR_SKU_CARD')
      this.name = ''
      this.money = ''
      this.discount = ''
      this.scopeType = '1'
      this.cardType = '2'
      // this.discountMoney = ''
      this.cardLimitType = '全场通用'
      this.limitDateShow = false
      this.dateKeyshow = false
      this.actionsshow = false
      this.moneySrc = ''
      this.durationDays = '0'
      this.KeyValue = []
      this.remarks = ''
      this.currentDate = null
      this.id = ''
      this.isEdit = false
      if (this.isEdit) {
        this.$router.replace({ name: 'CardDetail', query: { id: this.id } })
      } else {
        this.$router.replace({ name: 'CardList' })
      }
    },
    del() {
      this.$dialog
        .confirm({
          title: '确定删除吗？',
          message: ' ',
          confirmButtonText: '确定'
        })
        .then(async() => {
          // on confirm
          let res = await this.$api.DEL_ACTIVE({ id: this.id })
          if (res.status === 1) {
            this.$toast.success('删除成功')
            this.$router.replace('/cardlist')
          }
        })
        .catch(() => {
          // on cancel
        })
    },
    choiceAll() {
      this.scopeType = '1'
      this.actionsshow = false
    },
    choiceLimit() {
      this.scopeType = '2'
      this.actionsshow = false
      this.$router.push({ name: 'ServiceGoods' })
    },
    noLimit() {
      this.durationType = '1'
      this.limitDateShow = false
    },
    hasLimit() {
      this.limitDateShow = false
      this.showdurationDays = true
      this.tempdurationDays = this.durationDays
    }
  },
  activated() {
    // 办折扣卡时我选的指定商品和服务但是我没有选商品 回来还是全场服务
    if (this.skuList.length === 0 && this.cardType === '2') {
      this.scopeType = '1'
    }
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.isEdit = true
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/style/var';
.has-limit-card {
  font-size: 16px;
  color: @primary;
  padding: 15px;
  overflow: hidden;
  .icon {
    color: @primary!important;
    font-size: 20px;
  }
}
.card-date-col {
  .van-col--8 {
    padding-bottom: 10px;
    .primary {
      color: #fff;
    }
  }
}
.card-date-day {
  text-align: center;
  font-size: 20px;
  height: 30px;
  line-height: 30px;
  color: #666;
  .day-num {
    padding: 0 12px;
    border: 1px solid #c7c7c7;
    border-radius: 2px;
  }
}
.cardtype-radios {
  .van-radio {
    float: left;
    margin-left: 20px;
  }
}
.tishi {
  width: 100%;
  font-size: 12px;
  padding: 5px 16px 5px 16px;
  color: #666666;
  box-sizing: border-box;
  line-height: 18px;
}
.addGoods {
  font-size: 16px;
  font-weight: 500;
}
</style>
