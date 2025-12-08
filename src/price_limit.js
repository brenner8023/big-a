const fs = require('node:fs')
const path = require('node:path')

const { CACHE_DIR } = require('./config')

exports.getPriceLimit = async function () {
  const getUrl = (date) => {
    return `https://webrelease.dzh.com.cn/htmlweb/ztts/api.php?service=getZttdData&date=${date}`
  }
  const headers = {
    'content-type': 'application/json',
  }
  const dateArr = fs
    .readdirSync(CACHE_DIR)
    .filter((file) => path.extname(file) === '.json')
    .map((file) => Number(file.replace('.json', '')))
    .sort((a, b) => a - b)
    .slice(-10)

  const resList = await Promise.all(dateArr.map((date) => fetch(getUrl(date), { headers })))
  const dataList = await Promise.all(resList.map((res) => res.json()))
  let countArr = []
  dataList.forEach((item) => {
    countArr.push(item.data.filter((stock) => !stock.name.includes('ST')).length)
  })
  console.log(`${dateArr[0]}-${dateArr[dateArr.length - 1]}涨停板统计: `)
  console.log(countArr)
  console.log('平均: ', countArr.reduce((a, b) => a + b, 0) / 10)
  console.log('\n')
  return
}
