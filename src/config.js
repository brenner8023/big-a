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
  start: '20250301',
  end: '20250501',
}

exports.WORKDAYS = {
  start: '2025-04-07',
}

exports.ALL_STOCKS = [
  ...require(path.join(CODE_DIR, 'sz.json')),
  ...require(path.join(CODE_DIR, 'sh.json')),
]
