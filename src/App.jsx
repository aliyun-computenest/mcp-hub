import React, { useEffect, useState } from 'react';
import { Layout, Spin, Alert } from 'antd';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MCPList from './components/MCPList';
import MCPDetail from './components/MCPDetail';
import { SERVER_CONFIG } from './config/serverConfig.js';
import './styles/App.css';

const { Header, Content } = Layout;

const App = () => {
  const [configLoaded, setConfigLoaded] = useState(false);
  const [configError, setConfigError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 初始化配置
    const initConfig = async () => {
      try {
        await SERVER_CONFIG.init();
        console.log('Configuration loaded successfully');
        setConfigLoaded(true);
      } catch (error) {
        console.error('Failed to load configuration:', error);
        setConfigError(error.message);
        // 即使配置加载失败，也继续运行，使用默认配置
        setConfigLoaded(true);
      } finally {
        setLoading(false);
      }
    };

    initConfig();
  }, []);

  // 加载中状态
  if (loading) {
    return (
        <Layout className="layout">
          <Header className="header">
            <div className="logo">
              <span className="logo-icon">∞</span>
              <span className="logo-text">MCP Registry</span>
            </div>
          </Header>
          <Content className="content">
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '400px',
              flexDirection: 'column'
            }}>
              <Spin size="large" />
              <p style={{ marginTop: '16px', color: '#666' }}>
                正在加载配置...
              </p>
            </div>
          </Content>
        </Layout>
    );
  }

  return (
      <HashRouter>
        <Layout className="layout">
          <Header className="header">
            <div className="logo">
              <span className="logo-icon">∞</span>
              <span className="logo-text">MCP Registry</span>
            </div>
          </Header>
          <Content className="content">
            {/* 配置错误提示 */}
            {configError && (
                <Alert
                    message="配置加载警告"
                    description={`配置加载失败: ${configError}，正在使用默认配置。`}
                    type="warning"
                    showIcon
                    closable
                    style={{ marginBottom: '16px' }}
                />
            )}

            <Routes>
              <Route path="/" element={
                <>
                  <div className="page-header">
                    <h1>Nacos MCP Registry</h1>
                    <p className="subtitle">
                      支持私有化部署，共建和兼容 MCP Registry 官方协议，具备更多管理能力，支持自动注册、智能路由的 MCP Registry
                    </p>
                  </div>
                  <MCPList />
                </>
              } />
              <Route path="/detail/:name" element={<MCPDetail />} />
            </Routes>
          </Content>
        </Layout>
      </HashRouter>
  );
};

export default App;
