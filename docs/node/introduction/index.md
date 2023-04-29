# Node.js 入门

## Node.js 是什么

- JavaScript运行时环境
- 既不是语言，也不是框架，它是一个平台
- Node.js中的JavaScript没有BOM、DOM，只有EcmaScript基础语言部分（**区别于浏览器中的JS**）

以前只有浏览器可以解析执行JavaScript代码，现在可以完全脱离浏览器来运行，一切都归功于Node.js

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。什么事情驱动、非阻塞式I/O，适合高并发应用使用。

## Node 特点

- 事件驱动
- 非阻塞 IO（异步） 模型
- 单线程
- 跨平台

## Node 能干什么

在Node.js中为JavaScript提供了一些服务器级别的API
1. 文件操作能力

2. http服务的能力


- Web服务器后台

- 命令行工具

- 对于前段开发工程师来讲，接触最多的是它的命令行工具

  - 自己写的很少，主要是使用别人第三方的

    - webpack

    - gulp

    - npm

      ……

# 预备知识

- HTML
- CSS
- JavaScript
- 简单的命令行
- 具有服务端开发经验更佳

# 一些资源

cnodejs.org

javascript.ruanyifeng.com



# 起步

## 安装Node环境

- 查看当前Node环境的版本号
  - 命令行：node --version
- 下载：https://nodejs.org/
  - 如果已经安装过，再次安装会覆盖和升级
- 环境变量


## REPL

- read 读取
- eval 执行
- print 输出
- loop 循环

**node辅助测试类似于浏览器中console**



## HelloWord

**解析执行js**

1. 创建编写javascript脚本文件

2. 打开终端，定位到脚本文件所属目录

3. 输入命令 ：node 文件名称(包含.js后缀) 来执行对应的文件

   注意：不要使用node.js来命名脚本文件，否则解析会变成打开文件


# Node中的JavaScript

- EcmaSrcipt
  - 没有BOM、DOM
- 核心模块
- 第三方模块
- 用户自定义模块

## 核心模块

Node为JavaScript提供了很多服务器级别的API，这些API绝大多数都被包装到了一个具名的核心模块中了。例如文件操作的`fs`核心模块，http服务构建的`http`模块，`path`路径操作模块，`os`操作系统信息模块...

以后只要说到这个模块是一个核心模块，就要想到如果要使用它，就必须先使用require方法加载才能使用：

### 文件系统模块

```javascript
//浏览器中的JavaScript是没有文件操作的能力的
//但是Node中的JavaScript具有文件操作的能力
//fs模块：文件系统

//读取文件
//参数1：要读取的文件路径
//参数2：回调函数
//(1)error  (2)data
/*
	成功
	data   数据
	error  null

	失败
	data    undefined
	error  错误对象
*/
var fs = require('fs')
fs.readFile("./data/helloword.txt",function(error,data){
	/*
		.文件存储的数据是二进制，这里显示的是二进制转成的16进制
		.需要用toString()方法显示为字符串
	*/
	if (error) {
		console.log("读取失败！");
	}else{
		console.log(data.toString());
	}
});

//写入文件
/*
参数1：写入的文件路径
参数2：写入文件的内容
参数3：回调函数

	成功
	error:null
	失败
	error:错误对象
*/
fs.writeFile('./data/你好.md','大家好，我是Node.js',function(error){
	if (error) {
		console.log('文件写入失败');
	}else{
		console.log('文件写入成功');
	}
	
});
```



### http模块

```javascript
//1.创建 http 核心对象
var http = require('http');

//2.创建一个Web服务
var server = http.createServer();

//3.接受请求，处理请求，发送响应
//request 请求事件处理函数，需要接收两个参数：
//  Request  请求对象
//		请求对象可以用来获取客户端的一些请求信息，例如请求路径
//	Response  响应对象
//		响应对象可以用来给客户端发送响应信息
server.on('request',function(request,response){
	console.log('收到客户端的请求了，请求路径是'+request.url);

	//response 对象有一个方法：write 可以用来给客户端发送响应数据
	//write 可以使用多次，但是最后一定要使用end 来结束响应，否则客户端会一直等待
	response.write('hello');
	response.write(' nodejs');
	response.end();
});

//4.绑定端口号，启动服务
server.listen(3000,function(){
	console.log("服务已启动");
});


//---------------------------------简写---------------------------------------------
var http = require('http')
http
    .createServer(function(req,res){
    	console.log('请求路径是：'+req.url)
    	response.end('hello nodejs')
	})
    .listen(3000,function(){
    	console.log('服务已启动...')
	})
```



### url模块

```javascript
//url 模块
var url = require('url')

//使用url.parse 方法将路径解析为一个方便操作的对象，第二个参数为 true 表示直接将查询字符串转为一个对象（通过query属性来访问）
var obj = url.parse('/pinglun?name=水电费&message=发送到第三方')

console.log(obj)
console.log(obj.query)
```



## 用户自定义模块

