# 异步编程

## 概述

**采用单线程模式工作的原因**

Javascript 是运行在浏览器端的脚本语言，目的是实现页面的动态交互，核心是DOM操作，这就决定了只能使用单线程，否则就会出现很复杂的线程同步问题。试想一下，假定同时多个线程一起工作，其中一个线程修改了一个DOM元素，而另一个线程同时又删除了这个元素，此时浏览器就无法明确以哪个线程工作结果为准，所以为了避免同步线程问题，从一开始就被设计成了单线程工作，也成了这门语言最为核心的特性之一。

什么是单线程？

指的是在JS的执行环境当中，负责执行代码的线程只有一个，依次排队执行任务

优点：安全、简单

缺点：耗时的任务会阻塞后面的任务执行

为了解决耗时任务阻塞执行的问题，Javascript将任务的执行模式分成了两种：

**同步模式**、**异步模式**

-   同步模式和异步模式的差异和存在的意义
-   单线程如何实现异步模式 =》 事件循环与消息队列
-   异步编程的几种方法
-   ES2015 Promise的异步方案、宏任务/微任务队列
-   ES2015 Generator 异步方案、ES2017 Async/Await 语法糖


## 同步模式

代码中的任务依次执行，后一个任务必须等待前一个任务结束，才能开始执行，程序的执行顺序和代码的编写顺序是完全一致的，这种方式比较简单，在单线程的情况下，大多数任务都会以同步模式去执行


## 异步模式

不会去等待这个任务的结束才开始下一个任务，对于耗时操作开启过后立即往后执行下一个任务，耗时任务的后续逻辑一般会通过回调函数的方式定义，在内部耗时任务完成过后就会自动完成传入的回调函数，如果没有这种模式，单线程的javascript 语言就无法同时处理大量耗时任务，异步的最大难点是代码的执行顺序混乱


## 回调函数
>   所有异步编程方案的根基

回调函数可以理解为一件你想要做的事情，你明确知道这件事的步骤，但是不知道这件事所依赖的任务什么时候能完成，所以最好的办法就是把这件事情的步骤写在一个函数中，交给任务的执行者，执行者是知道任务何时会结束，他就可以在任务结束后帮你执行你想要做的事情


## Promise
>   一种更优的异步编程统一方案。

**为了解决大量回调函数嵌套的问题（回调地狱），CommonJS社区提出了 Promise 的规范，在 ES2015中被标准化，成为语言规范**

**基本用法**

```javascript

const promise = new Promise(function(resolve,reject){
    // 这里用于“兑现”承诺
    
    resolve(100) // 承诺打成
    
    reject(new Error(promise rejected)) // 承诺失败
})

promise.then(function(val){
    console.log('resolved',val)
},function(error){
    console.log('rejected',error)
})

```

**封装 ajax**
```javascript

function ajax(url){
    return new Promise(function(resolve,reject){
        var xhr = new XMLHttpRequest()
        xhr.open('GET',url)
        xhr.responseType = 'json'
        xhr.onload = function(){
            if(this.status === 200){
                resolve(this.response)
            }else{
                reject(new Error(this.statusText))
            }
        }
        xhr.send()
    })
}

ajax('/api/users.json').then(function(res){
    console.log(res)
},function(error){
    console.log(error)
})

```

**误区**

```javascript

// 避免嵌套使用promise，否则还不如使用传统的异步方式
ajax('/api/urls.json').then(function(urls){
    ajax(url.users).then(function(urls){
        ajax(url.users).then(function(urls){
            
        })
    })
})

```

**链式调用**

相比于传统回到函数的方式，promise最大优势就是能链式调用，这样可以最大程度的避免回调嵌套

```javascript
// Promise 对象的 then 方法会返回一个全新的 Promise 对象
// 后面的 then 方法就是在为上一个 then 返回的promise注册回调
// 前面 then 方法中的回调函数的返回值会作为后面 then 方法回调的参数
// 如果回调中返回的是 Promise，那后面 then 方法的回调会等待它的结束

ajax('/api/urls.json').then(function(urls){
    console.log(111)
    return ajax(urls.users)
})
.then(function(value){
    console.log(222)
    return ajax(urls.users)
})
.then(function(value){
    console.log(333)
    return ajax(urls.users)
})
.then(function(value){
    console.log(444)
    return 'foo'
})
.then(function(value){
    console.log(value) // foo
})
.then(function(value){
    console.log(value) // undefined
})


```

