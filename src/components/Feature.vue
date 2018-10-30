
<template>
  <div style="background:#fff;border-radius:10px;overflow:hidden">
    <div class="index-grid-box" v-for="(item,index) in menuNav" :key="index">
      <div class="index-grid" v-for="(it,i) in item" @click="pathTo(it)"  :key="i">
        <div class="item-box"  v-if="it">
          <div class="item-icon" :style="{'backgroundColor':it.bgColor}">
            <span style="position:relative">
              <v-icon :name="it.icon" :color="it.color" :style="it.num?'margin-left:8px':''"></v-icon>
              <v-dot v-if="it.num" :number="it.num" />
            </span>
          </div>
          <p class="item-text">{{it.text}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'feature',
  computed: {
    num() {
      let num = this.$store.state.sys.messages || []
      let unRead = num.filter(v => {
        if (v.isRead === '0') {
          return v
        }
      })
      return unRead.length
    },
    smsNum() {
      return this.$store.state.sys.smsNum
    },
    menuNav() {
      let menu = this.$store.state.sys.menuNav
      var c = []
      for (let i = 0; i < menu.length / 3; i++) {
        c[i] = []
        for (let j = 0; j < 3; j++) {
          c[i][j] = menu[i * 3 + j]
        }
      }
      return c
    }
  },
  watch: {
    // num: {
    //   handler(val) {
    //     this.json = this.json.map(v => {
    //       if (v.name === 'Message') {
    //         v.num = val
    //       }
    //       return v
    //     })
    //   },
    //   immediate: true
    // },
    // smsNum: {
    //   handler(val) {
    //     this.json = this.json.map(v => {
    //       if (v.name === 'SMS') {
    //         v.num = val
    //       }
    //       return v
    //     })
    //   },
    //   immediate: true
    // }
  },
  methods: {
    pathTo(it) {
      if (it.disabled) {
        this.$toast.fail('敬请期待')
        return
      }
      this.$router.push({
        name: it.name,
        params: {
          params: it.params
        }
      })
    }
  },
  mounted() {},
  activated() {
  }
}
</script>
<style lang="less">
.index-grid-box {
  display: flex;
}
.index-grid {
  display: flex;
  flex: 1;
  padding-top: 30px;
}
.item-box {
  width: 100%;
}
.item-icon {
  width: 48px;
  height: 48px;
  line-height: 48px;
  margin: 0 auto;
  text-align: center;
  border-radius: 50%;
  background: #5db1ff;
  .icon {
    font-size: 26px;
  }
}
.item-text {
  line-height: 2;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  padding-bottom: 8px;
  color:#666;
}
</style>
