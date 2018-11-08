<template>
  <div>
    <v-header title="开单模板" :left-click="handleLeft"></v-header>
    <v-scroll-page top="44" style="overflow-y:scroll">
      <div v-if="data.length>0">
      <p class="temp-list-tip">可将常用的服务/商品设为模板，开单时一键即可选择。模板在列表中上下的位置，即为开单页面的排列顺序。</p>
        <v-cell-group >
          <draggable v-model="data" :move="getmove" @update="datadragEnd" :options="{animation:500,handle:'.temp-list-right'}" :no-transition-on-drag="true" @start="drag=true" @end="drag=false">
            <!-- <transition-group name="list-complete" :css="true"> -->
            <v-cell wrap v-for="item  in data" :key="item.id" class="temp-list" @click.native="toEdit(item)">
              <div slot="text" class="temp-list-cell">
                <div class="temp-list-left">
                  <div class="temp-list-name textover1">{{item.name}}</div>
                  <div class="temp-list-remark textover1">备注：{{item.remarks}}</div>
                </div>
                <div class="temp-list-right">
                  <v-icon name="icon-shunxuqiehuan"></v-icon>
                </div>
              </div>
            </v-cell>
            <!-- </transition-group> -->
          </draggable>
        </v-cell-group>
        <v-br height="100"></v-br>
      </div>
      <v-nodata v-else :placeholder="placeholder" hasadd="1"></v-nodata>
    </v-scroll-page>
    <v-fad-button @click.native="addTemp"></v-fad-button>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  data() {
    return {
      drag: false,
      data: [],
      currMoveDate: {},
      placeholder: '无开单模板，点击新增'
    }
  },
  methods: {
    handleLeft() {
      this.$router.replace('/index')
    },
    toEdit(item) {
      this.$router.push({ name: 'TempEdit', query: { id: item.id } })
    },
    async getData(evt) {
      let res = await this.$api.ORDER_TEMP()
      if (res.status === 1) {
        this.data = res.page.list
      }
    },
    getmove(evt) {
      this.currMoveDate = evt.draggedContext.element
    },
    addTemp() {
      if (this.data && this.data.length >= 10) {
        this.$toast('无法新建。模板数量已达到上限。')
      } else {
        this.$router.push('/tempedit')
      }
    },
    datadragEnd(evt) {
      let val = this.data
      let arrIds = val.map(v => {
        return v.id
      })
      this.$api.ORDER_TEMP_SORT_ALL({ ids: arrIds.join() }).then(res => {
        if (res.status === 1) {
          this.$toast.success('排序已更新')
        }
      })
    }
  },
  activated() {
    this.getData()
  }
}
</script>

<style lang="less">
.list-complete-enter-active {
  overflow: hidden;
  transition: all 1s;
}
.dragClass,
.ghostClass {
  opacity: 1;
  background: #000 !important;
  .c_cell {
    background: #000 !important;
  }
}

.list-complete-leave-active {
  margin-top: 0px;
  overflow: hidden;
  transition: all 1s;
}

.list-complete-enter,
.list-complete-leave-to {
  height: 0px;
  opacity: 0;
  padding: 0px;
  margin-top: 0px;
  overflow: hidden;
}
.temp-list-tip {
  font-size: 12px;
  color: #999;
  line-height: 1.5;
  padding: 10px 15px;
}
.temp-list-cell {
  display: flex;
  .temp-list-left {
    flex: 1;
    width: 200px;
    .temp-list-name {
      font-size: 18px;
      color: #333;
    }
    .temp-list-remark {
      padding-top: 5px;
      font-size: 14px;
      color: #999;
    }
  }
  .temp-list-right {
    width: 50px;
    text-align: center;
    line-height: 42px;
    .icon {
      font-size: 14px;
      color: #999 !important;
    }
  }
}
</style>
