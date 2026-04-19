const db = require('../config/db');

const addGameRecord = async (userId, gameName, userMove, aiMove, result, score) => {
    const query = `
        INSERT INTO game_history 
        (user_id, game_name, user_move, ai_move, result, score) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [dbResult] = await db.execute(query, [userId, gameName, userMove, aiMove, result, score]);
    return dbResult;
};

const getGameHistoryByUserId = async (userId) => {
    const query = 'SELECT * FROM game_history WHERE user_id = ? ORDER BY created_at DESC';
    const [rows] = await db.execute(query, [userId]);
    return rows;
};

const updateUserScore = async (userId, scoreDelta) => {
    const query = 'UPDATE scores SET total_score = total_score + ? WHERE user_id = ?';
    const [result] = await db.execute(query, [scoreDelta, userId]);
    return result;
};

const getUserScore = async (userId) => {
    const query = 'SELECT total_score FROM scores WHERE user_id = ?';
    const [rows] = await db.execute(query, [userId]);
    return rows[0] || { total_score: 0 };
};

const getLeaderboard = async () => {
    const query = `
        SELECT u.id, u.name, s.total_score 
        FROM users u 
        JOIN scores s ON u.id = s.user_id 
        ORDER BY s.total_score DESC 
        LIMIT 10
    `;
    const [rows] = await db.execute(query);
    return rows;
};

const initializeUserScore = async (userId) => {
    const query = 'INSERT INTO scores (user_id, total_score) VALUES (?, 0)';
    const [result] = await db.execute(query, [userId]);
    return result;
};

module.exports = {
    addGameRecord,
    getGameHistoryByUserId,
    updateUserScore,
    getUserScore,
    getLeaderboard,
    initializeUserScore
};
