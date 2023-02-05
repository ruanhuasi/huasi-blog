# 入门

## TypeScript概述
>   基于 JS 基础之上的编程语言，超集：在JS的原有基础之上多了一些扩展特性

TypeScript( JS + 类型系统 + ES6+ ) ===编译===> JavaScript

TS 的类型系统优势：避免开发过程当中有可能出现的类型异常，提高编码效率以及代码的可靠程度

即便说我们不想用 TS 当中的强类型系统，通过 TS 去使用 ES 的新特性也是很好的选择（类似 Babel）,因为 TS 最终编译成 JS 去工作，所以任何一个 JS 运行环境下的应用程序都可以用 TS 开发


缺点1：语言本身多了很多的概念，提高了学习成本

缺点2：项目初期，TS 会增加一些成本


## 快速上手

```TypeScript

yarn init --yes

yarn add typescript --dev


// =========================

const hello = name =>{
    console.log(`Hello, ${name}`)
}

hello('TypeScript')

// 编译
yarn tsc 01-getting-started.ts


var hello = function (name) {
    console.log("Hello, " + name);
};
hello('TypeScript');


```


## 配置文件
>   tsc 命令不仅可以单独编译指定的 ts 文件，还可以编译整个工程

```TypeScript

// 在编译项目之前，需要生成配置文件
yarn tsc --init


"target": "es5" --编译后的 JS 采用的 ES 标准库

"module": "commonjs" -- 输出的代码采用什么方式模块化

"outDir": "dist",  -- 设置编译结果输出的文件夹

"rootDir": "src",  -- 设置 TS 源代码文件夹

"sourceMap": true, -- 源代码映射，调试的时候就能够使用 sourceMap 文件去调试 TS 源代码

"strict": true, -- 严格模式


// 有了配置文件之后，再去编译单个 ts 文件，配置内容是不会生效的


yarn tsc // 编译项目
```




## 原始类型

```TypeScript

/**
 * 原始类型
 *
 * @flow
 */

const a: string = 'foobar'

const b: number = 100 // NaN Infinity（无穷大）

const c: boolean = false // true

// ------ 以上三种，在非严格模式下，可以赋值为 null

const e: void = undefined // null  严格模式下只能是 undefined

const d: null = null

const d: undefined = undefined

const f: symbol = Symbol() // es6 新增的内置对象，所以会报错

// 配置文件中 "target": "es5" 项如果设置的是 es5 ，对于 ES5的情况下，我们对标准库的引用默认只会引用 es5 的标准库，任何一个 es6 新增的标准库 symbol、promise 等，都会报错

```

**标准库声明**

```TypeScript

解决es6内置对象报错的办法有两种：

"target": "ES2015"

// 如果必须要编译到 es5 
"target": "es5"
"lib":["ES2015", "DOM"] // 在 lib 选项指定我们需要引用的标准库
// 注意：当我们设置 lib 的时候，如果只设置 ES2015 ，那引入的库就没有了浏览器环境的对象，需要把 DOM（BOM+DOM） 的引入也添加进来


```

## 中文错误消息
> 让 TS 显示中文的错误信息

```TypeScript

一般情况下 TS 会根据当前操作系统，或编辑器的语言来显示对应的错误信息，

1.如果要强制显示中文的错误信息，在执行编译时：

yarn tsc --locale zh-CN

2.设置 VSCODE
首选项-设置-搜索 typescript locale-这是为 zh-CN

// 一般还是推荐用英文的提示，这样在搜索引擎搜索的时候会找到更多有用的信息

```


## TypeScript 作用域问题
>   当然这种问题在实际开发中一般不会遇到，因为我们每个文件都会以模块的形式去工作

```TypeScript

在我们演示案例的时候，会发现两个不同文件声明了同样的变量名，会报错

// a.ts---------------
const foo: string = 'bar'

// b.ts---------------
const foo: string = 'bar' // 报错

这是因为 foo 变量目前是定义在全局作用域下的，TS 在编译整个项目的是时候就会出现这个错误，

解决的办法：

// a.ts---------------

(function(){
    const foo: string = 'bar'
})()

或者用 esmodule 导出

// a.ts---------------
const foo: string = 'bar'
export {}


```


