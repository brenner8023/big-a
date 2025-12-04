const fs = require('node:fs')
const path = require('node:path')

const { DAILY_DIR, DAILY_CYB_DIR, CODE_DIR } = require('./config')
const { calcKDJ, getSlope, getDidi, calcMa } = require('./tools')

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
    let vol30 = 0
    const maxVols = []
    data.slice(-35, -5).forEach((item) => {
      const pct_chg = item[5]
      const volume = item[6]
      vol30 += volume
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
    vol30 = vol30 / 30
    let vol5 = 0
    data.slice(-5).forEach((item) => {
      vol5 += item[6]
    })
    vol5 = vol5 / 5
    const code = file.replace('.json', '')
    const name = zszMap[code].name
    const slope = getSlope(data, 5).toFixed(4)
    const { J } = calcKDJ(data, 9)
    const ma13 = calcMa(data, 13)
    const ma60 = calcMa(data, 60)
    const flag1 = maxVols.every((i) => i.pct_chg > 0)
    const flag2 = redCount > redRatio * greenCount
    const flag3 = (slope < 0.15 && slope > -0.15) || !getDidi(data)
    const flag4 = zszMap[code].zsz > 30 && ma13 > ma60
    const flag5 = vol5 < 0.6 * vol30
    const flag6 = J < 56
    const flag = flag1 && flag2 && flag3 && flag4 && flag5 && flag6
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
  selectStocks(files, DAILY_DIR, 1.5)
  selectStocks(cybFiles, DAILY_CYB_DIR, 1.5)
}
main()
