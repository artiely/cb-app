<template>
  <div>
    <div class="chart-wrapper">
      <canvas id="mountNode"></canvas>
    </div>
  </div>
</template>

<script>
// import F2 from '@antv/f2'
// export default {
//   data() {
//     return {
//       chart: null
//     }
//   },
//   methods: {
//     init() {
//       const data = [
//         { name: '股票类', percent: 83.59, a: '1' },
//         { name: '债券类', percent: 2.17, a: '1' },
//         { name: '现金类', percent: 14.24, a: '1' }
//       ]

//       const map = {}
//       data.map(obj => {
//         map[obj.name] = obj.percent + '%'
//       })

//       const chart = new F2.Chart({
//         id: 'mountNode',
//         width: window.innerWidth,
//         height:
//           window.innerWidth > window.innerHeight
//             ? window.innerHeight - 54
//             : window.innerWidth * 0.707,
//         pixelRatio: window.devicePixelRatio,
//         padding: [20, 'auto', 40, 'auto']
//       })
//       chart.source(data, {
//         percent: {
//           formatter(val) {
//             return val + '%'
//           }
//         }
//       })
//       chart.tooltip(false)
//       chart.legend({
//         position: 'bottom',
//         itemFormatter(val) {
//           return val + '    ' + map[val]
//         }
//       })
//       chart.coord('polar', {
//         transposed: true,
//         innerRadius: 0.7,
//         radius: 0.85
//       })
//       chart.axis(false)
//       chart
//         .interval()
//         .position('a*percent')
//         .color('name', [
//           '#1890FF',
//           '#13C2C2',
//           '#2FC25B',
//           '#FACC14',
//           '#F04864',
//           '#8543E0'
//         ])
//         .adjust('stack')

//       chart.guide().html({
//         position: ['50%', '45%'],
//         html: `
//       <div style="width: 250px;height: 40px;text-align: center;">
//         <div style="font-size: 16px">总资产</div>
//         <div style="font-size: 24px">133.08 亿</div>
//       </div>`
//       })
//       chart.render()
//     }
//   },
//   mounted() {
//     this.$nextTick(() => {
//       this.init()
//     })
//   }
// }
</script>

<style>

</style>
