const path = require('node:path')
const fs = require('node:fs')

const { CACHE_DIR, CODE_DIR, APP_DIR, CACHE_CYB_DIR } = require('./config')
const zszMap = require(path.join(CODE_DIR, './zsz.json'))
const hs300 = require(path.join(CODE_DIR, './hs300.json'))

const getMiddleData = (arr) => {
  const mid = Math.floor(arr.length / 2)
  return arr[mid]
}

const getPriceLimit = async function () {
  const getUrl = (date) => {
    return `https://webrelease.dzh.com.cn/htmlweb/ztts/api.php?service=getZttdData&date=${date}`
  }
  const headers = {
    'content-type': 'application/json',
  }
  const dateArr = fs
    .readdirSync(CACHE_DIR)
    .filter((file) => path.extname(file) === '.json')
    .map((file) => Number(file.replace('.json', '')))
    .sort((a, b) => a - b)
    .slice(-10)

  const today = new Date()
  let todayStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(
    today.getDate()
  ).padStart(2, '0')}`
  todayStr = Number(todayStr).toFixed(2)
  if (dateArr[dateArr.length - 1] < Number(todayStr)) {
    dateArr.push(Number(todayStr))
  }

  const resList = await Promise.all(dateArr.map((date) => fetch(getUrl(date), { headers })))
  const dataList = await Promise.all(resList.map((res) => res.json()))
  let countArr = []
  dataList.forEach((item) => {
    countArr.push(item.data.filter((stock) => !stock.name.includes('ST')).length)
  })
  console.log(`${dateArr[0]}-${dateArr[dateArr.length - 1]}涨停板统计: `)
  console.log(countArr)
  const avgVal = countArr.reduce((a, b) => a + b, 0) / dateArr.length
  console.log('平均: ', avgVal.toFixed(2))
  console.log('\n')
  return
}

async function main() {
  const result = []

  fs.readdirSync(CACHE_DIR).forEach((file) => {
    if (!file.endsWith('.json')) {
      return
    }
    const date = file.replace('.json', '')
    const currData = {
      ...require(path.join(CACHE_DIR, file)),
      ...require(path.join(CACHE_CYB_DIR, file)),
    }

    const arr = Object.values(currData)
    const miniStocks = []
    const midStocks = []
    const largeStocks = []
    const hs300Stocks = []

    arr.forEach((item) => {
      const code = item[1]
      const name = item[0]
      if (name.includes('ST')) {
        return
      }
      if (!zszMap[code]) {
        console.log('no zsz', code)
        return
      }
      const zsz = zszMap[code].zsz
      if (zsz < 100) {
        miniStocks.push(item)
      } else if (zsz < 500) {
        midStocks.push(item)
      } else {
        largeStocks.push(item)
      }
      const isHs300 = hs300.some((stock) => stock.code === code)
      if (isHs300) {
        hs300Stocks.push(item)
      }
    })

    arr.sort((a, b) => b[7] - a[7])
    miniStocks.sort((a, b) => b[7] - a[7])
    midStocks.sort((a, b) => b[7] - a[7])
    largeStocks.sort((a, b) => b[7] - a[7])
    hs300Stocks.sort((a, b) => b[7] - a[7])

    result.push({
      date,
      hs300: getMiddleData(hs300Stocks)[7],
      all: getMiddleData(arr)[7],
      mini: getMiddleData(miniStocks)[7],
      mid: getMiddleData(midStocks)[7],
      large: getMiddleData(largeStocks)[7],
    })
  })

  result.sort((a, b) => new Date(a.date) - new Date(b.date))
  fs.writeFileSync(path.join(APP_DIR, 'cp.json'), JSON.stringify(result, null, 2))
  await getPriceLimit()
}
main()
