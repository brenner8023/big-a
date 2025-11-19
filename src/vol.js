const fs = require('node:fs')
const path = require('node:path')

const { DAILY_DIR, CODE_DIR } = require('./config')
const { calcKDJ, getSlope, getStockPos, getDidi, getMaxPercent } = require('./tools')

fs.readdir(DAILY_DIR, (err, files) => {
  if (err) throw err
  const zszMap = require(path.join(CODE_DIR, './zsz.json'))
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
      if (pct_chg > 0) {
        redCount += volume
      } else {
        greenCount += volume
      }
      if (maxVols.length < 3) {
        maxVols.push({ pct_chg, volume })
      } else {
        const minVol = Math.min(...maxVols.map((i) => i.volume))
        if (volume > minVol) {
          const minIndex = maxVols.findIndex((i) => i.volume === minVol)
          maxVols[minIndex] = { pct_chg, volume }
        }
      }
    })
    const code = file.replace('.json', '')
    const name = zszMap[code].name
    const slope = getSlope(data, 5).toFixed(4)
    const pos = getStockPos(code)
    const { J } = calcKDJ(data, 9)
    const cp = +getMaxPercent(data)
    const flag1 = maxVols.every((i) => i.pct_chg > 0)
    const flag2 = redCount > 1.6 * greenCount
    const flag3 = (slope < 0.15 && slope > -0.15) || !getDidi(data)
    const flag4 = zszMap[code].zsz > 50
    const flag5 = pos > 9.5 && pos < 33
    const flag6 = cp > 10 && J <= 13
    const flag = flag1 && flag2 && flag3 && flag4 && flag5 && flag6
    if (flag) {
      result.push({
        id: `${code}_${name}`,
        pos,
        rate: (redCount / greenCount).toFixed(2),
        cp,
      })
    }
  })
  result.sort((a, b) => b.rate - a.rate)
  console.log(result)
  console.log(result.length)
})
