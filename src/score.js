const path = require('node:path')

const { DAILY_DIR, POSITIONS, CODE_DIR } = require('./config')
const { calcBBI, getDidi, isRsiUp } = require('./tools')

const zszMap = require(path.join(CODE_DIR, './zsz.json'))

function main() {
  const result = []
  POSITIONS.forEach((code) => {
    const dailyData = require(path.join(DAILY_DIR, `./${code}.json`))
    const currClose = dailyData[dailyData.length - 1][4]

    let volCount = 0
    dailyData.slice(-4).forEach((item) => {
      const pct_chg = item[5]
      const volume = item[6]
      volCount += pct_chg >= 0 ? volume : -volume
    })

    const didi = getDidi(dailyData)
    const bbi = calcBBI(dailyData)

    const rules = [
      didi ? 0 : 1, // 收盘价同时小于昨日最低价和前日收盘价
      volCount > 0 ? 1 : 0, // 4天内是否红肥绿瘦
      currClose >= bbi[bbi.length - 1] ? 1 : 0, // 收盘价是否在BBI上方
      isRsiUp(dailyData) ? 1 : 0, // RSI是否多头排列
    ]
    const score = rules.reduce((total, curr) => total + curr, 0)
    const name = zszMap[code].name
    result.push({ id: name, score, rules: rules.join(',') })
  })
  result.sort((a, b) => b.score - a.score)
  console.log('持仓评分: ', result)
}
main()
