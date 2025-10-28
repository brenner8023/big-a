/**
 * @file https://stockapp.finance.qq.com/mstats/http:/gu.qq.com/i/#mod=list&id=hs_hsj&module=hs&type=hsj
 * 从腾讯证券获取个股列表
 */

const fs = require('node:fs')
const path = require('node:path')

const { CODE_DIR } = require('./config')

const getUrl = (offset, count = 100) => {
  return `https://proxy.finance.qq.com/cgi/cgi-bin/rank/hs/getBoardRankList?_appver=11.17.0&board_code=aStock&sort_type=price&direct=down&offset=${offset}&count=${count}`
}
const headers = {
  accept: '*/*',
  'accept-language': 'zh-CN,zh;q=0.9',
  'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-site',
  Referer: 'https://stockapp.finance.qq.com/',
}

async function main() {
  const total = 5400
  const pList = []

  for (let i = 0; i < total; i += 100) {
    pList.push(fetch(getUrl(i), { headers }))
  }
  const resList = await Promise.all(pList)
  const result = await Promise.all(resList.map((item) => item.json()))
  const szArr = [] // 深市主板
  const shArr = [] // 沪市主板
  result.forEach((_item) => {
    _item.data.rank_list.forEach((item) => {
      const st = item.name.includes('ST')
      const sz = item.code.startsWith('sz0') && !st
      const sh = item.code.startsWith('sh60') && !st
      if (sz) {
        szArr.push({
          code: item.code.replace('sz', '') + '.SZ',
          name: item.name,
        })
      } else if (sh) {
        shArr.push({
          code: item.code.replace('sh', '') + '.SH',
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
  console.log('深市主板', szArr.length)
  console.log('沪市主板', shArr.length)
}
main()
