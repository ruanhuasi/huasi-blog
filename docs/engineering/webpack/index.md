# 前端模块打包工具

## 模块化打包的由来
> ES Modules 还存在环境兼容问题

> 通过模块化的方式划分出来的模块化文件会比较多，而我们的前端应用又是运行在浏览器当中的，每一个我们在应用当中所需要的文件都需要从服务器当中请求回来，那这些零散的模块文件就必将会导致浏览器频繁发出请求，从而影响我们应用的工作效率

> 所有的前段资源文件都需要模块化（不仅仅只有 JS 的代码需要模块化），随着我们应用的日益复杂，css、html这些资源文件同样也会面临相同的问题，从宏观角度来看，这些文件也都可以看作为前端应用当中的一个模块，只不过这些模块的种类和用途跟我们的JS是不同的

毋庸置疑，模块化是必要的

> 不过我们需要在原有的基础之上去引入更好的方案或者工具，去解决上面这几个问题或者需求，让我们的开发者在应用的开发阶段可以继续享受模块化所带来的的优势，又不必担心模块化对生产环境所产生的一些影响

我们先对更好的方案或者工具提出一些设想，我们希望它们能够满足我们的这些设想

1. 编译我们的代码
> 将我们开发阶段编写的那些包含新特性的代码，直接转换为能够兼容绝大多数环境的代码，这样一来我们所面临的环境兼容问题也就不存在了

2. 打包我们的代码
> 其次能够将我们这些散落的模块文件再次打包到一起，这就解决了我们浏览器当中，频繁对模块文件发出请求的问题。至于模块化文件划分，那我们只是在开发阶段需要它，因为它能更好的帮我们组织我们的代码，但对于运行环境实际上是没有必要的，所以说，我们可以选择，在开发阶段通过模块化的方式去编写，在生产阶段我们还是把他们打包到同一个文件当中

3.支持不同种类的前端资源类型
> 最后它需要去支持不同种类的前端资源类型，这样的话，我们就可以把前端开发过程当中所涉及到的样式、图片、字体等等所有资源文件都当作模块去使用，对于我们整个前端应用来讲的话就有了一个统一的模块化方案，因为我们之前介绍的那些模块化方案实际上只是针对于 JS 的模块化方案，现在我们是想强调对于整个前端应用来讲，它的一个模块化的方案，那这些资源呢，我们有了这种方案过后就可以通过代码去控制，那就可以与我们的业务代码统一去维护，这样对于整个应用来讲会更加合理一些

对于前面两个需求，我们完全可以借助于前面了解过的一些构建系统去配合一些编译工具就可以实现，但是对于后面一个需求就很难解决了，所以就有了接下来要介绍的前端模块打包工具


## webpack
> 模块打包器(Module bundler)，将零散的模块代码打包到同一个 JS 文件当中，那对于代码中，那些有环境兼容问题的代码，我们就可以在打包的过程当中通过模块加载器(loader)，对其进行编译转换，其次，webpcak 还具备代码拆分(Code splitting) 的能力，它能够将应用当中所有的代码都按照我们的需要去打包，这样一来我们就不需要担心我们把所有的代码全部打包到一起，产生的文件比较大的这样一个问题，我们可以把应用加载过程当中，初次运行的时候所必须的那些模块打包到一起，对于其他的一些模块我们再单独存放，等到应用工作过程当中实际需要到某个模块，我们再异步加载这个模块，从而实现增量加载或者叫渐进式加载，这样我们就不用担心文件太碎或者文件太大的这两个极端的问题

> 打包工具解决的是前端整体的模块化，并不单指 Javascript 模块化

## 快速上手

```

yarn init

yarn add webpack webpack-cli --dev

yarn webpack

```

## webpcak 配置文件

> webpack 4 以后的版本支持零配置的方式直接启动打包

> 约定 src/index.js 打包入口 => dist/main.js

> 很多时候我们需要指定文件夹
```javascript
// webpack.config.js
// 这是一个运行在 node 环境下的文件，需要遵循 CommonJS 规范

const path = require('path')

module.exports = {
  entry: './src/main.js', // 指定打包入口文件
  // 输出文件
  output: {
    filename: 'bundle.js', // 文件名
    path: path.join(__dirname, 'output') // 输出路径必须是一个绝对路径，使用 node 环境的 path获得绝对路径
  }
}


```

## webpcak 工作模式
> webpack 4 新增了工作模式的用法，这种用法大大简化了 webpack 配置的复杂程度，可以理解成针对不同环境的几组预设的配置

