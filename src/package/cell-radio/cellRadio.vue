<template>
  <div class="c_cell_radio--wrapper">
    <label class="c_cell_radio--label">
      <div class="c_cell_radio--title">
        {{title}}
      </div>
      <div class="c_cell_radio--radio">
        <input type="radio">
      </div>
    </label>
  </div>
</template>

<script>
export default {
  name: 'v-cell-radio',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less">
.c_cell_radio {
  &--wrapper {
    height: 60px;
    width: 100%;
    line-height: 60px;
    padding: 0 10px;
    position: relative;
    display: flex;
    background: #ffffff;
  }
  &--title {
    flex: 1;
  }
  &--radio {
    flex: 1;
  }
}
</style>
