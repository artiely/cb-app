<template>
  <div>
    <v-header title="员工详情" :righttext="data.type!='1'?'编辑':''" @right-click="handleRight" :left-click="handleLeft"></v-header>
    <v-scroll-page top="44" style="overflow-y:scroll">
      <v-br height="20"></v-br>
      <div class="yggl-info">
        <div class="userinfo-box">
          <div class="userinfo">
            <div class="user-icon user-icon-mamager" v-if="data.type=='1'">
              <span>
                <v-icon name="icon-xiaotubiao-49"></v-icon>
              </span>
            </div>
            <div class="user-icon" v-else>
              <span v-if="data.name">{{data.name.split('')[0]}}</span>
            </div>
            <div class="user-text">
              <div class="user-name">
                <span v-if="data.type=='1'">管理员</span>
                <span v-else-if="data.name">{{data.name}}</span>
                <!-- <span class="yggl-qiye" v-if="data.type=='1'">企业主</span> -->
              </div>
              <div class="user-tel">{{data.username|telFormat()}}</div>
            </div>
          </div>
        </div>
        <div class="yggl-detail">
          <div class="yggl-detail-info" v-for="item in detail" :key="item.id">
            <div class="yggl-detail-label">{{item.label}}</div>
            <div class="yggl-detail-value">{{item.value}}</div>
          </div>
        </div>
      </div>
      <v-br height="20"></v-br>
      <v-cell-group v-if="data.type!=1">
        <v-cell title="允许登录系统">
          <div slot="text" class="yggl-info-sw">
            <van-switch v-model="checked" @change="job" style="font-size:24px" />
          </div>
        </v-cell>
      </v-cell-group>
      <div>
        <div class="yggl-title">角色及权限</div>
        <!-- {{stRoles}} -->
        <!-- {{list}} -->
        <div class="yggl-card " :class="{'disabled':data.activeFlag=='0'}">
          <div class="yggl-card-title">
            <div v-if="stRoles&&stRoles.length>0">
              <div class="yggl-role-btn" v-for="item in stRoles" :key="item.id">{{item.name}}</div>
            </div>
            <div v-else-if="data.type=='1'">
              <div class="yggl-role-btn">管理员</div>
            </div>
            <div v-else class="yggl-card " style="padding:10px">
              暂无角色，请点击编辑添加
            </div>
          </div>
          <div class="yggl-card-body">
            <div class="yggl-rule-btn" v-for="item in list" :key="item.id">{{item.name}}</div>
          </div>
        </div>

      </div>
      <v-remark disabled v-model="remarks" v-if="remarks"></v-remark>
      <div style="padding:40px">
        <div class="outline" style="border:1px solid #d73962;color:#d73962;text-align:center" v-if="data.type!=1" @click="toDel">删除该员工</div>
      </div>
    </v-scroll-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: false,
      data: '',
      remarks: '',
      detail: [],
      stRoles: [],
      refresh: false,
      id: ''
    }
  },
  methods: {
    handleRight() {
      if (this.data && this.data.type !== '1') {
        this.$router.push({ name: 'xzyg', query: { id: this.id } })
      }
    },
    handleLeft() {
      this.$router.replace({ name: 'yggl', params: { refresh: this.refresh } })
    },
    async getData() {
      let res = await this.$api.EMPLOYEE_INFO({ id: this.id })
      if (res.status === 1) {
        this.data = res.data
        this.checked = res.data.activeFlag === '1'
        if (res.data.type === '1') {
          this.detail = [
            {
              label: '最近登录时间',
              value: this.$options.filters.timeFormat(res.data.loginTime)
            },
            {
              label: '创建时间',
              value: this.$options.filters.timeFormat(res.data.createDate)
            }
          ]
        } else {
          this.detail = [
            { label: '工号', value: res.data.workNo },
            { label: '性别', value: res.data.sex === '1' ? '男' : '女' },
            {
              label: '最近登录时间',
              value: this.$options.filters.timeFormat(res.data.loginTime)
            },
            {
              label: '创建时间',
              value: this.$options.filters.timeFormat(res.data.createDate)
            },
            { label: '创建人', value: res.data.createBy },
            {
              label: '更新时间',
              value: this.$options.filters.timeFormat(res.data.updateDate)
            },
            { label: '更新人', value: res.data.updateBy }
          ]
        }
        this.stRoles = res.data.stRoles
        this.remarks = res.data.remarks
        this.list = res.list
      }
    },
    async job() {
      let res = await this.$api.EMPLOYEE_ACTIVE({ id: this.id })
      if (res.status === 1) {
        this.$toast.success('操作成功')
        this.refresh = true
      } else {
        this.$toast.fail('操作失败')
      }
      this.getData()
    },
    async del() {
      let res = await this.$api.EMPLOYEE_DEL({ id: this.id })
      if (res.status === 1) {
        this.$toast.success('删除成功')
        this.$router.replace({ name: 'yggl', params: { refresh: true } })
      } else {
        this.$toast.fail('删除失败')
      }
    },
    toDel() {
      this.$dialog
        .confirm({
          title: '确定删除？',
          message: '删除后不可恢复'
        })
        .then(() => {
          // on confirm
          this.del()
        })
        .catch(() => {
          // on cancel
        })
    }
  },
  activated() {
    this.refresh = false
    if (this.$route.params.refresh) {
      this.refresh = this.$route.params.refresh
    }
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getData()
    }
  }
}
</script>

