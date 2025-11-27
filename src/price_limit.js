exports.getPriceLimit = async function () {
  const getUrl = (date) => {
    return `https://webrelease.dzh.com.cn/htmlweb/ztts/api.php?service=getZttdData&date=${date}`
  }
  const headers = {
    'content-type': 'application/json',
  }
  const dateArr = [
    20251114, 20251117, 20251118, 20251119, 20251120,

    20251121, 20251124, 20251125, 20251126, 20251127,
  ]
  const resList = await Promise.all(dateArr.map((date) => fetch(getUrl(date), { headers })))
  const dataList = await Promise.all(resList.map((res) => res.json()))
  let countArr = []
  dataList.forEach((item) => {
    countArr.push(item.data.filter((stock) => !stock.name.includes('ST')).length)
  })
  console.log('涨停板统计: ', countArr)
  console.log('平均: ', countArr.reduce((a, b) => a + b, 0) / 10)
  return
}
