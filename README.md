# 图米粒（too many）
这个平台有点像爱淘宝达人的概念，达人可以把豆瓣上自己喜欢的相册上传到图米粒，分享推荐给其他用户，主要是一个分享为主的平台。后续考虑增加更多的第三方平台。

### 登录
用户注册账号登录，后续考虑接入微博等第三方平台的登录

### 首页
* 左侧相册列表，按上传时间降序排列
* 右侧按收藏数降序，取前8个相册
* 右侧按下载数降序，取前8个相册

### 个人展示页
展示用户上传的所有相册，按照时间先后顺序排序。如果当前登录用户就是改上传者，增加相册的操作的功能，包括相册的删除、权限公开

### 明星榜
展示按上传数前40名用户，按照上传个数递减排序。点击某个用户，展现具体的相册信息。

### 相册信息
*   封面：默认选择相册前9张图片，合成一张大图，如果不足9张，用默认图片补足，用户也可以自行上传封面
*   相册名称：从豆瓣API获取，用户不能修改
*   相册喜欢数：用户点击喜欢，也是收藏功能。在用户页面能看到自己所有收藏的相册
*   相册链接：从豆瓣API获取，点击相册直接跳转到豆瓣
*   相册下载：后台程序获取到照片后，直接下载到服务器，并且打包压缩后供用户下载（只有登录用户才能下载）
*   上传者信息：显示上传者头像及名字，点击头像或者名字跳转到该上传者页面
*   相册删除：删除相册功能，只有上传者才有权限操作
*   推荐理由：上传者撰写的推荐理由

### 用户上传相册页面
* 豆瓣相册地址
* 相册封面（默认相册第一张图片）
* 分类：相册属性分类（TODO）
* 权限：私有 or 公开 （默认私有）
* 推荐理由
     
>注：相册上传者不是指豆瓣上的上传者，而是指在图米粒上的上传者

### 用户注册页面
*   用户名称
*   密码
*   用户头像
*   个性介绍
 
### 豆瓣相册API
http://developers.douban.com/wiki/?title=photo_v2

### 微博登录接入
http://open.weibo.com/development

### 跑起来
* 首先确保当前node版本大于0.11
* npm install
* 终端运行 gulp
* 访问http://localhost:8080

### MySQL安装
* brew install mysql
* 安装完成之后开启MySQL安全机制：`/usr/local/opt/mysql/bin/mysql_secure_installation`，根据提示修改密码。初始密码为空(本地root密码：12345)
* 启动MySQL `mysql.server start`
* 登录MySQL `mysql -u root -p`
* 重启MySQL `mysql.server restart`
* 关闭MySQL `mysql.server stop`

### MySQLWorkbench安装 
* 下载地址：http://www.mysql.com/products/workbench/

### 表结构
#### user表
| id | name | password | avatar | sign | albumCount |
| -------- | -------- | -------- | -------- | -------- | -------- |
| 用户id | 用户名 | 密码 | 头像 | 个性签名 | 上传相册数 |

#### album表
| id | title | url | poster | likeCount | downCount | access | reason | dbId | userId |
| -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- | -------- |
| 相册id | 相册名称 | 相册地址 | 相册封面 | 相册收藏数 | 相册下载数 | 是否公开 | 相册推荐理由 | 豆瓣id | 上传者id |

#### like表
| id | albumId | userId |
| -------- | -------- | -------- |
| 收藏id | 相册id | 用户id |

### ubuntu部署Node环境
* http://jingyan.baidu.com/article/046a7b3edebf38f9c27fa9bc.html

### ubuntu部署Mysql服务
* http://wiki.ubuntu.org.cn/MySQL

### 服务器端启动项目
* NODE_ENV=production pm2 start server.js --name toomany --node-args='--harmony-generators'

### ubuntu下mysql乱码问题
* 除了网上能搜到的配置修改外，在创建数据库的时候要设置编码 `create database toomany character set utf8;`
