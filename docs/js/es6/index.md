# ECMAScript新特性

## 概述

ECMAScript 也是一门脚本语言，通常我们会把它当作 JS 的标准化规范。实际上，JS 是 ES 的扩展语言，因为在 ES 当中，只是提供了最基本的语法，而 JS 实现了 ES 的标准，并且在这基础之上做了一些扩展，使得我们可以在浏览器当中操作 DOM 和 BOM ，在 Node 当中做一些如读写文件一样的操作，总得来说，

在浏览器当中： JS = ES + Web APIs（DOM + BOM）

在 Node 环境当中： JS = ES + Node APIs（fs + net + etc. 等一系列API）


JS 中语言本身指的就是 ES，随着这些年 Web 这种应用模式深入的发展，从 2015 年开始，ES 就保持着，每年一个大版本的迭代，伴随着这些新版本的迭代，很多新特性陆续出现，这也就导致，现如今 JS 这门语言的本身变得越来越高级，越来越便捷

目前为止，ES 发布的所有版本如下：


名称 | 标准版本 | 发行时间
---|---|---
ES2021 | 12 | 2021年6月
ES2020 | 11 | 2020年6月
ES2019 | 10 | 2019年6月
ES2018 | 9 | 2018年6月
ES2017 | 8 | 2017年6月
ES2016 | 7 | 2016年6月
**ES2015** | **6** | **2015年6月**
ES5.1 | 5.1 | 2011年6月
ES5 | 5 | 2009年12月
ES4 | 4 | 被放弃
ES3 | 3 | 1999年12月
ES2 | 2 | 1998年6月
ES1 | 1 | 1997年6月

其中 ES2015 值得我们去了解的内容有很多，因为在这个版本当中，相对特殊，上一个版本 ES5 发布过后，经历6年时间才被完全的标准化，而且这6年的时间也是 Web 发展的黄金时间，所以在这个版本当中包含了很多颠覆性的功能，也正是因为 ES2015 迭代的时间太长，导致发布的内容过多，所以从之后的版本开始，ES 的发布会变得更加频繁，也更符合当下互联网小步快跑的精神，而且从 ES2015 过后，ES 就觉得不再按照版本号去命名，而是用发行的年份，由于这样一个决定是在 ES2015 诞生的过程中产生的，所以当时很多人已经习惯了 ES6 这样一个名称，所以对于 ES2015 就出现了，有人称之为 ES6 的情况。随着 ES 开始稳步的迭代发展，市面上主流的运行环境也都纷纷跟进，已经逐步开始支持这些最新的特性，所以对于我们使用 JS 的开发者而言，学习这些新特性，很有必要



# ES2015
>   ES6 一般泛指从 5.1 以后所有的新版本

**新特性**

-   解决原有语法上的一些问题或者不足
-   对原有语法进行增强
-   全新的对象、全新的方法、全新的功能
-   全新的数据类型和数据结构


调试环境
```cmd

nodemon 运行 js 脚本可以实时更新

```


## let、const 与块级作用域

-   全局作用域
-   函数作用域
-   块级作用域（ES2015 新增）

>   块级作用域指的是用一对 `{}` 所包裹起来的范围，例如：

```javascript

if(true){
    // 块级作用域
    console.log(1)
}

for(var i = 0;i < 10; i++){
    // 块级作用域
    console.log(i)
}

```

没有块级作用域以前：

```javascript

if(true){
    var foo = 'z'
}
console.log(foo) // 在 if 外面也可以访问，在复杂代码中是非常不利的

```

>   通过 let 关键字声明块级作用域变量，变量不会声明提升，修复了 var 的 bug

```javascript

if(true){
    let foo = 'z'
}
console.log(foo) // foo 无法访问

// 有了块级作用域，嵌套循环就可以用同样的计数器，当然，即便如此，也不建议使用同样的计数器，因为这样不利于我们后期理解代码
for(let i=0;i<3;i++){
    for(let i=0;i<3;i++){
        console.log(i)
    }
}


// 我们再来看一个闭包的典型应用场景
// 没有块级作用域以前，我们在 for 循环里需要用闭包来摆脱全局作用域的影响
var elements = [{}, {}, {}]
for(var i=0;i<elements.length;i++){
    elements[i].onclick = (function(i){
        return function(){
            console.log(i)
        }
    })(i)
}

// 有了块级作用域，我们就可以很方便的实现，当然块级作用域内部也是使用的闭包的机制
var elements = [{}, {}, {}]
for(let i=0;i<elements.length;i++){
    elements[i].onclick = function(){
            console.log(i)
    }
}

// 当然 for 循环体当中本身也有特殊之处，那就是有两层的作用域
for(let i = 0;i < 3;i++){
    let i = 'foo'
    console.log(i) // 不冲突
}

//let i = 0

//if(i<3){
//   let i = 'foo'
//    console.log(i) // 不冲突
//}

//i++

```

