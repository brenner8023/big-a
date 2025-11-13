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
  start: '20250401',
  end: '20250601',
}

exports.POSITIONS = [
  '600036.SH', // 招商银行
  '002548.SZ', // 金新农
  '603225.SH', // 新凤鸣
  '603998.SH', // 方盛制药
  '601319.SH', // 中国人保
  '002961.SZ', // 瑞达期货
  '600026.SH', // 中远海能
  '002533.SZ', // 金杯电工
  '600686.SH', // 金龙汽车
]

exports.WORKDAYS = {
  start: '2025-04-07',
}

exports.getAllStocks = () => [
  ...require(path.join(CODE_DIR, 'sz.json')),
  ...require(path.join(CODE_DIR, 'sh.json')),
]
