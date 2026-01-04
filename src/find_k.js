const fs = require('node:fs')
const path = require('node:path')

const { DAILY_DIR, DAILY_CYB_DIR, CODE_DIR } = require('./config')
const { calcKDJ, calcMa, isSideway } = require('./tools')

function selectStocks(files, dir, redRatio) {
  const zszMap = require(path.join(CODE_DIR, './zsz.json'))
  const result = []
  files.forEach((file) => {
    if (path.extname(file) !== '.json') {
      return
    }
    const data = require(path.join(dir, file))
    const code = file.replace('.json', '')
    if (!zszMap[code]) {
      console.log('not in zszMap:', code)
    }
    const lastClose = data[data.length - 1][4]
    const maxPrice = Math.max(...data.slice(-60).map((item) => item[2]))
    const minPrice = Math.min(...data.slice(-60).map((item) => item[3]))
    const avgVol = data.slice(-60).reduce((acc, item) => acc + item[6], 0) / 60
    let targetDate = ''
    let v = 0
    data.slice(-15).forEach((item) => {
      const high = item[2]
      const close = item[4]
      const pct_chg = item[5]
      const volume = item[6]
      if (
        pct_chg > 4 &&
        volume > 2.5 * avgVol &&
        ((close - minPrice) / (maxPrice - minPrice) < 0.3 || (close - minPrice) / minPrice < 0.2) &&
        (lastClose - close) / close < 0.3 &&
        high - close < 0.04 * close &&
        zszMap[code].zsz > 80
      ) {
        targetDate = item[0]
        v = (volume / avgVol).toFixed(2)
      }
    })
    const name = zszMap[code].name
    if (targetDate) {
      result.push({
        id: `${code}_${name}`,
        date: targetDate,
        v,
      })
    }
  })
  result.sort((a, b) => b.v - a.v)
  result.sort((a, b) => b.date - a.date)
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
