<template>
  <div>
    <v-header title="新增员工" righttext="保存" @right-click="handleRight" :left-click="handleLeft"></v-header>
    <v-scroll-page top="44" style="overflow-y:scroll">
      <v-br height="20"></v-br>
      <v-cell-group>
        <v-cell title="姓名" required input v-model="name"></v-cell>
        <v-cell title="手机号" required input v-model="username" type="tel" maxlength="11"></v-cell>
        <v-cell title="分配角色" required link :text="stRoleIds.length==0?'未分配':stRoleText" @click.native="toRole" v-if="type!=1"></v-cell>
      </v-cell-group>
      <v-more v-model="more"></v-more>
      <div v-show="more">
        <v-cell-group>
          <v-cell title="工号" input v-model="workNo"></v-cell>
          <v-cell title="性别">
            <div slot="text" style="text-align:left">
              <van-radio-group v-model="sex" class="yc-radio">
                <van-radio name="1" @click.native="sex='1'">男</van-radio>
                <van-radio name="2" @click.native="sex='2'">女</van-radio>
              </van-radio-group>
            </div>
          </v-cell>
        </v-cell-group>
        <v-cell-group>
          <v-cell title="身份证号" input v-model="idCard" maxlength="18"></v-cell>
          <v-cell title="联系地址" input v-model="areaDetail"></v-cell>
        </v-cell-group>
        <v-remark v-model="remarks"></v-remark>
      </div>
    </v-scroll-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      more: false,
      id: '',
      username: '',
      name: '',
      sex: '1',
      workNo: '',
      idCard: '',
      areaDetail: '',
      remarks: '',
      stRoleIds: [],
      stRoles: [],
      stRoleText: '',
      type: ''
    }
  },
  watch: {
    stRoles: {
      handler(val) {
        this.stRoleText = val
          .map(v => {
            return v.name
          })
          .join('、')
      },
      deep: true
    },
    id: {
      handler(val) {
        if (val) {
          this.getData()
        }
      }
    }
  },
  methods: {
    handleRight() {
      if (this.name === '') {
        this.$toast('请输入员工姓名')
      } else if (this.username === '') {
        this.$toast('请输入手机号')
      } else if (this.username.length !== 11) {
        this.$toast('请输入正确的手机号')
      } else if (this.stRoleIds.length === 0 && this.type !== '1') {
        this.$toast('请分配该员工角色')
      } else {
        this.save()
      }
    },
    toRole() {
      // 去分配角色把当前有的角色带过去，并把id带过去回传使用
      this.$router.push({
        name: 'fpjs',
        params: { stRoles: this.stRoles },
        query: { id: this.id }
      })
    },
    reSet() {
      this.id = ''
      this.name = ''
      this.username = ''
      this.sex = '1'
      this.workNo = ''
      this.idCard = ''
      this.areaDetail = ''
      this.remarks = ''
      this.stRoleIds = ''
      this.stRoles = []
    },
    async save() {
      let res = await this.$api.NEW_EMPLOYEE_SAVE({
        id: this.id,
        name: this.name,
        username: this.username,
        sex: this.sex,
        workNo: this.workNo,
        idCard: this.idCard,
        areaDetail: this.areaDetail,
        remarks: this.remarks,
        stRoleIds: this.stRoleIds
      })
      if (res.status === 1) {
        if (res.data && res.data.id) {
          this.$toast.success('保存成功')
          this.$store.commit('SET_REFRESH', true)
          this.$router.replace({
            name: 'yggl',
            params: { refresh: true }
          })
        }
        this.reSet()
      } else {
        this.$toast.fail('保存失败')
      }
    },
    handleLeft() {
      if (this.id) {
        this.$router.replace({
          name: 'yginfo',
          params: { refresh: true },
          query: { id: this.id }
        })
      } else {
        this.$router.replace('/yggl')
      }
      this.reSet()
    },
    async getData() {
      let res = await this.$api.EMPLOYEE_INFO({ id: this.id })
      if (res.status === 1) {
        this.name = res.data.name
        this.username = res.data.username
        this.sex = res.data.sex
        this.workNo = res.data.workNo
        this.idCard = res.data.idCard
        this.areaDetail = res.data.areaDetail
        this.remarks = res.data.remarks
        this.stRoles = res.data.stRoles || []
        this.type = res.data.type
        this.stRoleIds = this.stRoles.map(v => {
          return v.id
        })
        this.stRoleText = this.stRoles
          .map(v => {
            return v.name
          })
          .join('')
      }
    }
  },
  activated() {
    if (this.$route.params.choiceRoles) {
      // 获取回传的角色
      this.stRoles = this.$route.params.choiceRoles
      this.stRoleIds = this.$route.params.choiceRoles.map(v => {
        return v.id
      })
    }
    if (this.$route.query.id) {
      // 有id就存下来完成对应业务后再清空id
      this.id = this.$route.query.id
      this.more = true
    }
  }
}
</script>

<style lang="less">
.yc-radio {
  padding-left: 20px;
  .van-radio {
    display: inline-block;
    width: 80px;
  }
}
</style>
