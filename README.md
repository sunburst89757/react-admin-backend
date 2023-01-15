## react-admin-backend

本项目是[react-admin](https://github.com/sunburst89757/react-admin)的后端项目，使用的模板是[koa-ts-template](https://github.com/sunburst89757/koa-ts-template)的 general 分支

## 使用须知

[参见](https://github.com/sunburst89757/koa-ts-template/tree/general)Readme。主要设置.env 和 key

## 新增功能

- 使用 redis 进行 token 管理，配套对应的前端项目实现 token 无感刷新
- 添加全局错误拦截中间件
- 添加全局日志中间件

## 部署须知

本项目已经编写了 docker-compose 和 docker 配置文件，配置时建议使用 docker 进行部署

- 拉取代码

```shell
git clone https://github.com/sunburst89757/react-admin-backend.git
```

- 进入 dockerfile 存在的目录
- docker 创建容器,启动服务

```shell
docker-compose up -d
```

- 数据库本地文件迁移
