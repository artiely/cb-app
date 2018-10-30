<template >
  <div class="feedback">
    <v-header title="我要吐槽" righttext="提交" @right-click="confirm"></v-header>
    <div class="c-scroll-wrapper-top">
      <div style="padding:10px" class="shits-radio">
        <van-radio-group v-model="radio">
          <van-radio name="1" style="display:inline">意见反馈</van-radio>
          <van-radio name="2" style="display:inline">产品问题</van-radio>
        </van-radio-group>
      </div>
      <textarea name="" id="" cols="30" rows="10" class="shits-text" placeholder="请输入" v-model="text"></textarea>
    </div>
    <!-- <v-footer>
      <v-footer-item @click.native="confirm">确定</v-footer-item>
    </v-footer> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      radio: '1',
      text: ''
    }
  },
  methods: {
    async confirm() {
      if (this.text) {
        let res = await this.$api.FEEDBACK({ type: this.radio, content: this.text })
        if (res.status === 1) {
          this.$toast.success('多谢反馈')
          this.text = ''
          this.$router.back()
        }
      } else {
        this.$toast.fail('请填写内容')
      }
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
.shits-radio{
  font-size: 14px;
  .van-radio__label{
    padding-right: 20px;
  }
}
.feedback {
  background: #ffffff;
}
.forget-password {
  text-align: right;
  font-size: 14px;
  padding: 15px;
  color: @primary;
}
.shits-text {
  display: block;
  padding: 8px;
  width: 90%;
  background: #f8f8f8;
  margin: 0 auto;
}

</style>