## Object 类型
>    TS 中，Object类型不是单指的普通对象类型，而是泛指的所有c原始类型：对象、数组、函数

```TypeScript

const foo: object = {}
const foo: object = []
const foo: object = function(){}


// 普通对象类型

const obj: { foo: number, bar: string } = { foo:123, bar: 'string' }

 当然在 ts 当中去限制对象类型，我们应该去使用更专业的东西--接口
 
 我们需要注意的是，在 TS 当中 Object 类型指的是原始类型以外的所有类型


```

## 数组类型

```TypeScript

const arr1: Array<number> = [1, 2, 3]

const arr2: number[] = [1, 2, 3] // 更常用 

// 以往我们传入参数的问题
// 求所有参数的和
function sum(...args){
    // 需要在这里判断所有参数是不是数字
    return args.reduce( (prev, current) => prev + current, 0 )
}

// ts当中只需要给参数添加数字数组的类型注解就可以了 
function sum(...args: number[]){
    return args.reduce( (prev, current) => prev + current, 0 )
}


```


## 元组类型
>   一种特殊的数据结构，元组就是明确元素数量以及每个元素类型的数组，每个元素类型不必要完全相同

```TypeScript

const tuple: [number, string] = [18, 'zce']

const [age, name] = tuple

一般可以用于在函数中返回多个返回值

// Object.entries 返回的就是一个元组
Object.entries({
    foo: '123',
    bar: 456
})

```


## 枚举类型（Enum）

```TypeScript

我们在应用开发过程中，经常会涉及到需要用某几个数值，去代表某种状态

const post = {
    title: 'Hello TypeScript',
    content: 'TypeScript is typed superset of JavaScript',
    status: 2 // 0草稿  1未发布  2已发布
}
// 时间长了，我们也许就不知道这个 status写的数字 的值代表什么状态，而且时间长了也会可能混进来其他的值


枚举类型
给一组数值起上一个更好理解的名字
一个枚举中只会存在几个固定的值，不会出现超出范围的可能性

// 在JS当中我们一般用对象来模拟枚举类型
const PostStatus = {
    Draft: 0,
    Unpublished: 1,
    Published: 2
}
const post = {
    title: 'Hello TypeScript',
    content: 'TypeScript is typed superset of JavaScript',
    status: PostStatus.Published
}


// 而在 TS 当中我们有专门的枚举类型
// 注意枚举类型的属性不是用对象里的 : 而是用 =
enum PostStatus = {
    Draft = 0,
    Unpublished = 1,
    Published = 2
}

// 当我们不指定枚举类型的值，默认从 0 开始累加
enum PostStatus = {
    Draft, // 0
    Unpublished, // 1
    Published // 2
}

// 也可以指定第一个，后面的会从指定的数值开始累加
enum PostStatus = {
    Draft = 6,
    Unpublished, // 7
    Published // 8
}


// 枚举的类型也可以是字符串，但是字符串不会自己累加，所以我们需要指定每个值
// 当然字符串类型的枚举并不常见
enum PostStatus = {
    Draft = 'aaa',
    Unpublished = 'bbb',
    Published = 'ccc'
}



枚举类型会入侵到我们运行时的代码：会影响我们编译后的结果，
我们在 ts 中使用的大多数类型，在经过编译转换后最终都会被移除，因为它只是为了我们在编译过程中可以做类型检查，
而枚举类型不会，它会最终编译为一个双向的键值对对象

所谓双向键值对对象就是可以通过键获取值，也可以用值获取键，这样做的目的是为了可以让我们动态的根据枚举值去获取枚举的名称

编译过后：
"use strict";
var PostStatus;
(function (PostStatus) {
    PostStatus[PostStatus["Draft"] = 0] = "Draft";
    PostStatus[PostStatus["Unpublished"] = 1] = "Unpublished";
    PostStatus[PostStatus["Published"] = 2] = "Published";
})(PostStatus || (PostStatus = {}));

如果我们确认代码中不会用索引器的方式去访问枚举值，那就建议使用常量枚举

常量枚举：

const enum PostStatus = {
    Draft = 'aaa',
    Unpublished = 'bbb',
    Published = 'ccc'
}

编译后：


```


## 函数类型

