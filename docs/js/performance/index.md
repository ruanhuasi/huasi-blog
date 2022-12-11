# JavaScript 性能优化

## 概述

-   内存管理
-   垃圾回收与常见 GC 算法
-   V8 引擎的垃圾回收
-   Performance 工具
-   代码优化实例


## JS 内存管理

**内存管理介绍**

内存：由可读写单元组成，表示一片可操作空间

管理：人为的去操作一片空间的申请、使用和释放

内存管理：开发者主动申请空间、使用空间、释放空间

管理流程：申请-使用-释放



**JS 内存管理**

1. 申请内存空间

2. 使用内存空间

3. 释放内存空间

和其他语言一样，分三步来执行这个过程，但是 ES 没有相应的操作API，所以 JS 不能像其他语言那样去主动调用相应的 API 来完成空间的管理

```javascript

// 申请空间
let obj = {}

// 使用空间
obj.name = 'lg'

// 释放空间
obj = null

```


## JS 中的垃圾回收
> JS中的垃圾回收就是找到垃圾，让JS的执行引擎来进行空间的释放和回收

- JS 中的内存管理是自动的
- 对象不再被引用时是垃圾
- 对象不能从根上访问到时是垃圾


**可达对象**

-   可以访问到的对象就是可达对象（引用、作用域链）
-   可达的标准就是从根出发是否能够被找到
-   JS 中的根就可以理解为是全局变量对象


## GC 算法

-   GC 垃圾回收机制的简写
-   GC 可以找到内存中的垃圾、并释放和回收空间
-   算法就是工作时查找和回收所遵循的规则


**引用计数算法**
> 靠着当前对象引用计数的数值来判断是否为0，从而判断它是否是一个垃圾对象

优点：

-   发现垃圾时立即回收
-   最大限度减少程序暂停

缺点：

-   无法回收循环引用的对象
-   时间开销大


**标记清除算法**

-   核心思想：分标记和清除二个阶段完成
-   1.遍历所有对象找到标记活动对象
-   2.遍历所有对象清除没有标记的对象
-   回收相应的空间


优点：

-   相对引用计数法，它可以回收循环引用的对象

缺点：

-   不会立即回收垃圾对象
-   空间碎片化（由于当前所回收的垃圾对象，在地址上是不连续的，造成回收之后会分散在各个角落，后续想要使用的时候，如果新的生成空间和碎片刚好大，就可以使用，一旦多了或者少了就不太适合使用）



**标记整理算法**

-   标记整理可以看作是标记清除的增强
-   标记阶段的操作和标记清除一致
-   清除阶段会先执行整理，移动对象位置（让它们的地址产生连续，减少碎片）


优点：

-   减少碎片化空间

缺点：

-   不会立即回收垃圾对象


## V8

-   V8 是一款主流的 JS 执行引擎
-   V8 采用即时编译（速度很快）
-   V8 内存设限（64位：1.5G   32位：800M）
    -   原因1：V8 本身是为浏览器而制造的，对网页应用够用
    -   原因2：V8 的垃圾回收机制适合这种设定


### V8 垃圾回收策略

-   采用分代回收的思想（因为内存设限）
-   内存分为新生代、老生代
-   针对不同对象采用不同算法


**V8 中常用GC算法**

-   分代回收
-   空间复制
-   标记清除
-   标记整理
-   标记增量


### V8 如何回收新生代对象

**V8 内存分配**
-   V8 内存空间一分为二
-   小空间用于存储新生代（32M|16M）
-   新生代指的是存活时间比较短的对象


**新生代对象回收实现**
-   回收过程采用复制算法+标记整理
-   新生代内存区分为二个等大小空间
-   使用空间为 From，空闲空间为 To
-   活动对象存储于 From 空间
-   标记整理后将活动对象拷贝至 To
-   From 与 To 交换空间完成释放


**回收细节说明**
-   拷贝过程中可能出现晋升
-   晋升就是将新生代对象移动到老生代
-   一轮 GC 还存活的新生代需要晋升
-   TO 空间的使用率超过 25%


### V8 如何回收老生代对象
-   老年代对象存放在右侧老生代区域
-   64位操作系统 1.4G，32位操作系统 700M
-   老年代对象就是指存活时间较长的对象

