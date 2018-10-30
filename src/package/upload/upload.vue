<template>
  <div>
    <p class="v-upload-title">{{title}}</p>
    <div class="v-upload-picbox">
      <div class="v-upload-picitem" v-for="(item,index) in data">
        <div class="v-upload-close" v-if="!readonly" @click="close(index)">
          <v-icon name="icon-shanchu1"></v-icon>
        </div>
        <div class="v-upload-pic">
          <img :src="imgBaseUrl+item" alt="单据/照片">
        </div>
      </div>
      <div class="v-upload-picitem-add" v-if="data.length<maxlength&&!readonly" @click="callNative">
        <v-icon name="icon-iconfont56"></v-icon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'v-upload',
  data() {
    return {}
  },
  props: {
    title: {
      type: String,
      default: '单据/照片'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    },
    maxlength: {
      type: [Number, String],
      default: 4
    }
  },
  computed: {
    imgBaseUrl() {
      return this.$store.state.native.imgBaseUrl
    }
  },
  methods: {
    close(index) {
      this.$store.commit('NATIVE_PIC_DEL_ORDER', index)
    },
    callNative() {
      this.$api.GET_CAMERA({ serverType: 'kaidan' })
    }
  }
}
</script>

<style lang="less">
.v-upload-title {
  font-size: 14px;
  color: #666;
  padding: 5px 15px;
}
.v-upload-picbox {
  padding: 5px 15px;
  .v-upload-picitem {
    position: relative;
    display: inline-block;
    margin-right: 10px;
    .v-upload-close {
      position: absolute;
      top: -8px;
      right: -8px;
      height: 20px;
      width: 20px;
      background: red;
      border-radius: 50%;
      color: #fff;
      overflow: hidden;
      text-align: center;
      line-height: 20px;
      .icon {
        color: #fff !important;
      }
    }
    .v-upload-pic {
      height: 60px;
      width: 60px;
      background: #ddd;
      overflow: hidden;
    }

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
  .v-upload-picitem-add {
    height: 60px;
    width: 60px;
    line-height: 60px;
    text-align: center;
    overflow: hidden;
    background: #fff;
    display: inline-block;
    .icon {
      font-size: 24px;
    }
  }
}
</style>