# 模块化开发

> 当下最重要的前端开发范式
  
> 通过把我们的复杂代码，按照功能的不同划分为不同的模块，单独维护的这种方式，去提升我们的开发效率，降低维护成本

> 但就模块化这个词而言，它仅仅是一个思想或者一个理论，并不包含具体的实现

## 模块化演变过程

> 早期的前端技术标准，根本没有预料到前端行业会有今天这样的规模，所以很设计上的遗留问题，就导致现在我们去实现前端模块化的时候会遇到很多的问题，虽然说现在很多问题都被一些标准和一些工具解决了，这个解决的演进过程是值得思考的

**stage 1 - 文件划分方式**
> 最原始的模块系统，每一个文件就是一个独立的模块，一个 script 标签就对应一个模块

> 早期模块化完全依靠约定

```javascript
// module a 相关状态数据和功能函数

var name = 'module-a'

function method1() {
  console.log(name + '#method1');
}

function method2() {
  console.log(name + '#method2');
}
```

```javascript
// module b 相关状态数据和功能函数

var name = 'module-b'

function method1() {
  console.log(name + '#method1');
}

function method2() {
  console.log(name + '#method2');
}
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>模块化演变第一阶段</h1>
  <h1>基于文件的划分模块的方式</h1>
  <script src="./module-a.js"></script>
  <script src="./module-b.js"></script>
  <script>
    // 命名冲突
    method1()
    // 模块成员可以被修改
    name = 'foo'
  </script>
</body>
</html>
```

缺点：
-   污染全局作用域
-   命名冲突
-   无法管理模块依赖关系



**stage 2 - 命名空间方式**
> 在第一阶段的基础之上

> 约定每一个模块只暴露一个全局的对象，所有的模块成员都挂载在这个对象上面

```javascript
// module a 相关状态数据和功能函数

var moduleA = {
  name: 'module-a',

  method1: function() {
    console.log(this.name + '#method1');
  },

  method2: function() {
    console.log(this.name + '#method2');
  }
}
```

```javascript
// module b 相关状态数据和功能函数

var moduleB = {
  name: 'module-a',

  method1: function() {
    console.log(this.name + '#method1');
  },

  method2: function() {
    console.log(this.name + '#method2');
  }
}

```

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>模块化演变第二阶段</h1>
  <h1>每个模块只暴露一个全局对象，所有模块成员都挂载到这个对象中</h1>
  <script src="./module-a.js"></script>
  <script src="./module-b.js"></script>
  <script>
    moduleA.method1()
    moduleB.method1()
    // 模块成员可以被修改
    moduleA.name = 'foo'
  </script>
</body>
</html>
```

可以减少命名冲突的可能，但仍然没有私有的空间，所以说我们的模块成员仍然可以在外部被访问或者修改，模块的依赖关系仍然没有被解决


**stage 3 - IIFE**

> 使用立即执行函数的方式去为我们的模块提供私有空间

> 将我们模块中的每一个成员都放在一个函数提供的私有作用域当中，对于需要暴露给外部的成员，我们可以通过挂载到全局对象上的这种方式去实现

> 这种方式实现了私有成员的概念，私有成员只能在模块内部的这些成员通过闭包的方式去访问，而在外部是无法访问的，这样就确保了我们私有变量的安全

> 而且我们还可以利用自执行函数的参数作为我们的依赖声明去使用，这样就使得我们每一个模块的依赖关系就更加明显了

```javascript
// module a 相关状态数据和功能函数
// 很清晰的直到这个模块依赖了JQuery
;(function($){

  var name = 'module-a'

  function method1() {
    console.log(name + '#method1');
  }

  function method2() {
    console.log(name + '#method2');
  }

  window.moduleA = {
    method1: method1,
    method2: method2
  }

})(JQuery)
```

```javascript
// module b 相关状态数据和功能函数

;(function(){

  var name = 'module-b'

  function method1() {
    console.log(name + '#method1');
  }

  function method2() {
    console.log(name + '#method2');
  }

  window.moduleB = {
    method1: method1,
    method2: method2
  }

})()
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>模块化演变第三阶段</h1>
  <h1>使用立即执行函数表达式（IIFE：Immediately-Invoked Function Expression）为模块提供私有空间</h1>
  <script src="./module-a.js"></script>
  <script src="./module-b.js"></script>
  <script>
    moduleA.method1()
    moduleB.method1()
    // 模块私有成员无法访问
    console.log(moduleA.name); // undefined
  </script>
