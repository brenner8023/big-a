const fs = require('node:fs')
const path = require('node:path')

const { DAILY_DIR, DAILY_CYB_DIR, CODE_DIR } = require('./config')
const { calcKDJ, calcMa } = require('./tools')

function selectStocks(files, dir, redRatio) {
  const zszMap = require(path.join(CODE_DIR, './zsz.json'))
  const result = []
  files.forEach((file) => {
    if (path.extname(file) !== '.json') {
      return
    }
    const data = require(path.join(dir, file))
    let redCount = 0
    let greenCount = 0
    const volArr = data
      .slice(-30)
      .map((item) => item[6])
      .sort((a, b) => b - a)
    const midVol = volArr[20]
    let limitDownCount = 0
    data.slice(-30).forEach((item) => {
      const pct_chg = item[5]
      const volume = item[6]
      if (pct_chg >= 0 && volume >= midVol) {
        redCount += volume
      }
      if (pct_chg < 0 && volume >= midVol) {
        greenCount += volume
      }
      if (pct_chg < -8) {
        limitDownCount++
      }
    })
    const code = file.replace('.json', '')
    if (!zszMap[code]) {
      console.log('not in zszMap:', code)
    }
    const name = zszMap[code].name
    const pct_chg = data[data.length - 1][5]
    const { J } = calcKDJ(data, 9)
    const ma13 = calcMa(data, 13)
    const ma60 = calcMa(data, 60)
    const flag1 = limitDownCount === 0
    const flag2 = redCount > redRatio * greenCount
    const flag3 = zszMap[code].zsz > 50 && ma13[0] > ma60[0]
    const flag4 = J < 14 && pct_chg > -4 && pct_chg < 4
    const flag = flag1 && flag2 && flag3 && flag4
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
  selectStocks(files, DAILY_DIR, 1.3)
  selectStocks(cybFiles, DAILY_CYB_DIR, 1.3)
}
main()
