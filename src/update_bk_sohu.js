const fs = require('node:fs')
const axios = require('axios')
const cheerio = require('cheerio')
const iconv = require('iconv-lite')
const bkArr = require('../code/bk_sohu.json')

async function main() {
  const result = {}
  await Promise.all(
    bkArr.map(async (bk) => {
      try {
        // 设置请求头模拟浏览器访问
        const headers = {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        }

        // 使用axios获取页面内容，设置响应编码为GBK（搜狐股票使用GBK编码）
        const response = await axios.get(bk.link, {
          headers,
          responseType: 'arraybuffer',
        })
        // 使用iconv-lite解码GBK内容
        const html = iconv.decode(Buffer.from(response.data), 'gbk')

        // 使用cheerio解析HTML
        const $ = cheerio.load(html)
        const data = []

        // 提取表格数据
        $('tbody tr').each((index, element) => {
          let code = $(element).find('.e1').text().trim()
          const name = $(element).find('.e2').text().trim()
          const flag = code.startsWith('60') || code.startsWith('00') || code.startsWith('30')
          if (code.startsWith('60')) {
            code = code + '.SH'
          } else if (code.startsWith('00')) {
            code = code + '.SZ'
          } else if (code.startsWith('30')) {
            code = code + '.SZ'
          }
          if (name && flag) {
            data.push({ code, name })
          }
        })

        result[bk.name] = data
      } catch (error) {
        console.error(`获取板块 ${bk.name} 失败:`, error.message)
      }
    })
  )

  // 保存结果
  fs.writeFileSync('./_bk_sohu.json', JSON.stringify(result, null, 2))
  console.log('数据获取完成，已保存到 _bk_sohu.json')
}
main()
