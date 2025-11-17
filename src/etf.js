const ETF_CODES = [
  '515050',
  '512760',
  '159516',
  '513500',
  '159967',
  '512980',
  '159992',
  '159915',
  '159949',
  '159363',
  '159755',
  '513030',
  '159611',
  '159985',
  '515400',
  '159997',
  '515260',
  '512200',
  '515790',
  '512670',
  '513120',
  '159691',
  // '513630',
  '513750',
  '513530',
  '159792',
  '513190',
  '513980',
  '520980',
  '159323',
  '159735',
  '515210',
  '517090',
  '159667',
  '560860',
  // '511010',
  '159628',
  '159870',
  '518880',
  '517520',
  '512890',
  '159920',
  '510300',
  '159316',
  '513690',
  '513330',
  '513130',
  '159699',
  '513060',
  '512690',
  '159745',
  '159996',
  '512660',
  '512710',
  '516950',
  '516970',
  '562500',
  '159530',
  '510230',
  '159851',
  '512720',
  '513360',
  '512040',
  '588030',
  '588000',
  '588790',
  '588830',
  '588200',
  '588100',
  '588860',
  '589000',
  '159766',
  '159601',
  '512990',
  '515220',
  '159930',
  '159825',
  '159981',
  '159941',
  '516110',
  '159819',
  '513520',
  '159852',
  '159781',
  '159905',
  '515170',
  '561190',
  '159837',
  '512290',
  '510760',
  '159901',
  '510180',
  '510050',
  '510880',
  '515880',
  '159378',
  '512580',
  '159786',
  '516910',
  '159928',
  '510150',
  '515650',
  '159732',
  '513090',
  '515700',
  '516160',
  '515030',
  '159995',
  '516780',
  '159939',
  '562800',
  '512170',
  '159883',
  '515900',
  '561580',
  '560170',
  '159980',
  '512400',
  '512800',
  '159869',
  '512010',
  '159865',
  '513050',
  '513310',
  '515250',
  '516800',
  '512880',
  '512070',
  '510410',
  '159647',
  '159201',
  '512910',
  '512100',
  '563300',
  '510500',
  '515800',
  '560350',
  '159338',
  '515080',
]

function calcEtfKDJ(data, period = 9) {
  if (!data || data.length < period) {
    return { K: 50, D: 50, J: 50 }
  }

  const closes = data
  const lows = data
  const highs = data

  const RSV = []
  const K = []
  const D = []
  const J = []

  // 计算RSV
  for (let i = period - 1; i < data.length; i++) {
    const recentHighs = highs.slice(i - period + 1, i + 1)
    const recentLows = lows.slice(i - period + 1, i + 1)
    const maxHigh = Math.max(...recentHighs)
    const minLow = Math.min(...recentLows)

    if (maxHigh === minLow) {
      RSV.push(50)
    } else {
      RSV.push(((closes[i] - minLow) / (maxHigh - minLow)) * 100)
    }
  }

  // 计算K、D、J值
  K[0] = 50 // 初始K值
  D[0] = 50 // 初始D值

  for (let i = 0; i < RSV.length; i++) {
    if (i > 0) {
      K[i] = (2 / 3) * K[i - 1] + (1 / 3) * RSV[i]
      D[i] = (2 / 3) * D[i - 1] + (1 / 3) * K[i]
    } else {
      K[0] = (2 / 3) * 50 + (1 / 3) * RSV[0]
      D[0] = (2 / 3) * 50 + (1 / 3) * K[0]
    }
    J[i] = 3 * K[i] - 2 * D[i]
  }

  return {
    K: K[K.length - 1],
    D: D[D.length - 1],
    J: J[J.length - 1],
  }
}

const headers = {
  accept: '*/*',
  'accept-language': 'zh-CN,zh;q=0.9',
  'x-requested-with': 'XMLHttpRequest',
}
const getUrl = (etfCode) => `http://www.myetf.net/reqChart?etfCode=${etfCode}`
async function getData(etfCodes) {
  const res = await Promise.all(etfCodes.map((etfCode) => fetch(getUrl(etfCode), { headers })))
  try {
    return await Promise.all(res.map((item) => item.json()))
  } catch (error) {
    console.log(etfCodes)
    return []
  }
}

async function main() {
  const result = []
  const offset = ETF_CODES.length
  for (let i = 0; i < ETF_CODES.length; i += offset) {
    const etfCodes = ETF_CODES.slice(i, i + offset)
    const data = await getData(etfCodes)
    result.push(...data)
  }
  const etfArr = []
  result.forEach((item) => {
    const data = item.shareStat
    const values = data.values
    const { J } = calcEtfKDJ(values)
    let ma60 = 0
    values.slice(-60).forEach((num) => {
      ma60 += num
    })
    ma60 = ma60 / 60
    if (J < 13 && values[values.length - 1] >= ma60) {
      etfArr.push({
        code: data.code,
        name: data.name,
        J: +J.toFixed(2),
      })
    }
  })
  etfArr.sort((a, b) => a.J - b.J)
  console.log(etfArr)
  console.log(etfArr.length)
}
main()
