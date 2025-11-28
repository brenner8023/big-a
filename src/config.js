/**
 * @file config
 */

const path = require('node:path')

const root = process.cwd()

exports.CACHE_DIR = path.join(root, './cache')
exports.CACHE_CYB_DIR = path.join(root, './cache_cyb')
exports.DAILY_DIR = path.join(root, './daily')
exports.DAILY_CYB_DIR = path.join(root, './daily_cyb')

const CODE_DIR = path.join(root, './code')
exports.CODE_DIR = CODE_DIR
exports.BK_DIR = path.join(root, './bk')
exports.APP_DIR = path.join(root, './app')

exports.UPDATE_CONFIG = {
  start: '20251128',
  end: '20251128',
}

exports.POSITIONS = [
  '600036.SH', // 招商银行
  '603049.SH', // 中策橡胶
  '002312.SZ', // 川发龙蟒
]

exports.WORKDAYS = {
  start: '2025-04-07',
}

exports.getAllStocks = () => [
  ...require(path.join(CODE_DIR, 'sz.json')),
  ...require(path.join(CODE_DIR, 'sh.json')),
]
exports.chiNextStocks = require(path.join(CODE_DIR, './chi_next.json'))
