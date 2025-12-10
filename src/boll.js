const fs = require('node:fs')
const path = require('node:path')

const { DAILY_DIR, DAILY_CYB_DIR, CODE_DIR } = require('./config')
const { calcBollingerBands, calcMa } = require('./tools')

function breakUpperBand(data) {
  const { upperBand } = calcBollingerBands(data)
  const close = data[data.length - 1][4]
  const vol = data[data.length - 1][6]
  const prevVol = data[data.length - 2][6]
  const flag = close > upperBand && vol > prevVol
  if (!flag) {
    return false
  }
  for (let i = 10; i > 0; i--) {
    const currData = data.slice(0, data.length - i)
    const { upperBand: currUpperBand } = calcBollingerBands(currData)
    const close = currData[currData.length - 1][4]
    if (close > currUpperBand) {
      // 前面10个交易日没有突破上轨，才往下走
      return false
    }
  }
  return true
}

function selectStocks(files, dir) {
  const zszMap = require(path.join(CODE_DIR, './zsz.json'))
  const result = []
  files.forEach((file) => {
    if (path.extname(file) !== '.json') {
      return
    }
    const data = require(path.join(dir, file))
    let redCount = 0
    let greenCount = 0
    data.slice(-30).forEach((item) => {
      const pct_chg = item[5]
      const volume = item[6]
      if (pct_chg > 0) {
        redCount += volume
      } else {
        greenCount += volume
      }
    })

    const code = file.replace('.json', '')
    const name = zszMap[code].name
    const ma13 = calcMa(data, 13)
    const ma60 = calcMa(data, 60)
    const close = data[data.length - 1][4]

    const flag1 = redCount > 1 * greenCount
    const flag2 = zszMap[code].zsz > 100 && close > ma60[0] && close < 1.1 * ma13[0]
    const flag = flag1 && flag2 && breakUpperBand(data)
    if (flag) {
      result.push({
        id: `${code}_${name}`,
        rate: (redCount / greenCount).toFixed(2),
      })
    }
  })
  result.sort((a, b) => b.rate - a.rate)
  console.log(result)
  console.log(result.length)
}

function main() {
  const files = fs.readdirSync(DAILY_DIR)
  const cybFiles = fs.readdirSync(DAILY_CYB_DIR)
  selectStocks(files, DAILY_DIR)
  selectStocks(cybFiles, DAILY_CYB_DIR)
}
main()