[官方文档](https://webpack.js.org/configuration/mode/)

```javascript
// 默认模式
yarn webpack --mode production // 生产模式，自动启动一些优化插件，例如代码压缩，但代码无法阅读

yarn webpack --mode development // 开发模式，优化打包速度，添加一些调试过程当中需要的辅助到我们代码当中

yarn webpack --mode none // 最原始状态的打包，没有任何额外的处理


// webpack.config.js
const path = require('path')

module.exports = {
  mode: 'development', // 打包模式
  entry: './src/main.js', // 指定打包入口文件
  // 输出文件
  output: {
    filename: 'bundle.js', // 文件名
    path: path.join(__dirname, 'output') // 输出路径必须是一个绝对路径，使用 node 环境的 path获得绝对路径
  }
}

```


## webpcak 打包结果运行原理

## webpcak 资源加载模块
> webpack 不仅仅是JS的模块化的打包工具，是前端工程的模块打包工具

> Loader 是 webpack 的核心特性

> 借助于 Loader 就可以加载任何类型的资源

```javascript

// webpack 默认会把所有文件都当作 js 文件来处理，内部 loader 只能处理js文件
// 我们还可以为其他类型的资源文件添加不同的 Loader

yarn add css-loader --dev // css加载器

// 注意：css-loader 作用就是将 css 文件转换成为一个 js 模块，具体的实现就是将 css 的代码 Push 到一个数组当中
// 整个过程没有一个地方用到了这个数组，所以还需要另一个 loader

yarn add style-loader --dev // 把 css-loader 转换过后的结果通过 style 标签的形式追加到页面上


// webpack.config.js

const path = require('path')

module.exports = {
  mode: 'none',
  entry: './src/main.css', // 指定打包入口文件
  // 输出文件
  output: {
    filename: 'bundle.js', // 文件名
    path: path.join(__dirname, 'output') // 输出路径必须是一个绝对路径，使用 node 环境的 path获得绝对路径
  },
  module: {
    // 针对于其他资源模块加载规则的配置，每一个规则对象都需要设置两个属性 test: 正则表达式，用于匹配打包过程当中遇到的文件路径， use：用来指定匹配到的文件需要使用的 loader
    // use 可以是一个数组，并且是从后往前依次执行的
    rules: [
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
}

```

## webpcak 导入资源模块

> 通过以上的探索，我们确实可以把 css 文件作为打包的入口，不过webpack的打包入口一般还是 Javascript

> 因为它的打包入口从某种程度来说，可以算是我们应用的运行入口，就目前而言，前端应用是由 JS 驱动的，所以正确的做法还是把 js 文件作为打包入口，然后在 JS 代码当中通过 import 引入 css 文件

```javascript
// main.js

import createHeading from './heading.js'
import './main.css' // 引入 css

const heading = createHeading()

document.body.append(heading)


//===========================================
// heading.js

import './heading.css' // 引入 css

export default () => {
  const element = document.createElement('h2')

  element.textContent = 'Hello World'
  element.classList.add('heading')
  element.addEventListener('click', () => {
    alert('Hello webpack')
  })

  return element
}

```

> 这里也许会让你产生一些疑惑，传统的做法是将 样式和行为分离开，单独去维护，单独去引入，而 wenbpack 又建议我们要在 js 当中引入 css

> 其实 webpack 不仅仅是建议我们在 js 当中去引入 css ，而是我们在我们编写代码过程中去引入任何你当前这个代码所需要的资源文件

> 这是因为，真正需要这个资源的不是应用，而是你此时正在编写的代码，是你这里的代码想要正常的工作，就必须要去加载对应的资源，这就是 webpack 的哲学

> 建立 JS 和资源文件的依赖关系是有明显优势的

- 逻辑合理，JS 确实需要这些资源文件
- 确保上线资源不缺失，都是必要的

学习一个新事物，不是说学会所有用法，你就能提高，这些东西照着文档，谁都可以，很多时候，这些新事物的思想才是突破点，能够搞明白新事物为什么这么设计，那就算是出道了


> 目前 webpack 社区提供了非常多的加载器，基本上所有合理的需求都会有对应的 loader，下面是具有代表性的 loader

## webpcak 文件资源加载器
> 大多数加载器都类似于 css-loader，都是将资源模块转换为 JS 代码的实现方式去工作，但是还有一些我们经常会用到的资源文件，例如 图片和字体，这些文件是没有办法通过 JS 的方式去表示的

> 对于这类的资源文件，我们需要用到 文件资源加载器-flie-loader

```javascript

-- yarn add file-loader --dev



// webpack.config.js
const path = require('path')

module.exports = {
  mode: 'none',
  entry: './src/main.css', // 指定打包入口文件
  // 输出文件
  output: {
    filename: 'bundle.js', // 文件名
    path: path.join(__dirname, 'dist'), // 输出路径必须是一个绝对路径，使用 node 环境的 path获得绝对路径
    publicPath: 'dist/' // 指定打包过后的文件，最终在网站上的位置
  },
  module: {
    // 针对于其他资源模块加载规则的配置，每一个规则对象都需要设置两个属性 test: 正则表达式，用于匹配打包过程当中遇到的文件路径， use：用来指定匹配到的文件需要使用的 loader
    // use 可以是一个数组，并且是从后往前依次执行的
    rules: [
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /.png$/,
        use: 'file-loader'
      }
    ]
  }
}

```

## webpack URL 加载器
> 除了 file-loader 这种通过拷贝物理文件的形式去处理文件资源以外，还有一种通过 data URL去表示文件，这种方式也非常常见

> data URL 是一种特殊的 URL 协议，它可以用来直接表示一个文件，data URL当中的文本已经包含了文件的内容，去使用的时候就不会去发送任何 http 请求，

> `data:[mediatype][;base64],<data>`

`data`：协议

`[mediatype][;base64]`：媒体类型和编码

`<data>`：文件内容

```bash
'data:text/html;charset=UTF-8,<h1>html content</h1>'

浏览器会根据上面的 data URL 解析出来这是一个 html 类型的文件内容，
编码是 Utf-8，
'内容是 <h1>html content</h1>'
```

如果是图片或者字体这一类无法直接通过文本去表示的二进制类型的文件，就可以通过将文件的内容 Base64编码，以编码过后的结果去表示这个文件的内容

```bash
data:image/png;base64,iVBORw0KGgoAAAAANSUhE...

浏览器会根据上面的 data URL 解析出来这是一个 image/png 类型的文件内容，
编码是 base64,
内容是 iVBORw0KGgoAAAAANSUhE...
```

webpack 打包静态资源模块时，同样也可以使用这种方式去实现

通过 data URL我们就可以以代码的形式去表示任何类型的文件了

```javascript
-- yarn add url-loader --dev

const path = require('path')

module.exports = {
  mode: 'none',
  entry: './src/main.css', // 指定打包入口文件
  // 输出文件
  output: {
    filename: 'bundle.js', // 文件名
    path: path.join(__dirname, 'dist'), // 输出路径必须是一个绝对路径，使用 node 环境的 path获得绝对路径
    publicPath: 'dist/' // 指定打包过后的文件，最终在网站上的位置
  },
  module: {
    // 针对于其他资源模块加载规则的配置，每一个规则对象都需要设置两个属性 test: 正则表达式，用于匹配打包过程当中遇到的文件路径， use：用来指定匹配到的文件需要使用的 loader
    // use 可以是一个数组，并且是从后往前依次执行的
    rules: [
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /.png$/,
        use: 'url-loader'
      }
    ]
  }
}
```

**最佳实践**

- 小文件使用 Data URLs，减少请求次数 url-loader
- 大文件单独提取存放，提高加载速度 file-loader

```
- 超出 10KB 文件单独提取存放
- 小于 10KB 文件转换为 Data URLs 嵌入代码中

    {
        test: /.png$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10 * 1024 // 10KB
          }
        }
      }
```

> 如果按照这种方式去使用 url-loader 就必须同时安装 file-loader

## webpack 常用加载器分类

-   **编译转换类**
> 把加载到的资源模块，转化为 Javascript 代码

foo.css => css-loader => bundle.js 以 JS 形式工作的 CSS 模块

-   **文件操作类**
> 把我们加载到的资源模块，拷贝到输出目录，同时将文件的访问路径向外导出

bar.png => flie-loader => 导出文件访问路径到 bundle.js

-   **代码检查类**
> 把加载到的资源文件（一般是代码），去进行校验的加载器，这种加载器的目的是为了统一我们代码的风格，从而去提高代码质量，这种类型加载器一般不会去修改生产环境的代码


## webpack 处理ES2015
> 因为模块打包需要，所以处理了 import 和 export ，但并不是能够转换 ES 特性

> webpack 只是一个打包工具，它并不能去转换我们代码当中其他的 ES6 特性

如果需要 webpack 打包过程中同时处理其他 ES6 特性的转换，那我们需要为 JS 文件配置一个额外的编译性 Loader，比如最常见的 `babel-loader`

```
// 安装bable-loader的同时也需要去安装 它依赖的 babel 核心模块 @babel/code
// 以及用于完成具体特性转换插件的集合 @babel/preset-env
yarn add babel-loader @babel/core @babel/preset-env --dev

```

## webpack 加载方式

> 除了 import 能够触发模块的加载，webpack 中还提供了其他方式

- ES Module
- CommonJS的require 函数
```javascript
const createHeading = require('./headeing.js').default
```
- 遵循 AMD 标准的 define 函数和 require 函数

一般不建议混用加载方式，不利于维护，只需要统一使用一种就好了

> loader 加载的非 JS 也会触发资源加载

- 样式代码中的 @import 指令和 url 函数

- HTML 代码中图片标签的 src 属性

```css
@import url(reset.css); // import 指令触发了资源加载

body {
    min-height: 100vh;
    background: #f4f8fb;
    background-image: url(background.png);// url 函数触发了 url-loader
    background-size: cover;
}

```

```html
// footer.html
<footer>
    <img src="better.png" alt="better" width="256">
</footer>


```

```javascript
// main.js

// yarn add html-loader --dev

// html 文件默认会将 html 代码作为字符串导出，所以需要接收一下
import footerHtml from './footer.html'

document.write(footerHtml)
```
html 中除了 img 的 src 能触发资源加载以外，a 标签的 href 也可以，不过需要外的配置

```
    {
        test: /.html$/,
        use: {
          loader: 'html-loader',
          // html 加载的时候对 html 页面上的属性作一些额外的处理
          options: {
            attrs: ['img:src', 'a:href'], // 默认是 'img:src'
          }
        }
      }
```

## webpack 核心工作原理

1. webpack 根据配置，从项目的散落代码及资源文件中，找到文件作为打包的入口，通常是一个js文件

2. 根据入口文件中 import、require 一类的语句，解析推断出来这个文件所依赖的资源模块，分别解析每一个资源模块对应的依赖，最终形成依赖关系树

3. 递归依赖树，找到每一个节点所对应的资源文件

4. 根据配置文件中的 rules 属性，去找到这个模块对应的加载器，交给它去加载这个模块

5. 将加载到的结果放入到 bundle.js（打包结果），从而实现整个项目的打包

> 整个过程中，loader 机制是 webpack 的核心，它起了很重要的作用，如果没有它就没有办法实现各种资源文件的加载，

## webpack 插件机制

>   插件机制是 webpack 的另一个核心特性，目的是增强自动化的能力

> Loader 专注实现资源模块加载，从而实现整体项目的打包

>　Plugin 解决除了项目中除了资源加载以为，其他的自动化工作，例如：清除 dist 目录上一次打包的结果、拷贝那些不需要参与打包的静态资源文件到输出目录、压缩打包结果输出代码

> webpack + plugin 可以实现大多数前端工程化工作


## webpack 常用插件

**自动清除输出目录插件 - clean-webpack-plugin**

```javascript
-- yarn add clean-webpack-plugin

const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'none',
  entry: './src/main.js', // 指定打包入口文件
  // 输出文件
  output: {
    filename: 'bundle.js', // 文件名
    path: path.join(__dirname, 'dist'), // 输出路径必须是一个绝对路径，使用 node 环境的 path获得绝对路径
    publicPath: 'dist/' // 指定打包过后的文件，最终在网站上的位置
  },
  module: {
    // 针对于其他资源模块加载规则的配置，每一个规则对象都需要设置两个属性 test: 正则表达式，用于匹配打包过程当中遇到的文件路径， use：用来指定匹配到的文件需要使用的 loader
    // use 可以是一个数组，并且是从后往前依次执行的
    rules: [
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /.png$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10 * 1024 // 10KB
          }
        }
      }
    ]
  },
  // 使用插件，需要为配置对象添加一个 plugin 属性，这个属性专门用来配置的地方，它是一个数组
  plugins: [
     // 绝大多数的插件导出的都是一个类型，所以一般在使用的时候通过这个类型去创建一个实例
    new CleanWebpackPlugin(),
  ]
}


```


**自动生成使用打包结果 bundle.js 的 html  - html-webpack-plugin**
> 避免硬编码所带来的路劲引用问题，让 html 也参与到 webpack的构建当中，自动注入 bundle.js 的引用

```javascript
-- yarn add html-webpack-plugin

const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin  = require('html-webpack-plugin') // 默认导出的就是一个插件的类型,不需要解构它内部成员

module.exports = {
  mode: 'none',
  entry: './src/main.js', // 指定打包入口文件
  // 输出文件
  output: {
    filename: 'bundle.js', // 文件名
    path: path.join(__dirname, 'dist'), // 输出路径必须是一个绝对路径，使用 node 环境的 path获得绝对路径
    // 使用 html-webpack-plugin，不需要指定 dist 目录
    // publicPath: 'dist/' // 指定打包过后的文件，最终在网站上的位置
  },
  module: {
    // 针对于其他资源模块加载规则的配置，每一个规则对象都需要设置两个属性 test: 正则表达式，用于匹配打包过程当中遇到的文件路径， use：用来指定匹配到的文件需要使用的 loader
    // use 可以是一个数组，并且是从后往前依次执行的
    rules: [
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /.png$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10 * 1024 // 10KB
          }
        }
      }
    ]
  },
  // 使用插件，需要为配置对象添加一个 plugin 属性，这个属性专门用来配置的地方，它是一个数组
  plugins: [
     // 绝大多数的插件导出的都是一个类型，所以一般在使用的时候通过这个类型去创建一个实例
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin()
  ]
}
```

> 改进 html 的生成结果：
> 例如：title、meta 等

```javascript
plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack Plugin Sample',
      meta: {
        viewport: 'width=device-width',
      }
    })
  ]
```

> 如果需要对 html 进行大量的自定义，更好的做好是在源代码中添加一个用于生成 html 的模板

模板文件：
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>webpack</title>
<meta name="viewport" content="width=device-width"><script defer src="bundle.js"></script></head>
<body>
  <div class="container">
    <h1>Webpack Plugin Sample</h1>
  </div>
</body>
</html>
```

通过 template 属性指定模板文件
```javascript
 plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack Plugin Sample',
      meta: {
        viewport: 'width=device-width',
      },
      template: './src/index.html'
    })
  ]