```TypeScript

function func1(a: number ,b: number): string{
    return 'func1'
}

func1(100, 200)


// 可选参数和参数默认值
// 不管是可选参数还是参数默认值都必须在参数列表最后

function func2(a: number ,b?: number=10): string{
    return 'func1'
}

func2(100)


// 接收任意个数的参数
function func2(a: number ,b: number=10, ...rest: number[]): string{
    return 'func1'
}

func2(100)



// ----------------------------函数表达式

const func3 = function (a: number,b: number): string{
    return 'func3'
}

```



## 任意类型
>   由于 JS 是弱类型的关系，很多内部的 API 本身就支持接收任意类型的参数，而 TS 又是基于 JS 基础之上的，所以说我们难免会在代码中去用一个变量去接收一个任意类型的数据

```TypeScript

// TS 不会对 Any 类型做任何检查
function stringify(value: any){
    return JSON.stringify(value)
}

stringify('string')

stringify(100)

stringify(true)

let foo: any = 'string'

foo = 100
foo.bar()

// any 不是安全类型，轻易不要去使用这种类型，但是我们有时候要去兼容老代码的时候难免要去使用 
```


## 隐式类型推断
>   虽然有隐式的类型推断，但还是建议为每个变量添加明确的类型，便于后期我们去理解这个代码

```TypeScript


let age = 18 // 推断为 number

age = 'string' // 类型错误


// 如果 TS 无法推断一个变量的具体类型，那就会标记为 any 类型

let foo

foo = 100

foo = '100'


```


## 类型断言
> 告诉 TS ：你相信我，这个地方一定是 number 类型的

```TypeScript
// 假定这个 nums  来自一个明确的接口
const nums = [110, 120, 119, 112]

const res = nums.find( i => i > 0 ) // 此时 ts 推断的类型有可能是 number 或 undefined

const square = res * res // 在有可能是number类型以外的类型时，不能进行运算，所以这里报语法错误

// 使用类型断言
const num1 = res as number
const num2 = <number>res // JSX 下不能使用

类型断言不是类型转换，类型的断言是编译过程中的概念，类型转换是代码在运行时的概念

```



## 接口（Interfaces）
> 接口就是用来约束对象的结构，一个对象去实现一个接口，就必须要拥有这个接口当中所约束的所有成员

>   TS中的接口只是用来为我们有结构的数据去做类型约束的，在实际运行阶段这种接口并没有意义

>   接口是一种规范或者一种契约，去使用一个接口，就必须去遵守这个接口的全部约定

```TypeScript


function pringPost(post){
    // 我们传入的 post 对象必须要存在 title 和 content 属性，只不过这种要求是隐性的
    console.log(post.title)
    console.log(post.content)
}


// 成员可用逗号分隔
//interface Post{
//    title: string,
//    content: string
//}

// 更标准的是用分号分隔，而且这个分号和 js 的分号是一样可以省略的
interface Post{
    title: string
    content: string
}

function pringPost(post: Post){
    // 我们传入的 post 对象必须要存在 title 和 content 属性，只不过这种要求是隐性的
    console.log(post.title)
    console.log(post.content)
}





// 可选成员、只读成员、动态成员

interface Post{
    title: string
    content: string
    subtitle?: string // 可选成员 也就是标注为 string 或 undefiend
    readonly summary: string // 只读成员 例如文章摘要，我们一般是从文章中提取的，根本不需要其他赋值，所以只读成员在初始化过后就不能再次修改
}

const hello: Post = {
    title: "Hello TypeScript",
    content: "A javascript superset",
    summary: "A javascript"
}


// 动态成员
// 适用于具有一些动态成员的对象-例如程序当中的缓存对象
// 我们在定义的时候无法知道会有哪些具体的成员
interface Cache {
    [key: string]: string // 指定键的类型和值的类型
}

const cache: Cache = {}

cache.foo = 'value1'
cache.bar 'value1'

```


## 类
> 面向对象编程中一个最重要的概念

> 可以用来描述一类具体事物的抽象特征

手机类
特征：打电话、发短讯

子类：智能手机
特征：除了打电话、发短讯，还能使用 APP

而我们不能直接去使用类的，而是去使用属于这个类的具体事物，例如我手上的这台手机，类比到程序的角度，也是一样的，类可以用来去描述一类具体对象的一些抽象成员，
在 ES6 以前都是通过函数配合原型去模拟实现的类，从 ES6 开始就有了专门的 Class 相关语法,在 TS 中我们除了可以使用 ES6 中所有类的功能，它还添加了一些额外功能的用法，例如类成员有特殊的反问修饰符，和一些抽象类的概念

