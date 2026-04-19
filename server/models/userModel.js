const db = require('../config/db');

const createUser = async (name, email, hashedPassword) => {
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const [result] = await db.execute(query, [name, email, hashedPassword]);
    return result;
};

const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0];
};

const findUserById = async (id) => {
    const query = 'SELECT id, name, email, created_at FROM users WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById
};