```

> 多页面应用场景下，同时输出多个页面文件

> 一个 HtmlWebpackPlugin 实例用于生成一个 html，默认生成 index.html
```javascript
 plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack Plugin Sample',
      meta: {
        viewport: 'width=device-width',
      },
      template: './src/index.html'
    }),
    // 用于生成其他 html
    new HtmlWebpackPlugin({
      filename: 'about.html'
    })
  ]

```

**将不参与构建的静态文件复制到输出目录 - copy-webpack-plugin**

```javascript
-- yarn add copy-webpack-plugin

const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 默认导出的就是一个插件的类型,不需要解构它内部成员
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'none',
  entry: './src/main.js', // 指定打包入口文件
  // 输出文件
  output: {
    filename: 'bundle.js', // 文件名
    path: path.join(__dirname, 'dist'), // 输出路径必须是一个绝对路径，使用 node 环境的 path获得绝对路径
    // 使用 html-webpack-plugin，不需要指定 dist 目录
    // publicPath: 'dist/' // 指定打包过后的文件，最终在网站上的位置
  },
  module: {
    // 针对于其他资源模块加载规则的配置，每一个规则对象都需要设置两个属性 test: 正则表达式，用于匹配打包过程当中遇到的文件路径， use：用来指定匹配到的文件需要使用的 loader
    // use 可以是一个数组，并且是从后往前依次执行的
    rules: [
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /.png$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10 * 1024 // 10KB
          }
        }
      }
    ]
  },
  // 使用插件，需要为配置对象添加一个 plugin 属性，这个属性专门用来配置的地方，它是一个数组
  plugins: [
     // 绝大多数的插件导出的都是一个类型，所以一般在使用的时候通过这个类型去创建一个实例
    new CleanWebpackPlugin(),
    // 用于生成 index.html
    new HtmlWebpackPlugin({
      title: 'Webpack Plugin Sample',
      meta: {
        viewport: 'width=device-width',
      },
      template: './src/index.html'
    }),
    // 用于生成其他 html
    new HtmlWebpackPlugin({
      filename: 'about.html'
    }),
    // 需要传入一个数组，用于指定我们需要去拷贝的文件路径，它可以是通配符、目录、文件的相对路径
    new CopyWebpackPlugin([
      // 'public/**',
      'public'
    ])
  ]
}
```

> 社区有很多各种各样的 webpack 插件，我们不需要一一了解他们，需要用到的时候我们可以根据关键字在 github 搜索，例如图片压缩插件：imagemin webpack-plugin

## webpack 实现自动编译
> webpack 提供了 watch 工作模式

> yarn webpack --watch，监视模式运行，cli启动后不会立即推出，等待文件的变化，然后再次工作，直到手动结束这个 cli

## webpack 实现自动刷新浏览器

> 借助 Bowser-sync 监听 dist 文件目录的变化

```
browser-sync dist --files '**/*'
```

> 但是这种方式效率相对低

> 所以我们还需要进一步优化


## webpack dev server
> webpack 官方推出的开发工具

> 提供用于开发的 HTTP Server，集成 自动编译 和 自动刷新浏览器 等功能

```
--yarn add webpack-dev-server

