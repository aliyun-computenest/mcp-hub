// 服务器配置文件
export const SERVER_CONFIG = {
  // 公网IP配置
  publicIp: '47.84.65.28',
  publicToken: 'K97iOtPxGe',
  
  // 私网IP配置  
  privateIp: '192.168.1.100',
  privateToken: 'K97iOtPxGe',
  
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
  
  // 生成不同类型的连接配置
  generateConfig(serverCode, type, port = 8080, path = '') {
    const token = this.getCurrentToken();
    let baseUrl;
    
    // OpenAPI 使用 8000 端口，其他使用指定端口
    if (type === 'openapi') {
      baseUrl = `http://${this.getCurrentIp()}:8000`;
    } else {
      baseUrl = `http://${this.getCurrentIp()}:${port}`;
    }
    
    const serverPath = path || `/${serverCode}`;
    
    switch (type) {
      case 'sse':
        return {
          mcpServers: {
            [serverCode]: {
              type: 'sse',
              url: `${baseUrl}${serverPath}/sse`,
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          }
        };
        
      case 'streamableHttp':
        return {
          mcpServers: {
            [serverCode]: {
              type: 'streamableHttp',
              url: `${baseUrl}${serverPath}`,
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          }
        };
        
      case 'openapi':
        return {
          url: `${baseUrl}${serverPath}`,
          apikey: token
        };
        
      default:
        return {};
    }
  }
};
