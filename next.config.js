/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    
    // 🌟 核心修复：启用 Standalone 模式以解决 Windows EPERM 错误
    output: 'standalone', 

    // 确保 Next.js 在构建 Serverless Function 时能够找到根目录
    outputFileTracingRoot: require('path').join(__dirname, './'), 
};

module.exports = nextConfig;