// 执行 webpack-dev-server cli，--open可以自动唤起浏览器
yarn webpack-dev-server --open

```

为了提高构建效率，webpack-dev-server 并不会在文件修改后进行打包结果写入到磁盘当中，而是暂时存放在内存当中，内部的 http-server 把打包文件从内存中读取出来，减少了磁盘读写


**静态资源的访问**
> webpack-dev-server 默认会将构建结果输出的文件，全部作为开发服务器的资源文件，即 只要是通过 webpack 打包输出的文件，都可以正常被访问到

> 但是如果还有一些静态资源也需要作为开发服务器资源被访问的话，就需要额外的配置

```javascript
devServer: {
    // 指定额外的静态资源路径，可以是一个或者多个路径
    static: {
      directory: path.join(__dirname, 'public'), // public 路径默认可被访问，不需要配置
    },
  },

```

> 需要注意的是，copy-Webpack-plugin 插件是不建议在开发阶段使用的

**代理 API 服务**

> 开发环境访问 API 一般是跨域的，就会产生跨域请求问题

> 跨域资源共享（CORS）的解决方式需要 API 服务必须支持

> 解决这个问题的最好办法是把接口的服务代理到本地开发服务器

> webpack-dev-server 支持配置代理服务

```javascript

const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 默认导出的就是一个插件的类型,不需要解构它内部成员
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'none',
  entry: './src/main.js', // 指定打包入口文件
  // 输出文件
  output: {
    filename: 'bundle.js', // 文件名
    path: path.join(__dirname, 'dist'), // 输出路径必须是一个绝对路径，使用 node 环境的 path获得绝对路径
    // 使用 html-webpack-plugin，不需要指定 dist 目录
    // publicPath: 'dist/' // 指定打包过后的文件，最终在网站上的位置
  },
  devServer: {
    // 指定额外的静态资源路径，可以是一个或者多个路径
    static: {
      directory: path.join(__dirname, 'public'), // public 路径默认可被访问
    },
    // 添加代理服务配置，每一个属性就是一个代理规则的配置，属性名称就是需要被代理的请求路径前缀
    proxy: {
      // 将 以/api 开头的地址代理到接口当中
      '/api': {
        // http://localhost:8080/api/users => https://api.github.com/api/users
        target: 'https://api.github.com', // 代理目标
        // 以正则的匹配方式，将代理路径的重写 http://localhost:8080/api/users => https://api.github.com/users
        pathRewrite: {
          '^/api': ''
        },
        changeOrigin: true // 不能使用 localhost:8080 作为请求 接口 的主机名
      }
    },
  },
  module: {
    // 针对于其他资源模块加载规则的配置，每一个规则对象都需要设置两个属性 test: 正则表达式，用于匹配打包过程当中遇到的文件路径， use：用来指定匹配到的文件需要使用的 loader
    // use 可以是一个数组，并且是从后往前依次执行的
    rules: [
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /.png$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10 * 1024 // 10KB
          }
        }
      }
    ]
  },
  // 使用插件，需要为配置对象添加一个 plugin 属性，这个属性专门用来配置的地方，它是一个数组
  plugins: [
     // 绝大多数的插件导出的都是一个类型，所以一般在使用的时候通过这个类型去创建一个实例
    new CleanWebpackPlugin(),
    // 用于生成 index.html
    new HtmlWebpackPlugin({
      title: 'Webpack Plugin Sample',
      meta: {
        viewport: 'width=device-width',
      },
      template: './src/index.html'
    }),
    // 用于生成其他 html
    new HtmlWebpackPlugin({
      filename: 'about.html'
    }),
    // 需要传入一个数组，用于指定我们需要去拷贝的文件路径，它可以是通配符、目录、文件的相对路径
    // 开发阶段最好不要使用这个插件，因为开发阶段会频繁打包，会降低效率
    // new CopyWebpackPlugin([
    //   // 'public/**',
    //   'public'
    // ])
  ]
}

