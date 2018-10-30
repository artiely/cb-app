<template>
  <div>
    <v-header title="企业信息" righttext="保存" @right-click="save"></v-header>
    <v-scroll-page top="64">
      <v-cell-group>
        <v-cell title="企业简称" v-model="shortname" input></v-cell>
        <v-cell title="企业全称" v-model="name" input></v-cell>
        <v-cell title="企业负责人" v-model="ownerEmployee" input></v-cell>
        <v-cell title="负责人电话" v-model="servicePhone" input type="tel" maxlength="11"></v-cell>
      </v-cell-group>
    </v-scroll-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      smsNum: 0,
      shortname: '',
      name: '',
      ownerEmployee: '',
      servicePhone: '',
      id: ''
    }
  },
  methods: {
    async getinfo() {
      let res = await this.$api.COMPANY_INFO()
      if (res.status === 1) {
        this.shortname = res.data.shortname
        this.name = res.data.name
        this['ownerEmployee'] = res.data.ownerEmployee.name
        this.shortname = res.data.shortname
        this.servicePhone = res.data.ownerEmployee.mobile
        this.id = res.data.id
      }
    },
    async save() {
      let data = {
        id: this.id,
        name: this.name,
        shortname: this.shortname,
        'ownerEmployee.name': this.ownerEmployee,
        servicePhone: this.servicePhone
      }
      let res = await this.$api.COMPANY_SAVE(data)
      if (res.status === 1) {
        this.$toast.success('保存成功')
        this.$router.back()
      }
    }
  },
  activated() {
    this.getinfo()
  }
}
</script>

<style scoped>
</style>