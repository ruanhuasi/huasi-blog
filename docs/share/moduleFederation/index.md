# 模块联邦 Module Federation

## 引言
> 结论：Webpack5 模块联邦让 Webpack 达到了线上 Runtime 的效果，让代码直接在项目间利用 CDN 直接共享，不再需要本地安装 Npm 包、构建再发布了

## 三个概念
> 首先，要理解三个重要的概念：

- webpack构建  一个独立项目通过webpack打包编译而产生资源包
- remote  一个暴露模块供其他webpakc构建消费的webpack构建
- host  一个消费其他remote模块的webpack构建

> 一言以蔽之，一个 webpack 构建可以是 remote（服务的提供方），也可以是 host（服务的消费方），也可以同时扮演服务提供者和服务消费者，完全看项目的架构

## 类似微前端
> 微前端其本质是服务的拆分与隔离，最大程度地减少服务之间的冲突与碰撞。

webpack的模块联邦做的事情与此差不多，不过，webpack模块联邦有更多的优点：
- 基于webpack生态，学习成本、实施成本低。毕竟大多数项目都在webpack
- 天生的工程化，npm各种包任你发挥
- 开箱即用，配置简单易上手，官方也提供了基于各种框架的版本（如：`vite`）

## 案例操作

```javascript
chainWebpack: (config) => {
    config
      .plugin("module-federation-plugin")
      .use(require("webpack").container.ModuleFederationPlugin, [
        {
          name: "app1", // 模块名称
          filename: "remoteEntry.js",
          exposes: {
            // 对外暴露的组件
            "./HelloWorld": "./src/components/HelloWorld.vue"
          }
        }
      ]);
    config.optimization.delete("splitChunks");
  },
```

home 项目消费组件

```javascript
chainWebpack: (config) => {
    config
      .plugin("module-federation-plugin")
      .use(require("webpack").container.ModuleFederationPlugin, [
        {
          name: "home",
          remotes: {
            // 导入
            app1: "app1@http://localhost:8084/remoteEntry.js"
          }
        }
      ]);
  },
```

## 基本原理

> 从host的代码着手，简单分析这一切是如何交互、工作的

程序从main.js里的一段代码开始

```javascript
__webpack__require__.e("bootstrap_js").then(__webpack_require__.bind(__webpack_require__,"./bootstrap.js"))
```

> `__webpack_require__.e("bootstrap_js")`是加载id为 bootstrap_js 的chunk的所有依赖，返回一个promise 等一切依赖就绪，再获取./bootstrap.js模块并执行

这里是__webpack_require__.e的代码：

```javascript
__webpack_require__.e = (chunkId) => {
	return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
		__webpack_require__.f[key](chunkId, promises);
		return promises;
	}, []));
};
```

上面一段代码做了一件事，遍历__webpack_require__.f对象并依次执行对象里的成员函数，此时该对象有两个成员

综上，`bootstrap_js`对应了两个`promises`：

- 一个负责远程依赖加载
- 另一个负责本地加载

等到所有依赖模块加载完准备就绪，才会require模块并执行。

## 总结
模块联邦为更大型的前端应用提供了开箱解决方案，并已经作为 Webpack5 官方模块内置，可以说是继 Externals 后最终的运行时代码复用解决方案。