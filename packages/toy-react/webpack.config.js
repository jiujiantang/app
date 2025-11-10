module.exports = {
  entry: {
    main: './main.js',
  },
  mode: 'development',
  optimization: {
    minimize: false,
  },
  module:{
    rules:[
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            "plugins": [
              ["@babel/plugin-transform-react-jsx", {
                "runtime": "classic",          // 用旧运行时，才能启用 pragma
                "pragma": "createElement",     // <div/> -> createElement(...)
                "pragmaFrag": "Fragment"       // 可选：<>...</> -> Fragment
              }]
            ]
          }
        },
      }
    ]
  }
}