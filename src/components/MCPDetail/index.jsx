import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, message, Input, Tag, Spin, Descriptions, Tabs, Space, Switch, Alert } from 'antd';
import { CopyOutlined, LinkOutlined, ArrowLeftOutlined, FileTextOutlined, GlobalOutlined, HomeOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import mcpService from '../../services/mcpService';
import './index.css';

const MCPDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [mcpData, setMcpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeConnectionType, setActiveConnectionType] = useState('');

  const fetchMCPDetail = async () => {
    try {
      const data = await mcpService.getMCPDetail(name);
      setMcpData(data);
      setActiveConnectionType(data.defaultConnection);
    } catch (error) {
      console.error('Error fetching MCP detail:', error);
      if (error.message.includes('不存在')) {
        message.error(`MCP 服务器 "${name}" 不存在或配置不完整`);
      } else {
        message.warning('获取 MCP 详情失败，显示的可能是默认配置');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMCPDetail();
  }, [name]);

  const copyToClipboard = (text) => {
    // 方法1：检查并使用现代 API
    if (window.navigator && window.navigator.clipboard && window.navigator.clipboard.writeText) {
      window.navigator.clipboard.writeText(text)
          .then(() => message.success('复制成功'))
          .catch(() => execCommandCopy(text));
    } else {
      // 方法2：使用传统方法
      execCommandCopy(text);
    }
  };

  const execCommandCopy = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';

    document.body.appendChild(textArea);
    textArea.select();

    try {
      const success = document.execCommand('copy');
      message[success ? 'success' : 'error'](success ? '复制成功' : '复制失败，请手动复制');
    } catch (error) {
      console.error('复制失败:', error);
      message.error('复制失败，请手动复制');
    } finally {
      document.body.removeChild(textArea);
    }
  };


  const handleToggleIp = async () => {
    const newIp = mcpService.toggleIpType();
    const config = mcpService.getCurrentIpConfig();
    
    // 重新获取详情以更新配置
    try {
      const data = await mcpService.getMCPDetail(name);
      setMcpData(data);
      message.success(`已切换到${config.usePublicIp ? '公网' : '私网'}IP: ${newIp}`);
    } catch (error) {
      message.error('切换IP失败: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="mcp-detail-container">
        <div className="loading-container">
          <Spin size="large" />
          <p>正在加载 MCP 服务器详情...</p>
        </div>
      </div>
    );
  }

  if (!mcpData) {
    return (
      <div className="mcp-detail-container">
        <div className="error-container">
          <p>未找到该 MCP 服务器</p>
          <Button onClick={() => navigate('/')}>返回首页</Button>
        </div>
      </div>
    );
  }

  // 检查是否有有效的Token
  const hasValidToken = mcpData.currentToken && mcpData.currentToken.trim() !== '';

  const connectionTabs = mcpData.connectionTypes.map(type => ({
    key: type,
    label: (
      <span>
        {type.toUpperCase()}
        {type === mcpData.defaultConnection && <Tag size="small" color="blue" style={{marginLeft: 8}}>推荐</Tag>}
      </span>
    ),
    children: (
      <div className="connection-config">
        <div className="config-header">
          <h4>{type.toUpperCase()} 连接配置</h4>
          <Button 
            icon={<CopyOutlined />} 
            onClick={() => copyToClipboard(JSON.stringify(mcpData.connectionConfigs[type], null, 2))}
          >
            复制配置
          </Button>
        </div>
        
        {!hasValidToken && (
          <Alert
            message="Token 未配置"
            description="当前未配置有效的 API Token，连接配置中将不包含认证信息。请联系管理员配置 Token。"
            type="warning"
            icon={<ExclamationCircleOutlined />}
            style={{ marginBottom: 16 }}
            showIcon
          />
        )}
        
        <Input.TextArea 
          value={JSON.stringify(mcpData.connectionConfigs[type], null, 2)}
          readOnly 
          autoSize={{ minRows: 6, maxRows: 12 }}
          className="config-textarea"
        />
        <div className="config-description">
          <p><strong>连接说明:</strong></p>
          <ul>
            {type === 'sse' && (
              <>
                <li>Server-Sent Events 连接方式，支持实时数据推送</li>
                <li>适用于需要实时更新的场景</li>
                {hasValidToken && <li>需要配置 Authorization 头部进行身份验证</li>}
                {!hasValidToken && <li style={{color: '#faad14'}}>⚠️ 当前未配置认证信息，可能需要手动添加</li>}
              </>
            )}
            {type === 'streamableHttp' && (
              <>
                <li>流式HTTP连接，支持长连接和数据流传输</li>
                <li>适用于大数据量传输场景</li>
                <li>支持断点续传和错误重试</li>
                {hasValidToken && <li>使用 Authorization 头部进行身份验证</li>}
                {!hasValidToken && <li style={{color: '#faad14'}}>⚠️ 当前未配置认证信息，可能需要手动添加</li>}
              </>
            )}
            {type === 'openapi' && (
              <>
                <li>标准的OpenAPI/REST接口</li>
                <li>兼容性最好，易于集成</li>
                <li>支持标准的HTTP方法和状态码</li>
                {hasValidToken && <li>使用 API Key 进行访问认证</li>}
                {!hasValidToken && <li style={{color: '#faad14'}}>⚠️ 当前未配置 API Key，可能需要手动添加</li>}
              </>
            )}
          </ul>
        </div>
      </div>
    )
  }));

  return (
    <div className="mcp-detail-container">
      <div className="detail-header">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/')}
          className="back-button"
        >
          返回列表
        </Button>
        
        <div className="header-main">
          <div className="header-icon">
            {typeof mcpData.icon === 'string' && mcpData.icon.startsWith('http') ? (
              <img src={mcpData.icon} alt={mcpData.name} className="header-icon-img" />
            ) : (
              mcpData.icon
            )}
          </div>
          <div className="header-content">
            <h1>{mcpData.name}</h1>
            <p className="update-time">{mcpData.createTime}</p>
            <div className="header-tags">
              {mcpData.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>
          <div className="header-controls">
            <div className="ip-switch">
              <Space>
                <span>
                  <GlobalOutlined /> 公网
                </span>
                <Switch 
                  checked={!mcpData.usePublicIp} 
                  onChange={handleToggleIp}
                  size="small"
                />
                <span>
                  <HomeOutlined /> 私网
                </span>
              </Space>
              <div className="current-ip">
                当前: {mcpData.currentIp}
              </div>
              {!hasValidToken && (
                <div className="token-warning">
                  <ExclamationCircleOutlined style={{color: '#faad14'}} /> Token未配置
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="detail-content">
        <div className="overview-section">
          <div className="overview-left">
            <Card title="基本信息" className="info-card">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="服务名称">{mcpData.name}</Descriptions.Item>
                <Descriptions.Item label="作者">{mcpData.author}</Descriptions.Item>
                <Descriptions.Item label="描述">{mcpData.description}</Descriptions.Item>
                <Descriptions.Item label="默认端口">{mcpData.port}</Descriptions.Item>
                {mcpData.envsDescription && (
                  <Descriptions.Item label="环境说明">{mcpData.envsDescription}</Descriptions.Item>
                )}
              </Descriptions>
            </Card>
            
            <Card title="相关链接" className="source-card">
              {mcpData.readmeUrl && (
                <div className="link-item">
                  <a href={mcpData.readmeUrl} target="_blank" rel="noopener noreferrer" className="source-link">
                    <LinkOutlined /> 源码地址
                  </a>
                </div>
              )}
              {mcpData.entityDoc && (
                <div className="link-item">
                  <a href={mcpData.entityDoc} target="_blank" rel="noopener noreferrer" className="source-link">
                    <FileTextOutlined /> 文档地址
                  </a>
                </div>
              )}
            </Card>

            {Object.keys(mcpData.envSchema).length > 0 && (
              <Card title="环境变量配置" className="env-card">
                <Descriptions column={1} size="small">
                  {Object.entries(mcpData.envSchema).map(([key, schema]) => (
                    <Descriptions.Item key={key} label={key}>
                      <div>
                        <Tag>{schema.type}</Tag>
                        <span>{schema.description}</span>
                      </div>
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </Card>
            )}
          </div>

          <div className="overview-right">
            <Card title="连接配置" className="connection-card">
              <Tabs
                items={connectionTabs}
                activeKey={activeConnectionType}
                onChange={setActiveConnectionType}
                size="small"
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCPDetail;
