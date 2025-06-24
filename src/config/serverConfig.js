// 服务器配置文件
export const SERVER_CONFIG = {
  // 公网IP配置
  publicIp: '47.84.65.28',
  
  // 私网IP配置  
  privateIp: '192.168.1.100',
  
  // 默认使用公网IP
  usePublicIp: true,
  
  // 获取当前使用的IP
  getCurrentIp() {
    return this.usePublicIp ? this.publicIp : this.privateIp;
  },
  
  // 切换IP类型
  toggleIpType() {
    this.usePublicIp = !this.usePublicIp;
  },
  
  // 生成不同类型的连接配置
  generateConfig(serverCode, type, port = 8080, path = '') {
    const baseUrl = `http://${this.getCurrentIp()}:${port}`;
    const serverPath = path || `/${serverCode}`;
    
    switch (type) {
      case 'sse':
        return {
          mcpServers: {
            [serverCode]: {
              type: 'sse',
              url: `${baseUrl}${serverPath}/sse`,
              headers: {
                Authorization: 'Bearer K97iOtPxGe'
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
                Authorization: 'Bearer K97iOtPxGe'
              }
            }
          }
        };
        
      case 'openapi':
        return {
          mcpServers: {
            [serverCode]: {
              type: 'openapi',
              url: `${baseUrl}${serverPath}`
            }
          }
        };
        
      case 'command':
      default:
        return {
          mcpServers: {
            [serverCode]: {
              command: 'npx',
              args: ['-y', serverCode],
              env: {}
            }
          }
        };
    }
  }
};
