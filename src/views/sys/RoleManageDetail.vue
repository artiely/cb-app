<template>
  <div class="RoleManageDetailBox">
    <v-header title="详情" :border="true" :left-click="handleLeft" righttext="编辑" @right-click="toRoleManageEdit">
    </v-header>
    <div class="jsBox">
      <div class="jsPosition">
        <div class="jsPositionLable">角色名称</div>
        <div class="jsPositionNr">{{name}}</div>
      </div>
      <div class="infoList">
        <div class="listLabel">创建时间</div>
        <div class="listNr">{{createTime}}</div>
      </div>
      <div class="infoList">
        <div class="listLabel">创建人</div>
        <div class="listNr">{{createPeople}}</div>
      </div>
      <div class="infoList">
        <div class="listLabel">更新时间</div>
        <div class="listNr">{{updateTime}}</div>
      </div>
      <div class="infoList">
        <div class="listLabel">更新人</div>
        <div class="listNr">{{updatePeople}}</div>
      </div>
    </div>
    <div class="auth">手机端权限</div>
    <div class="authListBox" v-if="authInfo.length>0">
      <div class="authList" v-for="(authitem , index) in authInfo" :key="index">{{authitem.name}}</div>
    </div>
    <v-remark v-model="remark" disabled></v-remark>
    <!-- <div class="remarkBox">
      <div class="remarkLabel">备注</div>
      <div class="remarkNr">{{remark}}</div>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      getdata: '',
      name: '',
      createTime: '',
      createPeople: '',
      updateTime: '',
      updatePeople: '',
      authInfo: [],
      remark: ''
    }
  },
  methods: {
    async getData() {
      // console.log('接口请求前答应id =', this.id)
      let res = await this.$api.ROLE_DETAIL({ id: this.id })
      // console.log('打印返回数据 =', res)
      if (res.status === 1) {
        console.log('详情res.list1111111111111111111111 =', res.data)
        this.getdata = res.data
        // console.log('详情当前data =', this.getdata)
        this.updateFunc(this.getdata)
      }
    },
    handleLeft() {
      this.$router.replace('/rolemanagement')
    },
    toRoleManageEdit() {
      // console.log("执行的改函数")
      this.$router.push({
        name: 'RoleManageEdit',
        query: {
          currRoleManageDetailId: this.id
        }
      })
    },
    zhuanma(timedata) {
      var currData = new Date(timedata)
      console.log('当前时间 =', currData)
      var zhuanNewTime =
        currData.getFullYear() +
        '-' +
        (currData.getMonth() + 1) +
        '-' +
        currData.getDate() +
        ' ' +
        currData.getHours() +
        ':' +
        currData.getMinutes() +
        ':' +
        currData.getSeconds()
      console.log('转换格式后的时间 =', zhuanNewTime)
      return zhuanNewTime
    },
    updateFunc(info) {
      this.id = info.id
      this.name = info.name
      this.createTime = this.zhuanma(info.createDate)
      this.createPeople = info.createBy
      this.updateTime = this.zhuanma(info.updateDate)
      this.updatePeople = info.updateBy
      this.authInfo = info.stAppMenus
      this.remark = info.remarks
    }
  },
  mounted() {
    this.id = this.$route.query.currRoleInfoId
  },
  activated() {
    this.id = this.$route.query.currRoleInfoId
    // console.log('详情中打印id =', this.id)
    this.getData()
  }
}
</script>

<style lang="less">
.RoleManageDetailBox {
  .jsBox {
    width: 100%;
    margin-top: 64px;
    background-color: #ffffff;
    padding: 0 0 15px 16px;
  }
  .jsPosition {
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e8e8e8;
  }
  .jsPositionLable {
    font-size: 18px;
    color: #666666;
  }
  .jsPositionNr {
    color: #333333;
    font-size: 18px;
    font-weight: 600;
    margin-right: 20px;
  }
  .infoList {
    margin-top: 12px;
    color: #aeaeae;
    padding-right: 20px;
    box-sizing: border-box;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
  }

  .listNr {
    color: #333333;
    font-size: 16px;
  }
  .auth {
    color: #999999;
    font-size: 15px;
    margin: 28px 16px 10px 10px;
  }
  .authListBox {
    padding: 6px 0 4px 16px;
    box-sizing: border-box;
    background-color: #ffffff;
    display: flex;
    flex-wrap: wrap;
  }
  .authList {
    font-size: 14px;
    background: #e8e8e8;
    padding: 6px;
    border-radius: 3px;
    margin: 0 20px 10px 0;
    color: #333333;
  }
  .remarkBox {
    margin: 25px 25px 0 10px;
    font-size: 14px;
    color: #333333;
  }
  .remarkLabel {
    margin-bottom: 8px;
  }
  .remarkNr {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    -webkit-text-overflow: ellipsis;
    -moz-text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