**用户自己编写的模块相对路径必须加 ./**，否则报错

- require
- exports


```javascript
// require 是一个方法
// 它的作用就是用来加载模块的
// 在 Node 中，模块有三种：
//    具名的核心模块，例如 fs、http
//    用户自己编写的文件模块
//      相对路径必须加 ./
//      可以省略后缀名
//      相对路径中的 ./ 不能省略，否则报错
//    在 Node 中，没有全局作用域，只有模块作用域
//      外部访问不到内部
//      内部也访问不到外部
//      默认都是封闭的
//    既然是模块作用域，那如何让模块与模块之间进行通信
//    有时候，我们加载文件模块的目的不是为了简简单单的执行里面的代码，更重要是为了使用里面的某个成员


console.log('a start');
require('./b.js');//相对路径要加 ./，可以省略后缀名
console.log('a end');

//Node中没有全局作用域，只有模块作用域，以下变量不能被外部分访问！，如果使模块间进行通信，请看加载和导出。
var foo = "afoo";
```

**加载和导出**

```javascript
//    在每个文件模块中都提供了一个对象：exports
//    exports 默认是一个空对象
//    你要做的就是把所有需要被外部访问的成员挂载到这个 exports 对象中
var foo = 'bbb'

// console.log(exports)

exports.foo = 'hello'

exports.add = function (x, y) {
  return x + y
}

exports.readFile = function (path, callback) {
  console.log('文件路径：', path)
}

var age = 18

exports.age = age

function add(x, y) {
  return x - y
}

```



```javascript
// require 方法有两个作用：
//    1. 加载文件模块并执行里面的代码
//    2. 拿到被加载文件模块导出的接口对象
var bExports = require('./b')
var fs = require('fs')

console.log(bExports.foo)

console.log(bExports.add(10, 30))

console.log(bExports.age)

bExports.readFile('./a.js')

fs.readFile('./a.js', function (err, data) {
  if (err) {
    console.log('读取文件失败')
  } else {
    console.log(data.toString())
  }
})

```






# Web服务器开发

## ip地址和端口号

- ip地址用来定位计算机
- 端口号用来定位具体的应用程序
- 一切需要联网通信的软件都会占用一个端口号
- 端口号的范围从0-65536之间
- 在计算机中有一些默认端口号，最好不要去使用
  - 例如http服务的80
- 我们在开发过程中使用一些简单好记的就可以了，例如3000、5000等没什么含义
- 在一台计算机中，同一个端口号在同一时间只能被一个程序占用


## Content-Type

```javascript
var http = require('http');

var server = http.createServer();

server.on('request',function(req,res) {
	//在服务默认发送的数据，其实是 utf-8 编码的内容
	//但是浏览器不知道你是 utf-8 编码内容
	//浏览器在不知道服务器响应内容的编码情况下会按照当前操作系统的默认编码去解析
	//中文操作系统默认是 gbk
	//解决方法就是正确的告诉浏览器我给你发送的内容是什么编码的
/*	res.setHeader('Content-Type','text/plain;charset=utf-8');
	res.end('hello 世界');*/

	var url = req.url;
	if (url === '/plain') {
        //如果你响应的数据是html页面，页面的编码方式也会生效，在这里可以省略setHeader
		// text/plain 就是普通文本
		res.setHeader('Content-Type','text/plain;charset=utf-8');
		res.end('hello 世界');
	}else if(url === '/html'){
		// text/html  html文本
		res.setHeader('Content-Type','text/html;charset=utf-8');
		res.end('<p><a href="">hello 世界</a></p>');
	}
});

server.listen(3000,function() {
	console.log('服务已启动...');
});

```



## 请求对象Request

## 响应对象Response

## 在Node中使用模板引擎

安装：

```javascript
nmp install art-template
```

使用：

```javascript
//	在需要使用的文件模块中加载 art-template
//	只需要使用 require 方法加载就可以了
//	参数中的 art-template 就是你下载的包的名字
//  也就是说你 isntall 的名字是什么，则你 require 中的就是什么

var template = require('art-template')

var fs = require('fs')

fs.readFile('./tpl.html',function(err,data) {
	if (err) {
		return console.log('读取文件失败了');
	}


	//默认读取到的 data 是二进制数据
	//二模板引擎 render 方法需要接收的是字符串
	//所以我们在这里需要把 data 二进制数据转为 字符串 才可以给模板引擎使用
	var ret = template.render(data.toString(),{
		name: 'Jack',
		age: 18,
		province: '北京市',
		hobbies:[
			'写代码',
			'唱歌',
			'打游戏'

		]
	})
});
```

浏览器中使用模板引擎：

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>06-在浏览器中使用art-template</title>
</head>
<body>
	<!-- 
		注意：在浏览器中需要引用 lib/template-web.js  文件

		强调：模板引擎不关心你的字符串内容，只关心自己能认识的模板标记语法，例如 {{}}
		{{}} 语法被称之为 mustache 语法，八字胡语法。
	 -->
	 <script src='node_modules/art-template/lib/template-web.js'></script>
	 <script type="text/template" id="tpl">
	 	hello {{ name }}
	 </script>
	 <script>
	 	var ret = template('tpl',{
	 		name: 'Jack'
	 	})

	 	console.log(ret);
	 </script>
</body>
</html>
```



## 留言板案例总结

1. 为了让目录结构保持统一清晰，所以我们约定，把所有的 HTML 文件都放到 views(视图)
2. 我们为了方便的统一处理这些静态资源，所以我们约定把所有的静态资源都存放在 public 目录中

```html
  <!-- 
    浏览器收到 HTML 响应内容之后，就要开始从上到下依次解析，
    当在解析的过程中，如果发现：
      link
      script
      img
      iframe
      video
      audio
    等带有 src 或者 href（link） 属性标签（具有外链的资源）的时候，浏览器会自动对这些资源发起新的请求。
   -->
   <!-- 
      注意：在服务端中，文件中的路径就不要去写相对路径了。
      因为这个时候所有的资源都是通过 url 标识来获取的
      我的服务器开放了 /public/ 目录
      所以这里的请求路径都写成：/public/xxx
      / 在这里就是 url 根路径的意思。
      浏览器在真正发请求的时候会最终把 http://127.0.0.1:3000 拼上

      不要再想文件路径了，把所有的路径都想象成 url 地址
    -->
  <link rel="stylesheet" href="/public/lib/bootstrap/dist/css/bootstrap.css">

  ........

<div class="comments container">
    <ul class="list-group">
    {{each comments}}
    <li class="list-group-item">{{ $value.name }}说：{{ $value.message }}<span class="pull-right">{{ $value.dateTime }}</span></li>
    {{/each}}
    </ul>
  </div>
```



