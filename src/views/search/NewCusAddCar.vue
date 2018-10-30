<template>
  <div class="NewCusAddCarBox">
    <v-header title="新增客户/车辆" :left-click="handleBack" ></v-header>
    <v-scroll-page top="44">
      <v-br height="20"></v-br>
      <div class="listBox" v-if="isCusMod">
        <v-cell-group >
          <v-cell title="手机号" input v-model="username" @click.native="isShow=false" type="tel" maxlength="11" required></v-cell>
          <v-cell title="客户名" input v-model="name" v-if="username.length==11" @click.native="isShow=false"></v-cell>
          <v-cell title="车牌号" :cursor="isShow" :text="licence" @click.native="isShow=true" disabled  :options="{textStyle:'float: left;text-align:left;padding-left:20px',placeholder:'请输入'}" ></v-cell>
        </v-cell-group>
      </div>
      <!-- <v-cell-group>
        <v-cell title="车牌号" input v-model="licence" @click.native="isShow=true" disabled></v-cell>
      </v-cell-group> -->
      <div class="listBox">
        <v-cell-group v-if="!isCusMod">
          <v-cell title="车牌号" :cursor="isShow" :text="licence" :options="{textStyle:'float: left;text-align:left;padding-left:20px',placeholder:'请输入'}"  @click.native="isShow=true" ></v-cell>
          <v-cell title="手机号" input v-model="username" @click.native="isShow=false" type="tel" maxlength="11"></v-cell>
          <v-cell title="客户名" input v-model="name" v-if="username.length==11"  @click.native="isShow=false"></v-cell>
        </v-cell-group>
      </div>
      <button class="queding" type="button" @click="save">保存</button>
    </v-scroll-page>
    <van-popup v-model="show" position="top" class="error-popup" :overlay="false">
      <v-icon name="icon-icon-"></v-icon> {{errorMsg}}
    </van-popup>
    <v-keyboard :is-show.sync='isShow' v-model="carId"></v-keyboard>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      errorMsg: '',
      username: '',
      name: '',
      licence: '',
      carId: [],
      src: '',
      isShow: false,
      id: ''
    }
  },
  watch: {
    carId: {
      handler(val) {
        this.licence = val.join('')
      }
    },
    show: {
      handler(val) {
        if (val) {
          setTimeout(() => {
            this.show = false
          }, 3000)
        }
      }
    }
  },
  computed: {
    isCusMod() {
      return this.src === 'chargeactive' || this.src === 'chargeticket'
    }
  },
  methods: {
    async save() {
      if (this.isCusMod) {
        if (this.username.length !== 11) {
          this.show = true
          this.errorMsg = '请输入正确的手机号'
          return
        }
      }
      if (this.licence && this.licence.length < 7) {
        this.show = true
        this.errorMsg = '请输入正确的车牌号'
        return
      } else if (!this.username && !this.licence) {
        this.show = true
        this.errorMsg = '请输入正确的车牌号和手机号'
        return
      } else if (this.username && this.username.length !== 11) {
        this.show = true
        this.errorMsg = '请输入正确的手机号'
        return
      }
      let res = await this.$api.MEMBER_MOTOR({
        username: this.username,
        name: this.name,
        licence: this.licence
      })
      if (res.status === 1) {
        this.$toast.success('新增成功')

        if (this.licence) {
          let data = res.data.motor
          if (res.data.member) {
            data.member = res.data.member
          }
          this.$store.commit('ORDER_OF_CAR', data)
        } else {
          let data = res.data.member
          this.$store.commit('ORDER_OF_CUSTOM', data)
        }
        if (this.src === 'kuaidan') {
          this.$router.replace('/cashdesk')
        } else if (this.src === 'kaidan') {
          this.$router.replace({ name: 'Kaidan' })
        } else if (this.src === 'chargeactive') {
          this.$router.replace({ name: 'ChargeActive', query: { id: this.id } })
        } else if (this.src === 'chargeticket') {
          this.$router.replace({ name: 'ChargeTicket', query: { id: this.id } })
        }
        this.username = ''
        this.name = ''
        this.licence = ''
      }
    },
    handleBack() {
      this.$router.back()
    }
  },
  activated() {
    if (this.$route.query.src) {
      this.src = this.$route.query.src
    }
    if (this.$route.query.id) {
      this.id = this.$route.query.id
    }
    this.carId = []
    this.licence = ''
  }
}
</script>

<style lang="less">
.NewCusAddCarBox{
  .error-popup {
    height: 44px;
    width: 100%;
    background: #ffb718;
    text-align: center;
    line-height: 44px;
    font-size: 14px;
    color: #fff;
    .icon {
      color: #fff !important;
    }
  }
  .listBox{
    background-color: #ffffff;
    margin: 0 8px;
    border-radius: 12px;
    overflow: hidden;
    .cb-cell-group{
      margin-bottom: 0;
      .c_cell_wrapper:last-child{
        .c_cell{
          background-image: none;
        }
      }
    }
    .cb-cell-group-border:after{
      background-image: none;
    }
  }
  .queding{
    margin: 0 auto;
    margin-top: 130px;
    width: 270px;
    height: 40px;
    border: none;
    border-radius: 20px;
    background-color: #1c93ff;
    color: #ffffff;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

</style>
