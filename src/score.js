const path = require('node:path')

const { DAILY_DIR, POSITIONS, CODE_DIR } = require('./config')
const { calcMACD, calcBBI, getStockPos } = require('./tools')

const zszMap = require(path.join(CODE_DIR, './zsz.json'))

function isMACDDead(dif, dea) {
  const len = dif.length
  if (len < 2) {
    return false
  }
  return dif[len - 1] < dea[len - 1]
}

function main() {
  const result = []
  POSITIONS.forEach((code) => {
    const dailyData = require(path.join(DAILY_DIR, `./${code}.json`))
    const currClose = dailyData[dailyData.length - 1][4]

    let volCount = 0
    let maxGreenVol = 0
    dailyData.slice(-5).forEach((item) => {
      const pct_chg = item[5]
      const volume = item[6]
      maxGreenVol = pct_chg < 0 ? Math.max(maxGreenVol, volume) : maxGreenVol
      volCount += pct_chg >= 0 ? volume : -volume
    })
    let vol10 = 0
    dailyData.slice(-10).forEach((item) => {
      const volume = item[6]
      vol10 += volume
    })
    vol10 = vol10 / 10

    const { dif, dea } = calcMACD(dailyData)
    const bbi = calcBBI(dailyData)

    const rules = [
      volCount > 0 ? 1 : 0, // 5天内是否红肥绿瘦
      maxGreenVol > 1.1 * vol10 ? 0 : 1, // 5天内是否有放巨量的阴线
      currClose >= bbi[bbi.length - 1] ? 1 : 0, // 收盘价是否在BBI上方
      isMACDDead(dif, dea) ? 0 : 1, // MACD是否死叉
    ]
    const score = rules.reduce((total, curr) => total + curr, 0)
    const pos = getStockPos(code)
    const name = zszMap[code].name
    result.push({ id: `${code}_${name}`, score, rules, pos })
  })
  result.sort((a, b) => b.score - a.score)
  console.log('100w账户，账户波动0.5%为例')
  console.log(result)
}
main()