```

## Source Map
> 通过构建编译之类的操作可以将开发阶段的源代码转换为能够在生产环境当中运行的代码，生产环境运行的代码和源代码之间有很大的差异

> 这种情况下，错误信息无法定位

> Source Map（源代码地图）就是用来映射转换过后的代码与源代码之间的关系

**配置 Source Map**
```
devtool: 'source-map', // 配置开发过程中的辅助工具（与source map相关的功能配置）
```

> 截至到目前，webpack 支持12种不同的方式，每种方式生成source-map的效果和速度是不一样的，效果最好的往往生成速度最慢


**对比不同模式之间的差异**

```javascript
// webpack.config.js

const HtmlWebpackPlugin = require('html-webpack-plugin') 
const allModes = [
    'eval',
    'cheap-eval-source-map',
    'cheap-module-eval-source-map',
    'eval-source-map',
    'cheap-source-map',
    'cheap-module-source-map',
    'inline-cheap-source-map',
    'inline-cheap-module-source-map',
    'source-map',
    'inline-source-map',
    'hidden-source-map',
    'nosource-source-map'
]

// webpack 的配置对象可以是一个数组，数组中的每一个元素都是一个单独的打包配置，这样一来，我们就可以在一次打包过程中同时执行多个打包任务

module.export = allModes.map(item => {
    return {
        devtool: item,
        mode: 'none',
        entry: './src/main.js',
        output: {
            filename: `js/${item}.js`,
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            preset: ['@babel/preset-env']
                        }
                    }
                }
            ]
        },
        plugins: [
            // 用于生成 可以使用打包结果的Html
            new HtmlWebpackPlugin({
              filename: `${item}.html`
            }),
        ]
    }
})
```

- eval 模式
```
devtool: 'eval'

// 使用 eval 函数去执行模块代码
// 生成速度最快，效果最简单，只能定位源代码的名称，而不知道具体的行列信息
// 看到的都是打包过后的模块代码
```

- eval-source-map 模式
```
devtool: 'eval-source-map'

// 同样使用 eval 函数去执行模块代码
// 能看到行和列
// 对比 eval ，它生成了 source-map
```

- cheap-eval-source-map 模式
```
devtool: 'cheap-eval-source-map'

// 阉割版的 eval-source-map ,只能看到行，但加快了生成速度
```

- cheap-module-eval-source-map 模式
> 带有 module ，都是没有经过 loader 加工的源代码
```
devtool: 'cheap-module-eval-source-map'

