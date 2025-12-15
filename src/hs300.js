const path = require('node:path')

const { DAILY_DIR, DAILY_CYB_DIR, CODE_DIR } = require('./config')
const { calcRSI, calcMa, isRsiUp } = require('./tools')

function selectStocks() {
  const zszMap = require(path.join(CODE_DIR, './zsz.json'))
  const hs300 = require(path.join(CODE_DIR, './hs300.json'))
  const result = []
  hs300.forEach((item) => {
    let data = []
    if (!zszMap[item.code]) {
      return
    }
    if (item.code.startsWith('30')) {
      data = require(path.join(DAILY_CYB_DIR, item.code + '.json'))
    } else {
      data = require(path.join(DAILY_DIR, item.code + '.json'))
    }

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

    const code = item.code
    const name = zszMap[code].name
    const ma60 = calcMa(data, 60)
    const rsi = calcRSI(data, 14)
    const close = data[data.length - 1][4]
    const rsi14 = calcRSI(data)
    const rate = +(redCount / greenCount).toFixed(2)
    const flag1 = isRsiUp(data) && rsi14 < 70
    const flag2 = close > ma60[0] && rate > 1
    const flag = flag1 && flag2
    if (flag) {
      result.push({
        id: `${code}_${name}`,
        rate,
      })
    }
  })
  result.sort((a, b) => b.rate - a.rate)
  console.log(result)
  console.log(result.length)
}

function main() {
  selectStocks()
}
main()
