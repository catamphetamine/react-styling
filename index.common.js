'use strict'

var styler = require('./build/index').default

exports = module.exports = styler

exports.flat     = require('./build/flat').default
exports.expanded = require('./build/expanded').default

exports['default'] = styler