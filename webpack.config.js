const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const extractSass = new ExtractTextPlugin({
  filename: '/css/app.css'
})

function sassRules() {
  return [
    {
      test: /\.(sass|scss)$/,
      use: ExtractTextPlugin.extract(
        {
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
    }
  ]
}

module.exports = {
  entry: [
    './resources/assets/sass/app.scss'
  ],
  output: {
    path: path.resolve('./public/')
  },
  module: {
    rules: sassRules()
  },
  plugins: [
    extractSass
  ]
}
