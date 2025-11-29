/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // 🚨 移除这两行 - Vercel 不支持 standalone 模式
    // output: 'standalone',
    // outputFileTracingRoot: require('path').join(__dirname, './'), 
};

module.exports = nextConfig;