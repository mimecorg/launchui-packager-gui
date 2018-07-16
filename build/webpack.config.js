const path = require( 'path' );
const webpack = require( 'webpack' );
const MinifyPlugin = require( 'babel-minify-webpack-plugin' );
const VueLoaderPlugin = require( 'vue-loader/lib/plugin' );
const VuidoTemplateCompiler = require( 'vuido-template-compiler' );

const Version = require( '../package' ).version;

module.exports = function( { production } = {} ) {
  if ( production )
    process.env.NODE_ENV = 'production';

  const config = {
    entry: './src/main.js',
    output: {
      path: path.resolve( __dirname, '../dist' ),
      filename: production ? 'main.min.js' : 'main.js'
    },
    target: 'node',
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            compiler: VuidoTemplateCompiler
          }
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [ '.js', '.vue', '.json' ]
    },
    plugins: [
      new webpack.ExternalsPlugin( 'commonjs', [ 'libui-node', 'rcedit' ] ),
      new webpack.EnvironmentPlugin( {
        NODE_ENV: production ? 'production' : 'development'
      } ),
      new VueLoaderPlugin()
    ],
    performance: {
      hints: false
    },
    stats: {
      children: false,
      modules: false
    },
    devtool: false
  };

  if ( production ) {
    config.plugins.push( new MinifyPlugin( {}, { comments: false } ) );
    config.plugins.push( new webpack.BannerPlugin( {
      banner: 'LaunchUI Packager GUI v' + Version + ' | Copyright (C) 2018 Michał Męciński | License: MIT'
    } ) );
  } else {
    config.plugins.push( new webpack.NamedModulesPlugin() );
  }

  return config;
}
