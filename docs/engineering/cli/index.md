# 脚手架工具

> 传统脚手架：vue-cli、create-react-app 等创建出来的都是适用绝大部分项目的基础结构，所以生成的结构往往是极简的

> 1. 只针对特定框架类型的项目
> 2. 对于实际业务项目开发来说，生成的项目结构过于简单

> 而很多时候我们在同一个公司的不同项目中还有很多基础设施都是相同的，例如： axios 的包装，路由鉴权等，所以也应该放进脚手架模板中

> 这种情况下，很多公司团队会选择开发自己的脚手架，以符合自身需要

## 常用实践
-   基于 Yeoman 写 Generator
    - yeoman 是一个脚手架平台，my-vue-generator
-   自己造轮子
    - metalsmith

## 脚手架的本质作用
>   创建项目基础结构、提供项目规范和约定

-   相同的文件组织结构
-   相同的开发规范
-   相同的模块依赖
-   相同的工具配置
-   相同的基础代码

## 具有代表性的脚手架工具

### Yeoman
>   老牌通用型脚手架，可用于定制自己的脚手架

```cmd
# 安装
yarn add yo -g

# 搭配特定的 generator生成器 才能使用
# 以 node modules 为例：
yarn add generator-node -g

# 创建 node 模块
mkdir my-module
cd my-module
yo node

# 在已有项目的基础之上，添加特定文件 sub generator
yo node:cli


# 总结
1. 明确你的需求；
2. 找到合适的 Generator；（[官网](http://yeoman.io/generators)）
3. 全局范围安装找到的 Generator；
4. 通过 Yo 运行对应的 GENerator；
5. 通过命令行交互填写选项；
6. 生成你所需要的项目结构；
```

**自定义 Generator**
> 不同的 Generator 可以用来生成不同的项目，也就是说，我们可以通过创造自己的 Generator 帮我们生成我们自定义的项目结构，即便市面上已经有了很多的 Generator  ，我们还是有创造我们自己 Generator 的必要，因为市面上的 Generator  都是通用的，而我们在实际开发过程中会出现一部分基础代码甚至业务代码，在相同类型项目时，还是会重复的，那这时候我们就可以把公共的部分都放到脚手架当中去生成，让脚手架工具去发挥更大的价值。例如 vue-cli 只会创建一个最基础的项目估计，但并不包含我们常用的项目骨架，如 axios、vue-router、vuex等，就需要在创建项目后再去手动引入这些项目模块，试想一下，如果我们把这些也放到脚手架当中，就不存在这些问题了

我们通过自定义一个带有一定基础代码的vuejs项目脚手架来具体介绍

>   创建 Generator 本质上就是创建一个 NPM 模块，但是 Generator 有特定的结构

1. 创建 generator-sample 文件夹作为我们生成器模块的目录
2. 通过 yarn init 初始化 package.json 
3. 安装 yeoman-generator 模块，这个模块提供生成器的基类，这个基类当中提供了一些工具函数，让我们在创建生成器的时候更加便捷
4. 按照项目结构要求去创建一个 generator/app/index.js 文件，这个文件会作为 generator 的核心入口

```js
// 此文件作为 Generator 的核心入口
// 需要导出一个继承自 Yeoman Generator 的类型
// Yeoman Generator 在工作时会自动调用我们在此类型种定义的一些生命周期方法
// 我们在这些方法中可以通过调用父类提供的一些工具方法实现一些功能，例如文件写入

const Generator = require('yeoman-generator')

module.exports = class extends Generator{
  writing () {
    // Yeoman 自动在生成文件阶段调用此方法
    // 我们这里尝试往项目目录中写入文件
    this.fs.write(
      this.destinationPath('temp.txt'),
      Math.random().toString()
    )
  }
}
```

5. 通过 npm link 的方式把这个模块链接到全局范围，使之成为一个全局模块包，这样 yeoman 在工作的时候就可以找到我们自己写的 generator-sample
6. 在新建文件夹中 执行命令 yo sample


**根据模板创建文件**

generator/app/template/foo.txt
```js
这是一个模板文件
内部可以使用 EJS 模板标记输出数据
例如：<% title %>

其他的 EJS 语法也支持

<% if (success) { %>
哈哈哈
<% } %>
```

```js

const Generator = require('yeoman-generator')

module.exports = class extends Generator{
  writing () {
    // Yeoman 自动在生成文件阶段调用此方法
    // // 我们这里尝试往项目目录中写入文件
    // this.fs.write(
    //   this.destinationPath('temp.txt'),
    //   Math.random().toString()
    // )

    // 通过模板方式写入文件到目标目录

    // 模板文件路径
    const tmpl = this.templatePath('foo.txt')

    // 输出目标路径
    const output = this.destinationPath('foo.txt')

    // 模板数据上下文
    const context = { title: 'Hello zce~', success: false }

    this.fs.copyTpl(tmpl, output, context)
  }
}
```

**接收用户输入**

```js

const Generator = require('yeoman-generator')

module.exports = class extends Generator{

  prompting () {
    // Yeoman 在询问用户环节会自动调用此方法
    // 在此方法中可以调用父类 prompt() 方法发出对用户的命令行询问
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname // appname 为项目生成目录名称
      }
    ])
      .then(answers => {
        // answers => { name: 'user input value' }
        this.answers = answers
      })
  }
  writing () {
    // Yeoman 自动在生成文件阶段调用此方法
    // // 我们这里尝试往项目目录中写入文件
    // this.fs.write(
    //   this.destinationPath('temp.txt'),
    //   Math.random().toString()
    // )

    // 通过模板方式写入文件到目标目录

    // 模板文件路径
    const tmpl = this.templatePath('foo.txt')

    // 输出目标路径
    const output = this.destinationPath('foo.txt')

    // 模板数据上下文
    const context = { title: 'Hello zce~', success: false }

    this.fs.copyTpl(tmpl, output, context)
  }
}
```

