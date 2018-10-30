<template>
  <div>
    <v-header title="店铺所在地"></v-header>
    <v-br height="44"></v-br>
    <div class="cb_address-search-box">
      <div class="cb_address-search">
        <span class="cb_address-city">{{currentCity}}</span>
        <v-icon class="cb_address-icon" name="icon-sousuo1"></v-icon><input type="text" v-model="addrss" placeholder="店铺名/小区/写字楼/学校等"> </div>
      <span class="cb_address_cancel" @click="cancel" v-if="addressList.length>0">取消</span>
    </div>
    <div id='container' style="width:100%;height:100%"></div>
    <div id="result" style="overflow-y:scroll" v-if="addressList.length>0">
      <div v-for="item in addressList" class="cb_address" @click="selectAddress(item)">
        <!-- <div class="cb_address_icon"></div> -->
        <div class="cb_address_info">
          <div class="cb_address_name">{{item.name}}</div>
          <div class="cb_address_detail">{{item.district}}
            <span v-if="item.address.length>0">{{item.address}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'cb-address',
  props: {
    value: ''
  },
  data() {
    return {
      addrss: '',
      addressList: [],
      currentCity: '北京',
      id: '',
      timer: null
    }
  },
  watch: {
    addrss: {
      handler() {
        this.timer = setTimeout(() => {
          this.autoInput()
        }, 400)
      }
    }
  },
  methods: {
    selectAddress(item) {
      if (typeof item.address === 'object') {
        this.$toast('请选择更精准的位置')
        return
      }
      this.$router.replace({
        name: 'store',
        query: { id: this.id },
        params: { data: item }
      })
    },
    cancel() {
      this.addrss = ''
      this.addressList = []
    }
  },
  mounted() {
    var _this = this

    //初始化地图
    AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {
      var map = new AMap.Map('container', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 11 //初始地图级别
      })

      let city = '北京'
      //获取用户所在城市信息
      function showCityInfo() {
        //实例化城市查询类
        var citysearch = new AMap.CitySearch()
        //自动获取用户IP，返回当前城市
        citysearch.getLocalCity(function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
            if (result && result.city && result.bounds) {
              var cityinfo = result.city
              var citybounds = result.bounds
              city = result.city
              _this.currentCity = result.city
              // document.getElementById('info').innerHTML = '您当前所在城市：'+cityinfo;
              //地图显示当前城市
              map.setBounds(citybounds)
            }
          } else {
            // document.getElementById('info').innerHTML = result.info;
          }
        })
      }
      showCityInfo()

      // 获取输入提示信息
      _this.autoInput = () => {
        var keywords = _this.addrss
        AMap.plugin('AMap.Autocomplete', function() {
          // 实例化Autocomplete
          var autoOptions = {
            city: city
          }
          var autoComplete = new AMap.Autocomplete(autoOptions)
          autoComplete.search(keywords, function(status, result) {
            // 搜索成功时，result即是对应的匹配数据
            console.log(result)
            if (result.info === 'OK') {
              _this.addressList = result.tips
            }
            // var node = new PrettyJSON.view.Node({
            //     el: document.querySelector("#input-info"),
            //     data: result
            // });
          })
        })
      }
      _this.autoInput()
      // 拖拽选址
      var positionPicker = new PositionPicker({
        mode: 'dragMap',
        map: map
      })
      positionPicker.on('success', function(positionResult) {
      console.log('xx', positionResult)
      _this.addressList=[positionResult]
    })
    positionPicker.on('fail', function(positionResult) {
            console.log('ss', positionResult)
        });
         positionPicker.start(map.getBounds().getSouthWest())
        //  map.addControl(new AMap.ToolBar({
        //     liteStyle: true
        // }))
    })
    
  },
  activated() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
    }
  }
}
/* eslint-enable */
</script>

<style scoped lang="less">
@import '../../assets/style/border';
.cb_address-search-box {
  background: #fff;
  padding: 4px;
  display: flex;
}
.cb_address_cancel {
  font-size: 14px;
  color: #333;
  line-height: 32px;
  padding: 0 8px;
}
.cb_address-search {
  height: 32px;
  line-height: 32px;
  width: 100%;
  background: #e8e8e8;
  display: flex;
  flex: 1;
  input {
    background: #e8e8e8;
    flex: 1;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    text-indent: 15px;
  }
  .cb_address-icon {
  }
  .cb_address-city {
    padding: 0 6px;
    font-size: 12px;
    color: #333;
  }
}
#result {
  width: 100%;
  position: fixed;
  top: 84px;
  // bottom: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 999;
  .cb_address {
    display: flex;
    .borderB();
    .cb_address_icon {
      width: 60px;
      height: 60px;
    }
    .cb_address_info {
      flex: 1;
      padding-left: 10px;
      .cb_address_name {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        padding: 10px 0 6px 0;
      }
      .cb_address_detail {
        line-height: 1.2;
        font-size: 12px;
        color: #999;
        padding-bottom: 10px;
      }
    }
  }
}
</style>