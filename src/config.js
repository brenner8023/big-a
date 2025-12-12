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
  start: '20251201',
  end: '20260101',
}

exports.POSITIONS = [
  '603049.SH', // 中策橡胶
  '600570.SH', // 恒生电子
  '002756.SZ', // 永兴材料
  '002979.SZ', // 雷赛智能
  '000400.SZ', // 许继电气
  '000881.SZ', // 中广核技
  '600362.SH', // 江西铜业
  '600409.SH', // 三友化工
]

exports.getAllStocks = () => [
  ...require(path.join(CODE_DIR, 'sz.json')),
  ...require(path.join(CODE_DIR, 'sh.json')),
]
exports.chiNextStocks = require(path.join(CODE_DIR, './chi_next.json'))