```javascript
//把当前模块所有的依赖项都什么在文件模块最上面 
var http = require('http')
 var fs = require('fs')
 var tempalte = require('art-template')
 var url = require('url')

 var comments = [
 	{
 		name:'张三1',
 		message:'今天天气不错',
 		dateTime:'2015-01-30'
 	},
 	{
 		name:'张三2',
 		message:'今天天气不错',
 		dateTime:'2015-01-30'
 	},
	.......
 ]

//初始化服务简写
 http
 	.createServer(function(req,res) {
     	//这里使用url对象是因为发表留言提交数据时的请求路径是动态的，只能通过它来获取
 		var parseObj = url.parse(req.url,true)
 		var pathName = parseObj.pathname
 		
        //pathname可以获取 ? 前不带字符串参数的路径
 		if(pathName === '/'){
 			fs.readFile('views/index.html',function(err,data){
 				if (err) {
 					return res.end('404 Not Found!')
 				}
 				//模板引擎-页面渲染 render(要渲染的页面（字符串），要渲染的数据)
 				var htmlStr = tempalte.render(data.toString(),{
 					comments:comments
 				})
 				res.end(htmlStr)
 			})
 		}else if (pathName.indexOf('/public/') === 0) {
 			//如果请求路径是以 /public/ 开头的，则认为要获取 public 中的某个资源
 			//所以我们就直接可以把请求路径当作文件路径来直接进行读取
 			console.log(url)
 			fs.readFile('.'+pathName,function(err,data) {
 				res.end(data)
 			})
 		}else if (pathName === '/post') {
 			fs.readFile('views/post.html',function(err,data) {
 				res.end(data)
 			})
 		}else if (pathName === '/pinglun') {

 			var comment = parseObj.query
 			comment.dateTime = '2017-11-2 17:11:22'
 			//comments.push(comment)
 			comments.unshift(comment)//数组头部追加
 			res.statusCode = 302
 			res.setHeader('Location','/')
 			res.end() //记住要结束响应
 		}else{
 			fs.readFile('views/404.html',function(err,data) {
 				res.end(data)
 			})
 		}
 	})
 	.listen(3000,function() {
 		console.log('running...')
 	})
```



# Node中的模块系统

使用Node编写应用程序主要就是在使用：

- EcmaScript语言
  - 和浏览器不一样，在Node中没有BOM、DOM
- 核心模块
  - 文件操作的 fs
  - http 服务的 http
  - url 路径操作模块
  - path 路径处理模块
  - os 操作系统信息
- 第三方模块
  - art-template
  - 必须通过 npm 来下载才可以使用
- 自己写的模块
  - 自己创建的文件



## 什么是模块化

- 文件作用域
- 通信规则
  - 加载
  - 导出

## CommonJS 模块规范

在 Node 中的 JavaScript 还有一个很重要的概念：模块系统 --CommonJS规范。

- 模块作用域
- 使用 require 方法用来加载模块
- 使用 exports 接口对象用来导出模块中的成员

### 加载 require

语法：

```javascript
var 变量名 = require('模块')
```

两个作用：

- 执行被加载模块中的代码
- 得到被加载模块中的`exports`导出接口对象

### 导出 exports

- Node 中是模块作用域，默认文件中所有的成员只在当前文件模块有效
- 对于希望可以被其他模块访问的成员，我们就需要把这些公开的成员挂载到`exports`接口对象中就可以了

导出多个成员（必须在对象中）：

```javascript
exports.a = '123'
exports.b = 'hello'
exports.c = function() {
	console.log('ccc')
}
exports.d = {
	foo:'bar'
}
```

导出单个成员（拿到的就是：函数、字符串）：

```javascript
module.exports = 'bar'

//这里导出了多个，后者会覆盖前者
module.exports = function(x,y) {
	return x+y
}

```

也可以这样导出多个

```javascript
module.exports = {
	str:'1',
	foo:'bar'
}
```

### 原理解析

**exporst** 和 **module.exports** 的区别

- 每个模块中都有一个 module 对象，而module对象中包含一个 exports 对象
- 我们可以把需要导出的成员都挂载到 module.exports 接口对象中
  - 也就是：`module.exports.xxx = xxx`的方式
- 但是这种写法很麻烦，所以 Node 为了你方便，同时在每个模块中提供了一个成员：`exports`
  - `exports === module.exports`为`true`
- 所以 `module.exports.xxx = xxx`的方式完全可以：`exports.xxx === xxx`
- 当一个模块需要导出单个成员的时候，必须使用：`module.exports = xxx`的方式
  - `exports = xxx`不管用，因为每个模块最终向外 `return`的是 `module.exprots`
  - 当你用 `exports = xxx` 的方式就改变了引用类型的地址，这时的 `exports` 就不再是 `module.exports`的引用，导出的 `module.exports` 没有任何改变
- 如果实在分不清楚 `module.exports` 和 `exports`  那就把 `exports` 忘了，只用 `module.exports`

```javascript
//在node中的自定义模块默认有以下
var module = {
	exports:{

	}
}

var exports = module.exports

return module.exports
```



### require 方法加载规则

- 核心模块
  - 模块名
- 第三方模块
  - 模块名
- 用户自己写的
  - 路径



- 优先从缓存加载
- 判断模块标识
  - 核心模块
  - 第三方模块
  - 自己写的模块

```javascript
//路径形式的模块：
// ./  当前目录，不可省略
// ../  上一级目录，不可省略
//  /xxx 这里的 / 指的是盘符根路径，几乎不用
//  d:/a/foo.js  绝对路径，几乎不用
// .js 后缀名可省略
require('标识模块')

//核心模块的本质也是文件
//核心模块文件已经被编译到	了二进制文件了，我们只需要按照名字来加载就可以了
require('fs')
require('http')

//第三方模块
//凡是第三方模块都必须通过 npm 来下载
//使用的时候就可以通过 require('包名') 的方式来进行加载才可以使用
//不可能有任何一个第三方包和核心模块的名字是一样的
//既不是核心模块，也不是路径形式的模块
//  先找到当前文件所属目录中的 node_modules 目录
//  node_modules/art-emplatet
//  node_modules/art-template/package.json 文件
//  node_modules/art-template/package.json 文件中的 main 属性
//  main 属性中就记录了当前 art-template 的入口模块
//  然后加载使用这个第三方包
//  实际上最终加载的还是文件

//	如果 package.json 文件不存在或者 main 指定入口模块也没有
//  则 node 会自动找到目录下的 index.js
//	也就是说 index.js 会作为一个默认备选项
//  如果以上任何条件都成立，则会进入上一级目录中的 node_modules 目录查找
//  如果上一级还没有，则会继续往上上一层查找
// ...
//  如果直到当前磁盘根目录还找不到，最后报错:
//		can not find module xxx 
//  注意：我们一个项目有且只有一个 node_modules 放在项目根目录中，这样的话项目中所有的子目录中的代码都可以加载到第三方包,
//  不会出现多个 node_modules
var template = require('art-template')
```



## npm

- node package manager

### npm 官网

npmjs.com

### npm 命令行工具

npm 的第二层含义就是一个命令行工具，只要你安装了 node 就已经安装了 npm。

npm 也有版本这个概念：

```javascript
//可以通过命令行查询版本
npm --version

//通过命令升级版本
npm install --global npm
```



### 常用命令

