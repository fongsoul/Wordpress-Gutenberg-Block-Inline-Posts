# 古腾堡内链帖子块

## 😈 使用插件

1. 下载最新 [古腾堡内链帖子块](https://github.com/mousin/WordPress-Gutenberg-Block-Inline-Posts/archive/master.zip) 插件
2. 后台菜单 "插件" 上传插件并启用
3. 新建文章，+ 搜索区块 `内链帖子` 或 `引用帖子`

## 😈 进行自定义开发

### 👉 `npm install`
- 安装依赖

### 👉 `npm run dev`
- 开发时编译
- 监听文件更改作出更新

### 👉 `npm run prod`
- 生产环境线上使用
- 构建生产代码到 `dist` 文件夹.
- 压缩代码报告打包后文件大小

## 文件目录

```
|-- plugin
    |-- .gitignore // git 文件夹排除
    |-- .babelrc // babel 配置
    |-- .eslintignore // eslint 文件夹排除
    |-- .eslintrc // eslint 配置
    |-- .stylelintrc // 样式检查、排序配置
    |-- package.json // 项目依赖目录
    |-- plugin.php // 插件入口
    |-- config // Webpack 配置
    |   |-- paths.js // 目录配置
    |   |-- webpack.config.dev.js // Webpack 开发配置
    |   |-- webpack.config.prod.js // Webpack 构建配置
    |-- dist // 构建后插件实际使用的脚本样式
    |   |-- block.build.js
    |   |-- block.editor.build.css
    |   |-- block.style.build.css
    |-- core // 插件引入的 PHP 文件
    |   |-- init.php // 初始化
    |   |-- render.php // 块的渲染模板（保持与“编辑器中块的渲染组件”结构大致相同）
    |   |-- scripts-and-styles.php // 插件引入的样式脚本
    |-- scripts // node 脚本
    |   |-- prod.js
    |   |-- dev.js
    |-- src // 主要开发目录
        |-- block.js // 块入口
        |-- components // 组件
        |   |-- InlinePost.js // 编辑器中块的渲染组件
        |   |-- InlinePosts.js
        |   |-- PostSelector.js
        |-- styles
        |   |-- editor.scss // 编辑器中块的样式
        |   |-- render.scss // 渲染呈现的块样式
        |-- utils
            |-- api.js // api 方法
            |-- useful-funcs.js // 辅助函数
```