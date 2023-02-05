# 自动化构建
- 把我们在开发阶段的写出来的源代码自动化的转换成生产环境中可以运行的程序，这个过程称之为 自动化构建工作流，

- 作用是尽可能脱离运行环境的种种问题，去在开发阶段使用一些提高效率的语法、规范和标准

- 构建转换那些不被支持的 特性，尽情在开发中使用这种方式来提高我们的编码效率

## 最佳实践
-   工具层面没有唯一的标准
-   充分掌握 Gulp 与 webpcak，因地制宜
-   SPA 类使用 webpack
-   MPA 类使用 Gulp
-   如果只是个别的需求直接使用 npm script 配合个别工具就好
    - 例如 只需要校验代码，单独使用 ESLint
    - start prestart


## 初探

```json
// NPM Script 实现简单的自动化构建工作流

{
  "name": "my-project",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "build": "sass scss/main.scss css/style.css --watch",
    "serve": "browser-sync . --files \"css/*.css\"",
    "start": "run-p build serve" // 借助npm-run-all 同时执行 build 和 serve
  },
  "dependencies": {},
  "devDependencies": {
    "browser-sync": "^2.26.14",
    "sass": "^1.35.1"
  }
}

```


## Grunt
>   最早的构建系统，有完善的生态，由于它的工作过程是基于临时文件去实现的，所以构建速度相对较慢

**基本使用**

1. yarn init  初始化 package.json
2. yarn add grunt  安装 grunt
3. 根目录下创建入口文件 gruntfile.js
```javascript
// Grunt 的入口文件
// 用于定义一些需要 Grunt 自动执行的任务
// 需要导出一个函数
// 此函数接收一个 grunt 的形参，内部提供一些创建任务时可以用到的 API

module.exports = grunt =>{
    // 注册任务 npm grunt foo 执行任务（npm grunt npm 会在 node_modules中自动找到提供的一些命令）
    grunt.registerTask('foo',()=>{
        console.log('hello grunt~');
    })

    // 第二个参数添加描述信息，在执行 npm grunt --help 查看帮助的时候可以看到描述信息
    grunt.registerTask('bar','描述信息',()=>{
        console.log('other task~');
    })

    // 默认执行的任务指定名为 default 的任务
    // grunt.registerTask('default',()=>{
    //     console.log('default task~');
    // })

    // 使用 defalut 默认任务来映射其他任务
    grunt.registerTask('default',['foo','bar'])

    // grunt 默认支持的是同步任务，所以这里的异步代码没有被执行
    // grunt.registerTask('async-task',()=>{
    //     setTimeout(() => {
    //         console.log('async task working~');
    //     }, 1000);
    // })

    // 如果要执行异步操作，必须通过 this.async() 的方法得到一个回调函数，
    // 在异步操作完成过后去调用这个回调函数，标识一下这个任务已经完成
    // 如果要在这个函数中使用 this ，那就不能使用箭头函数
    grunt.registerTask('async-task',function(){
        const done = this.async()
        setTimeout(() => {
            console.log('async task working~');
            done()
        }, 1000);
    })
}

```

**标记任务失败**
```javascript
module.exports = grunt =>{
    // 添加 return false，标记任务失败
    grunt.registerTask('bad', ()=>{
        console.log('bad working~');
        return false
    })

    grunt.registerTask('foo', ()=>{
        console.log('foo task~');
    })

    grunt.registerTask('bar',()=>{
        console.log('bar task~');
    })

    // 正常情况下，执行default会依次执行 foo，bad，bar，但是bad标记了失败，就不会在执行bar
    // yarn grunt default --force 强制执行所有任务
    grunt.registerTask('default',['foo','bad','bar'])

    // 异步任务不能执行通过 return false来标记任务失败，而是通过 done(false) 的方式
    grunt.registerTask('bad-async',function(){
        const done = this.async()
        setTimeout(() => {
            console.log('bad async');
            done(false)
        }, 1000);
    })
}
```

**配置方法**
```javascript
module.exports = grunt =>{
    // 配置 api
    grunt.initConfig({
        // 属性名一般和任务名保持一致
        foo:'123',
        bar:{
            val:'456'
        }

    })

    grunt.registerTask('foo', ()=>{
        console.log(grunt.config('foo'));
    })

    grunt.registerTask('bar', ()=>{
        console.log(grunt.config('bar.val'));
    })
}
```

**多目标任务**

```javascript
module.exports = grunt =>{
    grunt.initConfig({
        // 所有指定的每一个属性的键，都会成为一个目标，除了指定的 options 以外，
        // options 指定的信息会作为这个任务的配置选项出现
        build: {
            options:{
                foo:'123'
            },
            // 如果目标的配置也是一个对象的话，在这个属性当中也可以添加一个 options，
            // 这个 options 会覆盖对象中的 options
            css: {
                options:{
                    foo:'456'
                }
            },
            js: '2'
        }
    })
    // 通过 grunt.registerMultiTask 注册多目标模式，可以让任务根据 grunt.initConfig 配置形成多个子任务
    grunt.registerMultiTask('build', function(){
        // 通过 this.target 拿到当前执行这个目标的名称，this.data 可以拿到这个 target 所对应的配置数据
        console.log(`target：${this.target}，data：${this.data}`);
        console.log(this.options());
    })
}
```

**Grunt 插件使用**
>   grunt 的插件通常以 grunt-contrib-插件名 的方式命名

>   以常用的 grunt-contrib-clean(清除在项目中产生的临时文件) 举例

```javascript
// yarn add grunt-contrib-clean

module.exports = grunt =>{
    // grunt-contrib-clean 任务是一种多目标任务，我们需要去配置不同的目标
    grunt.initConfig({
        clean: {
            // temp:'temp/app.js' // 清除 temp下的app.js
            // temp:'temp/*.txt' // 使用通配符 清除 temp 下的所有的 txt 文件
            temp:'temp/**' // 使用通配符 清除 temp 下的所有文件
        }
    })
    // 通过 grunt.loadNpmTasks('grunt-contrib-clean') 加载插件提供的任务
    grunt.loadNpmTasks('grunt-contrib-clean')
}
```

