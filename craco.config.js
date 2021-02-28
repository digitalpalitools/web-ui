// eslint-disable-next-line @typescript-eslint/no-var-requires
const { addBeforeLoader, loaderByName } = require('@craco/craco')

const configure = (webpackConfig) => {
  const wasmExtensionRegExp = /\.wasm$/
  webpackConfig.resolve.extensions.push('.wasm')

  webpackConfig.module.rules.forEach((rule) => {
    const oneOfRules = rule.oneOf || []
    oneOfRules.forEach((oneOf) => {
      if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
        oneOf.exclude.push(wasmExtensionRegExp)
      }
    })
  })

  const wasmLoader = {
    test: /\.wasm$/,
    exclude: /node_modules/,
    loaders: ['wasm-loader'],
  }

  addBeforeLoader(webpackConfig, loaderByName('file-loader'), wasmLoader)

  return webpackConfig
}

module.exports = () => {
  return {
    webpack: {
      configure,
    },
  }
}
