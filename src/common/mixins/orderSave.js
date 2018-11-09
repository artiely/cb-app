// cell 订单保存mixins在开单和施工都用到
export default {
  data() {
    return {
      toast: ''
    }
  },
  methods: {
    async handlerToNext(done, page) {
      if (this.totalPrice < 0) {
        this.$toast.fail('收款金额不能为负数')
      } else if (this.okCart.length === 0) {
        this.$toast.fail('请先添加服务/商品')
        // 先判断卡的数额是否满足
      } else if (this.currentCard.cardType === '2') {
        let moneyUsable = this.currentCard.moneyUsable
        if (this.totalPrice > moneyUsable) {
          this.$dialog
            .confirm({
              title: '确定保存吗？',
              message: `卡内数额不足,可用${this.$options.filters['currency'](
                this.currentCard.moneyUsable
              )}`,
              confirmButtonText: '继续保存'
            })
            .then(() => {
              // on confirm
              this.postSave(done)
            })
            .catch(() => {
              // on cancel
            })
        } else {
          this.postSave(done)
        }
        // 次卡
      } else if (this.currentCard.cardType === '3') {
        // 此卡没法计算次数 所以直接保存
        this.postSave(done, page)
      } else {
        this.postSave(done, page)
      }
    },
    async postSave(done, page) {
      this.$toast.allowMultiple()

      var _toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        message: '保存中...'
      })
      setTimeout(() => {
        // 10s 没返回结果
        _toast && _toast.clear()
      }, 10000)
      // 设置订单的基本信息
      this.$store.commit('SET_ORDER_INFO', {
        'memberCard.id': this.currentCard.id || ''
      })
      let orderItems = this.okCart.map(v => {
        var dealEmployeeIds = []
        if (v.dealEmployee) {
          dealEmployeeIds = v.dealEmployee
            .filter(it => {
              if (it) {
                return it
              }
            })
            .map(it => {
              return it.id
            })
            .join()
        }

        return {
          gasType: v.gasType,
          gasSkuId: v.id,
          price: v.price,
          num: v.count,
          moneyDec: v.moneyDec,
          dealEmployeeIds: dealEmployeeIds
        }
      })
      let data = {
        orderItems: orderItems,
        ...this.orderCustomInfo,
        ...this.orderInfo,
        attachment: this.attachment.join(',') // 重写orderinfo中的attachment
      }
      console.log('保存的图片', this.attachment.join(','))
      let res = await this.$api.ORDER_MAIN(data)
      _toast && _toast.clear()
      if (res.status === 1) {
        if (done) {
          // 结算
          this.$router.push({
            name: 'Jiesuan',
            query: {
              orderId: res.message
            }
          })
          this.$store.dispatch('clearOrder')
        } else {
          // 保存
          this.$toast.success('保存成功')
          this.$router.push({
            name: 'Order',
            params: {
              refresh: true
            }
          })
          this.$store.dispatch('clearOrder')
        }
        this.$store.commit('CLEAR_NATIVE_PIC_ORDER')
      } else {
        this.$toast.fail('保存失败')
      }
    }
  }
}
