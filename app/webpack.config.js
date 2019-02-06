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
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: [ '@babel/preset-env' ]
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
		contentBase: './dist',
		hot: true
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
