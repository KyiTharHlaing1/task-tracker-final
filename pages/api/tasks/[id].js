// 文件: pages/api/tasks/[id].js

import { query } from '../../../lib/db'; // ✅ 修复: 使用 query 命名导出
import { authenticateToken } from '../../../lib/auth';

export default async function handler(req, res) {
    const { id } = req.query; // 获取任务 ID
        const decoded = authenticateToken(req);
        if (!decoded) return res.status(401).json({ message: 'Unauthorized' });
        const userId = decoded.userId;

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