**常用插件及总结**

> grunt 已经退出历史舞台，不做更多的插件介绍，通过以下几个的基本用法，来为后面的 gulp 做铺垫

```javascript
// yarn add load-grunt-tasks --dev 加载所有的 grunt 插件中的任务，不需要一一引入
// sass: yarn add grunt-sass sass --dev
// babel: yarn add grunt-babel @babel/core @babel/preset-en --dev
// yarn add grunt-contrib-watch --dev 监听热更新

const sass = require('sass')
const loadGruntTasks = require('load-grunt-tasks')

module.exports = grunt =>{
    grunt.initConfig({
        
        sass:{
            options:{
                sourceMap: true,
                // implementation 用来指定 grunt-sass 当中使用哪个模块来处理 sass 的编译
                implementation: sass
            },
            main:{
                file:{
                    // 输出文件:源文件
                    'dist/css/main.css':'src/scss/main.scss'
                }
            }
        },
        babel: {
            options:{
                sourceMap: true,
                // 加载最新的 es 的特性
                presets: ['@babel/preset-env']
            },
            main: {
                files: {
                    'dist/js/app.js': 'src/js/app.js'
                }
            }
        },
        watch: {
            js:{
                files: ['src/js/*.js'],
                // 当文件发生改变后执行的任务
                tasks: ['babel']
            },
            css:{
                files: ['src/scss/*.scss'],
                // 当文件发生改变后执行的任务
                tasks: ['sass']
            }
        }
        
    })
    // grunt.loadNpmTasks('grunt-sass')
    loadGruntTasks(grunt) // 自动加载所有的 grunt 插件中的人物

    // 一开始先执行一次 sass、babel、watch
    grunt.registerTask('default',['sass','babel','watch'])
}

```

## Gulp
>   很好的解决了 Grunt 构建慢的问题，因为它是基于内存是实现的，默认支持同时执行多个任务，插件生态也同样完善，是目前最流行的前端构建系统

**基本使用**

1. yarn init  初始化 package.json
2. yarn add gulp --dev  安装 grunt，会同时安装一个gulp-cli的模块，在node_modules当中会出现一个 gulp 的命令，有了这个命令就可以在后续通过这个命令进行一些构建任务
3. 根目录下创建入口文件 gulpfile.js

```javascript
// gulp 的入口文件

// gulp 4.0以前定义任务的方式
// 目前还保留了这个api,但是已经不推荐使用了
// const gulp = require('gulp')
// gulp.task('bar', done => {
//   console.log('bar working~');
//   done()
// })

// 在最新的 gulp 里，取消了同步代码模式，约定每一个任务都是必须是一个异步的任务，
// 当任务执行完过后需要通过调用回调函数或者其他方式去标记这个任务已经完成
exports.foo = done => {
  console.log('foo task working~');
  done() // 标识任务完成
}

exports.default = done => {
  console.log('default task working~');
  done()
}
```

**组合任务**
>   例如我们编译 css、js 可以使用并行任务来提高效率

>   例如我们执行部署，需要先执行编译任务再执行打包，就可以使用串行任务

```javascript

const { series, parallel } = require('gulp')

// 未被导出的成员函数理解成私有的任务
const task1 = done => {
  setTimeout(() => {
    console.log('task1 working~');
    done()
  }, 1000);
}

const task2 = done => {
  setTimeout(() => {
    console.log('task2 working~');
    done()
  }, 1000);
}

const task3 = done => {
  setTimeout(() => {
    console.log('task3 working~');
    done()
  }, 1000);
}

exports.foo = series(task1,task2,task3) // 创建串行任务
exports.bar = parallel(task1,task2,task3) // 创建并行任务

```

**异步任务**
>   处理异步流程的方式

```javascript
const fs = require('fs')

exports.callback = done =>{
  console.log('callback task~');
  done()
}

exports.callback_error = done => {
  console.log('callback task~');
  done(new Error('task failed!'))
}

exports.promise = () => {
  console.log('promise task~');
  return Promise.resolve()
}

exports.promise_error = () => {
  console.log('promise task~');
  return new Promise.reject(new Error('task failed!'))
}

const timeout = time => {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  })
}
exports.async = async () => {
  await timeout(1000)
}

// exports.stream = () => {
//   const readStream = fs.createReadStream('package.json')
//   const writeStream = fs.createWriteStream('temp.txt')
//   readStream.pipe(writeStream)
//   return readStream // gulp 根据流的状态判断这个任务是否完成
// }
exports.stream = done => {
  const readStream = fs.createReadStream('package.json')
  const writeStream = fs.createWriteStream('temp.txt')
  readStream.pipe(writeStream)
  // 实际上 gulp 绑定了end事件来标记任务的结束
  readStream.on('end', () => {
    done()
  })
}
```

**gulp构建过程核心工作原理**
>   基于流的构建系统

>   输入（读取流）=> 加工（转换流）=> 输出（写入流）

```javascript
const fs = require('fs')
const { Transform } = require('stream')

exports.default = () => {
  // 文件读取流
  const read = fs.createReadStream('normalize.css')
  // 文件写入流
  const write = fs.createWriteStream('normalize.min.css')
  // 文件转换流
  const transform = new Transform({
    transform: (chunk, encoding, callback) => {
      // 核心转换过程
      // chunk => 读取流中读取到的内容（Buffer）
      const input = chunk.toString()
      const output = input.replace(/\s+/g,'').replace(/\/\*.+?\*\//g,'')
      callback(null,output)
    }
  })

  // 把读取出来的文件流导入写入文件流
  read
    .pipe(transform) // 转换
    .pipe(write) // 写入

  return read
}

```

