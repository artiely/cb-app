<template >
  <div class="userBox">
    <v-header title="我的" :isBack="false"></v-header>
    <v-scroll-page top="44" bottom="50" style="overflow-y:scroll">
        <div class="user-info">
          <div @click="toInfo">
            <div class="c_card--user--icon">
              <div class="c_card--nick--icon">
                <span v-if="data&&data.name">{{data.name.split('')[0]}}</span>
                <div class="c_card-user--edit">编辑</div>
              </div>
            </div>
          </div>
          <div class="user-info--text">{{data.name}}</div>
          <div class="user-info--text">{{data.mobile||data.username|telFormat()}}</div>
        </div>
        <v-br :height="20"></v-br>
        <v-cell-group>
          <v-cell link @click.native="switchStore">
            <div slot="title">
              当前版本
              <v-badge style="border-radius:4px;padding:4px 6px;height:auto" v-if="data.company">{{data.company.sysProductTitle}}</v-badge>
            </div>
            <div slot="text" style="color:#1690ff">
              <!-- 获取更多功能 -->
            </div>
          </v-cell>
          <!-- <v-cell title="企业管理" text=" " link @click.native="toCompany"></v-cell> -->
          <v-cell title="切换店铺" text=" " link @click.native="switchStore"></v-cell>
        </v-cell-group>

        <!-- <v-cell title="分享给朋友" link></v-cell> -->
        <v-cell-group>
          <!-- <v-cell title="客服" link @click.native="toHotLine"></v-cell> -->
          <v-cell title="帮助" link @click.native="tohelp"></v-cell>
          <v-cell title="系统设置" link @click.native="tosetting"></v-cell>
          <!-- <v-cell title="我要吐个槽" link @click.native="toShits"></v-cell>
          <v-cell title="使用帮助" link @click.native="switchStore"></v-cell> -->
        </v-cell-group>

        <v-cell-group>
          <v-cell title="电脑端地址" text="www.51chebian.com" descTitle="更多功能，请登录电脑端使用" :options="{desStyle:'color:#666'}"></v-cell>
        </v-cell-group>
        <p class="more-feature-tip">分析、导出、设置等更多功能，请登录电脑端使用。</p>
    </v-scroll-page>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  computed: {
    data() {
      return this.$store.state.sys.currentUser
    }
  },
  methods: {
    toInfo() {
      this.$router.push('/accountInfo')
    },
    // toCompany() {
    //   this.$router.push('/company')
    // },
    tobuy() {
      this.$router.push('/buy')
    },
    switchStore() {
      this.$dialog.alert({
        message: '亲爱的，该功能暂未对您开放，感谢您的支持与理解'
      })
    },
    tohelp() {
      this.$router.push('/help')
    },
    tosetting() {
      this.$router.push('/setting')
    },
    async getData() {
      let res = await this.$api.CURRENT_USER()
      if (res.status === 1) {
        this.data = res.data
        this.$store.commit('CURRENT_USER', res.data)
      } else {
        console.error(res.status + '获取用户详情失败')
      }
    }
  },
  created() {},
  activated() {
    this.$store.dispatch('getCurrentUser')
  }
}
</script>

<style lang="less">
.userBox{
  .c_header .c_header-isborder.c_header-border{
    background-image: none;
    border-bottom: none;
  }
}

.more-feature-tip {
  font-size: 12px;
  color: #666;
  padding: 0 15px;
  position: relative;
  margin-top: -10px;
  margin-bottom: 15px;
}
.user-info {
  text-align: center;
  line-height: 1.5;
  background: #f8f8f8;
  padding: 10px 0;
  .user-info--text {
    font-size: 18px;
    color: #666;
  }
  .c_card--user--icon {
    width: 80px;
    height: 80px;
    margin: 0 auto;
    position: relative;

    .c_card--nick--icon {
      position: relative;
      height: 60px;
      width: 60px;
      margin-top: 8px;
      margin-right: 10px;
      background: #ddd;
      color: #f8f8f8;
      font-size: 30px;
      border-radius: 50%;
      line-height: 60px;
      text-align: center;
      float: right;
      overflow: hidden;
      .c_card-user--edit {
        position: absolute;
        bottom: 0;
        text-align: center;
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        font-size: 10px;
        height: 15px;
        width: 100%;
        line-height: 15px;
        z-index: 9;
      }
    }
  }
}
</style>
