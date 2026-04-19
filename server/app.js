require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');

const app = express();
const dbStatusPagePath = path.join(__dirname, '..', 'database-connection-status.html');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/api/health/db', (req, res) => {
    db.query('SELECT 1 AS ok', (err) => {
        if (err) {
            return res.status(503).json({
                ok: false,
                message: 'Database not reachable from the API',
                error: err.message
            });
        }
        res.json({
            ok: true,
            message: 'Database connection successful',
            timestamp: new Date().toISOString()
        });
    });
});

app.get('/database-connection-status.html', (req, res) => {
    res.sendFile(dbStatusPagePath);
});

// Show the DB check page on the base URL for Render users.
app.get('/', (req, res) => {
    res.sendFile(dbStatusPagePath);
});

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

// Error Handling Middleware (fallback)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;

// Local / traditional hosting only (not used on Vercel serverless)
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}
