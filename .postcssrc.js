// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {},
    "postcss-px-to-viewport":{
      viewportWidth: 1080,
      viewportHeight: 1920,   
      unitPrecision: 3,
      viewPortUnit: 'vw',
      selectorBlackList: ['.ignore','.hairlines'],
      minPixelValue: 1,
      mediaQuery: false
    }
  }
}
