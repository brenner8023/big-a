const fs = require('node:fs')
const path = require('node:path')

const { DAILY_DIR, CODE_DIR, DAILY_CYB_DIR } = require('./config')
const { calcKDJ } = require('./tools')

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
    const maxVols = []
    data.slice(-30, -1).forEach((item) => {
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
    const { J } = calcKDJ(data, 9)
    const flag1 = maxVols.every((i) => i.pct_chg > 0)
    const flag2 = redCount > 1.2 * greenCount
    const flag3 = data[data.length - 1][5] > 3.9
    const flag4 = zszMap[code].zsz > 30
    const flag = flag1 && flag2 && flag3 && flag4 && J <= 55
    if (flag) {
      result.push({
        id: `${code}_${zszMap[code].name}`,
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
