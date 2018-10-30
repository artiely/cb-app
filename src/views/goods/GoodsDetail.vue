<template>
  <div>
    <v-header :title="gasType=='1'?'商品详情':'服务详情'" righttext="编辑" @right-click="editDetail"></v-header>
    <v-scroll-page top="44" style="overflow-y:scroll">
      <v-br height="20"></v-br>
    
    <!-- <div class="c-scroll-wrapper-top"> -->
      <!-- <cube-scroll :data="data"> -->
        <div class="goods-detail-name" v-if="data">{{data.name}}
          <v-badge v-if="data.status==1" class="success" size="small">在售</v-badge>
          <v-badge v-else class="danger" size="small">停售</v-badge>
        </div>
        <v-cell-group v-if="data" class="GoodsDetailList">
          <v-cell title="销售状态">
            <div slot="right" class="right-slot">
              <van-switch v-model="checked" @input="onInput" />
            </div>
          </v-cell>
          <v-cell title="类目" :text="data.serverCategory.name" v-if="data&&data.serverCategory"></v-cell>
          <v-cell title="类目" :text="data.goodsCategory.name" v-else></v-cell>
          <v-cell title="编码" :text="data.code"></v-cell>
          <v-cell title="单位" :text="data.unit" v-if="data.unit"></v-cell>
          <v-cell title="单位" text="次" v-else></v-cell>
          <v-cell title="备注" class="nobg" :text="data.remarks" wrap></v-cell>
        </v-cell-group>

        <v-cell-group class="GoodsDetailList GoodsDetailListSf">
          <v-cell v-for="item in skus" :key="item.id" link @click.native="specificationDetail(item)">
            <div slot="left" class="left-slot">
              {{item.name}}
              <!-- <v-badge v-if="item.status==1" class="success" size="small">在售</v-badge>
              <v-badge v-else class="danger" size="small">停售</v-badge> -->
            </div>
            <div slot="right" class="right-slot">
              {{item.price|currency()}}
            </div>
          </v-cell>
        </v-cell-group>
        <!-- <button class="del-btn del-btn-new" @click="delGoods">
          <span>删除</span>
        </button> -->
      <!-- </cube-scroll> -->
    <!-- </div> -->
    </v-scroll-page>
    <van-popup v-model="specificationShow" style="width:100%;height:100%;background:#f0f0f0;" position="right" :overlay="true">
      <v-header :title="isGoods == 'true'?'商品规格':'服务规格'" :left-click="hideSku"></v-header>
      <v-cell-group class="GoodsDetailList" style="margin-top:43px">
        <v-cell title="商品规格" required :text="specificationData ? specificationData.name : ''" v-if="isGoods == 'true'"></v-cell>
        <v-cell title="服务规格" required :text="specificationData ? specificationData.name : ''" v-else></v-cell>
        <v-cell title="销售单价" required :text="specificationData ? specificationData.price : ''| currency()"></v-cell>
        <v-cell title="条形码" :text="specificationData ? specificationData.code : ''" v-if="isGoods == 'true'"></v-cell>
        <v-cell title="零件码" :text="specificationData ? specificationData.partCode : ''" v-if="isGoods == 'true'"></v-cell>
      </v-cell-group>
      <!-- <v-cell-group class="GoodsDetailList">
        <v-cell title="备注" :text="specificationData ? specificationData.remarks : ''"></v-cell>
      </v-cell-group> -->
      <span v-if="specificationData.remarks">
      <v-remark v-model="specificationData.remarks" disabled></v-remark></span>
      <!-- <button class="del-btn del-btn-new" @click="delSpecification()" v-if="this.skus.length != 1">
        <span>删除</span>
      </button> -->
    </van-popup>

  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: false,
      specificationShow: false,
      specificationData: {},
      id: '',
      data: '',
      gasType: '',
      skus: []
    }
  },
  computed: {
    goodsUnitMap() {
      return this.$store.state.order.goodsUnitMap
    }
  },
  methods: {
    editDetail() {
      this.$router.push({
        name: 'AddGoods',
        query: { gasType: this.gasType, id: this.id }
      })
    },
    specificationDetail(data) {
      this.specificationData = data
      this.specificationShow = true
    },
    hideSku() {
      this.specificationShow = false
    },
    async getData(update) {
      if (this.gasType === '1') {
        let res = await this.$api.GOODS_DETAIL({
          id: this.id
        })
        if (res.status === 1) {
          this.data = res.data
          this.skus = res.data.goodsSkus
          this.specificationData = res.data.goodsSkus[0]
          this.checked = res.data.status === '1'
          if (update) {
            if (this.checked) {
              this.$toast.success('已上架')
            } else {
              this.$toast.success('已下架')
            }
          }
        } else {
          console.error('获取详情失败')
        }
      } else {
        let res = await this.$api.SERVICE_DETAIL({
          id: this.id
        })
        if (res.status === 1) {
          this.data = res.data
          this.skus = res.data.serverSkus
          this.specificationData = res.data.serverSkus[0]
          this.checked = res.data.status === '1'
          if (update) {
            if (this.checked) {
              this.$toast.success('已上架')
            } else {
              this.$toast.success('已下架')
            }
          }
        } else {
          console.error('获取详情失败')
        }
      }
    },
    // delGoods() {
    //   this.$dialog
    //     .confirm({
    //       title: '确定删除吗？',
    //       message: '删除后将无法恢复。'
    //     })
    //     .then(() => {
    //       // on confirm
    //       this.del()
    //     })
    //     .catch(() => {
    //       // on cancel
    //     })
    // },
    // async del() {
    //   let res = null
    //   if (this.gasType === '2') {
    //     res = await this.$api.SERVER_DEL({ id: this.id })
    //   } else {
    //     res = await this.$api.GOODS_DEL({ id: this.id })
    //   }
    //   if (res.status === 1) {
    //     this.$toast.success('删除成功')
    //     this.$router.replace({ name: 'ServiceAdd', params: { refresh: true } })
    //   }
    // },
    async upDown(checked) {
      let res = null
      if (this.gasType === '2') {
        res = await this.$api.SERVER_UP_DOWN({ id: this.id })
      } else {
        res = await this.$api.GOODS_UP_DOWN({ id: this.id })
      }
      if (res.status === 1) {
        this.getData(true)
      } else {
        this.checked = !checked
      }
    },
    onInput(checked) {
      if (!checked) {
        this.$dialog
          .confirm({
            title: '确定下架吗？',
            message: '下架后，该商品在开单等操作时将不可见。'
          })
          .then(() => {
            // on confirm
            this.upDown(checked)
          })
          .catch(() => {
            // on cancel
            this.checked = !this.checked
          })
      } else {
        this.upDown(checked)
      }
    },
    async delSpecificationDate() {
      let res = null
      if (this.gasType === '2') {
        res = await this.$api.SERVER_SKU_DEL({ id: this.specificationData.id })
      } else {
        res = await this.$api.GOODS_SKU_DEL({ id: this.specificationData.id })
      }
      if (res.status === 1) {
        this.$toast.success('已删除')
        this.$router.replace('/serviceadd')
      }
    },
    delSpecification() {
      this.$dialog
        .confirm({
          title: '确定删除吗？',
          message: '删除后，该商品将无法恢复。',
          confirmButtonText: '确定'
        })
        .then(() => {
          // on confirm
          this.delSpecificationDate()
        })
        .catch(() => {
          // on cancel
        })
    }
  },
  activated() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.gasType = this.$route.query.gasType
      this.getData()
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
.goods-service--detail {
  width: 100%;
  background: #ffffff;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  padding: 5px 15px;
  tr {
    td {
      &:nth-of-type(1) {
        padding: 5px 5px 5px 15px;
        text-align: left;
        width: 70px;
      }
      &:nth-of-type(2) {
        padding: 5px 15px 5px 5px;
        text-align: right;
        color: @secondary-text;
      }
    }
  }
}
.goods-detail-name {
  font-size: 15px;
  color: #333;
  padding: 15px;
  line-height: 1.5;
  font-weight: 700;
  background: #fff;
}
.c-sku-box {
  .c-sku-title {
    height: 30px;
    line-height: 30px;
    padding: 0 15px;
    font-size: 14px;
    background: #f8f8f8;
  }
  .sku-item-info {
    padding: 4px 10px;
    background: #ffffff;
    font-size: 13px;
    color: @secondary-text;
    line-height: 1.2;
  }
}
.GoodsDetailList {
  .c_cell {
    .right-slot {
      text-align: right !important;
      .van-switch {
        margin-top: 13px;
        width: 40px;
        height: 20px;
        .van-switch__node {
          width: 20px;
          height: 20px;
        }
      }
    }
    .text {
      text-align: right !important;
    }
  }
}
.GoodsDetailListSf {
  .text {
    display: none !important;
  }
}
.del-btn-new {
  width: 80%;
  margin-left: 10%;
}
.nobg {
  border-bottom: 1px solid #e8e8e8 !important;
  .c_cell {
    background: none;
  }
}
.GoodsDetailList:after {
  background: none !important;
  border-top: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}
</style>
