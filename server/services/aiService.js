// Local fallback logic
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const checkWin = (board) => {
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
        const [a, b, c] = WINNING_COMBINATIONS[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    if (!board.includes(null) && !board.includes('')) return 'Draw';
    return null;
};

const minimax = (board, depth, isMaximizing, aiPlayer, humanPlayer) => {
    const result = checkWin(board);
    if (result === aiPlayer) return 10 - depth;
    if (result === humanPlayer) return depth - 10;
    if (result === 'Draw') return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null || board[i] === '') {
                board[i] = aiPlayer;
                let score = minimax(board, depth + 1, false, aiPlayer, humanPlayer);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null || board[i] === '') {
                board[i] = humanPlayer;
                let score = minimax(board, depth + 1, true, aiPlayer, humanPlayer);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
};

const getBiasedAIMove = (userMove, userWinningRule, aiWinningRule) => {
    // 60%: choose move that lets user win, 40%: choose move that lets AI win.
    // This avoids repeated draws when userMove is valid.
    return Math.random() < 0.6 ? userWinningRule[userMove] : aiWinningRule[userMove];
};

const getAiMove = (gameType, userMove = null) => {
    if (gameType === 'number_guessing') {
        return Math.floor(Math.random() * 100) + 1;
    }

    if (gameType === 'swg') {
        const userWinningRule = {
            snake: 'water',
            water: 'gun',
            gun: 'snake'
        };
        const aiWinningRule = {
            snake: 'gun',
            water: 'snake',
            gun: 'water'
        };

        if (userMove && userWinningRule[userMove] && aiWinningRule[userMove]) {
            return getBiasedAIMove(userMove, userWinningRule, aiWinningRule);
        }

        const moves = ['snake', 'water', 'gun'];
        const randomIndex = Math.floor(Math.random() * moves.length);
        return moves[randomIndex];
    }

    if (gameType === 'rps') {
        const userWinningRule = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };
        const aiWinningRule = {
            rock: 'paper',
            paper: 'scissors',
            scissors: 'rock'
        };

        if (userMove && userWinningRule[userMove] && aiWinningRule[userMove]) {
            return getBiasedAIMove(userMove, userWinningRule, aiWinningRule);
        }

        const moves = ['rock', 'paper', 'scissors'];
        const randomIndex = Math.floor(Math.random() * moves.length);
        return moves[randomIndex];
    }

    if (gameType === 'quiz_game') {
        return 'N/A';
    }

    if (gameType === 'memory_game') {
        // AI generates a completion time between 30 and 120 seconds
        return Math.floor(Math.random() * 91) + 30;
    }

    if (gameType === 'tic_tac_toe') {
        try {
            // Expect userMove to be a JSON string of length 9 array. e.g. '["X","O",null, ...]'
            let board;
            if (typeof userMove === 'string') {
                board = JSON.parse(userMove);
            } else {
                board = userMove;
            }

            if (!Array.isArray(board) || board.length !== 9) {
                return 'Invalid Board';
            }

            // Find all empty spots
            const emptyIndices = [];
            board.forEach((val, idx) => {
                if (val === null || val === '') emptyIndices.push(idx);
            });

            if (emptyIndices.length === 0) return 'Board Full';

            const aiPlayer = 'O';
            const humanPlayer = 'X';
            let bestScore = -Infinity;
            let move = null;

            // In TTT, check if board is completely empty for a fast first move
            if (emptyIndices.length === 9) {
                return Math.floor(Math.random() * 9); // random corner/center would be better but random is fine for empty board
            }

            for (let i = 0; i < board.length; i++) {
                if (board[i] === null || board[i] === '') {
                    board[i] = aiPlayer;
                    let score = minimax(board, 0, false, aiPlayer, humanPlayer);
                    board[i] = null;
                    if (score > bestScore) {
                        bestScore = score;
                        move = i;
                    }
                }
            }

            return move;
        } catch (error) {
            console.error('Error parsing tic-tac-toe board for AI move', error);
            return 'Error';
        }
    }

    return 'N/A';
};

// Placeholder for future Python AI API Service integration
const getExternalAIMove = async (userMove, gameType) => {
    try {
        // Example logic for the future:
        // const response = await axios.post('http://python-ai-service/api/move', { userMove, gameType });
        // return response.data.aiMove;

        // Currently throwing to fall back to local logic
        throw new Error('Python AI service not yet implemented');
    } catch (error) {
        // console.warn('External AI failed, falling back to simple logic.');
        return getAiMove(gameType, userMove);
    }
};

module.exports = {
    getAiMove,
    getExternalAIMove
};