// 对比 cheap-eval-source-map（需要单独给js文件配置Loader） ,看到的是ES6转换前的行，也就是没有经过 loader 加工的源代码
```

- inline-source-map
> source-map 模式是以物理文件的形式存在

> inline 系列的模式，是以 data-url 的方式嵌入到代码当中，eval 也是以这种方式嵌入，这种方式会导致源代码体积大很多

- hidden-source-map
> 这种模式在开发工具中是看不到效果的，但有确实生成了source-map 文件，这和 jquery 一样，没有在代码中以注释的方式引入这个文件，所以看不到效果，这种模式用来开发第三方包的时候适用这种方式

- nosource-source-map
> 能定位行列信息，但看不到源代码，用于生产环境保护源代码不泄露

**Webpack 选择 Source Map 模式**
> 没有绝对的选择，理解不同模式的差异，适配不同环境

开发模式
- cheap-module-eval-source-map
    - 我的代码每行不会超过 80 个字符
    - 我的代码经过Loader转换过后的差异较大
    - 首次打包速度慢无所谓，重写打包相对较快

生产环境
- none（不生成sourceMap）
    - Source Map 会暴漏源代码
    - 调试是开发阶段的事情

如果实在对代码没信心，那就使用 nosource-source-map
    

## Webpack HMR
> 模块热替换 Hot Module Replacement

> HMR 是 Webpack 中最强大的特性之一，极大程度的提高了开发者的效率


**Webpack 自动刷新问题**
问题核心：自动刷新导致的页面状态丢失

热拔插的概念：在一个正在运行的机器上随时插拔设备，模块热替换也是这个道理，指的就是应用运行程序过程中实时替换某个模块


**开启HMR**
> 页面不刷新，模块也可以及时更新

> HMR 集成在 webpack-dev-serve 中

```
// 执行命令开启
webpack-dev-server --hot
```

```javascript
// 配置文件开启
// webpack.config.js

const webpack = require('webpack')
devServer: {
    hot: true, // 启动热替换
}
module.exports = {
    // 使用内置 热模块替换 插件
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}
```
通过以上的配置文件可以开启HMR，但是效果并不好，那是因为 Webpack 中的 HMR 并不可以开箱即用，需要手动处理模块热替换逻辑

1.为什么样式文件的热更新开箱即用？

```
因为样式文件是经过 Loader 处理的
```

2.凭什么样式文件可以自动处理

```
css代码更改后可以直接替换，
js 脚本代码没有任何规律，没有办法帮你实现一个通用的所有情况的模块替换方案
```

3.我的项目没有手动处理，JS照样可以热替换

```
vue-cli等脚手架集成了通用的HMR方案，这些使用了框架开发的，自然就有了规律，就可能会有通用的替换办法
```

总结：我们需要手动处理 JS 模块更新后的热替换

**HMR APIs**
> HotModuleReplacementPlugin 为我们JS提供了一套用以处理HMR的API，我们需要在自己的代码当中去使用这套 API，来处理当某一个模块更新过后，应该如何替换到当前正在运行的页面当中

```
// main.js 打包入口文件

// hot属性也是一个对象，也是 HMR API 的核心对象，提供了一个 accept 方法，这个方法用于注册当某一个模块更新过后的处理函数，参数1：依赖模块的更新路径，参数2：处理函数
module.hot.accept('./editer', ()=>{
    console.log('editer 模块更新了')
    
    // 不同的模块要根据不同的业务场景来处理
    // 例如：一个文本编辑模块，我们需要在更新时，移除旧的、创建新的元素，但需要把旧的文本框内容状态先保存下来，在创建新的同时还原
})

```

**处理图片模块热替换**

```javascript
// main.js 打包入口文件

module.hot.accept('./editer', ()=>{
    // 直接替换文件路径即可
    img.src = background
    console.log(background)
})

```

以上原生webpack操作模块热替换的方式，看似相对繁琐，实际有利有弊，不过现在很多框架都集成了自己的方案

**Webpack HMR 注意事项**

1. hot: true 这种方式开启热更新时，在 HMR API 执行过程中，如果出现了运行报错的情况，会自  动使用自动刷新的功能，而刷新后，又看不到报错信息

解决方案：hotonly: true


2. 没启用 HMR 的情况下，HMR API 报错

解决方案：
```javascript
// main.js 打包入口

// 先判断是否存在hot对象
if(module.hot){
    ...
}
```

3. 会影响业务代码吗

不会，因为在webpack打包、压缩代码过后，这些代码会被去除


## 生产环境优化

> 为不同的工作环境创建不同的配置

**1. 配置文件根据环境不同导出不同配置**

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 默认导出的就是一个插件的类型,不需要解构它内部成员
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

// webpack 的配置文件还支持导出一个函数，在这个函数中返回配置对象
// env:环境参数，argv:运行cli过程中所传递的所有参数
module.exports = (env, argv) => {
  const config = {
    // ...
  }

  if(env === 'production') {
    config.mode = 'production'
    config.devtool = false
    config.plugins = [
      ...config,
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin(['plubic'])
    ]
  }
}
```

**2. 一个环境对应一个配置文件**

> 对于大型项目，还是建议根据不同环境对应不同的配置文件的方式

```javascript

// 我们一般需要三个webpack配置文件
// 1. webpack.common.js
// 2. webpack.dev.js
// 3. webpack.prod.js

// webpack.prod.js
// Object.assign() 函数的特性会导致一些属性被覆盖，所有我们使用社区提供的专业模块
// npm i webpack-merge -D

const = require('./webpack.common')
const merge = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

moudle.export = merge({}, common, {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin(['plubic'])
    ]
})


npm run webpack --config webpack.prod.js
```

**webpack 4 新增了 production 模式下开箱即用的优化**

这里介绍几个：

- **DefinePlugin**
> 用来为我们的代码注入全局成员的

