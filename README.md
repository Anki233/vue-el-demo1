

#基于vue-cli构建的商品后台管理系统(`vue2`+`vuex`+`vue-router`+`element-ui`+`echarts`+`awe-dnd`+`bootstrap4`+`axios`)


-------

### 本项目可以学到:

    1、学会使用vue-cli3.0构建项目.
    2、学会使用vue-router实现页面跳转带参.
    3、学会使用vuex状态管理.
    4、配套element-ui
    5、配套bootstrap4
    6、略微涉及echarts作图标分析
    7、涉及awe-dnd实现拖拽
    8、涉及tinymce富文本编辑器
    9、对路由进行二次封装，实现路由动态生成
    10、axios请求数据

#### 预览地址
https://el-admin-demo1.netlify.app
预览地址暂时失败，建议下载到本地使用

#### 目前实现

静态页面+动态数据

#### 安装

#### 项目地址：

（`git clone`）

```shell
git clone https://github.com/Unsakula/vue-el-demo1.git
```

#### 通过`npm`安装本地服务第三方依赖模块(需要已安装[Node.js](https://nodejs.org/))

```
npm install
```

#### 启动服务(http://localhost:8080)

```
npm run serve
```

#### 发布代码

```
npm run build
```

#### 开发

#### 目录结构

<pre>
.
├── README.md           
├── package.json       // 项目配置文件
├── public       // 富文本编辑器相关文件
├── src                // 生产目录
│   ├── assets         // css js 和图片资源
│   ├── common          // 二次封装路由 公共配置文件 放置
│   ├── components     // 各种组件
│   ├── plugins         // 插件
│   ├── store          // vuex状态管理器
│   ├── views           // 各种页面
│   └── main.js        // 入口文件
</pre>
