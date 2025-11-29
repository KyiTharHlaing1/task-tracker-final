// import mysql from 'mysql2/promise';

// export async function connectDB() {
//   // Use local database for development, TiDB Cloud for production
//   const connectionConfig = process.env.NODE_ENV === 'production' 
//     ? {
//         // TiDB Cloud production configuration
//         host: process.env.TIDB_HOST,
//         port: parseInt(process.env.TIDB_PORT) || 4000,
//         user: process.env.TIDB_USER,
//         password: process.env.TIDB_PASSWORD,
//         database: process.env.TIDB_DATABASE || 'task_manager',
//         ssl: {
//           rejectUnauthorized: true
//         },
//         connectTimeout: 60000,
//         acquireTimeout: 60000,
//         timeout: 60000
//       }
//     : {
//         // Local development configuration
//         host: 'localhost',
//         user: 'root',
//         password: '',
//         database: 'task_manager',
//         port: 3306
//       };

//   try {
//     const connection = await mysql.createConnection(connectionConfig);
//     console.log('Database connected successfully - Environment:', process.env.NODE_ENV);
//     return connection;
//   } catch (error) {
//     console.error('Database connection failed:', error.message);
//     throw error;
//   }
// }

import mysql from 'mysql2/promise';

// 使用 globalThis 存储连接池，确保在 Next.js 的热重载和 Serverless 环境中只创建一次。
const globalForDB = globalThis;

// 定义您的连接池对象，供应用使用
const pool = 
  globalForDB.dbPool || 
  (process.env.NODE_ENV === 'production' 
    ? mysql.createPool({
        // ---------------- TiDB Cloud Production Configuration ----------------
        host: process.env.TIDB_HOST,
        port: parseInt(process.env.TIDB_PORT) || 4000,
        user: process.env.TIDB_USER,
        password: process.env.TIDB_PASSWORD,
        database: process.env.TIDB_DATABASE || 'task_manager',
        
        // ⭐ 优化 1: 使用连接池而非单个连接
        connectionLimit: 1, // 针对 Vercel Serverless Function 推荐设置为 1
        waitForConnections: true,
        
        // ⭐ 优化 2: TiDB 要求的 SSL/TLS 配置
        ssl: {
          minVersion: 'TLSv1.2', // 确保使用 TLS v1.2 或更高版本
          rejectUnauthorized: process.env.TIDB_SSL_REJECT_UNAUTHORIZED === 'true', 
        },
        
        // 建议从连接配置中移除超时的设置 (connectTimeout/acquireTimeout/timeout)，
        // 让 mysql2 和 Serverless Function 运行时来处理。
      })
    : mysql.createPool({
        // ---------------- Local Development (XAMPP) Configuration ----------------
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'task_manager',
        port: 3306,
        connectionLimit: 10, // 本地开发可以使用更高的限制
      }));

// 在非生产环境下，将连接池挂载到 globalThis，以防止 Next.js 热重载重复创建
if (process.env.NODE_ENV !== 'production') {
  globalForDB.dbPool = pool;
}

/**
 * 封装查询函数
 * @param {string} sql - SQL query string
 * @param {Array<any>} [params] - Parameters for the query
 * @returns {Promise<any>}
 */
export async function query(sql, params) {
  try {
    // 使用 pool.query 或 pool.execute 来执行查询
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  }
}

// 导出连接池本身，以便在某些高级场景中使用
export default pool;