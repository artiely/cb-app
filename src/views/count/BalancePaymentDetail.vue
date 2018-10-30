<template>
  <div class="banDetBox">
    <v-header title="收支详情"></v-header>
    <div class="c-scroll-wrapper-top">
      <v-br height="20"></v-br>
      <cube-scroll :data="data">
        <!-- 条件是排除记一笔 -->
        <v-cell-group v-if="data.serviceType!=='2'">
          <v-cell title="无客户信息" v-if="!data.tradeName&&!data.tradePhone"></v-cell>
          <v-cell class="" v-else :title="data.tradeName" :options="{titleStyle:'font-size:18px;font-weight:600;color:#333'}"></v-cell>
        </v-cell-group>
        <v-cell-group>
          <v-cell :title="data.serviceType === '2'?'收入金额':'收款金额'" v-if="data.money&&data.recordType==0" key="收入" :text="data.money|currency('+')" :options="cellOptions"></v-cell>
          <v-cell :title="data.serviceType === '2'?'支出金额':'付款金额'" v-if="data.money&&data.recordType==1" key="支出" :text="data.money|currency('-')" :options="cellOptions"></v-cell>
          <card-detail :data="cardDetail"></card-detail>
        </v-cell-group>
        <span v-if="data.remarks">
          <v-remark style="min-height:50px" v-model="data.remarks" disabled></v-remark>
        </span>
        <!-- <v-cell-group>
        <v-cell class="c-cust" title="创建人" v-if="data.createEmployee" :text="data.createEmployee.name"></v-cell>
        </v-cell-group> -->
      </cube-scroll>
    </div>
  </div>
</template>
<script>
import CardDetail from '../../components/CardDetail'
import moment from 'dayjs'
import cellOptions from '../../common/mixins/options.js'
export default {
  components: {
    CardDetail
  },
  data() {
    return {
      data: '',
      id: '',
      subjectList: ''
    }
  },
  mixins: [cellOptions],
  computed: {
    cardDetail() {
      // this.data.serviceType === '2' 对记一笔单独设定标题
      return [
        {
          name: this.data.serviceType === '2' ? '发生时间' : '结算时间',
          value: moment(this.data.createDate).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          name: this.data.serviceType === '2' ? '收/支流水号' : '结算流水号',
          value: this.data.recordNo
        },
        {
          name: '业务类型',
          value: this.$options.filters['serviceTypeFormat'](
            this.data.serviceType
          )
        },
        {
          name: this.data.serviceType === '6' ? '业务单号' : '',
          value: this.data.serviceType === '6' ? this.data.serviceNo : ''
        },
        {
          name: this.data.serviceType === '2' ? '收/支账户' : '结算方式',
          value: this.data.accountName
        },
        {
          name: this.data.serviceType === '2' ? '所属科目' : '科目',
          value: this.data.subject ? this.data.subject.name : ''
        },
        {
          name: '创建人',
          value: this.data.createEmployee ? this.data.createEmployee.name : ''
        }
      ]
    }
  },
  methods: {
    examine() {
      this.$router.push({
        name: 'BalancePaymentHistory',
        query: { tradePhone: this.data.tradeName || this.data.tradePhone }
      })
    },
    toOther() {
      this.$router.replace({
        name: 'BalancePaymentHistory',
        query: { user: this.data.tradePhone }
      })
    },
    async getData() {
      let res = await this.$api.FINANCE_RECORD_DETAIL({ id: this.id })
      if (res.status === 1) {
        this.data = res.data
      } else {
        console.error(res.status + '获取收支详情失败')
      }
    }
  },
  activated() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getData()
    }
  }
}
</script>

<style lang="less">
.banDetBox {
  .balance-payment {
    .c-fixed--header {
      height: 50px;
      background: #eeeeee;
      width: 100%;
    }
  }
  .examine {
    .text {
      color: #1690ff !important;
      span {
        color: #333333;
      }
    }
  }
  .c-cust {
    .c_cell {
      background: none;
    }
  }
  .c_cell .title {
    color: #333;
    span {
      color: #333;
    }
  }
  .card-detail-table .card-detail-table-label {
    width: 100px;
    text-align: left;
    color: #333333;
  }
  .card-detail-table
    tr:nth-child(4)
    td:nth-child(2)
    span.card-detail-table-txt {
    text-decoration: underline;
    color: #1690ff;
  }
}
</style>