**文件操作 API**
>   文件操作 API + 插件的使用
> gulp 为我们提供了专门用于创建读取流和写入流的 API，相比于底层 node 的 API 会更强大也更容易使用，至于负责文件加工的转换流，大多数情况下我们都是通过独立的插件来提供

> 我们在实际通过 gulp 去创建构建任务时的流程，就是先通过 src 方法去创建一个读取流，然后再借助于插件提供的转换流来实现文件加工，最后我们再通过 gulp 提供的 dest 方法去创建一个写入流，从而写入到目标文件

```javascript
const { src, dest }  = require('gulp')
const cleanCss = require('gulp-clean-css') // 压缩代码 yarn add gulp-clean-css --dev
const rename = require('gulp-rename') // 重命名 yarn add gulp-rename --dev

exports.default = () => {
 // gupl 文件操作 API 可以使用通配符
  return src('src/*.css')
    .pipe(cleanCss())
    .pipe(rename({extname: '.min.css'}))
    .pipe(dest('dist'))
}
```

#### 案例

初始目录
```
├─ .gitignore
├─ gulpfile.js
├─ LICENSE
├─ package.json
├─ public
│  └─ favicon.ico
├─ README.md
├─ src
│  ├─ about.html
│  ├─ assets
│  │  ├─ fonts
│  │  │  ├─ pages.eot
│  │  │  ├─ pages.svg
│  │  │  ├─ pages.ttf
│  │  │  └─ pages.woff
│  │  ├─ images
│  │  │  ├─ brands.svg
│  │  │  └─ logo.png
│  │  ├─ scripts
│  │  │  └─ main.js
│  │  └─ styles
│  │     ├─ demo.scss
│  │     ├─ main.scss
│  │     ├─ _icons.scss
│  │     └─ _variables.scss
│  ├─ features.html
│  ├─ index.html
│  ├─ layouts
│  │  └─ basic.html
│  └─ partials
│     ├─ footer.html
│     ├─ header.html
│     └─ tags.html
└─ yarn.lock

```

**样式编译**

```javascript

// yarn add gulp --dev

// yarn add gulp-sass --dev 文件转换流插件（可能需要翻墙安装，^4.0.2版本有指定转换流）

const { src, dest } = require('gulp')
//const sass = require('gulp-sass') // 转换流插件
const sass = require('gulp-sass')(require('node-sass')) // gulp-sass 5版本没有默认的sass编译器，需要安装和引入 sass 或者 node-sass

const style = () => {
  // 为了不让原来的目录结构丢失，src可以指定一个选项参数 base，转换时的基准路径，让'src'后面的目录结构都保存下来
  return src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(sass( { outputStyle: 'expanded' } )) // 指定css样式结束括号的位置
    .pipe(dest('dist'))
}

module.exports = {
  style
}

// sass 在工作的时候会认为 _开头的文件是引用文件，会被忽略掉
// _icons.scss  _variables.scss  main.scss ==> main.css
```

**脚本编译**

```javascript

const { src, dest } = require('gulp')
const sass = require('gulp-sass')(require('node-sass'))

// yarn add gulp-babel --dev
// yarn add @babel/core @babel/preset-env --dev
// gulp-bable 模块只负责调取 node_modules 里的 babel，所有需要单独安装babel
const babel = require('gulp-babel')

const style = () => {
  return src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(sass( { outputStyle: 'expanded' } ))
    .pipe(dest('dist'))
}

const script = () => {
  return src('src/assets/scripts/*.js',{ base: 'src' })
    // presets 指定 babel 指定转换插件
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('dist'))
}

module.exports = {
  style,
  script
}
```

**页面模版编译**

```javascript

const { src, dest, parallel } = require('gulp')
const sass = require('gulp-sass')(require('node-sass'))
const babel = require('gulp-babel')

// yarn add gulp-swig --dev
const swig = require('gulp-swig')
const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Featuires',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/w_zce'
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/zce'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}

const style = () => {
  return src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(sass( { outputStyle: 'expanded' } ))
    .pipe(dest('dist'))
}

const script = () => {
  return src('src/assets/scripts/*.js',{ base: 'src' })
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('dist'))
}

const page = () => {
  // **/* 通配符匹配 src 任意子目录下的 html 文件
  return src('src/**/*.html', { base: 'src' })
    // data 指定传入模板的数据
    .pipe(swig({ data }))
    .pipe(dest('dist'))
}

// 使用组合任务（三个任务相互没有牵连，使用并行任务可以提升效率）
const compiple = parallel(style, script, page)

module.exports = {
  compiple
}
```

**图片和字体文件转换**

```javascript

const { src, dest, parallel } = require('gulp')
const sass = require('gulp-sass')(require('node-sass'))
const babel = require('gulp-babel')
const swig = require('gulp-swig')

// yarn add gulp-imagemin --dev
// imagemin 插件也会去github下载c++的程序集，所以最好翻墙来下载
const imagemin = require('gulp-imagemin')

const data = {}

const style = () => {
  return src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(sass( { outputStyle: 'expanded' } ))
    .pipe(dest('dist'))
}

const script = () => {
  return src('src/assets/scripts/*.js',{ base: 'src' })
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('dist'))
}

const page = () => {
  return src('src/**/*.html', { base: 'src' })
    .pipe(swig({ data }))
    .pipe(dest('dist'))
}

const image = () => {
  return src('src/assets/images/**', { base: 'src' })
    .pipe(imagemin())
    .pipe(dest('dist'))
}

// 对于字体文件中的svg，imagemin也可以去处理，而其他类型的字体文件不会处理
const font = () => {
  return src('src/assets/fonts/**', { base: 'src' })
    .pipe(imagemin())
    .pipe(dest('dist'))
}


const compiple = parallel(style, script, page)

module.exports = {
  compiple
}
```

**其他文件及文件清除**

