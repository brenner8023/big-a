const fs = require('node:fs')
const path = require('node:path')

const { DAILY_DIR, CODE_DIR } = require('./config')
const { calcKDJ, getSlope, getStockPos, calcMa } = require('./tools')

fs.readdir(DAILY_DIR, (err, files) => {
  if (err) throw err
  const zszMap = require(path.join(CODE_DIR, './zsz.json'))

  const result = []
  files.forEach((file) => {
    if (path.extname(file) !== '.json') {
      return
    }
    const data = require(path.join(DAILY_DIR, file))
    const ma13 = calcMa(data, 13, true)[0]
    const ma60 = calcMa(data, 60, true)[0]
    if (ma13 <= ma60) {
      return
    }
    const curr_pct_chg = data[data.length - 1][5]
    const curr_vol = data[data.length - 1][6]
    const prev_pct_chg = data[data.length - 2][5]
    const prev_vol = data[data.length - 2][6]
    const prev_prev_pct_chg = data[data.length - 3][5]
    const prev_prev_vol = data[data.length - 3][6]
    const currClose = data[data.length - 1][4]
    const prevLow = data[data.length - 2][3]
    const wash =
      prev_prev_pct_chg > 3.9 &&
      prev_pct_chg <= 0 &&
      curr_pct_chg <= 0 &&
      prev_vol < 0.75 * prev_prev_vol &&
      curr_vol < 0.75 * prev_prev_vol
    const didi = currClose >= prevLow
    const code = file.replace('.json', '')
    const pos = getStockPos(code)
    const name = zszMap[code].name
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
    if (wash && didi && zszMap[code].zsz > 50) {
      result.push({
        id: `${code}_${name}`,
        pos,
        rate: (redCount / greenCount).toFixed(2),
      })
    }
  })
  result.sort((a, b) => b.rate - a.rate)
  console.log(result)
  console.log(result.length)
})
