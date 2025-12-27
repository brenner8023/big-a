const fs = require('node:fs')
const path = require('node:path')

const { DAILY_DIR, DAILY_CYB_DIR } = require('./config')
const { calcKDJ, calcRSI } = require('./tools')

const zszMap = require('../code/zsz.json')

function main() {
  const result = []
  const bkMap = require('../code/bk.json')
  const nameCodeMap = {}
  Object.keys(zszMap).forEach((code) => {
    nameCodeMap[zszMap[code].name] = code
  })
  Object.keys(bkMap).forEach((bkName) => {
    const stocks = bkMap[bkName]
    const stockArr = []
    stocks.forEach((stock) => {
      let code = stock.code
      if (!code) {
        code = nameCodeMap[stock.name]
      }
      if (!zszMap[code]) {
        console.log('get_bk: no code', stock.name)
        return
      }
      const dir = code.startsWith('30') ? DAILY_CYB_DIR : DAILY_DIR
      const dailyData = require(path.join(dir, `${code}.json`))
      const { J } = calcKDJ(dailyData, 9)
      const rsi14 = calcRSI(dailyData, 14)
      let redCount = 0
      let greenCount = 0
      dailyData.slice(-10).forEach((item) => {
        const pct_chg = item[5]
        const vol = item[6]
        if (pct_chg > 0) {
          redCount += vol
        } else {
          greenCount += vol
        }
      })
      const rate = +(redCount / greenCount).toFixed(2)
      stockArr.push({
        code,
        name: stock.name,
        rate,
        J: +J.toFixed(2),
        rsi14,
      })
    })
    let avgRate = 0
    let avgJ = 0
    let avgRsi14 = 0
    stockArr.forEach((stock) => {
      avgRate += stock.rate
      avgJ += stock.J
      avgRsi14 += stock.rsi14
    })
    avgRate /= stockArr.length
    avgJ /= stockArr.length
    avgRsi14 /= stockArr.length
    result.push({
      bk: bkName,
      avgRate: +avgRate.toFixed(2),
      avgJ: +avgJ.toFixed(2),
      avgRsi14: +avgRsi14.toFixed(2),
    })
  })
  result.sort((a, b) => b.avgRate - a.avgRate)
  console.log(result)
}
main()
