const path = require('node:path')
const fs = require('node:fs')

const { CACHE_DIR, CODE_DIR, APP_DIR, CACHE_CYB_DIR } = require('./config')
const zszMap = require(path.join(CODE_DIR, './zsz.json'))
const { getPriceLimit } = require('./price_limit')

const getMiddleData = (arr) => {
  const mid = Math.floor(arr.length / 2)
  return arr[mid]
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
  await getPriceLimit()
}
main()
