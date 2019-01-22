const path = require( 'path' )
const webpack = require( 'webpack' )
const HtmlWebpackPlugin = require( 'html-webpack-plugin' )
const CleanWebpackPlugin = require( 'clean-webpack-plugin' )

module.exports = {
	mode: 'development',
	entry: [ './assets/js/front/cartes.js' ],
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
		new webpack.HotModuleReplacementPlugin()

	]
}
