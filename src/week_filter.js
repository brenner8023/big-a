const fs = require('node:fs')
const path = require('node:path')

const { CODE_DIR } = require('./config')
const { calcKDJ, calcMa } = require('./tools')
const isRedRenko = require('./renko')

const root = process.cwd()
const weekDir = path.join(root, './week')
let a = 0
function selectStocks(files, dir) {
  const zszMap = require(path.join(CODE_DIR, './zsz.json'))
  const result = []
  files.forEach((file) => {
    if (path.extname(file) !== '.json') {
      return
    }
    const data = require(path.join(dir, file))
    const code = file.replace('.json', '')
    if (!zszMap[code]) {
      console.log('not in zszMap:', code)
    }
    const close = data[data.length - 1][4]
    const name = zszMap[code].name
    const { J } = calcKDJ(data, 9)
    const ma13 = calcMa(data, 13)
    const ma25 = calcMa(data, 25)
    const flag1 = isRedRenko(data) && close > ma25[0]
    const flag3 = zszMap[code].zsz > 50 && ma13[0] > ma25[0]
    const flag4 = J < 70
    const flag = flag1 && flag3 && flag4
    if (flag) {
      result.push({
        id: `${code}_${name}`,
      })
    }
  })
  return result
}

function main() {
  const files = fs.readdirSync(weekDir)
  const weekResult = selectStocks(files, weekDir, 1.3)
  console.log(weekResult)
  console.log(weekResult.length)
  const data = weekResult.map((item) => item.id.split('.')[0]).join(',')
  fs.writeFileSync(path.join('./week.txt'), data)
}
main()
