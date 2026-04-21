# 使用Node.js 18的官方镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制项目文件
COPY . .

# 暴露端口（可选，用于健康检查）
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
