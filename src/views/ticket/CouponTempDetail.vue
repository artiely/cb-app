<template>
  <div>
    <v-header title="详情"></v-header>
    <v-scroll-page top="44" style="overflow-y:scroll" v-if="data">
      <div style="padding:10px">
        <div style="background:#fff;border-radius:10px;padding:10px">
          <p style="font-size:18px;font-weight:500">{{data.name}}</p>
          <p>
            <v-badge type="通用券" v-if="data.type==1">通用券</v-badge>
            <v-badge type="礼品券" v-else>礼品券</v-badge>
          </p>
        </div>
        <v-cell-group style="border-radius:10px">
          <!-- <v-cell title="券种" :text="data.type==1?'代金券':'礼品券'"></v-cell> -->
          <!-- <v-cell title="券名" :text="data.name"></v-cell> -->
          <v-cell v-if="data.type==1" title="面值" :text="data.moneyReduce|currency('￥')"></v-cell>
          <v-cell v-if="data.type==2" title="面值" :text="data.moneyGift|currency('￥')"></v-cell>
          <v-cell title="启用状态">
            <div slot="right" class="right-slot">
              <van-switch v-model="checked" @input="upDown" />
            </div>
          </v-cell>
        </v-cell-group>
        <!-- 礼品s -->

        <div class="cb_detail_box">
          <div class="clearfix cb_detail_item">
            <div class="fl">使用门槛</div>
            <div class="fr">{{'满 '+data.moneyCondition+' 可用'}}</div>
          </div>
          <div class="clearfix cb_detail_item">
            <div class="fl">没人限领</div>
            <div class="fr">{{data.restrictNum+' 张'}}</div>
          </div>
          <div class="clearfix cb_detail_item" v-if="data.restrictTimeType==2">
            <div class="fl">有效期至</div>
            <div class="fr">{{'自领取起' +data.restrictDays+ ' 天'}}</div>
          </div>
          <div class="clearfix cb_detail_item" v-if="data.restrictTimeType==1">
            <div class="fl">有效期至</div>
            <div class="fr">{{data.restrictDateStart|timeFormat('YYYY.MM.DD')}} ~ {{data.restrictDateEnd|timeFormat('YYYY.MM.DD')}}</div>
          </div>
          <div class="clearfix cb_detail_item">
            <div class="fl">使用时间</div>
            <div class="fr">{{data.restrictWeek}}</div>
          </div>
          <div class="clearfix cb_detail_item" @click="changeNOShow=true">
            <div class="fl">发行数量</div>
            <div class="fr">{{data.numPublish?data.numPublish+' 张':'无限量'}}
              <v-icon name="icon-lujing1" color="#1690ff"></v-icon>
            </div>
          </div>
        </div>
        <p style="font-size:14px;color:#666;padding:10px 0 20px 0">更改发行数量只能增加不能减少，请谨慎设置。</p>

        <div class="cb_detail_box">
          <div class="clearfix cb_detail_item">
            <div class="fl">使用说明</div>
            <div class="fr">{{data.descriptionUse}}</div>
          </div>
        </div>
      </div>
      <v-remark v-model="data.remarks" disabled></v-remark>
      <div @click="toDetail" style="text-align:center;font-size:14px;color:#1690ff">
        <div class="cb_popup_preview">
          <v-icon name="icon-xiaotubiao-17"></v-icon>
        </div>
        预览</div>
      <!--     <div v-if="data.type==2">
            <v-cell title="礼品价值" :text="data.moneyGift|currency('￥')"></v-cell>
          </div>
          </v-cell-group>
          <v-cell-group>
          <v-cell title="发行数量" :text="data.numPublish?data.numPublish+'张':'无限量'"></v-cell>
          <v-cell title="查看领用记录" link @click.native="toReceive" :text="data.numReceive+'份'"></v-cell>
          </v-cell-group>
          <v-cell-group>
          <v-cell title="使用门槛" :text="'满'+data.moneyCondition+'可用'"></v-cell>
          <v-cell title="每人限领" :text="data.restrictNum+'张'"></v-cell>
         </v-cell-group>
         <v-cell-group>
          <v-cell title="有效期至" :text="data.endUsableDate|timeFormat('YYYY-MM-DD')"></v-cell>
          <v-cell title="使用时间" :text="data.restrictWeek"></v-cell>
          </v-cell-group>
         <v-cell-group>
          <v-cell title="使用说明" :text="data.descriptionUse" wrap></v-cell>
          <v-cell title="备注" :text="data.remarks" :maxlength="200" wrap></v-cell>
          </v-cell-group>
          <p class="c-store--adtit">店铺宣传信息</p>
          <div class="c-store--adimg clearfix">
            <div class="c-store--adimg--box" v-if="!data.storeImg">
            </div>
            <img v-else :src="'https://static-oss-chebian.oss-cn-beijing.aliyuncs.com/public/'+data.storeImg" alt="店铺宣传图">
          </div>
          <v-cell-group>
          <v-cell title="店铺介绍" :text="data.descriptionStore"></v-cell>
          </v-cell-group> -->

    </v-scroll-page>
    <van-dialog class="dialog-price" style="padding:0" v-model="changeNOShow" @confirm="updatePubNum" :showCancelButton="true" confirmButtonText="确定">
      <div class="dialog-price--title">
        发行数量
      </div>
      <input type="number" v-model="pubNum" class="dialog-input" placeholder="请输入">
    </van-dialog>
    <v-coupon-preview v-model="previewShow" :data="data" :storeInfo="storeInfo"></v-coupon-preview>
  </div>
