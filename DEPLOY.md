# 云服务器部署指南

## 推荐的云服务商

### 1. 阿里云（国内推荐）
- 网址：https://www.aliyun.com
- 优点：国内访问快，配置简单
- 价格：学生版9.9元/月起，ECS实例约30元/月起

### 2. 腾讯云（国内推荐）
- 网址：https://cloud.tencent.com
- 优点：国内访问快，配置简单
- 价格：学生版10元/月起

### 3. AWS EC2（国际）
- 网址：https://aws.amazon.com/cn/ec2/
- 优点：全球覆盖，稳定性高
- 价格：免费套餐12个月，付费版约10美元/月起

### 4. Railway（简单部署）
- 网址：https://railway.app
- 优点：部署简单，GitHub集成
- 价格：免费套餐有限，付费版5美元/月起

## 部署步骤

### 方案一：阿里云/腾讯云（Linux服务器）

1. **购买云服务器**
   - 选择Ubuntu 20.04 LTS系统
   - 配置：1核1G内存足够

2. **连接到服务器**
   ```bash
   ssh root@你的服务器IP
   ```

3. **安装Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   node -v  # 确认版本
   ```

4. **上传项目**
   ```bash
   # 在本地项目目录执行
   scp -r c:\Users\lhuij\Documents\trae_projects\pr1 root@你的服务器IP:/opt/middle-east-intelligence
   ```

5. **安装依赖**
   ```bash
   cd /opt/middle-east-intelligence
   npm install
   ```

6. **配置环境变量（推荐）**
   ```bash
   # 创建环境变量文件
   nano .env
   ```
   添加以下内容：
   ```
   PUSHPLUS_TOKEN=1ae8603093e64da0836cab82ef57783d
   NEWSAPI_KEY=b115efb222574a589d539260c4965ddf
   ```

7. **使用PM2运行**
   ```bash
   npm install -g pm2
   pm2 start index.js --name middle-east-intelligence
   pm2 save
   pm2 startup
   ```

8. **查看日志**
   ```bash
   pm2 logs middle-east-intelligence
   ```

### 方案二：Railway（最简单）

1. **准备GitHub仓库**
   - 创建GitHub账号
   - 上传项目到GitHub仓库

2. **登录Railway**
   - https://railway.app
   - 使用GitHub登录

3. **部署项目**
   - 点击"New Project" → "Deploy from GitHub repo"
   - 选择你的仓库
   - Railway会自动检测Node.js项目

4. **配置环境变量**
   - 在Railway项目设置中添加：
     - `PUSHPLUS_TOKEN=1ae8603093e64da0836cab82ef57783d`
     - `NEWSAPI_KEY=b115efb222574a589d539260c4965ddf`

5. **完成！**
   - Railway会自动部署并运行
   - 可以查看日志和状态

## 常用命令

### PM2管理
```bash
pm2 status                    # 查看状态
pm2 logs middle-east-intelligence  # 查看日志
pm2 restart middle-east-intelligence  # 重启
pm2 stop middle-east-intelligence  # 停止
```

### 检查运行状态
```bash
curl http://localhost:3000/health
```

## 注意事项

1. **保持运行**
   - 使用PM2可以让程序在后台持续运行
   - 即使重启服务器也会自动启动

2. **费用**
   - 阿里云/腾讯云：约30元/月
   - Railway：免费套餐有限

3. **安全**
   - 建议使用防火墙
   - 不要暴露不必要的端口

4. **监控**
   - 定期检查日志
   - 监控API使用配额
