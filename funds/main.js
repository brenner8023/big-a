const axios = require('axios')
const cheerio = require('cheerio')
const { FUND_LIST, CLOSE_TEXTS } = require('./const.js')
const { getBaseData } = require('./filter.js')

function getSumNum($) {
  return +$('#position_shares .sum-num').text().trim().replace('%', '')
}

async function checkFundBuyLimit() {
  console.log(`开始检查 ${FUND_LIST.length} 个基金的购买限制...\n`)

  const baseData = await getBaseData()
  const fundsWithoutLimit = []
  let curr = 0

  for (const fund of FUND_LIST) {
    try {
      const response = await axios.get(fund.url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        timeout: 10000,
      })

      const $ = cheerio.load(response.data)
      const buyWayStatic = $('.buyWayStatic .staticCell').text().trim()
      const fundTotalText = $('.infoOfFund td').eq(1).text().trim()
      const fundTotal = Number.parseFloat(fundTotalText.match(/([\d.]+)(?=亿元)/)?.[1] || 0)
      const sumNum = getSumNum($) // 前十持仓占比
      const NumOfMonth3 = +$('.dataOfFund .dataItem02 dd')
        .eq(1)
        .find('.ui-num')
        .text()
        .trim()
        .replace('%', '')
      const NumOfYear3 = +$('.dataOfFund .dataItem02 dd')
        .eq(2)
        .find('.ui-num')
        .text()
        .trim()
        .replace('%', '')

      // 如果不包含关闭文本，则输出URL
      if (
        !CLOSE_TEXTS.some((text) => buyWayStatic.includes(text)) &&
        sumNum < 20 &&
        fundTotal > 0.2 &&
        !Number.isNaN(NumOfMonth3) &&
        !Number.isNaN(NumOfYear3)
      ) {
        fundsWithoutLimit.push({
          name: fund.name,
          url: fund.url,
          NumOfMonth3,
          NumOfYear3,
          fundTotal,
        })
      }
      curr++
      process.stdout.write(`\r${String(curr)}/${FUND_LIST.length}`)
    } catch (error) {
      console.error(`访问失败: ${fund.name}`)
      console.error(`  URL: ${fund.url}`)
      console.error(`  错误: ${error.message}\n`)
    }
  }

  const count6 = Math.ceil(fundsWithoutLimit.length / 2)
  const finalFunds = fundsWithoutLimit
    .filter(
      (fund) => fund.NumOfMonth3 > baseData.baseOfMonth3 && fund.NumOfYear3 > baseData.baseOfYear3,
    )
    .slice()
    .sort((a, b) => b.NumOfYear3 - a.NumOfYear3)
    .slice(0, count6)

  console.log(`\n========== 筛选后的结果 ==========`)
  finalFunds.forEach((fund) => {
    console.log(`${fund.name}`)
    console.log(`  URL: ${fund.url}`)
    console.log(
      `  近3月涨幅: ${fund.NumOfMonth3}%  近3年涨幅: ${fund.NumOfYear3}%  规模: ${fund.fundTotal}亿\n`,
    )
  })

  console.log(`\n========== 检查完成 ==========`)
  console.log(`总共检查: ${FUND_LIST.length} 个基金`)
  console.log(`符合条件的基金: ${fundsWithoutLimit.length} 个`)
  console.log(`最终筛选结果: ${finalFunds.length} 个`)

  return finalFunds
}

checkFundBuyLimit().catch(console.error)
