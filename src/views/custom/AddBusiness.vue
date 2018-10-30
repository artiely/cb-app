<template>
  <div>
    <v-header title="创建商机" :righticon="orderOfCustom?'icon-sousuo1':newCustomTel?'icon-sousuo1':''" @right-click="toSearch"></v-header>
    <div class="c-scroll-wrapper-top-bottom">
      <cube-scroll>
        <v-user-card :data="orderOfCustom" v-if="orderOfCustom"></v-user-card>
        <div class="c-search--wrapper" v-if="!orderOfCustom&&!newCustomTel" style="margin: 0;padding:0">
          <v-cell title="选择客户" required link @click.native="toSearch" style="background:#eee"></v-cell>
        </div>
        <div v-if="newCustomTel">
          <v-cell title="客户手机号" required input v-model="newCustomTel"></v-cell>
          <v-cell title="客户姓名" input v-model="newCustomName"></v-cell>
        </div>

        <v-cell title="车辆" :input="true" :disabled="true" v-model="carId" @click.native="isShow=true"></v-cell>
        <v-br></v-br>
        <v-cell title="提醒">
          <div slot="right" class="right-slot-style">
            <van-switch v-model="checked" />
          </div>
        </v-cell>
        <v-cell title="下次开单提醒" v-show="checked">
          <div slot="right" class="tip-next" @click="handleNext">
            <v-icon name="icon-checkboxround1" v-show="nextTip"></v-icon>
            <v-icon name="icon-checkboxround0" v-show="!nextTip"></v-icon>
          </div>
        </v-cell>
        <v-cell title="指定时间提醒" v-show="checked" datepicker v-model="query.remindTime">
        </v-cell>
        <v-br></v-br>
        <!-- {{dateOfTip}} {{checked}} {{query}} -->
        <textarea class="business-content" cols="30" rows="3" placeholder="请输入商机内容(必填)" v-model="query.remindContent"></textarea>

      </cube-scroll>
    </div>
    <v-keyboard ref="pay" :is-show='isShow' @enter-end='enterEnd' @close='isShow=false'></v-keyboard>
    <v-footer>
      <v-footer-item class.native="add">确定</v-footer-item>
    </v-footer>

  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      checked: true,
      carId: '',
      isShow: false,
      nextTip: true,
      dateOfTip: '',
      query: {
        'member.id': '',
        remindType: '1',
        remindTime: '',
        remindContent: ''
      }
    }
  },
  computed: {
    orderOfCustom() {
      return this.$store.state.order.orderOfCustom
    },
    newCustomTel() {
      return this.$store.state.order.newCustomTel
    }
  },
  watch: {
    dateOfTip: {
      handler(val) {
        if (val) {
          this.nextTip = false
          this.query.remindType = 2
        }
      }
    },
    nextTip: {
      handler(val) {
        if (val) {
          this.query.remindType = 3
        }
      }
    },
    checked: {
      handler(val) {
        if (val) {
          if (this.nextTip) {
            this.query.remindType = 3
          } else {
            this.query.remindType = 2
          }
        } else {
          this.query.remindType = 1
        }
      }
    }
  },
  created() {},
  methods: {
    enterEnd(val) {
      this.carId = val.join('')
    },
    add() {
      this.$api.ADD_BUSINESS()
    },
    handleNext() {
      this.nextTip = true
      this.dateOfTip = ''
    },
    toSearch() {
      this.$router.push('/searchcus')
    }
  },
  activated() {}
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
.tip-next {
  text-align: right;
  .icon {
    font-size: 24px;
    color: @primary!important;
    &.icon-checkboxround0 {
      color: @disable!important;
    }
  }
}

.business-content {
  padding: 16px;
  width: 100%;
}
.right-slot-style {
  text-align: right;
  line-height: 60px;
  margin-top: 14px;
}
</style>
