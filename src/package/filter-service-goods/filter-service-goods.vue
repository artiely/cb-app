<template>
  <!-- 筛选 -->
  <van-popup v-model="filterVisiable " position="right " style="width:80%;height:100%; ">
    <v-popup-title @close="filterVisiable=false "></v-popup-title>
    <div class="popup-innerbox " style="padding:10px ">
      <div class="filter-title ">来源</div>
      <van-row gutter="10">
        <van-col span="8" v-for="(item) in filterItem" :key="item.name" @click.native="changeStore(item)">
          <v-button :type="item.srcType==srcType?'primary-solid':''">{{item.name}} </v-button>
        </van-col>
      </van-row>
      <div class="filter-title ">状态
      </div>
      <van-row gutter="10 ">
        <van-col span="8 " v-for="(item) in filterStatus " :key="item.name " @click.native="changeStatus(item)" style="margin-bottom:10px; ">
          <v-button :type="item.statusType==statusType?'primary-solid':''">{{item.name}} </v-button>
        </van-col>
      </van-row>
    </div>
    <v-footer>
      <v-footer-item class="footer-white" @click.native="handleShuRest ">重置</v-footer-item>
      <v-footer-item @click.native="filterVisiable=false ">确定</v-footer-item>
    </v-footer>
  </van-popup>
</template>

<script>
import filter from './ServiceGoodsFilter'
export default {
  mixins: [filter]
}
</script>
