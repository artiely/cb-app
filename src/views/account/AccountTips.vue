<template>
  <div class="accountTip">
    <v-header title="提示" :left-click="toBack" :border="false" class="blackicon">
    </v-header>
    <v-scroll-page top="44" style="background:#f8f8f8;">
      <div class="handovertopBox">
        <div class="jb_money">
          <v-icon name="icon-zujianku-16" class="zhifubao"></v-icon>
        </div>
        <div class="jb_peo">扫码收银仅对部分店铺开放,</div>
        <div class="jb_time">您暂时无法使用。</div>
      </div>
    </v-scroll-page>
  </div>
</template>


<style  lang="less">
.accountTip {
  .c_header,
  .c_header .c_header-isborder {
    background: #e8e8e8;
  }
  .handovertopBox {
    position: relative;
    width: 100%;
    padding: 40px 0 55px 0;
    text-align: center;
    .jb_money {
      margin-bottom: 22px;
    }
    .jb_money i {
      font-size: 60px;
      color: #ffa216 !important;
    }
    .jb_peo,
    .jb_time {
      font-size: 18px;
      color: #333;
    }
    .jb_peo {
      margin-bottom: 8px;
    }
  }
}
</style>
