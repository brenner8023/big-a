const fs = require('node:fs')
const path = require('node:path')

const { DAILY_DIR, CODE_DIR, DAILY_CYB_DIR } = require('./config')
const { calcKDJ, calcMa } = require('./tools')

function selectStocks(files, dir) {
  const zszMap = require(path.join(CODE_DIR, './zsz.json'))
  const result = []
  files.forEach((file) => {
    if (path.extname(file) !== '.json') {
      return
    }
    const data = require(path.join(dir, file))
    const ma13 = calcMa(data, 13)
    const ma60 = calcMa(data, 60)
    let redCount = 0
    let greenCount = 0
    const volArr = data
      .slice(-30)
      .map((i) => i[6])
      .sort((a, b) => b - a)
    const midVol = volArr[20]
    data.slice(-30, -1).forEach((item) => {
      const pct_chg = item[5]
      const volume = item[6]
      if (pct_chg >= 0 && volume >= midVol) {
        redCount += volume
      } else if (pct_chg < 0 && volume >= midVol) {
        greenCount += volume
      }
    })
    const currVol = data[data.length - 1][6]
    const prevVol = data[data.length - 2][6]
    const code = file.replace('.json', '')
    const { J } = calcKDJ(data, 9)
    const flag1 = ma13 > ma60 && currVol > prevVol
    const flag2 = redCount > 1.2 * greenCount
    const flag3 = data[data.length - 1][5] > 3.7
    const flag4 = zszMap[code].zsz > 50
    const flag = flag1 && flag2 && flag3 && flag4 && J < 70
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
