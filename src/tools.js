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
