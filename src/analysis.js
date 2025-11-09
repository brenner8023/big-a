const path = require('node:path')

const { CACHE_DIR, CODE_DIR } = require('./config')

const zszMap = require(path.join(CODE_DIR, './zsz.json'))

const dateList = ['20251103', '20251104', '20251105', '20251106', '20251107']

function main() {
  const result = {}
  dateList.forEach((date) => {
    const currData = require(path.join(CACHE_DIR, `${date}.json`))

    const arr = Object.values(currData)
    const miniStocks = []
    const midStocks = []
    const largeStocks = []

    arr.forEach((item) => {
      const code = item[1]
      const zsz = zszMap[code]
      if (zsz < 100) {
        miniStocks.push(item)
      } else if (zsz < 500) {
        midStocks.push(item)
      } else {
        largeStocks.push(item)
      }
    })

    arr.sort((a, b) => b[7] - a[7])
    miniStocks.sort((a, b) => b[7] - a[7])
    midStocks.sort((a, b) => b[7] - a[7])
    largeStocks.sort((a, b) => b[7] - a[7])

    const getMiddleData = (arr) => {
      const mid = Math.floor(arr.length / 2)
      return arr[mid]
    }

    result[date] = {
      总体: getMiddleData(arr)[7],
      小盘股: getMiddleData(miniStocks)[7],
      中盘股: getMiddleData(midStocks)[7],
      大盘股: getMiddleData(largeStocks)[7],
    }
  })
  console.log('涨跌幅中位数:')
  console.log(result)
}
main()
