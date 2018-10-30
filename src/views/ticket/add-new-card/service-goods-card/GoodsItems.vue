<template>
  <div>
    <div class="wrapper-goods">
      <div class="left-nav">
        <cube-scroll ref="navScroll">
          <ul>
            <li class="nav-item" :class="query['goodsCategory.id']==''?'active':''" @click="searchService({id: ''})">全部</li>
            <li class="nav-item" :class="query['goodsCategory.id']==item.id?'active':''" :key="item.id+index" v-for="(item,index) in rerviceNav" @click="searchService(item)">{{item.name}}</li>
          </ul>
          <v-br :height="50"></v-br>
        </cube-scroll>
      </div>
      <div class="right-list">
        <cube-scroll ref="scroll" :options="options" :data="serviceList" @pulling-up="onPullingUp" @pulling-down="onPullingDown">
          <ul>
            <!-- <goods-item :item="item" v-for="(item,index) in serviceList" :key="item.id" @click.native="showSku(item)"></goods-item> -->
            <!-- 单个规格s -->
            <li class="service-item" v-for="(item,index) in serviceList" :key="item.id" >
              <div class="title textover1">
                {{item.name}}
                <v-badge size="small" v-if="item.dataSrc=='1'" class=" title-icon" type="店铺库" >店铺库</v-badge>
                <div v-else class="title-icon">
                  <v-badge size="small"  type="系统库">系统库</v-badge>
                </div>
              </div>
              <p class="code textover1">
                <span v-if="item.goodsBrand&&item.goodsBrand.name" style="padding-right:10px">品牌:{{item.goodsBrand.name}}</span>
                <span v-if="item.code">编码:{{item.code}} </span>
              </p>
              <p class="price" style="width:100%;padding-right:25px" v-if="item.priceRange">￥{{item.priceRange}}
                <span style="color:#666">
                  <span v-if="item.unit">/{{item.unit}}</span>
                  <span v-else>/次</span>
                </span>
              </p>
               <div class="cb-card-ctrl-box" v-if="(item.goodsSkus
        ? item.goodsSkus.length
        : item.serverSkus ? item.serverSkus.length : 0)>0">
                <!-- 次卡控件 -->
                <div v-if="cardType=='3'">
                  <span v-if="(item.goodsSkus
        ? item.goodsSkus.length
        : item.serverSkus ? item.serverSkus.length : 0)>1" class="cb-card-ctrl-choice tap-area" @click="showSku(item,index)">选规格
                    <v-dot :number="item.count" /> </span>
                  <div v-else>
                    <div class="ctrl-nolimit tap-area" @click="noLimit(item,'goods','1')" v-if="item.goodsSkus" :class="{'no-limit-active':item.goodsSkus[0].count==-1}">不限次</div>
                    <div class="plus-cut-ctrl-box" v-if="item.goodsSkus&&item.goodsSkus[0].count>0">
                      <div class="ctrl-cut tap-area" @click="cut(item,'goods','1')">-</div>
                      <div type="tel" class="ctrl-input" maxlength="7">{{item.goodsSkus[0].count}}</div>
                      <div class="ctrl-plus tap-area" @click="add(item,'goods','1')">+</div>
                    </div>
                    <div v-else class="plus-cut-ctrl-add">
                      <div class="ctrl-plus ctrl-icon tap-area" @click="push(item,'goods','1')">+</div>
                    </div>
                  </div>
                </div>
                <!-- 折扣卡控件 -->
                <div v-else @click="showSku(item,index)">
                  <span v-if="(item.goodsSkus
        ? item.goodsSkus.length
        : item.serverSkus ? item.serverSkus.length : 0)>1" class="cb-card-ctrl-choice tap-area">选规格
                    <v-dot :number="item.count" /> </span>
                  <v-icon v-else class="tap-area" :name="item.goodsSkus[0].checked?'icon-queding1':'icon-yuan'"></v-icon>
                </div>
              </div>
            </li>
            <!-- 单个规格e -->
          </ul>
          <v-br :height="50"></v-br>
        </cube-scroll>
      </div>
    </div>
    <van-popup v-model="skuVisiable" position="bottom" class="popup-radius"  style="width:100%;height:70%" :lock-scroll="false">
      <v-popup-title @close="skuVisiable = false" :title="currGoods.name" :desc="desc"></v-popup-title>
      <div class="sku-goods-wrapper">
        <cube-scroll ref="skuScroll">
          <div class="sku-goods-scroll-inner">
            <div class="sku-goods-item " v-for="it in skuData" :key="it.id">
              <div class="left-info-sku">
                <h1 class="textover1">{{it.name}}</h1>
                <p>
                  {{it.price|currency()}}</p>
              </div>
              <div class="right-select-sku">
                <!-- 次卡 -->
                <div v-if="cardType=='3'">
                  <div class="ctrl-nolimit tap-area" @click="noLimit(it,'sku','1')" :class="{'no-limit-active':it.count==-1}">不限次</div>
                  <div class="plus-cut-ctrl-box" v-if="it.count>0">
                    <div class="ctrl-cut ctrl-icon tap-area" @click="cut(it,'sku','1')">-</div>
                    <div type="tel" class="ctrl-input" maxlength="7">{{it.count}}</div>
                    <div class="ctrl-plus ctrl-icon tap-area" @click="add(it,'sku','1')">+</div>
                  </div>
                  <div v-else class="plus-cut-ctrl-add">
                    <div class="ctrl-plus ctrl-icon tap-area" @click="push(it,'sku','1')">+</div>
                  </div>
                </div>
                <!-- 折扣卡 -->
                <div v-else @click="choiceSku(it)">
                  <v-icon  class="tap-area" :name="it.checked?'icon-queding1':'icon-yuan'"></v-icon>
                </div>
              </div>
            </div>
          </div>
        </cube-scroll>
      </div>
      <v-footer>
        <v-footer-item @click.native="skuVisiable = false">确定</v-footer-item>
      </v-footer>
    </van-popup>
  </div>
</template>

<script>
import scroll from '@/common/mixins/scroll.js'
import serviceGoods from './service-goods'
export default {
  name: 'choice-goods',
  mixins: [scroll, serviceGoods],
  methods: {
    choiceSku(item) {
      this.mixins_choiceSku(item, '1')
    },
    showSku(item) {
      this.mixins_showSku(item, '1')
    },
    async getNav() {
      let res = await this.$api.GOODS_CATEGORY_TOP()
      if (res.status === 1) {
        this.rerviceNav = res.list
      } else {
        console.error(res.stateMessage)
      }
    },
    async getData() {
      let res = await this.$api.GOODS_AND_SKU(this.query)
      if (res.status === 1) {
        if (this.query.pageNo === 1) {
          this.serviceList = res.page.list || []
        } else {
          this.serviceList = this.serviceList.concat(res.page.list || [])
        }
        this.totalPage = res.page.totalPage
        this.watchChoice()
      } else {
        console.error(res.stateMessage)
      }
    }
  }
}
</script>
