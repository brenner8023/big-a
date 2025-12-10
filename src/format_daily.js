const path = require('node:path')
const fs = require('node:fs')

const { getAllStocks, DAILY_DIR, CACHE_DIR } = require('./config')

function main() {
  if (!fs.existsSync(DAILY_DIR)) {
    fs.mkdirSync(DAILY_DIR, { recursive: true })
  }
  const stockDailyMap = {}
  fs.readdirSync(CACHE_DIR).forEach((file) => {
    if (!file.endsWith('.json')) {
      return
    }
    const cacheFile = path.join(CACHE_DIR, file)
    const dailyData = require(cacheFile)
    getAllStocks().forEach((stockItem) => {
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
    const stockFile = path.join(DAILY_DIR, `./${fileName}.json`)
    fs.writeFileSync(stockFile, JSON.stringify(stockDailyMap[fileName], null, 2))
  })
}
main()
