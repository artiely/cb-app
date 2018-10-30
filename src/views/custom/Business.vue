<template>
  <div>
    <v-header title="商机"></v-header>
    <div class="search-wrapper">
      <v-search v-model="keywords" placeholder="车牌号/客户名/手机号"></v-search>
    </div>
    <div class="c-scroll-wrapper-top-search">
      <cube-scroll @scroll="scroll" :options="options" placeholder="">
        <div class="c_card--wrapper" v-for="(item,index) in data" :key="item.id" @click="toDetail(item,index)">
          <div class="c_card--body">
            <div class="mian-content">
              <h1 class="tip-content">
                <v-dot :number="9999" style="position:absolute;left:0;top:0;" v-if="item.isRead==0"></v-dot>
                <div class="textover2">
                  {{item.remindContent}}
                </div>
              </h1>
              <p class="date">{{item.createDate|timeFormat}}</p>
            </div>
            <div class="link-more">
              <v-icon name="icon-youjiantou1"></v-icon>
            </div>
          </div>
          <div class="c_card--footer clearfix">
            <!-- FIXME: 暂无车牌字段 -->
            <div class="fl">鄂A 12354</div>
            <div class="fr" v-if="item.member">张某某 {{item.member.username |telFormat}}</div>
          </div>
        </div>
      </cube-scroll>
      <div class="add_goods btn-shadow" @click="toAdd">
        <v-icon name="icon-plus-add" color="#fff"></v-icon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      top: 0,
      options: {
        type: 3
      },
      data: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData(id) {
      let res = await this.$api.BUSINESS_LIST({ pageNo: 1, pageSize: 10 })
      if (res.status === 1) {
        this.data = res.page.list
      } else {
        console.error(res.status + res.stateMessage)
      }
    },
    scroll(obj) {
      this.top = -obj.y
    },
    toAdd() {
      this.$router.push('./addbusiness')
    },
    toDetail(item, index) {
      this.$set(this.data[index], 'isRead', 1)
      this.$router.push({ name: 'BusinessDetail', query: { id: item.id } })
    }
  },
  activated() {}
}
</script>

<style lang="less">
@import '../../assets/style/var.less';

.search-wrapper {
  margin-top: 40px;
  padding: 5px 0;
  background: #fff;
}

.c_card--wrapper {
  height: 110px;
  width: 100%;
  position: relative;
  .c_card--body {
    margin-top: 10px;
    height: 80px;
    padding: 10px 22px 0 22px;
    background: #fff;
    font-size: 16px;
    font-weight: 700;
    line-height: 22px;
    display: flex;
    h1 {
      position: relative;
    }
    .date {
      font-size: 14px;
      color: @disable;
    }
    .mian-content {
      flex: 1;
    }
    .link-more {
      width: 40px;
      line-height: 70px;
      text-align: right;
    }
  }
  .c_card--footer {
    height: 30px;
    line-height: 30px;
    color: @primary-text;
    font-size: 14px;
    padding: 0 22px;
    background: #f8f8f8;
  }
}
</style>
