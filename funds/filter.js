const axios = require('axios')
const cheerio = require('cheerio')

/**
 * 业绩比较基准
 * 牛市：科创50 * 40% + 创业板 * 40% + 中证1000 * 10% + 红利低波 * 10%
 * 熊市：中证1000 * 80% + 红利低波 * 20%
 */
const BASE_LINK = {
  KC50: 'https://fund.eastmoney.com/588000.html',
  CYB: 'https://fund.eastmoney.com/159915.html',
  HLDB: 'https://fund.eastmoney.com/512890.html',
  zz1000: 'https://fund.eastmoney.com/512100.html',
}

exports.getBaseData = async function () {
  const data = {}
  for (const etfName of Object.keys(BASE_LINK)) {
    try {
      const response = await axios.get(BASE_LINK[etfName], {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        timeout: 10000,
      })

      const $ = cheerio.load(response.data)
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

      const NumOfMonth6 = +$('.dataOfFund .dataItem03 dd')
        .eq(1)
        .find('.ui-num')
        .text()
        .trim()
        .replace('%', '')

      const NumOfYear1 = +$('.dataOfFund .dataItem01 dd')
        .eq(2)
        .find('.ui-num')
        .text()
        .trim()
        .replace('%', '')

      data[etfName] = {
        NumOfMonth3,
        NumOfYear3,
        NumOfMonth6,
        NumOfYear1,
      }
    } catch (error) {
      console.error(`访问失败: ${etfName}`)
      console.error(`  URL: ${BASE_LINK[etfName]}`)
      console.error(`  错误: ${error.message}\n`)
    }
  }
  const baseOfMonth3 = Math.round(data['zz1000'].NumOfMonth3 * 0.8 + data['HLDB'].NumOfMonth3 * 0.2)
  const baseOfYear3 = Math.round(
    data['KC50'].NumOfYear3 * 0.4 +
      data['CYB'].NumOfYear3 * 0.4 +
      data['zz1000'].NumOfYear3 * 0.1 +
      data['HLDB'].NumOfYear3 * 0.1,
  )
  const baseOfMonth6 = Math.round(
    data['KC50'].NumOfYear3 * 0.4 +
      data['CYB'].NumOfYear3 * 0.4 +
      data['zz1000'].NumOfYear3 * 0.1 +
      data['HLDB'].NumOfYear3 * 0.1,
  )
  const baseOfYear1 = Math.round(
    data['KC50'].NumOfYear3 * 0.4 +
      data['CYB'].NumOfYear3 * 0.4 +
      data['zz1000'].NumOfYear3 * 0.1 +
      data['HLDB'].NumOfYear3 * 0.1,
  )

  console.log('业绩比较基准:', baseOfMonth3, baseOfYear3, baseOfMonth6, baseOfYear1)

  return {
    baseOfMonth3,
    baseOfYear3,
    baseOfMonth6,
    baseOfYear1,
  }
}
