
# 个人主页项目

一个基于HTML5 UP Dimension模板的现代化个人主页，集成了留言墙、友情链接和联系表单等交互功能。

![预览图](https://img.106996.xyz/file/Snipaste_2025-04-04_11-28-21.png)

## 项目概述

这个项目是基于HTML5 UP的Dimension模板进行二次开发的个人主页，保留了原模板的美观设计，同时添加了多项实用功能，使其成为一个功能完善的个人网站门户。

### 主要特点

- **响应式设计**：完美适配各种设备屏幕尺寸
- **一言API集成**：首页自动展示随机一言
- **实时天气**：基于地理位置显示当前天气信息
- **留言墙功能**：访客可以留言并展示在留言墙上
- **友情链接系统**：展示友链并支持申请
- **联系表单**：访客可以通过表单发送消息
- **IP信息显示**：显示访客IP地址和地理位置
- **通知系统**：新留言、友链申请和联系表单提交时发送通知

## 功能模块

### 1. 首页展示

- 简洁的全屏展示页面
- 随机一言API集成，每次刷新显示不同内容
- 导航菜单链接到各功能页面

### 2. 留言墙

- 访客可以提交留言
- 留言实时显示在留言墙上
- 数据存储在Cloudflare KV中

### 3. 友情链接

- 展示已批准的友情链接
- 提供友链申请表单
- 支持自定义头像和描述

### 4. 天气功能

- 基于HTML5 Geolocation API获取访客位置
- 集成WeatherAPI显示实时天气信息
- 支持温度和天气状态图标显示
- 默认使用北京位置作为备选

### 5. 联系表单

- 访客可以发送联系消息
- 表单验证确保数据有效性
- 提交后通知站长

## 技术栈

- **前端**：HTML5, CSS3, JavaScript, jQuery
- **后端**：Cloudflare Workers (无服务器函数)
- **数据存储**：Cloudflare KV (键值存储)
- **部署**：Cloudflare Pages

## 安装与部署

### 本地开发

1. 克隆仓库到本地：
   ```bash
   git clone https://github.com/deerwan/homepage_demo.git
   cd homepage_demo
   ```

2. 使用任意HTTP服务器启动项目，例如：
   ```bash
   npx http-server -p 8080
   ```

3. 在浏览器中访问 `http://localhost:8080`

### Cloudflare Pages部署

#### 前提条件
- Cloudflare账户

### 部署步骤
1. 创建Pages项目并连接Git仓库
2. 配置构建设置（选择无框架，输出目录为/）
3. 可选：添加自定义域名
4. 设置重定向规则(/* → /index.html)
5. 测试部署

## Cloudflare Worker配置

要启用留言墙、友情链接和联系表单功能，需要配置Cloudflare Worker作为后端API。

### 步骤1：创建KV命名空间

1. 登录Cloudflare Dashboard
2. 在左侧导航栏中，点击「Workers & Pages」
3. 点击「KV」选项卡
4. 点击「创建命名空间」按钮
5. 输入命名空间名称，例如：`message-wall-data`
6. 点击「添加」按钮创建命名空间

### 步骤2：创建和部署Worker

1. 在Cloudflare Dashboard中，点击「Workers & Pages」
2. 点击「创建应用程序」按钮
3. 选择「创建Worker」
4. 为您的Worker命名，例如：`message-wall-api`
5. 点击「创建Worker」按钮
6. 在编辑器中，删除默认代码，然后粘贴项目中的`cloudflare-worker.js`文件内容
7. 点击「保存并部署」按钮

### 步骤3：绑定KV命名空间到Worker

1. 部署Worker后，点击「设置」选项卡
2. 找到「变量」部分，点击「KV命名空间绑定」
3. 点击「添加绑定」按钮
4. 在「变量名称」字段中输入：`KV_MESSAGES`（必须与Worker代码中使用的名称一致）
5. 在「KV命名空间」下拉菜单中选择您之前创建的命名空间
6. 点击「保存」按钮

### 步骤4：配置天气功能

1. 注册 [WeatherAPI](https://www.weatherapi.com/) 账号
2. 获取API密钥
3. 在 `assets/js/weather.js` 中更新 `WEATHER_API_KEY` 变量：
   ```javascript
   const WEATHER_API_KEY = '你的API密钥';
   ```

### 步骤5：配置通知功能（可选）

为了启用留言和联系表单提交的通知功能，您可以配置以下环境变量：

1. 在Worker页面，点击「设置」选项卡
2. 找到「环境变量」部分
3. 点击「添加变量」按钮
4. 添加以下变量：
   - `NOTIFICATION_API_URL`：通知服务的Webhook地址（如飞书机器人）

#### 飞书机器人配置指南

1. 登录飞书管理后台
2. 创建一个群聊或使用现有群聊
3. 在群设置中，选择「群机器人」>「添加机器人」>「自定义机器人」
4. 设置机器人名称和头像
5. 复制生成的Webhook地址
6. 将此Webhook地址配置为Worker的`NOTIFICATION_API_URL`环境变量

### 步骤5：配置前端代码

1. 打开项目中的以下文件，更新API地址为您的Worker URL：
   - `assets/js/message-wall.js`中的`API_URL`
   - `assets/js/form-handler.js`中的`CONTACT_API_URL`
   - `assets/js/friend-link-handler.js`中的`FRIENDLINK_API_URL`

## 自定义配置

### 修改网站标题和图标

1. 编辑`index.html`文件中的`<title>`标签
2. 替换`images/favicon.png`文件

### 修改首页内容

1. 编辑`index.html`文件中的`<header>`部分
2. 修改导航菜单链接

### 修改关于页面

编辑`index.html`文件中`id="about"`的`<article>`部分

### 修改样式

- 主要样式：`assets/css/main.css`
- 自定义样式：`assets/css/custom.css`
- 表单样式：`assets/css/form-styles.css`
- 留言墙样式：`assets/css/message-wall.css`
- 友链样式：`assets/css/friend-links.css`

## 数据存储说明

在Cloudflare KV存储中，数据以键值对的形式存储：

- 留言墙数据：键名为`wall-messages`
- 联系表单数据：键名为`contact-submissions`
- 友情链接数据：键名为`friend-links`

## 故障排除

如果遇到问题，请检查：

1. Worker是否成功部署
2. KV命名空间是否正确绑定
3. API URL是否设置正确
4. 浏览器控制台是否有错误信息

## 免费计划限制

Cloudflare免费计划的限制：
- Workers：每天100,000个请求
- KV存储：最多1GB存储空间
- Pages：无限请求和带宽

## 许可证

本项目基于HTML5 UP的Dimension模板，遵循CCA 3.0许可证。
- 原始模板：[HTML5 UP Dimension](https://html5up.net/dimension)
- 许可证：[CCA 3.0](https://html5up.net/license)

## 鸣谢

- [HTML5 UP](https://html5up.net/) - 提供原始模板
- [Font Awesome](https://fontawesome.com/) - 图标库
- [一言API](https://hitokoto.cn/) - 提供随机一言服务
- [Cloudflare](https://www.cloudflare.com/) - 提供托管和后端服务
