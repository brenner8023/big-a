export const getChartOptions = (dateList, values, ma5, ma10, title) => ({
  title: {
    text: title,
    left: 10,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
  },
  xAxis: {
    type: 'category',
    data: dateList,
    scale: true,
    boundaryGap: false,
    axisLine: { onZero: false },
    splitLine: { show: false },
    min: 'dataMin',
    max: 'dataMax',
  },
  yAxis: {
    scale: true,
    splitArea: {
      show: true,
    },
  },
  series: [
    // {
    //   name: 'MA5',
    //   type: 'line',
    //   data: ma5,
    //   smooth: true,
    //   lineStyle: {
    //     opacity: 0.7,
    //     width: 1,
    //   },
    //   showSymbol: false,
    //   itemStyle: {
    //     color: 'blue',
    //   },
    // },
    // {
    //   name: 'MA10',
    //   type: 'line',
    //   data: ma10,
    //   smooth: true,
    //   lineStyle: {
    //     opacity: 0.7,
    //     width: 1,
    //   },
    //   showSymbol: false,
    //   itemStyle: {
    //     color: '#ffca27',
    //   },
    // },
    {
      name: 'K线',
      type: 'candlestick',
      data: values,
      itemStyle: {
        color: '#FD1050',
        color0: '#0CF49B',
        borderColor: '#FD1050',
        borderColor0: '#0CF49B',
      },
    },
  ],
})
