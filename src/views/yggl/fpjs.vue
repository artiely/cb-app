<template>
  <div>
    <v-header title="分配角色" righttext="确定" @right-click="handleRight"></v-header>
    <v-scroll-page top="44" style="overflow-y:scroll">
      <v-br height="20"></v-br>
      <div class="role-box">
        <div class="role-box-title">
          【{{data.name}}】的角色
        </div>
        <div class="role-box-body">
          <div class="role-box-no" v-if="roleList&&roleList.length==0">
            <span>本店未设置角色，
              <a @click="toRole">去设置</a>
            </span>
          </div>
          <van-checkbox-group v-model="result" v-else style="margin:0">
            <div class="role-cell-item clearfix" v-for="(item, index) in roleList" @click="toggle(index)" :key="item.id">
              <span class="fl">{{item.name}}</span>
              <span class="fr">
                <van-checkbox :key="item.id" :name="item.id" ref="checkboxes">
                </van-checkbox>
              </span>
            </div>
            <div class="add-new-role">
              <span @click="toRole">
                <v-icon name="icon-add_bg"></v-icon> 新增角色</span>
            </div>
          </van-checkbox-group>
        </div>
      </div>

    </v-scroll-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: '',
      result: [],
      roleList: [],
      stRoles: [],
      id: ''
    }
  },
  methods: {
    toggle(index) {
      this.$refs.checkboxes[index].toggle()
    },
    toRole() {
      this.$router.replace({ name: 'AddNewRole', query: { src: 'fpjs' } })
    },
    handleRight() {
      // 点击确定吧选的角色带回去，并把id传回去
      let choiceRoles = this.roleList.filter(v => {
        let has = function(el) {
          return el === v.id
        }
        return this.result.some(has)
      })
      console.log(choiceRoles)
      this.$router.replace({
        name: 'xzyg',
        query: { id: this.id },
        params: { choiceRoles: choiceRoles }
      })
    },
    async getRoles() {
      let res = await this.$api.STORE_ROLE_LIST()
      if (res.status === 1) {
        this.roleList = res.list || []
        this.data = res.data
        this.result = this.roleList
          .filter(v => {
            let has = function(el) {
              return el.id === v.id
            }
            return this.stRoles.some(has)
          })
          .map(v => {
            return v.id
          })
        // this.$forceUpdate()
      }
    }
  },
  activated() {
    this.getRoles()
    if (this.$route.params.stRoles) {
      // 已经选中的角色 已有params 存起来，没有的时候不清空，因为进入新增角色回来的时候就没有params了，只有在点确定的时候清空（也可以不清空，因为每次进来都会被重新赋值）
      this.stRoles = this.$route.params.stRoles
    }
    if (this.$route.query.id) {
      this.id = this.$route.query.id
    } else {
      this.id = ''
    }
  }
}
</script>

<style  lang="less">
.add-new-role {
  font-size: 16px;
  color: #1690ff;
  position: absolute;
  bottom: -40px;
  line-height: 40px;
  right: 0;
  .icon {
    font-size: 20px;
    color: #1690ff !important;
  }
}
.role-cell-item {
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: #666;
  padding-right: 15px;
  border-bottom: 1px solid #eee;
}
.role-box {
  width: 95%;
  margin: 0 auto;
  padding-left: 15px;
  background: #fff;
  border-radius: 10px;
  position: relative;
  .role-box-title {
    padding: 6px;
    font-size: 18px;
    color: #333;
    font-weight: 600;
    line-height: 1.3;
    border-bottom: 1px solid #c7c7c7;
  }
  .role-box-body {
    min-height: 100px;
    .role-box-no {
      color: #c7c7c7;
      font-size: 16px;
      text-align: center;
      line-height: 100px;
      a {
        color: #1690ff;
        text-decoration: underline;
      }
    }
  }
}
</style>