**自定义一个带有一定基础代码的vuejs项目脚手架**
1. 创建 generator-rhs-vue 文件夹作为我们生成器模块的目录
2. 通过 yarn init 初始化 package.json 
3. 安装 yeoman-generator 模块
4. 按照项目结构要求去创建一个 generator/app/index.js 文件，这个文件会作为 generator 的核心入口
5. 将基础代码放进 generator/app/templates 文件夹中
```html

// <%%= BASE_URL %> 在百分号后面添加一个百分号转义输出 EJS代码

<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="<%%= BASE_URL %>favicon.ico">
    <title><%%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <noscript>
      <strong>We're sorry but <%%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>

```

使用接收用户接收的项目名称
```md
# <%= name %>
```

核心入口

```js
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  promption (){
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname
      }
    ])
      .then(answers => {
        this.answers = answers
      })
  }

  writing() {
    // 把每一个文件都通过模板转换到目标路径
    const templates = [
      'public/favicon.ico',
      'public/index.html',
      'src/assets/logo.png',
      'src/components/HelloWorld.vue',
      'src/App.vue',
      'src/main.js',
      '.gitignore',
      'babel.config.js',
      'package-lock.json',
      'package.json',
      'README.md'
    ]

    templates.forEach(item=>{
      // item => 每个文件路径
      this.fs.copyTpl(
        this.templatePath(item),
        this.destinationPath(item),
        this.answers
      )
    })
  }
}


```


```cmd
yarn link 将生成器链接到全局

在新建项目文件目录下执行
yo rhs-vue
```

=============================================================

## 把脚手架映射为命令

### 初始化
```
mkdir test-cli
cd test-cli
npm init -y
```

1. 打开 `npmjs.com` 官网
2. 注册一个 npm 账号
3. 在 npm 检索是否有重名的包
4. 把 `package.json` 中的 `name` 修改为发布到 npm 上的包名（和本地项目名称无关）
5. 打开控制台，执行 `npm login`, 在控制台登录 npm 
6. 在登录成功以后，在项目下执行 `npm publish`
7. 安装成功就可以在本地进行测试了

```javascript

#!/usr/bin/env node


// 1. 获取用户输入命令
// 原生获取命令行输入参数： process.argv 从第三个参数开始，把我们从命令行输入的参数按照空格划分存储到数组当中
// console.log(process.argv)

// 使用 commander 模块处理命令行

const { Command } = require('commander');
const program = new Command();

const download = require('download-git-repo')
const handlebars = require('handlebars')
const fs = require('fs')
const inquirer = require('inquirer')
const ora = require('ora')
const chalk = require('chalk')
const logSymbols = require('log-symbols')


program
  .version('0.1.0')

const templates = {
  'tpl-a': {
    url: 'https://github.com/ruanhuasi/tpl-a',
    downloadUrl: 'https://github.com:ruanhuasi/tpl-a',
    description: 'a模板'
  },
  'tpl-b': {
    url: 'https://github.com/ruanhuasi/tpl-b',
    downloadUrl: 'https://github.com:ruanhuasi/tpl-b#master',
    description: 'b模板'
  },
  'tpl-c': {
    url: 'https://github.com/ruanhuasi/tpl-c',
    downloadUrl: 'https://github.com:ruanhuasi/tpl-c#master',
    description: 'c模板'
  },
}

program
  .command('init <template> <project>')
  .description('初始化项目模板')
  .action((templateNmae, projectName) => {

    // 下载之前做 loading 提示
    const spinner = ora('正在下载模板...').start()


    // 根据模板名下载对应的模板到本地并起名为 projectName
    // downloadUrl => https://github.com:仓库拥有者/仓库名称#分支名称（默认master）
    const { downloadUrl } = templates[templateNmae]
    download(downloadUrl, projectName, { clone: true }, err => {
      if(err){
        spinner.fail()
        return console.log(logSymbols.error, chalk.red('初始化模板失败！'))
      }
      spinner.succeed()
      // 把项目下的 package.json 文件读取出来
      // 使用向导的方式采集用户输入的值
      // 使用模板引擎把用户输入的数据解析到 package.json 文件中
      // 解析完毕，把解析之后的结果重新写入 packgage.json 文件中
      inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: '请输入项目名称'
        },
        {
            type: 'input',
            name: 'description',
            message: '请输入项目简介'
        },
        {
            type: 'input',
            name: 'author',
            message: '请输入作者名称'
        },
      ]).then((answers) => {
            const packagePath = `${projectName}/package.json`
            const packageContent = fs.readFileSync(packagePath, 'utf8')
            const packageResult = handlebars.compile(packageContent)(answers)
            fs.writeFileSync(packagePath, packageResult)
            console.log(logSymbols.success, chalk.yellow('初始化模板成功！'));
        })
      })
  })

  program
  .command('list')
  .description('查看所有可用模板')
  .action(() => {
    // 根据模板名下载对应的模板到本地并起名为 projectName
    for (const key in templates) {
      console.log(`${key} ${templates[key].description}`);
    }
  })



program.parse(process.argv);

```