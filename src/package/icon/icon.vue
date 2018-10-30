<template>
  <span class="v_icon--wrapper">
    <svg v-if="symbol" class="icon" aria-hidden="true">
      <use :xlink:href="'#'+name"></use>
    </svg>
    <i v-else class="icon iconfont" :class="name" :style="'color:'+color+';font-size:'+size+'px'"></i>
  </span>
</template>
<script>
export default {
  name: 'v-icon',
  props: {
    name: {
      type: String,
      default: 'icon-offline'
    },
    symbol: {
      type: Boolean
    },
    color: {
      type: String,
      default: '#666'
    },
    style: {
      type: String
    },
    size: {
      type: [String, Number]
    }
  }
}
</script>
<style>
.v_icon--wrapper {
  height: 100%;
  display: inline-block;
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
}
</style>
