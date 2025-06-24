import { MOCK_MCP_DATA } from '../data/mockData';
import { SERVER_CONFIG } from '../config/serverConfig';

class MCPService {
  constructor() {
    this.mockData = MOCK_MCP_DATA;
  }

  // 获取当前语言
  getCurrentLanguage() {
    return navigator.language.startsWith('zh') ? 'zh-cn' : 'en';
  }

  // 获取MCP列表
  async getMCPList() {
    try {
      console.log('MCPService: 开始获取Mock数据...');
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mcpList = this.mockData.map(item => ({
        ...item,
        // 生成默认连接配置
        defaultConfig: SERVER_CONFIG.generateConfig(
          item.serverCode, 
          item.defaultConnection, 
          item.port
        )
      }));

      console.log('MCPService: Mock数据获取成功:', mcpList);
      return mcpList;
    } catch (error) {
      console.error('Error getting MCP list:', error);
      throw error;
    }
  }

  // 根据serverCode获取MCP详情
  async getMCPDetail(serverCode) {
    try {
      console.log('MCPService: 获取详情:', serverCode);
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const detail = this.mockData.find(item => item.serverCode === serverCode);
      
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
      publicIp: SERVER_CONFIG.publicIp,
      privateIp: SERVER_CONFIG.privateIp,
      usePublicIp: SERVER_CONFIG.usePublicIp
    };
  }
}

export default new MCPService();