- npm init  `自动初始化 package.json `
  - npm init -y  `可以跳过向导，快速生成`

- npm install 包名  `安装第三方包`
  - npm install --save 包名  `将第三方包的依赖项保存到 package.json 的 dependencies`
  - npm i 包名  `简写`
  - npm i  -S 包名  `简写，-S也可以写在包名的后面，注意S是大写`

- npm install  `安装或者说恢复 pack.json 中 dependencies保存的所有依赖项`
  - npm i  `简写`

- npm uninstall 包名  `删除包，如果有依赖信息则会保留`
  - npm uninstall --save 包名  `删除包同时也把依赖信息删除`
  - npm un 包名  `简写`
  - npm un -S 包名  `简写`

- npm help  `查看使用帮助`
  - npm 指定命令 help  `查看指定命令的使用帮助，例如：npm install help`

    ​

    **npm install 包名 --save-dev** ：会将模块依赖写入devDependencies 节点，devDependencies 节点下的模块是我们在开发时需要用的，比如项目中使用的 gulp ，压缩css、js的模块。这些模块在我们的项目部署后是不需要的，所以我们可以使用 -save-dev 的形式安装。

    像 express 这些模块是项目运行必备的，应该安装在 dependencies 节点下，所以我们应该使用 -save 的形式安装。



### 解决 npm 被墙问题

npm 存储包文件的服务器在国外，有时候会被墙，速度很慢，所以我们需要解决这个问题

http://npm.taobao,org/ 淘宝的开发团队把 npm 在国内做了一个备份

安装淘宝的 cnpm:

```javascript
#在任意目录执行都可以
# --global 表示安装到全局，而非当前目录
# --global 不能省略，否则不管用
npm install --global cnpm
```

接下来你安装包的时候把之前的 `npm`  替换成 `cnpm`

举个例子：

```javascript
#这里还是走国外的 npm 服务器，速度比较慢
npm install jquery
#使用 cnpm 就会通过淘宝的服务器来下载 jquery
cnpm install jquery
```

如果不想安装 `cnpm` 又想使用淘宝的服务器来下载：

```javascript
npm install jquery --registry=https://registry.npm.taobao.org
```

但是每一次手动添加参数很麻烦，所以我们可以把这个选项加入配置文件中：

```javascript
npm config set registry https://registry.npm.taobao.org

#查看 npm 配置信息
npm config list
```

只要经过了上面命令的配置，则你以后所有的 `npm install` 都会默认通过淘宝的服务器来下载。



## package.json

我们建议每一个项目的根目录都要有一个 `package.json` 文件（包描述文件，就像产品的说明书一样），给人踏实的感觉。

这个文件可以通过 `npm init` 的方式来自动初始化出来。

控制台命令向导：

```javascript
PS C:\Users\jxGZ1\Desktop\nodeTest> npm init	//初始化包
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (nodetest)			//包名
version: (1.0.0) 1.0.1				//版本
description: 这是一个测试项目		  //项目说明
entry point: (index.js) main.js		 //项目入口
test command:
git repository:						//githup仓库地址
keywords:						    //项目关键字（如果你要发布第三方模块到n）
author: ruanhuasi					//作者
license: (ISC)						//开源许可证
About to write to C:\Users\jxGZ1\Desktop\nodeTest\package.json:

{
  "name": "nodetest",
  "version": "1.0.1",
  "description": "这是一个测试项目",
  "main": "main.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "ruanhuasi",
  "license": "ISC"
}


Is this OK? (yes) yes
```

对于咱们来讲，最有用的是那个 `dependencies` 信息，可以帮我们保存第三方包的依赖信息

- 建议执行安装第三方包的时候都加上 `--save` 这个选项，目的是用来保存依赖项信息

将第三方包依赖信息保存到 `package.json` ：

`npm install art-template --save`

`npm install --save art-template`

--save 写在包名的前后都可以



`install`的简写和同时安装多个第三方包用空格隔开：

`npm i art-template jquery bootstrap --save`  



以上执行完成后会在 `package.json` 得到以下信息：

```javascript
{
  "name": "nodetest",
  "version": "1.0.1",
  "description": "这是一个测试项目",
  "main": "main.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "ruanhuasi",
  "license": "ISC",
  "dependencies": {				// dependencies 就是包依赖的信息
    "art-template": "^4.13.2",
    "bootstrap": "^4.1.3",
    "jquery": "^3.3.1"
  }
}
```



有了 `dependencies`  就算你的 `node_module` 丢失了，我们也可以在项目文件路径下执行

`npm install`  这条命令，它会根据 `package.json`  中的 `dependencies` 中所有依赖项信息重新下载安装



### package.json 和 package-lock.json

npm 5 以前是不会有 `package-lock.json`  这个文件的。

npm 5 以后才加入了这个文件。

当你安装包的时候，npm 都会生成或者更新 `package-lock.json` 这个文件。

- npm 5 以后的版本安装包不需要加 `--save` 参数，它会自动保存依赖信息
- 当你安装包的时候，会自动创建或者是更新 `package-lock.json` 这个文件


- `package-lock.json`  这个文件会保存 `node_modules` 中所有包的信息（版本、下载地址）。这样的话重新 `npm install` 的时候速度就可以提升
- 从文件来看，有一个 `lock` 称之为锁
  - 这个 `lock` 是用来锁定版本的
  - 如果项目依赖了 `1.1.1` 这个版本，你重新 install 其实会下载最新版本，而不是 `1.1.1`
  - 有时候我们会希望可以锁住 1.1.1这个版本
  - 所以这个 `package-lock.json`  这个文件的另一个作用就是锁住版本号，防止自动升级新版本



# path 路径操作模块

> 参考文档：https://nodejs.org/dist/latest-v11.x/docs/api/

- path.basename
  - 获取一个路径的文件名（默认包含扩展名）
- path.dirname
  - 获取一个路径中的目录部分
- path.extname
  - 获取一个路径中的扩展名部分
- peth.parse
  - 把一个路径转为对象
    - root 根路径
    - dir 目录
    - base 包含后缀名的文件名
    - ext 后缀名
    - name 不包含后缀的文件名
- path.join
  - 当你需要进行路径拼接的时候，推荐使用这个方法
- path.isAbsolute
  - 判断一个路径是否是绝对路径



# Node 中的其他成员

在每个模块中，除了 `require` 、`exports` 等模块相关API之外，还有两个特殊的成员：

