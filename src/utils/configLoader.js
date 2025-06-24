// 配置加载器
class ConfigLoader {
    constructor() {
        this.serverConfig = null; // 服务器连接配置
        this.mcpConfig = null;    // MCP 服务器配置
        this.mcpDetailConfig = null; // MCP 详细配置
        this.defaultServerConfig = {
            publicIp: '0.0.0.0',
            publicToken: 'admin',
            privateIp: '0.0.0.0',
            privateToken: 'admin',
            usePublicIp: true
        };
    }

    // 加载所有配置
    async loadAllConfigs() {
        // 并行加载所有配置
        const [serverConfig, mcpConfig, mcpDetailConfig] = await Promise.all([
            this.loadServerConfig(),
            this.loadMcpConfig(),
            this.loadMcpDetailConfig()
        ]);

        this.serverConfig = serverConfig;
        this.mcpConfig = mcpConfig;
        this.mcpDetailConfig = mcpDetailConfig;

        console.log('Loaded all configs:', {
            serverConfig: this.serverConfig,
            mcpServersCount: this.mcpConfig?.mcpServers ? Object.keys(this.mcpConfig.mcpServers).length : 0,
            mcpDetailsCount: this.mcpDetailConfig?.length || 0
        });

        return {
            serverConfig: this.serverConfig,
            mcpConfig: this.mcpConfig,
            mcpDetailConfig: this.mcpDetailConfig
        };
    }

    // 加载服务器连接配置（IP、Token等）
    async loadServerConfig() {
        if (this.serverConfig) {
            return this.serverConfig;
        }

        // 1. 从环境变量加载
        const envConfig = this.loadServerConfigFromEnv();

        // 2. 从运行时配置文件加载
        const runtimeConfig = await this.loadServerConfigFromFile();

        // 3. 从URL参数加载
        const urlConfig = this.loadServerConfigFromUrl();

        // 合并配置，优先级：URL > 运行时文件 > 环境变量 > 默认值
        const config = {
            ...this.defaultServerConfig,
            ...envConfig,
            ...runtimeConfig,
            ...urlConfig
        };

        return config;
    }

    // 加载 MCP 服务器配置
    async loadMcpConfig() {
        if (this.mcpConfig) {
            return this.mcpConfig;
        }

        try {
            const response = await fetch('/config.json');
            if (response.ok) {
                const config = await response.json();
                console.log('Loaded MCP config from config.json');
                return config;
            }
        } catch (error) {
            console.error('Failed to load MCP config:', error);
        }

        // 返回默认的空配置
        return { mcpServers: {} };
    }

    // 加载 MCP 详细配置
    async loadMcpDetailConfig() {
        if (this.mcpDetailConfig) {
            return this.mcpDetailConfig;
        }

        try {
            const response = await fetch('/config_detail.json');
            if (response.ok) {
                const config = await response.json();
                console.log('Loaded MCP detail config from config_detail.json');
                return config;
            }
        } catch (error) {
            console.error('Failed to load MCP detail config:', error);
        }

        // 返回默认的空数组
        return [];
    }

    // 从环境变量加载服务器配置
    loadServerConfigFromEnv() {
        const config = {};

        // 检查浏览器环境中的全局变量
        if (typeof window !== 'undefined' && window.SERVER_ENV_CONFIG) {
            return window.SERVER_ENV_CONFIG;
        }

        // Vite 环境变量
        if (typeof import.meta !== 'undefined' && import.meta.env) {
            if (import.meta.env.VITE_PUBLIC_IP) {
                config.publicIp = import.meta.env.VITE_PUBLIC_IP;
            }
            if (import.meta.env.VITE_PRIVATE_IP) {
                config.privateIp = import.meta.env.VITE_PRIVATE_IP;
            }
            if (import.meta.env.VITE_PUBLIC_TOKEN) {
                config.publicToken = import.meta.env.VITE_PUBLIC_TOKEN;
            }
            if (import.meta.env.VITE_PRIVATE_TOKEN) {
                config.privateToken = import.meta.env.VITE_PRIVATE_TOKEN;
            }
            if (import.meta.env.VITE_USE_PUBLIC_IP !== undefined) {
                config.usePublicIp = import.meta.env.VITE_USE_PUBLIC_IP === 'true';
            }
        }

        return config;
    }

    // 从文件加载服务器配置
    async loadServerConfigFromFile() {
        try {
            const response = await fetch('/server-config.json');
            if (response.ok) {
                const config = await response.json();
                console.log('Loaded server config from file:', config);
                return config;
            }
        } catch (error) {
            console.log('No server config file found');
        }
        return {};
    }

    // 从URL参数加载服务器配置
    loadServerConfigFromUrl() {
        if (typeof window === 'undefined') {
            return {};
        }

        const params = new URLSearchParams(window.location.search);
        const config = {};

        if (params.get('publicIp')) {
            config.publicIp = params.get('publicIp');
        }
        if (params.get('privateIp')) {
            config.privateIp = params.get('privateIp');
        }
        if (params.get('publicToken')) {
            config.publicToken = params.get('publicToken');
        }
        if (params.get('privateToken')) {
            config.privateToken = params.get('privateToken');
        }
        if (params.get('usePublicIp')) {
            config.usePublicIp = params.get('usePublicIp') === 'true';
        }

        return config;
    }

    // 获取服务器配置
    getServerConfig() {
        return this.serverConfig;
    }

    // 获取 MCP 配置
    getMcpConfig() {
        return this.mcpConfig;
    }

    // 获取 MCP 详细配置
    getMcpDetailConfig() {
        return this.mcpDetailConfig;
    }

    // 根据 ServerCode 获取详细信息
    getMcpDetailByCode(serverCode) {
        if (!this.mcpDetailConfig) {
            return null;
        }
        return this.mcpDetailConfig.find(item => item.ServerCode === serverCode);
    }

    // 重置配置
    resetConfigs() {
        this.serverConfig = null;
        this.mcpConfig = null;
        this.mcpDetailConfig = null;
    }
}

export const configLoader = new ConfigLoader();
