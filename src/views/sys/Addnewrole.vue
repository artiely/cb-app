<template>
  <div class="AddnewroleBox">
    <v-header title="新增角色" :border="true" :isBack="true" :left-click="handleLeft" righttext="保存" @right-click="save">
    </v-header>
    <div class="c-scroll-wrapper-top" style="background: #f0f0f0;">
      <v-br :height="20"></v-br>
      <v-cell-group style="margin-bottom:5px">
        <v-cell title="角色名称" input required v-model="query.name" type="text" maxlength="7"></v-cell>
      </v-cell-group>
      <v-remark v-model="query.remarks"></v-remark>
      <v-br :height="30"></v-br>
      <div class="selBox">
        <div class="selTable">手机端权限</div>
        <div class="selAllBox" @click="tapAllCheck">
          <van-checkbox v-model="allChecked" label-position="left">全选</van-checkbox>
        </div>
      </div>
      <!-- 测试用户权限选择 -->
      <van-checkbox-group v-model="result" class="checkListBox">
        <div class="role-cell-item clearfix" v-for="(item, index) in allAuthList" @click="toggle(index)" :key="item.id">
          <span class="fl">{{item.name}}</span>
          <span class="fr">
            <van-checkbox :key="item.id" :name="item.id" ref="checkboxes">
            </van-checkbox>
          </span>
        </div>
      </van-checkbox-group>
      <!-- 测试结束处 -->
      <!-- 删除该角色 -->
      <!-- <div class="btnBox">
        <button class="del" type="button" @click="deleteFunc">删除该角色</button>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: {
        id: '',
        name: '',
        appMenuIds: [],
        remarks: ''
      },
      roleName: '',
      getDetailData: {},
      shigongShow: true,
      id: '',
      allSellData: 0,
      allChecked: false,
      allAuthList: [],
      result: [],
      src: ''
    }
  },
  watch: {
    allChecked: {
      handler(allCheckedVal) {
        if (allCheckedVal === true) {
          // this.result = this.allAuthList
          for (let i = 0; i < this.allAuthList.length; i++) {
            this.result[i] = this.allAuthList[i].id
          }
        } else if (allCheckedVal === false) {
          if (this.allSellData === 1) {
            this.result = []
            this.allSellData = 0
          }
        }
      }
    },
    result: {
      handler(val) {
        // console.log('数组val =', val)
        let s = this.equar(this.result, this.allAuthList)
        if (
          s === true &&
          this.result.length !== 0 &&
          this.allAuthList.length !== 0
        ) {
          this.allChecked = true
        } else if (s === false) {
          this.allChecked = false
        }
      }
    }
  },
  methods: {
    async save() {
      this.query.appMenuIds = this.result
      // console.log('保存接口中检测result的值 =', this.result)
      if (this.query.name === '') {
        this.$toast('请输入角色名称。')
        return false
      }
      if (this.query.appMenuIds.length === 0) {
        this.$toast('请选择权限。')
        return false
      }
      // console.log('params =', JSON.stringify(this.query))
      let res = await this.$api.ROLE_SAVE(this.query)
      if (res.status === 1) {
        this.$toast('角色创建成功。')
        if (this.src === 'fpjs') {
          this.$router.replace({ name: 'fpjs' })
        } else {
          this.$router.back()
        }
      } else {
        console.log('角色保存接口请求失败。')
      }
    },
    async getDetailInfoFunc() {
      let res = await this.$api.ROLE_DETAIL({ id: this.query.id })
      if (res.status === 1) {
        // console.log('成功', res)
        this.getDetailData = res.data
        this.allAuthListFunc()
        this.upDate(this.getDetailData)
      } else {
        console.log('角色详情接口请求失败。')
        // this.$toast('角色详情接口请求失败。')
      }
    },
    async allAuthListFunc() {
      let res = await this.$api.ROLE_MENU({ id: this.query.id })
      if (res.status === 1) {
        // console.log('当前所有的角色列表', res)
        this.allAuthList = []
        this.allAuthList = res.list
      } else {
        console.log('角色列表接口请求失败。')
        // this.$toast('角色列表接口请求失败。')
      }
    },
    upDate(currData) {
      // 更新当前数据
      // console.log('currData =', currData)
      this.query.name = currData.name
      this.query.remarks = currData.remarks
      this.result = []
      for (let i = 0; i < currData.stAppMenus.length; i++) {
        this.result[i] = currData.stAppMenus[i].id
      }
      // console.log('当前的result值 =', this.result)
    },
    tapAllCheck() {
      // console.log('点击全选按钮')
      if (this.allSellData === 0) {
        this.allSellData = 1
        this.result = []
        // this.result = this.allAuthList
        for (let i = 0; i < this.allAuthList.length; i++) {
          this.result[i] = this.allAuthList[i].id
        }
        // console.log('所有的name值 =', this.result)
      } else if (this.allSellData === 1) {
        this.allSellData = 0
        this.result = []
      }
    },
    toggle(index) {
      this.allSellData = 0
      this.$refs.checkboxes[index].toggle()
    },
    equar(a, b) {
      // 判断数组的长度
      if (a.length !== b.length) {
        return false
      } else {
        // 循环遍历数组的值进行比较
        for (let i = 0; i < a.length; i++) {
          for (let j = 0; j < b.length; j++) {
            if (a[i] === b[j].id) {
              return true
            }
          }
        }
        return true
      }
    },
    isClear() {
      this.roleName = ''
      this.getDetailData = ''
      this.shigongShow = true
      this.id = ''
      this.allSellData = 0
      this.allChecked = false
      this.allAuthList = []
      this.result = []
      this.query.name = ''
      this.query.id = ''
      this.query.appMenuIds = []
      this.query.remarks = ''
    },
    handleLeft() {
      if (this.src === 'fpjs') {
        this.$router.replace('/fpjs')
      } else {
        this.$router.replace('/rolemanagement')
      }
    }
  },
  mounted() {
    this.query.id = this.$route.query.currRoleManageDetailId
    // console.log('编辑页中mounted的id =', this.id)
  },
  activated() {
    this.isClear()
    this.query.id = this.$route.query.currRoleManageDetailId
    // console.log('编辑页中activated的id =', this.query.id)
    // this.getDetailInfoFunc()
    this.allAuthListFunc()
    if (this.$route.query.src) {
      this.src = this.$route.query.src
    } else {
      this.src = ''
    }
  }
}
</script>

<style lang="less">
.AddnewroleBox {
  .c-scroll-wrapper-top {
    overflow-y: scroll;
  }
  .selBox {
    width: 100%;
    padding: 10px 15px 10px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    color: #999999;
  }
  .selTable {
    font-size: 15px;
  }
  .selAllBox {
    display: flex;
    color: #1690ff;
    font-size: 16px;
  }
  .selTitle {
    margin-right: 8px;
    font-size: 15px;
  }
  .iconSize {
    width: 20px;
    height: 20px;
  }
  .btnBox {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 40px 53px 10px 53px;
    //  border: 1px solid #f00;
    height: 40px;
  }
  .del {
    width: 100%;
    border: 1px solid #d73962;
    color: #d73962;
    background-color: #ffffff;
    border-radius: 20px;
    height: 40px;
    font-size: 16px;
  }
  .checkListBox {
    margin: 0;
    padding-left: 16px;
    background-color: #ffffff;
    .role-cell-item {
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      color: #333333;
      padding-right: 15px;
      border-bottom: 1px solid #eee;
      background-color: #fff;
    }
    .role-cell-item:last-child {
      border-bottom: none;
    }
  }
}
</style>