</body>
</html>
```

> **以上就是早期在没有工具和规范的情况下对模块化的落地方式**

> 但是它仍然存在一些没有解决的问题


## 模块化规范的出现
> 以上的这些方式都是以原始的模块系统位基础，通过约定的方式去实现模块化的代码组织，这些方式在不同的开发者去实施的时候会有一些细微的差别，为了统一不同的开发者和不同项目之间的差异，我们就需要一个标准去规范我们模块化的实现方式，

> 我们需要一些基础的公共代码去实现--自动通过代码去帮我们加载模块

> 模块化标准 + 模块化加载器

## CommonJS规范
> Node.js 当中提出的一套标准，我们在Node.js当中所有的模块代码都必须遵循CommonJS规范

- 一个文件就是一个模块
- 每个模块都有单独的作用域
- 通过 module.export 导出成员
- 通过 require 函数载入模块

> 但是如果我们想要在浏览器端也使用这个规范的话，就会出现一些问题

> CommonJS 是以同步模式加载模块，因为 Node.js 的执行机制是在启动的时候去加载模块，执行过程当中候是不需要去加载的，它只会去使用到模块，所以这种方式在Node.js中不会有问题，

> 但是如果换到浏览器端，必然会导致效率低下，因为每次页面加载都会导致大量的同步模式请求出现，所以在早期的前端模块化当中并没有选择CommonJS这个规范，而是专门为浏览器端结合浏览器的特点重新设计了一个规范，这个规范是：

## AMD（Asynchronous Module Definition）**
> 异步的模块定义规范，同期还推出了非常出名的库 Require.js，它实现了AMD这个规范，另外它本身又是一个非常强大的模块加载器

> AMD 中约定每一个模块，都必须通过define这个函数去定义
```
// 定义一个模块
// 这个函数默认接受两个参数，也可以传递三个参数
// 参数1：模块名称，后期加载模块时使用
// 参数2：是一个数组，用来声明这个模块的一些依赖项
// 参数3：是一个函数，函数的参数与前面的依赖项一一对应，每一项分别为依赖项这个模块导出的成员，这个函数的作用可以理解为--为当前这个模块提供一个私有的空间，如果需要在这些模块当中向外去导出一些成员的话，我们可以通过 return 的方式去实现
define('module1',['jquery', './module2'], function($, module2){
  return {
    start: function() {
      $('body').animate({ margin: '200px' })
      module2()
    }
  }
})
```

```
// 载入一个模块
require(['./module1'], function(module1) {
  module1.start()
})