```TypeScript

// TS 中类属性在定义上的一些细微差异
class Person{
    // 在 ts 中，类的属性必须要有一个初始值，可以在 = 号后面赋值，或者在构造函数中赋值，两者必须取其一
    name: string // = 'init name'
    age: number
    constructor (name: string, age: number){
        // 类的属性在使用之前，必须要在类型当中去声明，目的是为了给我们的属性去做一些属性的标注
        this.name = name
        this.age = age
    }
    
    sayHi(msg: string): void{
        console.log(`I am ${this.name}, ${msg}`)
    }
}

```

**类的访问修饰符**
>   控制类当中成员的可访问级别

// public 公有
// private 私有，只允许在本类中访问
// protected 受保护，允许继承，只允许在子类中访问

```TypeScript



class Person{

    public name: string // 公有属性，默认就是公有，加不加都是一样的，不过建议加上，这样代码会更加容易理解一点
    private age: number // 私有属性
    protected gender: boolean
    constructor (name: string, age: number){
        this.name = name
        this.age = age
        this.gender = true
    }
    
    sayHi(msg: string): void{
        console.log(`I am ${this.name}, ${msg}`)
    }
}

class Student extends Person {
    constructor(name: string,age: number){
        super(name,age)
        console.log(this.gender) // 受保护的成员可以在子类中访问
    }
}

const tom = new Person('tom', 18)
console.log(tom.name)
// console.log(tom.name) // 不能外部访问私有属性
// console.log(tom.gender) // 受保护的成员也不能外部访问



// -----构造函数的访问修饰符
// 默认也是 Public
class Student extends Person {
    
    // 私有的构造函数
    private constructor(name,age){
        super(name,age)
        console.log(this.gender) // 受保护的成员可以在子类中访问
    }
    
    // 私有的构造函数，只能在本类中添加一个静态方法，在静态方法中创建这个实例
    static create(name: string, age: number){
        return new Student(name,age)
    }
}

const jack = Student.create('jack', 18)


// protected 受保护的构造函数同样允许继承，不允许外部访问
```


**类的只读属性**

readonly 如果成员有访问修饰符，应该跟在访问修饰符的后面

要么在初始化的时候赋值，要么在构造函数中赋值，两者只能取其一，并且不再允许修改
```TypeScript

class Person{

    public name: string // 公有属性，默认就是公有，加不加都是一样的，不过建议加上，这样代码会更加容易理解一点
    private age: number // 私有属性
    protected readonly gender: boolean
    constructor (name: string, age: number){
        this.name = name
        this.age = age
        this.gender = true
    }
    
    sayHi(msg: string): void{
        console.log(`I am ${this.name}, ${msg}`)
    }
}

```


**类与接口**
> 不同的类和类之间也会有一些共同的特征，对于这些公共的特征，我们一般会使用接口去抽象

手机类，能打电话

座机类，也能打电话

```TypeScript

interfaces EatAndRun{
    eat(food: string): void
    run(distance: number): void
}

// 实现了这个接口，就必须要有它对应的成员
class person implements EatAndRun{
    eat(food: string): void{
        console.log(`优雅的进餐：${food}`)
    }
    
    run(distance: number): void{
        console.log(`直立行走：${distance}`)
    }
}

class Animal implements EatAndRun{
    eat(food: string): void{
        console.log(`呼噜呼噜的吃：${food}`)
    }
    
    run(distance: number): void{
        console.log(`爬行：${distance}`)
    }
}


// 在 JAVA 和 C# 中建议我们尽可能让每一个接口的定义更加简单，更加细化
// 更为合理的是 一个接口只去约束一个能力，让一个类型同时去实现多个接口

interfaces Eat{
    eat(food: string): void
}
interfaces Run{
    run(distance: number): void
}

class person implements Eat, Run{
    eat(food: string): void{
        console.log(`优雅的进餐：${food}`)
    }
    
    run(distance: number): void{
        console.log(`直立行走：${distance}`)
    }
}

class Animal implements  Eat, Run{
    eat(food: string): void{
        console.log(`呼噜呼噜的吃：${food}`)
    }
    
    run(distance: number): void{
        console.log(`爬行：${distance}`)
    }
}

// 大家千万不要把自己框在某一门语言或技术上面，最好可以多接触，多学习一些周边的语言或者技术，这样可以补充你的知识体系，一个只了解 JS 的开发成员，即便很精通，也不可能设计出来一些比较高级的产品，MVVM 最早就是微软的思想，所以我们的视角要放宽一点

```



