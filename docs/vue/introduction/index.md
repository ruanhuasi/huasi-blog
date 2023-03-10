# Vue 入门

## 开发环境准备


- node.js [下载](https://nodejs.org/zh-cn/)
- vscode [下载](https://code.visualstudio.com/)


## vue-cli安装及使用

**安装**

```bash
npm i -g @vue/cli
```

**使用**

快速原型开发

```bash
npm install -g @vue/cli-service-global
```

启动开发服务器

```bash
vue serve ./Hello.vue
```

创建项目
```bash
vue create project-name
```

安装vue-router
```bash
vue add router
```

## Hello World

```javascript
<div id="app">{{title}}</div>
<script src="vue.js"></script>
<script>
const app = new Vue({
  el:'#app',
  data: {
  title: 'hello vue'
}
})
setTimeout(() => {
  app.title = 'Hello World'
}, 1000);
</script>
```

## 设计思想

- 数据驱动应用
- MVVM模式的践行者

MVVM框架的三要素：响应式、模板引擎及其渲染
响应式：vue如何监听数据变化？
模版：vue的模版如何编写和解析？
渲染：vue如何将模板转换为html？

## 模板语法
> Vue.js 使用了基于 HTML 的模板语法，允许开发者声明式地将 DOM 绑定至底层 Vue 实例的数据。所
有 Vue.js 的模板都是合法的 HTML，所以能被遵循规范的浏览器和 HTML 解析器解析

**插值文本**

数据绑定最常见的形式就是使用“Mustache”语法 (双大括号) 的文本插值

```javascript
<div id="app">
<h2>
  <!-- 插值文本 -->
  {{title}}
</h2>
</div>
<script src="vue.js"></script>
<script>
const app = new Vue({
el: '#app',
  data: {
  title: '我是一个标题'
  }
})
</script>
```

HTML特性不能用Mustache 语法，应该使用v-bind指令

```javascript
<div id="app">
  <!-- 特性、属性值绑定使用v-bind指令 -->
  <h2 v-bind:title="title">...</h2>
</div>
```

**列表渲染**
> 我们可以用 v-for 指令基于一个数组来渲染一个列表。 v-for 指令需要使用 item in items 形式的
特殊语法，其中 items 是源数据数组，而 item 则是被迭代的数组元素的别名

```javascript
<div id="app">
<!-- 条件渲染 -->
<p v-if="fruits.length == 0">没有任何水果</p>
  <!-- 列表渲染 -->
  <ul>
    <li v-for="f in fruits">{{f}}</li>
  </ul>
</div>
<script src="vue.js"></script>
<script>
const app = new Vue({
  el: '#app',
  data: {
    fruits: ['苹果', '香蕉']
  }
})
</script>
```


**表单输入绑定**

> 你可以用 `v-model` 指令在表单 `<input>` 、 `<textarea>` 及 `<select>` 元素上创建双向数据绑定。它
会根据控件类型自动选取正确的方法来更新元素。 `v-model` 本质上是语法糖。它将转换为输入事件以
更新数据，并对一些极端场景进行一些特殊处理

```html
<!-- 表单输入绑定 -->
<input v-model="fruit" type="text" v-on:keydown.enter="addfruits"/>
```

**事件处理**
> 可以用 `v-on` 指令监听 `DOM` 事件，并在触发时运行一些 JavaScript 代码

```javascript
<!-- 事件处理 -->
<button v-on:click="addfruits">新增水果</button>
<script>
const app = new Vue({
methods: {
  addfruits() {
    this.fruits.push(this.fruit);
  }
},
})
</script>
```

**class与style绑定**
> 操作元素的 `class` 列表和内联样式是数据绑定的一个常见需求。因为它们都是属性，所以我们可以用 `v-
bind` 处理它们：只需要通过表达式计算出字符串结果即可。不过，字符串拼接麻烦且易错。因此，在
将 `v-bind` 用于 `class` 和 `style` 时，`Vue.js` 做了专门的增强。表达式结果的类型除了字符串之外，
还可以是对象或数组

```vue
<style>
.active {
  background-color: #ddd;
}
</style>

<ul>
<!-- class绑定 -->
<li v-for="c in courses" :class="{active: (selectedFruit === c)}" @click="selectedFruit = c"></li>{{c}}</li>
</ul>

<script>
const app = new Vue({
  data: {
  // 保存选中项
    selectedFruit: '',
  },
})
</script>

```

****

## 计算属性和监听器

> 模板内的表达式非常便利，但是设计它们的初衷是用于简单运算的。在模板中放入太多的逻辑会让模板
过重且难以维护，此时就可以考虑计算属性和监听器。

```vue
<p>
<!-- 绑定表达式 -->
<!-- 水果总数：{{fruits.length + '个'}} -->
<!-- 计算属性 -->
<!-- 水果总数：{{total}} -->
<!-- 监听器 -->
水果总数：{{totalCount}}
</p>
<script>
const app = new Vue({
computed: {
  total() {
    return this.fruits.length + '个'
  }
},
// 下面这种不能生效，因为初始化时不会触发
// watch: {
// fruits(newValue, oldValue) {
// this.totalCount = newValue.length + '个'
// }
// },
watch: {
  fruits: {
    immediate: true,
    // deep: true,
    handler(newValue, oldValue) {
      this.totalCount = newValue.length + '个'
    }
  }
},
})
</script>
```

## 生命周期
> 每个 Vue 实例在被创建时都要经过一系列的初始化过程——例如，需要设置数据监听、编译模板、将实
例挂载到 DOM 并在数据变化时更新 DOM 等，称为Vue实例的生命周期

**使用生命周期钩子**
> 在Vue实例的生命周期过程中会运行一些叫做生命周期钩子的函数，这给用户在不同阶段添加自己代码
的机会

异步获取列表数据

```javascript
// 模拟异步数据调用接口
function getFruits() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(['苹果', '香蕉'])
    }, 2000);
  })
}
const app = new Vue({
  // created钩子中调用接口
  async created() {
    const fruits = await getFruits()
    this.fruits = fruits
  },
}
```

- 三个阶段：初始化、更新、销毁
- 初始化：beforeCreate、created、beforeMount、mounted
- 更新：beforeUpdate、updated
- 销毁：beforeDestroy、destroyed

**使用场景分析**

```javascript
{
  beforeCreate(){} // 执行时组件实例还未创建，通常用于插件开发中执行一些初始化任务
  created(){} // 组件初始化完毕，各种数据可以使用，常用于异步数据获取
  beforeMounted(){} // 未执行渲染、更新，dom未创建
  mounted(){} // 初始化结束，dom已创建，可用于获取访问数据和dom元素
  beforeUpdate(){} // 更新前，可用于获取更新前各种状态
  updated(){} // 更新后，所有状态已是最新
  beforeDestroy(){} // 销毁前，可用于一些定时器或订阅的取消
  destroyed(){} // 组件已销毁，作用同上
}
```

## 必会API

**数据相关API**

Vue.set

> 向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新。
使用方法： Vue.set(target, propertyName/index, value)

范例：批量设置商品价格

```vue
<template>
  <!--添加批量价格更新-->
  <p>
    <input v-model.number="price">
    <button @click="batchUpdate">批量更新价格</button>
  </p>
  <div class="fruits-list" v-else>
    <div v-for="c in fruits" :key="c.name">
    <!--添加批量价格更新-->
    {{ c.name }} - ￥{{c.price}}
    </div>
  </div>
</template>
<script>
function getFruits() {
  return new Promise(resolve => {
    setTimeout(() => {
      // 修改返回数据结构为对象
      resolve([{ name: '苹果' }, { name: '香蕉' }])
    }, 2000);
  })
}
const app = new Vue({
  data() {
    return {
      price: 0 // 增加价格数据
    }
    },
    methods: {
      // 添加批量价格更新方法
      batchUpdate() {
        this.fruits.forEach(c => {
          // c.price = this.price; // no ok
          Vue.set(c, 'price', this.price); // ok
        })
      }
  },
}
</script>
```

Vue.delete
> 删除对象的属性。如果对象是响应式的，确保删除能触发更新视图。
使用方法： Vue.delete(target, propertyName/index)

**事件相关API**

vm.$on
> 监听当前实例上的自定义事件。事件可以由 vm.$emit 触发。回调函数会接收所有传入事件触发函数的
额外参数

```javascript
vm.$on('test', function (msg) {
  console.log(msg)
})
```

vm.$emit
> 触发当前实例上的事件。附加参数都会传给监听器回调。

```javascript
vm.$emit('test', 'hi')
```

**典型应用：事件总线**

> 通过在Vue原型上添加一个Vue实例作为事件总线，实现组件间相互通信，而且不受组件间关系的影响

```javascript
Vue.prototype.$bus = new Vue();
```
> 这样做可以在任意组件中使用 this.$bus 访问到该Vue实例

范例：批量清除多个消息窗口

```css
/*重构样式：提取出.success，并添加.warning*/
.message-box {
  padding: 10px 20px;
}
.success {
  background: #4fc08d;
  border: 1px solid #42b983;
}
.warning {
  background: #f66;
  border: 1px solid #d63200;
}
```

```html
<!--给之前新增成功消息添加.success-->
<message :show.sync="show" class="success">...</message>
<!--新增警告提示窗-->
<message :show.sync="showWarn" class="warning">
<template v-slot:title>
  <strong>警告</strong>
</template>
<template v-slot:default>
  请输入水果名称！
</template>
</message>
```

```javascript
const app = new Vue({
  data() {
    return {
      // 控制警告信息显示状态
      showWarn: false,
    }
  },
  methods: {
    addFruits() {
        // 增加输入校验
      if (this.fruits) {
        // ...
      } else {
        // 提示警告信息
        this.showWarn = true
      }
    }
  },
})
```

下面实现功能：

```javascript
// 弹窗组件
Vue.component('message', {
  // ...
  // 监听关闭事件
  mounted () {
    this.$bus.$on('message-close', () => {
      this.$emit('update:show', false)
    });
  },
})
```

```html
<!-- 派发关闭事件 -->
<div class="toolbar">
  <button @click="$bus.$emit('message-close')">清空提示框</button>
</div>
```

vm.$once

> 监听一个自定义事件，但是只触发一次。一旦触发之后，监听器就会被移除

```javascript
vm.$on('test', function (msg) {
  console.log(msg)
})
```

vm.$off

> 移除自定义事件监听器

- 如果没有提供参数，则移除所有的事件监听器
- 如果只提供了事件，则移除该事件所有的监听器
- 如果同时提供了事件与回调，则只移除这个回调的监听器

```javascript
vm.$off() // 移除所有的事件监听器
vm.$off('test') // 移除该事件所有的监听器
vm.$off('test', callback) // 只移除这个回调的监听器
```

**组件或元素引用**

ref和vm.$refs

> `ref` 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 `$refs` 对象上。如果在普通
的 `DOM` 元素上使用，引用指向的就是 `DOM` 元素；如果用在子组件上，引用就指向组件

范例：设置输入框焦点

```vue
<input type="text" ... ref="inp">
mounted(){
  // mounted之后才能访问到inp
  this.$refs.inp.focus()
}
```

范例：改造message组件用打开、关闭方法控制显示

```vue
<!--自定义组件引用-->
<message ref="msg">新增水果成功！</message>
<script>
  Vue.component('message', {
    // 组件显示状态
    data() {
      return {
        show: false
      }
    },
    template: `
      <div class="message-box" v-if="show">
        <slot></slot>
        <!--toggle内部修改显示状态-->
        <span class="message-box-close" @click="toggle">X</span>
      </div>
    `,
    // 增加toggle方法维护toggle状态
    methods: {
      toggle() {
        this.show = !this.show;
      }
    },
    // 修改message-close回调为toggle
    mounted () {
      this.$bus.$on('message-close', this.toggle);
    },
    })
    const app = new Vue({
    methods: {
      addFruits() {
        // 使用$refs.msg访问自定义组件
        this.$refs.msg.toggle()
      }
    }
  })
</script>

```

注意：
- ref 是作为渲染结果被创建的，在初始渲染时不能访问它们
- $refs 不是响应式的，不要试图用它在模板中做数据绑定
- 当 v-for 用于元素或组件时，引用信息将是包含 DOM 节点或组件实例的数组