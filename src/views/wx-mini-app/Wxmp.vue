<template>
  <div id="wxmp">
    <v-header title="微信小程序"></v-header>
    <v-scroll-page top="44" style="overflow-y:scroll">
      <div class="cb_mp_edit tap-area" @click="show=true">编辑</div>
      <div v-if="wxPicList.length>0" style="background:#fff" class="cb_mp_swipe">
        <van-swipe :autoplay="3000">
          <van-swipe-item v-for="(image, index) in wxPicList" :key="index">
            <img v-lazy="imgBaseUrl + image" />
          </van-swipe-item>
        </van-swipe>
      </div>
      <div v-else style="background:#fff" class="cb_mp_swipe">
        点击右上角的编辑，添加店铺形象图、广告图等。
      </div>
      <v-br height="20"></v-br>
      <div v-if="required">
        <v-cell-group style="margin-bottom:0">
          <v-cell wrap>
            <div slot="title">
              <div class="cb_store-box">
                <div class="cb_store-icon-box">
                  <div class="cb_store-icon">
                    <v-icon name="icon-qiyeguanli"></v-icon>
                  </div>
                </div>
                <div class="cb_store-info">
                  <h1 style="font-size:20px;color:#333;font-weight:500">{{data.name}}</h1>
                  <p style="font-size:14px;color:#999;padding-top:5px;">
                    <span v-for="item in data.categoryMap">{{item}} · </span>
                  </p>
                </div>
              </div>
            </div>
          </v-cell>
        </v-cell-group>
        <v-cell-group>
          <v-cell title="电话" :text="data.tel"></v-cell>
          <v-cell title="地址" wrap :text="data.areaDetail"></v-cell>
          <v-cell title="营业时间" :text="data.businessTimeStart"></v-cell>
        </v-cell-group>
        <div class="to_wx_code" @click="toCode">
          <v-icon name="icon-erweima"></v-icon> 点击查看小程序二维码</div>
      </div>
      <div v-else @click="toCompany" class="noInfo">
        店铺信息还未完善，点击前去完善。
      </div>
    </v-scroll-page>
    <van-popup v-model="show" style="height:100%;width:100%;background:#e8e8e8" position="bottom">
      <v-header title="微信小程序" righttext="保存" :left-click="handleLeft" @right-click="handleRight"></v-header>
      <v-br height="44"></v-br>
      <p style="font-size:12px;padding:15px 0 0 15px;color:#666">宣传图片（最多 4 张）</p>
      <div style="display:flex">
      <div v-for="(item,index) in wxPicList" class="cb_mp_box">
        <div class="cb_mp_item">
          <img :src="imgBaseUrl+item">
        </div>
        <v-icon name="icon-shanchu" class="cb_mp_x tap-area" @click.native="delPic(index)"></v-icon>
      </div>
      <div class="cb_mp_item cb_mp_add" @click="picUpload" v-if="wxPicList.length<=3">
        <v-icon name="icon-iconfont56"></v-icon>
      </div>
      </div>
      

    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      data: '',
      id: '',
      required: false
    }
  },
  computed: {
    wxPicList() {
      return this.$store.state.native.wxPicList
    },
    imgBaseUrl() {
      return this.$store.state.native.imgBaseUrl
    }
  },
  methods: {
    handleLeft() {
      this.show = false
    },
    toCompany() {
      this.$router.push({ name: 'store', query: { id: this.id } })
    },
    toCode() {
      this.$router.push('/wxcode')
    },
    async handleRight() {
      let res = await this.$api.STORE_SAVE({
        id: this.id,
        displayPhotos: this.wxPicList.join()
      })
      if (res.status === 1) {
        this.$toast.success('保存成功')
        this.show = false
      } else {
        this.$toast.success('保存失败')
      }
    },
    picUpload() {
      this.$api.GET_CAMERA({ serviceType: 'wx' })
    },
    delPic(index) {
      this.$store.commit('NATIVE_PIC_DEL', index)
    },
    async getInfo() {
      let res = await this.$api.STORE_INFO()
      if (res.status === 1) {
        this.id = res.data.id
        this.data = res.data
        if (res.data.displayPhotos) {
          this.$store.commit(
            'SET_NATIVE_PIC',
            res.data.displayPhotos.split(',')
          )
        }
        if (res.data.name && res.data.tel && res.data.areaDetail) {
          this.required = true
        } else {
          this.required = false
        }
      }
    }
  },
  activated() {
    this.getInfo()
  }
}
</script>

<style  lang="less">
#wxmp {
  .noInfo {
    font-size: 16px;
    color: #1069ff;
    text-align: center;
    padding: 10px;
  }
  .to_wx_code {
    font-size: 14px;
    color: #1069ff;
    text-align: center;
  }
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
  .cb_mp_swipe {
    height: 255px;
    text-align: center;
    line-height: 255px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .cb_mp_box {
    display: inline-block;
    position: relative;
    height: 60px;
    width: 60px;
    margin: 10px;
  }
  .cb_mp_x {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2004;
    .v_icon--wrapper{
      height: auto!important;
      line-height: 1;
    }
    .icon {
      color: red !important;
    }
  }
  .cb_mp_item {
    height: 60px;
    width: 60px;
    background: #ddd;
    object-fit: cover;
    display: inline-block;
    overflow: hidden;
    line-height: 60px;
    text-align: center;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    &.cb_mp_add {
      background: #fff;
      margin: 10px;
      .icon {
        font-size: 24px;
      }
    }
  }
  .cb_mp_edit {
    font-size: 16px;
    color: #1069ff;
    background: #e8e8e8;
    padding: 4px 6px;
    position: fixed;
    top: 64px;
    right: 15px;
    z-index: 999;
    border-radius: 4px;
  }
}
</style>