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

const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB,
    port: process.env.MYSQL_ADDON_PORT
});

db.connect((err) => {
    if (err) {
        console.error("❌ DB Error:", err);
    } else {
        console.log("✅ Clever Cloud MySQL Connected");
    }
});

module.exports = db;