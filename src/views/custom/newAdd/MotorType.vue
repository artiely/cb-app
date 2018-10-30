<template>
  <van-popup v-model="value" style="width:100%;height:100%" position="bottom">
    <v-header title="请选择车型" :border="false" :left-click="closePopup"></v-header>
    <v-search placeholder="可直接输入车系搜索"></v-search>
    <div v-for="item in result" @click="handleResult(item)">{{item.name}}</div>
    <v-scroll-page :top="top">
      <scroller :on-refresh="refresh" :on-infinite="infinite">
        <div v-for="item in data" class="motortype-cell" @click="checkCell(item)">
          {{item.name}}
        </div>
      </scroller>
    </v-scroll-page>
  </van-popup>
</template>

<script>
export default {
  name: 'v-motor-type',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    resultData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      query: {
        pageNo: 1,
        pageSize: 40,
        type: '1',
        parentId: ''
      },
      totalPage: 0,
      data: [],
      currentLevel: 1,
      result: []
    }
  },
  computed: {
    top() {
      return 94 + this.result.length * 40
    }
  },
  watch: {
    result: {
      handler(val) {
        this.$emit('update:resultData', val)
      },
      deep: true
    }
  },
  methods: {
    async getData(done) {
      let res = await this.$api.MOTOR_TYPE(this.query)
      if (res.status === 1) {
        if (this.query.pageNo === 1 || this.query.pageNo === '1') {
          this.data = res.page.list || []
        } else {
          this.data = this.data.concat(res.page.list || [])
        }
        this.totalPage = res.page.totalPage
        this.currentLevel = Number(res.message)
        done && done()
      }
    },
    handleResult(item) {
      function findFirstLargeNumber(element) {
        return element.id === item.id
      }
      var index = this.result.findIndex(findFirstLargeNumber)
      console.log('index', index)
      if (index === 0) {
        this.query.parentId = ''
        this.query.type = '1'
      } else if (index !== 0 && index !== -1) {
        this.query.parentId = this.result[index - 1].id
        this.query.type = index + 1
      }
      this.query.pageNo = 1
      this.getData()
    },
    checkCell(item) {
      this.getResult({ type: this.currentLevel, categoryId: item.id })
      if (this.currentLevel === 4) {
        this.$emit('input', false)
        return
      }
      this.query.parentId = item.id
      this.query.type = this.currentLevel + 1
      this.query.pageNo = 1
      this.getData()
    },
    async getResult(data) {
      let res = await this.$api.MOTOR_TYPE_RESULT(data)
      if (res.status === 1) {
        this.result = res.data
      }
    },
    refresh(done) {
      this.query.pageNo = 1
      this.getData(done)
    },
    infinite(done) {
      if (this.totalPage > this.query.pageNo) {
        this.query.pageNo++
        this.getData(done)
      } else {
        done && done()
      }
    },
    closePopup() {
      this.$emit('input', false)
    }
  },
  activated() {
    this.getData()
  }
}
</script>

<style scoped>
.motortype-cell {
  font-size: 18px;
  height: 50px;
  line-height: 50px;
}
</style>