import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, message, Input, Tag, Spin, Descriptions } from 'antd';
import { CopyOutlined, LinkOutlined, ArrowLeftOutlined, FileTextOutlined } from '@ant-design/icons';
import mcpService from '../../services/mcpService';
import './index.css';

const MCPDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [mcpData, setMcpData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMCPDetail = async () => {
      try {
        const data = await mcpService.getMCPDetail(name);
        setMcpData(data);
      } catch (error) {
        message.error('获取 MCP 详情失败: ' + error.message);
        console.error('Error fetching MCP detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMCPDetail();
  }, [name]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('复制成功');
    }).catch(() => {
      message.error('复制失败');
    });
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
              <Tag color={mcpData.type === 'Command' ? 'blue' : 'green'}>
                {mcpData.type}
              </Tag>
              {mcpData.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
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
                <Descriptions.Item label="服务类型">{mcpData.type}</Descriptions.Item>
                <Descriptions.Item label="描述">{mcpData.description}</Descriptions.Item>
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
            <Card title="配置示例" className="usage-card">
              <div className="step-section">
                <h4>MCP 服务器配置</h4>
                <div className="code-block">
                  <Input.TextArea 
                    value={mcpData.configExample}
                    readOnly 
                    autoSize={{ minRows: 8 }}
                  />
                  <Button 
                    icon={<CopyOutlined />} 
                    onClick={() => copyToClipboard(mcpData.configExample)}
                  >
                    复制配置
                  </Button>
                </div>
                <p className="config-tip">
                  将此配置添加到你的 MCP 客户端配置文件中即可使用该服务器。
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCPDetail;
