# 函数式编程范式

## 函数式编程概念
 >  函数式编程(Functrion Programming, FP)，FP 是编程范式之一，我们常听说的编程范式还有面向过程编程，面向对象编程。
 
 -  面向对象编程的思维方式：把现实世界中的事务抽象成程序世界中的类和对象，通过封装、继承和多态来演示事物事件的联系
 -  函数式编程的思维方式：把现实世界的事物和事物之间的联系抽象到程序世界（对运算过程进行抽象）
    -   程序的本质：根据输入通过某种运算获得相应的输出，程序开发过程中会涉及很多有输入和输出的函数
    -   x->f(联系、映射)->y，y=f(x)
    -   函数式编程中的函数指的不是程序中的函数(方法)，而是数学中的函数即映射关系，例如：y=sin(x)，x和y的关系
    -   相同的输入始终要得到相同的输出(纯函数)
    -   函数式编程用来描述数据(函数)之间的映射


```javascript

// 非函数式
let num1 = 2
let num2 = 3
console.log(sum)

// 函数式
function add(n1,n2){
    return n1+n2
}

let sum = add(2,3)
console.log(sum)


```


## 高阶函数

-   函数作为参数
-   函数作为返回值


#### 函数作为参数
```javascript

function forEach( array,fn ){
    for(let i=0;i<array.length;i++){
        fn(array[i])
    }
}

function filter( array,fn ){
    let result = []
    for(let i=0;i<array.length;i++){
        if(fn(array[i])){
            result.push(array[i])
        }
        
    }
    return result
}


```


#### 函数作为返回值
```javascript

// 函数只执行一次
function once(fn){
    let done = false
    return function(){
        if(!done){
            fn.apply(this,arguments)
        }
    }
}

// 支付（只执行一次）
let pay = once(function(money){
    console.log(`支付了${money} RMB`)
})

pay(5) //只执行了一次
pay(5)
pay(5)

```

#### 高阶函数的意义
-   抽象可以帮我们屏蔽细节，只需要关注与我们的目标
-   高阶函数是用来抽象通用的问题




## 闭包
>   可以在另一个作用域中调用一个函数的内部函数并访问到该函数的作用域中的成员

闭包的本质：函数在执行的时候会放到一个执行栈上，当函数执行完毕之后会从栈上移除，但是堆上的作用域成员因为被外部引用不能释放，因此内部函数依然可以访问外部函数的成员


```javascript
        // 生成计算工资方法的函数
        function makeSalary(base){
            return function(performance){
                return base + performance
            }
        }
        
        let level1 = makeSalary(12000)// 生成级别1的工资计算方法
        let level2 = makeSalary(15000)// 生成级别1的工资计算方法
        console.log(level1(2000)); // 在调用函数内部的函数时，产生了闭包 base : 12000
        console.log(level2(3000));

```


## 纯函数
>   相同的输入永远会得到相同的输出

```javascript

        let array = [1,2,3,4,5]

        // 纯函数(相同的输入会得到相同的输出)
        console.log(array.slice(0,3));// [1,2,3]
        console.log(array.slice(0,3));// [1,2,3]
        console.log(array.slice(0,3));// [1,2,3]

        // 非纯函数
        console.log(array.splice(0,3));// [1,2,3]
        console.log(array.splice(0,3));// [4,5]
        console.log(array.splice(0,3));// []

```

-   函数式编程不会保留计算中间的结果，所以变量是不可变的（无状态）
-   我们可以把一个函数的执行结果交给另一个函数去处理


#### Lodash
>   纯函数库

