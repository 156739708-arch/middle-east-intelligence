# Railway部署指南

## 什么是Railway？

Railway是一个云平台，可以让你快速部署Web应用。它提供免费套餐，并且与GitHub集成，可以自动部署代码。

## 部署步骤

### 第一步：准备GitHub仓库

1. **注册GitHub账号**
   - 访问：https://github.com
   - 注册一个免费账号

2. **创建新仓库**
   - 点击右上角的"+" → "New repository"
   - 仓库名称：`middle-east-intelligence`
   - 选择：Public或Private都可以
   - 点击"Create repository"

3. **上传代码到GitHub**
   - 在本地项目目录打开PowerShell/命令提示符
   - 执行以下命令：

```bash
# 初始化Git（如果还没初始化）
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit"

# 关联GitHub仓库（替换为你的用户名）
git remote add origin https://github.com/你的用户名/middle-east-intelligence.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

### 第二步：配置Railway

1. **注册Railway账号**
   - 访问：https://railway.app
   - 使用GitHub账号登录（推荐）

2. **创建新项目**
   - 点击"New Project" → "Deploy from GitHub repo"
   - 选择你刚才创建的仓库
   - 点击"Deploy Now"

3. **配置环境变量**
   - 部署完成后，进入项目页面
   - 点击"Settings" → "Variables"
   - 添加以下变量：
     ```
     PUSHPLUS_TOKEN=1ae8603093e64da0836cab82ef57783d
     NEWSAPI_KEY=b115efb222574a589d539260c4965ddf
     ```

4. **重新部署**
   - 配置好环境变量后，Railway会自动重新部署

### 第三步：查看运行状态

1. **查看日志**
   - 进入Railway项目页面
   - 点击"Logs"查看程序运行日志

2. **确认运行状态**
   - 程序会自动启动
   - 每30分钟（6:00-23:59）自动推送一次情报

## Railway的优势

✅ **免费套餐**：每天16小时免费运行  
✅ **自动部署**：GitHub更新后自动部署  
✅ **简单易用**：无需服务器配置  
✅ **持续运行**：不关机持续推送  

## 注意事项

1. **免费套餐限制**
   - 每天最多16小时运行时间
   - 如果需要24小时运行，需要购买付费套餐（约5美元/月）

2. **NewsAPI配额**
   - 免费版每天100次请求
   - 我们的系统每天约36次请求，足够使用

3. **更新代码**
   - 在本地修改代码后
   - 推送到GitHub
   - Railway会自动重新部署

## 常用命令

```bash
# 查看Git状态
git status

# 添加修改
git add .

# 提交修改
git commit -m "描述你的修改"

# 推送到GitHub
git push
```

## 如果有问题

- 查看Railway日志：项目页面 → "Logs"
- 查看PushPlus推送：微信公众号
- 检查NewsAPI配额：https://newsapi.org/account