### const
>   常量/恒量，在 let 的基础之上，多了只读的特性，变量一旦声明，就不允许修改

```javascript

const name = 'xiaoming' // 必须在声明的同时赋值
//name = 'xiaohong' // 不能再次赋值

```

>   值得注意的是，const 声明的常量不能被修改指的是，内存地址不能被修改

```javascript

const obj = {}
obj.name = 'xiaoming' // 可以修改这块内存当中的属性

//obj = {} // 不能指向新的内存空间

```

>   最佳实践：不用 var，主用 const，配合 let，主用 const 的原因是更明确我们使用的变量会不会被修改

## 解构

**数组解构**
```javascript
// 提取数组成员
const arr = [100, 200, 300]

const foo = arr[0]
const bar = arr[1]
const baz = arr[2]
console.log(foo,bar,baz)

// 使用解构提取
const [foo,bar,baz] = arr
console.log(foo,bar,baz)

// 如果要提取当中一个，要确保我们解构的位置是一致的，根据需要保留逗号
const [,,baz] = arr
console.log(baz)

// 提取剩余成员，...表示从当前位置起，剩余的所有成员，并且这种用法只能在解构位置的最后一个成员位置的使用
const [foo, ...rest] = arr
console.log(rest)

// 如果解构成员的个数小于被解构数组的个数，会按照从前到后顺序提取，多出来的成员不会被提取
const [foo] = arr
console.log(rest)

// 反之，提取到的就是 undefiend
const [foo,bar,baz,more] = arr
console.log(more)

// 当然我们可以在提取时给定默认值，假如没有提取到时，就会使用对应的默认值
const [foo,bar,baz='default val',more='123'] = arr
console.log(more)


// 使用场景
const path = '/foo/bar/baz'
// const tmp = path.split('/')
// const rootdir = tmp[1]

const [,rootdir] = path.split('/')

```

**对象解构**

```javascript

// 对象的解构不能像数组那样使用下标去匹配，解构时给定的属性名就相当于从被解构对象中提取对应的属性
const obj = { name:'zce', age: 18 }

const { name } = obj
console.log(name)

// 重命名
const name = 'tom'
//const { name } = obj // 已存在name变量，而又必须使用name提取obj当中的name

const { name: objname } = obj // 使用重命名解决不可避免的问题
console.log(objname)

//const { name: objname = 'jack' } = obj // 还可以设置默认值



// 使用场景
const { log } = console
log('111')
log('222')
log('333')

```


## 模板字符串

```javascript

const str = `hello es2015, this is a \`string\`` // 如果内容当中需要用反引号，可以用 \ 转义

// 换行
const str = `hello es2015,

this is a \`string\``

// 插值表达式
const name = 'tom'
const msg = `hey,${name}---${1 + 2}---${Math.random()}`

```

**带标签的模板字符串**
```javascript

const name = 'tom'
const gender = true
//标签函数
function myTagFunc(strings, name, gender){
    console.log(strings) // 接收到的是模板字符串中，使用插值分割后的所有静态内容组成的数组
    
    console.log(name,gender) // 还可以接收所有的插值
    
    //return '123' // 返回值最终是接收该模板字符串得到的值
    
    const sex = gender ? 'man':'woman'
    
    return strings[0]+name+strings[1]+sex // 拼接加工后的数据返回
}

const result = myTagFunc`hey，${name} is a ${gender}`
console.log(result) // hey，tom is a man
```

## 字符串扩展方法

>   判断字符串是否包含指定的内容
-   includes()
-   startsWith()
-   endsWith()

```javascript

const message = 'Error: foo is not defined.'
console.log(
    message.startsWith(message) // 开头是否包含
    message.endsWith(message) // 结尾是否包含
    message.includes(message) // 当中是否包含
)

```


## 参数默认值

```javascript

// 以往设置默认值
function foo(enable){
    // enable = enable || true // 短路语句有时并不好用，假如传入的就是false 也会得到 true
    enable = enable === undefiend ? true:enable
    
    console.log(enable)
}


// 参数默认值
// 当传入的值是 undefiend 或者 没有传入时，会使用默认值
function foo(param,enable=true){ // 注意：如果有多个参数，带有默认值的参数必须放在最后
    
    console.log(enable)
}