```javascript

const { src, dest, parallel, series } = require('gulp')
const sass = require('gulp-sass')(require('node-sass'))
const babel = require('gulp-babel')
const swig = require('gulp-swig')
const imagemin = require('gulp-imagemin')

// yarn add del --dev
// 一个可以在 gulp 中使用的第三方插件，用于清除指定文件
const del = require('del')
// del是异步任务
const clean = () => {
  return del(['dist'])
}

const data = {}

const style = () => {
  return src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(sass( { outputStyle: 'expanded' } ))
    .pipe(dest('dist'))
}

const script = () => {
  return src('src/assets/scripts/*.js',{ base: 'src' })
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('dist'))
}

const page = () => {
  return src('src/**/*.html', { base: 'src' })
    .pipe(swig({ data }))
    .pipe(dest('dist'))
}

const image = () => {
  return src('src/assets/images/**', { base: 'src' })
    .pipe(imagemin())
    .pipe(dest('dist'))
}

const font = () => {
  return src('src/assets/fonts/**', { base: 'src' })
    .pipe(imagemin())
    .pipe(dest('dist'))
}

// 其他文件处理任务，public 目录下文件直接移动过去
const extra = () => {
  return src('public/**', { base: 'public' })
    .pipe(dest('dist'))
}

const compiple = parallel(style, script, page, image, font)

// compiple 主要处理 src 目录下的文件，所以在组合任务的基础上再用 parallel 组合一次
// 使用 series 组合串行任务，先执行清除 dist 目录的 clean 任务，再执行处理任务
const build = series(clean, parallel(compiple, extra))

module.exports = {
  build
}
```

**自动加载插件**

> 随着构建任务越来越复杂，使用到的插件也越来越多，如果都是手动的方式载入插件的话，require的操作会非常的多，不利于后期回顾代码，我们通过一个插件解决这个小问题

```javascript
// yarn add gulp-load-plugins --dev

const { src, dest, parallel, series } = require('gulp')

const del = require('del')

const loadPlugins = require('gulp-load-plugins')

// 自动载入gulp插件，识别 gulp- 后的字符
// gulp-sass => plugins.sass
// gulp-aa-bb => plugins.aaBb 多个斜杠识别为驼峰
const plugins = loadPlugins()



// del是异步任务
const clean = () => {
  return del(['dist'])
}

const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Featuires',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/w_zce'
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/zce'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}

const style = () => {
  // 为了不让原来的目录结构丢失，src可以指定一个选项参数 base，转换时的基准路径，让'src'后面的目录结构都保存下来
  return src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(plugins.sass( { outputStyle: 'expanded' } )) // 指定css样式结束括号的位置
    .pipe(dest('dist'))
}

const script = () => {
  return src('src/assets/scripts/*.js',{ base: 'src' })
    // presets 指定 babel 指定转换插件
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('dist'))
}

const page = () => {
  // **/* 通配符匹配 src 任意子目录下的 html 文件
  return src('src/**/*.html', { base: 'src' })
    // data 指定传入模板的数据
    .pipe(plugins.swig({ data }))
    .pipe(dest('dist'))
}

const image = () => {
  return src('src/assets/images/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

const font = () => {
  return src('src/assets/fonts/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

const extra = () => {
  return src('public/**', { base: 'public' })
    .pipe(dest('dist'))
}


const compiple = parallel(style, script, page, image, font)
const build = series(clean, parallel(compiple, extra)) 

module.exports = {
  build,
}

```

**开发服务器**
> 用于开发阶段调试我们的应用，可以通过启动 gulp 并且管理这个开发服务器，后续配合我们一些构建任务去实现在代码修改过后自动去编译并且自动去刷新浏览器页面，这样可以提升开发效率

```javascript

// yarn add browser-sync --dev

const { src, dest, parallel, series } = require('gulp')

const del = require('del')

const browserSync = require('browser-sync')
// 创建一个开发服务器，用于监听热更新
const bs = browserSync.create()

const loadPlugins = require('gulp-load-plugins')

const plugins = loadPlugins()

// del是异步任务
const clean = () => {
  return del(['dist'])
}

const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Featuires',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/w_zce'
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/zce'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}

const style = () => {
  return src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(plugins.sass( { outputStyle: 'expanded' } ))
    .pipe(dest('dist'))
}

const script = () => {
  return src('src/assets/scripts/*.js',{ base: 'src' })
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('dist'))
}

const page = () => {
  // **/* 通配符匹配 src 任意子目录下的 html 文件
  return src('src/**/*.html', { base: 'src' })
    // data 指定传入模板的数据
    .pipe(plugins.swig({ data }))
    .pipe(dest('dist'))
}

const image = () => {
  return src('src/assets/images/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

const font = () => {
  return src('src/assets/fonts/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

const extra = () => {
  return src('public/**', { base: 'public' })
    .pipe(dest('dist'))
}

// 将这个开发服务器单独定义到一个任务当中去启动
const server = () => {
  bs.init({
    notify: false,// 不弹出提示browserSync是否已连接
    port: '2080', // 配置端口
    // open: false,// 是否自动打开浏览器
    files: 'dist/**',// browserSync 启动后监听的路径通配符（你想要哪些文件发生改变过后，browserSync 自动更新浏览器）
    server: {
      baseDir: 'dist',
      routes: { // 指定单独的路由，匹配优先于 baseDir，
        '/node_modules': 'node_modules' // 这里先用这种办法指定库文件
      }
    }
  })
}


const compiple = parallel(style, script, page, image, font)
const build = series(clean, parallel(compiple, extra)) 

module.exports = {
  build,
  server
}

```

**监听变化以及构建优化**

