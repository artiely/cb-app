<template>
  <div>
    <v-header title="客户储值账户" :border="false"></v-header>
    <v-search v-model="keywords" placeholder="客户名/手机号" ></v-search>
    <div class="c-scroll-wrapper-top-search">
      <cube-scroll :data="data" ref="scroll" @pulling-up="onPullingUp" :options="options" @pulling-down="onPullingDown">
        <div style="padding-top:20px" v-if="data.length>0">
          <div class="c-valuecard clearfix" v-for="item in data" :key="item.id" @click="toDetail(item)">
            
            <div class="c-valuecard--user fl newLeftBox">
              <div class="userFirst" v-if="item.member.name">
                {{item.member.name.split('')[0]}}
              </div>
              <div class="userFirst" v-else>
                <v-icon class="handover--icon nouserFont" name="icon-xiaotubiao-49" key="noname" color="#ffffff" size="44"></v-icon>
              </div>
              <div>
                <div class="c-valuecard--name textover1" v-if="item.member.name">
                  <span>{{item.member.name}}</span>
                </div>
                <div class="c-valuecard--noname " v-else>
                  <span>无姓名</span>
                </div>
                <div class="c-valuecard--tel">{{item.member.username |telFormat()}}</div>
              </div>
              
            </div>
            <div class="c-valuecard--money fr">
              {{item.moneyUsable|currency()}}
            </div>
          </div>
        </div>
        <div v-else><v-nodata></v-nodata></div>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
import scroll from '../../common/mixins/scroll.js'
export default {
  mixins: [scroll],
  data() {
    return {
      keywords: '',
      query: {
        pageNo: 1,
        pageSize: 10,
        'searchParameter.keyWord': '',
        cardType: '1' // 储值卡
      },
      data: [],
      totalPage: 0
    }
  },
  watch: {
    keywords: {
      handler(val) {
        this.query['searchParameter.keyWord'] = val
        this.query.pageNo = 1
      }
    }
  },
  methods: {
    async getData() {
      let res = await this.$api.TICKET_LIST(this.query)
      if (res.status === 1) {
        if (this.query.pageNo === 1) {
          this.data = res.page.list || []
        } else {
          this.data = this.data.concat(res.page.list || [])
        }
        this.totalPage = res.page.totalPage
      } else {
        this.$toast(`获取列表失败${res.stateMessage}`)
      }
    },
    toDetail(item) {
      this.$store.commit('ORDER_OF_CUSTOM', item.member)
      this.$router.push({
        name: 'ValueCardDetail',
        query: {
          accountCardId: item.id
        }
      })
    }
  },
  activated() {
    this.getData()
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';
.c-valuecard {
  height: 70px;
  width: 100%;
  padding-left: 15px;
  background: #ffffff;
  &--money {
    width: 120px;
    height: 100%;
    line-height: 70px;
    color: #333333;
    text-align: right;
    font-size: 18px;
    font-weight: 500;
    padding-right:15px;
  }
  &--user {
    width: 100%;
    height: 100%;
    margin-right: -120px;
    padding-right: 120px;
    .borderB();
  }
  &--name {
    font-size: 18px;
    color: #333;
    line-height: 40px;
    height: 35px;
    span {
      font-weight: 500;
    }
  }
  &--noname {
    font-size: 18px;
    font-weight: 500;
    color: #999;
    line-height: 40px;
    height: 35px;
    span {
      font-weight: 500;
    }
  }
  &--tel {
    font-size: 18px;
    color: @primary-text;
    line-height: 25px;
    height: 30px;
 }
 .newLeftBox{
   display: flex;
   align-items: center;
 }
 .userFirst{
   width: 44px;
    height: 44px;
    border-radius: 50%;
    margin-right: 16px;
    background: #c7c7c7;
    color: #fff;
    font-size: 30px;
    line-height: 44px;
    text-align: center;
  }
  .nouserFont{
    width: 44px;
    height: 44px;
    font-size: 44px;
  }
}
</style>