```

##  rest参数

**剩余参数**
```javascript

// 以往接收未知个数的参数
function foo(){
    console.log(arguments)
}

// 使用 ...操作符
// 注意：如果有多个参数，剩余参数必须放在最后，而且只能使用一次
function foo(...args){
    // 加上...后，这个形参会以数组的形式收去接收从当前的这个位置开始，往后的所有参数
    console.log(args)
}

```


**展开数组 spread**

```javascript

const arr = ['foo','bar','baz']

// 方法1
console.log(
    arr[0],
    arr[1],
    arr[2]
)

// 方法2
// apply 可以以数组的形式去接收我们的实参列表
console.log.apply(console,arr)

// 方法3
// 使用 ... 展开数组
console.log(...arr)

```


## 箭头函数

**语法：**
```javascript

function inc(n,m){
    console.log('inc invoked')
    return n + 1
}

// 使用箭头函数声明函数
const inc = ( n, m ) => {
    console.log('inc invoked')
    return n + 1
}

// 如果只有一个参数，可以省略括号
const inc = n => {
    console.log('inc invoked')
    return n + 1
}

// 如果函数体只有1句表达式，它的执行结果就会作为这个函数的返回值返回
const inc = n => n+1


// 极大简化了回调函数的编写
const arr = [1, 2, 3, 4, 5, 6, 7]

arr.filter(function (item){
    return item % 2
})

arr.filter( item => item % 2 )


```

**箭头函数与 this**
>    不会改变 this 的指向

```javascript

// 普通函数中，this 始终会指向调用这个函数的对象
const person = {
    name:'tom',
    sayHi:function(){
        console.log(`hi, my name is ${this.name}`)
    }
}

person.sayHi() // tom



// 箭头函数当中没有 this 的机制，所以不会改变 this 的指向，也就说在箭头函数的外面 this  是什么在里面拿到的 this 就是什么
const person = {
    name:'tom',
    sayHi:() => {
        console.log(`hi, my name is ${this.name}`)
    }
}

person.sayHi() // undefined    全局内没有 name



const person = {
    name:'tom',
    sayHiAsync:function() {
        setTimeout(function(){
            console.log(`hi, my name is ${this.name}`)
        }, 1000)
    }
}

// 如果 setTimeout() 中传入的是普通函数表达式，那么这个函数内部就没有办法拿到当前作用域的this，因为这个函数最终会被放到全局对象上被调用，拿到的是全局对象
person.sayHiAsync() // undefined


// 使用闭包的解决方案
const person = {
    name:'tom',
    sayHiAsync:function() {
        const _this = this
        setTimeout(function(){
            console.log(`hi, my name is ${ _this.name }`)
        }, 1000)
    }
}
person.sayHiAsync() // tom


// 使用箭头函数 
const person = {
    name:'tom',
    sayHiAsync:function() {
        setTimeout(() => {
            console.log(`hi, my name is ${ this.name }`)
        }, 1000)
    }
}
person.sayHiAsync() // tom



```


## 对象字面量的增强

```javascript
const bar = '345'

// 以往的对象字面量
const obj = {
    foo:123,
    bar:'345',
    method1:function(){
        console.log('methods111')
    }
}

// 增强的对象字面量
const obj = {
    foo:123,
    bar,
    method1(){
        console.log('methods111')
        console.log(this) // 需要注意的是，这种方法的背后就是普通的 function ，也就是说，如果通过对象调用这个方法，this就会指向这个对象
    },
    [Math.random()]:123 // 计算属性名（动态属性名）
}

```

## 对象扩展方法

**Object.assign()**
>   将多个源对象中的属性复制到一个目标对象中，如果对象之间有相同的属性，那么源对象中的属性会覆盖掉目标对象中的属性

```javascript

const source1 = {
    a:123,
    b:123
}

const target = {
    a:456,
    c:456
}

const result = Object.assign(target, source1)

console.log( target ) // { a:123, c:456, b:123 }
console.log( result === target ) // true

```

**Object.is()**

```javascript

// 以往比较两个值

 0 == false // true  == 具有隐式转换
 0 === false // false
 +0 === -0 // true // 严格比较不能比较 +0 和 -0
 NaN === NaN // false // 非数有无限种可能，所以不等于自身
 
 Object.is(+0, -0) // false 可以比较
 Object.is(NaN, NaN) // true 可以比较
 // 不过实际场景中很少会用到这个方法，在大多数情况下还是推荐使用 ===