```javascript
const webpack = require('webpack')

module.exports = {
  plugins: [
    // 注入全局成员
    // 注意这里需要注入的是一个可以执行的代码片段
    new webpack.DefinePlugin({
      API_BASE_URL: JSON.stringify('https://api.example.com')
    })
  ]
}

```

- **Tree Shaking**
> “摇树”，字面意思就是将树上的叶子摇落，而我们这里摇落的是代码中未引用的部分（dead-code）

需要注意的是，Tree Shaking 不是某一个配置选项，而是一组功能搭配使用后的优化效果，这个功能会在生产模式下自动使用

```javascript
// 手动配置开启 Tree Shaking（内部实现）

module.exports = {
    mode: 'none',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js'
    },
    // 集中配置 webpack 内部的优化功能
    optimization: {
        useExport: true, // 只导出那些外部使用了的成员（标记枯树叶）
        minimize: true, // 启用代码压缩功能，去掉没有用到的代码（摇落枯叶）
    }
}
```

- Scope Hoisting（合并模块）
> 一般情况下，webpack 打包文件是一个模块对应一个函数，这个配置的作用就是尽可能的将所有的模块合并输出到一个函数中，如此一来，既提升了运行效率，又减少了代码的体积

```javascript
// 手动配置开启 Tree Shaking（内部实现）

module.exports = {
    mode: 'none',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js'
    },
    // 集中配置 webpack 内部的优化功能
    optimization: {
        useExport: true,
        concatenateModules: true, // 开启合并模块
        minimize: true, 
    }
}
```

**Tree Shaking 与 Babel**

注意：Tree Shaking 当前版本只能对 ESModule 规范的代码生效，在旧版本的 Babel 中有对 ESModule转换成 CommonJS，所以会使 Tree Shaking 失效，不过新版本的 Bable 自动关闭了这个转换

```javascript

// 如果不确定版本，也可以强制关闭 module 转换
module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@bable/preset-env', { modules: false }]
            ]
          }
        }
      }
      ]
}
```

## sideEffects
- webpack 4 中新增了 sideEffects 的新特性，允许我们通过配置的方式去表示我们的代码是否有副作用，从而为 Tree Shaking 提供更大的压缩空间

- 副作用是指：模块执行的时候除了导出成员之外所作的事情

- sideEffects 一般用于开发一个 npm 模块时才会用到   

```javascript
// webpack.config.js

// 开启 sideEffects 过后，就会先检查当前代码所属的这个 package.json 当中，有没有 sideEffects 的标识，以此来判断是否有副作用
// 如果这个模块没有副作用，那这些没有用到的模块不会再被打包
module.exports = {
    mode: 'none',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js'
    },
    // 集中配置 webpack 内部的优化功能
    optimization: {
        sideEffects: true,
    }
}

// package.json
"sideEffects": false
```

注意：要确保你的代码确实没有副作用，否则会被 webpack 移除

```
// package.json

// 指定有副作用的文件
"sideEffects": [
    './src/extend.js',
    '*.css'
]

```

## Code splitting
- 代码分包/代码分割

- 通过webpack 实现前端项目整体模块化的优势固然很明显，但同样存在一些弊端： 所有代码最终都被打包到一起，bundle 体积过大

- 并不是每个模块在启动时都是必要的

- 分包，按需加载

目前 wenbapck 实现分包支持两种方式
- **多入口打包**

一般适用于传统的多页面应用，一个页面对应一个打包入口公共部分单独提取
```javascript
// webpack.config.js

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'none',
  // 指定多个打包入口文件
  entry: {
      index: './src/index.js',
      album: './src/album.js'
  }, 
  // 生成动态文件名
  output: {
    filename: '[name].bundle.js',
  },
  optimization: {
    // 把所有的公共模块都提取到单独的 Bundle 当中
    splitChunks: {
        chunks: 'all'
    },
  },
  module: {
    rules: [
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Multi Entry',
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['index'], // 每一个打包入口都会形成一个独立的 chunks ，不会重复引入其他模块
    }),
    new HtmlWebpackPlugin({
      title: 'Multi Entry',
      template: './src/album.html',
      filename: 'album.html',
      chunks: ['album'],
    }),
  ]
```


**动态导入**
- 需要用到某个模块时，再加载这个模块，这种方式可以极大的节省带宽和流量

- 动态导入的模块会被自动提取到单独的 bundle 当中 ，从而实现分包

- 相比于多入口的方式，动态导入的方式更加灵活，因为我们可以通过代码的逻辑去控制我们需不需要加载某个模块

- 分包的目的，很重要的一点就是要让模块实现按需加载，从而提高应用的响应速度

只需要按照 ESModule 动态导入成员的方式，webpack 就会自动实现分包

**魔法注释**

默认通过动态导入产生的 bundle 文件，它的名称就只是一个序号，如果想要给这些 bundle 命名，可以使用 webpack 的魔法注释来实现

```
// 加上特定格式的行内注释
import(/* webpackChunkName: 'posts' */'./posts/posts').then(({defalult: poss}) =>{

    ...
})

// 这样我们就可以给分包产生的 Bundle 加上名字了
```

> 相同的 ChunkNmae，最终会被打包到一起

## MiniCssExtractPlugin
> 它是一个可以将 CSS 代码从打包结果当中提取出来的插件，通过这个插件可以实现 CSS 的按需加载

```javascript
npm i mini-css-extract-plugin -D

// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    module: {
        rules: [
            test: /\.css$/,
            use: [
                // 'style-loader', // 将样式通过 style 标签注入
                // 使用 MiniCssExtractPlugin 插件的loader取代 style-loader
                MiniCssExtractPlugin.loader, // 插件将css文件单独打包到一个文件，通过 link 标签的方式注入
                'css-loader'
            ]
        ]
    },
    plugins: [
        new MiniCssExtractPlugin()
    ]
}
```

