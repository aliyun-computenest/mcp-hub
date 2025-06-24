import { MOCK_MCP_DATA } from '../data/mockData';
import { SERVER_CONFIG } from '../config/serverConfig';

class MCPService {
  constructor() {
    this.mockData = MOCK_MCP_DATA;
    this.configData = null;
    this.detailData = null;
  }

  // 获取当前语言
  getCurrentLanguage() {
    return navigator.language.startsWith('zh') ? 'zh-cn' : 'en';
  }

  // 加载配置文件
  async loadConfigFiles() {
    try {
      // 加载 config.json
      const configResponse = await fetch('/config.json');
      if (configResponse.ok) {
        this.configData = await configResponse.json();
        console.log('MCPService: config.json 加载成功:', this.configData);
      } else {
        console.warn('MCPService: config.json 加载失败，使用 Mock 数据');
      }

      // 加载 config_detail.json
      const detailResponse = await fetch('/config_detail.json');
      if (detailResponse.ok) {
        this.detailData = await detailResponse.json();
        console.log('MCPService: config_detail.json 加载成功:', this.detailData);
      } else {
        console.warn('MCPService: config_detail.json 加载失败，使用 Mock 数据');
      }
    } catch (error) {
      console.error('MCPService: 配置文件加载失败:', error);
    }
  }

  // 创建兜底数据
  createFallbackData(serverCode, configItem) {
    const lang = this.getCurrentLanguage();
    return {
      serverCode,
      name: serverCode,
      description: `MCP 服务器 ${serverCode}`,
      icon: '🔧',
      author: 'Unknown',
      tags: ['工具'],
      readmeUrl: '',
      createTime: new Date().toISOString().split('T')[0],
      connectionTypes: ['sse', 'streamableHttp', 'openapi'],
      defaultConnection: 'sse',
      port: 8080,
      envSchema: configItem?.env || {},
      envsDescription: '请参考文档配置环境变量',
      entityDoc: '',
      usePublicIp: SERVER_CONFIG.usePublicIp
    };
  }

  // 转换详情数据格式
  convertDetailData(detailItem) {
    const lang = this.getCurrentLanguage();
    return {
      serverCode: detailItem.ServerCode,
      name: detailItem.ServiceName?.[lang] || detailItem.ServiceName?.en || detailItem.ServerCode,
      description: detailItem.Description?.[lang] || detailItem.Description?.en || '',
      icon: detailItem.Icon || '🔧',
      author: detailItem.Author || 'Unknown',
      tags: detailItem.Tags || [],
      readmeUrl: detailItem.ReadMeUrl || '',
      createTime: new Date().toISOString().split('T')[0],
      connectionTypes: ['sse', 'streamableHttp', 'openapi'],
      defaultConnection: 'sse',
      port: 8080,
      envSchema: detailItem.EnvSchema || {},
      envsDescription: detailItem.EnvsDescription?.[lang] || detailItem.EnvsDescription?.en || '',
      entityDoc: detailItem.EntityDoc?.[lang] || detailItem.EntityDoc?.en || '',
      usePublicIp: SERVER_CONFIG.usePublicIp
    };
  }

  // 获取MCP列表
  async getMCPList() {
    try {
      console.log('MCPService: 开始获取数据...');
      
      // 加载配置文件
      await this.loadConfigFiles();
      
      let mcpList = [];

      if (this.configData?.mcpServers) {
        // 使用配置文件数据
        console.log('MCPService: 使用配置文件数据');
        
        Object.keys(this.configData.mcpServers).forEach(serverCode => {
          const configItem = this.configData.mcpServers[serverCode];
          
          // 查找详情数据
          const detailItem = this.detailData?.find(item => item.ServerCode === serverCode);
          
          if (detailItem) {
            // 有详情数据，使用详情数据
            mcpList.push(this.convertDetailData(detailItem));
          }
        });
      } else {
        // 使用 Mock 数据
        console.log('MCPService: 使用 Mock 数据');
        mcpList = this.mockData;
      }

      console.log('MCPService: 数据获取成功:', mcpList);
      return mcpList;
    } catch (error) {
      console.error('Error getting MCP list:', error);
      // 完全兜底，返回 Mock 数据
      console.log('MCPService: 使用 Mock 数据作为最终兜底');
      return this.mockData;
    }
  }

  // 根据serverCode获取MCP详情
  async getMCPDetail(serverCode) {
    try {
      console.log('MCPService: 获取详情:', serverCode);
      
      // 确保配置文件已加载
      if (!this.configData || !this.detailData) {
        await this.loadConfigFiles();
      }
      
      let detail = null;

      // 先从详情数据中查找
      if (this.detailData) {
        const detailItem = this.detailData.find(item => item.ServerCode === serverCode);
        if (detailItem) {
          detail = this.convertDetailData(detailItem);
        }
      }

      // 如果详情数据中没有，从配置数据中查找并创建兜底数据
      if (!detail && this.configData?.mcpServers?.[serverCode]) {
        console.warn(`MCPService: ${serverCode} 详情不存在，使用兜底数据`);
        detail = this.createFallbackData(serverCode, this.configData.mcpServers[serverCode]);
      }

      // 最后从 Mock 数据中查找
      if (!detail) {
        detail = this.mockData.find(item => item.serverCode === serverCode);
      }
      
      if (!detail) {
        throw new Error(`MCP服务器 ${serverCode} 不存在`);
      }

      // 生成所有支持的连接配置
      const connectionConfigs = {};
      detail.connectionTypes.forEach(type => {
        connectionConfigs[type] = SERVER_CONFIG.generateConfig(
          detail.serverCode, 
          type, 
          detail.port
        );
      });

      return {
        ...detail,
        connectionConfigs,
        currentIp: SERVER_CONFIG.getCurrentIp(),
        currentToken: SERVER_CONFIG.getCurrentToken(),
        publicIp: SERVER_CONFIG.publicIp,
        privateIp: SERVER_CONFIG.privateIp
      };
    } catch (error) {
      console.error('Error getting MCP detail:', error);
      throw error;
    }
  }

  // 切换IP类型
  toggleIpType() {
    SERVER_CONFIG.toggleIpType();
    return SERVER_CONFIG.getCurrentIp();
  }

  // 获取当前IP配置
  getCurrentIpConfig() {
    return {
      currentIp: SERVER_CONFIG.getCurrentIp(),
      currentToken: SERVER_CONFIG.getCurrentToken(),
      publicIp: SERVER_CONFIG.publicIp,
      privateIp: SERVER_CONFIG.privateIp,
      usePublicIp: SERVER_CONFIG.usePublicIp
    };
  }
}

export default new MCPService();