</template>

<script>
import VCouponPreview from './CouponDetail'
export default {
  components: {
    VCouponPreview
  },
  data() {
    return {
      data: '',
      changeNOShow: false,
      previewShow: false,
      pubNum: '',
      checked: '',
      id: '',
      storeInfo: ''
    }
  },
  methods: {
    async getData() {
      let res = await this.$api.COUPON_TEMP_DETAIL({ id: this.id })
      if (res.status === 1) {
        this.data = res.data
        console.log('-----' + this.data)
        this.checked = res.data.status === '1'
      } else {
        console.error('获取详情失败')
      }
    },
    async getStoreInfo() {
      let res = await this.$api.STORE_INFO()
      if (res.status === 1) {
        this.storeInfo = res.data
      }
    },
    async upDown() {
      let res = await this.$api.UPDATE_COUPON_STATUS({ id: this.id })
      if (res.status === 1) {
        this.getData()
      }
    },
    async updatePubNum() {
      if (this.pubNum <= this.data.numPublish) {
        this.$toast('更改发行数量只能增加不能减少。')
        return
      }
      let res = await this.$api.UPDATE_COUPON_PUB_NUN({
        id: this.id,
        numPublish: this.pubNum
      })
      if (res.status === 1) {
        this.$toast.success('更新成功')
        this.getData()
      }
    },
    toDetail() {
      this.previewShow = true
    },
    toReceive() {
      // TIP:去那个领取记录带过去id和name
      if (this.data.numReceive === 0) {
        this.$toast.fail('无领用记录')
        return
      }
      this.$router.push({
        name: 'CouponReceive',
        params: {
          temp: { name: this.data.name, id: this.data.id }
        }
      })
    }
  },
  activated() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getData()
    }
    this.getStoreInfo()
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';
.cb_popup_preview {
  height: 40px;
  width: 40px;
  background: #1690ff;
  border-radius: 50%;
  text-align: center;
  line-height: 40px;
  margin: 10px auto;
  .icon {
    color: #fff !important;
    font-size: 26px;
  }
}
.cb_detail_box {
  background: #fff;
  border-radius: 10px;
  padding: 10px;
  .cb_detail_item {
    line-height: 1.8;
    font-size: 16px;
    .fl {
      color: #666;
    }
    .fr {
      color: #333;
    }
  }
}
.store-info-box {
  width: 100%;
  padding: 20px;
  .store-icon-box {
    height: 30px;
    width: 60px;
    float: left;
    .store-icon {
      height: 30px;
      width: 30px;
      border-radius: 50%;
      background: #eeeeee;
    }
  }
  .store-info {
    width: 100%;
    float: right;
    margin-left: -60px;
    padding-left: 60px;
    color: #ffffff;
    font-weight: 600;
  }
}
.c-store--adtit {
  padding: 5px 15px;
  color: #666;
  font-size: 12px;
}
.c-store--adimg {
  background: #ffffff;
  width: auto;
  height: 200px;
  padding: 20px 15px;
  > img {
    height: 100%;
  }
  &--box {
    width: 80px;
    height: 80px;
    float: right;
    background: #eee;
    object-fit: cover;
    overflow: hidden;
    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  > img {
    width: 100%;
    object-fit: cover;
  }
}
.c-coupon--preview {
  padding-top: 40px;
  background: #ffffff;
  &--card {
    position: relative;
    height: 310px;
    width: 100%;
    background: #d1375d;
    .dot-box {
      position: absolute;
      bottom: -7px;
      left: 0;
      height: 15px;
      overflow: hidden;
      .dot {
        width: 15px;
        height: 15px;
        display: inline-block;
        background: #d1375d;
        border-radius: 50%;
      }
    }
  }
  .c-store-coupon--money {
    padding-top: 40px;
    font-size: 60px;
    color: #ffffff;
    text-align: center;
    small {
      font-size: 18px;
      font-weight: 600;
      padding-right: 10px;
    }
  }
  .c-store-coupon--name {
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
    text-align: center;
    line-height: 50px;
  }
  .c-store-coupon--time {
    font-size: 12px;
    color: #f8f8f8;
    text-align: center;
    line-height: 40px;
  }
  .c-store-coupon--code {
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    text-align: center;
    line-height: 50px;
  }
}
.c-store-coupon--feature {
  padding: 30px 20px;
  font-size: 14px;
  line-height: 2;
  .icon {
    color: #d1375d !important;
    font-size: 8px;
  }
}
.c-store--img {
  width: 100%;
  display: inline-block;
}
.c-store--name {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  color: @primary-text;
  line-height: 40px;
}
.c-store--desc {
  padding: 10px;
  color: 14px;
  line-height: 1.5;
  color: @secondary-text;
}
.c-store--info {
  height: 50px;
  font-size: 14px;
  .borderT(@dividers);
  padding: 6px 10px;
  line-height: 1.1;
}
</style>
