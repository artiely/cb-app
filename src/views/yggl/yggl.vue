<template>
  <div>
    <v-header title="员工管理" :border="false" :left-click="handleLeft"></v-header>
    <v-search placeholder="姓名/手机号" v-model="keywords"></v-search>
    <v-tab-bar :data="tabData" style="background:#f8f8f8" v-model="active"></v-tab-bar>
    <v-scroll-page top="134">
      <cube-scroll :data="data" ref="scroll" :options="options" @pulling-up="onPullingUp" @scroll="scroll" @pulling-down="onPullingDown">
        <v-br height="20"></v-br>
        <v-cell-group>
          <v-cell wrap link class="yggl-cell-wrapper" v-for="item in data" :key="item.id" @click.native="toInfo(item)" :class="{'disabled':item.activeFlag==='0'}">
            <div slot="text" class="yggl-cell">
              <div class="yggl-icon yggl-manager"  v-if="item.type=='1'">
                <v-icon name="icon-xiaotubiao-49"></v-icon>
              </div>
              <div class="yggl-icon" v-else>
                {{item.name.split('')[0]}}
              </div>
              <div class="yggl-desc">
                <div class="yggl-desc-name">
                  <span v-if="item.type=='1'">管理员</span>
                  <span v-else>{{item.name}}</span>
                  <!-- <span class="yggl-qiye" v-if="item.type=='1'">企业主</span> -->
                </div>
                <div class="yggl-desc-tel">{{item.username|telFormat()}}</div>
              </div>
            </div>
          </v-cell>
        </v-cell-group>
      </cube-scroll>
    </v-scroll-page>
    <v-fad-button @click.native="handleNew"></v-fad-button>
  </div>
</template>

<script>
import scroll from '../../common/mixins/scroll.js'
export default {
  mixins: [scroll],
  data() {
    return {
      tabData: [
        {
          name: '允许登录',
          id: 0
        },
        {
          name: '不允许登录',
          id: 1
        }
      ],
      data: [],
      keywords: '',
      active: 0,
      query: {
        pageNo: 1,
        pageSize: 10,
        activeFlag: '1',
        'searchParameter.keyWord': ''
      },
      totalPage: 0,
      timer: null
    }
  },
  watch: {
    keywords: {
      handler(val) {
        clearTimeout(this.timer)
        setTimeout(() => {
          this.query.pageNo = 1
          this.query['searchParameter.keyWord'] = val
        }, 400)
      }
    },
    active: {
      handler(val) {
        this.query.activeFlag = val === 0 ? '1' : '0'
        this.query.pageNo = 1
      }
    }
  },
  methods: {
    toInfo(item) {
      this.$router.push({ name: 'yginfo', query: { id: item.id } })
    },
    handleLeft() {
      this.$router.replace('/index')
    },
    handleNew() {
      this.$router.push('/xzyg')
    },
    async getData() {
      let res = await this.$api.STS_EMPLOYEE_LIST(this.query)
      if (res.status === 1) {
        if (this.query.pageNo === 1) {
          this.data = res.page.list || []
        } else {
          this.data = this.data.concat(res.page.list || [])
        }
      }
      this.totalPage = res.page.totalPage
    }
  },
  created() {
    this.getData()
  },
  activated() {
    if (this.$route.params.refresh || this.$store.state.sys.refresh) {
      this.query.pageNo = 1
      this.getData()
      // this.refresh = this.$route.params.refresh
    }
  }
}
</script>

<style lang="less">
.yggl-manager{
  background: #333!important;
  .icon{
    font-size: 44px;
    color:#fff!important;
  }
}
.yggl-qiye {
  font-size: 14px;
  color: #fff;
  padding: 2px 4px;
  background: #ffb718;
  border-radius: 2px;
}
.yggl-cell-wrapper {
  &.disabled {
    .yggl-cell {
      .yggl-desc {
        .yggl-desc-name {
          color: #c7c7c7;
        }
        .yggl-desc-tel {
          color: #c7c7c7;
        }
      }
    }
  }
  .c_cell.c_cell--wrap {
    padding-top: 10px !important;
    padding-bottom: 10px !important;
  }
}
.yggl-cell {
  display: flex;
  .yggl-icon {
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
  .yggl-desc {
    .yggl-desc-name {
      padding-top: 4px;
      font-size: 16px;
      color: #333;
      font-weight: 500;
    }
    .yggl-desc-tel {
      padding-top: 2px;
      font-size: 14px;
      color: #666;
    }
  }
}
</style>
