const fs = require('node:fs')
const path = require('node:path')

const { DAILY_DIR, DAILY_CYB_DIR, CODE_DIR } = require('./config')

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
    const name = zszMap[code].name
    if (zszMap[code].zsz < 450) {
      return
    }

    let isRedBind = false
    data.slice(-30).forEach((_, index) => {
      const subData = data.slice(-index - 7, -index - 1)
      const flag = subData.every((item) => {
        const pct_chg = item[5]
        return pct_chg >= 0
      })
      if (flag) {
        isRedBind = true
      }
    })

    let redCount = 0
    let greenCount = 0
    data.slice(-60).forEach((item) => {
      const pct_chg = item[5]
      const volume = item[6]
      if (pct_chg > 0) {
        redCount += volume
      } else {
        greenCount += volume
      }
    })
    const flag = redCount > redRatio * greenCount && isRedBind
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
