const path = require('node:path')

const { DAILY_DIR } = require('./config')

function getDidi(dailyData) {
  const currClose = dailyData[dailyData.length - 1][4]
  const prevPrice = [
    dailyData[dailyData.length - 2][3], // 昨日的最低价
    dailyData[dailyData.length - 3][4], // 前日的收盘价
  ]
  const didi = currClose < prevPrice[0] && currClose < prevPrice[1]
  return didi
}
exports.getDidi = getDidi

function getChangePercent(dailyData) {
  const currClose = dailyData[dailyData.length - 1][4]
  const prev120Close = dailyData[dailyData.length - 120 > 0 ? dailyData.length - 120 : 0][4]
  const changePercent = ((currClose - prev120Close) / prev120Close) * 100
  return +changePercent.toFixed(2)
}
exports.getChangePercent = getChangePercent

// 计算个股历史走势强度
function getMaxPercent(dailyData) {
  const result = []
  const ma5List = calcMa(dailyData, 3, false)
  for (let i = 1; i < ma5List.length; i++) {
    let startIndex = -1
    while (i < ma5List.length - 1 && ma5List[i + 1] > ma5List[i]) {
      if (startIndex === -1) {
        startIndex = i
      }
      i++
    }
    const endIndex = i
    if (startIndex > -1 && endIndex > startIndex) {
      const ma5Start = ma5List[startIndex]
      const ma5End = ma5List[endIndex]
      const changePercent = ((ma5End - ma5Start) / ma5Start) * 100
      result.push(changePercent)
    }
  }
  return Math.max(...result).toFixed(2) || 0
}
exports.getMaxPercent = getMaxPercent

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
exports.calcMACD = calcMACD

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
exports.calcKDJ = calcKDJ

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
exports.getSlope = getSlope

/**
 * 计算多空指数（BBI）
 * BBI = (MA3 + MA6 + MA12 + MA24) / 4
 * @param {Array} dailyData - 日线数据数组
 * @returns {Array} BBI数组
 */
function calcBBI(dailyData) {
  if (!dailyData || dailyData.length < 24) {
    return []
  }

  // 从日线数据中提取收盘价
  const closes = dailyData.map((item) => item[4])
  const bbi = []

  // 计算不同周期的简单移动平均线并计算BBI
  for (let i = 23; i < closes.length; i++) {
    // 计算MA3
    const ma3 = closes.slice(i - 2, i + 1).reduce((sum, price) => sum + price, 0) / 3
    // 计算MA6
    const ma6 = closes.slice(i - 5, i + 1).reduce((sum, price) => sum + price, 0) / 6
    // 计算MA12
    const ma12 = closes.slice(i - 11, i + 1).reduce((sum, price) => sum + price, 0) / 12
    // 计算MA24
    const ma24 = closes.slice(i - 23, i + 1).reduce((sum, price) => sum + price, 0) / 24

    // 计算BBI
    bbi.push((ma3 + ma6 + ma12 + ma24) / 4)
  }

  return bbi
}
exports.calcBBI = calcBBI

/**
 * 计算个股波动率
 * 通过波动率计算持股仓位大小
 * @param {string} code
 * @returns
 */
function getStockPos(code) {
  const data = require(path.join(DAILY_DIR, `${code}.json`))
  const trList = []
  if (data.length < 21) {
    // console.log('getStockPos:', code, data.length)
    return 0
  }
  data.slice(-20).forEach((item, index) => {
    const prevData = data[data.length - 21 + index]
    const currHigh = item[2]
    const currLow = item[3]
    const prevClose = prevData[4]
    const a = currHigh - currLow
    const b = currHigh - prevClose
    const c = prevClose - currLow
    const tr = Math.max(a, b, c)
    trList.push(tr)
  })
  const atr = trList.reduce((acc, cur) => acc + cur, 0) / trList.length
  const currClose = data[data.length - 1][4]
  // 100w账户波动为0.5%
  const result = (100 * 0.005) / (atr / currClose)
  return +result.toFixed(2)
}
exports.getStockPos = getStockPos

/**
 * 计算简单移动平均线（MA）
 * @param {Array} data - 个股数据数组
 * @param {number} period - 移动平均线周期
 * @returns {Array} MA数组
 */
function calcMa(data, period, onlyLast = true) {
  if (!data || data.length < period) {
    return []
  }
  const closes = data.map((item) => item[4])
  if (onlyLast) {
    const val = closes.slice(-period).reduce((sum, price) => sum + price, 0) / period
    return [val]
  }
  const ma = []
  for (let i = period - 1; i < closes.length; i++) {
    ma.push(closes.slice(i - period + 1, i + 1).reduce((sum, price) => sum + price, 0) / period)
  }
  return ma
}
exports.calcMa = calcMa
