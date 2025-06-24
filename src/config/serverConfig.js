import { configLoader } from './utils/configLoader.js';

// 服务器配置类
class ServerConfig {
  constructor() {
    this.config = null;
    this.initialized = false;
  }

  // 初始化配置
  async init() {
    if (!this.initialized) {
      this.config = await configLoader.loadConfig();
      this.initialized = true;
    }
    return this.config;
  }

  // 获取当前使用的IP
  getCurrentIp() {
    if (!this.config) {
      throw new Error('Config not initialized. Call init() first.');
    }
    return this.config.usePublicIp ? this.config.publicIp : this.config.privateIp;
  }

  // 获取当前使用的Token
  getCurrentToken() {
    if (!this.config) {
      throw new Error('Config not initialized. Call init() first.');
    }
    return this.config.usePublicIp ? this.config.publicToken : this.config.privateToken;
  }

  // 切换IP类型
  toggleIpType() {
    if (!this.config) {
      throw new Error('Config not initialized. Call init() first.');
    }
    this.config.usePublicIp = !this.config.usePublicIp;
  }

  // 检查Token是否有效
  hasValidToken() {
    const token = this.getCurrentToken();
    return token && token.trim() !== '';
  }

  // 更新配置
  updateConfig(newConfig) {
    if (this.config) {
      Object.assign(this.config, newConfig);
    }
  }

  // 生成不同类型的连接配置
  generateConfig(serverCode, type, port = 8080, path = '') {
    const token = this.getCurrentToken();
    const hasToken = this.hasValidToken();
    let baseUrl;

    if (type === 'openapi') {
      baseUrl = `http://${this.getCurrentIp()}:8000`;
    } else {
      baseUrl = `http://${this.getCurrentIp()}:${port}`;
    }

    const serverPath = path || `/${serverCode}`;

    switch (type) {
      case 'sse':
        const sseConfig = {
          mcpServers: {
            [serverCode]: {
              type: 'sse',
              url: `${baseUrl}${serverPath}/sse`
            }
          }
        };

        if (hasToken) {
          sseConfig.mcpServers[serverCode].headers = {
            Authorization: `Bearer ${token}`
          };
        }

        return sseConfig;

      case 'streamableHttp':
        const httpConfig = {
          mcpServers: {
            [serverCode]: {
              type: 'streamableHttp',
              url: `${baseUrl}${serverPath}`
            }
          }
        };

        if (hasToken) {
          httpConfig.mcpServers[serverCode].headers = {
            Authorization: `Bearer ${token}`
          };
        }

        return httpConfig;

      case 'openapi':
        const openApiConfig = {
          url: `${baseUrl}${serverPath}`
        };

        if (hasToken) {
          openApiConfig.apikey = token;
        }

        return openApiConfig;

      default:
        return {};
    }
  }
}

// 导出单例
export const SERVER_CONFIG = new ServerConfig();
