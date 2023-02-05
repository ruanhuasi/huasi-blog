# 基础

## 概述
>   解决 JavaSscript 类型系统的问题


-   强类型和弱类型
-   静态类型与动态类型
-   JavaScript 自有类型系统的问题
-   Flow 静态类型检查方案
-   TypeScript 语言规范与基本使用


## 类型系统

### 类型安全角度

**强类型&弱类型**
-   强类型有更强的类型约束，弱类型几乎没有什么约束
-   强类型当中，不允许有任意的隐式转换，而弱类型是允许的

### 类型检查角度

**静态类型&动态类型**

静态类型：一个变量声明时它的类型就是明确的，而且声明过后，它的类型就不允许被修改了

动态类型：在运行的阶段，才能明确变量的类型，而且变量的类型也随时可以发生变化


## JavaScript 类型系统特征
>   弱类型 且 动态类型

为什么 JavaScript 不是强类型或者静态类型？
-   早前，JS 的应用简单
-   JS 是脚本语言，不需要编译，直接在运行环境中运行。没有编译环节：即便设计成静态类型语言也没有意义，因为静态类型语言需要在编译环节进行类型检查

**大规模应用下，JS 的 [灵活优势] 就变成了短板**


### 弱类型的问题

```javascript
//必须要到运行阶段才能发现问题，语法上不会报错
const obj = {}
obj.foo() // 不存在的方法


//=============================
// 类型不明确，函数的功能有可能发生改变
function sum(a, b){
    return a+b
}
console.log( sum(100, 100) ) // 200
console.log( sum(100, '100') ) // 100100


//=============================
// 对对象索引器错误的一种用法
const obj = {}
obj[true] = 100
console.log(obj['true'])
```


>   **君子约定有隐患，强制要求有保障**


### 强类型的优势
-   错误更早暴露
-   代码更智能，编码更准确
-   重构更牢靠
-   减少不必要的类型判断

```javascript


fucntion render(){
    element.className = 'container' // 有时编辑器没办法推断出该提示的类型
    element.innerHtml = 'hello world'// 也不能显示语法的错误
}


//===============================

const uitl = {
    // 假如重构时想要修改方法名，没办法在短时间内发现引用了该方法的地方
    aaa:() =>{
        console.log('util func')
    }
}

//===============================


function sum(a, b){
    // 假如我们能够约束传参的类型，就可以减少不必要的类型判断，只有弱类型语言需要这种判断
    if(typeof a !== 'number' || typeof b !==  'number'){
        throw new TypeError('arguments must be a number')
    }
    return a+b
}
```

## Flow
>   JavaScript 的类型检查器，弥补 JS 弱类型带来的弊端，为 JS 提供了更完善的类型系统

```javascript

// 通过添加类型注解，Flow根据类型注解来检查代码当中的类型异常，避免到运行阶段才发现错误
function sum(a:number, b:number){
    return a+b
}

```

### 快速上手

```javascript

yarn init --yes
yarn add Flow-bin --dev

```

在文件开始的位置通过注释的方式添加 @flow 标记，这样 flow 才会检查
```javascript
// @flow
function sum(a: number, b: number){
    return a+b
}

sum(100,100)
sum('100',100)

yarn flow init
yarn flow

```

如果添加注解后发现语法报错，可以关闭 vscode js语法检查 setting-搜索 javascript validate



### 编译
>   通过编译移除注解

```cmd 
方式一：

yarn  add flow-remove-types --dev

yarn flow-remove-types . -d dist


//==============================

方式二：

yarn add @babel/core @babel/cli @babel/preset-flow --dev

// 在项目中添加 .babelrc 文件
{
    "presets": ["@babel/preset-flow"]
}

yarn babel src -d dist

```


### Flow 开发工具插件
> 使用插件后错误信息直接显示在代码上，无需执行编译检查
```cmd

Flow Language Support

```


### 类型推断

```javascript

/**
 * 类型推断
 *
 * @flow
 * /
 * 
 function square(n){
    return n*n
 }
 square('100') // 字符串不能进行乘法运算

// 根据代码的使用情况去推断变量的类型就叫类型推断，不过建议还是加上注解，让代码更有可读性


```


### 类型注解
>  更明确的限制类型，对后期理解代码更有帮助，尽可能使用类型注解 

```javascript

/**
 * 类型注解
 *
 * @flow
 * /
 * 
 function square(n: number){ // 参数注解
    return n*n
 }
// 变量注解
let num: number = 100

// 返回值注解
function foo(): number{
    return 100
}
function foo(): void{
    // 没有返回值会默认返回 undefiend，所以如果没有返回值要设置类型为 void
}


```

### 原始类型
>  Flow 当中具体支持哪些类型和类型注解的更高级用法

```javascript

/**
 * 原始类型
 *
 * @flow
 * /
 * 

const a: string = 'foobar'

const b: number = 100 // NaN Infinity（无穷大）

const c: boolean = false // true

const d: null = null

const e: void = undefined // 注意 undefined 是用 void

const f: symbol = Symbol()


```


### 数组类型

```javascript

/**
 * 数组类型
 *
 * @flow
 * /
 * 

const arr1: Array<number> = [1, 2, 3]

const arr2: number[] = [1, 2, 3]

// 元组
const foo: [string, number] = ['foo', 100] // 固定长度的数组

// 如果我们函数中需要返回多个返回值的时候就可以用元组的数据类型


```


### 对象类型

```javascript

/**
 * 对象类型
 *
 * @flow
 * /
 * 

const obj1: { foo: string, bar: number } = { foo:'string', bar:100 }

const obj2: { foo?: string, bar: number } = { bar:100 }

const obj3: { [string]: string } = {} // 允许添加任意类型的键，不过键值的类型都受限制

obj3.key1 = 'value1'
obj3.key2 = 'value2'


```



### 函数类型

```javascript

/**
 * 函数类型
 *
 * @flow
 * /
 * 

// 参数类型和返回值类型
function foo(a: number,b: number)()： void{
    return a+b
}


// 函数作为回调函数时，设置回调函数的参数类型和返回值类型
function foo(callback: (string, number) => void){
    callback('string',100)
}

foo(function(str, n){
    // str => string
    // n => number
})

```


### 特殊类型

```javascript

/**
 * 特殊类型
 *
 * @flow
 * /
 * 


// 联合类型
const b: string | number = 100

// 声明类型，这就可以重复使用了
type StringOrNumber = string | number


// 字面量类型
const a: 'foo' = 'foo'
// 字面量类型一般不单独使用，而是使用联合类型（或类型）
const type: 'success' | 'warring' | 'danger' = 'success'


// maybe(有可能的) 类型
const gender: ?number = null
// 等价于
const gender: number | null = null

```


### Mixed 与 Any

```javascript

/**
 * 任意类型
 *
 * @flow
 * /
 * 
 
 // mixed
 fucntion passMixed(value: mixed){
    // mixed 是强类型，需要作类型判断才不会语法报错
     if(type value === 'string'){
         value.substr(1)
     }
 }

passMixed('string')
passMixed(100)



//---------------------------------------
// any
 fucntion passAny(value: mixed){
     
 }

passMixed('string')
passMixed(100)



// any 是弱类型，mixed是强类型
// any 的存在只是为了兼容老代码，尽量不去用

// flow 类型还有很多，最主要的目的是为了以后 看第三方源码中使用的情况，我们要能看懂
```

### 运行环境 API

```javascript

/**
 * 运行环境 API
 *
 * @flow
 * /
 * 
 
const element: HTMLElement | null = document.getElementById('app')

```