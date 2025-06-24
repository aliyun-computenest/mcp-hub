# Docker 部署指南

## 🐳 快速开始

### 1. 准备环境变量
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量
vim .env
```

### 2. 一键启动
```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 查看状态
docker-compose ps
```

### 3. 访问应用
```
http://localhost:8080
```

## 🔧 配置说明

### 环境变量配置
在 `.env` 文件中配置：
```env
PUBLIC_IP=你的公网IP
PRIVATE_IP=你的私网IP
API_KEY=你的API密钥
APP_PORT=8080
```

### 自定义配置文件
1. **修改 MCP 服务器列表**：编辑 `public/config.json`
2. **修改服务器详情**：编辑 `public/config_detail.json`
3. **添加自定义配置**：在 `config/` 目录下添加文件

### 数据持久化
配置文件通过 Docker volumes 挂载，修改后无需重新构建镜像。

## 📋 常用命令

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看日志
docker-compose logs -f mcp-registry-viewer

# 进入容器
docker-compose exec mcp-registry-viewer sh

# 更新镜像
docker-compose pull
docker-compose up -d

# 清理
docker-compose down -v
docker system prune -f
```

## 🚀 生产环境部署

### 使用 Traefik 反向代理
```yaml
version: '3.8'

services:
  mcp-registry-viewer:
    build: .
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.mcp.rule=Host(\`mcp.yourdomain.com\`)"
      - "traefik.http.routers.mcp.tls.certresolver=letsencrypt"
    networks:
      - traefik
      - mcp-network

networks:
  traefik:
    external: true
  mcp-network:
    driver: bridge
```

### 使用 Nginx Proxy Manager
```yaml
version: '3.8'

services:
  mcp-registry-viewer:
    build: .
    expose:
      - "80"
    networks:
      - proxy
      - mcp-network

networks:
  proxy:
    external: true
  mcp-network:
    driver: bridge
```

## 🔍 故障排除

### 常见问题
1. **端口冲突**：修改 `docker-compose.yml` 中的端口映射
2. **配置不生效**：检查 `.env` 文件格式和权限
3. **容器启动失败**：查看日志 `docker-compose logs`

### 健康检查
```bash
# 检查应用状态
curl http://localhost:8080/health

# 检查配置加载
curl http://localhost:8080/config.json
```
