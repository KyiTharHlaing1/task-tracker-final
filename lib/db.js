// 文件: lib/db.js

import mysql from 'mysql2/promise';

// 使用 globalThis 存储连接池，确保在 Next.js 的热重载和 Serverless 环境中只创建一次。
const globalForDB = globalThis;

// 根据环境配置连接参数
const connectionConfig = (process.env.NODE_ENV === 'production' && process.env.TIDB_HOST)
    ? {
        // TiDB Cloud Production Configuration
        host: process.env.TIDB_HOST,
        port: parseInt(process.env.TIDB_PORT || '4000', 10),
        user: process.env.TIDB_USER,
        password: process.env.TIDB_PASSWORD,
        database: process.env.TIDB_DATABASE || 'task_manager',
        
        // ⭐ 针对 Vercel Serverless Function 的优化
        connectionLimit: 1, 
        waitForConnections: true,
        
        // ⭐ TiDB 要求的 SSL/TLS 配置
        ssl: {
          minVersion: 'TLSv1.2', 
          rejectUnauthorized: process.env.TIDB_SSL_REJECT_UNAUTHORIZED === 'true', 
        },
      }
    : {
        // Local Development Configuration
        host: process.env.LOCAL_DB_HOST || 'localhost',
        user: process.env.LOCAL_DB_USER || 'root',
        password: process.env.LOCAL_DB_PASSWORD || '',
        database: process.env.LOCAL_DB_DATABASE || 'task_manager',
        port: 3306,
        connectionLimit: 10, 
      };

// 创建或重用连接池
const pool = globalForDB.dbPool || mysql.createPool(connectionConfig);

// 确保在开发环境下，连接池不会因热重载而重复创建
if (process.env.NODE_ENV !== 'production') globalForDB.dbPool = pool;

/**
 * 封装查询函数：API 路由应该调用这个函数
 * @param {string} sql - SQL query string
 * @param {Array<any>} [params] - Parameters for the query
 * @returns {Promise<any>}
 */
export async function query(sql, params) {
  try {
    // 使用 pool.execute 来执行带参数的查询
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// 导出连接池本身 (可选, 以备高级用途)
export default pool;