const path = require( 'path' )
const webpack = require( 'webpack' )
const HtmlWebpackPlugin = require( 'html-webpack-plugin' )
const CleanWebpackPlugin = require( 'clean-webpack-plugin' )
const VueLoaderPlugin = require( 'vue-loader/lib/plugin' )

module.exports = {
	mode: 'development',
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
	watch: true,
	watchOptions: {
		ignored: '/node_modules/'
	},
	devtool: 'inline-source-map',
	devServer: {
		contentBase: '../',
		hot: true, 
		compress: true,
		port: 9000
	},
	plugins: [
		new CleanWebpackPlugin( [ 'dist' ] ),
		new HtmlWebpackPlugin({
			title: 'Hot Module Replacement'
		}),
		new webpack.HotModuleReplacementPlugin(),
		new VueLoaderPlugin()

	]
}
