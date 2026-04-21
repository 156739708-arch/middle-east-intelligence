# 中东局势情报系统

自动采集中东局势新闻，翻译成中文，通过微信推送。

## 功能特点

- 🌍 **多源采集**：Al Jazeera、Reuters、BBC、新华网、环球网
- 📊 **智能分析**：自动过滤、排序重要情报
- 🌐 **中文翻译**：所有英文文章自动翻译成中文
- 📱 **微信推送**：通过PushPlus推送到微信
- ⏰ **定时推送**：6:00-23:59每30分钟一次
- 🔄 **防重复**：自动过滤重复内容

## 快速部署（推荐）

### 方式一：Railway（最简单，5分钟部署）

详细步骤：[RAILWAY.md](RAILWAY.md)

1. 创建GitHub仓库并上传代码
2. 在Railway网站连接GitHub
3. 配置环境变量
4. 完成！自动部署运行

### 方式二：云服务器（阿里云/腾讯云）

详细步骤：[DEPLOY.md](DEPLOY.md)

1. 购买云服务器（Ubuntu 20.04）
2. 上传代码
3. 运行部署脚本
4. 完成！24/7持续运行

## 本地运行

```bash
# 安装依赖
npm install

# 启动程序
npm start
```

## 配置

编辑 `config/config.js` 或设置环境变量：

- `PUSHPLUS_TOKEN`：PushPlus微信推送token
- `NEWSAPI_KEY`：NewsAPI密钥

## 部署文件说明

- `Dockerfile`：Docker容器配置
- `deploy.sh`：Linux一键部署脚本
- `RAILWAY.md`：Railway部署详细指南
- `DEPLOY.md`：云服务器部署详细指南

## 推送规则

- ⏰ **时间**：6:00-23:59，每30分钟一次
- 📊 **数量**：每次最多20条情报
- 🌐 **语言**：全中文（英文自动翻译）
- 🚫 **重复**：自动过滤重复内容

## 技术栈

- Node.js
- Axios（HTTP请求）
- Cheerio（网页解析）
- node-cron（定时任务）
- NewsAPI（新闻数据）

## 许可证

MIT