- `__dirname`  **动态获取**  可以用来获取对当前文件模块所属目录的绝对路径
- `__filename` **动态获取**  可以用来获取当前文件的绝对路径
- `__dirname` 和 `__filename` 是不受执行 node 命令所属路径影响的

在文件操作中，使用相对路径是不可靠的，因为在Node中文件操作的路径被设计为相对于执行 node 命令所处的路径（不是 bug ，人家这样设计是有使用场景）

所以为了解决这个问题，很简单，只需要把相对路径变为绝对路径就可以了。

这里我们就可以使用 `__dirname` 或者 `filename` 来帮我们解决这个问题了。在拼接路径的过程中，为了避免手动拼接带来的一些低级错误，所以推荐多使用：`path.join()` 来辅助拼接

所以为了尽量避免刚才所描述这个问题，大家以后再文件操作中使用的相对路径都统一转换为 **动态的绝对路径**

> 补充：模块中的路径表示和这里的路径没关系，不受影响（相对于文件模块）

```javascript
var fs = require('fs')
var path = require('path')

// 模块中的路径标识和文件操作张的相对路径的表示不一样
// 模块中的路径标识就是相对于当前文件模块，不受执行 node 命令所处路径影响
require('./b')

// 在文件操作时，建议把所有的路径都变成动态的绝对路径，使用两个东西：
// 1. __dirname 或者 __filename 来动态获得绝对路径
// 2. path 模块的 join() 方法用来辅助拼接路径，避免拼接出错
fs.readFile(path.join(__dirname,'./a.txt'),'utf8',function(err,data){
	if (err) {
		throw err
	}
	console.log(data)
})
```





# Express

原生的 http 在某些方面表现不足以应对我们的开发需求，所以我们就需要使用框架来加快我们的开发效率，框架的目的就是提高效率，让我们的代码更高度统一。

在 Node 中，有很多 Web 开发框架，我们这里以学习 express 为主。

- http://expressjs.com

## 起步

### 安装

```javascript
npm install --save express
```

### hello world

```javascript
var express = require('express')

// 1.创建 app
var app = express()

app.get('/',function(req,res) {
	// res.write('hello')
	// res.write('world')
	// res.end()
	
	//res.end('hello world')

	res.send('hello world')
})

app.listen(3000,function() {
	console.log('express app is running...')
})
```

### 基本路由

路由器

- 请求方法
- 请求路径
- 请求处理函数

get:

```javascript
//当你以 GET 方法请求 /  的时候，执行对应的处理函数
app.get('/login',function(req,res) {
	res.send('login page1')
})

```

post:

```javascript
//当你以 POST 方法请求 / 的时候，执行对应的处理函数
app.post('/',function(req,res) {
	res.send('Got a POST request')
})

```

### 静态服务

开放静态资源

```javascript
//1.当请求路径以 /public/ 开头的时候，去 ./public/ 目录中找对应的资源
//这种方式更容易辨识，推荐这种方式
app.use('/public/',express.static('./public/'))

//2.指定路径名称（相当于给 /public/ 起别名）
app.use('/abc/d/',express.static('./public/'))

//3.当省略第一个参数的时候，则可以通过 省略 /public 的方式访问
//这种方式的好处就是可以省略 /publiuc/
app.use(express.static('./public/'))

app.use('/static',express.static(path.join(_dirname,'public')))
```



## 在 Express 中配置使用 `art-template` 模板引擎

安装：

```shell
npm install --save art-template
npm install --save express-art-template
```

配置：

```javascript
app.engine('art',require('express-art-template'))
//也可以指定视图为 .hmtl 结尾
app.engine('html',require('express-art-template'))
```

使用：

```javascript
app.get('/',function(req,res){
    //express 默认回去项目的 views 目录中 index.html
    res.render('index.html',{
        title:'hello world'
    })
})
```

如果希望修改默认的 `views`  视图渲染存储目录，可以：

```javascript
//注意：第一个参数 views 千万不要写错
app.set('views',目录路径)
```





## 中间件

> http://expressjs.com/en/guide/using-middleware.html

中间件的本质就是一个请求处理方法，我们把用户从请求到响应的整个过程分发到多个中间件中去处理，这样做的目的是提高代码的灵活性，动态可扩展的。

- 同一个请求所经过的中间件都是同一个请求对象和响应对象



### 应用程序级别中间件

万能匹配（不关心任何请求路径和请求方法）：

```javascript
app.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})
```

只要是以  '/xxx/' 开头的：

```javascript
app.use('/a',function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})
```



### 路由级别中间件

get:

```javascript
app.get('/',function (req, res) {
  res.send('Hello World!')
})
```

post:

```javascript
app.post('/',function (req, res) {
  res.send('Got a POST request')
})
```

put:

```javascript
app.put('/user',function (req, res) {
  res.send('Got a PUT request at /user')
})
```

delete:

```javascript
app.delete('/user',function (req, res) {
  res.send('Got a DELETE request at /user')
})
```



### 错误处理中间件

```javascript
app.use(function (err,req, res, next) {
   console.error(err.stack)
   res.status(500).send('Something broke')
 })
```



### 内置中间件

- `express.static`  servers static assets such as HTML files,images, and so on.
- `express.json`  parses incoming requests with JSON payloads.**NOTE:Available with Express 4.16.0+**
- `express.urlencoded` parses incoming request with URL-encoded payloads. **NODE:Availale with Express 4.16.0+**



### 第三方中间件

> ​	http://expressjs.com/en/resources/middleware.html

- body-parser
- compression
- cookie-parser
- morgan
- response-time
- serve-static
- session



## 在 Express 获取表单 POST 请求体数据

Express 内置了一个 API ，可以直接通过 `req.query` 来获取

```javascript
req.query
```



但在 Express 中没有内置获取表单 POST 请求体的 API，这里我们需要使用一个第三方包： `body-parser` 。

安装：

```shell
npm install --save body-parser
```

配置：

```javascript
var express = require('express')
//0.引包
var bodyParser = require('body-parser')

var app = express()

// 配置 body-parser
// 只要加入这个配置，则在 req 请求对象上会多出来一个属性：body
// 也就是说你就可以直接通过 req.body 来获取表单 POST 请求数据了
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

```

使用：

