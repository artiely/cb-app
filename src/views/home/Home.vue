<template>
  <div class="home">
    <div>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <div class="nav-tab-box">
      <div class="nab-tab-box-border">
        <van-tabbar v-model="currId" @change="handleChange" style="z-index:999">
          <van-tabbar-item v-for="item in menu" :key="item.id">
            <span>{{item.text}}</span>
            <template slot="icon" slot-scope="props">
              <v-icon :name="props.active ? item.activeIcon : item.icon" />
            </template>
          </van-tabbar-item>
        </van-tabbar>
      </div>
    </div>
  </div>
</template>
<script>
import PageMove from '@/components/PageMove'
export default {
  components: {
    PageMove
  },
  data() {
    return {
      active: 0,
      menu: [
        {
          text: '工作台',
          icon: 'icon-shouye',
          activeIcon: 'icon-gongzuotai',
          path: '/index',
          id: 0
        },
        {
          text: '销售订单',
          icon: 'icon-xiaotubiao-44',
          activeIcon: 'icon-xiaotubiao-45',
          path: '/order',
          id: 1
        },
        {
          text: '客户/车辆',
          icon: 'icon-xiaotubiao-51',
          activeIcon: 'icon-xiaotubiao-55',
          path: '/custom',
          id: 2
        },
        {
          text: '我的',
          icon: 'icon-xiaotubiao-49',
          activeIcon: 'icon-xiaotubiao-50',
          path: '/user',
          id: 3
        }
      ],
      currId: 0
    }
  },
  methods: {
    selectPath(item) {
      this.currId = item.id
      this.$router.push(item.path)
    },
    handleChange() {
      switch (this.currId) {
        case 0:
          this.$router.push('/index')
          break
        case 1:
          this.$router.push('/order')
          break
        case 2:
          this.$router.push('/custom')
          break
        case 3:
          this.$router.push('/user')
          break
      }
    }
  },
  mounted() {},
  activated() {
    let currPath = this.$route.path
    switch (currPath) {
      case '/index':
        this.currId = 0
        break
      case '/order':
        this.currId = 1
        break
      case '/custom':
        this.currId = 2
        break
      case '/user':
        this.currId = 3
        break
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/border';
.home .nav-tab-box {
  z-index: 999;
  position: absolute;
}
.nab-tab-box-border {
  position: relative;
  height: 100%;
  .borderT();
  .van-tabbar-item{
    color:#333;
    .borderT();
    .icon{
      color:#333!important;
    }
  }
  // .divider(top)
  //  left: 0;
  //     top: 0;
  //     bottom: auto;
  //     right: auto;
  //     height: 1px;
  //     width: 100%;
  //     transform-origin: 0% 0%;
  //     transform: scaleY(0.5);
}
.home {
  // height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  overflow-x: hidden;

  .van-tabbar-item--active {
    .icon {
      color: #38f !important;
    }
  }
  .header {
    position: fixed;
    top: 0px;
    left: 0;
    right: 0;
    width: 100%;
    height: 40px;
    background: #fff;
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.1);
    z-index: 99;
  }
  .scroller {
    height: 100vh;
    box-sizing: border-box;
  }
  .nav-tab-box {
    position: fixed;
    width: 100%;
    height: 50px;
    bottom: 0;
    left: 0;
    background: #fff;
    z-index: 99;
    // box-shadow: 0 3px 5px 3px rgba(0, 0, 0, 0.1);
    // .borderT();
    .icon {
      font-size: 24px;
    }
  }
}
</style>