```javascript
// yarn add browser-sync

const { src, dest, parallel, series, watch } = require('gulp')

const del = require('del')

const browserSync = require('browser-sync')
// 创建一个开发服务器
const bs = browserSync.create()

const loadPlugins = require('gulp-load-plugins')

const plugins = loadPlugins()

const clean = () => {
  return del(['dist'])
}

const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Featuires',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/w_zce'
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/zce'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}

const style = () => {
  return src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(plugins.sass( { outputStyle: 'expanded' } ))
    .pipe(dest('dist'))
}

const script = () => {
  return src('src/assets/scripts/*.js',{ base: 'src' })
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('dist'))
}

const page = () => {
  return src('src/**/*.html', { base: 'src' })
    .pipe(plugins.swig({ data,defaults: { cache: false } }))
    .pipe(dest('dist'))
}

const image = () => {
  return src('src/assets/images/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

const font = () => {
  return src('src/assets/fonts/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

const extra = () => {
  return src('public/**', { base: 'public' })
    .pipe(dest('dist'))
}

const server = () => {
  
  /**
   * 通过 gulp 的 watch 监听以下目录的变化来实现热更新
   *
   */
  watch('src/assets/styles/*.scss',style)
  watch('src/assets/scripts/*.js',script)
  watch('src/**/*.html',page)  // 模板引擎swig的热更新需要将 cache 设为 false
  /**
   * 对于图片、字体、一些额外文件在开发阶段编译没有太大意义，
   * 例如：图片实现的是无损压缩，并不影响最终在页面中的呈现，
   * 这就意味着，在开发阶段去监视更多的文件，做更多的任务，开销也就更多，
   * 而这个开销在开发阶段是没有意义的，只是在发布之前上线之前希望通过压缩一下，来减小一下上线的体积，从而提高网站运行的效率，
   * watch('src/assets/images/**',image)
   * watch('src/assets/fonts/**',font)
   * watch('public/**',extra)
   */
  // 所以我们通过监听这类文件的变化，自动更新浏览器，浏览器重新发起对这些文件的请求，而不是执行构建任务
  watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
  ],bs.reload)

  bs.init({
    notify: false,// 不弹出提示browserSync是否已连接
    port: '2080', // 配置端口
    // open: false,// 是否自动打开浏览器
    /** files
     * browserSync 启动后监听的路径通配符（你想要哪些文件发生改变过后，browserSync 自动更新浏览器）
     * 也可以通过在对应的构建任务后面加上 .pipe(bs.reload({ stream: true })) 的方式实现监听
     */
    files: 'dist/**',
    server: {
      // baseDir 可以传入一个数组，依次匹配，例如：如果在dist文件中匹配不到就匹配src，src匹配不到就匹配 public
      // 这么做的目的就是像压缩图片这一类任务是在发布上线之前执行的，那么图片就不能在dist文件中匹配到
      baseDir: ['dist','src','public'],
      routes: { // 指定单独的路由，匹配优先于 baseDir，
        '/node_modules': 'node_modules' // 这里先用这种办法指定库文件
      }
    }
  })
}


const compiple = parallel(style, script, page)
// 上线之前执行的任务
const build = series(clean, parallel(compiple,  image, font, extra)) 

const develop = series(compiple,server)

module.exports = {
  build,
  server,
  develop
}

```

**文件引用处理和文件压缩**

```javascript
// yarn add gulp-useref --dev
// yarn add gulp-htmlmin gulp-uglify gulp-clean-css --dev
// yarn add gulp-if --dev

const { src, dest, parallel, series, watch } = require('gulp')

const del = require('del')

const browserSync = require('browser-sync')

const bs = browserSync.create()

const loadPlugins = require('gulp-load-plugins')

const plugins = loadPlugins()

const clean = () => {
  return del(['dist'])
}

const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Featuires',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/w_zce'
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/zce'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}

const style = () => {
  return src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(plugins.sass( { outputStyle: 'expanded' } ))
    .pipe(dest('dist'))
}

const script = () => {
  return src('src/assets/scripts/*.js',{ base: 'src' })
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('dist'))
}

const page = () => {
  return src('src/**/*.html', { base: 'src' })
    .pipe(plugins.swig({ data,defaults: { cache: false } }))
    .pipe(dest('dist'))
}

const image = () => {
  return src('src/assets/images/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

const font = () => {
  return src('src/assets/fonts/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

const extra = () => {
  return src('public/**', { base: 'public' })
    .pipe(dest('dist'))
}

const server = () => {
  
  watch('src/assets/styles/*.scss',style)
  watch('src/assets/scripts/*.js',script)
  watch('src/**/*.html',page)
  
  watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
  ],bs.reload)

  bs.init({
    notify: false,
    port: '2080',
    // open: false,// 是否自动打开浏览器
    files: 'dist/**',
    server: {
      baseDir: ['dist','src','public'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}

// 根据构建注释引用的资源全部合并到同一个文件当中
const useref = () => {
  return src('dist/*.html', { base: 'dist' })
    .pipe(plugins.useref({ searchPath: ['dist', '.'] }))
    // html js css 有三种不同类型的文件，需要对他们分别作不同的操作
    // pipe 转换流刘根据 if 指定的条件，去决定是否要去执行具体的转换流
    .pipe(plugins.if(/\.js$/,plugins.uglify())) // 压缩 js
    .pipe(plugins.if(/\.css$/,plugins.cleanCss())) // 压缩 css
    // 压缩 html
    .pipe(plugins.if(/\.html$/,plugins.htmlmin({ 
      collapseWhitespace: true, // 折叠所有的空白字
      // 折叠页面当中的style和script标签中内部的脚本
      minifyCSS: true,
      minifyJS: true
     })))
    .pipe(dest('release'))
}


const compiple = parallel(style, script, page)
// 上线之前执行的任务
const build = series(clean, parallel(compiple,  image, font, extra)) 

const develop = series(compiple,server)

module.exports = {
  build,
  server,
  develop,
  useref
}


```

**重新规划构建过程**
> 把 useref 任务相关的文件放在临时文件夹中 temp

