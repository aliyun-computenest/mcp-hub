import React, { useState, useEffect } from 'react';
import { Input, Card, message, Tooltip, Tag, Spin } from 'antd';
import { SearchOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import mcpService from '../../services/mcpService';
import './index.css';

const { Search } = Input;

const MCPList = () => {
  const [mcpList, setMcpList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const fetchMCPList = async () => {
    try {
      setLoading(true);
      console.log('MCPList: 开始获取数据...');
      const data = await mcpService.getMCPList();
      console.log('MCPList: 获取到数据:', data);
      setMcpList(data);
    } catch (error) {
      console.error('MCPList: 获取数据失败:', error);
      message.error('获取 MCP 列表失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMCPList();
  }, []);

  const filteredMCPs = mcpList.filter(mcp => 
    mcp.name.toLowerCase().includes(searchText.toLowerCase()) ||
    mcp.description.toLowerCase().includes(searchText.toLowerCase()) ||
    mcp.author.toLowerCase().includes(searchText.toLowerCase()) ||
    mcp.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="mcp-container">
        <div className="loading-container">
          <Spin size="large" />
          <p>正在加载 MCP 服务器列表...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mcp-container">
      <div className="search-container">
        <Search
          placeholder="搜索 MCP 服务器（支持名称、描述、作者、标签）"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="mcp-stats">
        最新 MCP Servers: {mcpList.length} {filteredMCPs.length !== mcpList.length && `(筛选结果: ${filteredMCPs.length})`}
      </div>

      <div className="mcp-cards">
        {filteredMCPs.map(mcp => (
          <Card
            key={mcp.serverCode}
            className="mcp-card"
            onClick={() => navigate(`/detail/${mcp.serverCode}`)}
          >
            <div className="mcp-card-header">
              <span className="mcp-icon">
                {typeof mcp.icon === 'string' && mcp.icon.startsWith('http') ? (
                  <img src={mcp.icon} alt={mcp.name} className="mcp-icon-img" />
                ) : (
                  mcp.icon
                )}
              </span>
              <div className="mcp-title">
                <h3>{mcp.name}</h3>
                {mcp.author && (
                  <div className="mcp-author">
                    <UserOutlined /> {mcp.author}
                  </div>
                )}
              </div>
            </div>
            <p className="mcp-description">{mcp.description}</p>
            
            {mcp.tags && mcp.tags.length > 0 && (
              <div className="mcp-tags">
                {mcp.tags.slice(0, 3).map(tag => (
                  <Tag key={tag} size="small">{tag}</Tag>
                ))}
                {mcp.tags.length > 3 && <Tag size="small">+{mcp.tags.length - 3}</Tag>}
              </div>
            )}
            
            <div className="mcp-meta">
              <Tooltip title="服务类型">
                <Tag color={mcp.type === 'Command' ? 'blue' : 'green'}>
                  {mcp.type}
                </Tag>
              </Tooltip>
              <Tooltip title="更新时间">
                <span className="meta-item">
                  <ClockCircleOutlined /> {mcp.createTime}
                </span>
              </Tooltip>
            </div>
          </Card>
        ))}
      </div>
      
      {filteredMCPs.length === 0 && !loading && (
        <div className="empty-state">
          <p>没有找到匹配的 MCP 服务器</p>
        </div>
      )}
    </div>
  );
};

export default MCPList;
