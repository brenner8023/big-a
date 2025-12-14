const path = require('node:path')
const fs = require('node:fs')

const { DAILY_CYB_DIR, CACHE_CYB_DIR, chiNextStocks } = require('./config')

function main() {
  if (!fs.existsSync(DAILY_CYB_DIR)) {
    fs.mkdirSync(DAILY_CYB_DIR, { recursive: true })
  }
  const stockDailyMap = {}
  fs.readdirSync(CACHE_CYB_DIR).forEach((file) => {
    if (!file.endsWith('.json')) {
      return
    }
    const cacheFile = path.join(CACHE_CYB_DIR, file)
    const dailyData = require(cacheFile)
    chiNextStocks.forEach((stockItem) => {
      if (stockItem.name.includes('ST')) {
        return
      }
      const code = stockItem.code
      const currData = dailyData[code]
      if (currData) {
        if (!stockDailyMap[code]) {
          stockDailyMap[code] = []
        }
        stockDailyMap[code].push(currData.slice(2))
      } else {
        // 停牌
      }
    })
  })
  Object.keys(stockDailyMap).forEach((fileName) => {
    const stockFile = path.join(DAILY_CYB_DIR, `./${fileName}.json`)
    fs.writeFileSync(stockFile, JSON.stringify(stockDailyMap[fileName], null, 2))
  })
}
main()
