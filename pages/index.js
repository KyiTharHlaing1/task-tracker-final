// 文件: pages/api/tasks/index.js

import jwt from 'jsonwebtoken';
import { query } from '../../../lib/db'; // ✅ 修复: 使用 query 命名导出

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req, res) {
    // 简化认证: 确保用户已登录
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    const userId = decoded.userId;

    try {
        switch (req.method) {
            case 'GET':
                // ✅ 修复: 直接调用 query 函数获取数据
                const tasks = await query('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [userId]);
                return res.status(200).json(tasks);

            case 'POST':
                const { title, description } = req.body;
                // ✅ 修复: 直接调用 query 函数执行插入
                const result = await query(
                    'INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)',
                    [userId, title, description]
                );
                return res.status(201).json({ id: result.insertId, title, description, user_id: userId });

            default:
                res.setHeader('Allow', ['GET', 'POST']);
                return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Task API error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}