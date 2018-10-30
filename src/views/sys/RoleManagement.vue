<template>
  <div class="RoleManagementBox">
    <v-header title="角色管理" righticon="icon-zujianku-16" @right-click="handlerTip" :left-click="handleLeft"></v-header>
      <v-scroll-page top="44">
      <cube-scroll :data="data" ref="scroll" @pulling-up="onPullingUp" :options="options" @pulling-down="onPullingDown">
        <v-br height="20"></v-br>
        <div v-if="data.length>0" class="roleListBox">
          <div class="roleList" @click="goRoleDetail(item)" v-for="item in data" :key="item.store.id">
            <div class="roleLeft">
              <div class="roleName">{{item.name}}</div>
              <div class="roleRemarkBox">
                <div>备注：</div>
                <div class="roleRemarkNr">{{item.remarks}}</div>
              </div>
            </div>
            <div class="roleRight"><img src="../../assets/img/navRight.png" class="navRightPic" /></div>
          </div>

        </div>
        <v-norole v-else></v-norole>
      </cube-scroll>
      </v-scroll-page>
    <v-fad-button @click.native="toNewChargeActive"></v-fad-button>
    <van-dialog v-model="dialogShow" :before-close="beforeClose" style="left:0px;right:0px;margin: 0 50px;transform: translate3d(0%,-50%,0);width: 75%;">
      <div class="roleTanBox">
        <div class="shuoming">说明</div>
        <div class="roleTanNrBox">
          <div>1、可为每个角色设置不同的操作权限。</div>
          <div>2、购买系统时的注册手机为超级管理员，默认拥有全部权限。</div>
          <div>3、给员工分配角色的流程。“新增角色”>【员工管理】页面，新增/编辑员工时“分配角色”。</div>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import scroll from '../../common/mixins/scroll.js'
export default {
  mixins: [scroll],
  data() {
    return {
      role: 1,
      data: [],
      query: {
        pageNo: 1
      },
      totalPage: 0,
      dialogShow: false
    }
  },
  methods: {
    handleLeft() {
      this.$router.replace('/index')
    },
    async getData() {
      let res = await this.$api.ROLE_LIST()
      if (res.status === 1) {
        this.data = res.list || []
      } else {
        console.log('获取角色列表失败。')
      }
    },
    toNewChargeActive() {
      this.$router.push('/addnewrole')
    },
    handlerTip() {
      this.dialogShow = true
    },
    beforeClose(action, done) {
      if (action === 'alert') {
        setTimeout(done, 1000)
      } else {
        done()
      }
    },
    goRoleDetail(item) {
      this.$router.push({
        name: 'RoleManageDetail',
        query: {
          currRoleInfoId: item.id
        }
      })
    }
  },
  activated() {
    this.getData()
  }
}
</script>

<style lang="less">
// 弹框的样式
.roleTanBox {
  background: #ffffff;
  .shuoming {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 20px 0;
    font-size: 18px;
    font-weight: 500;
  }
  .roleTanNrBox {
    width: 100%;
    padding: 0 15px 8px 15px;
    box-sizing: border-box;
    font-size: 14px;
    color: #333333;
    div {
      margin-bottom: 24px;
      line-height: 1.4;
    }
  }
  .van-dialog__footer {
    border-top: 1px solid #e8e8e8;
  }
  .van-dialog .van-button__text {
    font-size: 14px;
    border-top: 1px solid #f00;
  }
}
.van-dialog .van-button {
  border-top: 1px solid #e8e8e8;
  border-radius: 0;
}
.van-dialog .van-button__text {
  font-size: 16px;
}
.RoleManagementBox {
  .roleListBox {
    width: 100%;
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
    padding-left: 16px;
    background-color: #ffffff;
    box-sizing: border-box;
  }
  .roleList {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    background-color: #ffffff;
    border-bottom: 1px solid #e8e8e8;
  }
  .roleList:last-child {
    border-bottom: none;
  }
  .roleLeft {
    width: 90%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
  }
  .roleName {
    font-size: 18px;
    font-weight: 600;
    color: #333333;
    margin-bottom: 10px;
  }
  .roleRemarkBox {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #999999;
    max-width: 100%;
  }
  .roleRemarkNr {
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    -webkit-text-overflow: ellipsis;
    -moz-text-overflow: ellipsis;
    white-space: nowrap;
  }
  .roleRight {
    width: 30px;
    min-width: 30px;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #1690ff !important;
  }
  .navRightPic {
    width: 16px;
    height: 17px;
  }
}
</style>
