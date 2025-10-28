const fs = require('node:fs')
const path = require('node:path')

const { DAILY_DIR } = require('./config')

/**
 * 计算K线斜率
 * @param {Array} data - K线数据数组
 * @param {number} period - 计算周期
 * @returns {number} 斜率值
 */
function getSlope(data, period) {
  // 确保数据足够
  if (!data || data.length < period) {
    return 0
  }

  // 获取最近period个数据点的收盘价
  const recentData = data.slice(-period)
  const closes = recentData.map((item) => item[4])

  // 使用简单线性回归计算斜率
  const n = closes.length
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0

  for (let i = 0; i < n; i++) {
    sumX += i
    sumY += closes[i]
    sumXY += i * closes[i]
    sumX2 += i * i
  }

  // 计算斜率: slope = (n*sumXY - sumX*sumY) / (n*sumX2 - sumX*sumX)
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)

  return slope
}

/**
 * 计算KDJ指标
 * @param {Array} data - K线数据数组
 * @param {number} period - 计算周期
 * @returns {Object} 包含K、D、J值的对象
 */
function calcKDJ(data, period) {
  if (!data || data.length < period) {
    return { K: 50, D: 50, J: 50 }
  }

  const closes = data.map((item) => item[4])
  const lows = data.map((item) => item[3]) // 最低价
  const highs = data.map((item) => item[2]) // 最高价

  const RSV = []
  const K = []
  const D = []
  const J = []

  // 计算RSV
  for (let i = period - 1; i < data.length; i++) {
    const recentHighs = highs.slice(i - period + 1, i + 1)
    const recentLows = lows.slice(i - period + 1, i + 1)
    const maxHigh = Math.max(...recentHighs)
    const minLow = Math.min(...recentLows)

    if (maxHigh === minLow) {
      RSV.push(50)
    } else {
      RSV.push(((closes[i] - minLow) / (maxHigh - minLow)) * 100)
    }
  }

  // 计算K、D、J值
  K[0] = 50 // 初始K值
  D[0] = 50 // 初始D值

  for (let i = 0; i < RSV.length; i++) {
    if (i > 0) {
      K[i] = (2 / 3) * K[i - 1] + (1 / 3) * RSV[i]
      D[i] = (2 / 3) * D[i - 1] + (1 / 3) * K[i]
    } else {
      K[0] = (2 / 3) * 50 + (1 / 3) * RSV[0]
      D[0] = (2 / 3) * 50 + (1 / 3) * K[0]
    }
    J[i] = 3 * K[i] - 2 * D[i]
  }

  return {
    K: K[K.length - 1],
    D: D[D.length - 1],
    J: J[J.length - 1],
  }
}

fs.readdir(DAILY_DIR, (err, files) => {
  if (err) throw err
  const result = []
  files.forEach((file) => {
    if (path.extname(file) !== '.json') {
      return
    }
    const data = require(path.join(DAILY_DIR, file))
    let redCount = 0
    let greenCount = 0
    const maxVols = []
    data.slice(-30).forEach((item) => {
      const pct_chg = item[5]
      const volume = item[6]
      if (pct_chg >= 0) {
        redCount += volume
      } else {
        greenCount += volume
      }
      if (maxVols.length < 5) {
        maxVols.push({ pct_chg, volume })
      } else {
        const minVol = Math.min(...maxVols.map((i) => i.volume))
        if (volume > minVol) {
          const minIndex = maxVols.findIndex((i) => i.volume === minVol)
          maxVols[minIndex] = { pct_chg, volume }
        }
      }
    })

    const slope = getSlope(data, 5).toFixed(4)
    const { J } = calcKDJ(data, 9)
    const flag1 = maxVols.every((i) => i.pct_chg > 0)
    const flag2 = redCount > 1.2 * greenCount
    const flag3 = slope < 0.15 && slope > -0.15
    const flag = flag1 && flag2 && flag3 && J <= 16
    if (flag) {
      result.push({
        file,
        slope,
        rate: (redCount / greenCount).toFixed(2),
      })
    }
  })
  result.sort((a, b) => b.rate - a.rate)
  console.log(result)
  console.log(result.length)
})
