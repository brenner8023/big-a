const path = require('node:path')
const fs = require('node:fs')

const { CACHE_DIR, CODE_DIR, APP_DIR } = require('./config')

const zszMap = require(path.join(CODE_DIR, './zsz.json'))

const getMiddleData = (arr) => {
  const mid = Math.floor(arr.length / 2)
  return arr[mid]
}
const getFinalChangePercent = (key, vals) => {
  const last = vals.reduce((acc, cur) => acc + (acc * cur[key]) / 100, 1)
  return ((last - 1) * 100).toFixed(2)
}

function main() {
  const result = []

  fs.readdirSync(CACHE_DIR).forEach((file) => {
    if (!file.endsWith('.json')) {
      return
    }
    const date = file.replace('.json', '')
    const currData = require(path.join(CACHE_DIR, file))

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

    result.push({
      date,
      all: getMiddleData(arr)[7],
      mini: getMiddleData(miniStocks)[7],
      mid: getMiddleData(midStocks)[7],
      large: getMiddleData(largeStocks)[7],
    })
  })

  result.sort((a, b) => new Date(a.date) - new Date(b.date))
  fs.writeFileSync(path.join(APP_DIR, 'cp.json'), JSON.stringify(result, null, 2))
}
main()
