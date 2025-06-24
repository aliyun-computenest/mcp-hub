# 多阶段构建 Dockerfile for MCP Hub
# 构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 设置npm镜像源以加速构建
RUN npm config set registry https://registry.npmmirror.com

# 复制package文件
COPY package*.json ./

# 安装构建依赖
RUN npm ci --only=production && npm cache clean --force

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM nginx:1.25-alpine

# 安装curl用于健康检查
RUN apk add --no-cache curl

# 创建非root用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# 复制构建产物
COPY --from=builder --chown=nextjs:nodejs /app/dist /usr/share/nginx/html

# 复制nginx配置
COPY nginx.docker.conf /etc/nginx/conf.d/default.conf

# 复制启动脚本
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# 创建配置目录并设置权限
RUN mkdir -p /usr/share/nginx/html/config && \
    chown -R nextjs:nodejs /usr/share/nginx/html

# 添加标签信息
LABEL maintainer="Alibaba Cloud ComputeNest Team" \
      version="1.0.0" \
      description="MCP Hub - A registry viewer for Model Context Protocol servers" \
      org.opencontainers.image.source="https://github.com/aliyun-computenest/mcp-hub" \
      org.opencontainers.image.url="https://github.com/aliyun-computenest/mcp-hub" \
      org.opencontainers.image.documentation="https://github.com/aliyun-computenest/mcp-hub/blob/main/README.md" \
      org.opencontainers.image.vendor="Alibaba Cloud" \
      org.opencontainers.image.licenses="MIT"

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# 使用自定义入口点
ENTRYPOINT ["/docker-entrypoint.sh"]

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