注意：如果 css 文件比较小，那么使用这种方式可能适得其反，推荐超过 150KB 的 css 才单独提取，否则，减少一次Link请求可能效果会更好

## OptimizeCssAssetsWebpackPlugin
> css 文件压缩

> webpack 生产模式打包的默认压缩机制只针对 js 文件，其他资源文件的压缩都需要额外的插件支持

```javascript
npm i optimize-css-assets-webpack-plugin -D

// webpack.config.js
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
    module: {
        rules: [
            test: /\.css$/,
            use: [
                // 'style-loader', // 将样式通过 style 标签注入
                MiniCssExtractPlugin.loader, // 插件将css文件单独打包到一个文件，通过 link 标签的方式注入
                'css-loader'
            ]
        ]
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new OptimizeCssAssetsWebpackPlugin()
    ]
}
```


> 注意1：如果我们在 Plugins 中使用 OptimizeCssAssetsWebpackPlugin 插件，那么它在任何时候都是被执行，所以，一般都会在 minimizer 属性下使用，这样一来，就只会在开启压缩的时候使用这个插件

> 注意2：当我们在 minimizer 中指定了内容，webpack在生产模式下自动执行的 JS代码压缩就会被覆盖，此时我们需要手动添加 TerserWebpackPlugin 插件来执行 JS 文件的压缩

```javascript
npm i terser-webpack-plugin -D

// webpack.config.js
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = {
    optimization: {
        minimizer: [
            new TerserWebpackPlugin()
            new OptimizeCssAssetsWebpackPlugin()
        ]
    },
    module: {
        rules: [
            test: /\.css$/,
            use: [
                // 'style-loader', // 将样式通过 style 标签注入
                MiniCssExtractPlugin.loader, // 插件将css文件单独打包到一个文件，通过 link 标签的方式注入
                'css-loader'
            ]
        ]
    },
    plugins: [
        new MiniCssExtractPlugin(),
        // new OptimizeCssAssetsWebpackPlugin()
    ]
}
```

## 输出文件名 Hash

一般部署前端的资源文件时，都会启用服务器的静态资源缓存，这样对用户的浏览器而言，就可以缓存住我们应用当中的静态资源，后续就不再需要请求服务器得到这些静态资源文件了，如此我们应用的响应速度得到大幅提升。

不过，开启静态资源的客户端缓存，也有一些问题，失效时间设置过短，效果不明显，设置过长，一旦发生了更新，重新部署过后又没有办法及时更新到客户端

为了解决这个问题，建议在生产模式下，需要给输出的文件名当中添加 Hash 值，这样一来，一旦我们资源文件发生改变，我们的文件名称也可以跟着变化，对于客户端而言，全新的文件名就是全新的请求，就没有缓存的问题，这样我们就可以把服务端的缓存策略时间设置得非常长，也就不用担心文件更新过后的问题

> webpack 中 filename 属性和绝大多数插件的 filename 属性都支持通过占位符的方式来去为文件名设置 Hash

> webpack 支持三种 Hash

- 最普通的 Hash，是整个项目级别的，项目当中任何一个地方发生改动，这一次打包过程中的 Hash 值都会发生变化

```javascript

module.exports = {
    mode: 'none',
    entry: {
        main: './src/index.js',
    },
    output: {
        filename: '[name]-[hash].bundle.js'
    },
    optimization: {
        minimizer: [
            new TerserWebpackPlugin()
            new OptimizeCssAssetsWebpackPlugin()
        ]
    },
    module: {
        rules: [
            test: /\.css$/,
            use: [
                // 'style-loader', // 将样式通过 style 标签注入
                MiniCssExtractPlugin.loader, // 插件将css文件单独打包到一个文件，通过 link 标签的方式注入
                'css-loader'
            ]
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]-[hash].bundle.css'
        }),
    ]
}
```

- chunkhash，是 chunk 级别的哈希，只要是打包过程中，只要是同一路的打包，chunkHash 都是相同的。相比于普通的hash，chunkhash 要更精确一些

```javascript

module.exports = {
    mode: 'none',
    entry: {
        main: './src/index.js',
    },
    output: {
        filename: '[name]-[chunkhash].bundle.js'
    },
    optimization: {
        minimizer: [
            new TerserWebpackPlugin()
            new OptimizeCssAssetsWebpackPlugin()
        ]
    },
    module: {
        rules: [
            test: /\.css$/,
            use: [
                // 'style-loader', // 将样式通过 style 标签注入
                MiniCssExtractPlugin.loader, // 插件将css文件单独打包到一个文件，通过 link 标签的方式注入
                'css-loader'
            ]
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]-[chunkhash].bundle.css'
        }),
    ]
}
```

- contenthash，它是文件级别的 hash，根据输出文件的内容生成的hash值，只要是不同的文件，就有不同的hash值，相比于前两者，它应该是解决缓存问题最好的方式了，它精确得定位到了文件级别的hash，只有当这个文件发生了变化，才有可能更新掉这个文件名

```javascript

module.exports = {
    mode: 'none',
    entry: {
        main: './src/index.js',
    },
    output: {
        filename: '[name]-[contenthash].bundle.js'
    },
    optimization: {
        minimizer: [
            new TerserWebpackPlugin()
            new OptimizeCssAssetsWebpackPlugin()
        ]
    },
    module: {
        rules: [
            test: /\.css$/,
            use: [
                // 'style-loader', // 将样式通过 style 标签注入
                MiniCssExtractPlugin.loader, // 插件将css文件单独打包到一个文件，通过 link 标签的方式注入
                'css-loader'
            ]
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]-[contenthash].bundle.css'
        }),
    ]
}
```

> 如果你觉得 20 位的占位符太长的话，也可以指定长度

> 总的来说，用来控制缓存的话，8位应该是最好的选择了

```javascript

module.exports = {
    output: {
        filename: '[name]-[contenthash:8].bundle.js'
    },
}
```