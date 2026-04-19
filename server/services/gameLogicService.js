const determineRPSResult = (userMove, aiMove) => {
    if (userMove === aiMove) return 'draw';

    if (
        (userMove === 'rock' && aiMove === 'scissors') ||
        (userMove === 'paper' && aiMove === 'rock') ||
        (userMove === 'scissors' && aiMove === 'paper')
    ) {
        return 'win';
    }
    return 'lose';
};

const calculateRPSScore = (result) => {
    if (result === 'win') return 1;
    if (result === 'draw') return 0;
    return -1;
};

const determineSWGResult = (userMove, aiMove) => {
    if (userMove === aiMove) return 'draw';
    
    if (
        (userMove === 'snake' && aiMove === 'water') ||
        (userMove === 'water' && aiMove === 'gun') ||
        (userMove === 'gun' && aiMove === 'snake')
    ) {
        return 'win';
    }
    return 'lose';
};

const calculateSWGScore = (result) => {
    if (result === 'win') return 1;
    if (result === 'draw') return 0;
    return -1;
};

const processGame = (gameType, userMove, aiMove) => {
    if (gameType === 'rps') {
        const result = determineRPSResult(userMove, aiMove);
        const score = calculateRPSScore(result);
        return { result, score };
    }

    if (gameType === 'swg') {
        const result = determineSWGResult(userMove, aiMove);
        const score = calculateSWGScore(result);
        return { result, score };
    }
     if (gameType === 'tic_tac_toe') {
        // TTT result processing happens externally on the UI since it's multi-turn.
        // We only expect 'win', 'lose', or 'draw' as the ultimate final userMove when saving score.
        const result = ['win', 'lose', 'draw'].includes(userMove) ? userMove : 'draw';
        const score = result === 'win' ? 5 : (result === 'draw' ? 0 : -5);
        return { result, score };
    }

    if (gameType === 'memory_game') {
        // userMove is time (lower is better), aiMove is AI's time
        const u = parseInt(userMove, 10);
        const a = parseInt(aiMove, 10);
        let result;
        if (isNaN(u)) {
            result = 'lose';
        } else if (u < a) {
            result = 'win';
        } else if (u === a) {
            result = 'draw';
        } else {
            result = 'lose';
        }

        const score = result === 'win' ? 5 : (result === 'draw' ? 1 : 0);
        return { result, score };
    }

    if (gameType === 'quiz_game') {
        const result = ['win', 'lose'].includes(userMove) ? userMove : 'lose';
        const score = result === 'win' ? 2 : -2;
        return { result, score };
    }

    if (gameType === 'number_guessing') {
        const result = ['win', 'lose'].includes(userMove) ? userMove : 'lose';
        const score = result === 'win' ? 1 : -1;
        return { result, score };
    }

    throw new Error(`Unsupported game type: ${gameType}`);
};

module.exports = {
    processGame,
    determineRPSResult,
    calculateRPSScore,
    determineSWGResult,
    calculateSWGScore
};
