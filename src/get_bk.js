const fs = require('node:fs')
const path = require('node:path')

const { BK_DIR, DAILY_DIR, CODE_DIR } = require('./config')
const { calcMa, calcKDJ } = require('./tools')

const zszMap = require(path.join(CODE_DIR, './zsz.json'))
const getDetailUrl = (code) => {
  const time = +Date.now()
  const cb = `get_bk_detail`
  const fields = 'f12,f14'
  const ut = 'fa5fd1943c7b386f172d6893dbfba10b'
  return `https://push2.eastmoney.com/api/qt/clist/get?np=1&fltt=1&invt=2&cb=${cb}&fs=b%3A${code}%2Bf%3A!50&fields=${fields}&fid=f3&pn=1&pz=100&po=1&dect=1&ut=${ut}&wbp2u=%7C0%7C0%7C0%7Cweb&_=${time}`
}

async function main() {
  const flag = false
  if (flag) {
    const bkList = require(path.join(BK_DIR, './bk.json'))
    const result = {}
    const pList = bkList.map((item) => fetch(getDetailUrl(item.code)))
    const resList = await Promise.all(pList)
    const textList = await Promise.all(resList.map((item) => item.text()))
    textList.forEach((resText, index) => {
      const {
        data: { diff },
      } = JSON.parse(resText.replace('get_bk_detail(', '').replace(/\);$/, ''))
      let stockList = diff.map((item) => {
        let code = item.f12
        if (code.startsWith('60')) {
          code += '.SH'
        } else if (code.startsWith('00')) {
          code += '.SZ'
        }
        return {
          code,
          name: item.f14,
        }
      })
      stockList = stockList.filter(
        (item) => item.code.startsWith('60') || item.code.startsWith('00')
      )
      stockList = stockList.filter(
        (item) =>
          !item.name.includes('ST') && !item.name.startsWith('C') && !item.name.startsWith('N')
      )
      if (stockList.length < 10) {
        return
      }
      const bkName = bkList[index].name
      result[bkName] = stockList
    })
    fs.writeFileSync(path.join(BK_DIR, './bk_detail.json'), JSON.stringify(result, null, 2))
  }
  const bkDetail = require(path.join(BK_DIR, './bk_detail.json'))
  let result = []
  Object.keys(bkDetail).forEach((bkName) => {
    const bkResult = []
    bkDetail[bkName].forEach((item) => {
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
      if (zsz > 30 && rate > 1 && ma13 > ma60) {
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
      bkName,
      stocks: bkResult,
    })
  })
  result = result.filter((item) => item.stocks.length > 0.5 * bkDetail[item.bkName].length)
  fs.writeFileSync('./_bk.json', JSON.stringify(result, null, 2))
}
main()
