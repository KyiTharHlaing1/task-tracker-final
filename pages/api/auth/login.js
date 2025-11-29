// 

// 文件: pages/api/auth/login.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // 强制要求 JWT_SECRET 存在
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET 环境变量未设置');
    return res.status(500).json({ message: 'Server misconfiguration: JWT_SECRET missing' });
  }

  try {
    // 查询用户
    const users = await query(
      'SELECT id, email, password, name FROM users WHERE email = ?',
      [email]
    );
    const user = users[0];

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // 验证密码
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 生成 JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 返回用户信息（不包含密码）
    const userPayload = { id: user.id, email: user.email };
    if (user.name) userPayload.name = user.name;

    return res.status(200).json({
      token,
      user: userPayload,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