```javascript
app.use(function (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted:\n')
    // 可以通过 req.body 来获取表单 POST 请求体数据
  res.end(JSON.stringify(req.body, null, 2))
})
```



## 在 Express 中配置使用 `express-session` 插件

安装：

```shell
npm install express-session
```

配置：

```javascript
// 该插件会为 req 请求对象添加一个成员：req.session 默认是一个对象
// 这是最简单的配置方式，暂且先不用关心里面参数的含义
app.use(session({
// secret是配置加密字符串，它会在原有加密基础之上和这个字符串拼接起来去加密
// 目的是为了增加安全性，防止客户端恶意伪造
  secret: 'itcast', 
  resave: false,
  saveUninitialized: true // 无论你是否使用 Session,我都默认直接给你分配一把钥匙
}))
 
```

使用：

```javascript
// 添加 Session 数据
req.session.foo = 'bar'

// 获取 Session 数据
req.session.foo
```

提示：默认 Session 数据是内存存储的，服务器一旦重启就会丢失，真正的生产环境会把 Session 进行持久化存储。



## CRUD案例

### 模块化思想

模块如果划分：

- 模块职责要单一 

  Node.js有利于学习 Vue , angular , React 前端三大框架

### 起步

- 初始化
- 安装依赖
- 模板处理

### 路由设计

| 请求方法 | 请求路径         | get 参数 | post 参数                      | 备注             |
| -------- | ---------------- | -------- | ------------------------------ | ---------------- |
| GET      | /students        |          |                                | 渲染首页         |
| GET      | /students/new    |          |                                | 渲染添加学生页面 |
| POST     | /students/new    |          | name、age、gender、hobbies     | 处理添加学生请求 |
| GET      | /students/edit   | id       |                                | 渲染编辑页面     |
| POST     | /students/edit   |          | id、name、age、gender、hobbies | 处理编辑请求     |
| GET      | /students/delete | id       |                                | 处理删除请求     |

### 提取路由模块

router.js：

```javascript
/**
* router.js 路由模块
* 职责：
* 	处理路由
*	根据不同的请求方法+请求路径设置具体的请求处理函数
* 模块职责要单一，不要乱写
* 我们划分模块的目的就是为了增强项目代码的可维护性
* 提升开发效率
*/

var fs = require('fs')

// Express 提供了一种比封装函数更好的方式
// 专门用来包装路由的
var express = require('express')

// 1.创建一个路由容器
var router = express.Router()

// 2.把路由都挂载到 router 路由容器中
router.get('/students/new',function(req,res){
	res.render('new.html')
})

router.get('/students/edit',function(req,res){
	
})

router.post('/students/edit',function(req,res){
	
})

router.get('/students/delete',function(req,res){
	
})


// 3.把 router 导出
module.exports = router
```

app.js：

```javascript
/**
* app.js 入口模块
* 职责：
* 	创建服务
*	做一些服务相关配置
*		模板引擎
*		body-parser 解析表单 post 请求体
*		提供静态资源服务
*	挂载路由
*	监听端口启动服务
*/
var express = require('express')

#导入路由
var router = require('./router')

var bodyParser = require('body-parser')

var app = express()

// 配置模板引擎和 body-parser 一定要在 app.use(router) 挂载路由之前
app.engine('html',require('express-art-template'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

#把路由容器挂载到 app 服务中
app.use(router)

app.listen(3000,function(){
	console.log('running...')
})
```

### 设计操作数据的 API 文件模块

```javascript
/*
	student.js
	数据操作文件模块
	职责：操作文件中的数据，只处理数据，不关心业务
*/

/*
	获取所有学生列表
	return []
*/
exports.find = function() {

}

/*
	添加保存学生
*/
exports.save = function() {

}

/*
	更新学生
*/
exports.update = function() {

}

/*
	删除学生
*/exports.delete = function() {

}
```



### 自己编写的步骤

- 处理模板
- 配置开放静态资源
- 配置模板引擎
- 简单路由： /students 渲染静态页出来
- 路由设计
- 提取路由模块
- 由于接下来一系列的业务操作都需要处理文件
- 数据，所以我们需要封装 student.js
- 先写好 student.js 文件结构
  - 查询所有学生列表的 API find
  - findById
  - save
  - updateById
  - deleteById
- 实现具体功能
  - 通过路由收到请求
  - 接受请求中的数据（get、post）
    - req.query
    - req.body
  - 调用数据操作 API 处理数据
  - 根据操作结果给客户端发送响应
- 业务功能顺序
  - 列表
  - 添加
  - 编辑
  - 删除





# MongoDB

### 关系型数据库和非关系型数据库

**表就是关系，或者说表与表之间存在关系**

- 所有的关系型数据库都需要通过 `sql` 语言来操作

- 所有的关系型数据库在操作之前都需要设计表结构

- 而且数据表还支持约束

  - 唯一的
  - 主键
  - 默认值
  - 非空


**非关系型数据库非常的灵活**

- 有的非关系型数据库就是 key-value 对
- 但是 MongoDB 是长得最像关系型数据库的非关系型数据库
  - 数据库 -> 数据库
  - 数据表 -> 集合（数组）
  - 表记录 -> （文档对象）
- MongoDB 不需要设计表结构
- 也就是说你可以任意的往里面存数据，没有结构性这么一说

### 安装

官方下载地址：https://www.mongodb.com/download-center/community

- 下载
- 安装
- 配置环境变量（bin 目录路径）
- 最后输入 控制台输入 `mongod --version`  测试是否安装成功

### 启动和关闭数据库

如果在系统服务中有 MongoDB 的服务项，可以在那里开关

或者用以下方式

启动：

```shell
# mongodb 默认使用执行 mongod 命令所处盘符根目录下的 /data/db 作为自己的数据存储目录
# 所以在第一次执行该命令之前先自己手动新建一个 /data/db
控制台命令：mongod
```

如果想要修改默认的数据存储目录，可以：

```shell
mongod --dbpath=数据存储目录路径
```

停止：

```shell
在开启服务的控制台，直接 ctrl+c 即可停止。
或者直接关闭开启服务的控制台也可以
```

### 连接和退出数据库

连接：

```shell
# 该命令默认连接本机的 MongoDB 服务
mongo
```

退出：

```shell
#在连接状态输入 exit 退出连接
exit
```

### 基本命令

- `show dbs`
  - 查看显示所有数据库	
- `db`
  - ​	查看当前操作的数据库
