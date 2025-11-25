<template>
  <div>
    {{ date }}: <br />
    全局：{{ all }} , 大盘股：{{ large }} , 中盘股：{{ mid }} , 小盘股：{{ mini }}
    <KLine title="全局-K线图" type="all" />
    <KLine title="大盘股-K线图" type="large" />
    <KLine title="中盘股-K线图" type="mid" />
    <KLine title="小盘股-K线图" type="mini" />
    <div v-for="item in sectorList.filter((item) => item.stocks.length > 1)" :key="item.sector">
      {{ item.sector }}：{{ item.stocks.length }}
    </div>
  </div>
</template>

<script setup name="app-container">
import KLine from './KLine.vue'
import data from './cp.json'
import sectorList from './price_limit/20251124.json'

const { date, all, large, mid, mini } = data[data.length - 1]
</script>

<style scoped></style>
