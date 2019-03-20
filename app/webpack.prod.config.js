const path = require( 'path' )
const webpack = require( 'webpack' )
const HtmlWebpackPlugin = require( 'html-webpack-plugin' )
const CleanWebpackPlugin = require( 'clean-webpack-plugin' )
const VueLoaderPlugin = require( 'vue-loader/lib/plugin' )

module.exports = {
	mode: 'production',
	entry: [ './components/raw/index.js' ],
	resolve: {
		alias: {
			'vue': 'vue/dist/vue.common.js'
		}
		
	},
	output: {
		filename: 'bundle.js'
	},
	module: {
		rules: [
		{
			test: /\.css$/,
			use: [ 'style-loader', 'css-loader' ]
		},{
			test: /\.sass$/,
			use: [ 'sass-loader' ]
		 },{
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: [ '@babel/preset-env' ],
					plugins: [ '@babel/plugin-transform-template-literals' ]
				}
			}
		},{
			test: /\.vue$/,
			loader: 'vue-loader',
			options: {
				loader: {
					css: [ 'vue-style-loader' , {
						loader: 'css-loader'
					}],
					js: [ 'babel-loader' ]
				},
				cacheBusting: true
			}
		}
		]
	},
	watch: false,
	devtool: 'inline-source-map',
	plugins: [
		new CleanWebpackPlugin( [ 'dist' ] ),
		new webpack.HotModuleReplacementPlugin(),
		new VueLoaderPlugin()
	]
}
