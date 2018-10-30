<template>
  <div>
    <v-header @to-back="toBack" title="收银记录"></v-header>
    <div class="content">
      <div class="count-record-card">
        <div class="card-header">
          <div class="card-header-item l-t">2018-02-24 18:00:00</div>
          <div class="card-header-item r-t">BIJHIJIJ9852871255</div>
        </div>
        <div class="card-body">
          <div class="card-body-item">
            <h1>15926290460</h1>
            <p>谭杰</p>
          </div>
          <div class="card-body-item r-t">
            ￥10000,00
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  },
  methods: {
    toBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="stylus">
.content {
  margin-top 40px
  background #f0f0f0
}
.count-record-card {
  width 100%
  margin-bottom 12px
  .card-header {
    display flex
    height 20px
    line-height 20px
    color #666666
    padding 0 20px
    box-sizing border-box
    background #f8f8f8
  }
  .card-header-item {
    flex 1
    font-size 12px
    &.l-t {
      text-align left
    }
    &.r-t {
      text-align right
    }
  }
  .card-body {
    display flex
    background #fff
    height 60px
    padding 10px 20px
    box-sizing border-box
    .card-body-item {
      flex 1
      h1 {
        line-height 20px
        font-size 14px
        font-weight 700
      }
      &.r-t {
        font-size 20px
        text-align right
        line-height 40px
      }
    }
  }
}
</style>