**Promise异常处理**

```javascript

function ajax(url){
    return new Promise(function(resolve,reject){
        var xhr = new XMLHttpRequest()
        xhr.open('GET',url)
        xhr.responseType = 'json'
        xhr.onload = function(){
            if(this.status === 200){
                resolve(this.response)
            }else{
                reject(new Error(this.statusText))
            }
        }
        xhr.send()
    })
}

ajax('/api/users.json')
    .then(function onfulfilled (res){
        console.log(res)
    },function onReject (error){
        console.log(error)
    })

// 使用 catch 方法注册 onreject 回调
ajax('/api/users.json')
    .then(function onfulfilled (res){
        console.log(res)
    })
    .catch(function onReject(error){
        console.log(error)
    })

// catch 方法实际上就是 then 的一个别名，第一个参数传递了一个 undefined
ajax('/api/users.json')
    .then(function onfulfilled (res){
        console.log(res)
    })
    .then( undefined,function onReject(error){
        console.log(error)
    })
    
// catch 会更常用，因为更适合链式调用，Promise链条上任何一个异常都会被一直向后传递，直至被捕获
```

**静态方法**

```javascript

// Promise.resolve() 快速把一个值转换为 一定成功的 Promise 对象
Promise.resolve('foo')
    .then(function (value){
        console.log(value) // foo
    })

var promise = ajax('/api/users.json')
var promise2 = Promise.resolve(promise) // 原封不动返回该 promise
console.log(promise === promise2) // true


// 如果传入的是一个对象，并且有 then 一样的方法，这样的对象也可以作用一个Promise对象被执行
Promise.resolve({
    then:function(onFulfilled, onRejected){
        onFulfilled('foo')
    }
})
.then(function(value){
    console.log(value) // foo
})




// Promise.reject() 快速把一个值转换为一定失败的 Promise 对象
Promise.reject('anything')
    .catch(function (error){
        console.log(error) // foo
    })


```



**并行执行**
 
Promise.all() 等待所有任务结束（所有任务都成功）
 
```javascript

function ajax(url){
    return new Promise(function(resolve,reject){
        var xhr = new XMLHttpRequest()
        xhr.open('GET',url)
        xhr.responseType = 'json'
        xhr.onload = function(){
            if(this.status === 200){
                resolve(this.response)
            }else{
                reject(new Error(this.statusText))
            }
        }
        xhr.send()
    })
}

var promise = Promise.all([
    ajax('/api/users.json'),
    ajax('/api/posts.json')
])

promise.then(function(values){
    console.log(values)
}).catch(function(error){
    console.log(error)
})



// 组合使用串行和并行
ajax('/api/urls.json')
    .then(value=>{
        const urls = Object.value(value)
        const tasks = urls.map(url=>ajax(url))
        return Promise.all(tasks)
    })
    .then(values=>{
        console.log(values)
    })


```

Promise.race() 只会等待第一个任务的结束（以第一个任务的结果为准）
，经常用来实现 ajax 请求超时控制的一种方式
```javascript

const request = ajax('/api/posts.json')
const timeout = new Promise((resolve,reject) =>{
    setTimout(() => reject( new Error('timeout') ),500)
})

Promise.race([
    request,
    timeout
])
.then(value =>{
    console.log(value)
})
.catch(error =>{
    console.log(error) // 如果首先捕获了异常，则终止
})

```


**Promise执行时序**

想象这样一个场景：

在银行的柜台有一队等待办理业务的队伍，你办理完成了主要业务后，突然想起需要办一张信用卡，柜台的工作人员会紧接着给你办理，而不是让你重新排队，因为那样比较耗费时间和资源

场景中的队伍，可以看作是消息队列中等待执行的回调队列，每一个排队的人就是一个回调任务，我们称为“宏任务”，在JS中大部分异步调用都是宏任务，而办理信用卡是完成主要任务后，我们临时多了一个小任务，这种任务我们称为“微任务”，是作为当前任务的“微任务”，直接在当前任务结束过后立即执行，而不是重新排队，而Promise的回调就是作为“微任务”执行的

