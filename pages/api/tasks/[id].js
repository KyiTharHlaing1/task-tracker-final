// 文件: pages/api/tasks/[id].js - 最终完整版

import { query } from '../../../lib/db'; 
import { authenticateToken } from '../../../lib/auth';

export default async function handler(req, res) {
    const { id } = req.query; // 获取任务 ID
    
    // --- 认证检查 ---
    const decoded = authenticateToken(req);
    if (!decoded) return res.status(401).json({ message: 'Unauthorized' });
    const userId = decoded.userId;

    try {
        switch (req.method) {
            case 'GET':
                // 获取单个任务
                const task = await query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
                if (task.length === 0) return res.status(404).json({ message: 'Task not found' });
                return res.status(200).json(task[0]);

            case 'PUT':
                // 1. 获取请求体中的所有潜在字段
                // 包含了您提到的 Status, Priority, Due Date
                const { 
                    title, 
                    description, 
                    completed, 
                    status, 
                    priority, 
                    due_date 
                } = req.body;
                
                // 2. 初始化动态构建的数组
                const fieldsToUpdate = [];
                const bindParams = [];
                
                // 3. 检查每个字段，如果存在 (非 undefined) 则加入更新列表
                
                if (title !== undefined) {
                    fieldsToUpdate.push('title = ?');
                    bindParams.push(title);
                }
                
                if (description !== undefined) {
                    fieldsToUpdate.push('description = ?');
                    bindParams.push(description);
                }
                
                if (completed !== undefined) {
                    fieldsToUpdate.push('completed = ?');
                    bindParams.push(completed);
                }

                if (status !== undefined) {
                    fieldsToUpdate.push('status = ?');
                    bindParams.push(status);
                }

                if (priority !== undefined) {
                    fieldsToUpdate.push('priority = ?');
                    bindParams.push(priority);
                }
                
                if (due_date !== undefined) {
                    fieldsToUpdate.push('due_date = ?');
                    // 注意：如果 due_date 字段在数据库允许 NULL，
                    // 前端发送 null 或空字符串时，我们直接传递它。
                    // 如果您确定 due_date 必须是日期类型，可能需要进行额外的格式验证。
                    bindParams.push(due_date);
                }


                // 4. 如果请求体中没有有效字段，则报错
                if (fieldsToUpdate.length === 0) {
                    return res.status(400).json({ message: 'No fields provided for update.' });
                }

                // 5. 动态拼接 SQL 语句
                const sql = `UPDATE tasks SET ${fieldsToUpdate.join(', ')} WHERE id = ? AND user_id = ?`;
                
                // 将任务 ID 和用户 ID 添加到参数列表的末尾
                bindParams.push(id, userId);

                // 6. 执行更新
                const updateResult = await query(sql, bindParams);

                if (updateResult.affectedRows === 0) {
                    return res.status(404).json({ message: 'Task not found or unauthorized' });
                }
                return res.status(200).json({ message: 'Task updated' });
            
            case 'DELETE':
                // 删除任务
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