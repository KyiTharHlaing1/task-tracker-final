// 简单的健康检查端点
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development'
  });
}