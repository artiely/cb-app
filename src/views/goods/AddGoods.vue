<template>
  <div class="AddGoodsBox">
    <v-header :title="isGoods?'商品信息':'服务信息'" righttext="保存" @right-click="submitNewGood"></v-header>
    <v-scroll-page top="44" style="overflow-y:scroll">
      <!-- <div class="c-scroll-wrapper-top-bottom">
      <cube-scroll> -->
      <div>
        <v-cell-group>
          <v-cell title="类目" :text="currentCate.name" @right-click="cateSelect" link></v-cell>
        </v-cell-group>
        <v-cell-group style="margin-bottom:5px;">
          <v-cell :title="isGoods?'商品名称':'服务名称'" required :input="true" :class="{textRight: this.$route.query.id}" v-model="name" :maxlength="15"></v-cell>
          <v-cell title="编码" :input="true" v-model="code" :class="{textRight: this.$route.query.id}" :maxlength="20"></v-cell>
          <v-cell title="品牌" v-if="isGoods" :text="currentBrand.name" @right-click="brandSelect" link></v-cell>
          <v-cell title="单位" v-if="isGoods" required :text="currentUnit.name" @right-click="unitSelect" link></v-cell>
          <v-cell title="单位" v-if="!isGoods" :class="{textRight1: this.$route.query.id}" text="次"></v-cell>
        </v-cell-group>
        <div style="margin-bottom:10px">
          <v-remark v-model="remarks"></v-remark>
        </div>

        <v-cell-group class="GoodsDetailList GoodsDetailListSf" style="margin-bottom:0">
          <v-cell v-for="(sku,index) in skubox" :key="sku.id" link @click.native="specificationDetail(index,sku)">
            <div slot="left" class="left-slot">
              {{sku.name}}
            </div>
            <div slot="right" class="right-slot">
              {{sku.price|currency()}}
            </div>
          </v-cell>
        </v-cell-group>

        <v-cell title="" class="nobg" style="border: none;">
          <div class="newAddspecification" @click="addNewSku('newSkuCode')">
            <v-icon name="icon-add_bg"></v-icon>
            <span class="addStandard">添加规格</span>
          </div>
        </v-cell>
        <button class="del-btn del-btn-new" @click="delGoods" v-if="id">
          <span>删除</span>
        </button>
        <!-- <div class="sku-add-box" v-for="(sku,index) in skubox" :key="sku.id">
            <v-cell title="规格" required :input="true" v-model="sku.name" :maxlength="20"></v-cell>
            <v-cell title="销售单价" required :input="true" type="number" v-model="sku.price"></v-cell>
            <v-cell title="销售提成" :input="true" type="number" v-model="sku.percentSale"></v-cell>
            <v-cell title="施工提成" :input="true" type="number" v-model="sku.percentDeal"></v-cell>
            <v-cell title="条形码" :input="true" v-if="isGoods" v-model="sku.code"></v-cell>
            <v-cell title="零件吗" :input="true" v-if="isGoods" v-model="sku.partCode"></v-cell>
            <v-cell title="备注" :input="true" v-model="sku.remarks" :maxlength="200"></v-cell>
            <div class="sku-del-cell" v-if="index!==0">
              <div class="sku-del-cell-btn" @click="delSku(index)">
                <v-icon name="icon-shanchu2"></v-icon> 删除规格</div>
            </div>
          </div>
          <div @click="addNewSku" class="add-newsku">+ 新增规格</div> -->
      </div>
      <!-- </cube-scroll>
    </div> -->
    </v-scroll-page>
    <!-- 规格 -->
    <van-popup v-model="specificationShow" style="width:100%;height:100%;background:#f0f0f0;" position="right" :overlay="true">
      <v-header :title="isGoods ? '商品规格':'服务规格'" :left-click="hideSku" righttext="确定" @right-click="saveSpecification" lefttext="取消"></v-header>
      <v-cell-group class="GoodsDetailList" style="margin-top:43px">
        <v-cell title="商品规格" required :input="true" :maxlength="15" v-model="skulist.name" v-if="isGoods" placeholder="型号、容量、尺寸、颜色等"></v-cell>
        <v-cell title="服务规格" required :input="true" v-model="skulist.name" v-else placeholder="服务类型、方式、适用对象等"></v-cell>
        <v-cell title="销售单价" required :input="true" v-model="skulist.price" type="number"></v-cell>
        <v-cell title="条形码" :input="true" v-model="skulist.code" v-if="isGoods"></v-cell>
        <v-cell title="零件码" :input="true" v-model="skulist.partCode" v-if="isGoods"></v-cell>
      </v-cell-group>
      <v-remark v-model="skulist.remarks"></v-remark>

      <button class="del-btn del-btn-new" @click="delGoodSku" v-if="skubox.length !== 1&&id">
        <span>删除</span>
      </button>
    </van-popup>
    <!-- 类目 -->
    <van-popup v-model="cateVisible" style="height:80%;width:100%" position="bottom">
      <v-popup-title title="请选择类目" @close="cateVisible=false"></v-popup-title>
      <!-- <div class="clearfix" style="height:40px">
        <v-icon name="icon-shanchu1" class="cancel-right fr" @click.native="cateVisible=false"></v-icon>
      </div> -->
      <!-- <div class="c_cate_card">
        <div class="c_cate_card_body">
          <div class="c_cate_card_body_item" v-for="v in category" @click="hanleChoiceCate(v)" :key="v.id">
            <div class="sm_btn" :class="currentCate.id==v.id?'active':''">{{v.name}}</div>
          </div>
        </div>
      </div> -->
      <van-picker :columns="columns" :visible-item-count="8" @change="onChange" />
      <div class="fixed_btn">
        <!-- <div class="fixed_btn_item footer-white" @click="resetCate">重置</div> -->
        <div class="fixed_btn_item" @click="cateVisible=false">确定</div>
      </div>
    </van-popup>
    <!-- 品牌 -->
    <van-popup v-model="brandVisible" style="height:100%;width:100%" position="right">
      <!-- <div class="clearfix" style="height:40px">
        <v-icon name="icon-shanchu1" class="cancel-right fr" @click.native="brandVisible=false"></v-icon>
      </div> -->
      <v-header title="品牌" righttext="确定" @right-click="brandSave"></v-header>
      <!-- <div class="c_cate_card">
        <div class="c_cate_card_body">
          <div class="c_cate_card_body_item" v-for="v in brand" @click="hanleChoiceBrand(v)" :key="v.id">
            <div class="sm_btn" :class="currentBrand.id==v.id?'active':''">{{v.name}}</div>
          </div>
        </div>
      </div> -->
      <v-scroll-page top="44" style="overflow-y:scroll">
        <v-br height="20"></v-br>
        <v-cell-group style="margin-bottom:0">
          <v-cell input placeholder="请输入品牌名称" v-model="brandName"></v-cell>
        </v-cell-group>
        <v-badge class="customTag" color="#e6bd81" v-for="item in brand" :key="item.id" @click.native="hanleChoiceBrand(item)">{{item.name}}</v-badge>
      </v-scroll-page>
      <!-- <div class="fixed_btn">
        <div class="fixed_btn_item deep" @click="resetBrand">重置</div>
        <div class="fixed_btn_item" @click="brandVisible=false">确定</div>
      </div> -->
    </van-popup>
    <!-- 单位 -->
    <van-popup v-model="unitVisible" style="height:100%;width:80%" position="right">
      <div class="clearfix" style="height:40px">
        <v-icon name="icon-shanchu1" class="cancel-right fr" @click.native="unitVisible=false"></v-icon>
      </div>
      <div class="c_cate_card">
        <div class="c_cate_card_body">
          <div class="c_cate_card_body_item" v-for="(v,i) in goodsUnitMap" :key="i" @click="hanleChoiceUnit(v)">
            <div class="sm_btn" :class="currentUnit.id==v.id?'active':''">{{v.name}}</div>
          </div>
        </div>
      </div>
      <div class="fixed_btn">
        <div class="fixed_btn_item footer-white" @click="resetUnit">重置</div>
        <div class="fixed_btn_item" @click="unitVisible=false">确定</div>
      </div>
    </van-popup>
    <!-- <div class="fixed_btn" @click="submitNewGood">
      <div class="fixed_btn_item">确定</div>
    </div> -->

  </div>
