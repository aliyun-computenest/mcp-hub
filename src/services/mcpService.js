import axios from 'axios';

class MCPService {
  constructor() {
    this.configCache = null;
    this.detailCache = null;
  }

  // 获取本地配置文件
  async fetchConfig() {
    if (this.configCache) {
      console.log('使用缓存的配置文件');
      return this.configCache;
    }

    try {
      console.log('开始请求 config.json...');
      const response = await axios.get('/config.json', {
        timeout: 10000,
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      console.log('config.json 请求成功:', response.data);
      this.configCache = response.data;
      return this.configCache;
    } catch (error) {
      console.error('Failed to fetch config.json:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url
      });
      throw new Error(`无法加载配置文件: ${error.message}`);
    }
  }

  // 获取详细信息文件
  async fetchConfigDetail() {
    if (this.detailCache) {
      console.log('使用缓存的详细配置文件');
      return this.detailCache;
    }

    try {
      console.log('开始请求 config_detail.json...');
      const response = await axios.get('/config_detail.json', {
        timeout: 10000,
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      console.log('config_detail.json 请求成功:', response.data);
      this.detailCache = response.data;
      return this.detailCache;
    } catch (error) {
      console.error('Failed to fetch config_detail.json:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url
      });
      throw new Error(`无法加载详细配置文件: ${error.message}`);
    }
  }

  // 获取当前语言
  getCurrentLanguage() {
    return navigator.language.startsWith('zh') ? 'zh-cn' : 'en';
  }

  // 获取MCP列表
  async getMCPList() {
    try {
      console.log('开始获取MCP列表...');
      
      console.log('开始并行请求配置文件...');
      const [config, details] = await Promise.all([
        this.fetchConfig(),
        this.fetchConfigDetail()
      ]);

      console.log('所有配置文件加载完成');
      console.log('配置文件:', config);
      console.log('详细信息:', details);

      const language = this.getCurrentLanguage();
      console.log('当前语言:', language);
      
      const mcpServers = config.mcpServers || {};
      console.log('MCP服务器配置:', mcpServers);
      
      // 将配置和详细信息合并
      const mcpList = Object.keys(mcpServers).map(serverCode => {
        console.log(`处理服务器: ${serverCode}`);
        const serverConfig = mcpServers[serverCode];
        const detail = details.find(d => d.ServerCode === serverCode);
        
        if (!detail) {
          console.warn(`No detail found for server: ${serverCode}`);
          return null;
        }

        const mcpItem = {
          serverCode,
          name: detail.ServiceName[language] || detail.ServiceName.en || serverCode,
          description: detail.Description[language] || detail.Description.en || '',
          icon: detail.Icon || '🔧',
          author: detail.Author || '',
          tags: detail.Tags || [],
          type: detail.Type || 'Command',
          readmeUrl: detail.ReadMeUrl || '',
          createTime: '最近更新',
          config: serverConfig,
          detail: detail
        };
        
        console.log(`处理完成的MCP项目:`, mcpItem);
        return mcpItem;
      }).filter(Boolean);

      console.log('处理后的MCP列表:', mcpList);
      console.log(`总共处理了 ${mcpList.length} 个MCP服务器`);
      return mcpList;
    } catch (error) {
      console.error('Error getting MCP list:', error);
      console.error('Error stack:', error.stack);
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
        envsDescription: detail.EnvsDescription?.[language] || detail.EnvsDescription?.en || '',
        entityDoc: detail.EntityDoc?.[language] || detail.EntityDoc?.en || '',
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
