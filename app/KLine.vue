<template>
  <div ref="chartContainer" style="width: 100%; height: 500px"></div>
</template>

<script setup name="KLine">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

import { getChartOptions } from './const'
import { getDateList, calculateMA, getStockPrices } from './utils'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'all',
  },
})

const dateList = getDateList()
let myChart = null
const chartContainer = ref(null)

const option = computed(() => {
  const values = getStockPrices(props.type)
  const ma5 = calculateMA(5, values)
  const ma10 = calculateMA(10, values)
  return getChartOptions(dateList, values, ma5, ma10, props.title)
})

onMounted(() => {
  myChart = echarts.init(chartContainer.value)

  watch(
    option,
    () => {
      myChart?.setOption(option.value)
    },
    { immediate: true }
  )

  // 自适应窗口大小
  window.addEventListener('resize', () => {
    myChart?.resize()
  })
})

onBeforeUnmount(() => {
  myChart?.dispose()

  window.removeEventListener('resize', () => {
    myChart?.resize()
  })
})
</script>
