#!/bin/sh

# Docker 容器启动脚本

# 如果提供了环境变量，更新配置文件
if [ -n "$PUBLIC_IP" ] && [ -n "$PRIVATE_IP" ] && [ -n "$API_KEY" ]; then
    echo "🔧 更新服务器配置..."
    
    # 创建临时的 serverConfig.js
    cat > /tmp/serverConfig.js << EOF
// 服务器配置文件 - Docker 自动生成
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

    echo "✅ 配置已更新"
fi

# 启动 nginx
exec "$@"