**老年代对象回收实现**
-   采用标记清除、标记整理、增量标记算法
-   首先使用标记清除完成垃圾k空间的回收
-   采用标记整理进行空间优化
-   采用增量标记进行效率优化

**细节对比**
-   新生代区域垃圾回收使用空间换时间
-   老生代区域垃圾回收不适合复制算法


## Performance 工具

**为什么使用 Performance**
>   通过 Performance 时刻监控内存
-   GC 的目的是为了实现内存空间的良性循环
-   由于 ES 没有提供相应操作内存空间的 API ，所以我们不知道是否合理
-   良性循环的基石是合理使用
-   时刻关注才能确定是否合理
-   Performance 提供多种监控方式

### Performance 使用步骤
-   打开浏览器输入目标网址
-   进入开发人员工具面板，选择性能
-   开启录制功能，访问具体界面
-   执行用户行为，一段时间后停止录制
-   分析界面中记录的内存信息



### 内存存在的外在表现

-   页面出现延迟加载或经常性暂停
-   页面持续性出现糟糕的表现
-   页面的性能随时间延长越来越差


### 监控内存的几种方式

**界定内存问题的标准**

-   内存泄漏：内存使用持续升高
-   内存膨胀：在多数设备上都存在性能问题
-   频繁垃圾回收：通过内存变化图进行分析


**监控内存的几种方式**
-   浏览器任务管理器
-   Timeline时序图记录
-   堆快照查找分离 DOM
-   判断是否存在频繁的垃圾回收


**任务管理器监控内存**

chrome 

>   一般来说，浏览器任务管理更多的是只能帮我们发现问题，不能定位问题
```cmd
shift + esc 调出浏览器任务管理器

右键选择显示列

内存：DOM 节点占据的内存，一般来说数值有变说明有着频繁的 DOM 操作

JavaScript 内存： 表示的是 JS 的堆，小括号中表示可达对象正在使用的内存大小，如果这个值一直增加，没有变小的过程，那就意味着这个内存一直往上走的，没有 GC 消耗，那就是存在问题的
```


**Timeline记录内存**
>   通过时间线记录内存变化，可以发现内存问题是什么节点发生的
```cmd

在浏览器的 Performance 工具中，着重查看 JS堆 内存图表的变化，如果是一直上升而没有下降，说明内存是只有增长没有回收的操作，如果有高有低像长城一样平稳的，则是相对正常的

```

**堆快照查找分离 DOM**

什么是分离 DOM 
-   界面元素存活在 DOM 树上
-   垃圾对象的 DOM 节点
-   分离状态的 DOM 节点
 
 

```javascript
        
        // 分离 DOM ：创建了 DOM 节点，但没有往界面上添加，但是存在 堆中，这就是一种空间浪费
        
        let tmEle

        function fn() {
            let ul = document.createElement('ul')
            for (let i = 0; i < 10; i++) {
                let li = document.createElement('li')
                ul.appendChild(li)
            }
            tmEle = ul
        }

        document.getElementById('btn').addEventListener('click',fn)

```

**堆快照功能**
>   把我们的堆拍个照，找一下是否存在分离 DOM ，在界面中不体现，但在内存中的确存在，这个时候是一种内存浪费，我们要做的就是定位到代码里那些分离 DOM 存在的位置，想办法清除掉
```cmd

1.浏览器调试工具
2.内存选项（Memory）
3.堆快照（Heap snapshot）
4.获取快照（Take snapshot）
(配置文件（Profiles）)
5.筛选 deta
6.查看分离 DOM

```



**判断是否存在频繁的垃圾回收**

为什么确定频繁垃圾回收

-   GC 工作时应用程序是停止的
-   频繁且过长的 GC 会导致应用假死
-   用户使用中感知应用卡顿

1. Timeline 中频繁的上升下降
2. 任务管理器中数据频繁的增加减小


## 代码优化

**如何精准测试 JS 性能**

