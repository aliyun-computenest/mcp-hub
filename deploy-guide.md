# MCP Registry Viewer 服务器部署指南

## 📋 部署步骤

### 1. 服务器环境准备
```bash
# 确保服务器已安装 Node.js (建议 16+ 版本)
node --version
npm --version

# 如果没有安装，可以使用以下命令安装
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. 项目部署
```bash
# 1. 将项目文件上传到服务器
# 可以使用 git clone、scp 或其他方式

# 2. 进入项目目录
cd mcp-registry-viewer

# 3. 安装依赖
npm install

# 4. 构建生产版本
npm run build
```

### 3. 配置真实的JSON文件

#### 3.1 修改 public/config.json
```json
{
  "mcpServers": {
    "howtocook-mcp": {
      "url": null,
      "command": "npx",
      "args": ["-y", "howtocook-mcp"],
      "type": null,
      "env": {}
    },
    "snowflake-mcp": {
      "url": null,
      "command": "npx", 
      "args": ["-y", "snowflake-mcp"],
      "type": null,
      "env": {
        "SNOWFLAKE_ACCOUNT": "",
        "SNOWFLAKE_USERNAME": "",
        "SNOWFLAKE_PASSWORD": ""
      }
    },
    "your-custom-mcp": {
      "url": "https://your-server.com/mcp",
      "command": null,
      "args": [],
      "type": "sse",
      "env": {
        "API_KEY": "your-api-key"
      }
    }
  }
}
```

#### 3.2 修改 public/config_detail.json
```json
[
  {
    "ServerCode": "your-custom-mcp",
    "Author": "@your-team",
    "ServiceName": {
      "zh-cn": "你的MCP服务",
      "en": "Your MCP Service"
    },
    "Tags": ["工具", "API"],
    "Description": {
      "zh-cn": "你的MCP服务描述",
      "en": "Your MCP service description"
    },
    "EnvsDescription": {
      "zh-cn": "需要配置API密钥",
      "en": "Requires API key configuration"
    },
    "Icon": "🔧",
    "ReadMeUrl": "https://github.com/your-org/your-mcp",
    "Type": "SSE",
    "Content": {
      "url": "https://your-server.com/mcp",
      "env": {
        "API_KEY": ""
      }
    },
    "EnvSchema": {
      "API_KEY": {
        "type": "string",
        "description": "API访问密钥"
      }
    },
    "EntityDoc": {
      "en": "https://your-docs.com/en",
      "zh-cn": "https://your-docs.com/zh"
    }
  }
]
```

### 4. 修改服务器配置

#### 4.1 更新 src/config/serverConfig.js
```javascript
export const SERVER_CONFIG = {
  // 你的公网IP
  publicIp: '你的公网IP',
  publicToken: '你的公网Token',
  
  // 你的私网IP  
  privateIp: '你的私网IP',
  privateToken: '你的私网Token',
  
  // 其他配置保持不变...
};
```

### 5. 使用 Nginx 部署

#### 5.1 安装 Nginx
```bash
sudo apt update
sudo apt install nginx
```

#### 5.2 配置 Nginx
创建配置文件 `/etc/nginx/sites-available/mcp-registry`:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或IP
    
    root /path/to/mcp-registry-viewer/dist;  # 替换为实际路径
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # JSON配置文件不缓存
    location ~* \.(json)$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

#### 5.3 启用站点
```bash
sudo ln -s /etc/nginx/sites-available/mcp-registry /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. 使用 PM2 部署 (可选)

如果你想使用开发服务器而不是静态文件：

```bash
# 安装 PM2
npm install -g pm2

# 创建 PM2 配置文件
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'mcp-registry-viewer',
    script: 'npm',
    args: 'run dev',
    cwd: '/path/to/mcp-registry-viewer',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

# 启动应用
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 7. 防火墙配置
```bash
# 开放必要端口
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000  # 如果使用开发服务器
```

## 🔧 配置说明

### JSON 配置文件说明

1. **config.json**: 定义MCP服务器的基本连接信息
2. **config_detail.json**: 定义MCP服务器的详细信息和元数据

### 服务器配置说明

1. **IP配置**: 在 `serverConfig.js` 中配置你的公网和私网IP
2. **Token配置**: 配置对应的访问令牌
3. **端口配置**: 确保MCP服务器运行在正确的端口上

## 🚀 启动应用

### 生产环境 (推荐)
```bash
npm run build
# 然后使用 Nginx 提供静态文件服务
```

### 开发环境
```bash
npm run dev
# 应用将在 http://your-server:3000 运行
```

## 📝 注意事项

1. **安全性**: 确保敏感信息（如API密钥）不要提交到版本控制
2. **HTTPS**: 生产环境建议配置SSL证书
3. **备份**: 定期备份配置文件
4. **监控**: 使用PM2或其他工具监控应用状态
