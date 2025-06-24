import axios from 'axios';

class MCPService {
  constructor() {
    this.configCache = null;
    this.detailCache = null;
  }

  // 获取本地配置文件
  async fetchConfig() {
    if (this.configCache) {
      return this.configCache;
    }

    try {
      const response = await axios.get('/config.json');
      this.configCache = response.data;
      return this.configCache;
    } catch (error) {
      console.error('Failed to fetch config.json:', error);
      throw new Error('无法加载配置文件');
    }
  }

  // 获取详细信息文件
  async fetchConfigDetail() {
    if (this.detailCache) {
      return this.detailCache;
    }

    try {
      const response = await axios.get('/config_detail.json');
      this.detailCache = response.data;
      return this.detailCache;
    } catch (error) {
      console.error('Failed to fetch config_detail.json:', error);
      throw new Error('无法加载详细配置文件');
    }
  }

  // 获取当前语言
  getCurrentLanguage() {
    return navigator.language.startsWith('zh') ? 'zh-cn' : 'en';
  }

  // 获取MCP列表
  async getMCPList() {
    try {
      const [config, details] = await Promise.all([
        this.fetchConfig(),
        this.fetchConfigDetail()
      ]);

      const language = this.getCurrentLanguage();
      const mcpServers = config.mcpServers || {};
      
      // 将配置和详细信息合并
      const mcpList = Object.keys(mcpServers).map(serverCode => {
        const serverConfig = mcpServers[serverCode];
        const detail = details.find(d => d.ServerCode === serverCode);
        
        if (!detail) {
          console.warn(`No detail found for server: ${serverCode}`);
          return null;
        }

        return {
          serverCode,
          name: detail.ServiceName[language] || detail.ServiceName.en || serverCode,
          description: detail.Description[language] || detail.Description.en || '',
          icon: detail.Icon || '🔧',
          author: detail.Author || '',
          tags: detail.Tags || [],
          type: detail.Type || 'Command',
          readmeUrl: detail.ReadMeUrl || '',
          createTime: '最近更新', // 可以根据需要添加时间戳
          config: serverConfig,
          detail: detail
        };
      }).filter(Boolean);

      return mcpList;
    } catch (error) {
      console.error('Error getting MCP list:', error);
      throw error;
    }
  }

  // 根据serverCode获取MCP详情
  async getMCPDetail(serverCode) {
    try {
      const [config, details] = await Promise.all([
        this.fetchConfig(),
        this.fetchConfigDetail()
      ]);

      const language = this.getCurrentLanguage();
      const serverConfig = config.mcpServers[serverCode];
      const detail = details.find(d => d.ServerCode === serverCode);

      if (!detail || !serverConfig) {
        throw new Error(`MCP服务器 ${serverCode} 不存在`);
      }

      // 生成配置示例
      let configExample = '';
      if (detail.Type === 'Command') {
        configExample = JSON.stringify({
          mcpServers: {
            [serverCode]: {
              command: detail.Content.command,
              args: detail.Content.args,
              env: detail.Content.env
            }
          }
        }, null, 2);
      } else if (detail.Type === 'SSE') {
        configExample = JSON.stringify({
          mcpServers: {
            [serverCode]: {
              url: detail.Content.url
            }
          }
        }, null, 2);
      }

      return {
        serverCode,
        name: detail.ServiceName[language] || detail.ServiceName.en || serverCode,
        description: detail.Description[language] || detail.Description.en || '',
        icon: detail.Icon || '🔧',
        author: detail.Author || '',
        tags: detail.Tags || [],
        type: detail.Type || 'Command',
        readmeUrl: detail.ReadMeUrl || '',
        createTime: '最近更新',
        configExample,
        envSchema: detail.EnvSchema || {},
        envsDescription: detail.EnvsDescription[language] || detail.EnvsDescription.en || '',
        entityDoc: detail.EntityDoc[language] || detail.EntityDoc.en || '',
        config: serverConfig,
        detail: detail
      };
    } catch (error) {
      console.error('Error getting MCP detail:', error);
      throw error;
    }
  }

  // 清除缓存
  clearCache() {
    this.configCache = null;
    this.detailCache = null;
  }
}

export default new MCPService();
