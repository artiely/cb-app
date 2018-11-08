<template>
  <!-- 新增客户 -->
  <div class="new-custom">
    <v-header :title="title">
      <div slot="righttext" @click="save()">保存</div>
    </v-header>
    <div class="c-scroll-wrapper-top">
      <v-br :height="20"></v-br>
      <v-cell-group>
        <v-cell title="手机号" input required v-model="query.username" maxlength="11" type="tel"></v-cell>
        <v-cell title="客户名" input v-model="query.name" maxlength="10"></v-cell>
      </v-cell-group>
      <v-more v-model="more"></v-more>
      <div v-show="more">
        <v-cell-group>
          <v-cell title="公司" input v-model="query.invoiceTitle"></v-cell>
          <v-cell title="编码" input v-model="query.code"></v-cell>
          <!-- <v-cell title="性别">
            <div slot="text" style="text-align:left">
              <van-radio-group v-model="sex" class="yc-radio">
                <van-radio name="1">男</van-radio>
                <van-radio name="2">女</van-radio>
              </van-radio-group>
            </div>
          </v-cell> -->
          <!--  -->
          <v-cell title="性别" required link :text="sex === '1'?'男':'女'" @click.native="sexFn"></v-cell>
          <!--  -->
          <v-cell title="标签" class="tagCell" @click.native="show=true" link :text="choiceTag.name"></v-cell>
        </v-cell-group>
        <v-remark v-model="remarks"></v-remark>
        <v-br height="20"></v-br>
        <v-cell-group v-if="this.$route.query.memberId">
          <v-cell title="修改支付密码" class="change-pay-password editblue" link @click.native="toNewPassword"></v-cell>
          <v-cell title="将该客户移黑名单" class="blacklist" @click.native="delFunc"></v-cell>
        </v-cell-group>
      </div>
    </div>
    <!-- 添加标签或选择标签 -->
    <van-popup v-model="show" style="width:100%;height:100%;background:#f0f0f0;" position="right">
      <v-header title="标签" :leftClick="handleLeft">
        <div slot="righttext" @click="saveTag(1)">确定</div>
      </v-header>
      <div class="c-scroll-wrapper-top">
        <v-br></v-br>
        <v-cell-group>
          <v-cell :input="true" v-model="currTag.name" placeholder="请输入新标签名称" maxlength="5"></v-cell>
        </v-cell-group>
        <v-cell-group>
          <v-badge class="customTag" color="#e6bd81" v-for="item in data" :key="item.id" @click.native="setCurrTag(item)">{{item.name}}</v-badge>
          <v-cell title="客户标签设置" class="tagSetting" v-model="query.tag" @click.native="tagShow=true"></v-cell>
        </v-cell-group>
      </div>
    </van-popup>
    <!-- 客户标签设置 -->
    <van-popup v-model="tagShow" style="width:100%;height:100%;background:#f0f0f0;" position="right" :lock-scroll="false">
      <v-header title="客户标签设置" :leftClick="handleLeftTag">
      </v-header>
      <div class="c-scroll-wrapper-top">
        <v-br></v-br>
        <van-cell-group>
          <v-scroll-page top="44">
            <cube-scroll :data="data" class="vancellListBox">
              <van-cell :title="item.name" is-link :label="item.remarks" v-for="item in data" :key="item.id" @click.native="setInfo(item)" />
            </cube-scroll>
          </v-scroll-page>
        </van-cell-group>
      </div>
    </van-popup>
    <!-- 编辑标签/标签信息 -->
    <van-popup v-model="tagInfo" style="width:100%;height:100%;background:#f0f0f0;" position="right">
      <v-header title="标签信息" :leftClick="handleLeftTagInfo">
        <div slot="righttext" @click="saveTag(2)">保存</div>
      </v-header>
      <div class="c-scroll-wrapper-top-bottom">
        <v-br></v-br>
        <v-cell-group>
          <v-cell title="标签名称" input v-model="currTag.name" maxlength="5"></v-cell>
        </v-cell-group>
        <v-remark v-model="currTag.remarks"></v-remark>
        <div style="padding:15px">
          <button class="outline" style="border:#d73962;color:#d73962;" @click="del(item)">删除</button>
        </div>
      </div>
    </van-popup>
    <!-- 卡种 -->
    <van-actionsheet v-model="customSexShow" :actions="dateactions" class="my-actionsheet">
      <div class="actionsheet-box-wrapper">
        <div class="actionsheet-box actionsheet-box-title">
          请选择性别
        </div>
        <div class="actionsheet-box actionsheet-box-border" @click="sel_man">
          男
        </div>
        <div class="actionsheet-box" @click="sel_woman">
          女
        </div>
      </div>
      <v-br></v-br>
      <div class="actionsheet-box-wrapper" @click="customSexShow=false">
        <div class="actionsheet-box actionsheet-box-cancel">
          取消
        </div>
      </div>
    </van-actionsheet>
    <!-- 新建成功 -->
    <van-dialog v-model="addOkShow" show-cancel-button confirmButtonText="现在添加车辆" cancelButtonText='以后添加车辆' :before-close="beforeCloseOK">
      <div style="font-size:20px;text-align:center;line-height:48px;display:flex;padding:20px 0">
        <span style="flex:1"><img :src="require('../../../assets/img/ok.svg')" style="vertical-align: bottom;">客户保存成功</span>
      </div>
    </van-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '新增客户',
      show: false,
      tagShow: false,
      tagInfo: false,
      motorId: '',
      memberId: '',
      addOkShow: false,
      choiceTag: {},
      sex: '1',
      query: {
        name: '',
        username: '',
        code: '',
        id: ''
      },
      remarks: '',
      currTag: {
        name: '',
        remarks: '',
        id: ''
      },
      cate: 1,
      more: false,
      data: [],
      customSexShow: false
    }
  },
  methods: {
    toNewPassword() {
      this.$router.replace({
        name: 'CusNewPassword',
        query: { id: this.$route.query.memberId }
      })
    },
    beforeCloseOK(action, done) {
      if (action === 'confirm') {
        done()
        // 添加客户
        this.$router.push({
          name: 'NewCar',
          query: {
            memberId: this.memberId
          }
        })
      } else {
        done()
        this.$router.replace({ name: 'Detail', query: { id: this.memberId } })
      }
    },
    delFunc() {
      this.$dialog
        .confirm({
          title: '确定移至黑名单吗？',
          message: '移除后，该客户将无法恢复，其名下车辆将各自成为无主车辆'
        })
        .then(async () => {
          let res = await this.$api.CUSTOM_DEL({
            id: this.$route.query.memberId
          })
          if (res.status === 1) {
            this.$toast.success('删除成功')
            this.$router.replace({ name: 'Custom', params: { refresh: true } })
          } else {
            this.$toast.fail('删除失败')
          }
        })
        .catch(() => {
          // on cancel
        })
    },
    setInfo(item) {
      this.currTag = item
      this.tagInfo = true
    },
    setCurrTag(item) {
      this.choiceTag = item
      this.show = false
    },

    async save() {
      if (this.query.username.length !== 11) {
        this.$toast.fail('请输入正确的手机号')
        return
      }
      let data = {
        username: this.username,
        name: this.name,
        'memberTag.id': this.choiceTag.id,
        remarks: this.remarks,
        'motor.id': this.$route.query.memberId ? '' : this.motorId,
        sex: this.sex,
        ...this.query
      }

      let res = await this.$api.ADD_NEW_CUSTOM(data)
      if (res.status === 1) {
        // this.$toast.success('保存成功')
        this.memberId = res.data.id
        if (this.motorId) {
          this.$toast.success('保存成功')
          this.$router.replace({ name: 'Detail', query: { id: this.memberId } })
        } else {
          this.addOkShow = true
        }
        this.query = {
          username: '',
          name: ''
        }
        this.sex = '1'
        this.remarks = ''
        this.currTag = {
          name: '',
          remarks: '',
          id: ''
        }
      } else {
        console.error(`保存失败${res}`)
      }
    },

    async saveTag(type) {
      if (type === 1 && this.currTag.name === '') {
        this.$toast('请输入新标签名称或选择已有标签')
        return
      }
      let res = await this.$api.ADD_NEW_TAG(this.currTag)
      if (res.status === 1) {
        this.$toast.success('设置成功')
        this.getData().then(() => {
          this.choiceTag = this.data[0]
          this.currTag.name = ''
          this.currTag.remarks = ''
          this.currTag.id = ''
          if (type === 1) {
            this.show = false
          } else {
            this.tagInfo = false
          }
        })
      }
    },
    del(item) {
      this.$dialog
        .confirm({
          title: '确定删除吗?',
          message: '删除后已标记该标签的客户不受影响。',
          confirmButtonText: '确定'
        })
        .then(async () => {
          // on confirm
          let res = await this.$api.DEL_TAG(this.currTag)
          if (res.status === 1) {
            this.$toast.success('删除成功')
            this.getData().then(() => {
              this.currTag = this.data[0]
              this.tagInfo = false
            })
          }
        })
        .catch(() => {
          // on cancel
        })
    },
    getData() {
      return new Promise(async (resolve, reject) => {
        let res = await this.$api.CUSTOM_TAG_LIST({ pageNo: 1, pageSize: 40 })
        if (res.status === 1) {
          this.data = res.page.list || []
        } else {
          console.error(`获取列表失败${res.stateMessage}`)
        }
        resolve()
      })
    },
    async getMeberData() {
      let res = await this.$api.CUSTOM_DETAIL({
        id: this.$route.query.memberId
      })
      if (res.status === 1) {
        this.query.name = res.data.name
        this.query.username = res.data.username
        this.query.code = res.data.code
        this.sex = res.data.sex
        this.query.invoiceTitle = res.data.invoiceTitle
        this.choiceTag.name =
          res.data.memberTag && res.data.memberTag.name
            ? res.data.memberTag.name
            : ' '
        this.choiceTag.id =
          res.data.memberTag && res.data.memberTag.id
            ? res.data.memberTag.id
            : ' '
        this.currTag.name =
          res.data.memberTag && res.data.memberTag.name
            ? res.data.memberTag.name
            : ' '
        this.currTag.id =
          res.data.memberTag && res.data.memberTag.id
            ? res.data.memberTag.id
            : ' '
        this.query.id = res.data.id
        this.remarks = res.data.remarks
      }
    },
    handleLeft() {
      this.show = false
    },
    handleLeftTag() {
      this.tagShow = false
    },
    handleLeftTagInfo() {
      this.tagInfo = false
    },
    toNewTag() {
      this.$router.push('/newtag')
    },
    toTagSetting() {
      this.$router.push('/tagsetting')
    },
    sexFn() {
      this.customSexShow = true
    },
    sel_man() {
      this.sex = '1'
      this.customSexShow = false
    },
    sel_woman() {
      this.sex = '2'
      this.customSexShow = false
    }
  },
  activated() {
    this.more = false
    this.getData()
    if (this.$route.query.memberId) {
      this.title = '编辑客户'
      this.getMeberData()
    } else {
      this.motorId = this.$route.query.motorId ? this.$route.query.motorId : ''
      this.query.name = ''
      this.query.username = ''
      this.query.code = ''
      this.sex = '1'
      this.query.invoiceTitle = ''
      this.currTag.name = ''
      this.query.id = ''
      this.title = '新增客户'
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/style/var';
.new-custom {
  .c-scroll-wrapper-top {
    overflow-y: scroll;
  }
  .moreInfo {
    text-align: center;
    color: #999;
    .iconfont {
      font-size: 5px;
      color: #999;
      font-weight: bold;
    }
  }
  .yc-radio {
    padding-left: 20px;
    .van-radio {
      display: inline-block;
      width: 80px;
    }
  }

  .change-pay-password {
    .v-cell__title {
      color: @primary;
    }
  }
  .del-custom {
    background: #ffffff !important;
    color: #c7c7c7 !important;
  }
  .editblue {
    .c_cell {
      .title {
        color: #1690ff;
      }
    }
  }
  .blacklist {
    .c_cell {
      .title {
        color: #d73962;
      }
    }
  }
  .vancellListBox{
    .van-hairline::after{
      border: none !important;
    }  
  }
}
.tagCell {
  .text {
    span {
      padding-left: 20px !important;
    }
  }
}

.tagSetting {
  color: #1690ff !important;
  display: block;
  .title {
    color: #1690ff !important;
  }
}
.outline {
  border: 1px solid #d73962 !important;
}
.outline:active {
  color: #fff !important;
  background: #d73962 !important;
}
</style>
