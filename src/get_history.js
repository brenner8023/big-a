/**
 * @file 从tushare获取日线数据
 */

const fs = require('node:fs')
const path = require('node:path')

const { ALL_STOCKS, CACHE_DIR, TOKEN, UPDATE_CONFIG } = require('./config')

const getDailyData = async (tsCode, stockMap, dailyDataMap) => {
  const body = {
    api_name: 'daily',
    token: TOKEN,
    params: {
      ts_code: tsCode,
      trade_date: '',
      start_date: UPDATE_CONFIG.start,
      end_date: UPDATE_CONFIG.end,
      offset: '',
      limit: '',
    },
    fields: ['ts_code', 'trade_date', 'open', 'high', 'low', 'close', 'pct_chg', 'vol'],
  }
  console.log('获取历史数据中')
  const response = await fetch('https://api.tushare.pro', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    throw new Error(`获取历史数据失败 ${response.statusText}`)
  }
  const result = await response.json()
  const items = result.data?.items
  if (!Array.isArray(items)) {
    throw new Error(`接口返回失败 ${response.statusText} ${JSON.stringify(result)}`)
  }
  items.forEach((item) => {
    const [tsCode, tradeDate] = item
    if (!dailyDataMap[tradeDate]) {
      dailyDataMap[tradeDate] = {}
    }
    item.unshift(stockMap[tsCode]?.name || '')
    dailyDataMap[tradeDate][tsCode] = item
  })
  console.log('获取历史数据成功', items.length)
}

async function main() {
  const queue = []
  const limit = 100
  const dailyDataMap = {}
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR)
  }
  for (let i = 0; i < ALL_STOCKS.length + limit - 1; i += limit) {
    queue.push(ALL_STOCKS.slice(i, i + limit))
  }
  for (const items of queue) {
    const tsCode = items.map((item) => item.code).join(',')
    const stockMap = {}
    items.forEach((item) => {
      stockMap[item.code] = item
    })
    tsCode && (await getDailyData(tsCode, stockMap, dailyDataMap))
  }
  Object.keys(dailyDataMap).forEach((tradeDate) => {
    const cacheFile = path.join(CACHE_DIR, `./${tradeDate}.json`)
    if (fs.existsSync(cacheFile)) {
      console.log('缓存已存在', cacheFile)
      return
    }
    fs.writeFileSync(cacheFile, JSON.stringify(dailyDataMap[tradeDate], null, 2))
  })
}
main()
