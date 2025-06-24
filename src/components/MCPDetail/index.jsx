import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, message, Input } from 'antd';
import { CopyOutlined, LinkOutlined } from '@ant-design/icons';
import './index.css';

const MCPDetail = () => {
  const { name } = useParams();
  const [mcpData, setMcpData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMCPDetail = async () => {
      try {
        // 模拟API调用
        const mockData = {
          name: 'Context7',
          createTime: '2025.04.29 更新',
          description: 'Context7 是接从源码中提取真实可用的代码示例、特定版本的文档和示例。',
          icon: '📚',
          sourceUrl: 'https://github.com/upstash/context7',
          features: [
            '获取最新、版本特定的文档',
            '从源码中提取真实可用的代码示例',
            '提供简洁、相关的信息，无冗余内容',
            '支持个人免费使用',
            '与MCP服务器和工具集成'
          ],
          sseUrl: 'https://mcp.higrass.ai/mcp-context7/cmcBokvzeN03mOv01lab331vm/sse'
        };

        await new Promise(resolve => setTimeout(resolve, 1000));
        setMcpData(mockData);
      } catch (error) {
        message.error('获取 MCP 详情失败');
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

  if (loading || !mcpData) {
    return <div className="loading">加载中...</div>;
  }

  const configExample = `{
  "mcpServers": {
    "mcp-context7": {
      "url": "${mcpData.sseUrl}"
    }
  }
}`;

  return (
    <div className="mcp-detail-container">
      <div className="detail-header">
        <div className="header-icon">{mcpData.icon}</div>
        <div className="header-content">
          <h1>{mcpData.name} MCP Server</h1>
          <p className="update-time">{mcpData.createTime}</p>
        </div>
      </div>

      <div className="detail-content">
        <div className="overview-section">
          <div className="overview-left">
            <Card title="功能" className="feature-card">
              <ul className="feature-list">
                {mcpData.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </Card>
            
            <Card title="源码地址" className="source-card">
              <a href={mcpData.sourceUrl} target="_blank" rel="noopener noreferrer" className="source-link">
                <LinkOutlined /> {mcpData.sourceUrl}
              </a>
            </Card>
          </div>

          <div className="overview-right">
            <Card title="使用 URL 连接 MCP Server" className="usage-card">
              <div className="step-section">
                <h4>通过 SSE 访问 URL</h4>
                <div className="code-block">
                  <Input.TextArea 
                    value={configExample}
                    readOnly 
                    autoSize={{ minRows: 8 }}
                  />
                  <Button 
                    icon={<CopyOutlined />} 
                    onClick={() => copyToClipboard(configExample)}
                  >
                    复制
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCPDetail;
