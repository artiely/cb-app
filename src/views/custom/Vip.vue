<template>
  <div>
    <v-header title="购买"></v-header>
    <div class="vip_scroll_wrapper">
      <div>
        <cube-slide ref="slide" :data="items" @change="changePage" :auto-play="false" :loop="false">
          <cube-slide-item v-for="(item, index) in items" :key="index" @click.native="clickHandler(item, index)" :class="{'noCurrent':current!==index}">
            <div class="pic">
              123123333333333333333333333333 {{item.url}}
            </div>
          </cube-slide-item>
        </cube-slide>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      current: 0,
      items: [
        {
          url: 'http://www.didichuxing.com/',
          image:
            '//webapp.didistatic.com/static/webapp/shield/cube-ui-examples-slide01.png'
        },
        {
          url: 'http://www.didichuxing.com/',
          image:
            '//webapp.didistatic.com/static/webapp/shield/cube-ui-examples-slide02.png'
        },
        {
          url: 'http://www.didichuxing.com/',
          image:
            '//webapp.didistatic.com/static/webapp/shield/cube-ui-examples-slide03.png'
        }
      ]
    }
  },
  created() {},
  methods: {
    scroll(obj) {
      this.top = -obj.y
    },
    changePage(current) {
      this.current = current
    }
  },
  activated() {}
}
</script>

<style lang="less">
.vip_scroll_wrapper {
  position: fixed;
  top: 40px;
  bottom: 50px;
  width: 100%;
  padding: 20px;
  img {
    width: 100%;
  }

  .noCurrent {
    transform: scale(0.9);
  }
  .pic {
    width: 100%;
    height: 80vh;
    overflow: hidden;
    background: dodgerblue;
    border: 1px solid #dddddd;
    border-radius: 10px;
  }
  .cube-slide-item {
    transition: all 0.2s;
  }
}
</style>
