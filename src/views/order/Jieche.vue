<template>
  <div>
    <order-custom></order-custom>
    <div class="order-stream">
      <div class="stream-item" @click="handleStatusChange(0,'接车单')">
        <span class="item-text-line active">接车单</span>
      </div>
      <div class="stream-item" @click="handleStatusChange(1,'开单')">
        <v-icon name="icon-xiaotubiao-31" class="fl"></v-icon>
        <span class="item-text-line">订单</span>
      </div>
      <div class="stream-item" @click="handleStatusChange(2,'施工单')">
        <v-icon name="icon-xiaotubiao-31" class="fl"></v-icon>
        <span class="item-text-line">施工单</span>
      </div>
    </div>
    <div class="billing-box">
      <cube-scroll ref="scroll" :data="query">
        <div>
          <v-cell-group>
          <v-cell class="jieche-gray" title="接车单号" :text="orderInfo['receptionOrder.receptionNo']" v-if="orderInfo['receptionOrder.receptionNo']"></v-cell>
          <v-cell class="jieche-gray" title="接车时间" :text="orderInfo['receptionOrder.createDate']" v-if="orderInfo['receptionOrder.createDate']"></v-cell>
          <v-cell class="jieche-gray" title="接车人" :text="orderInfo['receptionOrder.createBy']" v-if="orderInfo['receptionOrder.createBy']"></v-cell>
          </v-cell-group>
          <v-cell-group>
          <v-cell title="送车人" :input="true" v-model="query['receptionOrder.senderName']" :maxlength="6"></v-cell>
          <v-cell title="送车人手机号" :input="true" v-model="query['receptionOrder.senderMobile']" type="tel" :maxlength="11"></v-cell>
          <v-cell title="当前里程(km)" input v-model="query['receptionOrder.motorTotalMile']" type="number"></v-cell>
          <v-cell title="问题描述" :input="true" v-model="query['receptionOrder.question']"></v-cell>
          <v-cell title="技师建议" :input="true" v-model="query['receptionOrder.suggest']"></v-cell>
          <v-cell title="预计完工时间" v-model="expectTime" link datetimepicker :mindate="start"></v-cell>
          </v-cell-group>
          <v-cell-group>
          <v-cell title="备注" :input="true" v-model="query['receptionOrder.remarks']" :maxlength="200" @scroll="scroll"></v-cell>
          </v-cell-group>
        </div>
      </cube-scroll>
    </div>
    <v-footer>
      <v-footer-item class="footer-white" @click.native="handleReset">
        重置
      </v-footer-item>
      <v-footer-item style="flex:2" @click.native="handleSave">
        确定
      </v-footer-item>
    </v-footer>
  </div>
</template>

<script>
import moment from 'dayjs'
import OrderCustom from './OrderCustom'
export default {
  components: {
    OrderCustom
  },
  data() {
    return {
      name: '',
      start: new Date(),
      query: '',
      expectTime: ''
    }
  },
  props: {},
  computed: {
    orderId() {
      return this.$store.state.order.orderId
    },
    orderInfo() {
      return this.$store.state.order.orderInfo
    }
  },
  watch: {
    orderInfo: {
      handler(val) {
        this.query = val
      },
      deep: true,
      immediate: true
    },
    expectTime: {
      handler(val) {
        this.query['receptionOrder.expectTime'] = moment(val).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },
  methods: {
    scroll() {
      console.log('this.$refs.scroll', this.$refs.scroll)
    },
    handleReset() {
      if (
        this.query['receptionOrder.senderName'] ||
        this.query['receptionOrder.senderMobile'] ||
        this.query['receptionOrder.motorTotalMile'] ||
        this.query['receptionOrder.question'] ||
        this.query['receptionOrder.suggest'] ||
        this.query['receptionOrder.expectTime'] ||
        this.query['receptionOrder.remarks']
      ) {
        this.$dialog
          .confirm({
            title: '确定重置吗？',
            message: '重置后，已填项将清空。'
          })
          .then(() => {
            this.$store.commit('SET_ORDER_INFO', {
              'receptionOrder.senderName': '',
              'receptionOrder.senderMobile': '',
              'receptionOrder.motorTotalMile': '',
              'receptionOrder.question': '',
              'receptionOrder.suggest': '',
              'receptionOrder.expectTime': '',
              'receptionOrder.remarks': ''
            })
          })
          .catch(() => {
            // on cancel
          })
      }
    },
    async handleSave() {
      let data = {
        senderName: this.query['receptionOrder.senderName'],
        senderMobile: this.query['receptionOrder.senderMobile'],
        motorTotalMile: this.query['receptionOrder.motorTotalMile'],
        question: this.query['receptionOrder.question'],
        suggest: this.query['receptionOrder.suggest'],
        expectTime: this.query['receptionOrder.expectTime'] ? moment(this.query['receptionOrder.expectTime']).format(
          'YYYY-MM-DD HH:mm:ss'
        ) : '',
        remarks: this.query['receptionOrder.remarks'],
        id: this.query['receptionOrder.id']
      }
      let res = await this.$api.ORDER_RECEPTION(data)
      // ...扩展重写receptionOrder.expectTime
      // this.$store.commit('SET_ORDER_INFO', {
      //   ...this.query,
      //   'receptionOrder.expectTime': moment(
      //     this.query['receptionOrder.expectTime']
      //   ).format('YYYY-MM-DD HH:mm:ss')
      // })
      if (res.status === 1) {
        // 接车单保存返回接车单id
        this.$router.replace({ name: 'Kaidan', query: { id: res.data.id } })
        // this.$store.commit('ORDER_STATUS', 1)
        this.$store.commit('SET_ORDER_INFO', {
          'receptionOrder.id': res.data.id
        })
      } else {
        this.$toast.fail('保存失败')
        console.error('接车单保存失败')
      }
    },
    handleStatusChange(i) {
      if (i === 0) {
        this.$router.replace('/jieche')
      } else if (i === 1) {
        this.$router.replace('/kaidan')
      } else {
        this.$router.replace('/shigong')
      }
    }
  },
  activated() {
    this.expectTime = this.$store.state.order.orderInfo['receptionOrder.expectTime']
    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 500)
    })
  }
}
</script>

<style lang="stylus">
.jieche-gray{
  &.c_cell_wrapper{
    background #f8f8f8;
    .c_cell{
       background #f8f8f8;
    }
  }
}
</style>
