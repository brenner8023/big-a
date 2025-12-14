/**
 * @file https://vip.stock.finance.sina.com.cn/mkt/#stock_hs_up
 * 从新浪财经获取个股列表
 */

const fs = require('node:fs')
const path = require('node:path')

const { CODE_DIR } = require('./config')

const getUrl = (page, count, node = 'hs_a') => {
  return `https://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHQNodeData?page=${page}&num=${count}&sort=symbol&asc=1&node=${node}&symbol=&_s_r_a=page`
}

const headers = {
  accept: '*/*',
  'accept-language': 'zh-CN,zh;q=0.9',
  'content-type': 'application/x-www-form-urlencoded',
  priority: 'u=1, i',
  'sec-ch-ua-mobile': '?0',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  Referer: 'https://vip.stock.finance.sina.com.cn/mkt/',
}

async function main() {
  const pList = []
  for (let i = 1; i <= 69; i++) {
    pList.push(fetch(getUrl(i, 80), { headers }))
    if (i % 6 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      console.log('fetch code ing:', i)
    }
  }
  const resList = await Promise.all(pList)
  const result = await Promise.all(resList.map((item) => item.json()))
  const szArr = [] // 深市主板
  const shArr = [] // 沪市主板
  const chiNextArr = [] // 创业板
  const zszMap = {}
  result.forEach((arr) => {
    arr.forEach((item) => {
      const sz = item.symbol.startsWith('sz0')
      const sh = item.symbol.startsWith('sh60')
      const isChiNext = item.symbol.startsWith('sz30')
      const code = isChiNext
        ? item.symbol.replace('sz', '') + '.SZ'
        : sh
        ? item.symbol.replace('sh', '') + '.SH'
        : item.symbol.replace('sz', '') + '.SZ'
      if (sz || sh || isChiNext) {
        const zsz = +(item.mktcap / 10000).toFixed(2)
        zszMap[code] = {
          zsz,
          name: item.name,
        }
      }
      if (sz) {
        szArr.push({
          code,
          name: item.name,
        })
      } else if (sh) {
        shArr.push({
          code,
          name: item.name,
        })
      } else if (isChiNext) {
        chiNextArr.push({
          code,
          name: item.name,
        })
      }
    })
  })
  if (!fs.existsSync(CODE_DIR)) {
    fs.mkdirSync(CODE_DIR)
  }
  fs.writeFileSync(path.join(CODE_DIR, 'sz.json'), JSON.stringify(szArr, null, 2))
  fs.writeFileSync(path.join(CODE_DIR, 'sh.json'), JSON.stringify(shArr, null, 2))
  fs.writeFileSync(path.join(CODE_DIR, 'chi_next.json'), JSON.stringify(chiNextArr, null, 2))
  fs.writeFileSync(path.join(CODE_DIR, 'zsz.json'), JSON.stringify(zszMap, null, 2))
  console.log('深市主板', szArr.length)
  console.log('沪市主板', shArr.length)
  console.log('创业板', chiNextArr.length)
}
main()
