const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

//webpack打包入口
const entry = {
  app: ["@babel/polyfill",'./src/app.jsx'],
  index: './src/index/index.jsx'
};

//通用HTML自动生成的模板，借助HtmlWebpackPlugin实现。
const baseHtmlTemplate = {
  // favicon:"src/favicon.png"
  // template: "src/index.ejs",
  inject: false,
  template: require('html-webpack-template'),
    headHtmlSnippet: '<link rel="stylesheet" href="/react/pace-master/themes/blue/pace-theme-center-atom.css">\n' +
    '    <script data-pace-options=\'{ "ajax": false }\' src="/react/pace-master/pace.js"></script>',

  title: 'Robot',
  mobile: true,
  appMountId: 'root',
  scripts: [
    '//at.alicdn.com/t/font_1558309_r9iu813d1ug.js',//更新后可能需要重启npm
    '/three/build/three.js',
    '/three/examples/js/cnzz.js',
    '/three/examples/js/loaders/MTLLoader.js',
    '/three/examples/js/loaders/OBJLoader.js',
    '/three/examples/js/controls/OrbitControls.js',
  ],
  favicon: "src/images/logo.png",
  minify: {
    removeComments: true,
    collapseWhitespace: false
  }
};

//通用HTML自动生成的模板，借助HtmlWebpackPlugin实现。
const indexHtmlTemplate = {
  // favicon:"src/favicon.png"
  // template: "src/index.ejs",
  inject: false,
  template: require('html-webpack-template'),
    headHtmlSnippet: '<link rel="stylesheet" href="/react/pace-master/themes/blue/pace-theme-center-atom.css">\n' +
    '    <script data-pace-options=\'{ "ajax": false }\' src="/react/pace-master/pace.js"></script>',

  title: 'Robot',
  mobile: true,
  appMountId: 'root',
  scripts: [
    '//at.alicdn.com/t/font_1558309_r9iu813d1ug.js',//更新后可能需要重启npm
  ],
  favicon: "src/images/logo.png",
  minify: {
    removeComments: true,
    collapseWhitespace: false
  }
};

const webpackConfig = {
  entry: entry,
  output: {
    filename: 'js1/[name].[hash:8].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/"
  },
  plugins: [
    //The OccurrenceOrderPlugin is now enabled by default.
    new ExtractTextPlugin({
      filename: 'css1/[name].[hash:8].css',
      disable: process.env.NODE_ENV === "development"
    })


  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
        index: path.resolve(__dirname, 'src/index/'),
      routes: path.resolve(__dirname, 'src/routes/'),
      components: path.resolve(__dirname, 'src/components/'),
      utils: path.resolve(__dirname, 'src/utils/'),
      dataSource: path.resolve(__dirname, 'src/dataSource/'),
      actions: path.resolve(__dirname, 'src/actions/'),
      stores: path.resolve(__dirname, 'src/stores/'),
      layouts: path.resolve(__dirname, 'src/layouts/'),
      HOC: path.resolve(__dirname, 'src/HOC/'),
      images: path.resolve(__dirname, 'src/images/'),
      node_modules: path.resolve(__dirname, 'node_modules/'),
    },
    symlinks: false,
    cacheWithContext: false
  },
  externals:{
    three: 'THREE'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [path.resolve(__dirname, "src")],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader','css-loader']
      },
      {
        test: /\.less$/,
        // use: ['style-loader','css-loader', 'less-loader'],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        }),
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[hash:8].[ext]',
              context:'src/images',
              outputPath: 'images1/',
              limit: 8192
            }
          }
        ]
      }
    ]
  }
};

module.exports = ( {analyze, env = 'prod'} = {env: 'prod'} ) => {
  if( analyze ){
    webpackConfig.plugins.push( new BundleAnalyzerPlugin() );
  }

  //生产环境下的额外配置
  if(env === 'prod' ){
    console.log("You are in production environment now!")

    if( baseHtmlTemplate.scripts ) {
      baseHtmlTemplate.scripts.push( glob.sync('dist/vendor/vendor.*.dll.js')[0].slice(4) );
    }

    if( indexHtmlTemplate.scripts ) {
      indexHtmlTemplate.scripts.push( glob.sync('dist/vendor/vendor.*.dll.js')[0].slice(4) );
    }
    const extraPlugins = [
      //清理dist文件夹，防止带有hash值的文件堆积
      new CleanWebpackPlugin(['dist'], {exclude: ['vendor','three','pace-master','pdf.js']}),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      //和DllPlugin配合使用避免每次打包重复打包vendor
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./dist/vendor/manifest.json')
      }),
      new UglifyJSPlugin()
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: "manifest",
      //   minChunks: Infinity
      // })
    ];
    webpackConfig.plugins.push(...extraPlugins);
  }

  //开发环境下的额外配置
  if(env === 'dev' ){
    console.log("You are in development environment now!")
    const extraPlugins = [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
      })
    ];
    const extraConfig = {
      devtool: 'cheap-module-eval-source-map',
      devServer: {
        port: 8080,
        host: '0.0.0.0',
        contentBase: 'src/',        //非webpack输出的内容从这里定位
        historyApiFallback:   {
          //根据路由信息返回不同页面
          rewrites: [
            { from: /^\/$/, to: '/index.html' },
            { from: /./, to: '/app.html' }
          ]
        },
        proxy: [{
          context: ["/three", "/api"],
          target: "http://localhost:8000",
        }]
      }
    };
    webpackConfig.plugins.push(...extraPlugins);
    Object.assign(webpackConfig, extraConfig);
  }

  Object.keys(entry).forEach( chunks => {
    var template=(chunks=='index'?indexHtmlTemplate:baseHtmlTemplate);
    const customHtmlTemplate = Object.assign({},template,{
      filename: `${chunks}.html`,
      chunks: [chunks,'common'],
    });
    //console.log(template);
    webpackConfig.plugins.push(new HtmlWebpackPlugin(customHtmlTemplate));
  })

    //console.log(webpackConfig);

  return webpackConfig;
};
