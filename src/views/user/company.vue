<template>
  <div class="companyBox">
    <v-header title="商家管理" righttext="消费记录" @right-click="handleList"></v-header>
    <v-scroll-page top="64">
      <div class="topQyBox">
        <v-cell-group style="background:#f8f8f8;height: 60px;">
          <v-cell wrap style="background:#f8f8f8">
            <div slot="title" style="background:#f8f8f8">
              <h1 style="font-size:16px;color:#333;font-weight:500">商家编码：<span class="code">{{data.code}}</span></h1>
              <p style="font-size:12px;color:#999;padding-top:5px;" v-if="data.ownerEmployee">管理员手机号：<span class="managerPhone">{{data.ownerEmployee.mobile | telFormat()}}</span></p>
            </div>
          </v-cell>
        </v-cell-group>
      </div>

      <!-- {{注释短信余量}} -->
      <!-- <v-cell-group>
        <v-cell title="短信余量">
          <div slot="text">
            <div>
              <span style="color:#d73962">{{smsNum}} 条</span>
              <span style="font-size:14px;color:#fff;padding:6px 12px;border-radius:20px;background:#1690ff" @click="toSms">立即充值</span>
            </div>
          </div>
        </v-cell>
      </v-cell-group> -->
      <p style="font-size:12px;color:#999;padding:5px 15px">名下店铺</p>
      <v-cell-group>
        <v-cell wrap link @click.native="handleStore(item)" v-for="item in data.stores" :key="item.id">
          <div slot="title">
            <div class="cb_store-box">
              <div class="cb_store-icon-box">
                <div class="cb_store-icon">
                  <v-icon name="icon-qiyeguanli"></v-icon>
                </div>
              </div>
              <div class="cb_store-info">
                <h1 style="font-size:18px;color:#333;font-weight:600">{{item.shortname||item.name}}</h1>
                <p style="font-size:14px;color:#999;padding-top:5px;">客服电话：{{data.servicePhone | telFormat()}}</p>
              </div>
            </div>
          </div>
        </v-cell>
      </v-cell-group>
      <!-- <v-cell-group>
        <v-cell :title="item.name" v-for="item in data.stores" :key="item.id" link @click.native="handleStore(item)"></v-cell>
      </v-cell-group> -->
    </v-scroll-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      smsNum: 0,
      data: {}
    }
  },
  methods: {
    async getSmsNum() {
      let res = await this.$api.SMS_USABLE_NUM()
      if (res.status === 1) {
        this.smsNum = res.data
      }
    },
    toSms() {
      this.$router.push('/buysms')
    },
    handleList() {
      this.$router.push('/companyorderlist')
    },
    todetail() {
      this.$router.push('/companyinfo')
    },
    handleStore(item) {
      this.$router.push({ name: 'store', query: { id: item.id } })
    },
    async getinfo() {
      let res = await this.$api.COMPANY_INFO()
      if (res.status === 1) {
        this.data = res.data
      }
    }
  },
  activated() {
    this.getSmsNum()
    this.getinfo()
  }
}
</script>

<style  lang="less">
// .cb_store-box {
//   display: flex;
//   .cb_store-info {

//     flex: 1;
//   }
//   .cb_store-icon-box {
//     padding: 0 9px 0 0;
//     .cb_store-icon {
//       width: 54px;
//       height: 54px;
//       background: #f8f8f8;
//       border-radius: 50%;
//       text-align: center;
//       line-height: 54px;
//       overflow: hidden;
//       .icon {
//         font-size: 28px;
//         color: #e8e8e8 !important;
//       }
//     }
//   }
// }
.companyBox {
  .cb-cell-group-border:after{
    background-image: none;
  }
  .topQyBox {
     .c_cell_wrapper{
       height: 80px;
       border: none;
     }
    .c_cell_wrapper:after {
      border: none;
      background: none !important;
    }
    .c_cell_wrapper {
      box-sizing: border-box;
      .c_cell {
        padding-top: 14px;
        padding-bottom: 14px;
        background-image: none;
      }
    }
    .code{
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
    .managerPhone{
      font-size: 12px;
      color: #666;
    }

  }
  // 
  .cb_store-box {
    display: flex;
    .cb_store-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
    }
    .cb_store-icon-box {
      padding: 0 9px 0 0;
      .cb_store-icon {
        width: 54px;
        height: 54px;
        background: #f8f8f8;
        border-radius: 50%;
        text-align: center;
        line-height: 54px;
        overflow: hidden;
        .icon {
          font-size: 28px;
          color: #e8e8e8 !important;
        }
      }
    }
  }

}
</style>