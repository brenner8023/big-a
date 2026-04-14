const path = require('node:path')
const fs = require('node:fs')

const root = process.cwd()
const cacheWeek = path.join(root, './cache_week')
const weekDir = path.join(root, './week')

const { getAllStocks } = require('./config')

function main() {
  if (!fs.existsSync(weekDir)) {
    fs.mkdirSync(weekDir, { recursive: true })
  }
  const stockDailyMap = {}
  fs.readdirSync(cacheWeek).forEach((file) => {
    if (!file.endsWith('.json')) {
      return
    }
    const cacheFile = path.join(cacheWeek, file)
    const weekData = require(cacheFile)
    getAllStocks().forEach((stockItem) => {
      if (stockItem.name.includes('ST')) {
        return
      }
      const code = stockItem.code
      const currData = weekData[code]
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
    const stockFile = path.join(weekDir, `./${fileName}.json`)
    fs.writeFileSync(stockFile, JSON.stringify(stockDailyMap[fileName], null, 2))
  })
}
main()