// 当 require.js 需要去加载一个模块，内部会自动创建一个 script 标签去发送对应的脚本文件的请求，并且执行相应的模块代码
```

> 目前绝大多数的第三方库都支持 AMD 这个规范，也就是说 AMD 的生态是比较好的

- AMD 使用起来相对复杂（除了业务代码，还要使用很多的操作模块的代码）
- 模块 JS 文件请求频繁（如果项目当中模块划分的过于细致，同一个页面当中对JS文件的请求次数会特别多，从而导致页面效率低下）

> 个人认为 AMD 只能算是前端模块化演进道路上的一步，它是一种妥协的实现方式，并不能算是最终的解决方案，只不过在当时的环境背景下，它还是非常有意义的，它毕竟给了前端模块化提供了一个标准

> 除此之外，同期出现的还有 taobao 所推出的一个 sea.js

## Sea.js + CMD（通用模块定义规范）**
> 它的标准类似于 commonJS，使用上和 Require.js 差不多，可以算是一个重复的轮子，它当时的想法是让 CMD 写出来的代码尽可能跟 CommonJS 类似，从而减轻开发者的学习成本，但是这种方式在后来也被 Require.js 也兼容了
```
// CMD 规范（类似于 CommonJS 规范）
define(function(require, exports, module) {
  // 通过 require 引入依赖
  var $ = require('jquery')
  // 通过 exports 或者 module.exports 对外暴露
  module.exports = function() {
    console.log('module 2');
    $('body').append('<p>module2</p>')
  }
})
```

## ES Module（模块化标准规范）
> 模块化的最佳实践

- 在这之前我们已经了解了前端模块化的发展过程，以及在这个过程中出现过的一些标准，尽管这些方式和标准也都实现了模块化，但是它们都或多或少都存在一些让开发者难以接受的问题

- 随着技术的发展，Javascript的标准也在逐渐完善，而我们在模块化的实现方式相对于以往已经有很大的变化了，现如今的前端模块化已经算是非常成熟了，而且目前大家针对于前端模块的最佳实现方式也都基本统一了

- 在 Node.js 环境当中我们会遵循 CommonJS 规范去组织模块

- 在浏览器环境当中我们会采用 ESModules 的规范

- 当然也会有极少部分例外情况的出现，但是总得来说，前端模块化目前算是统一成了 CommonJS 和 ESModules 这两个规范了，对于开发者而言我们只需要着重掌握这两种规范就可以了

- CommonJS是内置的规范系统，没有任何环境问题，但是对于 ESModules 的情况会相对复杂一些，它是 ES6 中定义的最新的模块系统，也就说它是最近这几年才被定义的一个标准，所以它肯定会存在各种各样的环境兼容问题，最早在这个标准刚推出的时候，所有的主流浏览器都是不支持这一特性的，随着 Webpcak等一些列的打包工具的流行，这以规范才逐渐开始普及

- 截止到目前 ESModules 基本上已经可以说是最主流的前端模块化方案了，相比于 AMD 这种社区提出来的开发规范，ESModules 可以说是在语言层面实现了模块化，所以说它更为完善一点，另外，现如今绝大多数的浏览器已经开始支持 ESModules 这个特性了，原生支持也就意味着我们可以在以后直接去使用这个特性去开发我们的网页应用了

> 综上所述，针对于如何在不同的环境当中我们去更好的使用 ESModules 自然就成为我们接下来去学习的重点    

### ES Modules 基本特性

-   自动采用严格模式，忽略 'use strict'
-   每个 ESM 模块都是单独的私有作用域
-   ESM 是通过 CORS 去请求外部 JS 模块的
-   ESM 的 script 标签会延迟执行脚本

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ES Module - 模块特性</title>
</head>
<body>
  <!-- 通过给 script 添加 type = module 的属性，就可以以 ES Module 的标准执行其中的 JS 代码了 -->
  <script type="module">
    console.log('this is es module')
  </script>

  <!-- 1. ESM 自动采用严格模式，忽略 'use strict' -->
  <script type="module">
    console.log(this) // undefiend
  </script>

  <!-- 2. 每个 ES Module 都是运行在单独的私有作用域中 -->
  <script type="module">
    var foo = 100
    console.log(foo)
  </script>
  <script type="module">
    console.log(foo) // not defined
  </script>

  <!-- 3. ESM 是通过 CORS 的方式请求外部 JS 模块的，服务端必须要支持 CORS 的方式，否则会有跨域问题 -->
  <script type="module" src="请求地址"></script>

  <!-- 4. ESM 的 script 标签会延迟执行脚本 -->
  
  <!-- 普通的script会阻塞网页的渲染 -->
  <script src="./demo.js"></script>

  <script type="module"></script> 等同于 <script defer src="./demo.js"></script>
  <p>需要显示的内容</p>
</body>
</html>
```

### ES Modules 导出
```javascript
// ./module.js
const foo = 'es modules'
export { foo }

// ./app.js
import { foo } from './module.js'
console.log(foo)
```

```javascript
export var name = 'foo'
export function hello() {
    console.log('hello')
}

export class Person {}
```

```javascript

var name = 'foo'

function hello() {
    console.log('hello')
}

class Person {}

// 统导出这种做法相对常见一些，集中导出所有成员的方式，更直观的描述这个模块向外提供了哪些成员
export { name, hello, Preson }
```

```javascript
var name = 'foo'
function hello() {
    console.log('hello')
}

class Person {}

// 还可以通过这种方式去为输出的成员进行重命名，关键词 as
export { 
    name as fooName,
    hello as fooHello
}

// 导入需要使用重命名的名字
import { fooName } from './module.js'
```

