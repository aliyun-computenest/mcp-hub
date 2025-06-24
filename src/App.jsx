import React from 'react';
import { Layout } from 'antd';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MCPList from './components/MCPList';
import MCPDetail from './components/MCPDetail';
import './styles/App.css';

const { Header, Content } = Layout;

const App = () => {
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
          <Routes>
            <Route path="/" element={
              <>
                <div className="page-header">
                  <h1>Nacos MCP Registry</h1>
                  <p className="subtitle">支持私有化部署，共建和兼容 MCP Registry 官方协议，具备更多管理能力，支持自动注册、智能路由的 MCP Registry</p>
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
