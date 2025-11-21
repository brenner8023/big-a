const path = require('node:path')

const { CACHE_DIR, CODE_DIR } = require('./config')

const zszMap = require(path.join(CODE_DIR, './zsz.json'))

const dateList = [
  '20251103',
  '20251104',
  '20251105',
  '20251106',
  '20251107',
  '20251110',
  '20251111',
  '20251112',
  '20251113',
  '20251114',
  '20251117',
  '20251118',
  '20251119',
  '20251120',
  '20251121',
]

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
  console.log('主板涨跌幅中位数:')
  console.log(result)
  const vals = Object.values(result)
  const getTotal = (key) => {
    const last = vals.reduce((acc, cur) => acc + (acc * cur[key]) / 100, 1)
    return ((last - 1) * 100).toFixed(2)
  }
  console.log('月初至今：', {
    总体: getTotal('总体'),
    小盘股: getTotal('小盘股'),
    中盘股: getTotal('中盘股'),
    大盘股: getTotal('大盘股'),
  })
}
main()
