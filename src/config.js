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
  start: '20260101',
  end: '20260201',
}

exports.POSITIONS = [
  '000301.SZ', // 东方盛虹
  '003019.SZ', // 宸展光电
  '603992.SH', // 松霖科技
  '600522.SH', // 中天科技
  '603728.SH', // 鸣志电器
  '603121.SH', // 华培动力
]

exports.getAllStocks = () => [
  ...require(path.join(CODE_DIR, 'sz.json')),
  ...require(path.join(CODE_DIR, 'sh.json')),
]
exports.chiNextStocks = require(path.join(CODE_DIR, './chi_next.json'))
