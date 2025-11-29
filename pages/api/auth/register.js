// 文件: pages/api/auth/register.js

import bcrypt from 'bcryptjs';
import { query } from '../../../lib/db'; // ✅ 修复: 使用 query 命名导出

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // 1. 检查用户是否已存在
        const existingUsers = await query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }
        
        // 2. 注册新用户
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // ✅ 修复: 直接调用 query 函数执行插入
        const result = await query(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashedPassword]
        );

        return res.status(201).json({ message: 'User registered successfully', userId: result.insertId });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}