```


## Proxy
>   代理对象

如果我们要监视某个对象的属性读写，我们可以使用 ES5所提供的 Object.defineProperty，这样我们就能捕获到对象中属性的读写过程。在Vue 3.0 之前就是通过这种方法实现的数据响应，从而完成双向数据绑定

ES2015 全新设计了 Proxy 类型，专门用来为对象设置访问代理器的，所谓代理就好像是门卫，不管你是要进去拿东西或者进去放东西，都需要进过门卫，通过 proxy 就可以轻松监视到对象的读写过程，相比 Object.defineProperty，Proxy 的功能更为强大，使用起来也更为方便

```javascript

const person = {
    name:'ace',
    age:20
}

// person：需要代理目标对象
// 第二个参数是代理的处理对象 
const personProxy = new Proxy(person,{

    // target:代理的目标对象
    // property:外部所访问的属性名
    // return:将会作为外部访问这个属性所得到的结果
    get(target, property){
        return property in target ? target[property] : 'default val'
    },
    // target:代理的目标对象
    // property:要写入的属性名称
    // value:要写入的属性值
    set(target, property, value){
        if (property === 'age') {
            if (!Number.isInteger(value)) {
                throw new TypeError(`${value} is not an int`)
            }
        }
        
        target[property] = value
    }
})

```

**Proxy VS defineProperty**

-   defineProperty 只能监视属性的读写，proxy 可以监听到更多操作
-   proxy 更好的支持数组对象的监视
    -   以往 defineProperty 对数组的监视最常见的方式是通过重写数组的操作方法，覆盖数组原型上的方法，以此来劫持对应的方法劫持的过程

```javascript

const list = []

const listProxy = new Proxy(list,{
    set(tatget, property, value){
        console.log('set',property,value)
        target[property] = value
        return true // 表示设置成功
    }
})

listProxy.push(100)

```

-   Proxy 是以非侵入的方式监管了对象的读写
    -   已经定义好的对象，我们不需要对这个对象本身做任何的操作就可以监视到对象内部成员的读写，而 defineProperty 要求必须通过特定的方式，单独去定义对象当中那些要被监视的属性，对于一个已经存在的对象，我们要向监视它的属性需要做很多额外的操作


## Reflect
>   静态类，不能通过 new 的方式构建一个实例对象，Reflect 内部封装了一系列对对象的底层操作

Reflect封装了 14个静态方法，其中一个被废弃掉了，剩下的13个方法的方法名，和 Proxy 处理对象方法成员是完全一致的，其实这些方法就是 Proxy 处理对象那些方法的默认实现

```javascript

const obj = {
    foo:'123',
    bar:'456'
}

