# NCSLab

## Installation
```
npm install
```

```
npm install webpack-dev-server webpack -g
```

## Deployment
```
npm run build:dll   //提取第三方依赖，避免重复打包
npm start       //开发模式
npm run build       //生产模式
```
> 第三方依赖发生变动后需要运行一次`npm run build:dll`

## Q&A

- 如何修改本地git仓库所跟踪的远程仓库地址？（主要用于当远程仓库地址发生改变的时候）
`git remote set-url origin git@192.168.46.114:~/repositories/ncslab_frontend.git`

- 如何下载新的git项目？
`git clone git@192.168.46.114:~/repositories/ncslab_frontend.git`

关于权限：

1. 管理员
2. 学生

关于设备类型：

1. 虚拟设备（副本）
2. 虚拟设备（单一）