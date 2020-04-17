const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const extractSass = new ExtractTextPlugin({
  filename: '/css/app.css'
})

function scriptRules() {
  return [
    {
      test: /\.js$/,
      exclude: [/node_modules/],
      use: {
        loader: 'babel-loader'
      }
    }
  ]
}

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


let config = {
  module: {
    rules: sassRules().concat(scriptRules())
  },
  plugins: [
    extractSass
  ]
},
styleConfig = Object.assign({}, config, {
  entry: './resources/assets/sass/app.scss',
  output: {
    path: path.resolve('./public/'),
    filename: 'css/app.css'
  },
}),
menuConfig = Object.assign({}, config, {
  entry: './resources/assets/scripts/menu.js',
  output: {
    path: path.resolve('./public/'),
    filename: 'js/menu.js'
  },
}),
jelpiConfig = Object.assign({}, config, {
  entry: './resources/assets/scripts/app.js',
  output: {
    path: path.resolve('./public/'),
    filename: 'js/app.js'
  },
}),
givehelpConfig = Object.assign({}, config,{
  entry: './resources/assets/scripts/givehelp.js',
  output: {
    path: path.resolve('./public/'),
    filename: 'js/givehelp.js'
  },
}),
safetyConfig = Object.assign({}, config,{
  entry: './resources/assets/scripts/safety.js',
  output: {
    path: path.resolve('./public/'),
    filename: 'js/safety.js'
  },
});
module.exports = [
  styleConfig,
  menuConfig,
  jelpiConfig,
  givehelpConfig,
  safetyConfig
];