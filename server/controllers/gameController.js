const aiService = require('../services/aiService');
const gameLogicService = require('../services/gameLogicService');
const gameModel = require('../models/gameModel');

// @desc    Play a game against AI or record a generic frontend game result
// @route   POST /api/game/play
// @access  Private
const playGame = async (req, res) => {
    try {
        const { game = 'rps', user_move } = req.body;

        const validGames = ['rps', 'tic_tac_toe', 'memory_game', 'quiz_game', 'swg', 'number_guessing'];
        if (!validGames.includes(game)) {
            return res.status(400).json({ message: 'Unsupported game type.' });
        }

        if (!user_move) {
            return res.status(400).json({ message: 'Missing user_move parameter.' });
        }

        // Get AI move via the service that prepares for external Python hook (or returns N/A)
        const aiMove = await aiService.getExternalAIMove(user_move, game);

        // Process Game Logic
        const { result, score } = gameLogicService.processGame(game, user_move, aiMove);

        // Save game history
        await gameModel.addGameRecord(req.user.id, game, user_move, aiMove, result, score);

        // Update user's total score
        await gameModel.updateUserScore(req.user.id, score);

        res.json({
            game_played: game,
            ai_move: aiMove,
            result,
            score_awarded: score
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while playing game' });
    }
};

// @desc    Get an AI move without saving to the database (for multi-turn games like TTT)
// @route   POST /api/game/ai-move
// @access  Private
const getAiMoveOnly = async (req, res) => {
    try {
        const { game, user_move } = req.body;

        const validGames = ['rps', 'tic_tac_toe', 'memory_game', 'quiz_game', 'swg', 'number_guessing'];
        if (!validGames.includes(game)) {
            return res.status(400).json({ message: 'Unsupported game type.' });
        }

        // Get AI move
        const aiMove = await aiService.getExternalAIMove(user_move, game);

        res.json({
            game_played: game,
            ai_move: aiMove
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while generating AI move' });
    }
};

// @desc    Get logged in user's game history
// @route   GET /api/game/history
// @access  Private
const getHistory = async (req, res) => {
    try {
        const history = await gameModel.getGameHistoryByUserId(req.user.id);
        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching history' });
    }
};

// @desc    Get logged in user's total score
// @route   GET /api/game/score
// @access  Private
const getScore = async (req, res) => {
    try {
        const scoreData = await gameModel.getUserScore(req.user.id);
        res.json(scoreData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching score' });
    }
};

// @desc    Get top 10 leaderboard
// @route   GET /api/game/leaderboard
// @access  Public or Private
const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await gameModel.getLeaderboard();
        res.json(leaderboard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching leaderboard' });
    }
};

module.exports = {
    playGame,
    getAiMoveOnly,
    getHistory,
    getScore,
    getLeaderboard
};