-   本质上就是采集大量的额执行样本进行数学统计分析
-   使用基于 Benchmark.js 的 [https://jsperf.com/](https://jsperf.com/) 完成

jsperf 使用步骤

-   使用 GitHub 帐号登录
-   填写个人信息（非必填）
-   填写详细的测试用例信息（title、slug）
-   填写准备代码（DOM 操作时经常使用）
-   填写必要有 setup 与 teardown 代码
-   填写测试代码


### 慎用全局变量

-   全局变量定义在全局执行上下文，是所有作用域链的顶端
-   全局执行上下文一直存在于上下文执行栈，直到程序退出
-   如果某个局部作用域出现了同名变量则会遮蔽或污染全局


### 缓存全局变量
>   将使用中无法避免的全局变量缓存到局部

```javascript

        function getBtn(){
            let oBtn1 = document.getElementById('btn1')
            let oBtn3 = document.getElementById('btn3')
            let oBtn5 = document.getElementById('btn5')
            let oBtn7 = document.getElementById('btn7')
            let oBt9 = document.getElementById('btn9')
        }
        
        // 缓存全局变量
        function getBtn2(){
            let obj = document
            let oBtn1 = obj.getElementById('btn1')
            let oBtn3 = obj.getElementById('btn3')
            let oBtn5 = obj.getElementById('btn5')
            let oBtn7 = obj.getElementById('btn7')
            let oBt9 = obj.getElementById('btn9')
        }

```

### 通过原型新增方法

```javascript

var fn1 = function(){
    this.foo = function(){
        console.log(111)
    }
}

let f1 = new fn1()

// 更优
var fn2 = function(){
    fn2.prototype.foo = function(){
        console.log(111)
    }
}

let f2 = new fn2()
```


### 避开闭包陷阱

```javascript

闭包特点

// 外部具有指向内部的引用
// 在“外”部作用域访问“内”部作用域的数据

function foo(){
    var name = 'lg'
    function fn(){
        console.log(name)
    }
    return fn
}

var a = foo()
a()

```


**关于闭包**

-   闭包是一种强大的语法
-   闭包使用不当很容易出现内存泄漏
-   不要为了闭包而闭包

```javascript

        function foo(){
            var el = document.getElementById('btn')
            el.onclick = function(){
                console.log(el.id);
            }
        }

        foo()



// -----------------------------------------------------

        function foo(){
            var el = document.getElementById('btn')
            el.onclick = function(){
                console.log(el.id);
            }
            el = null // 清除元素之后，DOM 对它的应用消失了，代码对它的引用也消失了，内存得以释放
        }

        foo()

```



### 避免属性访问方法的使用

**JS 中的面向对象**

-   JS 不需要属性的访问方法，所有属性都是外部可见的
-   使用属性访问方法只会增加一层重定义，没有访问的控制力

```javascript

function Person(){
    this.name = 'icoder'
    this.age = 18
    this.getAge = function(){
        return this.age
    }
}

const p1 = new Person()
const a = p1.getAge()



// 性能更优

function Person(){
    this.name = 'icoder'
    this.age = 18
    this.getAge = function(){
        return this.age
    }
}

const p2 = new Person()
const b = p2.age

```


### For循环优化

```javascript

var a = [1,2,3,4,5,6,7,8,9 ]

for(var i=0;i<a.length;i++){
    console.log(a[i])
}

// 更优
for(var i=0,len = a.length;i<len;i++){
    console.log(a[i])
}

```

### 采用最优的循环方式
```javascript

// 如果只是简单的遍历
 forEach > 优化后的For > for in

```


### 节点添加优化

```javascript

for(var i=0;i<10;i++){
    var oP = document.createElement('p')
    oP.innerHtml = i
    document.body.appendChild(oP)
}


// 优化

const fragEle = document.createDocumentFragment() // 文档碎片容器

for(var i=0;i<10;i++){
    var oP = document.createElement('p')
    oP.innerHtml = i
    fragEle.appendChild(oP)
}
document.body.appendChild(fragEle)

```


### 克隆优化节点操作

```javascript

// <p id="box1">old</p>

for(var i=0;i<10;i++){
    var oP = document.createElement('p')
    oP.innerHtml = i
    document.body.appendChild(oP)
}


// 优化

const oldP = document.getElementById('box1')

for(var i=0;i<10;i++){
    var newP = oldP.cloneNode(false) //克隆
    newP.innerHtml = i
    document.body.appendChild(oP)
}

```


### 直接量替换

直接量替换 Object 操作
```javascript

var a = [1, 2, 3] // 字面量更优

var a1 = new Array(3)
a1[0] = 1
a1[1] = 2
a1[2] = 3



```