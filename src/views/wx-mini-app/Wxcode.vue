<template>
  <div>
    <v-header title="小程序二维码"></v-header>
    <v-scroll-page top="44" style="overflow-y:scroll">
      <div id="capture">
        <div class="wx_code_header">
          {{data.name}}
        </div>
        <div class="wx_code_body">
          <div class="img-box">
            <img />
          </div>
          <p class="wx_code_info">打开微信[扫一扫]</p>
          <p class="wx_code_info">查看消费详情</p>
        </div>
      </div>
      <div style="padding:10px 40px;text-align:center">
        <div class="primary" @click="takeScreenshot()">保存到相册</div>
      </div>
      <p style="font-size:12px;color:#666;text-align:center">保存后可打印到店内或分享给朋友。</p>
      <img src="" alt="" id="WximgQrCode">
    </v-scroll-page>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
export default {
  data() {
    return {
      data: ''
    }
  },
  methods: {
    takeScreenshot() {
      console.log('test')
      this.$nextTick(() => {
        html2canvas(document.querySelector('#capture')).then(canvas => {
          // document.body.appendChild(canvas)
          // var imgUri = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); // 获取生成的图片的url
          // console.log(imgUri)
          // window.location.href= imgUri; // 下载图片
          // 图片导出为 png 格式
          var type = 'png'
          var imgData = canvas.toDataURL(type)
          alert(imgData)

          var _imgSrc = canvas.toDataURL('image/png', 1)
          var storeImage = new Image()
          storeImage.crossOrigin = 'anonymous'
          var imgShow = document.getElementById('WximgQrCode')
          imgShow.setAttribute('src', _imgSrc)
          /**
           * 获取mimeType
           * @param  {String} type the old mime-type
           * @return the new mime-type
           */
          var _fixType = function(type) {
            type = type.toLowerCase().replace(/jpg/i, 'jpeg')
            var r = type.match(/png|jpeg|bmp|gif/)[0]
            return 'image/' + r
          }

          // 加工image data，替换mime type
          imgData = imgData.replace(_fixType(type), 'image/octet-stream')

          /**
           * 在本地进行文件保存
           * @param  {String} data     要保存到本地的图片数据
           * @param  {String} filename 文件名
           */
          var saveFile = function(data, filename) {
            var saveLink = document.createElement('a')
            saveLink.href = data
            saveLink.download = filename

            var event = document.createEvent('MouseEvents')
            event.initMouseEvent(
              'click',
              true,
              false,
              window,
              0,
              0,
              0,
              0,
              0,
              false,
              false,
              false,
              false,
              0,
              null
            )
            saveLink.dispatchEvent(event)
          }

          // 下载后的问题名
          var filename = 'chebian' + new Date().getTime() + '.' + type
          // download
          console.log(imgData)
          alert(imgData)
          saveFile(imgData, filename)
        })
      })
    },
    async getInfo() {
      let res = await this.$api.STORE_INFO()
      if (res.status === 1) {
        this.id = res.data.id
        this.data = res.data
      }
    }
  },
  mounted() {},
  activated() {
    this.getInfo()
  }
}
</script>

<style lang="less">
#capture {
  background: #ff7316;
}
.wx_code_header {
  padding: 0 10px;
  background: #fff;
  height: 108px;
  line-height: 108px;
  color: #333;
  font-size: 26px;
  text-align: center;
  font-weight: 600;
}
.wx_code_body {
  background: #ff7316;
  height: 416px;
  .img-box {
    padding-top: 65px;
    text-align: center;
    padding-bottom: 20px;
    img {
      width: 210px;
      height: 210px;
      outline: none;
      border: none;
      padding: none;
    }
  }
  .wx_code_info {
    font-size: 20px;
    color: #fff;
    text-align: center;
    line-height: 1.5;
  }
}
</style>