</template>

<script>
export default {
  name: 'AddGoods',
  data() {
    return {
      skubox: [
        // {
        //   name: '',
        //   price: '',
        //   percentSale: '',
        //   percentDeal: '',
        //   code: '',
        //   partCode: '',
        //   remarks: ''
        // }
      ],
      brandName: '',
      skulist: {
        name: '',
        price: '',
        percentSale: '',
        percentDeal: '',
        code: '',
        partCode: '',
        remarks: '',
        isDel: 0,
        delFlag: 0
      },
      query: {
        'searchParameter.keyWord': '',
        pageNo: 1,
        pageSize: 100
      },
      id: '',
      indexList: 0,
      newSkuCode: '',
      specificationShow: false,
      specificationData: null,
      cateVisible: false,
      brandVisible: false,
      unitVisible: false,
      isGoods: false,
      goodsCategory: [],
      serviceCategory: [],
      brand: [],
      currentCate: { name: '', id: null },
      currentBrand: { name: '', id: null },
      currentUnit: { name: '', id: null },
      skuName: '', // 商品规格名称
      summary: '', // 商品简介
      remarks: '', // 备注
      code: '', // 商品编码
      name: '', // 商品规格名称
      price: 0, // 商品规格销售价
      percentSale: 0, // 商品规格销售提成
      src: '',
      timer: null,
      percentDeal: 0 // 商品规格施工提成
    }
  },
  watch: {
    isGoods: {
      handler(val) {
        if (!this.isGoods) {
          this.currentUnit = { name: '次', id: '次' }
        } else {
          this.currentUnit = { name: '', id: null }
        }
      },
      deep: true,
      immediate: true
    },
    brandName: {
      handler(val) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.query['searchParameter.keyWord'] = val
          this.getBrand()
        }, 500)
      }
    }
  },
  computed: {
    goodsUnitMap() {
      return this.$store.state.order.goodsUnitMap
    },
    columns() {
      this.category.unshift({ name: '请选择', id: '' })
      let columns1 = this.category.map(v => {
        return v.name
      })
      // columns1.unshift('请选择')
      let columns2 = []
      if (this.category.length !== 0) {
        let cc = this.category[0].subCategorys
        if (cc) {
          columns2 = cc.map(v => {
            return v.name
          })
        }
      }
      return [
        {
          values: columns1,
          defaultIndex: 0
        },
        {
          values: columns2,
          defaultIndex: 0
        }
      ]
    },
    category() {
      if (this.isGoods) {
        return this.goodsCategory
      } else {
        return this.serviceCategory
      }
    }
  },
  methods: {
    delGoods() {
      this.$dialog
        .confirm({
          title: '确定删除吗？',
          message: '删除后将无法恢复。'
        })
        .then(() => {
          // on confirm
          this.del()
        })
        .catch(() => {
          // on cancel
        })
    },
    onChange(picker, values) {
      let indexs = picker.getIndexes()
      if (this.category[indexs[0]] && this.category[indexs[0]].subCategorys) {
        let c = this.category[indexs[0]].subCategorys.map(v => {
          return v.name
        })
        picker.setColumnValues(1, c)
        this.currentCate.id = this.category[indexs[0]].subCategorys[indexs[1]].id
      } else {
        picker.setColumnValues(1, [])
        this.currentCate.id = this.category[indexs[0]].id
      }
      let names = picker.getValues()
      if (indexs[0] === 0) {
        this.currentCate.name = ''
        this.currentCate.id = ''
      } else {
        if (this.category[indexs[0]].subCategorys) {
          this.currentCate.name = names.join('>')
        } else {
          this.currentCate.name = names.join('')
        }
      }
    },
    async brandSave() {
      if (this.brandName === '') {
        this.$toast('请输入新品牌名称')
        return
      }
      let res = await this.$api.BRAND_SAVE({ name: this.brandName })
      if (res.status === 1) {
        this.currentBrand = res.data
        this.brandVisible = false
      } else {
        this.$toast.fail('创建失败')
      }
    },
    async del() {
      let res = null
      if (!this.isGoods) {
        res = await this.$api.SERVER_DEL({ id: this.id })
      } else {
        res = await this.$api.GOODS_DEL({ id: this.id })
      }
      if (res.status === 1) {
        this.$toast.success('删除成功')
        this.$router.replace({ name: 'ServiceAdd', params: { refresh: true } })
      }
    },
    saveSpecification() {
      // 保存规格
      if (!this.skulist.name) {
        this.$toast.fail('请输入规格名称')
        return
      } else if (!this.skulist.price) {
        this.$toast.fail('请输入金额')
        return
      }
      if (this.newSkuCode === 'newSkuCode') {
        console.log(this.skubox)
        this.skubox.push(this.skulist)
      } else {
        this.skubox[this.indexList] = this.skulist
      }
      this.specificationShow = false
    },
    hideSku() {
      this.specificationShow = false
    },
    specificationDetail(data, id) {
      this.specificationShow = true
      this.skulist = this.skubox[data]
      this.indexList = data
      this.newSkuCode = ''
      this.specificationData = id
    },
    cateSelect() {
      this.cateVisible = true
    },
    brandSelect() {
      this.brandVisible = true
      // this.$router.push('/brand')
    },
    unitSelect() {
      this.unitVisible = true
    },
    // hanleChoiceCate(item) {
    //   this.currentCate = item
    //   this.cateVisible = false
    // },
    hanleChoiceBrand(item) {
      this.currentBrand = item
      this.brandVisible = false
    },
    hanleChoiceUnit(item) {
      this.currentUnit = item
      this.unitVisible = false
    },
    // resetCate() {
    //   this.currentCate = { name: '请选择', id: null }
    // },
    resetUnit() {
      this.currentUnit = { name: '请选择', id: null }
    },
    resetBrand() {
      this.currentBrand = { name: '请选择', id: null }
    },
    addNewSku() {
      this.specificationShow = true
      this.newSkuCode = 'newSkuCode'
      this.skulist = {
        name: '',
        price: '',
        percentSale: '',
        percentDeal: '',
        code: '',
        partCode: '',
        remarks: '',
        isDel: 0,
        delFlag: 0
      }
    },
    async delSpecificationDate() {
      let res = null
      if (!this.isGoods) {
        res = await this.$api.SERVER_SKU_DEL({ id: this.specificationData.id })
      } else {
        res = await this.$api.GOODS_SKU_DEL({ id: this.specificationData.id })
      }
      if (res.status === 1) {
        this.$toast.success('删除成功')
        if (this.$route.query.id) {
          this.getData()
          this.specificationShow = false
        }
        // this.$router.replace({ name: 'ServiceAdd', params: { refresh: true } })
      }
    },
    delGoodSku() {
      this.$dialog
        .confirm({
          title: '提示',
          message: '确认删除当前规格吗'
        })
        .then(() => {
          if (this.skulist.id) {
            // 编辑进来的删除
            this.delSpecificationDate()
          } else {
            this.skubox.splice(this.indexList, 1)
            this.$toast.success('删除成功')
            this.specificationShow = false
          }
          // on confirm
        })
        .catch(() => {
          // on cancel
        })
    },
    // delSku(index) {
    //   this.$dialog
    //     .confirm({
    //       title: '提示',
    //       message: '确认删除当前规格吗'
    //     })
    //     .then(() => {
    //       this.skubox.splice(index, 1)
    //       this.$toast.success('删除成功')
    //       // on confirm
    //     })
    //     .catch(() => {
    //       // on cancel
    //     })
    // },
    async submitNewGood() {
      const required = (ele, i, arr) => {
        return ele.name === '' || ele.price === ''
      }
      var _toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        message: '保存中...'
      })
      setTimeout(() => {
        // 10s 没返回结果
        _toast && _toast.clear()
      }, 10000)
      if (this.isGoods) {
        if (this.name === '') {
          this.$toast.fail('请输入商品名称')
          return
        } else if (!this.currentUnit.id) {
          this.$toast.fail('请选择单位')
          return
        } else if (this.skubox.length === 0) {
          this.$toast.fail('请输入商品规格的必填项')
          return
        }
      } else {
        if (this.name === '') {
          this.$toast.fail('请输入商品名称')
          return
        } else if (this.skubox.length === 0) {
          this.$toast.fail('请输入服务规格的必填项')
          return
        }
      }
      if (this.name && !this.skubox.some(required) && this.currentUnit.id) {
        var res
        if (this.isGoods) {
          for (let i = 0; i < this.skubox.length; i++) {
            this.skubox[i].isDel = this.skubox[i].delFlag
          }
          let data = {
            id: this.id,
            name: this.name,
            'goodsCategory.id': this.currentCate.id,
            code: this.code,
            'goodsBrand.id': this.currentBrand.id,
            unit: this.currentUnit.id,
            summary: this.summary,
            remarks: this.remarks,
            goodsSkus: this.skubox
          }
          console.log(data)
          res = await this.$api.ADD_NEW_GOODS(data)
          _toast && _toast.clear()
        } else {
          console.log(this.skubox)
          for (let i = 0; i < this.skubox.length; i++) {
            this.skubox[i].isDel = this.skubox[i].delFlag
          }
          let data = {
            id: this.id,
            name: this.name,
            'serverCategory.id': this.currentCate.id,
            code: this.code,
            summary: this.summary,
            remarks: this.remarks,
            serverSkus: this.skubox
          }
          console.log(data)
          res = await this.$api.ADD_NEW_SERVICE(data)
          _toast && _toast.clear()
        }

        if (res.status === 1) {
          if (this.$route.query.id) {
            this.$toast.success('编辑成功')
          } else {
            this.$toast.success('新增成功')
          }

          // 从哪来回哪去
          this.$router.replace({
            name: this.src ? this.src : 'ServiceAdd',
            params: { refresh: true }
          })
        } else {
          if (this.$route.query.id) {
            this.$toast.fail('编辑失败')
          } else {
            this.$toast.fail('新增失败')
          }
        }
      } else {
        this.$toast.fail('请完善必填项')
      }
    },
    async getCate() {
      // 获取商品和服务的分类
      let res = await this.$api.GOODS_CATEGORY_TOP()
      if (res.status === 1) {
        this.goodsCategory = res.list
      } else {
        this.$toast('获取商品分类失败')
      }
      let res2 = await this.$api.SERVICE_CATEGORY_TOP()
      if (res2.status === 1) {
        this.serviceCategory = res2.list
      } else {
        this.$toast('获取商品分类失败')
      }
    },
    async getBrand() {
      let res = await this.$api.GOODS_BRAND_LIST(this.query)
      if (res.status === 1) {
        this.brand = res.page.list
      } else {
        this.$toast('获取商品品牌失败')
      }
    },
    async getData() {
      if (this.isGoods) {
        let res = await this.$api.GOODS_DETAIL({
          id: this.id
        })
        if (res.status === 1) {
          this.currentCate.name = res.data.goodsCategory.name
          this.currentCate.id = res.data.goodsCategory.id
          this.name = res.data.name
          this.code = res.data.code
          this.currentBrand.name = res.data.goodsBrand.name
          this.currentBrand.id = res.data.goodsBrand.id
          this.currentUnit.name = res.data.unit
          this.currentUnit.id = res.data.unit
          this.remarks = res.data.remarks
          this.skubox = res.data.goodsSkus ? res.data.goodsSkus : []
        } else {
          console.error('获取详情失败')
        }
      } else {
        let res = await this.$api.SERVICE_DETAIL({
          id: this.id
        })
        if (res.status === 1) {
          this.currentCate.name = res.data.serverCategory.name
          this.currentCate.id = res.data.serverCategory.id
          this.name = res.data.name
          this.code = res.data.code
          this.currentUnit.name = '次'
          this.currentUnit.id = '次'
          this.remarks = res.data.remarks
          this.skubox = res.data.serverSkus ? res.data.serverSkus : []
        } else {
          console.error('获取详情失败')
        }
      }
    }
  },
  created() {
    this.getCate()
    this.getBrand()
    // TIP: isGoods 表示添加商品
    // this.isGoods = JSON.parse(this.$route.query.isGoods)
    if (this.$route.query.gasType) {
      this.isGoods = this.$route.query.gasType === '1'
    }
    this.src = this.$route.query.src
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getData()
      this.skubox = []
    } else {
      this.id = ''
    }
    this.indexList = 0
    this.newSkuCode = ''
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
.sku-del-cell {
  height: 40px;
  background: #f8f8f8;
  color: #555555;
  padding: 0 15px;
  line-height: 40px;
  font-size: 14px;
  .sku-del-cell-btn {
    float: right;
    padding-left: 40px;
    color: #1690ff;
    .icon {
      color: #1690ff !important;
    }
  }
}
.add-newsku {
  font-size: 16px;
  padding: 15px;
  color: #1690ff;
}
.fixed_btn {
  position: fixed;
  bottom: 0;
  width: 100%;
  right: 0;
  background: @primary;
  color: #ffffff;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  text-align: center;
  display: flex;
  z-index: 99;
  .fixed_btn_item {
    flex: 1;
    &.deep {
      background: lighten(@primary, 20%);
    }
  }
}
.c_cate_card_header {
  padding: 10px;
}
.c_cate_card_body {
  padding: 5px;
  .c_cate_card_body_item {
    width: 33%;
    display: inline-block;
    padding: 0 5px;
    margin-bottom: 10px;
    font-size: 15px;
    .sm_btn {
      height: 30px;
      width: 100%;
      color: #999999;
      line-height: 30px;
      text-align: center;
      border: 1px solid #c7c7c7;
      border-radius: 15px;
      overflow: hidden;
      &.active {
        border: 1px solid @primary;
        background: @primary;
        color: #ffffff;
      }
    }
  }
}
.AddGoodsBox {
  .newAddspecification {
    color: #1690ff !important;
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon {
      width: 15px;
      height: 15px;
      color: #1690ff !important;
      font-size: 20px;
    }
    .addStandard {
      height: 50px;
      line-height: 54px;
      margin-left: 2px;
    }
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
.GoodsDetailList:after {
  background: none !important;
}
.del-btn-new {
  width: 80%;
  margin-left: 10%;
}
.textRight {
  .c_cell {
    .c_cell_input_box {
      .c_cell_input {
        text-align: right;
        padding: 10px 16px;
      }
    }
  }
}
.textRight1 {
  border-bottom: 1px solid #e8e8e8 !important;
  .c_cell {
    background: none;
    .text {
      padding: 0px 16px;
    }
  }
}
.footer-white {
  background: #fff;
  color: #666;
}
.nobg {
  border-bottom: 1px solid #e8e8e8 !important;
  padding-left: 10px !important;
  .c_cell {
    background: none;
  }
}
</style>