```javascript
var name = 'foo'
function hello() {
    console.log('hello')
}

class Person {}

// 一旦当我们将导出成员的名称设置为 default ，那这个成员就会作为当前这个模块默认导出的成员
export { 
    name as default
}

// 导入的时候就必须为这个成员重命名了，因为 default 是一个关键词，我们在 import 的时候不能把它当作一个变量使用
import { default as fooName } from './module.js'
```

```javascript
var name = 'foo'
function hello() {
    console.log('hello')
}

class Person {}

// 作为当前这个模块的默认导出
export default name

// 导入的时候名字可以随便取
import abc from './module.js'
console.log(abc)
```

### ES Modules 导入导出的注意事项

```javascript
var name = 'jack'
var age  = 18

// var obj  = { name,age }
// 注意：这种 export 导出的方式并不是导出字面量, import 引入也并不是解构，而是一种固定的语法用法
export { name, age }

import { name, age } from './module.js'

```

```javascript
var name = 'jack'
var age  = 18

// 如果真的想要导出一个对象，就需要用 default ，此时才是导出字面量，因为 export defult 后面可以跟一个变量或者一个值
export default { name, age }

import foo from './module.js'
```

```javascript
var name = 'jack'
var age  = 18

// 注意：export 导出的是变量的只读的引用地址，而不是拷贝了一份变量（将值的引用关系给到了外部）
export { name, age }

setTimeout(function() {
    name = 'ben'
},1000)

-------------------------------------------------------------------

import { name, age } from './module.js'

name = 'tom' // 只读成员不能被修改

console.log(name, age) // jack 18

setTimeout(function() {
   console.log(name, age) // ben 18
},1500)
```


### ES Modules 导入用法

```javascript

// import {name} from './module' // CommonJS 可以省略扩展名
import { name } from './module.js' // ESM 必须是完整名称，不能省略扩展名

// import { lowercase } from './utils' // CommonJS 可以省略默认文件 index
import { lowercase } from './utils/index.js' // ESM 不能省略默认文件 index

// 后期使用打包工具时就可以省略扩展名和默认文件 index

```

```javascript

// import { name } from 'module' // 引入模块不能以字母开头，否则 ESM 会认为在加载第三方模块，这一点和 CommonJS 一致

// 以下方式都可以使用
import { name } from './module.js' // 相对路径
import { name } from '/04-import/module.js/' // 绝对路径
import { name } from 'http://localhost:3000/04-import/module.js' // 完整URL

```

```javascript

// 当我们只是需要执行某个模块，而不需要提取模块中的成员时
import {} from './module.js'
或
import './module.js'

// 这个特性在我们去导入一些不需要外界控制的子功能模块时会非常有用
```

```javascript

// 把这个模块当中所有导出的成员全部提取出来
import * as mod from './module.js' // 通过 * as 的方式全部放到一个对象中
```

```javascript

// 不能import 一个变量
// var modulePath = './module.js'
// import { name } from modulePath

// 只能在最外层作用域
// if (true) {
//   import { name } from './module.js'
// }

如果我们需要满足以上的情况，就需要用到动态引入
// 可以在任何地方调用
// 返回一个 Pormise
import('./module.js').then(function(module){
    console.log(module)
})

```

```javascript

// 如果一个模块同时导出了命名成员和默认成员
export { name, age }
export default 'default export'

// ----------------------------------

// 同时引入，default需重命名
import { name, age, default as title } from './module.js'

// 简写写法，左边的是默认成员，可以随意起名字
import title, { name, age } from './module.js'

```


### ES Module 直接导出导入成员

```javascript

// 直接将 import 换成 export 
// 所有导入成员直接成为当前这个模块的导出成员
// 这样一来，在当前作用域就不能再访问这些成员了
export { name, age } from './module.js'

这样一个特性，一般在写 index.js 的时候会用到，通过 index 把某个目录下散落的一些模块组织到一起然后导出，方便外部去使用

```


### ES Module 浏览器环境 Polyfill
- 目前还有很多不支持 ES Module 的浏览器，所以还是需要考虑兼容性的问题

- 让浏览器直接支持 ES Module

- Browser ES Module Loader

- npm 的包可以通过 npm提供的CDN来加载 https://unpkg.com/包名