```javascript

const { src, dest, parallel, series, watch } = require('gulp')

const del = require('del')

const browserSync = require('browser-sync')
// 创建一个开发服务器
const bs = browserSync.create()

const loadPlugins = require('gulp-load-plugins')

const plugins = loadPlugins()

// del是异步任务
const clean = () => {
  return del(['dist','temp'])
}

const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Featuires',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/w_zce'
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/zce'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}

const style = () => {
  // 为了不让原来的目录结构丢失，src可以指定一个选项参数 base，转换时的基准路径，让'src'后面的目录结构都保存下来
  return src('src/assets/styles/*.scss', { base: 'src' })
    .pipe(plugins.sass( { outputStyle: 'expanded' } )) // 指定css样式结束括号的位置
    .pipe(dest('temp'))
}

const script = () => {
  return src('src/assets/scripts/*.js',{ base: 'src' })
    // presets 指定 babel 指定转换插件
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('temp'))
}

const page = () => {
  // **/* 通配符匹配 src 任意子目录下的 html 文件
  return src('src/**/*.html', { base: 'src' })
    // data 指定传入模板的数据
    .pipe(plugins.swig({ data,defaults: { cache: false } }))
    .pipe(dest('temp'))
}

const image = () => {
  return src('src/assets/images/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

const font = () => {
  return src('src/assets/fonts/**', { base: 'src' })
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

const extra = () => {
  return src('public/**', { base: 'public' })
    .pipe(dest('dist'))
}

const server = () => {
  
  /**
   * 通过 gulp 的 watch 监听以下目录的变化来实现热更新
   *
   */
  watch('src/assets/styles/*.scss',style)
  watch('src/assets/scripts/*.js',script)
  watch('src/**/*.html',page)  // 模板引擎swig的热更新需要将 cache 设为 false
  /**
   * 对于图片、字体、一些额外文件在开发阶段编译没有太大意义，
   * 例如：图片实现的是无损压缩，并不影响最终在页面中的呈现，
   * 这就意味着，在开发阶段去监视更多的文件，做更多的任务，开销也就更多，
   * 而这个开销在开发阶段是没有意义的，只是在发布之前上线之前希望通过压缩一下，来减小一下上线的体积，从而提高网站运行的效率，
   * watch('src/assets/images/**',image)
   * watch('src/assets/fonts/**',font)
   * watch('public/**',extra)
   */
  // 所以我们通过监听这类文件的变化，自动更新浏览器，浏览器重新发起对这些文件的请求，而不是执行构建任务
  watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
  ],bs.reload)

  bs.init({
    notify: false,// 不弹出提示browserSync是否已连接
    port: '2080', // 配置端口
    // open: false,// 是否自动打开浏览器
    /** files
     * browserSync 启动后监听的路径通配符（你想要哪些文件发生改变过后，browserSync 自动更新浏览器）
     * 也可以通过在对应的构建任务后面加上 .pipe(bs.reload({ stream: true })) 的方式实现监听
     */
    files: 'dist/**',
    server: {
      // baseDir 可以传入一个数组，依次匹配，例如：如果在dist文件中匹配不到就匹配src，src匹配不到就匹配 public
      // 这么做的目的就是像压缩图片这一类任务是在发布上线之前执行的，那么图片就不能在dist文件中匹配到
      baseDir: ['temp','src','public'],
      routes: { // 指定单独的路由，匹配优先于 baseDir，
        '/node_modules': 'node_modules' // 这里先用这种办法指定库文件
      }
    }
  })
}

// 根据构建注释引用的资源全部合并到同一个文件当中
const useref = () => {
  return src('temp/*.html', { base: 'temp' })
    .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
    // html js css 有三种不同类型的文件，需要对他们分别作不同的操作
    // pipe 转换流刘根据 if 指定的条件，去决定是否要去执行具体的转换流
    .pipe(plugins.if(/\.js$/,plugins.uglify())) // 压缩 js
    .pipe(plugins.if(/\.css$/,plugins.cleanCss())) // 压缩 css
    // 压缩 html
    .pipe(plugins.if(/\.html$/,plugins.htmlmin({ 
      collapseWhitespace: true, // 折叠所有的空白字符
      // 折叠页面当中的style和script标签中内部的脚本
      minifyCSS: true,
      minifyJS: true
     })))
    .pipe(dest('dist'))
}


const compiple = parallel(style, script, page)
// 上线之前执行的任务
const build = series(
  clean, 
  parallel(
    series(compiple, useref),
    image,
    font,
    extra)) 

const develop = series(compiple,server)

module.exports = {
  build,
  server,
  develop,
  useref
}


```

**封装工作流**
>   针对 gulpfile 的复用，我们可以通过代码段的方式去使用，弊端就是这个 gulpfile 会散落在各个项目当中，不利于整体维护，所以需要提取一个可复用的自动化构建工作流

> Gulpfile + Gulp = 构建工作流

从上面我们创建的自动化构建工作流，提取到新项目中，封装成工作流

```cmd

npm init 初始化npm项目

├─ lib
│  └─ index.js -- 项目入口文件，将 gulpfile 挪到这
├─ .gitignore -- 忽略文件
├─ .npmrc -- npm 配置文件
├─ .travis.yml -- 可持续集成(CI)工具
├─ CHANGELOG.md -- 更新日志
├─ LICENSE -- 开源协议
├─ package.json -- 将原项目的 devDependencies 放到这里的 dependencies
├─ README.md
```

> 使用：在原始项目中删除 package.json 的devDependencies以及 node_modules 依赖

> 正常的流程是把 rhs-pages 发布到 npm仓库中，然后在 原始项目中安装这个 npm模块，但是在开发阶段需要在本地调试当，所以我们使用 yarn link 链接到全局，然后项目通过 yarn link 'rhs-pages' 链接到 node_modules

