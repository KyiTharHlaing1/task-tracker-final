import mysql from 'mysql2/promise';

export async function connectDB() {
  // Use local database for development, TiDB Cloud for production
  const connectionConfig = process.env.NODE_ENV === 'production' 
    ? {
        // TiDB Cloud production configuration
        host: process.env.TIDB_HOST,
        port: parseInt(process.env.TIDB_PORT) || 4000,
        user: process.env.TIDB_USER,
        password: process.env.TIDB_PASSWORD,
        database: process.env.TIDB_DATABASE || 'task_manager',
        ssl: {
          rejectUnauthorized: true
        },
        connectTimeout: 60000,
        acquireTimeout: 60000,
        timeout: 60000
      }
    : {
        // Local development configuration
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'task_manager',
        port: 3306
      };

  try {
    const connection = await mysql.createConnection(connectionConfig);
    console.log('Database connected successfully - Environment:', process.env.NODE_ENV);
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    throw error;
  }
}