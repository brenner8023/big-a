const fs = require('node:fs')
const path = require('node:path')

const { DAILY_DIR, DAILY_CYB_DIR, CODE_DIR } = require('./config')
const { calcMa, calcKDJ } = require('./tools')

const zszMap = require(path.join(CODE_DIR, './zsz.json'))
const headers = {
  accept: 'application/json, text/javascript, */*; q=0.01',
}
const getDetailUrl = (code) => {
  const finalCode = code.includes('SZ')
    ? `sz${code.replace('.SZ', '')}`
    : `sh${code.replace('.SH', '')}`
  return `https://proxy.finance.qq.com/ifzqgtimg/appstock/app/stockinfo/plateNew?code=${finalCode}&app=wzq&zdf=1`
}

async function setItemsData(codeArr, bkMap) {
  const pList = codeArr.map((code) => fetch(getDetailUrl(code), { headers }))
  const resList = await Promise.all(pList)
  const dataList = await Promise.all(resList.map((item) => item.json()))
  dataList.forEach((item, index) => {
    const code = codeArr[index]
    const {
      data: { plate },
    } = item
    const bkName = plate[1]?.name || plate[0]?.name || ''
    bkMap[bkName] = bkMap[bkName] || []
    bkMap[bkName].push({
      code,
      name: zszMap[code].name,
    })
  })
}

async function updateBk() {
  const bkMap = {}
  const files = fs.readdirSync(DAILY_DIR).filter((file) => path.extname(file) === '.json')
  const cybFiles = fs.readdirSync(DAILY_CYB_DIR).filter((file) => path.extname(file) === '.json')
  const allFiles = [...files, ...cybFiles]
  const codeArr = allFiles.map((file) => file.replace('.json', ''))
  for (let i = 0; i < codeArr.length; i += 100) {
    const batch = codeArr.slice(i, i + 100)
    await setItemsData(batch, bkMap)
    console.log(`Processed ${i + batch.length} / ${codeArr.length}`)
  }
  fs.writeFileSync(path.join(CODE_DIR, './bk.json'), JSON.stringify(bkMap, null, 2))
}

async function main() {
  const flag = false
  if (flag) {
    await updateBk()
  }
  const result = []
  const bkMap = require(path.join(CODE_DIR, './bk.json'))
  Object.keys(bkMap).forEach((bkName) => {
    const stocks = bkMap[bkName]
    const stockArr = []
    stocks.forEach((stock) => {
      const code = stock.code
      const dir = code.startsWith('30') ? DAILY_CYB_DIR : DAILY_DIR
      const dailyData = require(path.join(dir, `${code}.json`))
      const { J } = calcKDJ(dailyData, 9)
      const ma13 = calcMa(dailyData, 13)
      const ma60 = calcMa(dailyData, 60)
      let redCount = 0
      let greenCount = 0
      dailyData.slice(-30).forEach((item) => {
        const pct_chg = item[5]
        const vol = item[6]
        if (pct_chg > 0) {
          redCount += vol
        } else {
          greenCount += vol
        }
      })
      const rate = +(redCount / greenCount).toFixed(2)
      if (rate > 1 && J < 56 && ma13 > ma60) {
        stockArr.push({
          code,
          name: stock.name,
          rate,
          J: +J.toFixed(2),
        })
      }
    })
    if (stockArr.length > 0.5 * stocks.length) {
      stockArr.sort((a, b) => b.rate - a.rate)
      result.push({
        bkName,
        stocks: stockArr,
      })
    }
  })
  fs.writeFileSync('./_bk.json', JSON.stringify(result, null, 2))
}
main()
