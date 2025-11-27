const fs = require('node:fs')
const path = require('node:path')

const { CODE_DIR, DAILY_DIR, BK_DIR } = require('./config')
const { calcKDJ, calcMa } = require('./tools')

function getUrl(code) {
  const timestamp = +Date.now()
  const ut = 'bd1d9dd80304c38a843e42432f251653'
  const fields = 'f12,f14,f100,f265'

  return `https://push2delay.eastmoney.com/api/qt/clist/get?pn=1&pz=300&po=1&np=3&fid=f3&fs=b:${code}&fields=${fields}&_=${timestamp}&fltt=2&invt=2&ut=${ut}`
}
const headers = {
  'content-type': 'application/json',
}

async function main() {
  const code = ''
  if (code) {
    const res = await fetch(getUrl(code), { headers })
    const {
      data: { diff },
    } = await res.json()
    const stockList = []
    diff.forEach((item) => {
      if (item.f14.includes('ST') || item.f14.startsWith('C')) {
        return
      }
      if (!(item.f12.startsWith('00') || item.f12.startsWith('60'))) {
        return
      }
      let code = ''
      if (item.f12.startsWith('00')) {
        code = item.f12 + '.SZ'
      } else if (item.f12.startsWith('60')) {
        code = item.f12 + '.SH'
      }
      stockList.push({
        code,
        name: item.f14,
      })
    })

    const bkName = diff[0].f100
    fs.writeFileSync(
      path.join(BK_DIR, `${bkName}_${code}.json`),
      JSON.stringify(stockList, null, 2)
    )
  }
  const zszMap = require(path.join(CODE_DIR, './zsz.json'))
  let bkFiles = fs.readdirSync(BK_DIR).filter((item) => item.endsWith('.json'))
  let result = []
  bkFiles.forEach((bkFile) => {
    const bkStockList = require(path.join(BK_DIR, `${bkFile}`))
    const bkResult = []
    bkStockList.forEach((item) => {
      const code = item.code
      const dailyData = require(path.join(DAILY_DIR, `${code}.json`))
      let redCount = 0
      let greenCount = 0
      dailyData.slice(-30).forEach((subItem) => {
        const pct_chg = subItem[5]
        const vol = subItem[6]
        if (pct_chg > 0) {
          redCount += vol
        } else {
          greenCount += vol
        }
      })
      const ma13 = calcMa(dailyData, 13)
      const ma60 = calcMa(dailyData, 60)
      const { J } = calcKDJ(dailyData, 9)
      const zsz = zszMap[code].zsz
      const rate = +(redCount / greenCount).toFixed(2)
      if (J <= 55 && zsz > 50 && rate > 1 && ma13 > ma60) {
        bkResult.push({
          code,
          name: item.name,
          rate,
          J: +J.toFixed(2),
        })
      }
    })
    bkResult.sort((a, b) => b.rate - a.rate)
    result.push({
      bkName: bkFile,
      stocks: bkResult,
    })
  })
  result = result.filter((item) => item.stocks.length > 10)
  result = result.sort((a, b) => b.stocks.length - a.stocks.length)
  fs.writeFileSync('bk.json', JSON.stringify(result, null, 2))
}
main()