```javascript
// 在原来的gulpfile.js

module.exports = require('rhs-pages') // 导出  导入的内容

// 执行 yarn build 会提示 gulp不存在，实际上如果我们把包发布到了 Npm 是不存在这个问题的，调试阶段我们还是先把gulp装一下
 // yarn add gulp
 // 此时也会报一个错，我们当初在 gulpfile 传入 data 的时候 引用了 'packjson.json' 文件，这时候的路径是不对的
 // 在实际使用场景中，data 是不一样的，在 gulpfile 里写死是不合理的
 // 这时候我们有一种约定大于配置的方式去解决，我们可以在项目当中抽象一个配置文件，然后在 gulpfile 读取一下配置文件
```

> 在实际使用场景中，data 是不一样的，在 gulpfile 里写死是不合理的

> 这时候我们有一种约定大于配置的方式去解决，我们可以在项目当中抽象一个配置文件，传入那些不应该在公共模块出现的东西，然后在 gulpfile 读取一下配置文件

```javascript

// zce-gulp-demo/pages.config.js

module.exports = {
  data: {
    menus: [
      {
        name: 'Home',
        icon: 'aperture',
        link: 'index.html'
      },
      {
        name: 'Featuires',
        link: 'features.html'
      },
      {
        name: 'About',
        link: 'about.html'
      },
      {
        name: 'Contact',
        link: '#',
        children: [
          {
            name: 'Twitter',
            link: 'https://twitter.com/w_zce'
          },
          {
            name: 'About',
            link: 'https://weibo.com/zceme'
          },
          {
            name: 'divider'
          },
          {
            name: 'About',
            link: 'https://github.com/zce'
          }
        ]
      }
    ],
    pkg: require('./package.json'),
    date: new Date()
  }
}

```

> 以下配置是读取抽象的配置文件和需要修改的地方
```javascript
// rhs-pages/lib/index.js

// 返回当前命令行所在的工作目录
const cwd = process.cwd()

let config = {
  // default config
}

// 尝试读取配置文件（也有可能读取不到）
try {
  const loadConfig = require(`${cwd}/pages.config.js`)
  config = Object.assign({}, config, loadConfig)
} catch (e) {}


const script = () => {
  return (
    src('src/assets/scripts/*.js', { base: 'src' })
      // 原本的 presets 是指定当前项目目录依赖里的 '@babel/preset-env'，在使用的项目里是不一定能找到的，使用  require('@babel/preset-env') 会在执行文件的目录以此寻找 '@babel/preset-env'
      .pipe(plugins.babel({ presets: [require('@babel/preset-env')] }))
      .pipe(dest('temp'))
  )
}

const page = () => {
  // **/* 通配符匹配 src 任意子目录下的 html 文件
  return (
    src('src/**/*.html', { base: 'src' })
      // data 指定传入模板的数据
      .pipe(plugins.swig({ data: config.data, defaults: { cache: false } }))
      .pipe(dest('temp'))
  )
}

```

**抽象路径配置**
> 对于在代码里写死的一些路径，这些路径在使用项目中实际上是一种约定，约定固然好，当然提供可以配置的的能力也很重要

```javascript
// rhs-pages/lib/index.js

const { src, dest, parallel, series, watch } = require('gulp')

const del = require('del')

const browserSync = require('browser-sync')

const bs = browserSync.create()

const loadPlugins = require('gulp-load-plugins')

const plugins = loadPlugins()

 
// 返回当前命令行所在的工作目录
const cwd = process.cwd()

let config = {
  // default config
  build: {
    src: 'src',
    dist: 'dist',
    temp: 'temp',
    public: 'public',
    paths: {
      styles: 'assets/styles/*.scss',
      scripts: 'assets/scripts/*.js',
      pages: '*.html',
      images: 'assets/images/**',
      fonts: 'assets/fonts/**',
    }
  }
}

const clean = () => {
  return del([config.build.dist, config.build.temp])
}

// 尝试读取配置文件（也有可能读取不到）
try {
  const loadConfig = require(`${cwd}/pages.config.js`)
  config = Object.assign({}, config, loadConfig)
} catch (e) {}

const style = () => {
  // cwd 参数指定 从指定的 src 位置读取
  return src(config.build.paths.styles, { base: config.build.src, cwd: config.build.src })
    .pipe(plugins.sass({ outputStyle: 'expanded' }))
    .pipe(dest(config.build.temp))
    .pipe(bs.reload({ stream: true }))
}

const script = () => {
  return (
    src(config.build.paths.scripts, { base: config.build.src, cwd: config.build.src })
      .pipe(plugins.babel({ presets: [require('@babel/preset-env')] }))
      .pipe(dest(config.build.temp))
      .pipe(bs.reload({ stream: true }))
  )
}

const page = () => {
  return (
    src(config.build.paths.pages, { base: config.build.src, cwd: config.build.src })
      .pipe(plugins.swig({ data: config.data, defaults: { cache: false } }))
      .pipe(dest(config.build.temp))
      .pipe(bs.reload({ stream: true }))
  )
}

const image = () => {
  return src(config.build.paths.images, { base: config.build.src, cwd: config.build.src })
    .pipe(plugins.imagemin())
    .pipe(dest(config.build.dist))
}

const font = () => {
  return src(config.build.paths.fonts, { base: config.build.src, cwd: config.build.src })
    .pipe(plugins.imagemin())
    .pipe(dest(config.build.dist))
}

const extra = () => {
  return src('**', { base: config.build.public, cwd: config.build.public }).pipe(dest(config.build.dist))
}

const server = () => {
  watch(config.build.paths.styles,{ cwd: config.build.src }, style)
  watch(config.build.paths.scripts,{ cwd: config.build.src }, script)
  watch(config.build.paths.pages,{ cwd: config.build.src }, page)
  watch([config.build.paths.images, config.build.paths.fonts],{ cwd: config.build.src }, bs.reload)
  watch('**',{ cwd: config.build.public }, bs.reload)

  bs.init({
    notify: false,
    port: '2080',
    server: {
      baseDir: [config.build.temp, config.build.dist, config.build.public],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}

const useref = () => {
  return (
    src(config.build.paths.pages, { base: config.build.temp, cwd: config.build.src })
      .pipe(plugins.useref({ searchPath: [config.build.temp, '.'] }))
      .pipe(plugins.if(/\.js$/, plugins.uglify())) // js
      .pipe(plugins.if(/\.css$/, plugins.cleanCss())) // css
      .pipe(
        plugins.if(
          /\.html$/,
          plugins.htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true
          })
        )
      )
      .pipe(dest(config.build.dist))
  )
}

const compiple = parallel(style, script, page)
const build = series(
  clean,
  parallel(series(compiple, useref), image, font, extra)
)

const develop = series(compiple, server)

module.exports = {
  build,
  server,
  develop,
  useref
}


```

