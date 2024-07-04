const path = require('path')
const fs = require('fs')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')
/*const dotenv = require('dotenv')
dotenv.config()*/

module.exports = (env, argv) => {
	const isProduction = argv.mode == 'production'
	const isDevelopment = argv.mode == 'development'
	const isStaging = argv.mode == 'staging'
	
	const styleRules = {
		test: /\.s?css$/,
		use: [
			'style-loader',
			'css-loader',
			{
				loader: 'resolve-url-loader',
				options: {
					root: path.resolve(__dirname, 'src'),
					removeCR: true
				}
			},
			{ loader: 'sass-loader', options: { sourceMap: true } }
		]
	}
	const imageResourceLoader = {
		test: /\.(bmp|gif|jpe?g|png)$/,
		type: 'asset/resource'
	}
	const imageInlineResourceLoader = {
		test: /\.(bmp|gif|jpe?g|png)$/,
		type: 'asset/inline'
	}

	const rules = [
		{
			test: /\.svg$/,
			issuer: /\.[jt]sx?$/,
			loader: 'svg-inline-loader'
		},
		imageResourceLoader,
		//imageInlineResourceLoader,
		{
			oneOf: [
				styleRules,
				{
					test: /\.(js|jsx|ts|tsx)$/,
					include: path.resolve(__dirname, 'src'),
					loader: 'babel-loader',
					options: {
						presets: [
							['@babel/preset-typescript'],
							['@babel/preset-react', { runtime: 'automatic' }]
						],
						plugins: [
							[
								require.resolve(
									'babel-plugin-named-asset-import'
								),
								{
									loaderMap: {
										svg: {
											ReactComponent:
												'@svgr/webpack?-svgo,+titleProp,+ref![path]'
										}
									}
								}
							]
						]
					},
					exclude: [/node_modules/]
				}
			]
		}
	]

	const config = {
		devtool: isProduction || isStaging ? false : 'source-map',
		entry: [path.resolve(__dirname, 'src/index.js')],
		output: {
			filename: 'static/js/[name].[contenthash:8].js',
			path: path.resolve(__dirname, 'build'),
			publicPath: '/'
		},
		module: {
			rules
		},
		resolve: {
			extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.css'],
			modules: ['node_modules', 'src/assets'],
			alias: {
				/* Alias de folders locales */
				Assets: path.resolve(__dirname, 'src/assets'),
				assets: path.resolve(__dirname, 'src/assets'),
				Components: path.resolve(__dirname, 'src/components'),
				components: path.resolve(__dirname, 'src/components'),
				Constants: path.resolve(__dirname, 'src/constants'),
				Containers: path.resolve(__dirname, 'src/containers'),
				Data: path.resolve(__dirname, 'src/data'),
				Helpers: path.resolve(__dirname, 'src/helpers'),
				Hoc: path.resolve(__dirname, 'src/Hoc'),
				Hooks: path.resolve(__dirname, 'src/hooks'),
				Lang: path.resolve(__dirname, 'src/lang'),
				Notifications: path.resolve(__dirname, 'src/notifications'),
				Layout: path.resolve(__dirname, 'src/layout'),
				Redux: path.resolve(__dirname, 'src/redux'),
				Utils: path.resolve(__dirname, 'src/utils'),
				utils: path.resolve(__dirname, 'src/utils'),
				Views: path.resolve(__dirname, 'src/views'),
				views: path.resolve(__dirname, 'src/views')
			},
			fallback: {
				crypto: require.resolve('crypto-browserify')
			}
		},
		plugins: [
			new Dotenv(new Dotenv({
				path: isProduction
					? '.env.prod'
					: fs.existsSync('.env')
					? '.env'
					: '.env.dev'
			})),
			new CopyWebpackPlugin({
				patterns: [
					{
						from: path.resolve(__dirname, 'public'),
						to: path.resolve(__dirname, 'build'),
						globOptions: {
							ignore: ['**/*.html']
						}
					},
					{
						from: path.resolve(__dirname, 'src/assets'),
						to: path.resolve(__dirname, 'build/assets'),
						// globOptions: {
						// 	ignore: ['**/*.tsx','**/*.ts','**/*.js','**/*.jsx']
						// },
						info: { minimized: true }
					}
				]
			}),
			new HtmlWebpackPlugin({
				inject: true,
				favicon: 'public/favicon-saber.ico',
				title: 'SABER',
				templateParameters: {
					favicon: 'public/favicon-saber.ico',
					title: 'SABER',
				},
				template: 'public/index.ejs',
				filename: 'index.html'
			})
		].filter(Boolean),
		devServer: {
			client: {
				overlay: {
					errors: true,
					warnings: false
				}
			},
			open: true,
			port: process.env.PORT || 3000,
			compress: true
		}
	}
	console.log('Configuracion de Webpack', JSON.stringify(config, null, 4))
	return config
}
