/**
 * @file config
 */

const path = require('node:path')

const root = process.cwd()

exports.CACHE_DIR = path.join(root, './cache')
exports.DAILY_DIR = path.join(root, './daily')

const CODE_DIR = path.join(root, './code')
exports.CODE_DIR = CODE_DIR

exports.TOKEN = ''

exports.UPDATE_CONFIG = {
  start: '20251104',
  end: '20251104',
}

exports.POSITIONS = [
  '600036.SH_招商银行',
  '002459.SZ_晶澳科技',
  '002416.SZ_爱施德',
  '600188.SH_兖矿能源',
  '600333.SH_长春燃气',
  '603050.SH_科林电气',
  '002548.SZ_金新农',
]

exports.WORKDAYS = {
  start: '2025-04-07',
}

exports.getAllStocks = () => [
  ...require(path.join(CODE_DIR, 'sz.json')),
  ...require(path.join(CODE_DIR, 'sh.json')),
]
