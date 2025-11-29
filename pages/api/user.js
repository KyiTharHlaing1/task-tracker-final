// 文件: pages/api/user.js (最终修正版)

import { query } from '../../lib/db'; 
import { authenticateToken } from '../../lib/auth'; 

export default async function handler(req, res) {
    const decoded = authenticateToken(req);
    if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = decoded.userId;

    try {
        if (req.method !== 'GET') {
            res.setHeader('Allow', ['GET']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
        }

        // 🚨 关键修正：只查询 id 和 name 字段，避免 'username' 错误
        const userData = await query(
            'SELECT id, name FROM users WHERE id = ?', 
            [userId]
        );

        if (userData.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userData[0];
        
        // 增加一个 displayName 字段，供前端显示
        // 如果 name 字段为空 (NULL 或 '')，它将显示 '用户 ID: 1' 作为备选
        const displayName = user.name || `用户 ID: ${user.id}`; 

        // 返回数据
        return res.status(200).json({
            id: user.id,
            name: user.name, // 实际的 name 字段值
            displayName: displayName // 👈 前端应该使用这个字段来显示名字
        });
    } catch (error) {
        console.error('User API error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}