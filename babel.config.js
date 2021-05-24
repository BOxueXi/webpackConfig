module.exports = {
	//预设： 指示babel做什么样的兼容性处理
	presets : [
		[
			'@babel/preset-env',
			{
				//指定兼容性到哪个浏览器
			      targets: {
			        edge: "17",
			        firefox: "60",
			        chrome: "67",
			        safari: "11.1",
			      },
			      useBuiltIns: "usage",//按需加载，默认值为false
			      corejs: "3.12.1",//指定core-js版本
			}
		]
	]
}