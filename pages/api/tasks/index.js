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

  const connection = await connectDB();

  try {
    switch (req.method) {
      case 'GET':
        // Get all tasks for the user
        const [tasks] = await connection.execute(
          'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
          [user.userId]
        );
        res.status(200).json(tasks);
        break;

      case 'POST':
        // Create new task
        const { title, description, status, priority, due_date } = req.body;
        
        if (!title) {
          return res.status(400).json({ message: 'Task title is required' });
        }

        const [result] = await connection.execute(
          `INSERT INTO tasks (title, description, status, priority, due_date, user_id) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [title, description || '', status || 'pending', priority || 'medium', due_date, user.userId]
        );

        // Get the newly created task
        const [newTask] = await connection.execute(
          'SELECT * FROM tasks WHERE id = ?',
          [result.insertId]
        );

        res.status(201).json(newTask[0]);
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Tasks API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await connection.end();
  }
}