```javascript

console.log('global start')

setTimeout(()=>{
    console.log('setTimeout')
},0)

Promise.resolve()
    .then(()=>{
        console.log('Promise')
    })
    .then(()=>{
        console.log('Promise 2')
    })
    .then(()=>{
        console.log('Promise 3')
    })

console.log('global end')

// 执行顺序：
// global start
// global end
// Promise
// Promise 2
// Promise 3
// setTimeout

```


## Generator 异步方案
>   ES2015提供的生成器函数

Promise的最大好处就是可以链式调用，但是没有办法达到传统同步代码的可读性

```javascript

// 生成器函数语法
// 普通的函数基础之上，多了一个*号
function* foo(){
    console.log('start')
    
    // 使用 try catch 捕获生成器对象抛出的异常
    try{
        yield 'foo' // 随时使用 yield 返回一个值，yield关键字并不像 return 一样结束函数的执行，只是暂停这个生成器函数的执行，直到外界下一次调用生成器对象的 next 方法时，就会继续从这个位置往下执行
    
        // const res = yield 'foo' // 接收 next 传入的参数
    }catch(e){
        
    }
    
    
}

const generator = foo() // 调用生成器函数并不会立即执行函数，而是得到一个生成器对象

//generator.next() // 直到我们调用这个对象的next方法，这个函数的函数体才会开始执行

//generator.next('bar') // 如果调用next传入参数，该参数会作为 yield 语句的返回值

// generator.throw(new Error('Generator error')) // 手动调用生成器的 throw 方法，就可以对生成器内部抛出一个异常

const result = generator.next()
console.log(result) // result对象中有一个done，true表示是否是最后一个yield，即这个生成器是否全部执行完了

```

**借助 yield 可以暂停生成器函数执行的特点，来使用生成器函数去实现更优的异步编程体验**

```javascript

function ajax(url){
    return new Promise(function(resolve,reject){
        var xhr = new XMLHttpRequest()
        xhr.open('GET',url)
        xhr.responseType = 'json'
        xhr.onload = function(){
            if(this.status === 200){
                resolve(this.response)
            }else{
                reject(new Error(this.statusText))
            }
        }
        xhr.send()
    })
}

function* main(){
    const userr = yield ajax('/api/users.json')
    console.log(users)
    
    const posts = yield ajax('/api/posts.json')
    console.log(posts)
}

const g = main()

let result = g.next()

result.value.then(data =>{
    const result2 = g.next(data)
    
    if(result2.done) return
    
    result2.value.then(data =>{
        g.next(data)
    })
})


```

使用递归的方式改造通用的生成器函数
```javascript

function ajax(url){
    return new Promise(function(resolve,reject){
        var xhr = new XMLHttpRequest()
        xhr.open('GET',url)
        xhr.responseType = 'json'
        xhr.onload = function(){
            if(this.status === 200){
                resolve(this.response)
            }else{
                reject(new Error(this.statusText))
            }
        }
        xhr.send()
    })
}

function* main(){
    try{
        const userr = yield ajax('/api/users.json')
        console.log(users)
        
        const posts = yield ajax('/api/posts.json')
        console.log(posts)
    }catch(err){
        console.log(err)
    }
}

// 封装
function co(generator){
    const g = generator()

    function handleResult (result){
        if(result.done) return
        restule.value.then(data=>{
            handleResult(g.next(data))
        }, error =>{
            g.throw(error)
        })
    }
    
    handleResult(g.next()) 
}

co(main)

// 社区有更完善的 co 库 https://github.com/tj/co，15年之前特别流行，后来有 async await


```

## Async / await 语法糖

>   语言层面的异步编程标准

```javascript

function ajax(url){
    return new Promise(function(resolve,reject){
        var xhr = new XMLHttpRequest()
        xhr.open('GET',url)
        xhr.responseType = 'json'
        xhr.onload = function(){
            if(this.status === 200){
                resolve(this.response)
            }else{
                reject(new Error(this.statusText))
            }
        }
        xhr.send()
    })
}

// 语法糖相比生成器函数最大的好处就是不需要在配置 co 这样的执行器，因为它是语言层面的标准异步编程语法，并且 await 返回一个 promise 对象

async function main(){
    try{
        const userr = await ajax('/api/users.json')
        console.log(users)
        
        const posts = await ajax('/api/posts.json')
        console.log(posts)
    }catch(err){
        console.log(err)
    }
}


```