module.exports = {
  apps: [{
    name: 'mcp-registry-viewer',
    script: 'npm',
    args: 'run dev',
    cwd: process.cwd(),
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
