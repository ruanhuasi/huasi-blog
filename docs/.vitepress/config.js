import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/', // 网站根路径
  lastUpdated: true, // 是否显示最后更新日期
  title: "华斯的博客",
  titleTemplate: '华斯的博客',
  description: "Just playing around.", // 描述
  cleanUrls: 'with-subfolders',
  appearance: true, // 主题
  ignoreDeadLinks: true,
  lang: 'zh-CN',
  head: [
    ['link', { rel: 'icon', type: "image/x-icon", href: '/imgs/logo.png' }]
  ],
  markdown: {
    theme: 'material-palenight', 
    lineNumbers: true,
  },
  themeConfig: {
    // siteTitle: '知识笔记',
    logo: '/imgs/logo.png',
    // 全局搜索
    // algolia: {
    //   appId: '5BTR9V738B',
    //   apiKey: 'b5afeb768172d5eabc78d73f93c2c52e',
    //   indexName: 'docs',
    //   placeholder: '请输入关键字',
    //   buttonText: '搜索',
    // },
    // 顶部导航
    nav: [
      { text: '首页', link: '/' },
      {
        text: '前端',
        items: [
          { text: 'JavaScript', link: '/js/es6/' },
          { text: 'TypeScript', link: '/ts/basics/' },
          { text: '前端工程化', link: '/engineering/' },
          { text: 'Vue', link: '/vue/' },
          { text: 'React', link: '/react/' },
        ]
      }
    ],
    sidebar: {
      '/js': [
        {
          text: '基础',
          items: [
            { text: 'ECMAScript新特性', link: '/js/es6/' },
            { text: 'JavaScript 性能优化', link: '/js/performance/' },
          ]
        },
        {
          text: '进阶',
          items: [
            { text: '函数式编程范式', link: '/js/function/' },
            { text: '异步编程', link: '/js/asynchronous/' },
          ]
        }
      ],
      '/ts': [
        {
          text: '基础',
          items: [
            { text: '类型系统', link: '/ts/basics/' },
            { text: '入门', link: '/ts/introduction/' },
          ]
        },
      ],
      '/engineering': [
        {
          items: [
            { text: '自动化构建', link: '/engineering/' },
            { text: '脚手架工具', link: '/engineering/cli/' },
            { text: '模块化开发', link: '/engineering/module/' },
            { text: 'webpack-前端模块打包工具', link: '/engineering/webpack/' },
          ]
        },
      ],
      
    },
    // 侧边栏
    // sidebar: [
    //   {
    //     text: 'Guide',
    //     items: [
    //       { text: 'Introduction', link: '/introduction' },
    //       { text: 'Getting Started', link: '/getting-started' },
    //     ]
    //   },
    //   {
    //     text: 'Guide2',
    //     items: [
    //       { text: 'Introduction', link: '/introduction' },
    //       { text: 'Getting Started', link: '/getting-started' },
    //     ]
    //   }
    // ]
    
  }
})

