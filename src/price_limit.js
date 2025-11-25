const fs = require('node:fs')
const path = require('node:path')
const { APP_DIR } = require('./config')

exports.getPriceLimit = async function () {
  const date = 20251116
  const getUrl = () => {
    return `https://webrelease.dzh.com.cn/htmlweb/ztts/api.php?service=getZttdData&date=${date}`
  }
  const getListUrl = (secids) => {
    const fields = 'f12,f14,f2,f3,f4,f25,f20,f13,f18,f6,f145,f100,f265,f266,f297'
    return `https://push2delay.eastmoney.com/api/qt/ulist.np/get?fltt=2&fields=${fields}&secids=${secids.join(
      ','
    )}`
  }
  const headers = {
    'content-type': 'application/json',
  }
  const res1 = await fetch(getUrl(), { headers })
  const { data } = await res1.json()
  const sectorMap = {}
  if (data.length) {
    const secids = data.map((item) => item.code.replace('SZ', '0.').replace('SH', '1.'))
    const res2 = await fetch(getListUrl(secids), { headers })
    const {
      data: { diff },
    } = await res2.json()
    data.forEach((item) => {
      if (item.name.includes('ST')) {
        return
      }
      const code = item.code.replace('SZ', '').replace('SH', '')
      const targetInfo = diff.find((i) => i.f12 === code)
      const stockData = {
        code: item.code,
        name: item.name,
      }
      if (sectorMap[targetInfo.f100]) {
        sectorMap[targetInfo.f100].push(stockData)
      } else {
        sectorMap[targetInfo.f100] = [stockData]
      }
    })
  }
  const result = []
  Object.keys(sectorMap).forEach((key) => {
    result.push({
      sector: key,
      stocks: sectorMap[key],
    })
  })
  result.sort((a, b) => b.stocks.length - a.stocks.length)
  console.log(result.length)
  const dir = path.join(APP_DIR, 'price_limit')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  fs.writeFileSync(path.join(dir, `${date}.json`), JSON.stringify(result, null, 2))
}
