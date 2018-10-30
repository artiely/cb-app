<template>
  <!-- 新增客户 -->
  <div class="active-info">
    <v-header title="详情" :border="true" :left-click="toBack">
      <div slot="righttext" @click="toNewChargeActive()">编辑</div>
    </v-header>
    <div class="c-scroll-wrapper-top">
      <cube-scroll :data="data">
        <v-br :height="20"></v-br>
        <v-cell-group class="topList">
          <v-cell wrap>
            <div slot="text">
              <div class="title clearfix">
                <span class="fl" style="font-size:18px;color:#333;font-weight:500">
                  <!-- <span v-if="data.cardType==2">[{{data.discount*10}}折]</span> -->
                  {{data.name}}
                  <div>
                    <v-badge class="fl" v-if="data.cardType==2" type="折扣卡">折扣卡</v-badge>
                    <v-badge class="fl" v-if="data.cardType==3" type="次卡">次卡</v-badge>
                  </div>
                </span>
                <span class="fr" style="font-size:18px;color:#d73962;font-weight:500">
                  <div>{{data.money|currency()}}</div>
                  <!-- <div class="originalPrice">{{data.money|currency()}}</div> -->
                  <div v-if="data.cardType==3" style="font-size:12px;color:#999;text-decoration: line-through;text-align:right">
                    <!-- <div>{{data.moneySrc|currency()}}</div> -->
                    <div>{{moneySrcOri|currency()}}</div>
                  </div>
                </span>
              </div>
            </div>
          </v-cell>
        </v-cell-group>
        <div class="towList">
          <v-cell-group class="active-info">
            <v-cell v-if="data.cardType==2" title="折扣" :text="data.discount*10+'折'"></v-cell>
            <v-cell title="有效期" v-if="data.durationType==2&&data.durationDays!==''" :text="`自办理起 ${data.durationDays} 天有效`"></v-cell>
            <v-cell title="有效期" v-else text="永久有效"></v-cell>
            <v-cell title="启用状态">
              <div slot="right" class="right-slot">
                <van-switch v-model="checked" @input="upDown" />
              </div>
            </v-cell>
          </v-cell-group>
        </div>

        <p style="font-size:12px;color:#999;padding:20px 0 10px 15px;">用卡范围</p>
        <div class="threeList">
          <v-cell-group v-if="data.scopeType==1">
            <v-cell title="全场通用"></v-cell>
          </v-cell-group>
        </div>

        <div class="fourList" v-if="data.scopeType==2">
          <v-cell-group v-for="item in data.transactItems" :key="item.id">
            <v-cell wrap>
              <div slot="text">
                <div class="titleBox">
                  <div class="leftNr">
                    <span style="font-size:18px;color:#666">{{item.gasName}}</span>
                    <v-badge type="商" size="small" v-if="item.gasType==1">商</v-badge>
                    <v-badge size="small" type="服" v-if="item.gasType==2">服</v-badge>
                  </div>
                  <span class="fr" v-if="data.cardType==3">
                    <span v-if="item.num">{{item.num}}次</span>
                    <span v-else>不限次</span>
                  </span>
                </div>
                <div style="padding-top:3px;color:#333333;font-size: 16px;">{{item.gasSkuName}}
                  <!-- <span class="fr" v-if="data.cardType==3">
                    <span v-if="item.num">{{item.num}}次</span>
                    <span v-else>不限次</span>
                  </span> -->
                </div>
              </div>
            </v-cell>
          </v-cell-group>

          <!-- <v-cell-group  v-for="item in data.transactItems" :key="item.id">
              <v-cell wrap >
                <div slot="text">
                  <div>
                    <span style="font-size:18px;color:#666">{{item.gasName}}</span>
                    <v-badge type="商" size="small" v-if="item.gasType==1">商</v-badge>
                    <v-badge size="small" type="服" v-if="item.gasType==2">服</v-badge>
                  </div>
                  <div style="padding-left:15px;padding-top:5px;color:#666">{{item.gasSkuName}}
                    <span class="fr" v-if="data.cardType==3">
                      <span v-if="item.num">{{item.num}}次</span>
                      <span v-else>不限次</span>
                    </span>
                  </div>
                </div>
              </v-cell>
          </v-cell-group> -->

        </div>

        <!-- <v-cell-group>
          <v-cell title="备注" :text="data.remarks" wrap></v-cell>
        </v-cell-group> -->
        <v-br height="5"></v-br>
        <v-remark v-model="data.remarks" disabled v-if="data.remarks"></v-remark>
      </cube-scroll>
    </div>
    <!-- <v-footer v-if="data.isActive!=0">
      <v-footer-item @click.native="toCard">办卡</v-footer-item>
    </v-footer> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: true,
      data: {},
      id: '',
      moneySrcOri: 0 // 没打折时的原价
    }
  },
  methods: {
    toBack() {
      this.$router.replace('/cardlist')
    },
    toCard() {
      if (this.data.isActive === '0') {
        return
      }
      this.$router.replace({ name: 'ChargeTicket', query: { id: this.id } })
    },
    async upDown() {
      await this.$api.CHARGE_ACTIVE_SWITCH({ id: this.id })
      this.getData(true)
    },
    toNewChargeActive() {
      this.$router.push({ name: 'AddNewCard', query: { id: this.id } })
      this.$store.commit('CLEAR_SKU_CARD')
    },
    async getData(update) {
      let res = await this.$api.CHARGE_ACTIVE_DETAIL({ id: this.id })
      if (res.status === 1) {
        if (res.data.isActive === '0') {
          this.checked = false
          if (update === true) {
            this.$toast.success('已停用')
          }
        } else {
          this.checked = true
          if (update === true) {
            this.$toast.success('已启用')
          }
        }
        console.log('打印内容 =', res)
        this.data = res.data
        if (this.data.cardType === '3') {
          this.moneySrcOri = this.data.moneySrc
        }
      } else {
        console.error(`获取列表失败${res.stateMessage}`)
      }
    }
  },
  activated() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
    }
    this.getData()
  }
}
</script>

