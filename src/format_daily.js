const path = require('node:path')
const fs = require('node:fs')

const { WORKDAYS, getAllStocks, DAILY_DIR, CACHE_DIR } = require('./config')

// 根据输入日期获取这段日期内所有的工作日
function getWorkdays(start, end) {
  const workdays = []
  const currentDate = typeof start === 'string' ? new Date(start) : start
  const endDate = typeof end === 'string' ? new Date(end) : new Date()
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      const day = String(currentDate.getDate()).padStart(2, '0')
      workdays.push(`${year}${month}${day}`)
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }
  return workdays
}

function main() {
  if (!fs.existsSync(DAILY_DIR)) {
    fs.mkdirSync(DAILY_DIR, { recursive: true })
  }
  const stockDailyMap = {}
  const workdays = getWorkdays(WORKDAYS.start)
  workdays.forEach((workday) => {
    const cacheFile = path.join(CACHE_DIR, `./${workday}.json`)
    if (fs.existsSync(cacheFile)) {
      const dailyData = require(cacheFile)
      getAllStocks().forEach((stockItem) => {
        const code = stockItem.code
        const currData = dailyData[code]
        if (currData) {
          const name = currData[0]
          const fileName = `${code}_${name}`
          if (!stockDailyMap[fileName]) {
            stockDailyMap[fileName] = []
          }
          stockDailyMap[fileName].push(currData.slice(2))
        } else {
          // 停牌
        }
      })
    } else {
      console.log(`${workday}数据不存在`)
    }
  })
  Object.keys(stockDailyMap).forEach((fileName) => {
    const stockFile = path.join(DAILY_DIR, `./${fileName}.json`)
    fs.writeFileSync(stockFile, JSON.stringify(stockDailyMap[fileName], null, 2))
  })
}
main()
