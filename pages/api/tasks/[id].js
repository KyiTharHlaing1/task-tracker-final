import { connectDB } from '../../../lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function authenticateToken(req) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return null;
  }
  
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;
  const connection = await connectDB();

  try {
    switch (req.method) {
      case 'PUT':
        // Update task
        const { title, description, status, priority, due_date } = req.body;
        
        const [updateResult] = await connection.execute(
          `UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ? 
           WHERE id = ? AND user_id = ?`,
          [title, description, status, priority, due_date, id, user.userId]
        );

        if (updateResult.affectedRows === 0) {
          return res.status(404).json({ message: 'Task not found' });
        }

        // Get updated task
        const [updatedTask] = await connection.execute(
          'SELECT * FROM tasks WHERE id = ?',
          [id]
        );

        res.status(200).json(updatedTask[0]);
        break;

      case 'DELETE':
        // Delete task
        const [deleteResult] = await connection.execute(
          'DELETE FROM tasks WHERE id = ? AND user_id = ?',
          [id, user.userId]
        );

        if (deleteResult.affectedRows === 0) {
          return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Task API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await connection.end();
  }
}