#!/bin/bash

# MCP Registry Viewer 部署脚本

echo "🚀 开始部署 MCP Registry Viewer..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"

# 安装依赖
echo "📦 安装依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

# 构建项目
echo "🔨 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 项目构建失败"
    exit 1
fi

echo "✅ 构建完成！"

# 检查是否安装了 PM2
if command -v pm2 &> /dev/null; then
    echo "🔄 使用 PM2 重启应用..."
    pm2 restart mcp-registry-viewer 2>/dev/null || pm2 start ecosystem.config.js
    pm2 save
else
    echo "💡 建议安装 PM2 进行进程管理: npm install -g pm2"
fi

# 检查是否安装了 Nginx
if command -v nginx &> /dev/null; then
    echo "🌐 检测到 Nginx，请确保配置正确"
    echo "   配置文件示例: nginx.conf"
else
    echo "💡 建议安装 Nginx 作为反向代理"
fi

echo ""
echo "🎉 部署完成！"
echo ""
echo "📋 接下来的步骤:"
echo "1. 修改 public/config.json 和 public/config_detail.json"
echo "2. 更新 src/config/serverConfig.js 中的IP和Token配置"
echo "3. 如果使用 Nginx，配置反向代理"
echo "4. 如果使用 PM2，运行: pm2 start ecosystem.config.js"
echo ""
echo "🔗 访问地址:"
echo "   开发模式: http://localhost:3000"
echo "   生产模式: 通过 Nginx 配置的域名/IP"
