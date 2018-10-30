<template>
  <div>
    <div>
      <div>
        <keep-alive>
          <router-view>
          </router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'dayjs'
export default {
  components: {
  },
  data() {
    return {
      orderCode: '', // FIXME: 待删除临时
      date: moment().format('YYYY-MM-DD'),
      refresh: 0,
      staffList: '',
      staffVisible: false,
      currentStaff: ''
    }
  },
  watch: {
    orderStatus: {
      handler(val) {
        switch (val) {
          case 0:
            this.$router.push('/billing/jieche')
            break
          case 1:
            this.$router.push('/billing/kaidan')
            break
          case 2:
            this.$router.push('/billing/shigong')
            break
          default:
            this.$router.push('/billing/kaidan')
        }
      }
    }
  },
  computed: {
    custom() {
      return this.$store.state.order.custom
    },
    orderStatus() {
      return this.$store.state.order.orderStatus
    },
    orderOfCustom() {
      return this.$store.state.order.orderOfCustom
    }
  },
  methods: {
    async getEmployee() {
      let res = await this.$api.EMPLOYEE_LIST()
      if (res.status === 1) {
        this.staffList = res.list
      }
    }
  },
  created() {},
  mounted() {
    this.getEmployee()
  },
  activated() {
    this.refresh++
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';


</style>