- `use 数据库名称`
  - 切换到指定的数据库（如果没有就是新建）
- `show collections`
  - 查看当前数据库所有表（集合）
- `db.集合名称.find()`
  - 查看指定集合的所有数据
- `db.集合名称.insertOne({ "name":"Jack" })`
  - 向指定集合插入一条数据（{ "key":"value" }）




### 在 Node 中如果操作 MongoDB 数据

#### 使用官方的 mongodb 包来操作

https://github.com/mongodb/node-mongodb-native



#### 使用第三方 mongoose 来操作 MongoDB 数据库

> 其实在 MongoDB 官方有一个 mongodb 的包可以用来操作 MongoDB  数据库，这个确实很强大，但是比较原始，麻烦，所以咱们不使用它。

第三方包：mongoose 基于 MongoDB 官方的 mongodb 包再一次做了封装。

- 网址：http://mongoosejs.com/
- 官方指南：http://mongoosejs.com/docs/guide.html
- 官方 API 文档：http://mongoosejs.com/docs/api.html

##### MongoDB 数据库的基本概念

- 可以有多个数据库
- 一个数据库中可以有多个集合（表）
- 一个集合中可以多个文档（表记录）
- 文档结构很灵活，没有任何限制
- MongoDB 非常灵活，不需要像 MySQL 一样先创建数据库、表、表结构
  - 在这里只需要：当你需要插入数据的时候，只需要指定往哪个数据库的哪个集合操作就可以了
  - 一切都由 MongoDB 来帮你自动完成建库建表这件事儿

```javascript
{
    qq:{
        users:[
            {name:'张三',age:15},
            {name:'李四',age:15},
            {name:'王五',age:15},
            {name:'张三123',age:15},
            {name:'张三456',age:15}
            ...
        ],
        products:[
                
        ]
        ...
    },
    taobao:{
            
    },
    baidu:{
            
    }
}
```



##### 起步

安装：

```javascript
npm i mongoose
```

hello world:

```javascript

var mongoose = require( 'mongoose' );

// 连接 MongoDB 数据库
mongoose.connect( 'mongodb://localhost/test');

mongoose.Promise = global.Promise;

// 创建一个模型
// 就是在设计数据库
// MongoDB 是动态的，非常灵活，只需要在代码中设计你的数据库就可以了
// mongoose 这个包就可以让你的设计编写过程变得非常的简单	
var Cat = mongoose.model( 'Cat', { name: String } );

// 实例化一个 Cat
var kitty = new Cat( { name: 'Zildjian' } );

// 持久化保存 kitty 实例
kitty.save()(function(err) {
	if(err){
		console.log(err)
	}else{
		console.log('meow')
	}
});
```

##### 官方指南

###### 设计 Scheme 发布Model

```javascript
var mongoose = require('mongoose')

var Schema = mongoose.Schema //结构对象

// 1.连接数据库
// 指定连接的数据库不需要存在，当你插入第一条数据之后就会自动被创建出来，这里的 itcast 就是即将要创建的数据库名
mongoose.connect('mongodb://localhost/itcast')

// 2.设计文档结构（表结构）
// 字段名称就是表结构中的属性名称
// 值
// 约束的目的是为了保证数据的完整性，不要有脏数据
  var userSchema = new Schema9({
  	username:{
  		type:String,  // 类型
  		required:true // 非空
  	},
  	password:{
  		type:String,
  		required:true
  	},
  	email:{
  		type:String
  	}
  })

  // 3.将文档结构发布为模型
  // 	mongoose.model 方法就是用来将一个架构发布为 model
  // 	第一个参数：传入一个大写名词单数字符串用来表示你的数据库名词
  // 				mongoose 会自动将大写名词的字符串生成 小写复数 的集合名称
  // 				例如这里的 User 最终会变为 users 集合名称
  // 	第二个参数：架构 Schema
  // 	
  // 	返回值：模型构造函数（模型对象）
   var User = mongoose.model('User', userSchema);


 // 4.当我们有了模型构造函数之后，就可以使用这个构造函数对 User 中的数据为所欲为了
```

###### 新增数据

```javascript
var admin = new User({
  username:'张三',
  password:'123456',
  email:'admin@admin.com'
})

 admin.save(function(err,ret) {
 	if(err){
 		console.log('保存失败')
 	}else{
 		console.log('保存成功')
 		console.log(ret)
 	}
 })
```

###### 查询数据

```javascript
#查询所有
User.find(function(err,ret){
    if (err) {
      console.log('查询失败')
    }else{
      console.log(ret)
    }
 })

#条件查询
 User.find({
  username:'张三',
  password:'123456'
 },function(err,ret){
    if (err) {
      console.log('查询失败')
    }else{
      console.log(ret)
    }
 })

#查询单个
User.findOne(function(err,ret){
    if (err) {
      console.log('查询失败')
    }else{
      console.log(ret)
    }
 })

```

###### 删除数据

```javascript
#根据条件删除所有
User.remove({
  username:'张三'
},function(err,ret){
  if (err) {
    console.log('删除失败')
  }else{
    console.log('删除成功')
    console.log(ret)
  }
})

#根据条件删除一个
Model.findOneAndRemove(conditions,[options],[callback])

#根据 id 删除一个
Model.findByIdAndRemove(id,[options],[callback])
```

###### 更新数据

```javascript
#根据条件更新所有
Model.update(conditions,doc,[options],[callback])

#根据条件更新一个
Model.findOneAndUpdate([conditions],[update],[options],[callback])

#根据 id 更新一个
User.findByIdAndUpdate('5bfd259219c0b03acc3e7e81',{
  password:'123'
},function(err,ret){
  if (err) {
    console.log('更新失败')
  }else{
    console.log('更新成功')
  }
})
```



# 使用 Node 操作 MySQL 数据库

安装：

```shell
npm install --save mysql
```




# 异步编程

### 回调函数

```javascript
function(x,y){
    setTimeout(function(){
        var ret = x +y
        return ret
    },1000)
    //到这里执行就结束了，不会等到前面的定时器，所以就直接返回了默认值 undefined
    
    console.log(add(10,20)) // => undefined
    
    
    //注意：凡是需要得到一个函数内部异步操作的结果
    // setTimeout
    // readFile
    // writeFile
    // ajax
    // 这种情况必须通过：回调函数
    
    functin add(x,y,callback){
        // callback 就是回调函数
        // var x = 10
        // var y = 20
        // var callback = function(a){ console.log(ret) }
        console.log(1)
        setTileout(function(){
            var ret =x + y
            callback(ret)
        },1000)
    }
    
    add(10,20,function(a){
        //在这里拿到结果可以做任何操作
        console.log(a)
    })
    
}
```

