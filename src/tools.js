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

/**
 * 计算KDJ指标
 * @param {Array} data - K线数据数组
 * @param {number} period - 计算周期
 * @returns {Object} 包含K、D、J值的对象
 */
exports.calcKDJ = function (data, period) {
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
function getStockPos(data) {
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

/**
 * 计算布林带（Bollinger Bands）
 * @param {Array} dailyData - 日线数据数组
 * @param {number} period - 计算周期，默认为20
 * @returns {Object} 包含布林带上轨、中轨、下轨的对象
 */
exports.calcBollingerBands = function (dailyData, period = 20) {
  if (!dailyData || dailyData.length < period) {
    return {
      upperBand: null,
      middleBand: null,
      lowerBand: null,
    }
  }

  const middleBand = calcMa(dailyData, period)[0]

  // 计算标准差
  const recentCloses = dailyData.slice(-period).map((item) => item[4])
  const mean = middleBand
  const variance = recentCloses.reduce((sum, close) => sum + Math.pow(close - mean, 2), 0) / period
  const std = Math.sqrt(variance)

  // 计算上轨和下轨
  const upperBand = middleBand + 2 * std
  const lowerBand = middleBand - 2 * std

  return {
    upperBand: +upperBand.toFixed(2),
    middleBand: +middleBand.toFixed(2),
    lowerBand: +lowerBand.toFixed(2),
  }
}