const proxy = new Proxy(obj,{
    get (target,value) {
        console.log('watch logic~)
        
        return Reflect.get(target, property)
    }
})

console.log(proxy.foo)

```


**那么 Reflect 价值在哪里**
>   统一提供了一套用于操作对象的 API

```javascript

const obj = {
    name: 'zce',
    age: 18
}

// 零散的操作方式
console.log('name' in obj)
console.log(delete obj[age])
console.log(Object.keys(obj))

// 统一的操作方式
console.log(Reflect.has(obj,'name'))
console.log(Reflect.deleteProperty(obj,'age'))
console.log(Reflect.ownKeys(obj))

// ESMAScrip 官方希望通过一段时间的过渡后，渐渐废弃掉原来的方法


```


## Promise
>   一种更优的异步编程统一方案。

为了解决大量回调函数嵌套的问题（回调地狱），CommonJS社区提出了 Promise 的规范，在 ES2015中被标准化，成为语言规范



## class 类

在此之前，ECMAScript 都是通过定义函数以及函数的原型对象来实现的类型

```javascript

// 定义一个 Person 函数作为这个类型的构造函数
function Person (name) {
    this.name = name // 通过 this 访问当前的实例对象
}

// 如果要在这个类型所有的实例之间去共享一些成员，我们可以借助于函数对象的 prototype(原型) 去实现
Person.prototype.say = function(){
    console.log(`hi, my name is ${this.name}`)
}

```

ECMAScript2015开始可以通过 class 关键词去声明一个类型，这种独立定义类型的语法，相对容易更加理解，结构更加清晰
```javascript

class Person{
    // 当前类型的构造函数
    constructor(name){
        this.name = name // 通过 this 访问当前的实例对象
    }
    // 实例方法
    say(){
        console.log(`hi, my name is ${this.name}`)
    }
}

const p = new Person('tom')
p.say()

```

**静态成员**


>   在我们类型当中的方法，一般分为实例方法和静态方法

-   实例方法：需要通过这类型构造的实例对象去调用
-   静态方法：通过类型本身调用

以前我们去实现静态方法是直接在构造函数对象上挂载方法来实现，ECMAScript2015 中新增添加静态成员的 `static` 关键字
```javascript

class Person{
    // 当前类型的构造函数
    constructor(name){
        this.name = name // 通过 this 访问当前的实例对象
    }
    // 实例方法
    say(){
        console.log(`hi, my name is ${this.name}`)
    }
    // 这里需要注意：我们的静态方法是挂载到类型上面的，所以说在静态方法内部，它的 this 就不会指向某一个实例对象，而是当前的类型
    static create (name){
        return new Person(name)
    }
}

const tom = Person.create('tom')
tom.say()


```
## 类的继承
继承是面向对象中非常重要的特性，通过继承我们就可以抽象出来相似类型之间，重复的地方，在ES2015之前，我们大多数都是用原型的方式去实现继承，而在ES2015中，实现了一个专门用于继承的关键词 `entends`

```javascript

class Person{
    // 当前类型的构造函数
    constructor(name){
        this.name = name // 通过 this 访问当前的实例对象
    }
    // 实例方法
    say(){
        console.log(`hi, my name is ${this.name}`)
    }

}

// 实现继承，就会拥有Person中所有的成员
class Student extends Person{

    constructor(name,number){
        // name 参数在父类中也要用到，所以这里需要用到 super 对象
        // super 始终指向父类，调用它就是调用了父类的构造函数
        super(name)
    }
    
    //定义一些这个类型特有的成员
    hello(){
        // 在这个方法中同样可以通过 super对象去访问父类的成员
        super.say()
        console.log(`hi, my school number is ${this.number}`)
    }
}

const s = new Student('jack', '100')
s.hello()


```


## Set 数据结构
>   Set是一个集合，与传统的数组非常类似，不过 Set 内部的成员不允许重复

```javascript

const s = new Set()
s.add(1 // 返回对象本身，可以链式调用 s.add(2).s.add(3)

// 通过 for of 遍历
for(let i of s){
    console.log(i)
}

s.size // 集合长度
s.has(100) // 判断是否存在某个值，返回 true/false
s.delete(3) // 删除某个值，返回 true/false
s.clear() // 清除集合中的全部内容
...

```

**使用场景**

去重

```javascript

const arr = [1, 2, 3, 4, 1]
const result = new Set(arr)
console.log(result)

//转换回数组
const result = Array.from(new Set(arr))
const result = [...new Set(arr)]

```


## Map 数据结构
>   这种结构与对象非常类似，本质都是键值对集合，它们最大的区别是 Map 可以使用任意类型的数据作为键，而对象只能使用字符串作为键

```javascript

const obj = {}
obj[true] = 'value'
obj[123] = 'value'
obj[{ a:1 }] = 'value'

// 通过 Object.keys 获取对象的所有键
// 发现得到的都是字符串类型的键（如果给对象添加的键不是字符串类型，就会被内部toString()的结果作为键）

console.log(Object.keys(obj)) // ['true','123',[object Object]]
// 假定我们要对象去存储每个学生的成绩，那如果我们用学生对象作为键，不管对象当中的属性有什么不同，那每个对象 toString() 后的结果都是一样的，这就是问题

```

ES2015中 Map 结构就是为了解决这个问题的，Map 才是严格意义上的键值对集合，用来映射两个任意类型的对应关系

```javascript

const m = new Map()
const tom = { name:'tom' }
m.set(tom, 90)

m.get(tom) // 得到某个数据
s.has(tom) // 判断是否存在某个值，返回 true/false
m.delete(tom) // 删除某个值，返回 true/false
m.clear() // 清除集合中的全部内容
...

m.forEach((value,key)=>{
    console.log(value,key)
})


```


## Symbol
>   一种全新的原始数据类型，表示一个独一无二的值

在ECMAScript2015之前，对象的属性都是字符串，而字符串是有可能会重复的，如果重复的话就会产生冲突

```javascript

// shared.js ========================
const cache = {}// 定义一个存放数据缓存的对象，我们约定这个对象全局共享


// a.js ==========================
cache['foo'] = Math.random() // 尝试往这个缓存当中放入一个内容


// b.js ==========================
cache['foo'] = Math.random() // 如果我们不知道之前存在了 'foo' 这个键，也去往这个键存放一个东西，这时就会产生冲突

```

>   事实情况是，现如今，我们会大量使用到第三方模块，很多时候都会需要扩展第三方模块中提供的对象，那此时你是不知道这个对象当中是否会存在指定的一个键，如果你贸贸然去扩展，就有可能产生冲突的问题，那以前解决这种问题最好的方式就是，约定键名
```javascript

// a.js ==========================
cache['a_foo'] = Math.random() // a文件中以a开头

// b.js ==========================
cache['b_foo'] = Math.random() // b文件中以b开头

// 这样就不会产生冲突了，但是约定的方式只是规避了问题，并不是彻底解决了这个问题，如果在这样一个过程中有人不遵守这个约定，那这个问题仍然会存在

```

>   ES2015为了解决这种类型的问题，提供了一种全新的原始数据类型 `Symbol` 表示一个独一无二的值

```javascript

const s = Symbol()
console.log(typeof s) // symbol


// 这种类型最大的特点就是 独一无二，也就是说我们通过Symbol 创建的每一个值都是唯一的，它永远不会重复
console.log(
    Symbol() === Symbol()
)// false


// 考虑到在开发过程中的调试，Symbol 函数允许我们传入一个字符串作为这个值的描述文本，那这样的话对于我们多次使用 Symbol 的情况，就可以在控制台当中区分出来对应的是哪个 Symbol

```

>   从ES2015开始，对象就可以直接去使用 `Symbol` 类型的值作为属性名，也就是说现在我们对象的属性名可以是两种类型，分别是 `String`和 `Symbol`
```javascript

const obj = {
    [Symbol()]:123
}
console.log(obj)
// 另外，Symbol 除了可以用来避免对象属性名重复产生的问题
// 我们还可以借助于这种类型的特点，去模拟实现对象的私有成员

// a.js ===============================
// 以前我们去定义私有成员都是靠约定，例如我们约定用下划线 _ 开头，就表示是私有成员，我们约定外界不允许访问对象当中下划线 _ 开头的成员
// 有了 symbol 之后，我们就可以用 symbol 来创建私有成员的属性名了

const name = Symbol()
const person = {
    [name]: 'zce',
    say() {
        console.log(this[name])
    }
}

```
>   目前这种类型的值，最主要的作用就是为对象添加独一无二的属性名标识符

截止到 ES2019 标准，ES当中一共定义了 6 种原始数据类型 + Object = 7 种，在未来会新增一种 `BigInt` 类型用于存放更长的数据，预计下一个版本被证实标准化


>   symbol 在使用上，还有值得我们注意的地方


```javascript

// 唯一性
console.log(
    // 每次通过 symbol函数创建的值，一定是一个唯一的值，不管我们传入的描述文本是不是相同的，每次去调用得到的结果都是全新的值
    // Symbol() === Symbol() //false
    Symbol('foo') === Symbol('foo') //false 
)

// 如果我们要去复用一个相同的 smbol值，我们可以使用全局变量的方式去实现，或者使用 symbol 提供的静态方法实现

const s1 = Symbol.for('foo')
const s2 = Symbol.for('foo')
console.log(s1===s2) // true
// 需要注意的是，这个方法内部维护的是字符串和 symbol 之间的对应关系，也就是说如果我们传入的不是字符串，那这个方法的内部转成字符串




// Symbol 类型当中还提供了很多内置的 Symbol 常量，用来作为内部方法的标识，这些标识符可以让自定义对象去实现一些 JS 当中内置的接口
//console.log(Symbol.iterator)
//console.log(Symbol.hasInstance)

const obj = {}
console.log(obj.toString()) // [object Object] 这样的字符串叫做对象的 toString 标签

//那如果我们想要自定义这个对象的 toString 标签，我们就可以在这个对象当中添加一个特定的成员来标识
//考虑到，如果我们用字符串来标识，就有可能跟内部的成员产生一些重复，所以 ECMAScript 要求我们使用 Symbol值去实现这样一个接口

const obj = {
    [Symbol.toStringTag]: 'XObject'
}
console.log(obj.toString()) // [object XObject]
// 上面的 toStringTag 就是内置的 Symbol 常量，那这种 Symbol 我们在后面为对象去实现迭代器时，会经常用到


// 最后
const obj = {
    [Symbol()]: 'symbol value',
    foo: 'normal value'
}

for (var key in obj){
    console.log(key)
}
console.log(Object.keys(obj))
console.log(JSON.stringify(obj))
// 以上的方法都没有办法拿到 Symbol 属性，总之这些特性，都使得我们 Symbol 类型的属性特别适合作为对象的私有属性

// 当然，想要获取这种类型的属性名，也不是完全没有办法
console.log( Object.getOwnPropertySymbols(obj) ) // 类似于 Object.Keys()，只不过 Object.Keys() 只能获取字符串类型的属性名，而 Object.getOwnPropertySymbols() 方法获取到的全是 Symbol 类型的属性名

```



## for of

在 ECMAScript 中有很多遍历数据的方法

for 比较实用普通的数组

for in 比较适合遍历键值对

forEach 函数式的遍历方法

这些各种各样的遍历方式都会有一定的局限性...

>   ES2015 借鉴了很多其他语言，引入了一种全新的遍历方式 for...of，那这种循环方式，以后会作为遍历所有数据结构的统一方式

只要你明白 for..of 内部工作的原理，那你就可以用这种循环去遍历任何一种自定义的数据结构

```javascript
// 基本用法
const arr = [100, 200, 300, 400]

for(const item of arr){
    console.log(item)
    if(item > 100){
        break; // 对比 forEach ，它可以随时使用 break 去终止循环
    }
}

// 除了数组可以直接被 for...of 遍历，一些伪数组也可以被 for...of 直接遍历：arguments、DOM操作时元素列表


// Set 和 Map
const s = new Set(['foo', 'bar'])
for(const item of s){
    console.log(item)
}

const m = new Map()
m.set('foo', 123)
m.set('bar', 456)
for(const item of m){
    console.log(item) // ['foo',123]
}
// 因为我们拿到的 item 就是数组，所以我们可以用数组的结构方法
for(const [key,value] of m){
    console.log(key,value)
}


// 遍历普通对象
// 通过实际尝试，不能直接遍历
const obj = { 'foo':123, 'bar':456 }
for(const item of obj){
    console.log(item) // obj is not iterable
}

```

>   ES 中能够表示有结构的数据类型越来越多，我们开发者还可以组合这些类型去定义一些符合自己业务需求的数据结构，为了提供一种统一的遍历方式，ES2015 提供了 Iterable 接口

>   实现 Iterable 接口就是 for...of 的前提，也就是说，之前那些能够 for...of 直接遍历的数据类型，都已经在内部实现了这个接口

**实现可迭代接口**

```javascript

const obj = { // 自定义对象，实现了可迭代接口 （Iterable）
    [Symbol.iterator]: function(){
        return { // 实现了迭代器接口 （Iterator）
            next : function(){
                return { // 实现了结果接口 （IterationResult）
                    value: 'zce',
                    done: true
                }
            }
        }
    }
}

// 改造
const obj = {
    store:['foo','bar','baz']
    [Symbol.iterator]: function(){
        let index = 0
        const self = this
        
        return {
            next : function(){
                return {
                    value: self[index],
                    done: index >= self.store.length
                }
                index++
                return result
            }
        }
    }
}

```
那么实现了迭代接口有什么用？

**设计模式中的 迭代器模式**

```javascript

// 场景：你我协同开发一个任务清单系统

// 我的代码 =============
const todos = {
    lift: ['吃饭','睡觉','打豆豆'],
    learn: ['语文','数学','外语'],
    work: ['喝茶'],
    
    each:function(callback){
        const all = [].concat(this.lift,this.learn,this.work)
        for(const item of all){
            callback(item)
        }
    },
    
    [Symbol.iterator]: function(){
        const all = [...this.lift,...this.learn,...this.work]
        let index = 0
        
        return {
            next : function(){
                return {
                    value: all[index],
                    done: index++ >= all.length
                }
            }
        }
    }
}



// 你的代码 =============

// 对于你而言，你就必须要了解我这个对象当中的数据结构是怎么样的，才能够有可能遍历到我这个对象当中的全部内容
 for(const item of todos.life){
     console.log(item)
 }
 for(const item of todos.learn){
     console.log(item)
 }
 // 新增了 work 类目，代码与我的数据结构严重耦合，所以也要跟着一起变化
  for(const item of todos.work){
     console.log(item)
 }
 
 // ----------------------------
 
 // 如果我的数据结构能够对外提供一个统一的遍历接口，那么对于调用者而言，就不用再关心我对象内部数据结构是怎么样的，
 // 更不用担心我的内部结构改变过后产生的影响
 todos.each(function(item){
     console.log(item)
 })
 
 // 实现可迭代接口也是同样的道理
 for (const item of todos){
    console.log(item)
 }

```
>   以上就是实现迭代器的意义，迭代器这样一个模式它的核心就是对外提供统一遍历接口，让外部不用再关心这个数据内部的结构是怎样的，上面的 each 方式只适用于当前的这个数据结构，而迭代接口可以遍历任何数据结构


## Generator

>   ES2015提供的生成器函数，避免异步编程中回调嵌套过深

```javascript

// 使用生成器函数改造对象的iterrator方法

const todos = {
    lift: ['吃饭','睡觉','打豆豆'],
    learn: ['语文','数学','外语'],
    work: ['喝茶'],
    
    each:function(callback){
        const all = [].concat(this.lift,this.learn,this.work)
        for(const item of all){
            callback(item)
        }
    },
    
    [Symbol.iterator]: function * (){
        const all = [...this.lift,...this.learn,...this.work]
        for (const item of all) {
            yield item
        }
    }
}

 for (const item of todos){
    console.log(item)
 }

```

## ES Modules
>   语言层面的模块化标准



## ECMAScript 2016

```javascript

// 1.Array.prototype.includes

const arr = ['foo',1,NaN,false]
console.log( arr.indexOf(NaN) ) // -1
console.log( arr.includes(NaN) ) // true


// 2.指数运算符（对于数学密集型的应用会比较常用）
console.log(Math.pow(2, 10)) // 1024
console.log(2 ** 10) // 2014

```


## ECMAScript 2017

**Object 的三个扩展方法**
```javascript

const obj = {
    foo: 'value1',
    bar: 'value2'
}

// 1.Object.values -------------------------
console.log( Object.values(obj) ) // ['value1', 'value2'] 与 Object.keys对应

// 2.Object.entries -------------------------
console.log(  Object.entries(obj) ) // [ ['foo','value1'],['bar','value2']]
// 以数组的形式返回对象当中的键值对，这使得我们可以使用 for...of 遍历对象

for( const [key,value] of Object.entries(obj) ){
    console.log(key,value)
}

// 又因为 Map 的构造函数需要的就是这种格式的数组，所以我们就可以借助 Object.entries 方法将一个对象转换成 Map 对象
console.log( new Map(Object.entries(obj)) )


// 3.Object.getOwnPropertyDescriptors -------------------------
// 获取对象中属性的完整描述信息，配合 ES5 中对象的 get,set使用，可以获取 get、set 这样类型的数据
 const p1 = {
     firstName: 'Lei',
     lastName: 'Wang',
     get fullName(){
         return this.firstName + '' + this.lastName
     }
 }
 
 const p2 = Object.assign( {},p1 )
 p2.firstName = 'zce'
 console.log(p2) // { firstNmae:'zce',lastName:'Wang',fullName: 'Lei Wang' }
 // 这里复制对象时把，fullName也当作普通属性复制了
 
 const descriptors = Object.getOwnPropertyDescriptors(p1)
 const p2 = Object.defineProperties({},descriptors)
 console.log(p2.fullName) // zce Wang
 
```

**字符串填充方法**
>   用给定的字符串去填充目标字符串的开始或结束位置，直到我们这个字符串达到指定位置为止

-   padStart
-   padEnd

```javascript

// String.prototype.padStart / String.prototype.padEnd
const books = {
    html: 5,
    css: 6,
    javascript: 128
}

for ( const [name, count] of Object.entries(books) ){
    console.log(name,count) // 直接输出会显得非常乱
}

// 使用字符串的方法，去将输出的字符串进行对齐
for ( const [name, count] of Object.entries(books) ){
    console.log(`${name.padEnd(16,'-')}|${ count.toString().padStart(3, '0') }`) // 直接输出会显得非常乱
}


```

**在函数参数中，添加尾逗号**

```javascript

function foo(
    bar,
    baz,
){
    
}

// 作用类似于以往我们在数组尾部添加逗号、

// 从运行的角度，这里添加和不添加逗号，输出都是没有任何差异的，
// 但是很多人都愿意这么样去使用，有两个好处：
// 1.如果我们想重新排列数组的顺序，每行后面都有逗号，格式是一致的，可以直接用快捷键进行调整 alt+↑
// 2.我们如果去修改了这个数组中元素的个数，这个时候我们只需要新建一行就可以了，如果最后一位没有逗号的话，我们首先需要在最后一行添加一个逗号，再来新增一行添加新的元素，这样的话对我们源代码来讲，是需要修改两行。所以我们在结束位置添加逗号，可以让源代码管理工具更精确的定位到发生变化的位置
const arr=[
    100,
    200,
    300,
]

```

**Async / await**
>   彻底解决了回调函数嵌套过深的问题，使得我们代码更加简洁易读，本质上就是使用 Promise 的语法糖而已