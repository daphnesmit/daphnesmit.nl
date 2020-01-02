const overrideConfig = require('./override-config')
// const overrideCopy = require('./override-copy')
const deployOverrides = require('./environment-overrides/deploy')
const distOverrides = require('./environment-overrides/dist')

module.exports = {
  config: overrideConfig,
  deploy: deployOverrides,
  dist: distOverrides,
  // copy: overrideCopy,
}
