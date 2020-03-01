// Webpack v4
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
	entry: { Main: './client/src/app.jsx' },
	output: {
		path: path.resolve(__dirname, 'client/dist'),
		filename: 'app.js'
	},
	devServer: {
		inline: true,
		port: 3000
	},
	performance: {
		hints: process.env.NODE_ENV === 'production' ? "warning" : false,
	},
	module: {
		rules: [{
				test: /\.(js|jsx)$/,
				include: path.join(__dirname, '/client/src'),
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ["react", "es2015"],
					plugins: ["transform-es2015-destructuring", "transform-object-rest-spread"]
				}
			},
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader',
					{
						loader: 'postcss-loader',
						options: { sourceMap: true, config: { path: './client/src/public/js/postcss.config.js' } }
					},
				]
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					publicPath: 'images',
					outputPath: 'images'
				}
			},
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'style.css',
		}),
		new HtmlWebpackPlugin({
			inject: true,
			hash: true,
			template: './client/src/public/index.html',
			filename: 'index.html'
		})
	],
};