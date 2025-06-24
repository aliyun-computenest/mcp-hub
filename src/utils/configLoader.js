// 配置加载器
class ConfigLoader {
    constructor() {
        this.config = null;
        this.defaultConfig = {
            publicIp: '0.0.0.0',
            publicToken: 'admin',
            privateIp: '0.0.0.0',
            privateToken: 'admin',
            usePublicIp: true
        };
    }

    // 从多个来源加载配置
    async loadConfig() {
        if (this.config) {
            return this.config;
        }

        // 1. 尝试从环境变量加载（构建时注入）
        const envConfig = this.loadFromEnv();

        // 2. 尝试从配置文件加载
        const fileConfig = await this.loadFromFile();

        // 3. 尝试从URL参数加载
        const urlConfig = this.loadFromUrl();

        // 合并配置，优先级：URL > 文件 > 环境变量 > 默认值
        this.config = {
            ...this.defaultConfig,
            ...envConfig,
            ...fileConfig,
            ...urlConfig
        };

        console.log('Loaded config:', this.config);
        return this.config;
    }

    // 从环境变量加载
    loadFromEnv() {
        const config = {};

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

        return config;
    }

    // 从配置文件加载
    async loadFromFile() {
        try {
            const response = await fetch('/config/runtime-config.json');
            if (response.ok) {
                const config = await response.json();
                console.log('Loaded config from file:', config);
                return config;
            }
        } catch (error) {
            console.log('No runtime config file found, using defaults');
        }
        return {};
    }

    // 从URL参数加载
    loadFromUrl() {
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

    // 重置配置，强制重新加载
    resetConfig() {
        this.config = null;
    }
}

export const configLoader = new ConfigLoader();
