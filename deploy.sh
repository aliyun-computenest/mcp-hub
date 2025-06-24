#!/bin/bash

# MCP Registry Viewer 部署脚本

# 显示使用说明
show_usage() {
    echo "使用方法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -p, --public-ip PUBLIC_IP     公网IP地址"
    echo "  -r, --private-ip PRIVATE_IP   私网IP地址"
    echo "  -k, --api-key API_KEY         API密钥/Token"
    echo "  -h, --help                    显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 -p 47.84.65.28 -r 192.168.1.100 -k K97iOtPxGe"
    echo "  $0 --public-ip 47.84.65.28 --private-ip 192.168.1.100 --api-key K97iOtPxGe"
}

# 默认值
PUBLIC_IP=""
PRIVATE_IP=""
API_KEY=""

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--public-ip)
            PUBLIC_IP="$2"
            shift 2
            ;;
        -r|--private-ip)
            PRIVATE_IP="$2"
            shift 2
            ;;
        -k|--api-key)
            API_KEY="$2"
            shift 2
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            echo "未知选项: $1"
            show_usage
            exit 1
            ;;
    esac
done

# 检查必需参数
if [[ -z "$PUBLIC_IP" || -z "$PRIVATE_IP" || -z "$API_KEY" ]]; then
    echo "❌ 缺少必需参数"
    echo ""
    show_usage
    exit 1
fi

echo "🚀 开始部署 MCP Registry Viewer..."
echo "📋 配置信息:"
echo "   公网IP: $PUBLIC_IP"
echo "   私网IP: $PRIVATE_IP"
echo "   API密钥: ${API_KEY:0:8}..."

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

# 修改服务器配置
echo "🔧 更新服务器配置..."
cat > src/config/serverConfig.js << EOF
// 服务器配置文件
export const SERVER_CONFIG = {
  // 公网IP配置
  publicIp: '$PUBLIC_IP',
  publicToken: '$API_KEY',
  
  // 私网IP配置  
  privateIp: '$PRIVATE_IP',
  privateToken: '$API_KEY',
  
  // 默认使用公网IP
  usePublicIp: true,
  
  // 获取当前使用的IP
  getCurrentIp() {
    return this.usePublicIp ? this.publicIp : this.privateIp;
  },
  
  // 获取当前使用的Token
  getCurrentToken() {
    return this.usePublicIp ? this.publicToken : this.privateToken;
  },
  
  // 切换IP类型
  toggleIpType() {
    this.usePublicIp = !this.usePublicIp;
  },
  
  // 检查Token是否有效
  hasValidToken() {
    const token = this.getCurrentToken();
    return token && token.trim() !== '';
  },
  
  // 生成不同类型的连接配置
  generateConfig(serverCode, type, port = 8080, path = '') {
    const token = this.getCurrentToken();
    const hasToken = this.hasValidToken();
    let baseUrl;
    
    // OpenAPI 使用 8000 端口，其他使用指定端口
    if (type === 'openapi') {
      baseUrl = \`http://\${this.getCurrentIp()}:8000\`;
    } else {
      baseUrl = \`http://\${this.getCurrentIp()}:\${port}\`;
    }
    
    const serverPath = path || \`/\${serverCode}\`;
    
    switch (type) {
      case 'sse':
        const sseConfig = {
          mcpServers: {
            [serverCode]: {
              type: 'sse',
              url: \`\${baseUrl}\${serverPath}/sse\`
            }
          }
        };
        
        if (hasToken) {
          sseConfig.mcpServers[serverCode].headers = {
            Authorization: \`Bearer \${token}\`
          };
        }
        
        return sseConfig;
        
      case 'streamableHttp':
        const httpConfig = {
          mcpServers: {
            [serverCode]: {
              type: 'streamableHttp',
              url: \`\${baseUrl}\${serverPath}\`
            }
          }
        };
        
        if (hasToken) {
          httpConfig.mcpServers[serverCode].headers = {
            Authorization: \`Bearer \${token}\`
          };
        }
        
        return httpConfig;
        
      case 'openapi':
        const openApiConfig = {
          url: \`\${baseUrl}\${serverPath}\`
        };
        
        if (hasToken) {
          openApiConfig.apikey = token;
        }
        
        return openApiConfig;
        
      default:
        return {};
    }
  }
};
EOF

echo "✅ 服务器配置已更新"

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
echo "📋 配置信息:"
echo "   公网IP: $PUBLIC_IP"
echo "   私网IP: $PRIVATE_IP"
echo "   API密钥: 已配置"
echo ""
echo "📝 接下来的步骤:"
echo "1. 修改 public/config.json 和 public/config_detail.json (可选)"
echo "2. 如果使用 Nginx，配置反向代理"
echo "3. 如果使用 PM2，运行: pm2 start ecosystem.config.js"
echo ""
echo "🔗 访问地址:"
echo "   开发模式: http://localhost:3000"
echo "   生产模式: 通过 Nginx 配置的域名/IP"
