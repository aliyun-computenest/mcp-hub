import React, { useState, useEffect } from 'react';
import { Input, Card, message, Tooltip } from 'antd';
import { SearchOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
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
      const mockData = [
        {
          name: 'SnowFlake',
          createTime: '2025.06.06 更新',
          description: '该 MCP 服务器使大型语言模型（LLMs）能够与 SnowFlake 数据库进行交互，实现安全、可控的数据操作。',
          icon: '❄️',
          tools: [
            {
              name: "DeepChat",
              icon: "https://example.com/deepchat.png",
              installable: true,
              officialLink: "https://example.com/deepchat"
            },
            {
              name: "Cherry Studio",
              icon: "https://example.com/cherry.png",
              installable: true,
              officialLink: "https://example.com/cherry"
            }
          ]
        },
        {
          name: 'langflow-doc-qa-server',
          createTime: '2025.06.06 更新',
          description: '一个基于 Langflow 的文档问答模型上下文协议（MCP）服务器，它通过提供一个简单的接口以通过 Langflow 流程查询文档，从而弥补了你的 MCP 服务。',
          icon: '📚',
          tools: [
            {
              name: "LobeChat",
              icon: "https://example.com/lobe.png",
              installable: false,
              officialLink: "https://example.com/lobe"
            }
          ]
        }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMcpList(mockData);
    } catch (error) {
      message.error('获取 MCP 列表失败');
      console.error('Error fetching MCP list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMCPList();
  }, []);

  const filteredMCPs = mcpList.filter(mcp => 
    mcp.name.toLowerCase().includes(searchText.toLowerCase()) ||
    mcp.description.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="mcp-container">
      <div className="search-container">
        <Search
          placeholder="请输入内容"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="mcp-stats">
        最新 MCP Servers: {mcpList.length}
      </div>

      <div className="mcp-cards">
        {filteredMCPs.map(mcp => (
          <Card
            key={mcp.name}
            className="mcp-card"
            onClick={() => navigate(`/detail/${mcp.name}`)}
          >
            <div className="mcp-card-header">
              <span className="mcp-icon">{mcp.icon}</span>
              <div className="mcp-title">
                <h3>{mcp.name}</h3>
              </div>
            </div>
            <p className="mcp-description">{mcp.description}</p>
            <div className="mcp-meta">
              <Tooltip title="更新时间">
                <span className="meta-item">
                  <ClockCircleOutlined /> {mcp.createTime}
                </span>
              </Tooltip>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MCPList;
