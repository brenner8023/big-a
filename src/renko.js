const fs = require('node:fs')
const path = require('node:path')

const { DAILY_DIR, DAILY_CYB_DIR, CODE_DIR } = require('./config')
const { HHV, LLV, SMA, calcRatio, calcKDJ, calcMa, getStockAtr } = require('./tools')

/**
 * 计算砖型图
 * @param {number[]} high - 最高价数组
 * @param {number[]} low - 最低价数组
 * @param {number[]} close - 收盘价数组
 * @returns {Object} - 包含所有VAR变量的结果
 */
function calcRenko(high, low, close) {
  const length = close.length
  const VAR1A = []
  const VAR2A = []
  const VAR3A = []
  const VAR4A = []
  const VAR5A = []
  const VAR6A = []

  for (let i = 0; i < length; i++) {
    // VAR1A:=(HHV(HIGH,4)-CLOSE)/(HHV(HIGH,4)-LLV(LOW,4))*100-90;
    const hhv4 = HHV(high, 4, i)
    const llv4 = LLV(low, 4, i)
    const var1a = ((hhv4 - close[i]) / (hhv4 - llv4)) * 100 - 90
    VAR1A.push(var1a)

    // VAR3A:=(CLOSE-LLV(LOW,4))/(HHV(HIGH,4)-LLV(LOW,4))*100;
    const var3a = ((close[i] - llv4) / (hhv4 - llv4)) * 100
    VAR3A.push(var3a)
  }

  // VAR2A:=SMA(VAR1A,4,1)+100;
  const smaVar1a = SMA(VAR1A, 4, 1)
  for (let i = 0; i < length; i++) {
    VAR2A.push(smaVar1a[i] + 100)
  }

  // VAR4A:=SMA(VAR3A,6,1);
  const smaVar3a = SMA(VAR3A, 6, 1)
  VAR4A.push(...smaVar3a)

  // VAR5A:=SMA(VAR4A,6,1)+100;
  const smaVar4a = SMA(VAR4A, 6, 1)
  for (let i = 0; i < length; i++) {
    VAR5A.push(smaVar4a[i] + 100)
  }

  // VAR6A:=VAR5A-VAR2A;
  for (let i = 0; i < length; i++) {
    VAR6A.push(VAR5A[i] - VAR2A[i])
  }

  const result = []
  for (let i = 0; i < length; i++) {
    const flag = VAR6A[i] > 4 ? VAR6A[i] - 4 : 0
    result.push(flag)
  }

  return result
}

function selectStocks(files, dir) {
  const zszMap = require(path.join(CODE_DIR, './zsz.json'))
  const result = []
  files.forEach((file) => {
    if (path.extname(file) !== '.json') {
      return
    }
    const data = require(path.join(dir, file))
    const { ratioFlag, ratio } = calcRatio(data, 1.4)
    const code = file.replace('.json', '')
    if (!zszMap[code]) {
      console.log('not in zszMap:', code)
    }
    const name = zszMap[code].name
    const pct_chg = data[data.length - 1][5]
    const { J } = calcKDJ(data, 9)
    const ma13 = calcMa(data, 13)
    const ma60 = calcMa(data, 60)
    const high = data.slice(-8).map((item) => item[2])
    const low = data.slice(-8).map((item) => item[3])
    const close = data.slice(-8).map((item) => item[4])
    const renko = calcRenko(high, low, close)
    const renkoLen = renko.length

    const flag1 = ratioFlag
    const flag2 =
      renko[renkoLen - 1] > renko[renkoLen - 2] &&
      renko[renkoLen - 2] < renko[renkoLen - 3] &&
      renko[renkoLen - 3] < renko[renkoLen - 4] &&
      renko[renkoLen - 4] < renko[renkoLen - 5]
    const flag3 = zszMap[code].zsz > 30 && ma13[0] > ma60[0]
    const flag4 = J < 66 && pct_chg < 3.8
    const flag = flag1 && flag2 && flag3 && flag4
    if (flag) {
      result.push({
        id: `${code}_${name}`,
        rate: ratio,
        atr: getStockAtr(data),
      })
    }
  })
  result.sort((a, b) => b.rate - a.rate)
  return result
}

function main() {
  const files = fs.readdirSync(DAILY_DIR)
  const cybFiles = fs.readdirSync(DAILY_CYB_DIR)
  const dailyResult = selectStocks(files, DAILY_DIR)
  console.log(dailyResult)
  console.log(dailyResult.length)
  const num = process.argv[2] || dailyResult.length
  const data = dailyResult
    .slice(0, num)
    .map((item) => item.id.split('.')[0])
    .join(',')
  fs.writeFileSync(path.join('./renko.txt'), data)
  const cybResult = selectStocks(cybFiles, DAILY_CYB_DIR)
  console.log(cybResult)
  console.log(cybResult.length)
}
main()
