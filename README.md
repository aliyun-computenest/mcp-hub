# MCP Hub

[![Docker Build](https://github.com/aliyun-computenest/mcp-hub/actions/workflows/docker-build.yml/badge.svg)](https://github.com/aliyun-computenest/mcp-hub/actions/workflows/docker-build.yml)
[![Docker Pulls](https://img.shields.io/docker/pulls/aliyuncomputenest/mcp-hub)](https://hub.docker.com/r/aliyuncomputenest/mcp-hub)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MCP Hub 是一个用于展示和管理 Model Context Protocol (MCP) 服务器的注册中心查看器。支持私有化部署，兼容 MCP Registry 官方协议，具备更多管理能力，支持自动注册、智能路由的 MCP Registry。

## ✨ 特性

- 🚀 **快速部署**: 支持 Docker 一键部署
- 🔧 **灵活配置**: 支持公网/私网IP切换
- 🔐 **安全认证**: 支持 Token 认证和权限管理
- 📱 **响应式设计**: 适配桌面和移动端
- 🌐 **多连接方式**: 支持 SSE、StreamableHttp、OpenAPI
- 📊 **实时监控**: 服务器状态实时展示

## 🚀 快速开始

### Docker 部署 (推荐)

```bash
# 1. 克隆项目
git clone https://github.com/aliyun-computenest/mcp-hub.git
cd mcp-hub

# 2. 配置环境变量
cp .env.example .env
vim .env  # 修改你的配置

# 3. 启动服务
docker-compose up -d

# 4. 访问应用
open http://localhost:8080
```

### 使用预构建镜像

```bash
# 直接使用 GitHub Container Registry 镜像
docker run -d \
  --name mcp-hub \
  -p 8080:80 \
  -e PUBLIC_IP=your-public-ip \
  -e PRIVATE_IP=your-private-ip \
  -e API_KEY=your-api-key \
  ghcr.io/aliyun-computenest/mcp-hub:latest
```

## 📖 配置说明

### 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `PUBLIC_IP` | 公网IP地址 | `47.84.65.28` |
| `PRIVATE_IP` | 私网IP地址 | `192.168.1.100` |
| `API_KEY` | API密钥/Token | - |
| `APP_PORT` | 应用端口 | `8080` |

### 配置文件

- `public/config.json` - MCP服务器基础配置
- `public/config_detail.json` - MCP服务器详细信息

## 🛠️ 开发

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 技术栈

- **前端**: React 18 + Ant Design
- **构建**: Webpack 5 + Babel
- **路由**: React Router (Hash模式)
- **部署**: Docker + Nginx

## 📝 API 文档

详细的API文档请参考 [API Documentation](./docs/api.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Model Context Protocol](https://modelcontextprotocol.io/) - MCP 官方协议
- [Ant Design](https://ant.design/) - UI 组件库
- [React](https://reactjs.org/) - 前端框架

---

由 [阿里云计算巢团队](https://github.com/aliyun-computenest) 维护
