# 前端监控

## 前言
> 在开发过程中，我们通常会在本地环境中测试我们的应用，但是这并不能完全反映应用在真实环境中的表现。在真实环境中，我们的应用可能会面临各种各样的问题，例如性能问题、错误和用户体验问题等。


## 前端应用监控的重要性

- 先来看看用户故事

```
产品：紧急呼叫华斯！线上报错了，用户提交不了！

我：稍等~

...

我：emmm，我没复现到，要不让用户刷新一下试试？记得清一下缓存

产品：还是不行~

产品：我这边又可以的，真奇怪啊

我：...
```

在反复调试之后，确实发现了问题，虽然测试同事有一定的责任，但我们的代码里是可能存在一些潜在问题的，只是需要一些触发条件。

**从用户反馈到找到问题，有时会花费我几个小时的时间**

<u>由此可见，如果我们有监控系统，将会大大节省排错的时间，同时也可以降低缺陷对业务产生的风险</u>

## Sentry介绍

> 官网文档 https://docs.sentry.io/

`Sentry`是一个开源的错误监控和异常跟踪工具，它可以帮助开发人员在应用程序中及时发现和解决错误，保障应用程序的正常运行。以下是一些Sentry的特点和功能：

- 实时监控：Sentry可以实时监控应用程序中的错误和异常，并在出现问题时立即将错误信息发送给开发人员。

- 多平台支持：Sentry支持多种编程语言和平台，如Java、Python、JavaScript、Ruby、PHP等。无论您使用哪种语言或平台，Sentry都可以为您提供实时监控和报警。

- 数据可视化：Sentry提供了丰富的数据可视化功能，如错误和异常的时间分布、发生的位置、错误级别等。开发人员可以通过这些数据分析应用程序的问题，并找出解决方案

- 集成性强：Sentry可以与其他工具集成，如Slack、JIRA、GitHub等，使开发人员在出现问题时能够更快地进行响应和解决

- 安全性高：Sentry提供了安全性高的存储和传输方式，保障监控数据不会泄露或被恶意攻击者攻击


## Sentry私有化部署

> 如果没有自己的服务器或者想体验一下，可以使用Sentry官方提供免费的io（https://sentry.io/welcome/）


官网推荐使用docker部署 https://github.com/getsentry/self-hosted

> 依赖环境：docker，docker-compose

> 官方推荐配置4C8G，好像2c8g也可以流畅运行，内存要保证8G否则可能部署之后打不开

如果需要使用https访问sentry并且使用域名访问，需要自己安装一个nginx的docker镜像，并做好相应的配置，因为sentry默认没有nginx.

Sentry收集的错误日志还是比较耗费磁盘资源的，需要定期关注服务器的磁盘使用情况并做好清理工作


## 创建项目

以 `vue` 项目为例

![创建项目](https://cdnjson.com/images/2023/05/05/20230429135823.png)


```shell
# Using npm
npm install --save @sentry/vue
```

**vue2 + webpack**

```javascript
import Vue from 'vue';
import Router from 'vue-router';
import * as Sentry from '@sentry/vue';

Vue.use(Router);

const router = new Router({
  // ...
});

Sentry.init({
  Vue,
  dsn: '项目对应的dsn',
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0,
});

// ...

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
```

写一段错误代码验证效果

```javascript
<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      |
      <router-link to="/about">About</router-link>
    </nav>
    <router-view />
  </div>
</template>
<script lang="ts">
export default {
  created() {
    // 输出一个不存在的变量
    console.log(sentry)
  },
}
</script>

```

在sentry后台查看已上报错误

![错误](https://cdnjson.com/images/2023/05/05/Snipaste-2023-04-29-16-15-01.png)

查看错误详情
![错误详情](https://cdnjson.com/images/2023/05/05/Snipaste-2023-04-29-16-19-36.png)

## 上传sourceMap到sentry

> 为了方便查看具体的报错内容，我们需要上传`sourceMap`到`sentry`平台。可以通过 `sentry-cli` 通过命令行的方式来上传 `source-map` ，但是需要手动上传。也可以采用 `webpack-plugin` 这个插件，可以在 `build` 的同时自动上传 `source-map` 。本文采用自动上传策略

```javascript
// vue.config.js

const SentryCliPlugin = require('@sentry/webpack-plugin')

module.exports = {
  // 打包完上传到sentry之后在删除，不要把sourcemao传到生产环境
  productionSourceMap: process.env.NODE_ENV !== 'development',
  configureWebpack: config=> {
    if (process.env.NODE_ENV !== 'development') {
      config.plugins.push(
        new SentryCliPlugin({
          include: './dist/js', // 只上传js
          ignore: ['node_modules', 'webpack.config.js'],
          ignoreFile: '.sentrycliignore',
          release: process.env.SENTRY_VERSION || '0.0.1', // 版本号，每次都npm run build上传都修改版本号 对应main.js中设置的Sentry.init版本号
          cleanArtifacts: true, // Remove all the artifacts in the release before the upload.
          // URL prefix to add to the beginning of all filenames. Defaults to ~/ but you might want to set this to the full URL. This is also useful if your files are stored in a sub folder. eg: url-prefix '~/static/js'
          urlPrefix: '~/js', // 线上对应的url资源的相对路径 注意修改这里，否则上传sourcemap还原错误信息有问题
          // urlPrefix： 关于这个，是要看你线上项目的资源地址，比如,你前端访问页面是 http://test.com/test1/#/login, 同时你的资源地址是 http://test.com/test/static/js/app.xxxxxx.js,那么， 你的 urlPrefix: "~/test/"（注意：非 ip 地址 test1）
          // 怎么看资源地址呢， 例如谷歌浏览器， F12控制台， 或者去Application里面找到对应资源打开
        }),
      )
    }
  },
}
```

在项目根目录创建.sentryclirc

```
[auth]
token=填入控制台创建的TOKEN

[defaults]
url=sentry部署的地址
org=填入控制台创建的组织名称
project=填入控制台创建的项目名称
```

最后不要忘了main.js加上版本号

```javascript

Sentry.init({
  app,
  dsn: '项目对应的dsn',
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  release: process.env.SENTRY_VERSION, // 版本号
});
```

执行项目打包命令，即可把js下的sourcemap相关文件上传到sentry

```shell
npm run build
```

**Vue3 + Vite**


```shell
npm i vite-plugin-sentry -D
```

除了vite的插件配置，其余的步骤同上

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteSentry from 'vite-plugin-sentry'

const sentryConfig = {
  configFile: './.sentryclirc',
  release: process.env.SENTRY_VERSION || '0.0.1', // 版本号，每次都npm run build上传都修改版本号
  deploy: {
   env: 'production',
  },
  skipEnvironmentCheck: true, // 可以跳过环境检查
  sourceMaps: {
   include: ['./dist/assets'],
   ignore: ['node_modules'],
   urlPrefix: '~/assets', // 注意这里设置正确，否则sourcemap上传不正确
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    process.env.NODE_ENV === 'production' ? viteSentry(sentryConfig) : null,
  ],
  build: {
    sourcemap: process.env.NODE_ENV === 'production',
  },
})
```


查看控制台sourcemap解析的效果

![详细错误信息](https://cdnjson.com/images/2023/05/05/Snipaste-2023-04-29-17-38-36.png)

## 总结
通过在应用中添加Sentry的客户端SDK来实现前端应用监控，我们可以监控应用中的错误，并提供详细的错误信息，例如错误类型、堆栈跟踪和环境信息等。这可以帮助我们及时发现并解决应用中的错误，提高应用的质量和稳定性。**最重要的是，再也不怕产品来找我了**