```html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ES Module 浏览器环境 Polyfill</title>
</head>
<body>
  <!-- nomodule 新特性是在不支持esmodule的浏览器才会执行的脚本 -->
  <script nomodule src="https://unpkg.com/browse/browser-es-module-loader@0.4.1/dist/babel-browser-build.js"></script>
  <script nomodule src="https://unpkg.com/browse/browser-es-module-loader@0.4.1/dist/browser-es-module-loader.js"></script>
  <!-- 如果浏览器不支持 Promise，还需要引入下面的模块 -->
  <script nomodule src="https://unpkg.com/browse/promise-polyfill@8.2.0/dist/polyfill.min.js"></script>
  <script type="module">
    import { foo } from './module.js'
    console.log(foo);
  </script>
</body>
</html>

```

> 以上方式只在开发环境测试，千万不要在生产环境使用，因为它的原理是运行阶段动态的解析脚本，效率非常的差，生产阶段还是应该要预先把这些代码编译出来可以直接在浏览器工作


### ES Module 在 Node.js-支持情况

> node.js 8.5版本过后已经开始逐步支持 ES Module 了，也就是说在Node中可以原生的去使用 ES Module去编写代码了，考虑到 CommonJS 规范与 ES Module 特性差距还是比较大的，所以说目前这样一个特性一直还是处于一个过渡的状态

```javascript
// 1. 首先要把文件拓展名改成 mjs
import { foo, bar } from './module.mjs'
console.log(foo, bar)

// 执行：node --experimental-module index.mjs

```

### ES Module 在 Node.js-与 CommonJS 交互

```javascript

// commonjs.js
// 如果要在 ES Module 中引用，它始终只会导出一个默认成员
module.exports = {
    foo: 'commonjs exports value'
}

// -----------------------------

// es-module.mjs
// ES Module 中只能以载入默认成员的方式去使用 CommonJS 的模块
// import { foo } from './commonjs.js'  // 不能直接提取成员，import 不是结构导出对象
import mod from './commonjs.js'
console.log(mod)

```

> CommonJS 不能导入 ES Module 模块
```javascript

// es-module.mjs
export const foo = 'es module export value'


// -----------------------------

// commonjs.js
// const mod = require(./es-module.mjs) // 不能导入 ES Module 模块
```

### ES Module 在 Node.js-与 CommonJS 的差异


```javascript

// commonjs.js
console.log(require) // 加载模块函数
console.log(module) // 模块对象
console.log(export) // 导出对象别名
console.log(__filename) // 当前文件的绝对路径
console.log(__dirname) // 当前文件所在目录
// 这5个成员实际上都是 CommonJS 把我们的模块包装成一个函数过后，通过参数提供进来的成员
// 以下我们通过 ES Module ，加载的方式发生了变化，所以就不在提供这几个成员了， import、export 可以代替 require、module、export

// -----------------------------

// es-module.mjs
// ES Module 中没有 CommonJS 中的那些模块全局成员了，通过以下方式来得到 __filename 和 __dirname
import { fileURLToPath } from 'url'
const __filetname = fileURLToPath(import.meta.url)
console.log(__filename)

import { dirname } from 'path'
const __dirname = dirname(__filename)
console.log(__dirname)


```

### ES Module 在 Node.js-与 CommonJS 最新版本的进一步支持
> 在 nodejs 最新版本中进一步支持了 ES Module

```javascript

// 在 package.json 中指定 type: 'module'，就不需要再修改 ES Module 模块的拓展名为 mjs 了
{
    type: 'module'
}

// 不过要在CommonJS 模块中修改扩展名为 cjs 才能使用 CommonJS 规范

```

### ES Module 在 Node.js-与 CommonJS Babel兼容方案
> 借助 Bable 在低版本的 node 环境当中去使用 ES Module

```javascript

yarn add @babel/node @babel/core @babel/preset-env --dev

// preset-env 是一个插件的集合，包含了最新 JS 标准当中的所有新特性
// 所以执行命令时需要传入插件参数
npm babel-node index.js --presets=@babel/preset-env

// 也可以在 .babelrc 配置文件中配置插件参数
{
    "preseets": ["@babel/preset-env"]
}
npm babel-node index.js

// 也可以使用指定插件来转换，而不是用插件集合 preset.env
yarn add @babel/plugin-transform-modules-commonjs --dev

// .babelrc
{
    "preseets": ["@babel/plugin-transform-modules-commonjs"]
}

```