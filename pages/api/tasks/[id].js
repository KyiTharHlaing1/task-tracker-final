// 文件: pages/api/tasks/[id].js

import jwt from 'jsonwebtoken';
import { query } from '../../../lib/db'; // ✅ 修复: 使用 query 命名导出

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req, res) {
    const { id } = req.query; // 获取任务 ID

    // 简化认证
    const token = req.headers.authorization?.split(' ')[1];
    // ... (省略认证逻辑，与 index.js 类似) ...
    
    // ... (假设认证成功，获取 userId) ...
    const userId = 1; // 替换为实际的 decoded.userId

    try {
        switch (req.method) {
            case 'GET':
                // ✅ 修复: 直接调用 query 函数获取数据
                const task = await query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
                if (task.length === 0) return res.status(404).json({ message: 'Task not found' });
                return res.status(200).json(task[0]);

            case 'PUT':
                const { title, description, completed } = req.body;
                // ✅ 修复: 直接调用 query 函数执行更新
                const updateResult = await query(
                    'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ? AND user_id = ?',
                    [title, description, completed, id, userId]
                );
                if (updateResult.affectedRows === 0) return res.status(404).json({ message: 'Task not found' });
                return res.status(200).json({ message: 'Task updated' });
                
            case 'DELETE':
                // ✅ 修复: 直接调用 query 函数执行删除
                const deleteResult = await query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
                if (deleteResult.affectedRows === 0) return res.status(404).json({ message: 'Task not found' });
                return res.status(204).end();

            default:
                res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
                return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Single Task API error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}