**抽象类**
>   和接口有些类似，也可以用来约束子类当中必须要有某一个成员，不同的是，抽象类可以包含一些具体的实现，而接口只能够是成员的抽象，不包含具体的实现

>   一般比较大的类目一般都建议使用抽象类，比如上面的动物类，它只是一个泛指，它的下面还有更细化的分类，小狗、小猫之类的

```TypeScript
 
 // abstract 关键字声明抽象类,声明过后就只能被继承，不能够再使用 new 的方式去创建实例化对象了
abstract class Animal {
    eat(food: string): void{
        console.log(`呼噜呼噜的吃：${food}`)
    }
    // 在抽象类当中我们还可以去定义一些抽象方法
    // 抽象方法也不需要方法体
    abstract run (distance: number): void
}

class Dog extends Animal {
    
    // 当我们的父类当中有抽象方法时，我们子类就必须要去实现这样一个方法
    run(distance: number): void{
        console.log('四脚爬行’,distance)
    }
}

// 使用子类创建的对象，同时拥有父类的一些实例方法以及自身实现的抽象方法
const d = new Dog()
d.eat('嗯西马')
d.run(100)

```


## 泛型
>   就是指我们在定义函数、接口或类的时候，没有去指定具体的类型，等到我们去使用的时候再去指定具体的类型

> 泛型就是把我们定义时不能够明确的类型变成一个参数，让我们在使用的时候再传递这样一个参数


```TypeScript

// 创建指定长度的数组

// Array 默认创建的 any 类型的数组，所以我们要去指定一下，指定类型的方式就是通过泛型参数去传递一个参数，
// 这里的Array就是一个泛型类
// 在 TS 内部去定义这个 Array时，并不知道我们会使用它去存放什么类型的数据
// 所以它就使用泛型，让我们在调用时再去传递一个具体的类型

function createNumberArray(length: number, value: number): number[]{
    const arr = Array<number>(length).fill(value)
    return arr
}
// 上面的方法只能用来创建number类型的数组，所以用比较笨的方法就是再创建一个创建string类型数组的函数
function createNumberString(length: number, value: string): string[]{
    const arr = Array<string>(length).fill(value)
    return arr
}

// 这种情况下，这两个函数比较冗余，更合理的方式就是使用泛型
function createArray<T>(length: number, value: T): T[]{
    const arr = Array<T>(length).fill(value)
    return arr
}

const res = createArray<string>(3, 'foo')

```


## 类型声明
> TS 使用第三方模块时的类型声明

> 在实际的开发过程当中，我们难免会去使用一些第三方模块，而这些NPM模块并不一定都是通过 ts 来编写的，所以它提供的成员就不会有强类型的体验


```TypeScript

// yarn add lodash

impost { camelCase } from 'lodash'
//const res = camelCase('hello typed') // 如果直接调用，没有任何类型限制

// 使用类型声明过后就会有类型限制了
declare function camelCase(input: string): string



// 说白了就是一个成员在定义的时候因为种种原因，它没有声明明确的类型，
// 我们在使用的时候可以单独为它再作出一个明确的声明，这种做法存在的原因就是为了考虑去兼容一些普通的 js 模块

// 由于 ts 社区非常强大，目前绝大多数常用的 NPM 模块都已经提供了对应的声明，我们只需要安装一下对应的类型声明模块就可以了

// yarn add @types/lodash --dev
const res = camelCase('hello typed') // 这时会有对应的类型限制



// 总结：在 ts 当中我们去引用第三方模块，如果这个模块不包含对应的类型声明文件，那我们就可以尝试去安装一个所对应的类型声明模块，这个类型声明模块一般就是 @types/对应的模块名
// 如果说也没有对应的类型声明模块，那这种情况我们就只能用 declare 语句去声明对应的模块类型

```