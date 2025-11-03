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
  start: '20251028',
  end: '20251103',
}

exports.WORKDAYS = {
  start: '2025-04-07',
}

exports.getAllStocks = () => [
  ...require(path.join(CODE_DIR, 'sz.json')),
  ...require(path.join(CODE_DIR, 'sh.json')),
]