<style lang="less">
.user-icon-mamager {
  background: #333 !important;
  .icon {
    font-size: 44px;
    color: #fff !important;
  }
}
.yggl-qiye {
  font-size: 14px;
  color: #fff;
  padding: 2px 4px;
  background: #ffb718;
  border-radius: 2px;
}
.yggl-rule-btn {
  height: 24px;
  line-height: 24px;
  padding: 0 6px;
  border-radius: 4px;
  background: #e8e8e8;
  color: #333;
  display: inline-block;
  font-size: 14px;
  margin-bottom: 10px;
  margin-right: 20px;
}
.yggl-role-btn {
  background: #333;
  font-size: 20px;
  font-weight: 500;
  margin-right: 20px;
  height: 28px;
  line-height: 28px;
  padding: 0 6px;
  border-radius: 4px;
  display: inline-block;
  color: #fff;
  margin-bottom: 5px;
  margin-top: 5px;
}
.yggl-card {
  width: 95%;
  margin: 0 auto;
  background: #fff;
  padding-left: 16px;
  border-radius: 10px;
  .yggl-card-title {
    border-bottom: 1px solid #eee;
    padding: 8px 0;
  }
  .yggl-card-body {
    padding-top: 20px;
    padding-bottom: 10px;
  }
  &.disabled {
    .yggl-rule-btn {
      background: #c7c7c7;
      color: #fff;
    }
    .yggl-role-btn {
      background: #c7c7c7;
      color: #fff;
    }
  }
}
.yggl-title {
  font-size: 16px;
  color: #999;
  font-weight: 500;
  padding-bottom: 10px;
  padding-left: 15px;
}
.yggl-info-sw {
  padding-top: 8px;
}
.yggl-info {
  background: #fff;
}
.yggl-detail {
  background: #fff;
  padding: 10px 0;
}
.yggl-detail-info {
  display: flex;
  padding: 0 15px;
  line-height: 2;
  .yggl-detail-label {
    max-width: 120px;
    font-size: 16px;
    color: #999;
    text-align: left;
  }
  .yggl-detail-value {
    flex: 1;
    font-size: 16px;
    color: #333;
    text-align: right;
  }
}
.userinfo-box {
  padding-left: 15px;
  .userinfo {
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    display: flex;
    .user-icon {
      width: 50px;
      height: 50px;
      margin-right: 15px;
      background: #c7c7c7;
      text-align: center;
      font-size: 35px;
      line-height: 50px;
      color: #fff;
      border-radius: 50%;
    }
    .user-text {
      flex: 1;
    }
    .user-name {
      padding-top: 4px;
      font-size: 18px;
      color: #333;
      font-weight: 500;
    }
    .user-tel {
      font-size: 18px;
      padding-top: 4px;
      color: #333;
    }
  }
}
</style>