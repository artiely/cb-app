<template>
  <div>
    <div>
      <!-- :to="{name:'Index'}" -->
      <v-header v-if="!noHeader" :title="title" border></v-header>
      <v-br :height="44" v-if="!noHeader"></v-br>
      <!--
        场景一 客户
        场景二 车辆
        场景三 新客户
        场景四 新车辆
        场景五 都没有
       -->
      <div v-if="noCus">
        <div class="c_order--custom">
          <div class="c_order--custom--main" style="color:#c7c7c7">
            <div class="c_order--cus-icon">
              <v-icon name="icon-xiaotubiao-49" color="#ddd"></v-icon>
            </div>
            无客户信息</div>
        </div>
      </div>
      <div v-else-if="data">
        <div @click="toDetail('cus')">
          <div class="c_order--custom" style="background-image:none">
            <div class="c_order--custom--icon">
              <div class="c_order--custom--icon--box">
                <div class="c_order--cus-icon">
                  <v-icon name="icon-xiaotubiao-49" color="#ddd"></v-icon>
                </div>
              </div>
            </div>
            <div class="c_order--custom--main textover1">
              <div class="c_order--custom--main--car">{{data.username |telFormat()}}</div>
              <div class="c_order--custom--main--cus textover1" v-if="data.name">{{data.name}} </div>
              <div class="c_order--custom--main--cus textover1" v-else style="color:#c7c7c7">无客户名</div>
            </div>
            <div class="c_order--custom--link" v-if="!nolink" style="background-image:none">
              <v-icon name="icon-youjiantou1" class="fr"></v-icon>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <!-- 有人 -->
        <div v-if="orderOfCustom">
          <div class="c_order--custom">
            <div class="c_order--custom--icon">
              <div class="c_order--custom--icon--box">
                <v-icon name="icon-sousuo1" color="#f0f0f0" v-if="!noicon"></v-icon>
              </div>
            </div>
            <div class="c_order--custom--main" @click="toSearch">
              <!-- 有人有车 -->
              <div v-if="orderOfCustom.motor">
                <div class="c_order--custom--main--car">{{orderOfCustom.motor.licence|carIdFormat()}}</div>
                <div class="c_order--custom--main--cus textover1">{{orderOfCustom.username |telFormat()}} {{orderOfCustom.name}} </div>
              </div>
              <!-- 有人无车 -->
              <div v-else class="textover1">
                <div class="c_order--custom--main--car">{{orderOfCustom.username |telFormat()}}</div>
                <!-- 有名字 -->
                <div class="c_order--custom--main--cus textover1" v-if="orderOfCustom.name">{{orderOfCustom.name}}</div>
                <!-- 无名字 -->
                <div class="c_order--custom--main--cus textover1" v-else style="color:#c7c7c7">无客户名</div>
              </div>
            </div>
            <div class="c_order--custom--link" v-if="!nolink" @click="toDetail('cus')">
              详情
            </div>
          </div>
        </div>
        <!-- 有车 -->
        <div v-else-if="orderOfCar">
          <div class="c_order--custom">
            <div class="c_order--custom--icon">
              <div class="c_order--custom--icon--box">
                <v-icon name="icon-sousuo1" color="#f0f0f0" v-if="!noicon"></v-icon>
              </div>
            </div>
            <div class="c_order--custom--main" @click="toSearch">
              <!-- 有车有人 -->
              <div v-if="orderOfCar.member" key="有人的信息">
                <div class="c_order--custom--main--car">{{orderOfCar.licence|carIdFormat()}}</div>
                <div class="c_order--custom--main--cus textover1">{{orderOfCar.member.username|telFormat()}} {{orderOfCar.member.name}} </div>
              </div>
              <!-- 只有车 -->
              <div v-else key="没人的信息">
                <div class="c_order--custom--main--car" v-if="orderOfCar">{{orderOfCar.licence | carIdFormat()}}</div>
                <div class="c_order--custom--main--cus textover1" style="color:#c7c7c7">无客户</div>
              </div>
            </div>
            <div class="c_order--custom--link" v-if="!nolink" @click="toDetail('car')">
              详情
            </div>
          </div>
        </div>
        <div v-else>
          <div class="c_order--custom" @click="toSearch">
            <div class="c_order--custom--main" style="color:#c7c7c7">
              <v-icon name="icon-sousuo1" color="#c7c7c7"></v-icon>
              {{placeholder}}
              <span v-if="required" style="color:#f50">*</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: '开单'
    },
    nolink: {
      type: Boolean,
      default: false
    },
    searchTo: {
      type: Object,
      default: () => {}
    },
    noicon: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    search: {
      // 选择去搜索的类型
      type: String,
      default: 'OrderSearch'
    },
    noCus: {
      // 无主单
      type: Boolean,
      default: false
    },
    noHeader: {
      type: Boolean,
      default: false
    },
    to: {
      type: Object,
      default: () => {}
    },
    placeholder: {
      type: String,
      default: '车辆/客户'
    }
  },
  computed: {
    newCustomTel() {
      return this.$store.state.order.newCustomTel
    },
    newCustomCar() {
      return this.$store.state.order.newCustomCar
    },
    orderOfCustom() {
      return this.$store.state.order.orderOfCustom
    },
    orderOfCar() {
      return this.$store.state.order.orderOfCar
    },
    currentCard() {
      return this.$store.state.order.currentCard
    }
  },
  methods: {
    toSearch() {
      if (this.searchTo) {
        this.$router.replace(this.searchTo)
      } else {
        this.$router.replace({ name: this.search })
      }
    },
    toDetail(arg) {
      if (this.to) {
        this.$router.push({
          name: this.to.name,
          query: { id: this.to.id }
        })
      } else {
        if (arg === 'car') {
          if (this.orderOfCar && this.orderOfCar.member) {
            this.$router.push({
              name: 'Detail',
              query: { id: this.orderOfCar.member.id }
            })
          } else {
            this.$router.push({
              name: 'Detail',
              query: { carid: this.orderOfCar.id }
            })
          }
        } else {
          this.$router.push({
            name: 'Detail',
            query: { id: this.orderOfCustom.id }
          })
        }
      }
    }
  },
  created() {},
  activated() {}
}
</script>

