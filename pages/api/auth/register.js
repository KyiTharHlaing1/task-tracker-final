// 文件: pages/api/auth/register.js

import bcrypt from 'bcryptjs';
import { query } from '../../../lib/db'; 

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // 🚨 修正：从请求体中解构 name 字段
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email and password are required' });
    }

    try {
        // 1. 检查用户是否已存在
        const existingUsers = await query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }
        
        // 2. 注册新用户
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 🚨 修正：将 name 字段和值添加到 SQL 语句中
        const result = await query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword] 
        );

        return res.status(201).json({ message: 'User registered successfully', userId: result.insertId });

    } catch (error) {
        console.error('Registration error:', error);
        // 如果这里报错，请检查您的数据库 users 表中是否有名为 'name' 的列
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}