[官网](https://lodash.com/)
[中文文档](https://www.lodashjs.com/)


#### 纯函数的好处

-   可缓存
    -   因为纯函数对相同的输入始终有相同的结果，所以可以把纯函数的结果缓存起来

```javascript

        // 纯函数-求圆的面积
        function getArea(r){
            console.log(r);
            return Math.PI * r * r
        }

        // 可缓存函数
        function memoize(f){
            let cache = {}
            return function (){
                let key = JSON.stringify(arguments)
                cache[key] = cache[key] || f.apply(f,arguments)
                return cache[key]
            }
        }

        let getAreaWithMemory = memoize(getArea)
        console.log(getAreaWithMemory(4));
        console.log(getAreaWithMemory(4));// 第二次不打印 r
        console.log(getAreaWithMemory(5));
        console.log(getAreaWithMemory(5));// 第二次不打印 r

```

-   可测试
    -   纯函数让测试更方便
-   并行处理
    -   纯函数不需要访问共享内存数据，所以在并行环境下可以任意运行纯函数（Web Worker）


#### 副作用

```javascript

// 不纯的
let mini = 18
function checkAge(age){
    return age >= mini
}

```

副作用让一个纯函数变得不纯，纯函数的根据相同的输入返回相同的输出，如果依赖于外部的状态就无法保证输出相同，就会带来副作用

副作用来源：

-   配置文件
-   数据库
-   获取用户输入
-   ...

所有的外部交互都有可能产生副作用，副作用也使得方法通用性下降不适合扩展和可重用性，同时副作用会给程序中带来安全隐患给程序带来不确定性，但副作用不可能完全禁止，尽可能控制它们在可控范围内发生


## 柯里化

**概念：**

-   当一个函数有多个参数的时候，先传递一部分参数调用它（这部分参数以后永远不变）
-   然后返回一个新的函数接收剩余的参数，返回结果

```javascript

// 硬编码函数
function checkAge(age){
    let min = 18
    return age>=min
}

// 普通纯函数
function checkAge(min,age){
    return age>=min
}

// 柯里化
function checkAge(min){
    return function(age){
        return age >= min
    }
}

let checkAge18 = checkAge(18)
let checkAge20 = checkAge(20)

checkAge18(20) // true
checkAge20(24) // true
```

#### lodash 中的 curry（柯里化）

```javascript

const _ = require('lodash')

function getSum(a,b,c){
    return a + b + c
}

const curried = _.curry(getSum)

console.log(curried(1, 2, 3)) // 返回结果
console.log(curried(1)(2, 3)) // 固定一个参数，返回函数，再执行结果
console.log(curried(1, 2)(3)) // 固定两个参数，返回函数，再执行结果
```

**柯里化总结：**

-   柯里化可以让我们给一个函数传递较少的参数得到一个已经记住了某些固定参数的新函数
-   这是一种对函数参数的'缓存'
-   让函数变的更灵活，让函数的粒度更小
-   可以把多元函数转换成一元函数，可以组合使用函数产生强大的功能


**纯函数和柯里化很容易写出洋葱代码**
```javascript

// 获取数组的最后一个元素再转换成大写字母
_.toUpper(_.first(_.reverse(array)))


//函数组合可以让我们把细粒度的函数重新组合生成一个新的函数
```

## 函数组合

**函数组合(compose)：如果一个函数要经过多个函数处理才能得到最终值，这个时候可以把中间过程的函数合并成一个函数**
-   函数就像是数据的管道，函数组合就是把这些管道连接起来，让数据穿过多个管道形成最终结果
-   函数组合默认是从右到做执行

```javascript

// 组合函数

// 求数组中的最后一个元素
function compose(f,g){
    return function(val){
        return f(g(val))
    }
}

function reverse(array){
    return array.reverse()
}

function first(arr){
    return arr[0]
}

const last = compose(first,reverse)

console.log(last([1,2,3,4])) // 4
```


#### lodash 中的组合函数

-   lodash 中的组合函数 flow() 或者 flowRight()，他们都可以组合多个函数
-   flow() 是从左到右
-   **flowRight()** 是从右到左运行，使用的更多一些

```javascript

const _ = require('lodash')

const reverse = arr => arr.reverse()
const first = arr => arr[0]
const toUpper = s => s.toUpperCase()

const f = _.flowRight(toUpper, first, reverse)

console.log(f(['one','two','three'])) // THREE




// 模拟 lodash 中的组合函数

function compose(...arg){
    return function(value){
        return arg.reverse().reduce(function(acc,fn){
            return fn(acc)
        },value)
    }
}

// 改写
const compose = (...arg) => value => arg.reverse().reduce((acc,fn)=>fn(acc),value)

```

**ES6 中的reduce()**
```javascript

//语法
arr.reduce(callback,[initialValue])

// 参数
callback （执行数组中每个值的函数，包含四个参数）

    1、previousValue （上一次调用回调返回的值，或者是提供的初始值（initialValue））
    2、currentValue （数组中当前被处理的元素）
    3、index （当前元素在数组中的索引）
    4、array （调用 reduce 的数组）

initialValue （作为第一次调用 callback 的第一个参数。）

```


#### 函数的组合要满足结合律(associativity)
>   我们既可以把 g 和 h 组合，还可以把 f 和 g 组合，结果都是一样的

```javascript

//结合律
let f = compose(f, g, h)
let associative = compose(compose(f, g),h) == compose(f, compose(g, h))

```

#### 函数的组合的调试

```javascript

const _ = require('lodash')

// 跟踪函数 打印并返回结果
const trace = _.curry((tag,v)=>{
    console.log(tag, v)
    return v
})

// _.split() 、 _.join、_.map都是两个参数，不能在函数组合中直接使用，所以用curry改造，注意curry的参数在函数组合中使用的参数位置
const split = _.curry((sep, str) => _.split(str, sep))
const join = _.curry((sep, array) => _.join(array, sep))
const map = _.curry((fn,array) => _.map(array,fn))

const f = _.flowRight(join('-'), trace('map 之后的'), map(_.toLower), trace('split 之后'), split(' '))

```

#### lodash 中的fp模块

-   lodash/fp
    -   lodash 的 fp 模块提供了实用的对函数式编程友好的方法
    -   提供了不可变 auto-curried iteratee-first data-last 的方法
        -   auto-curried：自动柯里化
        -   iteratee-first：函数优先
        -   data-last：数据之后



```javascript
//使用 fp 模块改造以上组合函数
const fp = require('lodash/fp')

// fp.split ===> _.curry(_.split)
// fp.map ===> _.curry(_.map)
// fp.join ===> _.curry(_.join)

const f = fp.flowRight(fp.join('-'), fp.map(fp.toLower), fp.split(' '))

```

**lodash 中的 map 和 lodash/fp 中的 map 区别**
```javascript

const _ = require('lodash')
 _.map(['23','8','10'], parseInt)
 // lodash中的map，函数需要接收3个参数
 // parseInt('23', 0, array)
 // parseInt('8', 1, array)
 // parseInt('10', 2, array)
 
 const fp = require(lodash/fp)
 fp.map(parstInt,['23','8','10'])
 // lodash/fp 中的map，函数只接收1个参数
 // parseInt('23')
```

**pointfree 模式（“无值”风格）**
>   我们可以把数据处理过程定义成与数据无关的合成运算，不需要用到代表数据的那个参数，只要把简单的运算步骤合成到一起，在使用这种模式之前我们需要定义一些辅助的基本运算函数

-   不需要指明处理的数据
-   只需要合成运算过程
-   需要定义一些辅助的基本运算函数

```javascript

// 我们之前使用的函数组合就是 pointfree 模式
const f = fp.flowRight(fp.join('-'), fp.map(fp.toLower), fp.split(' '))

```

案例

```javascript

//把一个字符串的首字母提取转换成大写，使用. 作为分隔符
// world wild web ==> w. w. w
const fp = require('lodash/fp')

// const firstLetterToUpper = fp.flowRight(fp.join(', '), fp.map(fp.first), fp.map(fp.toUpper), fp.split(' '))
// 以上写法重复了Map的遍历，使用组合函数改造

const firstLetterToupper = fp.flowRight(fp.join(', '), fp.map(fp.flowRight(fp.fitst, fp.toUpper)), fp.split(' '))

```

## Functor 函子

**为什么要学习函子？**

到目前为止已经学习了函数式编程的一些基础，但是我们还没有演示在函数式编程中如何把副作用控制在可控的范围内、异常处理、异步操作等。

**什么是Functor**

-   容器：包含值和值的变形关系（这个变形关系就是函数）
-   函子：是一个特殊的容器，通过一个普通的对象来实现，该对象属性具有 map 方法，map 方法可以运行一个函数对值进行处理（变形关系）

```javascript

class Container{
    constructor(value){
        this._value = value
    }
    // 区分面向对象和函数式，不直接使用 new
    static of (value){
        return new Container(value)
    }
    
    map(fn){
        return Container.of(fn(this._value))
    }
}

let r = Container.of(5)
        .map(x => x+2)
        .map(x => x*x)

```

**总结**

-   函数式编程的运算不直接操作值，而是由函子完成
-   函子就是一个实现了map契约的对象
-   我们可以把函子想象成一个盒子，这个盒子里封装了一个值
-   想要处理盒子中的值，我们需要给盒子的map方法传递一个处理值的函数（纯函数），由这个函数来对值进行处理
-   最终 map 方法返回一个包含新值的盒子（函子）


#### MayBe 函子

-   我们在编程的过程中可能会遇到很多错误，需要对这些错误做相应的处理
-   MayBe 函子的作用就是可以对外部的空值情况做处理（控制副作用在允许的范围）

```javascript

// MayBe 函子
class MayBe{
    static of(value){
        return new MayBe(value)
    }
    constructor(value){
        this._value = value
    }
    map(fn){
        return this.isNoting() ? MayBe.of(null) : MayBe.of(fn(this._value))
    }
    // 判断传值为 null 或者 undefined的情况
    isNoting(){
        return this._value === null || this._value === undefined
    }
}

```

#### Either 函子

-   Either 两者中的任何一个，类似于if...else的处理
-   异常会让函数变的不纯，Either函子可以用来做异常处理

```javascript

// MayBe 函子
class Left{
    static of(value){
        return new Left(value)
    }
    constructor(value){
        this._value = value
    }
    map(fn){
        return this
    }
}

class Right{
    static of(value){
        return new Right(value)
    }
    constructor(value){
        this._value = value
    }
    map(fn){
        return Right.of(fn(this._value))
    }
}

function parseJSON(str){
    try{
        return Right.of(JSON.parse(str))// 正确时执行 right
    } catch (e) {
        return Left.of({ error:e.message })// 出错时执行 left
    }
}

let r = parseJSON('{ name:'zs' }')
        .map(x => x.name.toUpperCase())

```

#### IO函子

-   IO 函子中的 _value 是一个函数，这里是把函数作为值来处理
-   IO 函子可以把不纯的动作存储到 _value 中，延迟执行这个不纯的操作（惰性执行）
-   把不纯的操作交给调用者来处理

```javascript

const fp = require(lodash/fp)

class IO{
    static of(x){
        return new IO(function(){
            return x
        })
    }
    constructor (fn) {
        this._value = fn
    }
    map(fn){
        return new IO(fp.flowRight(fn, this._value))
    }
}

// 调用
let r = IO.of(process).map( p => p.execPath)

console.log(r._value())

```

#### Task 异步执行
-   异步任务的实现过于复杂，我们使用 folktale 中的 Task 来演示
-   folktale 一个标准的函数式编程库、
    -   和lodash、ramda 不同的是，他没有提供很多功能函数
    -   只提供了一些函数式处理的操作，例如：compose、curry等，一些函子 Task、Either、MayBe 等


**folktale**
```javascript

const { compose,curry } = require('folktale/core/lambda')
const { toUpper,first } = require('lodash/fp')

// 第一个参数时传入函数的参数个数
let f = curry(2,function(x){ console.log(x+y) })
f(3, 4)
f(3)(4)

// 函数组合
lef f = compose(toUpper, first)
f(['one','two'])

```

-   folktale(2.3.2)2.x中的 Task 和 1.0 中的 Task 区别很大，1.0中的用法更接近我们现在演示的函子
-   这里以 2.3.2 来演示

```javascript

const { task } = require('folktale/concurrency/task')
const { split,find } = require('lodash/fp')

function readFile(filename){
    return task(resolver => {
        fs.readFile(filename, 'utf-8', ( err,data ) => {
            if (err) resover.reject(err)
            resolver.resolve(data)
        })
    })
}

// 调用 run 执行
readFile('package.json')
    .map(split('\n'))
    .map(find( x => x.includes('version') ))
    .run().lister({
        onRejected: err => {
            console.log(err)
        },
        onResolved: value => {
            console.log(value)
        }
    })

```


#### Pointed 函子

-   Pointed 函子是实现了 of 静态方法的函子
-   of 方法是为了避免使用 new 来创建对象，更深层的含义是 of 方法用来把值放到上下文 Context (把值放到容器中，使用 map 来处理值)

```javascript

class Container {
    static of (value){
        return new Container(value) // 获得 Container 上下文 Context
    }
    ...
}

Container.of(2)
    .map( x => x + 5 )

```


#### Monad函子（单子）

-   Monad 函子是可以变扁的 Pointer 函子，IO(IO(x))
-   一个函子如果具有 join 和 of 两个方法并遵守一些定律就是一个 Monad

```javascript

const fp = require(lodash/fp)

class IO{
    static of(x){
        return new IO(function(){
            return x
        })
    }
    constructor (fn) {
        this._value = fn
    }
    map(fn){
        return new IO(fp.flowRight(fn, this._value))
    }
    join(){
        this._value()
    }
    flatMap (fn){
        return this.map(fn).join()
    }
}

let readFile = function(fileName) {
    return new IO(function(){
        return fs.readFileSync(filename, 'utf-8')
}

let point = function(x){
    return new IO(function(){
        console.log(x)
        return x
    })
}

let r = readFile('package.json')
        .flatMap(print)
        .join()

```