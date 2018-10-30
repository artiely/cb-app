<template>
  <div>
    <v-header :title="data&&data.name?data.name:''"></v-header>
    <div class="c-scroll-wrapper-top-bottom">
      <cube-scroll :data="data">
        <div v-if="data">
          <div v-for="item in items" :key="item.id">
            <div>
              <keep-alive>
                <card-sku :data="item" :cardType="data.cardType" :allData="data"></card-sku>
              </keep-alive>
            </div>
          </div>
        </div>
      </cube-scroll>
    </div>
    <v-footer>
      <v-footer-item style="flex:2" @click.native="toOrder">
        选好了
        <span>
          <v-dot v-if="okCart" :number="okCart.length"></v-dot>
        </span>
      </v-footer-item>
    </v-footer>
  </div>
</template>

<script>
import CardSku from './CardSku'
export default {
  components: {
    CardSku
  },
  data() {
    return {
      data: null,
      items: null,
      id: ''
    }
  },
  computed: {
    okCart() {
      return this.$store.getters.okCart
    },
    shopCar() {
      return this.$store.state.order.shopCar
    }
  },
  methods: {
    async getData() {
      let res = await this.$api.DISACCOUNT_CARD_DETAIL({ id: this.id })
      if (res.status === 1) {
        let data = res.data
        if (res.data.items) {
          res.data.items.map(v => {
            const findIndex = (element, index, array) => {
              return element.id === v.gasSkuId
            }
            let index = this.shopCar.findIndex(findIndex)
            if (index !== -1) {
              v.count = this.shopCar[index].count
            } else {
              v.count = 0
            }
            return v
          })
        }
        this.data = data
        this.items = data.items || []
      }
    },
    toOrder() {
      this.$router.replace({ name: 'Kaidan' })
    }
  },
  activated() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getData()
    }
  }
}
</script>

<style>
</style>
