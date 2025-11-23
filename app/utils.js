import data from './cp.json'

export function getDateList() {
  const result = data.map((item) => item.date)
  result.unshift('-default-')
  return result
}

export function calculateMA(dayCount, values) {
  const result = []
  const dateList = getDateList()
  for (let i = 0; i < dateList.length; i++) {
    if (i < dayCount - 1) {
      result.push('-') // 前几天无均线数据，显示为空（或 null）
      continue
    }
    let sum = 0
    for (let j = 0; j < dayCount; j++) {
      sum += values[i - j][1] // 收盘价位置是数据数组中索引1
    }
    result.push((sum / dayCount).toFixed(2))
  }
  return result
}

export function getStockPrices(type) {
  const result = [
    [
      1, // open
      1, // close
      1, // low
      1, // high
    ],
  ]
  data.forEach((item, index) => {
    const changePercent = item[type]
    const prevClosePrice = result[index][1]
    const currClosePrice = +(prevClosePrice * (1 + changePercent / 100)).toFixed(4)
    result.push([
      prevClosePrice,
      currClosePrice,
      Math.min(prevClosePrice, currClosePrice),
      Math.max(prevClosePrice, currClosePrice),
    ])
  })

  return result
}
