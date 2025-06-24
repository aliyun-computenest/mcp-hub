// Mock 数据
export const MOCK_MCP_DATA = [
  {
    serverCode: 'howtocook-mcp',
    name: '今天吃什么',
    description: '让 AI 助手变身私人大厨，为你的一日三餐出谋划策！基于程序员做饭指南，提供详细的菜谱和烹饪指导。',
    icon: 'https://resources.modelscope.cn/studio-cover-pre/studio-cover_07affeaa-4d37-4e6d-bad8-47b5f57f0ce4.png',
    author: '@worryzyy',
    tags: ['美食', '生活', '菜谱'],
    type: 'SSE',
    readmeUrl: 'https://github.com/worryzyy/HowToCook-mcp',
    createTime: '2024-01-15',
    connectionTypes: ['sse', 'streamableHttp', 'openapi'],
    defaultConnection: 'sse',
    port: 8080,
    envSchema: {},
    envsDescription: '无需额外环境变量配置',
    entityDoc: 'https://github.com/worryzyy/HowToCook-mcp/blob/main/README.md'
  },
  {
    serverCode: 'snowflake-mcp',
    name: '雪花数据库',
    description: '该 MCP 服务器使大型语言模型（LLMs）能够与 SnowFlake 数据库进行交互，实现安全、可控的数据操作。支持查询、分析和数据管理功能。',
    icon: '❄️',
    author: '@snowflake',
    tags: ['数据库', '分析', '企业'],
    type: 'StreamableHttp',
    readmeUrl: 'https://github.com/snowflake/snowflake-mcp',
    createTime: '2024-01-10',
    connectionTypes: ['streamableHttp', 'openapi'],
    defaultConnection: 'streamableHttp',
    port: 8081,
    envSchema: {
      SNOWFLAKE_ACCOUNT: {
        type: 'string',
        description: 'SnowFlake账户名'
      },
      SNOWFLAKE_USERNAME: {
        type: 'string', 
        description: '用户名'
      },
      SNOWFLAKE_PASSWORD: {
        type: 'string',
        description: '密码'
      }
    },
    envsDescription: '需要配置 SnowFlake 连接信息',
    entityDoc: 'https://docs.snowflake.com/mcp'
  },
  {
    serverCode: 'langflow-doc-qa-server',
    name: '文档问答服务器',
    description: '一个基于 Langflow 的文档问答模型上下文协议（MCP）服务器，通过提供简单接口来查询文档，支持多种文档格式和智能问答。',
    icon: '📚',
    author: '@langflow',
    tags: ['文档', '问答', 'AI'],
    type: 'SSE',
    readmeUrl: 'https://github.com/langflow/langflow-doc-qa-server',
    createTime: '2024-01-08',
    connectionTypes: ['sse', 'openapi'],
    defaultConnection: 'sse',
    port: 8082,
    envSchema: {
      LANGFLOW_API_KEY: {
        type: 'string',
        description: 'Langflow API 密钥'
      }
    },
    envsDescription: '需要配置 Langflow API 密钥',
    entityDoc: 'https://docs.langflow.org/mcp'
  },
  {
    serverCode: 'weather-mcp',
    name: '天气查询服务',
    description: '提供全球天气信息查询服务，支持实时天气、天气预报、历史天气数据查询。集成多个天气数据源，确保数据准确性。',
    icon: '🌤️',
    author: '@weather-team',
    tags: ['天气', '查询', '实用工具'],
    type: 'OpenAPI',
    readmeUrl: 'https://github.com/weather-team/weather-mcp',
    createTime: '2024-01-12',
    connectionTypes: ['sse', 'streamableHttp', 'openapi'],
    defaultConnection: 'openapi',
    port: 8083,
    envSchema: {
      WEATHER_API_KEY: {
        type: 'string',
        description: '天气API密钥'
      }
    },
    envsDescription: '需要配置天气API密钥',
    entityDoc: 'https://weather-mcp.docs.com'
  },
  {
    serverCode: 'database-query-mcp',
    name: '数据库查询工具',
    description: '通用数据库查询 MCP 服务器，支持 MySQL、PostgreSQL、SQLite 等多种数据库。提供安全的查询接口和数据分析功能。',
    icon: '🗄️',
    author: '@db-tools',
    tags: ['数据库', '查询', '分析'],
    type: 'StreamableHttp',
    readmeUrl: 'https://github.com/db-tools/database-query-mcp',
    createTime: '2024-01-05',
    connectionTypes: ['streamableHttp', 'openapi'],
    defaultConnection: 'streamableHttp',
    port: 8084,
    envSchema: {
      DB_HOST: {
        type: 'string',
        description: '数据库主机地址'
      },
      DB_PORT: {
        type: 'number',
        description: '数据库端口'
      },
      DB_USER: {
        type: 'string',
        description: '数据库用户名'
      },
      DB_PASSWORD: {
        type: 'string',
        description: '数据库密码'
      }
    },
    envsDescription: '需要配置数据库连接信息',
    entityDoc: 'https://db-tools.github.io/docs'
  },
  {
    serverCode: 'file-manager-mcp',
    name: '文件管理器',
    description: '强大的文件管理 MCP 服务器，支持文件上传、下载、搜索、批量操作等功能。提供安全的文件访问控制和版本管理。',
    icon: '📁',
    author: '@file-team',
    tags: ['文件管理', '存储', '工具'],
    type: 'SSE',
    readmeUrl: 'https://github.com/file-team/file-manager-mcp',
    createTime: '2024-01-03',
    connectionTypes: ['sse', 'streamableHttp', 'openapi'],
    defaultConnection: 'sse',
    port: 8085,
    envSchema: {
      STORAGE_PATH: {
        type: 'string',
        description: '文件存储路径'
      },
      MAX_FILE_SIZE: {
        type: 'number',
        description: '最大文件大小(MB)'
      }
    },
    envsDescription: '需要配置存储路径和文件大小限制',
    entityDoc: 'https://file-manager-mcp.docs.com'
  }
];
