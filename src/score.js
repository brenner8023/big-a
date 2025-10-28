const path = require('node:path')

const { DAILY_DIR } = require('./config')

const target = [
  '600036.SH_招商银行',
  '603225.SH_新凤鸣',
  '603050.SH_科林电气',
  '603178.SH_圣龙股份',
  '002670.SZ_国盛证券',
  '000571.SZ_新大洲A',
  '600375.SH_汉马科技',
  '002548.SZ_金新农',
]

/**
 * 计算指数移动平均线（EMA）
 * @param {Array} data - 价格数据数组
 * @param {number} period - 周期
 * @returns {Array} EMA数组
 */
function calculateEMA(data, period) {
  const k = 2 / (period + 1)
  const ema = []

  // 第一个EMA值使用简单平均值
  let sum = 0
  for (let i = 0; i < period; i++) {
    sum += data[i]
  }
  ema[period - 1] = sum / period

  // 计算后续EMA值
  for (let i = period; i < data.length; i++) {
    ema[i] = data[i] * k + ema[i - 1] * (1 - k)
  }

  return ema
}

/**
 * 计算MACD指标
 * @param {Array} dailyData - 日线数据数组
 * @returns {Object} 包含dif和dea的对象
 */
function calcMACD(dailyData) {
  // 从日线数据中提取收盘价
  const closes = dailyData.map((item) => item[4])

  // 计算EMA12和EMA26
  const ema12 = calculateEMA(closes, 12)
  const ema26 = calculateEMA(closes, 26)

  // 计算DIF线
  const dif = []
  for (let i = 25; i < closes.length; i++) {
    // EMA26从第26个数据点开始有效
    dif.push(ema12[i] - ema26[i])
  }

  // 计算DEA线（DIF的9日EMA）
  const dea = calculateEMA(dif, 9)

  return { dif, dea }
}

function isMACDDead(dif, dea) {
  const len = dif.length
  if (len < 2) {
    return false
  }
  return dif[len - 1] < dea[len - 1]
}

function main() {
  const result = []
  target.forEach((stockItem) => {
    const dailyData = require(path.join(DAILY_DIR, `./${stockItem}.json`))
    const total13 = dailyData.slice(-13).reduce((total, item) => total + item[4], 0)
    const close13 = total13 / 13
    const currClose = dailyData[dailyData.length - 1][4]

    let volCount = 0
    dailyData.slice(-5).forEach((item) => {
      const pct_chg = item[5]
      const volume = item[6]
      volCount += pct_chg >= 0 ? volume : -volume
    })

    const { dif, dea } = calcMACD(dailyData)

    const rules = [volCount > 0 ? 1 : 0, currClose >= close13 ? 1 : 0, isMACDDead(dif, dea) ? 0 : 1]
    const score = rules.reduce((total, curr) => total + curr, 0)
    result.push({ id: stockItem, score, rules })
  })
  result.sort((a, b) => b.score - a.score)
  console.log(result)
}
main()
