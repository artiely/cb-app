// cell 的特殊样式配置
export default {
  data() {
    return {
      data() {
        return {
          filterVisiable: false,
          filterItem: [
            {
              name: '全部',
              srcType: null
            },
            {
              name: '店铺库',
              srcType: '1'
            },
            {
              name: '系统库',
              srcType: '0'
            }
          ],
          filterStatus: [
            {
              name: '全部',
              statusType: ''
            },
            {
              name: '在售',
              statusType: 1
            },
            {
              name: '停售',
              statusType: 2
            }
          ]
        }
      }
    }
  }
}
