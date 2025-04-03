# Cloudflare Worker 配置指南

本文档将指导您如何设置Cloudflare Worker和KV存储来实现留言墙和联系表单的数据处理功能。

## 前提条件

1. 一个Cloudflare账户（可以免费注册：https://dash.cloudflare.com/sign-up）
2. 基本的网站部署知识

## 步骤1：创建KV命名空间

1. 登录Cloudflare Dashboard
2. 在左侧导航栏中，点击「Workers & Pages」
3. 点击「KV」选项卡
4. 点击「创建命名空间」按钮
5. 输入命名空间名称，例如：`message-wall-data`
6. 点击「添加」按钮创建命名空间

## 步骤2：创建和部署Worker

1. 在Cloudflare Dashboard中，点击「Workers & Pages」
2. 点击「创建应用程序」按钮
3. 选择「创建Worker」
4. 为您的Worker命名，例如：`message-wall-api`
5. 点击「创建Worker」按钮
6. 在编辑器中，删除默认代码，然后粘贴项目中的`cloudflare-worker.js`文件内容
7. 点击「保存并部署」按钮

## 步骤3：绑定KV命名空间到Worker

1. 部署Worker后，点击「设置」选项卡
2. 找到「变量」部分，点击「KV命名空间绑定」
3. 点击「添加绑定」按钮
4. 在「变量名称」字段中输入：`KV_MESSAGES`（必须与Worker代码中使用的名称一致）
5. 在「KV命名空间」下拉菜单中选择您之前创建的命名空间（例如：`message-wall-data`）
6. 点击「保存」按钮

## 步骤4：配置通知功能环境变量

为了启用留言和联系表单提交的通知功能，您需要配置以下环境变量：

1. 在Cloudflare Dashboard中，进入您的Worker页面
2. 点击「设置」选项卡
3. 找到「环境变量」部分
4. 点击「添加变量」按钮
5. 添加以下变量：
   - `NOTIFICATION_API_URL`：飞书机器人的Webhook地址
   - `NOTIFICATION_TEMPLATE`（可选）：自定义通知消息模板
6. 点击「保存」按钮

### 飞书机器人详细配置指南

1. 登录飞书管理后台（https://www.feishu.cn/）
2. 创建一个群聊或使用现有群聊
3. 在群设置中，选择「群机器人」>「添加机器人」>「自定义机器人」
4. 设置机器人名称和头像
5. 在安全设置中，建议选择「自定义关键词」并添加"留言"和"联系"作为关键词
6. 复制生成的Webhook地址
7. 将此Webhook地址配置为Cloudflare Worker的`NOTIFICATION_API_URL`环境变量

### 自定义通知模板（可选）

您可以通过设置`NOTIFICATION_TEMPLATE`环境变量来自定义通知消息格式。默认模板为：

```
新{type}来自{name}（{email}）:
{message}
```

其中：
- `{type}`：消息类型（"留言"或"联系表单"）
- `{name}`：用户姓名
- `{email}`：用户邮箱
- `{message}`：消息内容

### 飞书机器人配置指南

1. 登录飞书管理后台
2. 创建一个群聊或使用现有群聊
3. 在群设置中，选择「群机器人」>「添加机器人」>「自定义机器人」
4. 设置机器人名称和头像
5. 复制生成的Webhook地址
6. 将此Webhook地址配置为Cloudflare Worker的`NOTIFICATION_API_URL`环境变量

当有新留言或联系表单提交时，机器人将自动在群聊中发送通知。

## 步骤5：配置前端代码

### 配置留言墙功能

1. 打开项目中的`assets/js/message-wall.js`文件
2. 找到顶部的`API_URL`常量，将其值修改为您的Worker URL，例如：
   ```javascript
   const API_URL = 'https://message-wall-api.your-username.workers.dev/api/messages';
   ```
   （将`your-username`替换为您的Cloudflare账户名称）

### 配置联系表单功能

1. 打开项目中的`assets/js/form-handler.js`文件
2. 找到顶部的`CONTACT_API_URL`常量，将其值修改为您的Worker URL，例如：
   ```javascript
   const CONTACT_API_URL = 'https://message-wall-api.your-username.workers.dev/api/contact';
   ```
   （将`your-username`替换为您的Cloudflare账户名称）

## 步骤5：测试功能

### 测试留言墙功能

1. 部署您的网站
2. 访问留言墙页面
3. 尝试添加新留言并验证它们是否正确显示
4. 在不同设备或浏览器上访问页面，确认留言数据是否同步

### 测试联系表单功能

1. 访问网站的联系表单页面
2. 填写姓名、邮箱和留言内容
3. 提交表单并验证是否收到成功提交的提示
4. 在Cloudflare Dashboard中，可以通过以下方式查看提交的联系表单数据：
   - 进入您的Worker
   - 点击「KV」选项卡
   - 选择您创建的命名空间
   - 查找键名为`contact-submissions`的条目

## 数据存储说明

在Cloudflare KV存储中，数据以键值对的形式存储：

- 留言墙数据存储在键名为`wall-messages`的条目中
- 联系表单提交数据存储在键名为`contact-submissions`的条目中

这两个键都存储JSON格式的数组，包含所有提交的数据。

## 故障排除

如果遇到问题，请检查：

1. Worker是否成功部署
2. KV命名空间是否正确绑定
3. API_URL和CONTACT_API_URL是否设置正确
4. 浏览器控制台是否有错误信息
5. Worker的请求日志中是否有错误（可在Cloudflare Dashboard中查看）

## 本地测试

如需在本地环境测试这些功能，请参考项目中的`LOCAL-TESTING.md`文档，其中提供了多种本地测试方法。

## Cloudflare免费计划限制

- Workers：每天100,000个请求
- KV存储：最多1GB存储空间

这些限制对于一般的留言墙和联系表单应用来说已经足够了。如果您的网站流量很大，可能需要考虑升级到付费计划。