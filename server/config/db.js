// const mysql = require('mysql2/promise');
// require('dotenv').config();

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT || 3306
// });

// pool.getConnection()
//     .then(connection => {
//         console.log('Successfully connected to the MySQL database.');
//         connection.release();
//     })
//     .catch(err => {
//         console.error('Error connecting to MySQL:', err.message);
//     });

// module.exports = pool;

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_USER || process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_PASSWORD || process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_DATABASE || process.env.MYSQL_ADDON_DB,
    port: Number(process.env.MYSQL_PORT || process.env.MYSQL_ADDON_PORT || 3306),
    waitForConnections: true,
    connectionLimit: Number(process.env.MYSQL_POOL_SIZE || 10),
    queueLimit: 0
});

// Quick startup check (won't crash server if DB is down)
pool.getConnection()
    .then((conn) => {
        console.log('✅ MySQL pool connected');
        conn.release();
    })
    .catch((err) => {
        console.error('❌ DB Error:', err.message);
    });

module.exports = pool;