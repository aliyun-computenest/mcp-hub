const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
    allowedHosts: ['all', '.alibaba-inc.com'],
    // 添加静态文件服务配置
    static: [
      {
        directory: path.join(__dirname, 'public'),
        publicPath: '/',
      }
    ],
    // 添加自定义中间件来处理配置文件
    setupMiddlewares: (middlewares, devServer) => {
      // 处理 config.json
      devServer.app.get('/config.json', (req, res) => {
        const configPath = path.join(__dirname, 'public/config.json');
        console.log('Serving config.json from:', configPath);
        res.sendFile(configPath, (err) => {
          if (err) {
            console.error('Error serving config.json:', err);
            res.status(404).json({ error: 'Config file not found' });
          }
        });
      });

      // 处理 config_detail.json
      devServer.app.get('/config_detail.json', (req, res) => {
        const configPath = path.join(__dirname, 'public/config_detail.json');
        console.log('Serving config_detail.json from:', configPath);
        res.sendFile(configPath, (err) => {
          if (err) {
            console.error('Error serving config_detail.json:', err);
            res.status(404).json({ error: 'Config detail file not found' });
          }
        });
      });

      // 处理开发环境的服务器配置
      devServer.app.get('/server-config.json', (req, res) => {
        const serverConfig = {
          publicIp: process.env.PUBLIC_IP || '47.84.65.28',
          privateIp: process.env.PRIVATE_IP || '192.168.1.100',
          publicToken: process.env.PUBLIC_TOKEN || 'K97iOtPxGe',
          privateToken: process.env.PRIVATE_TOKEN || 'K97iOtPxGe',
          usePublicIp: (process.env.USE_PUBLIC_IP || 'true') === 'true'
        };
        console.log('Serving server config:', serverConfig);
        res.json(serverConfig);
      });

      return middlewares;
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: 'body'
    })
  ]
};