**包装 gulp cli**

> 还可以做更多的操作让使用的时候更加方便

> gulpfile对于我们使用项目的价值是把 rhs-pages 里面提供的工作流任务导出去，然后我们才可以通过 gulp 去运行它，我希望是在根目录下没有这个gulpfile的文件也可以执行

> gulp-cli 提供的命令行参数可以让我们指定gulpfile所在的路径 

> yarn build --gulpfile ./node_modules/rhs-pages/lib/index.js  是可以执行的

> 但是这有个小问题，指定了gulpfile路径之后，gulp会把工作目录同时指向该路径，就不会把当前项目所在的根目录作为工作目录了，这时候又可以指定工作目录使其正常运行

> yarn build --gulpfile ./node_modules/rhs-pages/lib/index.js  --cwd .

> 但这样要传递的参数就很复杂了，这时候我们在 rhs-pages 中也提供一个 cli ，这个 cli 里面我们自动传递这些参数，然后在内部去调 gulp-cli 提供的可执行程序，这样我们在外界使用的时候就不用再去使用 gulp 了，我们就相当于把 gulp 完全包装到 rhs-pages 当中了

> 在 rhs-pages 根目录创建 bin/rhs-pages.js 作为 cli 入口文件，入口文件名一般用项目名

项目的 模块代码一般放在 lib 目录，cli 代码一般放在 bin 目录
```javascript
// bin/rhs-pages.js

#!/usr/bin/env node

process.argv.push('--cwd')
process.argv.push(process.cwd()) // 告诉 gulp-cli 通过这个 gulp 工作流去工作的时候，它的工作目录，就是当前命令行所在的目录
process.argv.push('--gulpfile')
process.argv.push(require.resolve('..')) // 传递 gulpfile 所在目录， ".." 会自动查找 package.json 中的 main 字段指定的参数

require('gulp/bin/gulp') // 自动执行 gulp-cli 前面的参数就相当于手工传入了 gulp-cli，gulp-cli 就可以把我们刚刚提供的gulpfile工作起来了

```
> 在 package.json 中添加 "bin":"bin/rhs-pages.js",

```json
// package.json

"bin": "bin/rhs-pages.js",

// 也可以给命令起别名，只是容易起冲突
"bin": {
    "rp": "bin/rhs-pages.js",
}

```

> 这时可以重新链接 rhs-pages 到全局 yarn unlink && yarn link

> 切换到 zce-gulp-demo 中执行命令 rhs-pages build


**发布并使用模块**

> 在发布之前，package.json 中的添加 lib 和 bin

```json
  "files": [
    "lib",
    "bin"
  ],
  
  // 如果 npm 使用了淘宝镜像源，就需要配置一下 npm pubish 的发布源
  "publishConfig": {
    "registry": "https://registry.npmjs.org"
  }
```

> npm login 登录

> 注意 登录不可以使用淘宝镜像源 
```cmd
npm install -g nrm 
nrm use taobao
nrm use npm
```

或

```cmd
// .npmrc
registry = https://registry.npm.taobao.org/
# registry = https://registry.npmjs.org/

切换源
```

> npm publish 发布，如果提示错误，注意是否是首次注册没有验证邮箱

> 项目中安装 yarn rhs-pages --dev ，注意：npm同步到淘宝镜像源时间差的问题

> yarn rhs-pages build

> 更加完善的做法是把配置文件的读取，提取到单独的模块当中

## FIS
>   是百度团前端团队推出的构建系统，开源过后在国内快速流行，相对于前两种构建系统这种微内核的特点，FIS更像捆绑套餐，把我们在项目当中一些典型的需求都集成在内部了，例如在 FIS 当中可以很轻松的处理 资源加载、模块化开发、代码部署、甚至是性能优化，总体来说，FIS更适合初学者，Grunt、Gulp更灵活

- FIS 已经退出历史舞台，我们学习它的目的是能给我们带来一些思考

**基本使用**

```cmd
// fis3相对于之前的版本有很大的变化，所以起了个fis3的名字
yarn global add fis3
```

> 简单的项目里包含了 scss 和 es6
```
fis-sample
├─ css
│  └─ style.scss
├─ img
│  └─ logo.png
├─ index.html
└─ js
   └─ app.js

```

> 资源定位 是 fis 的核心能力

```
fis3 release -d output
--前端开发者不再关心开发出来的资源部署上线过后的目录结构，我们只需要在开发阶段使用相对路径来引用资源，通过fis构建过后的结果会把资源引用路径变成绝对路径
```

```
// fis.js
// 指定输出的目录到 assets 目录
fis.match('*.{js,scss,png}', {
  release: '/assets/$0'
})

// 通过 fis 提供的资源定位能力，大大的提高了代码的可移植性
```

> FIS 编译与压缩

```
fis.match('*.{js,scss,png}', {
  release: '/assets/$0'
})

// 转换 scss
// yarn add fis-paser-node-sass --dev
fis.match('**/*.scss',{
  rExt: '.css', // 修改扩展名
  parser: fis.plugin('node-sass'),
  optimizer: fis.plugin('clean-css') // 压缩
})

// 转换 js
// yarn add fis-paser-babel-6.x --dev
fis.match('**/*.js',{
  parser: fis.plugin('babel-6.x'),
  optimizer: fis.plugin('uglify-js') // 压缩
})
```