基于原生 XMLHttpRequest封装 get 方法：

```javascript
    function get(url, callback) {
        var oReq = new XMLHttpRequest()
        // 当请求加载成功之后要调用指定的函数
        oReq.onload = function() {
            // 我现在需要得到这里的 oReq.responseText
            //console.log(oReq.respo nseText)
            callback(oReq, responseText)
        }
        oReq.open("get", url, true)
        oReq.send()
    }

    get('data.json', function(data) {
        console.log(data)
    })
```

### Promise

> ​	参考文档：http://es6.ruanyifeng.com/#docs/promise

无法保证顺序的代码：

```javascript
var fs = require('fs')
// 文件读取是异步函数，无法保证读取顺序

fs.readFile('./data/a.txt','utf8', function(err,data){
	if (err) {
		// return console.log('读取失败')
		
		// 抛出异常
		// 		1.阻止程序的执行
		// 		2.把错误消息打印到控制台
		throw err
	}
	console.log(data)
});	

fs.readFile('./data/b.txt','utf8', function(err,data){
	if (err) {
		// return console.log('读取失败')
		
		// 抛出异常
		// 		1.阻止程序的执行
		// 		2.把错误消息打印到控制台
		throw err
	}
	console.log(data)
});	

fs.readFile('./data/c.txt','utf8', function(err,data){
	if (err) {
		// return console.log('读取失败')
		
		// 抛出异常
		// 		1.阻止程序的执行
		// 		2.把错误消息打印到控制台
		throw err
	}
	console.log(data)
});	
```

通过回调嵌套的方式来保证顺序：回调地狱 callback hell

```javascript
var fs = require( 'fs' )

fs.readFile( './data/a.txt', 'utf8', function( err, data ) {
    if ( err ) {
        // return console.log('读取失败')

        // 抛出异常
        // 		1.阻止程序的执行
        // 		2.把错误消息打印到控制台
        throw err
    }
    console.log( data )
    
    fs.readFile( './data/b.txt', 'utf8', function( err, data ) {
        if ( err ) {
            // return console.log('读取失败')

            // 抛出异常
            // 		1.阻止程序的执行
            // 		2.把错误消息打印到控制台
            throw err
        }
        console.log( data )

        fs.readFile( './data/c.txt', 'utf8', function( err, data ) {
            if ( err ) {
                // return console.log('读取失败')

                // 抛出异常
                // 		1.阻止程序的执行
                // 		2.把错误消息打印到控制台
                throw err
            }
            console.log( data )
        } )
    } )
} )
```

为了解决以上编码方式带来的问题（回调地狱嵌套）所以在 ECMAScript 6 中新增了一个 API：`promise`

- Promise 的英文就是承诺、保证的意思（i promise you）

Promise 基本语法

```javascript
var fs = require('fs')

// 在 EcmaScript 6 中新增了一个 API Promise
// Promise 是一个构造函数
// 

// 创建 Promise 容器
// 1.给别人一个承诺 I promise you.
// 		Promise 容器一旦创建，就开始执行里面的代码
var p1 = new Promise(function(resolve,reject){
	fs.readFile('./data/a.txt','utf8', function(err,data){
		if (err) {
			// 失败了，承诺容器中的任务失败了
			// console.log(err)

			// 把容器的 Pending 状态变为 Rejected
			// 这里调用 reject 方法实际上就是 then 方法传递的第二个 function
			reject(err)
		}else{
			// 承诺容器中的任务成功了
			// console.log(data)

			// 把容器的 Pending 状态变为 Resoleved
			// 这里调用的 resolve 方法实际上就是 then 方法传递的那个 function
			resolve(data)
		}
	})
})

// p1 就是那个承诺
// 当 p1 成功了，然后(then) 做指定操作
// then 方法接收的 function 就是容器中的resolve 函数
p1
  .then(function(data){
  	console.log(data)
},function(err){
	console.log('读取文件失败了',err)
})
```

封装 Promise 版本的 `readFile` :

```javascript
var fs = require( 'fs' )

function pReadFile( filePath ) {
    return new Promise( function( resolve, reject ) {
        fs.readFile( filePath, 'utf8', function( err, data ) {
            if ( err ) {
                reject( err )
            } else {
                resolve( data )
            }
        })
    })
}

// 使用
pReadFile('./data/a.txt')
	.then(function(data){
		console.log(data)
		return pReadFile('./data/b.txt')
	})
	.then(function(data){
		console.log(data)
		return pReadFile('./data/c.txt')
	})
	.then(function(data){
		console.log(data)
		return pReadFile('./data/c.txt')
	})
```


## 代码风格



## 修改完代码自动重启

这里我们可以使用一个第三方命名航工具：`nodemon` 来帮我们解决频繁修改代码重启服务器的问题。

`nodemon`是一个基于 Node.js 开发的一个第三方命令行工具，我们使用的时候需要安装：

```javascript
#在任意目录执行该命令都可以
#也就是说，所有需要 --global 来安装的包都可以在任意目录执行
npm install --global nodemon
```

安装完毕之后，使用：

```javascript
#正常执行
node app.js

# 使用 nodemon 执行
nodemon app.js
```

只要是通过 `nodemon app.js`启动的服务，则会监视你文件的变化，当文件发生变化的时候，自动帮你重启服务器



## 文件操作路径和模块路径

### 文件操作路径

```javascript
//在文件操作的相对路径中
//    ./data/a.txt  相对于当前的目录
//    data/a.txt    相对于当前目录
//    /data/a.txt   绝对路径，当前文件模块所处磁盘根目录
//    c:/xx/xx...   绝对路径
fs.readFile('./data/a.txt',function(err,data){
    if(err){
        console.log(err)
        return console.log('读取失败')
    }
    console.log(data.toString())
})
```

### 文件模块路径

```javascript
//这里如果忽略了 . 则也是磁盘根路径
require('/data/foo.js')

//相对路径
require('./data/foo.js')

//模块加载的路径中的相对路径不能省略  ./
```