<style lang="less">
@import '../../assets/style/var.less';
@import '../../assets/style/border.less';
.c_order--cus-icon {
  height: 20px;
  width: 20px;
  background: #f0f0f0;
  border-radius: 50%;
  display: inline-block;
  text-align: center;
  line-height: 20px;
  margin-right: 10px;
  .icon {
    color: #c7c7c7 !important;
    padding: 0 !important;
  }
}
.c_order--custom {
  height: 70px;
  background: #fff;
  display: flex;
  padding: 0 0 0 12px;
  .borderB(@dividers);
  .icon {
    padding-right: 8px;
    font-size: 20px;
  }
  &--new {
    position: absolute;
    top: 0;
    right: 0;
    background: @success;
    width: 12px;
    height: 12px;
    font-size: 8px;
    text-align: center;
    line-height: 12px;
    color: #fff;
    border-radius: 50%;
  }
  &--icon {
    &--box {
      height: 70px;
      line-height: 70px;
    }
  }
  &--main {
    flex: 1;
    line-height: 70px;
    color: #333;
    font-size: 28px;
    width: 100px;
    &--car {
      line-height: 45px;
      overflow: hidden;
      height: 35px;
      color: #333;
      font-weight: 600;
      font-size: 28px;
    }
    &--cus {
      height: 35px;
      line-height: 30px;
      font-size: 18px;
      font-weight: 500;
      color: #333;
    }
  }
  &--link {
    width: 45px;
    height: 50px;
    line-height: 50px;
    margin-top: 10px;
    text-align: center;
    // .borderL(@dividers);
    font-size: 16px;
    color: @warning;
    .icon {
      color: #f0f0f0 !important;
      font-size: 12px;
    }
  }
}
</style>