<style lang="less">
.active-info {
  .c_cell_wrapper {
    min-height: 45px;
  }


  // 去掉列表框的上下线条
  .cb-cell-group-border:after {
    background-image: none;
  }
  .originalPrice {
    text-decoration: line-through;
    color: #999999;
    font-size: 12px;
    text-align: right;
  }
  .topList {
    margin: 0 8px;
    border-radius: 10px;
    margin-bottom: -2px;
    .c_cell_wrapper:last-child .c_cell {
      background-image: none;
    }
  }
  .towList {
    margin: 2px 8px 0;
    border-radius: 10px;
    overflow: hidden;
    background-color: #fff;
    .active-info .c_cell_wrapper {
      min-height: 40px;
      height: 42px;
      line-height: 42px;
      .c_cell {
        height: 40px;
        line-height: 40px;
      }
    }
    .c_cell_wrapper:last-child .c_cell {
      background-image: none;
    }
  }
  .cb-cell-group {
    margin-bottom: 0;
  }
  .threeList {
    margin: 2px 8px 0;
    border-radius: 10px;
    overflow: hidden;
    // border: 1px solid #000;
    background-color: #fff;
    .cb-cell-group-border {
      height: 60px;
      .c_cell_wrapper {
        height: 60px;
        line-height: 60px;
        .c_cell {
          height: 60px;
          line-height: 60px;
        }
      }
      .c_cell_wrapper:last-child .c_cell {
        background-image: none;
      }
    }
  }
  .fourList {
    margin: 2px 8px 0;
    border-radius: 10px;
    overflow: hidden;
    // border: 1px solid #000;
    background-color: #e8e8e8;
    .cb-cell-group {
      margin-bottom: 0;
      margin-bottom: 10px;
      border-radius: 10px;
      height: 60px;
      padding: 10px 12px;
      box-sizing: border-box;
      .c_cell_wrapper {
        padding-left: 0;
      }
      .c_cell {
        padding: 0;
        background-image: none;
      }
      .titleBox {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 20px;
        line-height: 20px;
        .c_badge--wrapper.small {
          height: 14px;
          line-height: 14px;
          font-size: 8px;
          padding: 0 2px;
          margin-left: 6px;
        }
        .leftNr {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}

.outline {
  border: 1px solid #d73962 !important;
}
.outline:active {
  color: #fff !important;
  background: #d73962 !important;
}
</style>
