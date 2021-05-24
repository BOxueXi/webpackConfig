// webpack 静态模块打包工具,会在内部构建一个依赖图. 通过入口文件,查找依赖,使用loader,plugin进行打包.
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');// 生成html
const { CleanWebpackPlugin } = require('clean-webpack-plugin');//清空文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //提取css为单独文件
/*
压缩js文件（用其中一个）
uglifyjs-webpack-plugin: 不支持es6语法
terser-webpack-plugin: webpack5以上版本，自带了这个插件，如果使用webpack4,则必须安装
*/
// const TerserWebpackPlugin = require("terser-webpack-plugin");
/*
压缩css（用其中一个）
optimize-css-assets-webpack-plugin： 
css-minimizer-webpack-plugin： 这个插件使用 cssnano 优化和压缩 CSS，在 source maps 和 assets 中使用查询字符串会更加准确，支持缓存和并发模式下运行
*/
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
/*
/*
打包处理html中的图片,比如在html中写 <img src="" />
html-withimg-loader
*/

/*
hash: 代表本次编译。每当编译一次，hash会变，所有的产出资源的hash都是一样
chunkHash: 代码块的hash，一般来说每个entry都会产出一个chunk
contentHash: 跟内容有关
*/
/*
浏览器加前缀
npm i postcss postcss-loader postcss-preset-env -D
安装postcss-preset-env，无需再安装autoprefixer，由于postcss-preset-env已经内置了相关功能。
在rules中使用posscss-loader ,创建postcss.config.js,.browserlistrc文件
*/

/*
js兼容
第一种. babel-loader @babel/core @babel/preset-env : 只能转换基本语法，promise不能转换
第二种. 继续下载 @babel/polyfill: 全部js兼容,但是体积太大
第三种. 继续下载core-js  按需转换

当使用第三种时不能使用第二种
*/
module.exports = {
	/*
		关键字
		source-map: 生成一个map文件,最完整的,文件最大
		eval: 使用eval包含模块代码
		cheap: 不包含列信息
		module: 包含loader的sourceMap
		inline: 不生成单独的map文件，将.map以DataUrl嵌入
	*/
	// devtool: 'source-map',
	// 提供 mode 配置选项，告知 webpack 使用相应环境的内置优化。development,production,none
	mode: 'development',
	//入口文件： 值可以是 字符串，数组，对象
	entry: './src/main.js',
	//打包输出目录
	output: {
		path: path.join(__dirname,'dist'), //输出的目录，只能是绝对路径
		filename: 'js/bundle.js', //输出的文件名，如果的多页面（多入口）需要使用占位符 [hash],[contenthash]
		publicPath: '/' //根路径
	},
	//webpack-dev-server 会把文件写到内存中，提供速度
	devServer: {
		contentBase: path.join(__dirname,'dist'), // 配置开发服务运行时的文件跟目录
		port: 8080, //端口号
		host: 'localhost',//主机
		compress: true //是否启动gzip等压缩
	},
	//这里放优化的内容
	optimization: {
		minimize: true,
		//这里放优化的插件
		minimizer: [
			//压缩js
			// new TerserWebpackPlugin({
			// 	parallel: 4, //开启多线程并发压缩
			// 	cache: true // 开启缓存
			// })
			//压缩css
			new CssMinimizerWebpackPlugin()
		]
	},
	module: {
		rules: [
			/*
			处理css
			style-loader: 把css放到style标签里
			css-loader: 处理css文件
			*/
			{
				test: /\.css$/,
				include: path.join(__dirname,'src'),//引入符合条件的模块
				exclude: /node_modules/,//排除符合条件的模块
				// use: ['style-loader','css-loader']
				use: [MiniCssExtractPlugin.loader,'css-loader','postcss-loader']
			},
			/*
			处理图片
			file-loader,
			url-loader: 内置了file-loader
			*/
			{
				test: /\.(jpg|png|gif|jpeg|svg)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: 'imgs/[name]_[hash:8].[ext]', //指定文件名,可以按照目录
							//小于指定值，会base64处理
							limit: 10 * 1024,
							pulicPath: 'imgs',
							// outputPath: 'imgs',// 把图片放到那个目录
						}
					}
				]
			},
			//解析html中通过src引入的
			{
				test: /\.(html|htm)$/,
				loader: 'html-withimg-loader'
			},
			/* 处理scss
				sass-loader依赖于node-sass
			*/
			{
				test: /\.scss$/,
				use: [MiniCssExtractPlugin.loader,'css-loader','postcss-loader','sass-loader']
			},
			/* 处理less
				less,lsee-loader
			*/
			{
				test: /\.less$/,
				use: [MiniCssExtractPlugin.loader,'css-loader','postcss-loader','less-loader']
			},
			//第一种js兼容(只转换基本语法，Promise等高级语法不能转换)
			{
				test: /\.js/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				//可以使用babel.config.js配置文件
				// options: {
				// 	//预设：指示babel做什么样的兼容性处理
				// 	presets: ['@babel/preset-env']
				// }
			}
			// 第二种： 下载@babel/polyfill ，然后再需要的地方直接引入 import '@babel/polyfill'
			//第三种： 按需加载，下载core-js
			// {
			// 	test: /\.js/,
			// 	exclude: /node_modules/,
			// 	loader: 'babel-loader',
			//可以使用babel.config.js配置文件
			// 	options: {
			// 		//预设：指示babel做什么样的兼容性处理
			// 		presets: [
			// 			[
			// 				'@babel/preset-env',{
			// 					//按需加载
			// 					useBuiltIns: 'usage',
			// 					//指定core-js版本
			// 					corejs: {
			// 						version: 3
			// 					},
			// 					//指定兼容性到哪个浏览器
			// 					targets: {
			// 						chrome: '60',
			// 						firefox: '60',
			// 						ie: '9',
			// 						safari: '10',
			// 						edge: '17'
			// 					}
			// 				}
			// 			]
			// 		]
			// 	}
			// }
			
		]
	},
	plugins: [
		//生成html文件
		new HtmlWebpackPlugin({
			template: './src/index.html',// html模板
			filename: 'index.html', //文件名
			hash: true,// 为了避免缓存，文件名后面会添加hash值 ?hash值
			chunks: ['main'], // 指定在html会引入的js(chunk)文件,不设置会引入所有的文件
			chunksSortMode: 'manual', //对引入的代码块进行排序的模式
		}),
		//清空文件
		new CleanWebpackPlugin(),
		//提取css为单独文件
		new MiniCssExtractPlugin({
			filename: 'css/[name]_[contenthash:8].css',//代码块chunk的名字
			chunkFilename: '[id].css' //在异步加载时使用
		})
	]
}